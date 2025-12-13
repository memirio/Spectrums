/**
 * Hub Detection using Extensions + Tags
 * 
 * This module detects hub images based on:
 * 1. Extended queries (actual queries used for search, including extensions)
 * 2. Image tags (concepts that images are tagged with)
 * 
 * This is more accurate than synthetic test queries because it uses actual user search patterns.
 */

import { prisma } from '@/lib/prisma'

export interface HubStatsFromExtensions {
  hubCount: number
  hubScore: number
  avgCosineSimilarity: number
  avgCosineSimilarityMargin: number
  extendedQueryCount: number // Number of unique extended queries
  tagCount: number // Number of unique tags
}

/**
 * Calculate hub stats for an image based on extended queries + tags
 */
export async function calculateHubStatsFromExtensions(
  imageId: string
): Promise<HubStatsFromExtensions | null> {
  // Get all interactions for this image
  const interactions = await prisma.userInteraction.findMany({
    where: { imageId },
    select: { 
      baseScore: true, 
      query: true,
    },
  })
  
  if (interactions.length === 0) {
    return null
  }
  
  // Get image category
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    select: { category: true },
  })
  
  if (!image) {
    return null
  }
  
  // Get all unique queries (original queries)
  const uniqueQueries = await prisma.userInteraction.groupBy({
    by: ['query'],
    where: { imageId },
  })
  
  // Get image tags (concepts)
  const imageTags = await prisma.imageTag.findMany({
    where: { imageId },
    include: { concept: { select: { label: true } } },
  })
  
  const tagLabels = imageTags.map(t => t.concept.label.toLowerCase())
  
  // Get total unique queries in system
  const allUniqueQueries = await prisma.userInteraction.groupBy({
    by: ['query'],
  })
  const totalQueries = allUniqueQueries.length
  
  // Build extended query set: original query + actual extensions + tags
  // This represents the actual semantic space the image appears in
  const extendedQueries = new Set<string>()
  const uniqueOriginalQueries = new Set(interactions.map(i => i.query.toLowerCase().trim()))
  
  // Fetch all extensions for unique queries (batch query for efficiency)
  const allExtensions = await prisma.queryExpansion.findMany({
    where: {
      term: { in: Array.from(uniqueOriginalQueries) },
      source: { in: ['vibefilter', 'searchbar'] },
      category: image.category || 'website',
    },
    select: { term: true, expansion: true },
  })
  
  // Group extensions by term
  const extensionsByTerm = new Map<string, string[]>()
  for (const ext of allExtensions) {
    const term = ext.term.toLowerCase()
    if (!extensionsByTerm.has(term)) {
      extensionsByTerm.set(term, [])
    }
    extensionsByTerm.get(term)!.push(ext.expansion.toLowerCase().trim())
  }
  
  // Build extended query set
  for (const originalQuery of uniqueOriginalQueries) {
    // Add original query
    extendedQueries.add(originalQuery)
    
    // Add actual extensions from database
    const extensions = extensionsByTerm.get(originalQuery) || []
    for (const ext of extensions) {
      extendedQueries.add(ext)
    }
    
    // Add top tags (limit to top 10 to avoid explosion)
    const topTags = tagLabels.slice(0, 10)
    for (const tag of topTags) {
      // Query + tag
      extendedQueries.add(`${originalQuery} ${tag}`)
      // Extension + tag (for each extension)
      for (const ext of extensions.slice(0, 3)) { // Limit to first 3 extensions
        extendedQueries.add(`${ext} ${tag}`)
      }
    }
  }
  
  const extendedQueryCount = extendedQueries.size
  const hubCount = uniqueQueries.length // Original query count
  const hubScore = totalQueries > 0 ? hubCount / totalQueries : 0
  
  // Calculate average cosine similarity
  const avgCosineSimilarity = interactions.length > 0
    ? interactions.reduce((sum, i) => sum + (i.baseScore || 0), 0) / interactions.length
    : 0
  
  // Calculate global average for margin
  const allInteractions = await prisma.userInteraction.findMany({
    select: { baseScore: true },
  })
  const globalAvg = allInteractions.length > 0
    ? allInteractions.reduce((sum, i) => sum + (i.baseScore || 0), 0) / allInteractions.length
    : 0
  
  const avgCosineSimilarityMargin = avgCosineSimilarity - globalAvg
  
  return {
    hubCount,
    hubScore,
    avgCosineSimilarity,
    avgCosineSimilarityMargin,
    extendedQueryCount,
    tagCount: tagLabels.length,
  }
}

/**
 * Update hub stats for an image using extensions + tags
 */
export async function updateHubStatsForImage(imageId: string): Promise<void> {
  const stats = await calculateHubStatsFromExtensions(imageId)
  
  if (!stats) {
    console.log(`[hub-detection-extensions] No interactions found for image ${imageId}, skipping`)
    return
  }
  
  await prisma.image.update({
    where: { id: imageId },
    data: {
      hubCount: stats.hubCount,
      hubScore: stats.hubScore,
      hubAvgCosineSimilarity: stats.avgCosineSimilarity,
      hubAvgCosineSimilarityMargin: stats.avgCosineSimilarityMargin,
    },
  })
  
  console.log(`[hub-detection-extensions] ✅ Updated hub stats for image ${imageId}:`)
  console.log(`   Hub Count: ${stats.hubCount}, Hub Score: ${stats.hubScore.toFixed(4)}`)
  console.log(`   Extended Query Count: ${stats.extendedQueryCount}, Tag Count: ${stats.tagCount}`)
}

/**
 * Update hub stats for multiple images
 */
export async function updateHubStatsForImages(imageIds: string[]): Promise<void> {
  console.log(`[hub-detection-extensions] Updating hub stats for ${imageIds.length} image(s)...`)
  
  for (const imageId of imageIds) {
    try {
      await updateHubStatsForImage(imageId)
    } catch (error: any) {
      console.error(`[hub-detection-extensions] Failed to update hub stats for image ${imageId}:`, error.message)
    }
  }
  
  console.log(`[hub-detection-extensions] ✅ Completed hub stats update for ${imageIds.length} image(s)`)
}

