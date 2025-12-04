#!/usr/bin/env tsx
/**
 * Check hub detection status for recent images
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking hub detection status...\n')
  
  // Check if HubImage model exists
  try {
    // Try to query hub images
    const hubImages = await (prisma as any).hubImage?.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        imageId: true,
        score: true,
        count: true,
        createdAt: true,
      },
    })
    
    if (hubImages && hubImages.length > 0) {
      console.log(`📊 Recent hub images (last 20):`)
      for (const hub of hubImages) {
        const image = await prisma.image.findUnique({
          where: { id: hub.imageId },
          select: { url: true, siteId: true },
        })
        const site = image?.siteId ? await prisma.site.findUnique({
          where: { id: image.siteId },
          select: { title: true },
        }) : null
        
        console.log(`  - Image: ${hub.imageId}`)
        console.log(`    Site: ${site?.title || 'N/A'}`)
        console.log(`    Hub Score: ${hub.score?.toFixed(4) || 'N/A'}`)
        console.log(`    Hub Count: ${hub.count || 0}`)
        console.log(`    Created: ${hub.createdAt || 'N/A'}`)
        console.log('')
      }
      
      const totalHubs = await (prisma as any).hubImage?.count()
      console.log(`📊 Total hub images: ${totalHubs || 0}`)
    } else {
      console.log('⚠️  No hub images found in database')
    }
  } catch (error: any) {
    console.log(`⚠️  HubImage model not available: ${error.message}`)
  }
  
  // Check recent images for hub stats
  console.log('\n🔍 Checking recent images for hub stats...\n')
  
  const recentImages = await prisma.image.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      url: true,
      createdAt: true,
      siteId: true,
    },
  })
  
  console.log(`📊 Recent images (last 50):`)
  let hubStatsCount = 0
  
  for (const image of recentImages) {
    // Check if image has hub stats in the images table
    const fullImage = await prisma.image.findUnique({
      where: { id: image.id },
      select: {
        id: true,
        hubScore: true,
        hubCount: true,
      },
    })
    
    if (fullImage && (fullImage.hubScore !== null || fullImage.hubCount !== null)) {
      hubStatsCount++
      const site = image.siteId ? await prisma.site.findUnique({
        where: { id: image.siteId },
        select: { title: true },
      }) : null
      
      console.log(`  ✅ ${site?.title || image.id}`)
      console.log(`     Hub Score: ${fullImage.hubScore || 'N/A'}`)
      console.log(`     Hub Count: ${fullImage.hubCount || 0}`)
      console.log('')
    }
  }
  
  if (hubStatsCount === 0) {
    console.log('⚠️  No hub stats found in recent images')
    console.log('💡 Hub detection runs asynchronously with a 5-minute debounce')
    console.log('💡 It may take a few minutes after tagging for hubs to be detected')
  } else {
    console.log(`\n✅ Found ${hubStatsCount} recent images with hub stats`)
  }
}

main().catch(console.error)

