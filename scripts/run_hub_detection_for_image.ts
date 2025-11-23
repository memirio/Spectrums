#!/usr/bin/env tsx
/**
 * Run hub detection for a specific image
 */

import 'dotenv/config'
import { runHubDetectionForImages } from '../src/jobs/hub-detection'
import { prisma } from '../src/lib/prisma'

async function main() {
  const imageId = process.argv[2]
  
  if (!imageId) {
    console.error('Usage: npx tsx scripts/run_hub_detection_for_image.ts <imageId>')
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
    console.error(`❌ Image has no embedding. Cannot run hub detection.`)
    process.exit(1)
  }

  console.log('🔍 Running hub detection for image:')
  console.log(`   ID: ${image.id}`)
  console.log(`   Site: ${image.site?.url || 'N/A'}`)
  console.log(`   URL: ${image.url}`)
  console.log('')
  console.log('⏳ This may take a few minutes (processing ~1,517 test queries)...')
  console.log('')

  try {
    await runHubDetectionForImages([imageId], 40, 1.5)
    console.log('')
    console.log('✅ Hub detection complete!')
    
    // Fetch updated stats
    const updated = await prisma.image.findUnique({
      where: { id: imageId },
      select: {
        hubCount: true,
        hubScore: true,
        hubAvgCosineSimilarity: true,
        hubAvgCosineSimilarityMargin: true,
      }
    })
    
    console.log('')
    console.log('📊 Updated Hub Statistics:')
    console.log(`   hubCount: ${updated?.hubCount ?? 'NULL'}`)
    console.log(`   hubScore: ${updated?.hubScore?.toFixed(4) ?? 'NULL'}`)
    console.log(`   hubAvgCosineSimilarity: ${updated?.hubAvgCosineSimilarity?.toFixed(4) ?? 'NULL'}`)
    console.log(`   hubAvgCosineSimilarityMargin: ${updated?.hubAvgCosineSimilarityMargin?.toFixed(4) ?? 'NULL'}`)
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

