/**
 * User interaction logging for learned reranker
 * 
 * Logs search interactions (queries, clicks, saves, dwell time) to enable
 * training a learned reranker model that adapts to user behavior.
 * 
 * Can be used in development (with manual/test interactions) or production.
 */

import { prisma } from './prisma'

export interface SearchImpression {
  query: string
  queryEmbedding: number[]
  imageId: string
  position: number
  baseScore: number
  tagFeatures: {
    cosineSimilarity: number
    cosineSimilaritySquared: number
    maxTagScore: number
    sumTagScores: number
    directMatchCount: number
    synonymMatchCount: number
    relatedMatchCount: number
    maxOppositeTagScore: number
    sumOppositeTagScores: number
  }
}

export interface UserAction {
  imageId: string
  clicked: boolean
  saved?: boolean
  dwellTime?: number // milliseconds
}

/**
 * Log a search impression (query results shown to user)
 * Call this when returning search results
 */
export async function logSearchImpression(impression: SearchImpression): Promise<void> {
  try {
    await prisma.userInteraction.create({
      data: {
        query: impression.query,
        queryEmbedding: impression.queryEmbedding,
        imageId: impression.imageId,
        position: impression.position,
        baseScore: impression.baseScore,
        tagFeatures: impression.tagFeatures,
        clicked: false, // Will be updated when user clicks
        saved: false,
      },
    })
  } catch (error: any) {
    // Silently fail - logging shouldn't break search
    console.error(`[interaction-logger] Failed to log impression:`, error.message)
  }
}

/**
 * Log multiple search impressions (batch)
 * More efficient for logging all results from a query
 */
export async function logSearchImpressions(impressions: SearchImpression[]): Promise<void> {
  try {
    await prisma.userInteraction.createMany({
      data: impressions.map(imp => ({
        query: imp.query,
        queryEmbedding: imp.queryEmbedding,
        imageId: imp.imageId,
        position: imp.position,
        baseScore: imp.baseScore,
        tagFeatures: imp.tagFeatures,
        clicked: false,
        saved: false,
      })),
      skipDuplicates: true, // Skip if already exists (idempotent)
    })
  } catch (error: any) {
    console.error(`[interaction-logger] Failed to log impressions:`, error.message)
  }
}

// Track if we've already notified about reaching 1000 interactions
let hasNotified1000 = false

/**
 * Update interaction with user action (click, save, dwell time)
 * Call this when user clicks on a result or saves it
 */
export async function logUserAction(
  query: string,
  action: UserAction
): Promise<void> {
  try {
    // Find the most recent impression for this query + image
    const interaction = await prisma.userInteraction.findFirst({
      where: {
        query: query,
        imageId: action.imageId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    if (interaction) {
      await prisma.userInteraction.update({
        where: { id: interaction.id },
        data: {
          clicked: action.clicked,
          saved: action.saved ?? false,
          dwellTime: action.dwellTime ?? null,
        },
      })
    } else {
      // If no impression found, create a new interaction
      // (might happen if user clicks before impression is logged)
      await prisma.userInteraction.create({
        data: {
          query: query,
          imageId: action.imageId,
          position: 0, // Unknown position
          clicked: action.clicked,
          saved: action.saved ?? false,
          dwellTime: action.dwellTime ?? null,
        },
      })
    }

    // Check if we've reached 1000 interactions (only check once)
    if (!hasNotified1000) {
      const totalCount = await prisma.userInteraction.count()
      if (totalCount >= 1000) {
        hasNotified1000 = true
        console.log(`\n🎉🎉🎉 MILESTONE REACHED! 🎉🎉🎉`)
        console.log(`✅ You now have ${totalCount} interactions - ready to train the learned reranker!`)
        console.log(`📊 Run: npx tsx scripts/check-interaction-stats.ts for detailed stats`)
        console.log(`🚀 See: docs/LEARNED_RERANKER_PLAN.md for next steps\n`)
      }
    }
  } catch (error: any) {
    console.error(`[interaction-logger] Failed to log action:`, error.message)
  }
}

/**
 * Get interaction statistics (for monitoring)
 */
export async function getInteractionStats(): Promise<{
  totalImpressions: number
  totalClicks: number
  totalSaves: number
  uniqueQueries: number
  clickThroughRate: number
}> {
  try {
    const [totalImpressions, totalClicks, totalSaves, uniqueQueries] = await Promise.all([
      prisma.userInteraction.count(),
      prisma.userInteraction.count({ where: { clicked: true } }),
      prisma.userInteraction.count({ where: { saved: true } }),
      prisma.userInteraction.groupBy({
        by: ['query'],
        _count: true,
      }).then(groups => groups.length),
    ])

    return {
      totalImpressions,
      totalClicks,
      totalSaves,
      uniqueQueries,
      clickThroughRate: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    }
  } catch (error: any) {
    console.error(`[interaction-logger] Failed to get stats:`, error.message)
    return {
      totalImpressions: 0,
      totalClicks: 0,
      totalSaves: 0,
      uniqueQueries: 0,
      clickThroughRate: 0,
    }
  }
}

