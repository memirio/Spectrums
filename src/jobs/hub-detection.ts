/**
 * Hub Detection Job
 * 
 * Detects hub images that appear frequently in search results across diverse queries.
 * This is computationally expensive (runs 1,517 queries), so it should be run
 * asynchronously in the background with debouncing.
 */

import { prisma } from '@/lib/prisma'
import { embedTextBatch } from '@/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

interface ImageWithEmbedding {
  id: string
  embedding: number[]
}

export interface HubStats {
  hubCount: number
  hubScore: number
  avgCosineSimilarity: number
  avgCosineSimilarityMargin: number
}

/**
 * Build test queries from concepts and synthetic phrases
 */
async function buildTestQueries(): Promise<string[]> {
  const queries: string[] = []
  
  // 1. Get all concept labels
  const concepts = await prisma.concept.findMany({
    select: { label: true },
  })
  
  for (const concept of concepts) {
    const normalized = concept.label.trim().toLowerCase()
    if (normalized.length > 0) {
      queries.push(normalized)
    }
  }
  
  // 2. Add synthetic phrases for styles/feelings
  const syntheticQueries = [
    'cozy ui',
    'fun website',
    'cinematic hero',
    'minimal design',
    'brutalist interface',
    'dark mode',
    'light theme',
    'colorful design',
    'monochrome',
    'gradient background',
    'bold typography',
    'geometric shapes',
    'organic shapes',
    'flat design',
    'skeuomorphic',
    'modern website',
    'retro design',
    'futuristic ui',
    'playful interface',
    'serious design',
    'elegant website',
    'bold website',
    'subtle design',
    'high contrast',
    'low contrast',
    'warm colors',
    'cool colors',
    'vibrant palette',
    'muted palette',
    'clean layout',
    'busy layout',
    'spacious design',
    'compact design',
  ]
  
  for (const query of syntheticQueries) {
    queries.push(query.trim().toLowerCase())
  }
  
  // Remove duplicates and normalize
  const uniqueQueries = Array.from(new Set(queries.map(q => q.trim().toLowerCase()).filter(Boolean)))
  
  return uniqueQueries
}

/**
 * Load all images with embeddings
 */
async function loadAllImagesWithEmbeddings(): Promise<ImageWithEmbedding[]> {
  const images = await prisma.image.findMany({
    where: {
      embedding: {
        isNot: null,
      },
    },
    include: {
      embedding: true,
    },
  })
  
  const imagesWithEmbeddings: ImageWithEmbedding[] = []
  
  for (const img of images) {
    if (img.embedding?.vector) {
      const vector = img.embedding.vector as unknown as number[]
      if (Array.isArray(vector) && vector.length > 0) {
        imagesWithEmbeddings.push({
          id: img.id,
          embedding: vector,
        })
      }
    }
  }
  
  return imagesWithEmbeddings
}

/**
 * Compute top N images for a query with their scores
 */
function getTopNImagesWithScores(
  queryEmbedding: number[],
  images: ImageWithEmbedding[],
  topN: number = 40
): Array<{ imageId: string; score: number }> {
  const scored = images.map(img => ({
    imageId: img.id,
    score: cosine(queryEmbedding, img.embedding),
  }))
  
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topN)
}

/**
 * Detect hub images by running test queries
 */
