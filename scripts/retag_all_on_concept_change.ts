/**
 * Retag all images when new concepts are added to seed_concepts.json
 * This script should be run after adding new concepts to ensure all images are re-tagged
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { tagImage } from '../src/jobs/tagging'
import * as fs from 'fs/promises'
import * as path from 'path'

async function main() {
  console.log('🔄 Retagging all images with new concepts...\n')
  
  // Get all active images (images linked to sites)
  const sites = await prisma.site.findMany({
    where: {
      imageUrl: { not: null },
    },
    include: {
      images: {
        where: {
          url: { not: null },
        },
      },
    },
  })
  
  const imageIds = new Set<string>()
  for (const site of sites) {
    if (site.imageUrl) {
      const image = site.images.find(img => img.url === site.imageUrl)
      if (image) {
        imageIds.add(image.id)
      }
    }
  }
  
  const images = await prisma.image.findMany({
    where: {
      id: { in: Array.from(imageIds) },
      url: { not: null },
    },
    include: {
      site: {
        select: {
          title: true,
          url: true,
        },
      },
    },
  })
  
  console.log(`📊 Found ${images.length} active images to retag\n`)
  
  let successCount = 0
  let errorCount = 0
  const errors: Array<{ imageId: string; error: string }> = []
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const siteInfo = `${image.site?.title || 'Unknown'} (${image.site?.url || 'N/A'})`
    
    console.log(`[${i + 1}/${images.length}] Processing: ${image.id}`)
    console.log(`   Site: ${siteInfo}`)
    
    try {
      await tagImage(image.id)
      successCount++
      console.log(`   ✅ Retagged successfully`)
    } catch (error: any) {
      errorCount++
      const errorMsg = error.message || String(error)
      errors.push({ imageId: image.id, error: errorMsg })
      console.error(`   ❌ Error: ${errorMsg}`)
    }
    
    // Small delay to avoid overwhelming the system
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`📊 Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📊 Total: ${images.length}`)
  console.log('═'.repeat(60))
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors encountered:`)
    for (const { imageId, error } of errors.slice(0, 10)) {
      console.log(`   ${imageId}: ${error}`)
    }
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more`)
    }
  }
}

main()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

