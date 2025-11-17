#!/usr/bin/env tsx
/**
 * Detect Hub Images
 * 
 * This script identifies "hub" images that appear frequently in top 20 results
 * across many different queries. These images can dominate search results even
 * when they're not the most relevant.
 * 
 * Usage:
 *   npx tsx scripts/detect_hub_images.ts
 *   npx tsx scripts/detect_hub_images.ts --clear
 *   npx tsx scripts/detect_hub_images.ts --top-n 10
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

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

interface HubStats {
  hubCount: number
  hubScore: number
  avgCosineSimilarity: number // Average cosine similarity across all queries where image appears
  avgCosineSimilarityMargin: number // Average margin above query average (how much higher than average)
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
  console.log('📖 Loading all images with embeddings...')
  
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
  
  console.log(`   ✅ Loaded ${imagesWithEmbeddings.length} images with embeddings`)
  return imagesWithEmbeddings
}

/**
 * Compute top N images for a query with their scores
 */
function getTopNImagesWithScores(
  queryEmbedding: number[],
  images: ImageWithEmbedding[],
  topN: number = 20
): Array<{ imageId: string; score: number }> {
  // Compute similarities
  const scored = images.map(img => ({
    imageId: img.id,
    score: cosine(queryEmbedding, img.embedding),
  }))
  
  // Sort by score (descending)
  scored.sort((a, b) => b.score - a.score)
  
  // Return top N images with their scores
  return scored.slice(0, topN)
}

/**
 * Detect hub images by running test queries
 */
async function detectHubImages(
  images: ImageWithEmbedding[],
  queries: string[],
  topN: number = 40,
  thresholdMultiplier: number = 1.5
): Promise<Map<string, HubStats>> {
  console.log(`\n🔍 Running ${queries.length} test queries to detect hub images...`)
  console.log(`   Top N: ${topN}`)
  
  const hubCounts = new Map<string, number>()
  const hubScoreSums = new Map<string, number>() // Sum of cosine similarities for computing average
  const hubMarginSums = new Map<string, number>() // Sum of margins (hub_score - query_avg) for computing average margin
  const hubMarginCounts = new Map<string, number>() // Count of queries where hub appears (for margin calculation)
  
  // Process queries in batches to avoid memory issues
  const BATCH_SIZE = 10
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(queries.length / BATCH_SIZE)
    
    console.log(`\n   Processing batch ${batchNum}/${totalBatches} (${batch.length} queries)...`)
    
    // Embed batch of queries
    const queryEmbeddings = await embedTextBatch(batch)
    
    // For each query, get top N images with their scores
    for (let j = 0; j < batch.length; j++) {
      const query = batch[j]
      const queryEmbedding = queryEmbeddings[j]
      
      if (!queryEmbedding || queryEmbedding.length === 0) {
        console.warn(`   ⚠️  Failed to embed query: "${query}"`)
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
        
        // Calculate margin: how much higher this hub's score is compared to query average
        const margin = score - queryAvgScore
        hubMarginSums.set(imageId, (hubMarginSums.get(imageId) || 0) + margin)
        hubMarginCounts.set(imageId, (hubMarginCounts.get(imageId) || 0) + 1)
      }
      
      if ((i + j + 1) % 10 === 0) {
        process.stdout.write(`   Processed ${i + j + 1}/${queries.length} queries...\r`)
      }
    }
  }
  
  console.log(`\n   ✅ Processed all ${queries.length} queries`)
  
  // Compute hub scores, average cosine similarity, and average margin
  // Only label images as hubs if they appear more frequently than statistically expected
  const totalImages = images.length
  const expectedHubScore = topN / totalImages // Expected fraction if random (e.g., 40/208 ≈ 0.192)
  const hubThreshold = expectedHubScore * thresholdMultiplier // Only consider hubs if multiplier x above expected
  
  console.log(`\n📊 Statistical Thresholds:`)
  console.log(`   Total images: ${totalImages}`)
  console.log(`   Top N: ${topN}`)
  console.log(`   Expected hub score (random): ${expectedHubScore.toFixed(4)}`)
  console.log(`   Hub threshold (1.5x expected): ${hubThreshold.toFixed(4)}`)
  console.log(`   Only images with hubScore > ${hubThreshold.toFixed(4)} will be labeled as hubs`)
  
  const hubStats = new Map<string, HubStats>()
  let hubCount = 0
  let nonHubCount = 0
  
  for (const [imageId, count] of hubCounts.entries()) {
    const hubScore = count / queries.length // Fraction of queries where image appears in top N
    const scoreSum = hubScoreSums.get(imageId) || 0
    const avgCosineSimilarity = count > 0 ? scoreSum / count : 0 // Average cosine similarity
    
    // Average margin: how much higher this hub is compared to query averages
    const marginSum = hubMarginSums.get(imageId) || 0
    const marginCount = hubMarginCounts.get(imageId) || 0
    const avgCosineSimilarityMargin = marginCount > 0 ? marginSum / marginCount : 0
    
    // Only store stats if this image is a statistically significant hub
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
  
  console.log(`\n   ✅ Identified ${hubCount} hubs (above threshold)`)
  console.log(`   ⚪ ${nonHubCount} images below threshold (not labeled as hubs)`)
  
  return hubStats
}