export async function detectHubImages(
  topN: number = 40,
  thresholdMultiplier: number = 1.5,
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, HubStats>> {
  console.log(`[hub-detection] Starting hub detection...`)
  console.log(`[hub-detection] Top N: ${topN}, Threshold multiplier: ${thresholdMultiplier}x`)
  
  // 1. Build test queries
  const queries = await buildTestQueries()
  console.log(`[hub-detection] Built ${queries.length} test queries`)
  
  // 2. Load all images with embeddings
  const images = await loadAllImagesWithEmbeddings()
  console.log(`[hub-detection] Loaded ${images.length} images with embeddings`)
  
  if (images.length === 0) {
    console.warn(`[hub-detection] No images with embeddings found`)
    return new Map()
  }
  
  const hubCounts = new Map<string, number>()
  const hubScoreSums = new Map<string, number>()
  const hubMarginSums = new Map<string, number>()
  const hubMarginCounts = new Map<string, number>()
  
  // Process queries in batches
  const BATCH_SIZE = 10
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(queries.length / BATCH_SIZE)
    
    if (batchNum % 10 === 0 || batchNum === totalBatches) {
      console.log(`[hub-detection] Processing batch ${batchNum}/${totalBatches} (${i + batch.length}/${queries.length} queries)`)
    }
    
    // Embed batch of queries
    const queryEmbeddings = await embedTextBatch(batch)
    
    // For each query, get top N images with their scores
    for (let j = 0; j < batch.length; j++) {
      const query = batch[j]
      const queryEmbedding = queryEmbeddings[j]
      
      if (!queryEmbedding || queryEmbedding.length === 0) {
        continue
      }
      
      const topNImages = getTopNImagesWithScores(queryEmbedding, images, topN)
      
      // Calculate average cosine similarity for this query's top N
      const queryAvgScore = topNImages.length > 0
        ? topNImages.reduce((sum, img) => sum + img.score, 0) / topNImages.length
        : 0
      
      // Increment hub count and sum scores for each image in top N
      for (const { imageId, score } of topNImages) {
        hubCounts.set(imageId, (hubCounts.get(imageId) || 0) + 1)
        hubScoreSums.set(imageId, (hubScoreSums.get(imageId) || 0) + score)
        
        const margin = score - queryAvgScore
        hubMarginSums.set(imageId, (hubMarginSums.get(imageId) || 0) + margin)
        hubMarginCounts.set(imageId, (hubMarginCounts.get(imageId) || 0) + 1)
      }
      
      const current = i + j + 1
      if (onProgress) {
        onProgress(current, queries.length)
      }
    }
  }
  
  console.log(`[hub-detection] Processed all ${queries.length} queries`)
  
  // Compute hub scores
  const totalImages = images.length
  const expectedHubScore = topN / totalImages
  const hubThreshold = expectedHubScore * thresholdMultiplier
  
  console.log(`[hub-detection] Statistical thresholds:`)
  console.log(`[hub-detection]   Total images: ${totalImages}`)
  console.log(`[hub-detection]   Expected hub score (random): ${expectedHubScore.toFixed(4)}`)
  console.log(`[hub-detection]   Hub threshold: ${hubThreshold.toFixed(4)}`)
  
  const hubStats = new Map<string, HubStats>()
  let hubCount = 0
  let nonHubCount = 0
  
  for (const [imageId, count] of hubCounts.entries()) {
    const hubScore = count / queries.length
    const scoreSum = hubScoreSums.get(imageId) || 0
    const avgCosineSimilarity = count > 0 ? scoreSum / count : 0
    
    const marginSum = hubMarginSums.get(imageId) || 0
    const marginCount = hubMarginCounts.get(imageId) || 0
    const avgCosineSimilarityMargin = marginCount > 0 ? marginSum / marginCount : 0
    
    if (hubScore > hubThreshold) {
      hubStats.set(imageId, {
        hubCount: count,
        hubScore,
        avgCosineSimilarity,
        avgCosineSimilarityMargin,
      })
      hubCount++
    } else {
      nonHubCount++
    }
  }
  
  console.log(`[hub-detection] Identified ${hubCount} hubs (above threshold), ${nonHubCount} below threshold`)
  
  return hubStats
}

/**
 * Write hub stats to database
 */
