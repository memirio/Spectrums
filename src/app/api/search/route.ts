import { NextRequest, NextResponse } from 'next/server'
import { embedTextBatch } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { hasOppositeTags } from '@/lib/concept-opposites'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const debug = searchParams.get('debug') === '1'
    const zeroShot = searchParams.get('ZERO_SHOT') !== 'false' // default true
    if (!q.trim()) return NextResponse.json({ images: [] })

    if (zeroShot) {
      // Zero-shot CLIP search: embed whole query, rank by cosine similarity
      const [queryVec] = await embedTextBatch([q.trim()])
      const dim = queryVec.length
      const images = await (prisma.image.findMany as any)({
        where: { embedding: { isNot: null } },
        include: { embedding: true, site: true },
      })
      
      if (debug) {
        // Debug mode: pure cosine ranking only, no tag boosting, no concept expansion
        const ranked = [] as Array<{
          imageId: string
          siteUrl: string
          score: number
          contentHash: string | null
          model: string
        }>
        for (const img of images as any[]) {
          const ivec = (img.embedding?.vector as unknown as number[]) || []
          if (ivec.length !== dim) continue
          const score = cosine(queryVec, ivec)
          ranked.push({
            imageId: img.id,
            siteUrl: img.site?.url || '',
            score,
            contentHash: (img.embedding?.contentHash as string | null) || null,
            model: img.embedding?.model || '',
          })
        }
        ranked.sort((a, b) => b.score - a.score)
        return NextResponse.json({
          query: q,
          mode: 'debug',
          images: ranked.slice(0, 60),
        })
      }
      
      // Normal mode: zero-shot with subtle concept boost
      // 1. Parse query terms to match against seeded concepts
      const queryTerms = q.split(/[,+\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean)
      const concepts = await prisma.concept.findMany()
      
      // 2. Find concepts that match query terms (by id, label, or synonyms)
      // Use explicit synonyms only - no partial matching
      const matchedConceptIds = new Set<string>()
      // Build a map of concept ID -> synonyms for bidirectional synonym matching
      const conceptSynonymsMap = new Map<string, Set<string>>()
      for (const c of concepts) {
        const synonyms = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
        conceptSynonymsMap.set(c.id, new Set(synonyms))
      }
      
      for (const term of queryTerms) {
        for (const c of concepts) {
          const conceptId = c.id.toLowerCase()
          const label = c.label.toLowerCase()
          const synonyms = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
          
          // Exact match only - no partial matching (synonyms should cover word variations)
          if (conceptId === term || label === term || synonyms.includes(term)) {
            matchedConceptIds.add(c.id)
          }
        }
      }
      
      // Also find concepts whose synonyms match the query term (bidirectional synonym matching)
      // If query is "vibrant" and concept "colorful" has "vibrant" as a synonym, include "colorful"
      for (const term of queryTerms) {
        for (const c of concepts) {
          const synonyms = conceptSynonymsMap.get(c.id)
          if (synonyms && synonyms.has(term)) {
            matchedConceptIds.add(c.id)
          }
        }
      }
      
      // 3. Load ImageTag records for all images
      // First, load all tags to check which images have tags (for penalty)
      const allImageIds = images.map((img: any) => img.id)
      const allTags = allImageIds.length > 0 ? await prisma.imageTag.findMany({
        where: { imageId: { in: allImageIds } } as any
      }) : []
      
      // Build map of imageId -> Set<conceptId> for checking if image has any tags
      const imageHasTagsSet = new Set<string>()
      for (const tag of allTags) {
        imageHasTagsSet.add(tag.imageId)
      }
      
      // Then, load tags for matched concepts (if we have concept matches)
      const imageTagsMap = new Map<string, Map<string, number>>() // imageId -> conceptId -> score
      if (matchedConceptIds.size > 0) {
        const tagsForMatches = allTags.filter(t => matchedConceptIds.has(t.conceptId))
        for (const tag of tagsForMatches) {
          if (!imageTagsMap.has(tag.imageId)) {
            imageTagsMap.set(tag.imageId, new Map())
          }
          imageTagsMap.get(tag.imageId)!.set(tag.conceptId, tag.score)
        }
      }
      
      // 4. Rank with subtle concept boost and opposite penalty
      const { SEARCH_CONFIG } = await import('@/lib/tagging-config')
      
      // Build a map of all image tags for opposite detection
      const allImageTags = new Map<string, Array<{ conceptId: string; score: number }>>()
      for (const tag of allTags) {
        if (!allImageTags.has(tag.imageId)) {
          allImageTags.set(tag.imageId, [])
        }
        allImageTags.get(tag.imageId)!.push({ conceptId: tag.conceptId, score: tag.score })
      }
      
      const ranked = [] as Array<{
        imageId: string
        siteId: string
        url: string
        siteUrl: string
        score: number
        site: any
      }>
      
      for (const img of images as any[]) {
        const ivec = (img.embedding?.vector as unknown as number[]) || []
        if (ivec.length !== dim) continue
        
        // Base zero-shot score (cosine similarity)
        let baseScore = cosine(queryVec, ivec)
        let score = baseScore
        
        // Track direct hits for ranking (defined early for scope)
        let matchedConceptCount = matchedConceptIds.size
        let imageMatchedConceptCount = 0
        let directHitsCount = 0
        let hasAllMatches = false
        let hasOppositeTagsForImage = false // Track if image has opposite tags (avoid shadowing function name)
        
        // Check if this image has any tags
        const hasTags = imageHasTagsSet.has(img.id)
        const imgTags = imageTagsMap.get(img.id)
        const imageTagList = hasTags ? (allImageTags.get(img.id) || []) : []
        
        // Adjust score based on tag strength - how much of the query concept is in the image
        if (hasTags) {
          const imageTagIds = imageTagList.map(t => t.conceptId)
          
          // Check if query matches any of the image's tags (when concepts match)
          // Also check for synonym matches - if image tag is a synonym of matched concept, it's a match
          let hasMatchingTag = matchedConceptIds.size > 0 && 
                               imgTags && 
                               Array.from(matchedConceptIds).some(id => imgTags.has(id))
          
          // If no direct match, check for synonym matches
          if (!hasMatchingTag && matchedConceptIds.size > 0) {
            for (const queryConceptId of matchedConceptIds) {
              const queryConcept = concepts.find(c => c.id === queryConceptId)
              if (!queryConcept) continue
              const querySynonyms = (queryConcept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
              
              for (const { conceptId } of imageTagList) {
                const tagConcept = concepts.find(c => c.id === conceptId)
                if (!tagConcept) continue
                const tagLabel = tagConcept.label.toLowerCase()
                const tagId = tagConcept.id.toLowerCase()
                
                if (querySynonyms.includes(tagLabel) || querySynonyms.includes(tagId)) {
                  hasMatchingTag = true
                  break
                }
              }
              if (hasMatchingTag) break
            }
          }
          
          // For multi-term queries, check if image has tags for ALL matched concepts (AND logic)
          // This prevents images from ranking high if they only match one term in a multi-term query
          // Count both direct matches and synonym matches (but don't double-count: if direct match exists, don't count synonym)
          matchedConceptCount = matchedConceptIds.size
          if (matchedConceptIds.size > 0 && imgTags) {
            imageMatchedConceptCount = Array.from(matchedConceptIds).filter(id => imgTags.has(id)).length
            
            // Also count synonym matches, but ONLY if there's no direct match for that concept
            for (const queryConceptId of matchedConceptIds) {
              // Skip if we already have a direct match for this concept
              if (imgTags.has(queryConceptId)) continue
              
              const queryConcept = concepts.find(c => c.id === queryConceptId)
              if (!queryConcept) continue
              const querySynonyms = (queryConcept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
              
              for (const { conceptId } of imageTagList) {
                const tagConcept = concepts.find(c => c.id === conceptId)
                if (!tagConcept) continue
                const tagLabel = tagConcept.label.toLowerCase()
                const tagId = tagConcept.id.toLowerCase()
                
                if (querySynonyms.includes(tagLabel) || querySynonyms.includes(tagId)) {
                  imageMatchedConceptCount++
                  break // Count each matched concept only once
                }
              }
            }
          } else {
            imageMatchedConceptCount = 0
          }
          const hasAllMatchingTags = matchedConceptCount > 0 && imageMatchedConceptCount === matchedConceptCount
          const hasPartialMatchingTags = hasMatchingTag && !hasAllMatchingTags && matchedConceptCount > 1
          
          // Update direct hits count for ranking
          directHitsCount = imageMatchedConceptCount
          hasAllMatches = hasAllMatchingTags
          
          // Find opposite tags with their scores
          const oppositeTags: Array<{ conceptId: string; score: number }> = []
          if (matchedConceptIds.size > 0) {
            for (const queryConceptId of matchedConceptIds) {
              for (const { conceptId, score: tagScore } of imageTagList) {
                if (hasOppositeTags(queryConceptId, [conceptId])) {
                  oppositeTags.push({ conceptId, score: tagScore })
                  hasOppositeTagsForImage = true // Mark that this image has opposite tags
                }
              }
            }
          } else {
            // No matched concepts - check query terms directly against opposite map
            for (const term of queryTerms) {
              for (const { conceptId, score: tagScore } of imageTagList) {
                if (hasOppositeTags(term, [conceptId])) {
                  oppositeTags.push({ conceptId, score: tagScore })
                  hasOppositeTagsForImage = true // Mark that this image has opposite tags
                }
              }
            }
          }
          
          // Find related/supporting tags (concepts that are similar to the query)
          const supportingTags: Array<{ conceptId: string; score: number }> = []
          if (matchedConceptIds.size > 0) {
            // Check if matched concepts are in image tags (direct matches)
            for (const queryConceptId of matchedConceptIds) {
              const tagScore = imgTags?.get(queryConceptId)
              if (tagScore !== undefined) {
                supportingTags.push({ conceptId: queryConceptId, score: tagScore })
              }
            }
            
            // Check for synonym matches - if image tag is a synonym of matched concept, treat as direct match
            // Example: Query "colorful" matches concept "colorful", image has tag "vibrant" (synonym of "colorful")
            for (const queryConceptId of matchedConceptIds) {
              const queryConcept = concepts.find(c => c.id === queryConceptId)
              if (!queryConcept) continue
              
              const querySynonyms = (queryConcept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
              
              for (const { conceptId, score: tagScore } of imageTagList) {
                // Skip if already added as direct match
                if (matchedConceptIds.has(conceptId)) continue
                
                const tagConcept = concepts.find(c => c.id === conceptId)
                if (!tagConcept) continue
                
                const tagLabel = tagConcept.label.toLowerCase()
                const tagId = tagConcept.id.toLowerCase()
                
                // If image tag's label/ID matches a synonym of the query concept, treat as synonym match (0.9x weight)
                if (querySynonyms.includes(tagLabel) || querySynonyms.includes(tagId)) {
                  supportingTags.push({ conceptId, score: tagScore * 0.9 }) // 90% weight for synonyms
                }
              }
            }
            
            // Also check for related concepts (non-synonym related terms)
            // For example, "colorful" is related to "neon", "vibrant", "gradient"
            for (const queryConceptId of matchedConceptIds) {
              const queryConcept = concepts.find(c => c.id === queryConceptId)
              if (!queryConcept) continue
              
              // Only check related terms (not synonyms - those are handled above)
              const relatedTerms = ((queryConcept.related as unknown as string[]) || [])
                .map(t => String(t).toLowerCase())
              
              for (const { conceptId, score: tagScore } of imageTagList) {
                // Skip if already added as direct match or synonym match
                if (matchedConceptIds.has(conceptId) || supportingTags.some(t => t.conceptId === conceptId)) continue
                
                const tagConcept = concepts.find(c => c.id === conceptId)
                if (!tagConcept) continue
                
                const tagLabel = tagConcept.label.toLowerCase()
                const tagId = tagConcept.id.toLowerCase()
                
                if (relatedTerms.includes(tagLabel) || relatedTerms.includes(tagId)) {
                  // This is a related tag (not a synonym) - add it with reduced weight
                  supportingTags.push({ conceptId, score: tagScore * 0.7 }) // 70% weight for related
                }
              }
            }
          }
          
          // Apply adjustments based on tag strength
          // PRIORITY 1: If image has direct matching tags, apply SIGNIFICANT boost
          // BUT: For multi-term queries, only apply full boost if ALL terms match (AND logic)
          
          // Constants for tag weighting (shared across both hasMatchingTag and !hasMatchingTag branches)
          // Adjusted to give more weight to cosine similarity (baseScore) in final ranking
          const DIRECT_MULTIPLIER = 8 // direct tags multiplier (reduced from 10 to balance with baseScore)
          const SYNONYM_WEIGHT = 0.85 // synonyms are worth 85% of direct matches (slightly reduced from 0.9)
          const RELATED_WEIGHT = 0.08 // related terms are worth 8% of direct matches (reduced from 0.1)
          
          if (hasMatchingTag) {
            // Image has matching tags - SIGNIFICANTLY boost based on tag strength
            // Direct matches should dominate ranking - boost much more aggressively
            let directMatches = supportingTags.filter(t => 
              matchedConceptIds.has(t.conceptId)
            )
            // Fallback: build directMatches directly from imgTags if supportingTags is empty
            if (directMatches.length === 0 && imgTags) {
              for (const conceptId of matchedConceptIds) {
                const tagScore = imgTags.get(conceptId)
                if (tagScore !== undefined) {
                  directMatches.push({ conceptId, score: tagScore })
                }
              }
            }
            
            // Simple, scalable rule set aligned with requirements
            // Increased base cosine contribution to ensure higher similarity scores rank higher
            const ZERO_WITH_DIRECT = 0.30 // base cosine contributes 30% when direct tags exist (increased from 10%)
            const ZERO_WITH_RELATED = 0.20 // with only related, base contributes 20% (increased from 10%)
            const RELATED_MIN = 0.20 // require a reasonably strong related tag to count
            
            // CRITICAL: If hasMatchingTag is true, we MUST have directMatches
            // If we don't, it's a bug - don't apply any boost, just use base score
            // Separate direct matches, synonym matches, and related matches for different weights
            const synonymMatches = supportingTags.filter(t => {
              // If it's already a direct match (in matchedConceptIds), it's not a synonym match
              if (matchedConceptIds.has(t.conceptId)) return false
              
              // Check if this tag is a synonym of any matched concept
              for (const queryConceptId of matchedConceptIds) {
                const queryConcept = concepts.find(c => c.id === queryConceptId)
                if (!queryConcept) continue
                const querySynonyms = (queryConcept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
                const tagConcept = concepts.find(c => c.id === t.conceptId)
                if (tagConcept) {
                  const tagLabel = tagConcept.label.toLowerCase()
                  const tagId = tagConcept.id.toLowerCase()
                  if (querySynonyms.includes(tagLabel) || querySynonyms.includes(tagId)) {
                    return true
                  }
                }
              }
              return false
            })
            
            // Separate related matches (not synonyms, not direct)
            const relatedOnlyMatches = supportingTags.filter(t => 
              !matchedConceptIds.has(t.conceptId) && !synonymMatches.includes(t)
            )
            
            // Calculate weighted sum: direct (1.0x), synonyms (0.9x), related (0.1x)
            const directSum = directMatches.reduce((s, t) => s + t.score, 0)
            const synonymSum = synonymMatches.reduce((s, t) => s + t.score, 0) // Already weighted at 0.9x in supportingTags
            const relatedSum = relatedOnlyMatches.reduce((s, t) => s + t.score, 0) // Already weighted at 0.7x in supportingTags, but we want 0.1x total
            
            // Combine all matches with their respective weights
            // Note: synonymMatches already have 0.9x weight, relatedOnlyMatches have 0.7x weight in supportingTags
            // We need to adjust relatedOnlyMatches to 0.1x total (0.7x * 0.143 ≈ 0.1x)
            const adjustedRelatedSum = relatedSum * (RELATED_WEIGHT / 0.7) // Convert from 0.7x to 0.1x
            const allMatchesSum = directSum + synonymSum + adjustedRelatedSum
            
            if (directMatches.length > 0 || synonymMatches.length > 0) {
              // Penalize partial matches for multi-term queries by downscaling the combined score
              let weightedComponent = allMatchesSum
              if (matchedConceptCount > 1 && imageMatchedConceptCount < matchedConceptCount) {
                const completeness = imageMatchedConceptCount / matchedConceptCount // 0..1
                weightedComponent *= Math.max(0.4, completeness) // up to 60% penalty for partial matches
              }

              // When we have direct hits or synonyms, tags dominate (related already included in weighted sum)
              const tagScore = DIRECT_MULTIPLIER * weightedComponent
              score = tagScore + baseScore * ZERO_WITH_DIRECT
              
              // Handle opposite tags - always apply penalty, strength based on opposite score and distance to direct
              if (oppositeTags.length > 0) {
                const maxOppositeScore = Math.max(...oppositeTags.map(t => t.score))
                // Use max of direct or synonym matches for penalty calculation
                const allDirectAndSynonym = [...directMatches, ...synonymMatches]
                const maxDirectScore = allDirectAndSynonym.length > 0 
                  ? Math.max(...allDirectAndSynonym.map(t => t.score)) 
                  : 0
                
                // Calculate penalty strength:
                // 1. Base penalty: proportional to opposite tag strength (normalize 0.15-0.30 range to 0-1)
                const oppositeStrength = Math.max(0, Math.min(1, (maxOppositeScore - 0.15) / (0.30 - 0.15)))
                
                // 2. Distance factor: smaller distance = larger penalty
                // Distance = |directScore - oppositeScore|
                const distance = Math.abs(maxDirectScore - maxOppositeScore)
                // Normalize distance (0.0-0.15 range maps to 1.0-0.3 penalty multiplier)
                // Closer tags (small distance) get higher penalty multiplier
                const distanceFactor = 1.0 - (Math.min(distance, 0.15) / 0.15) * 0.7 // 1.0 to 0.3 range
                
                // 3. Surpass bonus: if opposite > direct, add extra penalty
                const surpassBonus = maxOppositeScore > maxDirectScore ? 0.05 : 0
                
                // 4. Calculate penalty percentage (0-15% max to ensure direct tags still rank above non-direct)
                // Further reduced from 30% to 15% for subtle penalties
                const penaltyPercent = Math.min(0.15, (oppositeStrength * 0.08 + distanceFactor * 0.05 + surpassBonus * 0.02))
                
                // Apply penalty to the tag component (not base score)
                const tagScorePenalized = tagScore * (1.0 - penaltyPercent)
                score = tagScorePenalized + baseScore * ZERO_WITH_DIRECT
              }
            } else {
              // hasMatchingTag is true but no directMatches - this shouldn't happen
              // Reset to base score only (no boost)
              console.warn(`[search] hasMatchingTag=true but directMatches.length=0 for image ${img.id}, query "${q}"`)
              score = baseScore * ZERO_WITH_RELATED
              
              // Handle opposite tags - no direct matches but has opposites
              if (oppositeTags.length > 0) {
                const maxOppositeScore = Math.max(...oppositeTags.map(t => t.score))
                const maxSupportingScore = relatedOnlyMatches.reduce((m, t) => Math.max(m, t.score), 0)
                
                // Calculate penalty based on opposite strength and distance to supporting score
                const oppositeStrength = Math.max(0, Math.min(1, (maxOppositeScore - 0.15) / (0.30 - 0.15)))
                const distance = Math.abs(maxSupportingScore - maxOppositeScore)
                const distanceFactor = 1.0 - (Math.min(distance, 0.15) / 0.15) * 0.7
                const surpassBonus = maxOppositeScore > maxSupportingScore ? 0.05 : 0
                
                // Higher penalty when no direct matches (reduced from 50% to 30% max)
                const penaltyPercent = Math.min(0.30, (oppositeStrength * 0.15 + distanceFactor * 0.10 + surpassBonus * 0.05))
                score *= (1.0 - penaltyPercent)
              }
            }
          } 
          
          // Simple rule for images without direct matching tags
          if (matchedConceptIds.size > 0 && !hasMatchingTag) {
            const RELATED_MIN = 0.20
            const ZERO_NO_DIRECT = 0.20 // When no direct tags, base contributes 20% (balanced - not too high, not too low)
            
            // Re-check for opposites if not already detected
            if (oppositeTags.length === 0 && imageTagList.length > 0) {
              for (const queryConceptId of matchedConceptIds) {
                for (const { conceptId, score: tagScore } of imageTagList) {
                  if (hasOppositeTags(queryConceptId, [conceptId])) {
                    oppositeTags.push({ conceptId, score: tagScore })
                    hasOppositeTagsForImage = true
                  }
                }
              }
            }
            
            // Check for related tags (synonyms/related of query concept)
            const relatedOnlyMatches = supportingTags.filter(t => !matchedConceptIds.has(t.conceptId))
            const relatedMax = relatedOnlyMatches.reduce((m, t) => Math.max(m, t.score), 0)
            
            if (oppositeTags.length > 0) {
              // Heavy penalty for opposite tags when no direct matches - rank very low
              const maxOppositeScore = Math.max(...oppositeTags.map(t => t.score))
              
              // Calculate penalty based on opposite strength
              const oppositeStrength = Math.max(0, Math.min(1, (maxOppositeScore - 0.15) / (0.30 - 0.15)))
              
              // When no direct matches, apply penalty (reduced from 60-75% to 40-55% reduction)
              const penaltyPercent = 0.40 + (oppositeStrength * 0.15) // 40-55% reduction
              score = baseScore * (1.0 - penaltyPercent) * ZERO_NO_DIRECT
            } else if (relatedMax >= RELATED_MIN) {
              // Only related tags (no direct, no synonyms) - use RELATED_WEIGHT (10% of direct)
              const tagScore = relatedMax * RELATED_WEIGHT * DIRECT_MULTIPLIER // 10% weight, then multiply by DIRECT_MULTIPLIER
              score = tagScore + baseScore * ZERO_NO_DIRECT
            } else {
              // No direct, no strong related - minimal base only
              score = baseScore * ZERO_NO_DIRECT
            }
          }
        } else {
          // Image has NO tags at all - apply simple rule: use base score more prominently
          if (matchedConceptIds.size > 0) {
            // Query matches a concept but image has no tags - use base score more prominently
            score = baseScore * 0.20 // 20% of base score when no tags exist (balanced)
          }
          // If no concept match, leave base score as-is (fallback to pure zero-shot)
        }
        
        // Include ALL images - no hard cutoff, just ranked by score
        if (img.site) {
          // Final check for opposites if not already detected (ensure we catch all cases)
          if (!hasOppositeTagsForImage && imageTagList.length > 0) {
            if (matchedConceptIds.size > 0) {
              for (const queryConceptId of matchedConceptIds) {
                for (const { conceptId } of imageTagList) {
                  if (hasOppositeTags(queryConceptId, [conceptId])) {
                    hasOppositeTagsForImage = true
                    break
                  }
                }
                if (hasOppositeTagsForImage) break
              }
            } else {
              // No matched concepts - check query terms directly
              for (const term of queryTerms) {
                for (const { conceptId } of imageTagList) {
                  if (hasOppositeTags(term, [conceptId])) {
                    hasOppositeTagsForImage = true
                    break
                  }
                }
                if (hasOppositeTagsForImage) break
              }
            }
          }
          
          ranked.push({
            imageId: img.id,
            siteId: (img as any).siteId,
            url: (img as any).url,
            siteUrl: img.site.url,
            score,
            baseScore, // Store base cosine similarity for sorting
            // Store metadata for ranking: number of direct hits and completeness
            directHitsCount,
            hasAllMatches,
            matchedConceptCount,
            hasOppositeTags: hasOppositeTagsForImage, // Track opposite tags for sorting
            site: {
              id: img.site.id,
              title: img.site.title,
              description: img.site.description,
              url: img.site.url,
              imageUrl: (img as any).url, // Use screenshot URL from Image
              author: img.site.author,
              tags: [],
            },
          } as any)
        }
      }
      // Sort by: 1) has all matches, 2) number of direct hits (desc), 3) final score (desc), 4) base cosine similarity (desc), 5) NO opposite tags
      // When direct hits are equal, prioritize final score (which includes tag boost) over base similarity
      ranked.sort((a: any, b: any) => {
        // First: full matches rank above partial matches
        if (a.hasAllMatches && !b.hasAllMatches) return -1
        if (!a.hasAllMatches && b.hasAllMatches) return 1
        
        // Second: more direct hits rank above fewer (ALWAYS prioritize direct hits)
        if (a.directHitsCount !== b.directHitsCount) {
          return b.directHitsCount - a.directHitsCount
        }
        
        // Third: When direct hits are equal, sort by final score (primary ranking)
        // Final score includes the 10x tag boost, which is what we want to rank by
        // Reduced tolerance from 0.01 to 0.001 to prioritize high-scored images more precisely
        if (Math.abs(a.score - b.score) > 0.001) {
          return b.score - a.score
        }
        
        // Fourth: base cosine similarity (tiebreaker if final scores are very close)
        // Only used when final scores are within 0.01 of each other
        if (a.directHitsCount === b.directHitsCount) {
          if (Math.abs(a.baseScore - b.baseScore) > 0.0001) {
            return b.baseScore - a.baseScore
          }
        }
        
        // Fifth: images WITHOUT opposite tags rank above those WITH opposite tags (minor tiebreaker)
        if (a.hasOppositeTags && !b.hasOppositeTags) return 1
        if (!a.hasOppositeTags && b.hasOppositeTags) return -1
        
        return 0
      })
      // Return all ranked sites (no slice - show everything ranked by score)
      return NextResponse.json({ 
        query: q, 
        sites: ranked.map(r => r.site),
        images: ranked
      })
    }

    // Fallback to old concept-expansion logic
    const rawTokens = q.split(/[,+\s]+/).map(t => t.trim()).filter(Boolean)
    if (rawTokens.length === 0) return NextResponse.json({ images: [] })

    const concepts = await prisma.concept.findMany()
    const expandSet = new Set<string>()
    for (const t of rawTokens) {
      expandSet.add(t)
      const c = concepts.find(x => x.id.toLowerCase() === t.toLowerCase() || x.label.toLowerCase() === t.toLowerCase())
      if (c) {
        const syn = (c.synonyms as unknown as string[] | undefined) || []
        const rel = (c.related as unknown as string[] | undefined) || []
        for (const s of syn) expandSet.add(String(s))
        for (const r of rel) expandSet.add(String(r))
      }
    }
    const expanded = Array.from(expandSet)

    const textVecs = await embedTextBatch(expanded)
    const dim = textVecs[0]?.length || 0
    const query = new Array(dim).fill(0)
    for (const v of textVecs) for (let i = 0; i < dim; i++) query[i] += v[i]
    const nrm = Math.sqrt(query.reduce((s, x) => s + x * x, 0)) || 1
    for (let i = 0; i < dim; i++) query[i] /= nrm

    const images = await (prisma.image.findMany as any)({ include: { embedding: true, tags: true } })
    const conceptIds = new Set(rawTokens.map(t => t.toLowerCase()))

    const ranked = [] as Array<{ imageId: string; siteId: string; url: string; score: number }>
    for (const img of images as any[]) {
      const ivec = (img.embedding?.vector as unknown as number[]) || []
      if (ivec.length !== dim || dim === 0) continue
      let score = cosine(query, ivec)
      for (const it of img.tags) {
        if (conceptIds.has(it.conceptId.toLowerCase())) score += 0.02
      }
      ranked.push({ imageId: img.id, siteId: (img as any).siteId, url: (img as any).url, score })
    }
    ranked.sort((a, b) => b.score - a.score)

    return NextResponse.json({ query: expanded, images: ranked.slice(0, 60) })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}


