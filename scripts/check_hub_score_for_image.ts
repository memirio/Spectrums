#!/usr/bin/env tsx
/**
 * Check hub score for a specific image (even if below threshold)
 * This calculates and displays the actual hub score without saving to DB
 */

import 'dotenv/config'
import { detectHubForImages } from '../src/jobs/hub-detection'
import { prisma } from '../src/lib/prisma'

async function main() {
  const imageId = process.argv[2]
  
  if (!imageId) {
    console.error('Usage: npx tsx scripts/check_hub_score_for_image.ts <imageId>')
    process.exit(1)
  }

  // Verify image exists
  const image = await prisma.image.findUnique({
    where: { id: imageId },
    include: { site: true, embedding: true }
  })

  if (!image) {
    console.error(`❌ Image not found: ${imageId}`)
    process.exit(1)
  }

  if (!image.embedding) {
    console.error(`❌ Image has no embedding. Cannot calculate hub score.`)
    process.exit(1)
  }

  console.log('🔍 Calculating hub score for image:')
  console.log(`   ID: ${image.id}`)
  console.log(`   Site: ${image.site?.url || 'N/A'}`)
  console.log(`   URL: ${image.url}`)
  console.log('')
  console.log('⏳ Processing ~4,226 test queries (this may take a few minutes)...')
  console.log('')

  try {
    const topN = 40
    const thresholdMultiplier = 1.5
    
    // Calculate hub stats (but don't save to DB)
    const hubStats = await detectHubForImages([imageId], topN, thresholdMultiplier)
    
    const stats = hubStats.get(imageId)
    
    if (!stats) {
      console.log('❌ No hub stats calculated (image may not have appeared in any top results)')
      await prisma.$disconnect()
      return
    }

    // Calculate threshold for reference
    const totalImages = 415 // From previous run
    const expectedHubScore = topN / totalImages
    const hubThreshold = expectedHubScore * thresholdMultiplier
    
    console.log('')
    console.log('📊 Hub Statistics:')
    console.log(`   hubCount: ${stats.hubCount}`)
    console.log(`   hubScore: ${stats.hubScore.toFixed(6)} (${(stats.hubScore * 100).toFixed(2)}%)`)
    console.log(`   hubAvgCosineSimilarity: ${stats.avgCosineSimilarity.toFixed(4)}`)
    console.log(`   hubAvgCosineSimilarityMargin: ${stats.avgCosineSimilarityMargin.toFixed(4)}`)
    console.log('')
    console.log('📏 Threshold Information:')
    console.log(`   Expected (random): ${expectedHubScore.toFixed(6)} (${(expectedHubScore * 100).toFixed(2)}%)`)
    console.log(`   Hub Threshold: ${hubThreshold.toFixed(6)} (${(hubThreshold * 100).toFixed(2)}%)`)
    console.log('')
    
    if (stats.hubScore > hubThreshold) {
      console.log('✅ Image IS a hub (above threshold)')
    } else {
      const diff = hubThreshold - stats.hubScore
      const diffPct = (diff / hubThreshold) * 100
      console.log(`❌ Image is NOT a hub (below threshold by ${diff.toFixed(6)} or ${diffPct.toFixed(2)}%)`)
      console.log(`   Would need to appear in ${Math.ceil(hubThreshold * 4226)} queries (currently appears in ${stats.hubCount})`)
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

