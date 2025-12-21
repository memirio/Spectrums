#!/usr/bin/env tsx
/**
 * Manually trigger hub detection for recent packaging images
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { triggerHubDetectionForImages } from '../src/jobs/hub-detection-trigger'

async function main() {
  console.log('🔍 Finding recent packaging images without hub stats...\n')
  
  // Get recent packaging images without hub stats
  const recentImages = await prisma.image.findMany({
    where: {
      category: 'packaging',
      hubScore: null, // No hub stats yet
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      createdAt: true,
      siteId: true,
    },
  })
  
  console.log(`📊 Found ${recentImages.length} recent packaging images without hub stats`)
  
  if (recentImages.length === 0) {
    console.log('✅ All recent images already have hub stats!')
    return
  }
  
  // Get sites for context
  const siteIds = recentImages.map(img => img.siteId).filter(Boolean) as string[]
  const sites = siteIds.length > 0 ? await prisma.site.findMany({
    where: { id: { in: siteIds } },
    select: { id: true, title: true },
  }) : []
  const siteMap = new Map(sites.map(s => [s.id, s]))
  
  console.log(`\n📋 Recent images to process:`)
  recentImages.slice(0, 20).forEach((img, i) => {
    const site = img.siteId ? siteMap.get(img.siteId) : null
    console.log(`  ${i + 1}. ${site?.title || img.id} (created: ${img.createdAt.toISOString().split('T')[0]})`)
  })
  if (recentImages.length > 20) {
    console.log(`  ... and ${recentImages.length - 20} more`)
  }
  
  // Trigger hub detection
  const imageIds = recentImages.map(img => img.id)
  console.log(`\n🚀 Triggering hub detection for ${imageIds.length} images...`)
  console.log(`💡 This will run with a 5-minute debounce (or immediately if forced)`)
  
  // Force immediate run
  await triggerHubDetectionForImages(imageIds, {
    force: true, // Force immediate run
    topN: 40,
    thresholdMultiplier: 1.5,
  })
  
  console.log(`\n✅ Hub detection triggered!`)
  console.log(`💡 Hub detection runs in the background and may take several minutes`)
  console.log(`💡 Check back later to see hub stats in the database`)
}

main().catch(console.error)





