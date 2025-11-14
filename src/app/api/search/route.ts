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
          const hasMatchingTag = matchedConceptIds.size > 0 && 
                                 imgTags && 
                                 Array.from(matchedConceptIds).some(id => imgTags.has(id))
          
          // For multi-term queries, check if image has tags for ALL matched concepts (AND logic)
          // This prevents images from ranking high if they only match one term in a multi-term query
          matchedConceptCount = matchedConceptIds.size
          imageMatchedConceptCount = matchedConceptIds.size > 0 && imgTags ?
            Array.from(matchedConceptIds).filter(id => imgTags.has(id)).length : 0
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
            // Check if matched concepts are in image tags
            for (const queryConceptId of matchedConceptIds) {
              const tagScore = imgTags?.get(queryConceptId)
              if (tagScore !== undefined) {
                supportingTags.push({ conceptId: queryConceptId, score: tagScore })
              }
            }
            
            // Also check for related concepts (synonyms/related terms)
            // For example, "colorful" is related to "neon", "vibrant", "gradient"
            for (const queryConceptId of matchedConceptIds) {
              const queryConcept = concepts.find(c => c.id === queryConceptId)
              if (!queryConcept) continue
              
              // Check related concepts from synonyms and related fields
              const relatedTerms = [
                ...((queryConcept.synonyms as unknown as string[]) || []),
                ...((queryConcept.related as unknown as string[]) || [])
              ].map(t => String(t).toLowerCase())
              
              for (const { conceptId, score: tagScore } of imageTagList) {
                const tagConcept = concepts.find(c => c.id === conceptId)
                if (!tagConcept) continue
                
                // Check if this tag's label/synonyms match related terms
                const tagLabel = tagConcept.label.toLowerCase()
                const tagId = tagConcept.id.toLowerCase()
                
                if (relatedTerms.includes(tagLabel) || relatedTerms.includes(tagId)) {
                  // This is a related tag - add it with reduced weight
                  // Use tag score as indicator of presence strength
                  supportingTags.push({ conceptId, score: tagScore * 0.7 }) // 70% weight for related
                }
              }
            }
          }
          
          // Apply adjustments based on tag strength
          // PRIORITY 1: If image has direct matching tags, apply SIGNIFICANT boost
          // BUT: For multi-term queries, only apply full boost if ALL terms match (AND logic)
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
            const relatedMatches = supportingTags.filter(t => 
              !matchedConceptIds.has(t.conceptId)
            )
            
            // Simple, scalable rule set aligned with requirements
            const DIRECT_MULTIPLIER = 10 // direct tags are worth 10x related
            const ZERO_WITH_DIRECT = 0.10 // base cosine contributes 10% when direct tags exist
            const ZERO_WITH_RELATED = 0.10 // with only related, keep base influence very small
            const RELATED_MIN = 0.20 // require a reasonably strong related tag to count
            
            // CRITICAL: If hasMatchingTag is true, we MUST have directMatches
            // If we don't, it's a bug - don't apply any boost, just use base score
            if (directMatches.length > 0) {
              const directSum = directMatches.reduce((s, t) => s + t.score, 0)

              // Penalize partial matches for multi-term queries by downscaling directSum
              let directComponent = directSum
              if (matchedConceptCount > 1 && imageMatchedConceptCount < matchedConceptCount) {
                const completeness = imageMatchedConceptCount / matchedConceptCount // 0..1
                directComponent *= Math.max(0.4, completeness) // up to 60% penalty
              }

              // When we have direct hits, ignore related entirely; tags dominate
              const tagScore = DIRECT_MULTIPLIER * directComponent
              score = tagScore + baseScore * ZERO_WITH_DIRECT
              
              // Handle opposite tags - always apply penalty, strength based on opposite score and distance to direct
              if (oppositeTags.length > 0) {
                const maxOppositeScore = Math.max(...oppositeTags.map(t => t.score))
                const maxDirectScore = Math.max(...directMatches.map(t => t.score))
                
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
                const maxSupportingScore = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
                
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
            const ZERO_NO_DIRECT = 0.05 // When no direct tags, base contributes only 5%
            
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
            const relatedMatches = supportingTags.filter(t => !matchedConceptIds.has(t.conceptId))
            const relatedMax = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
            
            if (oppositeTags.length > 0) {
              // Heavy penalty for opposite tags when no direct matches - rank very low
              const maxOppositeScore = Math.max(...oppositeTags.map(t => t.score))
              
              // Calculate penalty based on opposite strength
              const oppositeStrength = Math.max(0, Math.min(1, (maxOppositeScore - 0.15) / (0.30 - 0.15)))
              
              // When no direct matches, apply penalty (reduced from 60-75% to 40-55% reduction)
              const penaltyPercent = 0.40 + (oppositeStrength * 0.15) // 40-55% reduction
              score = baseScore * (1.0 - penaltyPercent) * ZERO_NO_DIRECT
            } else if (relatedMax >= RELATED_MIN) {
              // Only related tags (no direct) - heavily reduce related to ensure direct always wins
              const tagScore = relatedMax * 0.1 // Reduce related to 10% (same as above)
              score = tagScore + baseScore * ZERO_NO_DIRECT
            } else {
              // No direct, no strong related - minimal base only
              score = baseScore * ZERO_NO_DIRECT
            }
          }
        } else {
          // Image has NO tags at all - apply simple rule: minimal base contribution only
          if (matchedConceptIds.size > 0) {
            // Query matches a concept but image has no tags - minimal base only
            score = baseScore * 0.05 // Only 5% of base score when no tags exist
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
        if (Math.abs(a.score - b.score) > 0.01) {
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


