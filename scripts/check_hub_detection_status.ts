#!/usr/bin/env tsx
/**
 * Check if hub detection has run on recently added images
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  // Get recently added sites (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentSites = await prisma.site.findMany({
    where: {
      createdAt: { gte: oneDayAgo }
    },
    include: {
      images: {
        take: 1,
        select: {
          id: true,
          hubScore: true,
          hubCount: true,
          hubAvgCosineSimilarity: true,
          hubAvgCosineSimilarityMargin: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${recentSites.length} sites added in the last 2 hours\n`)
  
  let withHubStats = 0
  let withoutHubStats = 0
  
  for (const site of recentSites) {
    const image = site.images[0]
    if (image) {
      const hasHubStats = image.hubScore !== null && image.hubScore !== undefined
      if (hasHubStats) {
        withHubStats++
      } else {
        withoutHubStats++
        console.log(`❌ ${site.title}:`)
        console.log(`   Image ID: ${image.id}`)
        console.log(`   Hub Score: null`)
        console.log(`   Created: ${image.createdAt}`)
        console.log('')
      }
    }
  }
  
  console.log('='.repeat(60))
  console.log(`📊 Summary:`)
  console.log(`   ✅ With hub stats: ${withHubStats}`)
  console.log(`   ❌ Without hub stats: ${withoutHubStats}`)
  console.log(`   📊 Total: ${recentSites.length}`)
  console.log('='.repeat(60))
  
  if (withoutHubStats > 0) {
    console.log(`\n⚠️  ${withoutHubStats} image(s) are missing hub stats.`)
    console.log(`   Hub detection should run automatically via Pipeline 2.0.`)
    console.log(`   If it didn't run, you can manually trigger it with:`)
    console.log(`   npx tsx scripts/update_hub_stats_from_interactions.ts`)
  } else {
    console.log(`\n✅ All recently added images have hub stats!`)
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)

