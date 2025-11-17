#!/usr/bin/env tsx
/**
 * Tag FireShot images that were recently added
 * 
 * Tags images that were added via add_fireshot_images.ts
 * Processes them one at a time with memory management.
 * 
 * Usage:
 *   npx tsx scripts/tag_fireshot_images.ts
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { tagImage } from '../src/jobs/tagging'

// Same URLs as in add_fireshot_images.ts
const urlsToTag = [
  'https://dontboardme.com',
  'https://en.manayerbamate.com',
  'https://opalcamera.com/opal-tadpole',
  'https://kprverse.com',
  'https://persepolis.getty.edu',
  'https://www.chungiyoo.com',
  'https://www.kodeclubs.com',
  'https://synchronized.studio',
  'https://2019.makemepulse.com',
  'https://activetheory.net',
  'https://insidethehead.co/chapters',
  'https://mendo.nl',
  'https://paperplanes.world',
  'https://www.kikk.be/2016',
  'http://falter.wild.plus/#en',
  'http://www.because-recollection.com/metronomy',
  'http://species-in-pieces.com',
  'http://nixon.com',
  'https://www.aquest.it',
  'https://24hoursofhappy.com',
  'https://blacknegative.com/#!/whoweare',
  'https://franshalsmuseum.nl/en',
]

async function tagImageForSite(url: string) {
  try {
    const normalizedUrl = url.trim().replace(/\/$/, '')
    
    console.log(`\n🏷️  Tagging: ${normalizedUrl}`)
    
    // Find site
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: normalizedUrl },
          { url: normalizedUrl + '/' },
          { url: url.trim() },
          { url: url.trim().replace(/\/$/, '') },
        ],
      },
      include: { 
        images: {
          include: {
            tags: true,
            embedding: true,
          },
        },
      },
    })
    
    if (!site) {
      console.log(`   ⚠️  Site not found, skipping`)
      return { success: false, error: 'Site not found' }
    }
    
    if (!site.images || site.images.length === 0) {
      console.log(`   ⚠️  No images found for site, skipping`)
      return { success: false, error: 'No images' }
    }
    
    const image = site.images[0]
    console.log(`   📸 Image: ${image.id}`)
    
    // Check if already tagged
    const existingTags = await prisma.imageTag.findMany({
      where: { imageId: image.id },
    })
    
    if (existingTags.length > 0) {
      console.log(`   ℹ️  Already has ${existingTags.length} tags, retagging...`)
    }
    
    // Tag the image
    console.log(`   🤖 Tagging (this may take a while - Gemini API + CLIP)...`)
    const newlyCreatedConcepts = await tagImage(image.id)
    
    // Get updated tag count
    const updatedTags = await prisma.imageTag.findMany({
      where: { imageId: image.id },
    })
    
    console.log(`   ✅ Tagged with ${updatedTags.length} concepts`)
    if (newlyCreatedConcepts.length > 0) {
      console.log(`   ✨ Created ${newlyCreatedConcepts.length} new concept(s): ${newlyCreatedConcepts.slice(0, 5).join(', ')}${newlyCreatedConcepts.length > 5 ? '...' : ''}`)
    }
    
    // Force garbage collection after tagging
    if (global.gc) {
      global.gc()
    }
    
    return { success: true, imageId: image.id, tagCount: updatedTags.length, newConcepts: newlyCreatedConcepts.length }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`)
    }
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('🏷️  Tagging FireShot Images')
  console.log('═'.repeat(60))
  console.log('💾 Memory-optimized: Processing one image at a time')
  console.log('═'.repeat(60))
  
  console.log(`Total sites to tag: ${urlsToTag.length}\n`)
  
  const results = {
    success: 0,
    failed: 0,
    totalTags: 0,
    totalNewConcepts: 0,
    errors: [] as Array<{ url: string; error: string }>,
  }
  
  let index = 0
  for (const url of urlsToTag) {
    index++
    console.log(`\n[${index}/${urlsToTag.length}]`)
    
    const result = await tagImageForSite(url)
    
    if (result.success) {
      results.success++
      results.totalTags += result.tagCount || 0
      results.totalNewConcepts += result.newConcepts || 0
    } else {
      results.failed++
      results.errors.push({ url, error: result.error || 'Unknown error' })
    }
    
    // Delay between images to allow GC and API rate limiting
    // Longer delay to avoid Gemini API rate limits
    if (index < urlsToTag.length) {
      const delay = 5000 // 5 seconds to avoid rate limits
      console.log(`   ⏳ Waiting ${delay/1000} seconds before next image...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 Summary')
  console.log('═'.repeat(60))
  console.log(`✅ Successfully tagged: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`🏷️  Total tags applied: ${results.totalTags}`)
  console.log(`✨ Total new concepts created: ${results.totalNewConcepts}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(({ url, error }) => {
      console.log(`   - ${url}: ${error}`)
    })
  }
  
  console.log('\n')
}

// Enable garbage collection if available
if (global.gc) {
  console.log('✅ Garbage collection enabled (memory will be freed aggressively)')
} else {
  console.log('⚠️  Garbage collection not enabled - memory will be freed automatically by Node.js')
  console.log('   To enable manual GC: NODE_OPTIONS=--expose-gc npx tsx scripts/tag_fireshot_images.ts')
}

main()
  .catch(console.error)
  .finally(() => {
    // Force final cleanup
    if (global.gc) global.gc()
    return prisma.$disconnect()
  })