export async function writeHubStatsToDatabase(
  hubStats: Map<string, HubStats>,
  clearExisting: boolean = false
): Promise<void> {
  console.log(`[hub-detection] Writing hub stats to database...`)
  
  if (clearExisting) {
    try {
      await prisma.$executeRaw`UPDATE images SET hubCount = NULL, hubScore = NULL, hubAvgCosineSimilarity = NULL, hubAvgCosineSimilarityMargin = NULL WHERE hubCount IS NOT NULL OR hubScore IS NOT NULL`
    } catch (error: any) {
      await prisma.image.updateMany({
        where: {
          OR: [
            { hubCount: { not: null } },
            { hubScore: { not: null } },
          ],
        },
        data: {
          hubCount: null,
          hubScore: null,
        },
      })
    }
  }
  
  let updated = 0
  const batchSize = 100
  const imageIds = Array.from(hubStats.keys())
  
  for (let i = 0; i < imageIds.length; i += batchSize) {
    const batch = imageIds.slice(i, i + batchSize)
    
    for (const imageId of batch) {
      const stats = hubStats.get(imageId)!
      try {
        // If hubScore is 0, clear hub status (below threshold)
        if (stats.hubScore === 0) {
          await prisma.$executeRaw`
            UPDATE images 
            SET hubCount = NULL, 
                hubScore = NULL,
                hubAvgCosineSimilarity = NULL,
                hubAvgCosineSimilarityMargin = NULL
            WHERE id = ${imageId}
          `.catch(async (error: any) => {
            if (error.message.includes('hubAvgCosineSimilarity')) {
              await prisma.image.update({
                where: { id: imageId },
                data: {
                  hubCount: null,
                  hubScore: null,
                },
              })
            } else {
              throw error
            }
          })
        } else {
          // Above threshold - set hub stats
          await prisma.$executeRaw`
            UPDATE images 
            SET hubCount = ${stats.hubCount}, 
                hubScore = ${stats.hubScore},
                hubAvgCosineSimilarity = ${stats.avgCosineSimilarity},
                hubAvgCosineSimilarityMargin = ${stats.avgCosineSimilarityMargin}
            WHERE id = ${imageId}
          `.catch(async (error: any) => {
            if (error.message.includes('hubAvgCosineSimilarity')) {
              await prisma.image.update({
                where: { id: imageId },
                data: {
                  hubCount: stats.hubCount,
                  hubScore: stats.hubScore,
                },
              })
            } else {
              throw error
            }
          })
        }
        updated++
      } catch (error: any) {
        console.warn(`[hub-detection] Failed to update image ${imageId}: ${error.message}`)
      }
    }
  }
  
  console.log(`[hub-detection] Updated ${updated} images with hub stats`)
}

/**
 * Incremental hub detection for specific image(s)
 * Only processes the specified images, not all images
 */
