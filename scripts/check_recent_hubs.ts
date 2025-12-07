#!/usr/bin/env tsx
/**
 * Check hub detection for recent packaging images
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking hub detection for recent packaging images...\n')
  
  // Get recent packaging images
  const recentPackagingImages = await prisma.image.findMany({
    where: {
      category: 'packaging',
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      url: true,
      createdAt: true,
      hubCount: true,
      hubScore: true,
      hubAvgCosineSimilarity: true,
      siteId: true,
    },
  })
  
  console.log(`📊 Recent packaging images: ${recentPackagingImages.length}`)
  
  // Get sites for these images
  const siteIds = recentPackagingImages.map(img => img.siteId).filter(Boolean) as string[]
  const sites = siteIds.length > 0 ? await prisma.site.findMany({
    where: { id: { in: siteIds } },
    select: { id: true, title: true },
  }) : []
  const siteMap = new Map(sites.map(s => [s.id, s]))
  
  // Count images with hub stats
  const withHubStats = recentPackagingImages.filter(img => 
    img.hubCount !== null || img.hubScore !== null
  )
  
  console.log(`\n📈 Hub Detection Status:`)
  console.log(`  Total recent packaging images: ${recentPackagingImages.length}`)
  console.log(`  Images with hub stats: ${withHubStats.length}`)
  console.log(`  Images without hub stats: ${recentPackagingImages.length - withHubStats.length}`)
  
  if (withHubStats.length > 0) {
    console.log(`\n✅ Images with hub stats:`)
    withHubStats.slice(0, 20).forEach(img => {
      const site = img.siteId ? siteMap.get(img.siteId) : null
      console.log(`  - ${site?.title || img.id}`)
      console.log(`    Hub Count: ${img.hubCount || 0}`)
      console.log(`    Hub Score: ${img.hubScore?.toFixed(4) || 'N/A'}`)
      console.log(`    Avg Similarity: ${img.hubAvgCosineSimilarity?.toFixed(4) || 'N/A'}`)
      console.log('')
    })
  } else {
    console.log(`\n⚠️  No hub stats found for recent packaging images`)
    console.log(`\n💡 Hub detection runs asynchronously:`)
    console.log(`   - Triggered automatically when images are tagged`)
    console.log(`   - Debounced with 5-minute delay`)
    console.log(`   - Processes images in batches`)
    console.log(`   - May take several minutes to complete`)
    console.log(`\n💡 To check if hub detection is running, check server logs for:`)
    console.log(`   [hub-detection-trigger] or [hub-detection] messages`)
  }
  
  // Check overall hub stats
  const totalWithHubs = await prisma.image.count({
    where: {
      hubScore: { not: null },
      category: 'packaging',
    },
  })
  
  const totalPackaging = await prisma.image.count({
    where: { category: 'packaging' },
  })
  
  console.log(`\n📊 Overall Packaging Hub Stats:`)
  console.log(`  Total packaging images: ${totalPackaging}`)
  console.log(`  Packaging images with hub stats: ${totalWithHubs}`)
  console.log(`  Percentage: ${totalPackaging > 0 ? ((totalWithHubs / totalPackaging) * 100).toFixed(1) : 0}%`)
}

main().catch(console.error)


