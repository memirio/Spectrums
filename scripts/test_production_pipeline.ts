/**
 * Test the production-ready pipeline for adding a site
 * Tests: https://lusion.co/
 * 
 * This script verifies:
 * 1. Duplicate prevention (should return existing site if URL already exists)
 * 2. Screenshot capture with proper timing
 * 3. Complete embedding and tagging pipeline
 * 4. Error handling and logging
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const TEST_URL = 'https://lusion.co/'

async function main() {
  console.log('🧪 Testing Production Pipeline for:', TEST_URL)
  console.log('═'.repeat(60))
  
  try {
    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    
    // STEP 1: First attempt - should create new site
    console.log('\n📝 STEP 1: First attempt - creating new site...')
    const response1 = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Lusion',
        description: '',
        url: TEST_URL,
        imageUrl: '', // Empty to trigger screenshot generation
        author: '',
        tags: [],
      }),
    })
    
    if (!response1.ok) {
      const error = await response1.json().catch(() => ({ error: 'Unknown error' }))
      console.log(`   ❌ Failed to add site: ${error.error || response1.statusText}`)
      process.exit(1)
    }
    
    const data1 = await response1.json()
    const siteId1 = data1.site?.id
    const alreadyExists1 = data1.alreadyExists || false
    
    if (!siteId1) {
      console.log('   ❌ No site ID returned')
      process.exit(1)
    }
    
    console.log(`   ✅ Site ${alreadyExists1 ? 'already exists' : 'created'}: ${siteId1}`)
    
    // Wait for screenshot to generate
    console.log('\n   ⏳ Waiting for screenshot generation (can take up to 60 seconds)...')
    let image1 = null
    let attempts = 0
    const maxAttempts = 40 // 40 attempts * 1.5s = 60 seconds
    
    while (attempts < maxAttempts && !image1) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      attempts++
      
      const site = await prisma.site.findUnique({
        where: { id: siteId1 },
        include: { images: true },
      })
      
      if (site && site.images.length > 0) {
        image1 = site.images[0]
        console.log(`   ✅ Screenshot found after ${attempts * 1.5} seconds`)
        break
      }
      
      if (attempts % 10 === 0) {
        console.log(`   ⏳ Still waiting... (${attempts * 1.5}s elapsed)`)
      }
    }
    
    if (!image1) {
      const site = await prisma.site.findUnique({
        where: { id: siteId1 },
        include: { images: true },
      })
      image1 = site?.images[0] || null
    }
    
    if (!image1) {
      console.log('\n   ❌ Screenshot not found after waiting')
      process.exit(1)
    }
    
    console.log(`   📸 Screenshot URL: ${image1.url}`)
    console.log(`   📏 Dimensions: ${image1.width}x${image1.height}`)
    console.log(`   📦 Size: ${image1.bytes} bytes`)
    
    // Wait for processing to complete
    console.log('\n   ⏳ Waiting for processing (embedding + tagging)...')
    console.log('   This may take 30-60 seconds for Gemini concept generation...')
    
    let embeddingReady = false
    let tagsReady = false
    let processingAttempts = 0
    const maxProcessingAttempts = 40 // 40 attempts * 2s = 80 seconds
    
    while (processingAttempts < maxProcessingAttempts && (!embeddingReady || !tagsReady)) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      processingAttempts++
      
      const currentImage = await prisma.image.findUnique({
        where: { id: image1.id },
        include: { embedding: true, tags: true },
      })
      
      if (currentImage) {
        if (currentImage.embedding && !embeddingReady) {
          embeddingReady = true
          console.log(`   ✅ Embedding ready after ${processingAttempts * 2} seconds`)
        }
        if (currentImage.tags.length > 0 && !tagsReady) {
          tagsReady = true
          console.log(`   ✅ Tags ready after ${processingAttempts * 2} seconds (${currentImage.tags.length} tags)`)
        }
      }
      
      if (processingAttempts % 10 === 0) {
        console.log(`   ⏳ Still processing... (${processingAttempts * 2}s elapsed)`)
      }
    }
    
    // Refresh image data
    const finalImage = await prisma.image.findUnique({
      where: { id: image1.id },
      include: { embedding: true, tags: { include: { concept: true }, take: 10, orderBy: { score: 'desc' } } },
    })
    
    console.log('\n   🔍 Embedding status:', finalImage?.embedding ? '✅ YES' : '❌ NO')
    console.log(`   🏷️  Tags: ${finalImage?.tags.length || 0}`)
    if (finalImage?.tags.length > 0) {
      console.log('   Top tags:')
      finalImage.tags.slice(0, 5).forEach((tag, i) => {
        console.log(`      ${i + 1}. ${tag.concept.label} (${tag.score.toFixed(4)})`)
      })
    }
    
    // STEP 2: Second attempt - should return existing site (duplicate prevention)
    console.log('\n\n📝 STEP 2: Second attempt - testing duplicate prevention...')
    const response2 = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Lusion (duplicate)',
        description: 'This should not create a duplicate',
        url: TEST_URL, // Same URL
        imageUrl: '',
        author: '',
        tags: [],
      }),
    })
    
    if (!response2.ok) {
      const error = await response2.json().catch(() => ({ error: 'Unknown error' }))
      console.log(`   ❌ Failed to check duplicate: ${error.error || response2.statusText}`)
      process.exit(1)
    }
    
    const data2 = await response2.json()
    const siteId2 = data2.site?.id
    const alreadyExists2 = data2.alreadyExists || false
    
    if (siteId2 === siteId1 && alreadyExists2) {
      console.log(`   ✅ Duplicate prevention working! Returned existing site: ${siteId2}`)
      console.log(`   ✅ alreadyExists flag: ${alreadyExists2}`)
    } else {
      console.log(`   ❌ Duplicate prevention failed!`)
      console.log(`      First site ID: ${siteId1}`)
      console.log(`      Second site ID: ${siteId2}`)
      console.log(`      alreadyExists: ${alreadyExists2}`)
    }
    
    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('📊 PRODUCTION PIPELINE TEST SUMMARY:')
    console.log('═'.repeat(60))
    console.log(`   ✅ Screenshot: ${image1 ? 'YES' : 'NO'}`)
    console.log(`   ✅ Embedding: ${finalImage?.embedding ? 'YES' : 'NO'}`)
    console.log(`   ✅ Tags: ${finalImage?.tags.length || 0} tags`)
    console.log(`   ✅ Duplicate Prevention: ${alreadyExists2 ? 'YES' : 'NO'}`)
    console.log('═'.repeat(60))
    
    if (image1 && finalImage?.embedding && finalImage?.tags.length > 0 && alreadyExists2) {
      console.log('\n   ✅ Production pipeline test PASSED!')
      console.log(`   🎉 Site added: ${siteId1}`)
      console.log(`   🖼️  Screenshot: ${image1.url}`)
    } else {
      console.log('\n   ⚠️  Production pipeline test INCOMPLETE - some steps may have failed')
    }
    
  } catch (error: any) {
    console.error('\n❌ Pipeline test failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