export async function detectHubForImages(
  imageIds: string[],
  topN: number = 40,
  thresholdMultiplier: number = 1.5
): Promise<Map<string, HubStats>> {
  if (imageIds.length === 0) {
    return new Map()
  }

  console.log(`[hub-detection] Starting incremental hub detection for ${imageIds.length} image(s)...`)
  console.log(`[hub-detection] Top N: ${topN}, Threshold multiplier: ${thresholdMultiplier}x`)
  
  // 1. Load only the specified images with embeddings
  const targetImages = await prisma.image.findMany({
    where: {
      id: { in: imageIds },
      embedding: { isNot: null },
    },
    include: {
      embedding: true,
    },
  })
  
  if (targetImages.length === 0) {
    console.warn(`[hub-detection] No images with embeddings found for specified IDs`)
    return new Map()
  }
  
  const targetImageEmbeddings: ImageWithEmbedding[] = []
  for (const img of targetImages) {
    if (img.embedding?.vector) {
      const vector = img.embedding.vector as unknown as number[]
      if (Array.isArray(vector) && vector.length > 0) {
        targetImageEmbeddings.push({
          id: img.id,
          embedding: vector,
        })
      }
    }
  }
  
  console.log(`[hub-detection] Loaded ${targetImageEmbeddings.length} target image(s) with embeddings`)
  
  // 2. Load ALL images (needed to compute top N for each query)
  const allImages = await loadAllImagesWithEmbeddings()
  console.log(`[hub-detection] Loaded ${allImages.length} total images (for top N comparison)`)
  
  if (allImages.length === 0) {
    console.warn(`[hub-detection] No images with embeddings found`)
    return new Map()
  }
  
  // 3. Build test queries
  const queries = await buildTestQueries()
  console.log(`[hub-detection] Built ${queries.length} test queries`)
  
  // 4. Track stats only for target images
  const hubCounts = new Map<string, number>()
  const hubScoreSums = new Map<string, number>()
  const hubMarginSums = new Map<string, number>()
  const hubMarginCounts = new Map<string, number>()
  
  // 5. Process queries in batches
  const BATCH_SIZE = 10
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(queries.length / BATCH_SIZE)
    
    if (batchNum % 50 === 0 || batchNum === totalBatches) {
      console.log(`[hub-detection] Processing batch ${batchNum}/${totalBatches} (${i + batch.length}/${queries.length} queries)`)
    }
    
    // Embed batch of queries
    const queryEmbeddings = await embedTextBatch(batch)
    
    // For each query, get top N images with their scores
    for (let j = 0; j < batch.length; j++) {
      const queryEmbedding = queryEmbeddings[j]
      
      if (!queryEmbedding || queryEmbedding.length === 0) {
        continue
      }
      
      // Get top N images from ALL images (for comparison)
      const topNImages = getTopNImagesWithScores(queryEmbedding, allImages, topN)
      
      // Calculate average cosine similarity for this query's top N
      const queryAvgScore = topNImages.length > 0
        ? topNImages.reduce((sum, img) => sum + img.score, 0) / topNImages.length
        : 0
      
      // Check if any target images are in top N
      const targetImageIdsSet = new Set(targetImageEmbeddings.map(img => img.id))
      for (const { imageId, score } of topNImages) {
        if (targetImageIdsSet.has(imageId)) {
          // This target image appeared in top N for this query
          hubCounts.set(imageId, (hubCounts.get(imageId) || 0) + 1)
          hubScoreSums.set(imageId, (hubScoreSums.get(imageId) || 0) + score)
          
          const margin = score - queryAvgScore
          hubMarginSums.set(imageId, (hubMarginSums.get(imageId) || 0) + margin)
          hubMarginCounts.set(imageId, (hubMarginCounts.get(imageId) || 0) + 1)
        }
      }
    }
  }
  
  console.log(`[hub-detection] Processed all ${queries.length} queries`)
  
  // 6. Compute hub scores for target images only
  const totalImages = allImages.length
  const expectedHubScore = topN / totalImages
  const hubThreshold = expectedHubScore * thresholdMultiplier
  
  console.log(`[hub-detection] Statistical thresholds:`)
  console.log(`[hub-detection]   Total images: ${totalImages}`)
  console.log(`[hub-detection]   Expected hub score (random): ${expectedHubScore.toFixed(4)}`)
  console.log(`[hub-detection]   Hub threshold: ${hubThreshold.toFixed(4)}`)
  
  const hubStats = new Map<string, HubStats>()
  let hubCount = 0
  let nonHubCount = 0
  
  for (const imageId of imageIds) {
    const count = hubCounts.get(imageId) || 0
    const hubScore = count / queries.length
    const scoreSum = hubScoreSums.get(imageId) || 0
    const avgCosineSimilarity = count > 0 ? scoreSum / count : 0
    
    const marginSum = hubMarginSums.get(imageId) || 0
    const marginCount = hubMarginCounts.get(imageId) || 0
    const avgCosineSimilarityMargin = marginCount > 0 ? marginSum / marginCount : 0
    
    // Only store stats if above threshold (hub), otherwise we'll clear it
    if (hubScore > hubThreshold) {
      hubStats.set(imageId, {
        hubCount: count,
        hubScore,
        avgCosineSimilarity,
        avgCosineSimilarityMargin,
      })
      hubCount++
    } else {
      // Below threshold - we'll set hub stats to null to clear hub status
      // But we still need to update the record, so we'll store it with hubScore = 0
      // and then in writeHubStatsToDatabase, we'll handle clearing
      hubStats.set(imageId, {
        hubCount: count,
        hubScore: 0, // Below threshold - will be cleared
        avgCosineSimilarity,
        avgCosineSimilarityMargin,
      })
      nonHubCount++
    }
  }
  
  console.log(`[hub-detection] Identified ${hubCount} hub(s) (above threshold), ${nonHubCount} below threshold`)
  
  return hubStats
}

/**
 * Run hub detection and save to database
 * This is the main entry point for the pipeline
 */
export async function runHubDetection(
  topN: number = 40,
  thresholdMultiplier: number = 1.5,
  clearExisting: boolean = false
): Promise<void> {
  try {
    const hubStats = await detectHubImages(topN, thresholdMultiplier)
    await writeHubStatsToDatabase(hubStats, clearExisting)
    console.log(`[hub-detection] ✅ Hub detection complete`)
  } catch (error: any) {
    console.error(`[hub-detection] ❌ Error: ${error.message}`)
    throw error
  }
}

/**
 * Run incremental hub detection for specific images and save to database
 */
export async function runHubDetectionForImages(
  imageIds: string[],
  topN: number = 40,
  thresholdMultiplier: number = 1.5
): Promise<void> {
  try {
    const hubStats = await detectHubForImages(imageIds, topN, thresholdMultiplier)
    await writeHubStatsToDatabase(hubStats, false) // Don't clear existing, just update these images
    console.log(`[hub-detection] ✅ Incremental hub detection complete for ${imageIds.length} image(s)`)
  } catch (error: any) {
    console.error(`[hub-detection] ❌ Error: ${error.message}`)
    throw error
  }
}

