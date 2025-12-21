#!/usr/bin/env tsx
/**
 * Run Hub Detection on Newly Added Images
 * 
 * This script finds recently added images and runs hub detection on them.
 * Hub detection uses extensions + tags to identify frequently appearing images.
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { updateHubStatsForImage } from '../src/jobs/hub-detection-extensions'

async function main() {
  console.log('🔍 Finding recently added images...\n')

  // Find images added in the last 7 days (or all images if you want to check everything)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Get all images from the last 7 days, or all images without hub stats
  const recentImages = await prisma.image.findMany({
    where: {
      OR: [
        { createdAt: { gte: sevenDaysAgo } },
        { hubCount: null }, // Images without hub stats
      ],
    },
    select: {
      id: true,
      createdAt: true,
      hubCount: true,
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log(`📊 Found ${recentImages.length} images to process\n`)

  if (recentImages.length === 0) {
    console.log('✅ No images to process')
    await prisma.$disconnect()
    return
  }

  const results = {
    processed: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ imageId: string; error: string }>,
  }

  // Process in batches to avoid overwhelming the database
  const batchSize = 10
  for (let i = 0; i < recentImages.length; i += batchSize) {
    const batch = recentImages.slice(i, i + batchSize)
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recentImages.length / batchSize)} (${batch.length} images)...`)

    for (const image of batch) {
      try {
        console.log(`\n[${image.id}] Processing...`)
        console.log(`  Category: ${image.category || 'unknown'}`)
        console.log(`  Created: ${image.createdAt.toISOString()}`)
        console.log(`  Current hubCount: ${image.hubCount ?? 'null'}`)

        // Check if image has interactions (required for hub detection)
        const interactionCount = await prisma.userInteraction.count({
          where: { imageId: image.id },
        })

        if (interactionCount === 0) {
          console.log(`  ⚠️  No interactions found - hub detection requires user interactions`)
          console.log(`  ℹ️  Hub detection will run automatically when users interact with this image`)
          results.skipped++
          continue
        }

        console.log(`  📊 Found ${interactionCount} interaction(s)`)

        // Run hub detection
        await updateHubStatsForImage(image.id)
        results.processed++

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`)
        results.failed++
        results.errors.push({
          imageId: image.id,
          error: error.message,
        })
      }
    }

    // Delay between batches
    if (i + batchSize < recentImages.length) {
      console.log(`\n⏳ Waiting 2 seconds before next batch...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Processed: ${results.processed}`)
  console.log(`⚠️  Skipped (no interactions): ${results.skipped}`)
  console.log(`❌ Failed: ${results.failed}`)

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => {
      console.log(`  - ${err.imageId}: ${err.error}`)
    })
  }

  console.log('\n✅ Done!')
  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('❌ Error:', err)
  await prisma.$disconnect()
  process.exit(1)
})

