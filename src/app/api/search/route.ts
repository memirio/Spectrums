import { NextRequest, NextResponse } from 'next/server'
import { embedTextBatch } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { hasOppositeTags } from '@/lib/concept-opposites'
import { isAbstractQuery, expandAndEmbedQuery, getExpansionEmbeddings, poolMax, poolSoftmax } from '@/lib/query-expansion'
import { logSearchImpressions, type SearchImpression } from '@/lib/interaction-logger'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

/**
 * Get popularity metrics for images (show_count, click_count, CTR)
 * Used to penalize "hub" images that appear frequently but are rarely clicked
 */
async function getImagePopularityMetrics(
  imageIds: string[],
  topN: number = 20
): Promise<Map<string, { showCount: number; clickCount: number; ctr: number }>> {
  if (imageIds.length === 0) return new Map()

  try {
    // Check if userInteraction model exists (use as any to bypass type checking)
    const userInteractionModel = (prisma as any).userInteraction
    if (!userInteractionModel) {
      console.warn(`[search] userInteraction model not available, returning empty metrics`)
      const emptyMetrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
      for (const imageId of imageIds) {
        emptyMetrics.set(imageId, { showCount: 0, clickCount: 0, ctr: 0 })
      }
      return emptyMetrics
    }

    // Count how many times each image appears in top N results across all queries
    const impressions = await userInteractionModel.groupBy({
      by: ['imageId'],
      where: {
        imageId: { in: imageIds },
        position: { lte: topN }, // Only count top N positions
      },
      _count: {
        id: true,
      },
    })

    // Count clicks for each image
    const clicks = await userInteractionModel.groupBy({
      by: ['imageId'],
      where: {
        imageId: { in: imageIds },
        clicked: true,
      },
      _count: {
        id: true,
      },
    })

    // Build maps for quick lookup
    const impressionMap = new Map<string, number>()
    for (const imp of impressions) {
      impressionMap.set(imp.imageId, imp._count.id)
    }

    const clickMap = new Map<string, number>()
    for (const click of clicks) {
      clickMap.set(click.imageId, click._count.id)
    }

    // Build result map
    const metrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
    for (const imageId of imageIds) {
      const showCount = impressionMap.get(imageId) || 0
      const clickCount = clickMap.get(imageId) || 0
      const ctr = showCount > 0 ? clickCount / showCount : 0

      metrics.set(imageId, { showCount, clickCount, ctr })
    }

    return metrics
  } catch (error: any) {
    // If userInteraction table doesn't exist or query fails, return empty metrics
    console.warn(`[search] Failed to get popularity metrics: ${error.message}`)
    const emptyMetrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
    for (const imageId of imageIds) {
      emptyMetrics.set(imageId, { showCount: 0, clickCount: 0, ctr: 0 })
    }
    return emptyMetrics
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log(`[search] Request received: ${request.url}`)
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q') || ''
    // Normalize query to lowercase for case-insensitive search
    const q = rawQuery.trim().toLowerCase()
    const debug = searchParams.get('debug') === '1'
    const zeroShot = searchParams.get('ZERO_SHOT') !== 'false' // default true
    if (!q) return NextResponse.json({ images: [] })
    
    console.log(`[search] Processing query: "${q}" (original: "${rawQuery.trim()}")`)

    if (zeroShot) {
      // CLIP-FIRST RETRIEVAL: Primary semantic signal
      // 1. Compute query embedding (with expansion for abstract terms)
      // Query is already normalized to lowercase
      
      // Count words in query
      const wordCount = q.trim().split(/\s+/).filter(w => w.length > 0).length
      const useExpansion = wordCount <= 2 // Only use expansion for queries with 2 words or less
      
      let isAbstract = false
      if (useExpansion) {
        // Only check if abstract if query is 2 words or less
        isAbstract = isAbstractQuery(q)
      } else {
        // For queries with more than 2 words, skip expansion
        console.log(`[search] Query has ${wordCount} words (>2), skipping expansion and using exact query`)
        isAbstract = false
      }
      
      const usePooling = searchParams.get('pooling') || 'softmax' // 'max' or 'softmax', default 'softmax'
      const poolingTemp = parseFloat(searchParams.get('pooling_temp') || '0.05')
      
      console.log(`[search] Query "${q}" wordCount: ${wordCount}, useExpansion: ${useExpansion}, isAbstract: ${isAbstract}, pooling: ${usePooling}`)
      
      let queryVec: number[] | null = null
      let expansionEmbeddings: number[][] | null = null
      const isExpanded = isAbstract && useExpansion
      
      if (isExpanded) {
        // Use max/softmax pooling for expansions (OR semantics)
        console.log(`[search] Using expansion embeddings with ${usePooling} pooling`)
        expansionEmbeddings = await getExpansionEmbeddings(q)
        // For backward compatibility, also compute averaged embedding (used in debug mode)
        queryVec = await expandAndEmbedQuery(q)
      } else {
        // Direct embedding for concrete queries or queries with >2 words
        if (!useExpansion) {
          console.log(`[search] Using direct embedding for multi-word query (${wordCount} words)`)
        } else {
          console.log(`[search] Using direct embedding for concrete term`)
        }
        const [vec] = await embedTextBatch([q])
        queryVec = vec
      }
      const dim = queryVec.length
      
      // 2. Retrieve all images with embeddings
      console.log(`[search] Loading images with embeddings...`)
      const images = await (prisma.image.findMany as any)({
        where: { embedding: { isNot: null } },
        include: { embedding: true, site: true },
      })
      console.log(`[search] Loaded ${images.length} images`)
      
      if (debug) {
        // Debug mode: pure CLIP cosine ranking only
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
          
          let score: number
          if (isExpanded && expansionEmbeddings) {
            // Use pooling for expanded queries in debug mode too
            const expansionScores = expansionEmbeddings.map(expVec => cosine(expVec, ivec))
            if (usePooling === 'max') {
              score = poolMax(expansionScores)
            } else {
              score = poolSoftmax(expansionScores, poolingTemp)
            }
          } else {
            score = cosine(queryVec!, ivec)
          }
          
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
          pooling: usePooling,
          images: ranked.slice(0, 60),
        })
      }
      
      // 3. CLIP-FIRST: Rank by cosine similarity (primary semantic signal)
      // This handles abstract queries like "love", "fun", "3d dashboard", "fun mobile app" etc.
      const ranked = [] as Array<{
        imageId: string
        siteId: string
        url: string
        siteUrl: string
        score: number
        baseScore: number
        site: any
      }>
      
      for (const img of images as any[]) {
        const ivec = (img.embedding?.vector as unknown as number[]) || []
        if (ivec.length !== dim) continue
        
        // PRIMARY: CLIP cosine similarity (this is the main ranking signal)
        let baseScore: number
        if (isExpanded && expansionEmbeddings) {
          // For expanded queries: compute score with each expansion, then pool
          const expansionScores = expansionEmbeddings.map(expVec => cosine(expVec, ivec))
          if (usePooling === 'max') {
            baseScore = poolMax(expansionScores)
          } else {
            baseScore = poolSoftmax(expansionScores, poolingTemp)
          }
        } else {
          // For direct queries: simple cosine similarity
          baseScore = cosine(queryVec!, ivec)
        }
        let score = baseScore
        
        ranked.push({
          imageId: img.id,
          siteId: (img as any).siteId,
          url: (img as any).url,
          siteUrl: img.site.url,
          score,
          baseScore,
          site: {
            id: img.site.id,
            title: img.site.title,
            description: img.site.description,
            url: img.site.url,
            imageUrl: (img as any).url,
            author: img.site.author,
            tags: [],
          },
        } as any)
      }
      
      // Sort by CLIP cosine similarity (primary ranking)
      ranked.sort((a: any, b: any) => {
        // Primary: CLIP cosine similarity (baseScore)
        if (Math.abs(a.baseScore - b.baseScore) > 0.0001) {
          return b.baseScore - a.baseScore
        }
        return 0
      })
      
      // LIGHT RERANK: Apply very small tag-based adjustments (only to top K)
      const TOP_K_FOR_RERANK = 200
      const topK = ranked.slice(0, TOP_K_FOR_RERANK)
      const remaining = ranked.slice(TOP_K_FOR_RERANK)
      
      // 1. Find relevant concepts (string match only - simpler and more precise)
      // Query is already normalized to lowercase
      const queryTokens = q.split(/[\s,]+/).filter(Boolean)
      const allConcepts = await prisma.concept.findMany()
      
      const relevantConceptIds = new Set<string>()
      for (const concept of allConcepts) {
        const conceptLower = concept.label.toLowerCase()
        const conceptIdLower = concept.id.toLowerCase()
        
        // Exact match (query is already lowercase)
        if (conceptLower === q || conceptIdLower === q) {
          relevantConceptIds.add(concept.id)
        }
        // Token match (only if token is substantial, not single letters)
        else {
          for (const token of queryTokens) {
            if (token.length >= 2 && (conceptLower === token || conceptIdLower === token)) {
              relevantConceptIds.add(concept.id)
              break
            }
          }
        }
      }
      
      // Get opposites for relevant concepts
      const oppositeConceptIds = new Set<string>()
      for (const conceptId of relevantConceptIds) {
        const concept = allConcepts.find(c => c.id === conceptId)
        if (concept?.opposites) {
          const opposites = (concept.opposites as unknown as string[]) || []
          for (const oppId of opposites) {
            oppositeConceptIds.add(oppId)
          }
        }
      }
      
      // 2. Load ImageTags for top K images
      const topKImageIds = topK.map(r => r.imageId)
      const imageTags = await prisma.imageTag.findMany({
        where: { imageId: { in: topKImageIds } },
      })
      
      // Group tags by imageId
      const tagsByImage = new Map<string, Map<string, number>>()
      for (const tag of imageTags) {
        if (!tagsByImage.has(tag.imageId)) {
          tagsByImage.set(tag.imageId, new Map())
        }
        tagsByImage.get(tag.imageId)!.set(tag.conceptId, tag.score)
      }
      
      // 3. Load hub scores for top K images (with error handling)
      const hubScoresByImage = new Map<string, { hubScore: number | null; hubCount: number | null; hubAvgCosineSimilarity: number | null; hubAvgCosineSimilarityMargin: number | null }>()
      try {
        // Try using Prisma's typed query first (use as any to bypass type checking for new columns)
        const topKImagesWithHub = await (prisma.image.findMany as any)({
          where: { id: { in: topKImageIds } },
          select: { id: true, hubScore: true, hubCount: true, hubAvgCosineSimilarity: true, hubAvgCosineSimilarityMargin: true },
        })
        console.log(`[search] Loaded hub scores for ${topKImagesWithHub.length} images`)
        let hubScoreCount = 0
        for (const img of topKImagesWithHub) {
          const hubScore = img.hubScore ?? null
          const hubCount = img.hubCount ?? null
          const hubAvgCosineSimilarity = img.hubAvgCosineSimilarity ?? null
          const hubAvgCosineSimilarityMargin = img.hubAvgCosineSimilarityMargin ?? null
          if (hubScore !== null) hubScoreCount++
          hubScoresByImage.set(img.id, { hubScore, hubCount, hubAvgCosineSimilarity, hubAvgCosineSimilarityMargin })
        }
        console.log(`[search] Found ${hubScoreCount} images with non-null hub scores`)
      } catch (error: any) {
        // If hub columns don't exist or query fails, continue without hub scores
        console.warn(`[search] Failed to load hub scores: ${error.message}`)
        // If error mentions missing columns, it's okay - just continue without hub scores
      }
      
      // Initialize with null values for images not found
      for (const imageId of topKImageIds) {
        if (!hubScoresByImage.has(imageId)) {
          hubScoresByImage.set(imageId, { hubScore: null, hubCount: null, hubAvgCosineSimilarity: null, hubAvgCosineSimilarityMargin: null })
        }
      }
      
      // 4. Get popularity metrics for top K images
      const popularityMetrics = await getImagePopularityMetrics(topKImageIds, 20)
      
      // 5. Apply very light boosts/penalties (tag-based)
      const reranked = topK.map((item: any) => {
        const imageTags = tagsByImage.get(item.imageId) || new Map()
        let boost = 0
        let penalty = 0
        
        // Very light boosts: 0.01 * tagScore (much lighter - only 1% of tag score)
        // This ensures boosts are minimal relative to base CLIP scores
        for (const conceptId of relevantConceptIds) {
          const tagScore = imageTags.get(conceptId)
          if (tagScore !== undefined) {
            boost += 0.01 * tagScore  // Minimal boost (1% of tag score)
          }
        }
        
        // Very light penalties: 0.002 * tagScore (reduced from 0.005)
        for (const oppId of oppositeConceptIds) {
          const tagScore = imageTags.get(oppId)
          if (tagScore !== undefined) {
            penalty += 0.002 * tagScore  // Reduced penalty (0.2% of tag score, down from 0.5%)
          }
        }
        
        // 5. Apply popularity/ubiquity penalty (hub effect)
        // Penalize images that appear frequently but are rarely clicked
        const metrics = popularityMetrics.get(item.imageId)
        let popularityPenalty = 0
        if (metrics) {
          const { showCount, clickCount, ctr } = metrics
          
          // Only penalize if:
          // - Image has been shown at least 5 times (frequently shown)
          // - CTR is below 0.1 (10% - rarely clicked)
          // Penalty scales with showCount and inverse of CTR
          if (showCount >= 5 && ctr < 0.1) {
            // Penalty formula: (showCount / 100) * (0.1 - ctr) * 0.1
            // This gives a small penalty that scales with ubiquity and low CTR
            const ubiquityFactor = Math.min(showCount / 100, 1.0) // Cap at 1.0
            const lowCtrFactor = (0.1 - ctr) / 0.1 // 0 to 1, higher for lower CTR
            popularityPenalty = ubiquityFactor * lowCtrFactor * 0.1 // Max penalty of 0.1
          }
        }
        
        // 6. Apply hub score penalty (from detect_hub_images.ts)
        // Penalty directly affects the cosine similarity score (baseScore)
        // This ensures images with high semantic similarity can still rank well even if they're hubs
        let hubPenaltyMultiplier = 1.0 // Multiplier applied to baseScore (1.0 = no penalty)
        const hubData = hubScoresByImage.get(item.imageId)
        if (hubData?.hubScore !== null && hubData?.hubScore !== undefined) {
          const hubScore = hubData.hubScore
          const avgCosineSimilarityMargin = hubData.hubAvgCosineSimilarityMargin ?? 0
          
          // Penalize if hub score is high (appears in many queries)
          // Goal: Drop hubs by as many positions as they gained from being hubs
          if (hubScore > 0.05) {
            // Base penalty from margin: how much higher this hub is compared to query averages
            // Lightened penalty to reduce hub advantage without over-penalizing
            const marginPenaltyFactor = 4.8 // Reduced from 5.0
            const marginPenalty = Math.max(0, avgCosineSimilarityMargin * marginPenaltyFactor)
            
            // Frequency penalty: more frequently appearing hubs get heavier penalty
            // Lightened penalty to reduce frequency advantage
            // For hubScore = 0.5 (appears in 50% of queries), frequency penalty = 0.5 * 0.09 = 0.045
            // For hubScore = 0.98 (appears in 98% of queries), frequency penalty = 0.98 * 0.09 = 0.088
            const frequencyPenaltyFactor = 0.09 // Reduced from 0.10
            
            // Reduce frequency penalty when margin is negative (performing below average)
            // If margin is negative, reduce frequency penalty by 50% (multiply by 0.5)
            // This still penalizes over-exposure but less aggressively when the image isn't actually superior
            const frequencyPenaltyMultiplier = avgCosineSimilarityMargin < 0 ? 0.5 : 1.0
            const frequencyPenalty = hubScore * frequencyPenaltyFactor * frequencyPenaltyMultiplier
            
            // Combined absolute penalty: margin penalty + frequency penalty
            const absolutePenalty = marginPenalty + frequencyPenalty
            
            // Convert absolute penalty to percentage of baseScore
            // This ensures high semantic similarity (high baseScore) can still rank well
            // Example: baseScore=0.25, absolutePenalty=0.04 → penaltyPct=0.04/0.25=0.16 (16% reduction)
            //          baseScore=0.15, absolutePenalty=0.04 → penaltyPct=0.04/0.15=0.27 (27% reduction, capped at 20%)
            const penaltyPercentage = item.baseScore > 0 ? Math.min(absolutePenalty / item.baseScore, 0.2) : 0 // Keep cap at 20%
            
            // Apply as multiplier: 1.0 = no penalty, 0.8 = 20% penalty
            hubPenaltyMultiplier = 1.0 - penaltyPercentage
            
            // Ensure multiplier doesn't go below 0.5 (max 50% reduction)
            hubPenaltyMultiplier = Math.max(0.5, hubPenaltyMultiplier)
            
            console.log(`[search] Hub penalty applied: imageId=${item.imageId.substring(0, 12)}..., hubScore=${hubScore.toFixed(4)}, margin=${avgCosineSimilarityMargin.toFixed(4)}, absolutePenalty=${absolutePenalty.toFixed(4)}, penaltyPct=${(penaltyPercentage * 100).toFixed(1)}%, multiplier=${hubPenaltyMultiplier.toFixed(3)}, baseScore=${item.baseScore.toFixed(4)}`)
          }
        }
        
        // Apply hub penalty directly to baseScore (cosine similarity)
        // This ensures high semantic similarity can still rank well
        const adjustedBaseScore = item.baseScore * hubPenaltyMultiplier
        
        // finalScore = (adjusted baseScore) + tiny boosts - tiny penalties - popularity penalty
        const finalScore = adjustedBaseScore + boost - penalty - popularityPenalty
        
        // Debug: Log top results with significant hub penalties
        if (hubPenaltyMultiplier < 1.0) {
          const penaltyAmount = item.baseScore - adjustedBaseScore
          console.log(`[search] Significant hub penalty: site="${item.site?.title?.substring(0, 40)}", base=${item.baseScore.toFixed(4)}, hub=${hubData?.hubScore?.toFixed(4)}, multiplier=${hubPenaltyMultiplier.toFixed(3)}, adjustedBase=${adjustedBaseScore.toFixed(4)}, penalty=${penaltyAmount.toFixed(4)}, final=${finalScore.toFixed(4)}`)
        }
        
        return {
          ...item,
          score: finalScore,
          baseScore: item.baseScore, // Original cosine similarity
          adjustedBaseScore, // Cosine similarity after hub penalty multiplier
          boost,
          penalty,
          popularityPenalty,
          hubPenaltyMultiplier, // Multiplier applied to baseScore
          popularityMetrics: metrics || { showCount: 0, clickCount: 0, ctr: 0 },
          hubScore: hubData?.hubScore || null,
          hubCount: hubData?.hubCount || null,
        }
      })
      
      // Rerank by finalScore
      reranked.sort((a: any, b: any) => {
        if (Math.abs(a.score - b.score) > 0.0001) {
          return b.score - a.score
        }
        return 0
      })
      
      // Combine reranked top K with remaining results
      const finalRanked = [...reranked, ...remaining]
      
      // Log search impressions for learned reranker training
      // Only log top 20 results to avoid excessive logging
      const topResultsForLogging = finalRanked.slice(0, 20)
      const impressions: SearchImpression[] = topResultsForLogging.map((item: any, index: number) => {
        const position = index + 1
        const imageTags = tagsByImage.get(item.imageId) || new Map()
        
        // Extract tag features
        const tagScores: number[] = []
        let maxTagScore = 0
        let sumTagScores = 0
        let directMatchCount = 0
        let synonymMatchCount = 0
        let relatedMatchCount = 0
        
        for (const conceptId of relevantConceptIds) {
          const tagScore = imageTags.get(conceptId)
          if (tagScore !== undefined) {
            tagScores.push(tagScore)
            maxTagScore = Math.max(maxTagScore, tagScore)
            sumTagScores += tagScore
            directMatchCount++
          }
        }
        
        // Extract opposite tag features
        let maxOppositeTagScore = 0
        let sumOppositeTagScores = 0
        for (const oppId of oppositeConceptIds) {
          const tagScore = imageTags.get(oppId)
          if (tagScore !== undefined) {
            maxOppositeTagScore = Math.max(maxOppositeTagScore, tagScore)
            sumOppositeTagScores += tagScore
          }
        }
        
        // Get hub features for this image
        const hubData = hubScoresByImage.get(item.imageId)
        const hubCount = hubData?.hubCount ?? null
        const hubScore = hubData?.hubScore ?? null
        
        // Compute transformed hub features for learned reranker
        const logHubCount = hubCount !== null ? Math.log(1 + hubCount) : undefined
        const normalizedHubScore = hubScore !== null ? Math.min(hubScore, 1.0) : undefined // Already 0-1, but ensure cap
        
        return {
          query: q,
          queryEmbedding: queryVec,
          imageId: item.imageId,
          position,
          baseScore: item.baseScore,
          tagFeatures: {
            cosineSimilarity: item.baseScore,
            cosineSimilaritySquared: item.baseScore * item.baseScore,
            maxTagScore,
            sumTagScores,
            directMatchCount,
            synonymMatchCount, // TODO: Calculate if needed
            relatedMatchCount, // TODO: Calculate if needed
            maxOppositeTagScore,
            sumOppositeTagScores,
          },
          popularityFeatures: item.popularityMetrics || {
            showCount: 0,
            clickCount: 0,
            ctr: 0,
          },
          hubFeatures: {
            hubCount,
            hubScore,
            logHubCount,
            normalizedHubScore,
          },
        }
      })
      
      // Log impressions asynchronously (don't block response)
      logSearchImpressions(impressions).catch((error) => {
        console.error(`[search] Failed to log impressions:`, error.message)
      })
      
      // Deduplicate sites by ID (keep best match per site)
      const siteMap = new Map<string, { site: any; score: number }>()
      for (const r of finalRanked) {
        const siteId = r.site.id
        const existing = siteMap.get(siteId)
        if (!existing || r.score > existing.score) {
          siteMap.set(siteId, { site: r.site, score: r.score })
        }
      }
      // Sort by score (descending) to maintain ranking
      const uniqueSites = Array.from(siteMap.values())
        .sort((a, b) => b.score - a.score)
        .map(item => item.site)
      
      // Return results
      return NextResponse.json({ 
        query: q, 
        sites: uniqueSites,
        images: finalRanked
      })
    }

    // Fallback to old concept-expansion logic (if zeroShot is false)
    // Query is already normalized to lowercase
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