/**
 * Write hub stats to database
 */
async function writeHubStatsToDatabase(
  hubStats: Map<string, HubStats>,
  clearExisting: boolean = false
): Promise<void> {
  console.log(`\n💾 Writing hub stats to database...`)
  
  if (clearExisting) {
    console.log('   🗑️  Clearing existing hub stats...')
    // Update all images to set hub stats to null
    // Use raw SQL to clear hubAvgCosineSimilarity and hubAvgCosineSimilarityMargin as well
    try {
      await prisma.$executeRaw`UPDATE images SET hubCount = NULL, hubScore = NULL, hubAvgCosineSimilarity = NULL, hubAvgCosineSimilarityMargin = NULL WHERE hubCount IS NOT NULL OR hubScore IS NOT NULL`
    } catch (error: any) {
      // Fallback to Prisma if raw SQL fails (e.g., column doesn't exist yet)
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
    console.log('   ✅ Cleared existing hub stats')
  }
  
  // Update each image with hub stats
  let updated = 0
  const batchSize = 100
  const imageIds = Array.from(hubStats.keys())
  
  for (let i = 0; i < imageIds.length; i += batchSize) {
    const batch = imageIds.slice(i, i + batchSize)
    
    for (const imageId of batch) {
      const stats = hubStats.get(imageId)!
      try {
        // Use raw SQL to update hubAvgCosineSimilarity and hubAvgCosineSimilarityMargin (new columns)
        await prisma.$executeRaw`
          UPDATE images 
          SET hubCount = ${stats.hubCount}, 
              hubScore = ${stats.hubScore},
              hubAvgCosineSimilarity = ${stats.avgCosineSimilarity},
              hubAvgCosineSimilarityMargin = ${stats.avgCosineSimilarityMargin}
          WHERE id = ${imageId}
        `.catch(async (error: any) => {
          // If new columns don't exist, update without them
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
        updated++
      } catch (error: any) {
        console.warn(`   ⚠️  Failed to update image ${imageId}: ${error.message}`)
      }
    }
    
    if (i + batchSize < imageIds.length) {
      process.stdout.write(`   Updated ${updated}/${imageIds.length} images...\r`)
    }
  }
  
  console.log(`   ✅ Updated ${updated} images with hub stats`)
}

/**
 * Print summary statistics
 */
function printSummary(hubStats: Map<string, HubStats>, totalQueries: number): void {
  console.log('\n' + '═'.repeat(70))
  console.log('📊 Hub Detection Summary')
  console.log('═'.repeat(70))
  
  const statsArray = Array.from(hubStats.entries())
    .map(([imageId, stats]) => ({ imageId, ...stats }))
    .sort((a, b) => b.hubCount - a.hubCount)
  
  console.log(`\nTotal queries tested: ${totalQueries}`)
  console.log(`Images with hub stats: ${statsArray.length}`)
  
  if (statsArray.length === 0) {
    console.log('\n   No hub images detected.')
    return
  }
  
  // Top 10 hub images
  const top10 = statsArray.slice(0, 10)
  console.log('\n🔝 Top 10 Hub Images:')
  console.log('─'.repeat(110))
  console.log('Rank | Image ID                    | Hub Count | Hub Score | Avg Cosine Sim | Avg Margin')
  console.log('─'.repeat(110))
  
  for (let i = 0; i < top10.length; i++) {
    const item = top10[i]
    const rank = (i + 1).toString().padStart(4)
    const imageId = item.imageId.substring(0, 28).padEnd(28)
    const hubCount = item.hubCount.toString().padStart(10)
    const hubScore = item.hubScore.toFixed(4).padStart(10)
    const avgCosine = item.avgCosineSimilarity.toFixed(4).padStart(16)
    const avgMargin = item.avgCosineSimilarityMargin.toFixed(4).padStart(11)
    console.log(`${rank} | ${imageId} | ${hubCount} | ${hubScore} | ${avgCosine} | ${avgMargin}`)
  }
  
  // Statistics
  const hubCounts = statsArray.map(s => s.hubCount)
  const hubScores = statsArray.map(s => s.hubScore)
  
  const avgHubCount = hubCounts.reduce((a, b) => a + b, 0) / hubCounts.length
  const maxHubCount = Math.max(...hubCounts)
  const avgHubScore = hubScores.reduce((a, b) => a + b, 0) / hubScores.length
  const maxHubScore = Math.max(...hubScores)
  
  console.log('\n📈 Statistics:')
  console.log(`   Average hub count: ${avgHubCount.toFixed(2)}`)
  console.log(`   Maximum hub count: ${maxHubCount}`)
  console.log(`   Average hub score: ${avgHubScore.toFixed(4)}`)
  console.log(`   Maximum hub score: ${maxHubScore.toFixed(4)}`)
  
  // Count images by hub score ranges
  const highHub = statsArray.filter(s => s.hubScore >= 0.1).length
  const mediumHub = statsArray.filter(s => s.hubScore >= 0.05 && s.hubScore < 0.1).length
  const lowHub = statsArray.filter(s => s.hubScore > 0 && s.hubScore < 0.05).length
  
  console.log('\n📊 Distribution by Hub Score:')
  console.log(`   High hub (≥0.1):     ${highHub} images`)
  console.log(`   Medium hub (0.05-0.1): ${mediumHub} images`)
  console.log(`   Low hub (<0.05):     ${lowHub} images`)
  
  console.log('═'.repeat(70))
}

async function main() {
  const args = process.argv.slice(2)
  const clearExisting = args.includes('--clear')
  const topNArg = args.find(arg => arg.startsWith('--top-n='))
  const topN = topNArg ? parseInt(topNArg.split('=')[1]) || 40 : 40
  const thresholdMultiplierArg = args.find(arg => arg.startsWith('--threshold-multiplier='))
  const thresholdMultiplier = thresholdMultiplierArg ? parseFloat(thresholdMultiplierArg.split('=')[1]) || 1.5 : 1.5
  
  console.log('═'.repeat(70))
  console.log('🔍 Hub Image Detection')
  console.log('═'.repeat(70))
  console.log(`\nConfiguration:`)
  console.log(`   Top N: ${topN}`)
  console.log(`   Threshold multiplier: ${thresholdMultiplier}x expected frequency`)
  console.log(`   Clear existing: ${clearExisting ? 'Yes' : 'No'}`)
  
  try {
    // 1. Build test queries
    console.log('\n📝 Building test queries...')
    const queries = await buildTestQueries()
    console.log(`   ✅ Built ${queries.length} test queries`)
    
    // 2. Load all images with embeddings
    const images = await loadAllImagesWithEmbeddings()
    
    if (images.length === 0) {
      console.error('\n❌ No images with embeddings found!')
      process.exit(1)
    }
    
    // 3. Detect hub images
    const hubStats = await detectHubImages(images, queries, topN)
    
    // 4. Print summary
    printSummary(hubStats, queries.length)
    
    // 5. Write to database
    await writeHubStatsToDatabase(hubStats, clearExisting)
    
    console.log('\n✅ Hub detection complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Review the hub stats in the database')
    console.log('   2. Use hub_score in ranking to penalize hub images')
    console.log('   3. Re-run this script periodically to update stats')
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

