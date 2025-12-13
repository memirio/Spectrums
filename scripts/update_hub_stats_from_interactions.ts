#!/usr/bin/env tsx
/**
 * Update Hub Stats from User Interactions (Extensions + Tags)
 * 
 * This script updates hub stats based on:
 * 1. Extended queries (original queries + extensions)
 * 2. Image tags (concepts that images are tagged with)
 * 
 * This is more accurate than synthetic test queries because it uses actual user search patterns.
 * 
 * Usage:
 *   npx tsx scripts/update_hub_stats_from_interactions.ts
 *   npx tsx scripts/update_hub_stats_from_interactions.ts --image-id <id>
 */

import 'dotenv/config'
import { updateHubStatsForImages } from '../src/jobs/hub-detection-extensions'

async function updateHubStatsFromInteractions(imageId?: string) {
  try {
    const { prisma } = await import('../src/lib/prisma')
    
    // Get images to process
    let imageIds: string[]
    if (imageId) {
      const image = await prisma.image.findUnique({
        where: { id: imageId },
        select: { id: true },
      })
      if (!image) {
        console.error(`❌ Image not found: ${imageId}`)
        return
      }
      imageIds = [imageId]
      console.log(`🎯 Processing single image: ${imageId}`)
    } else {
      // Get all images that have interactions
      const imagesWithInteractions = await prisma.userInteraction.groupBy({
        by: ['imageId'],
      })
      imageIds = imagesWithInteractions.map((i) => i.imageId)
      console.log(`📸 Processing ${imageIds.length} images with interactions`)
    }
    
    // Use the new extensions + tags hub detection
    await updateHubStatsForImages(imageIds)
    
    console.log(`\n✅ Updated ${imageIds.length} images with hub stats (extensions + tags)`)
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
    throw error
  } finally {
    const { prisma } = await import('../src/lib/prisma')
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const imageIdArg = args.find((arg) => arg.startsWith('--image-id='))
const imageId = imageIdArg ? imageIdArg.split('=')[1] : undefined

updateHubStatsFromInteractions(imageId)

