/**
 * Test the full pipeline for adding a site step by step
 * Tests: https://www.igloo.inc/
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { tagImage } from '../src/jobs/tagging'

const TEST_URL = 'https://www.igloo.inc/'

async function checkScreenshot(siteId: string) {
  console.log('\n📸 STEP 1: Checking screenshot...')
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: { images: true },
  })
  
  if (!site) {
    console.log('   ❌ Site not found')
    return null
  }
  
  console.log(`   Site ID: ${site.id}`)
  console.log(`   Site URL: ${site.url}`)
  console.log(`   Image URL: ${site.imageUrl || 'NOT SET'}`)
  console.log(`   Images in database: ${site.images.length}`)
  
  if (site.images.length > 0) {
    const image = site.images[0]
    console.log(`   ✅ Image found:`)
    console.log(`      Image ID: ${image.id}`)
    console.log(`      Image URL: ${image.url}`)
    console.log(`      Dimensions: ${image.width}x${image.height}`)
    console.log(`      Size: ${image.bytes} bytes`)
    console.log(`\n   🖼️  Screenshot URL: ${image.url}`)
    console.log(`   👀 Please verify the screenshot looks correct before proceeding!`)
    return image
  } else {
    console.log('   ❌ No images found in database')
    return null
  }
}

async function checkGeminiProcessing(imageId: string, baselineConceptCount: number) {
  console.log('\n🤖 STEP 2: Checking Gemini processing...')
  
  // Check if new concepts were created (by checking seed file)
  const fs = await import('fs/promises')
  const path = await import('path')
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  
  try {
    console.log(`   Baseline concepts count: ${baselineConceptCount}`)
    
    // Get image creation time
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })
    
    if (image) {
      console.log(`   ✅ Seed file accessible`)
      console.log(`   Image created at: ${image.createdAt.toISOString()}`)
    }
    
    // Re-read seed file after processing to check for new concepts
    // (Note: tagImage should have already added new concepts to seed file)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Small delay to ensure file write
    
    const seedContentAfter = await fs.readFile(seedPath, 'utf-8')
    const seedConceptsAfter = JSON.parse(seedContentAfter)
    const totalConceptsAfter = seedConceptsAfter.length
    const newConceptsCount = totalConceptsAfter - baselineConceptCount
    
    console.log(`   Concepts in seed file after: ${totalConceptsAfter}`)
    console.log(`   New concepts added: ${newConceptsCount}`)
    
    if (newConceptsCount > 0) {
      console.log(`   ✅ New concepts created by Gemini:`)
      // Find the new concepts (they should be at the end)
      const newConcepts = seedConceptsAfter.slice(baselineConceptCount)
      newConcepts.slice(0, 10).forEach((c: any, i: number) => {
        console.log(`      ${i + 1}. ${c.label} (${c.id}) - ${c.category || 'Uncategorized'}`)
      })
      if (newConcepts.length > 10) {
        console.log(`      ... and ${newConcepts.length - 10} more`)
      }
    } else {
      console.log(`   ⚠️  No new concepts found in seed file (may have been merged into existing ones)`)
      // Check if concepts were merged by looking at the log output
      console.log(`   💡 Check the tagImage log above for "Merging" messages`)
    }
    
    return newConceptsCount > 0
  } catch (error: any) {
    console.log(`   ❌ Error checking seed file: ${error.message}`)
    return false
  }
}

async function checkTags(imageId: string) {
  console.log('\n🏷️  STEP 3: Checking tags...')
  
  const tags = await prisma.imageTag.findMany({
    where: { imageId },
    include: { concept: true },
    orderBy: { score: 'desc' },
  })
  
  console.log(`   Total tags: ${tags.length}`)
  
  if (tags.length > 0) {
    console.log(`   ✅ Tags found:`)
    tags.slice(0, 20).forEach((tag, i) => {
      console.log(`      ${i + 1}. ${tag.concept.label} (score: ${tag.score.toFixed(4)})`)
    })
    if (tags.length > 20) {
      console.log(`      ... and ${tags.length - 20} more`)
    }
  } else {
    console.log('   ❌ No tags found')
  }
  
  return tags
}

async function checkEmbedding(imageId: string) {
  console.log('\n🔍 STEP 4: Checking embedding (zero-shot search)...')
  
  const embedding = await prisma.imageEmbedding.findUnique({
    where: { imageId },
  })
  
  if (!embedding) {
    console.log('   ❌ No embedding found')
    return false
  }
  
  const vector = embedding.vector as unknown as number[]
  console.log(`   ✅ Embedding found:`)
  console.log(`      Model: ${embedding.model}`)
  console.log(`      Vector dimensions: ${vector.length}`)
  console.log(`      Content hash: ${embedding.contentHash || 'N/A'}`)
  console.log(`      Created at: ${embedding.createdAt.toISOString()}`)
  
  // Test zero-shot search by searching for the site itself
  const { embedTextBatch } = await import('../src/lib/embeddings')
  function cosine(a: number[], b: number[]): number {
    let s = 0
    for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
    return s
  }
  
  const testQuery = 'minimalistic design'
  const [queryVec] = await embedTextBatch([testQuery])
  const similarity = cosine(queryVec, vector)
  console.log(`\n   🧪 Test search for "${testQuery}":`)
  console.log(`      Similarity score: ${similarity.toFixed(4)}`)
  
  return true
}

async function main() {
  console.log('🧪 Testing Pipeline for:', TEST_URL)
  console.log('═'.repeat(60))
  
  // Step 0: Add the site via API
  console.log('\n📝 STEP 0: Adding site via API...')
  try {
    const API_URL = process.env.API_URL || 'http://localhost:3002'
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'igloo.inc',
        description: '',
        url: TEST_URL,
        imageUrl: '', // Empty to trigger screenshot generation
        author: '',
        tags: [],
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.log(`   ❌ Failed to add site: ${error.error || response.statusText}`)
      process.exit(1)
    }
    
    const data = await response.json()
    const siteId = data.site?.id
    
    if (!siteId) {
      console.log('   ❌ No site ID returned')
      process.exit(1)
    }
    
    console.log(`   ✅ Site added: ${siteId}`)
    
    // Wait for screenshot to generate (API polls up to 25 seconds)
    console.log('\n   ⏳ Waiting for screenshot generation (can take up to 30 seconds)...')
    let image = null
    let attempts = 0
    const maxAttempts = 20 // 20 attempts * 1.5s = 30 seconds
    
    while (attempts < maxAttempts && !image) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      attempts++
      
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        include: { images: true },
      })
      
      if (site && site.images.length > 0) {
        image = site.images[0]
        console.log(`   ✅ Screenshot found after ${attempts * 1.5} seconds`)
        break
      }
      
      if (attempts % 5 === 0) {
        console.log(`   ⏳ Still waiting... (${attempts * 1.5}s elapsed)`)
      }
    }
    
    // Step 1: Check screenshot
    if (!image) {
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        include: { images: true },
      })
      image = site?.images[0] || null
    }
    
    if (!image) {
      console.log('\n   ❌ Screenshot not found after waiting')
      console.log('   Checking if screenshot service is running...')
      try {
        const healthCheck = await fetch('http://localhost:3001/health').catch(() => null)
        if (!healthCheck || !healthCheck.ok) {
          console.log('   ⚠️  Screenshot service may not be running on port 3001')
        }
      } catch (e) {
        console.log('   ⚠️  Could not check screenshot service')
      }
      process.exit(1)
    }
    
    // Get baseline concept count BEFORE processing
    const fs = await import('fs/promises')
    const path = await import('path')
    const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
    const seedContentBefore = await fs.readFile(seedPath, 'utf-8')
    const seedConceptsBefore = JSON.parse(seedContentBefore)
    const baselineConceptCount = seedConceptsBefore.length
    
    // Show screenshot URL for verification
    console.log('\n   ⏸️  PAUSE: Please verify the screenshot looks correct.')
    console.log(`   🖼️  Screenshot URL: ${image.url}`)
    console.log(`   👀 Open this URL in your browser to view the screenshot`)
    console.log('   ⚠️  The script will continue automatically in 15 seconds...')
    console.log('   (You can stop it with Ctrl+C if the screenshot looks wrong)')
    await new Promise(resolve => setTimeout(resolve, 15000))
    
    // Step 2: Process with tagImage (includes Gemini concept generation)
    console.log('\n   ⏳ Processing image with tagImage (includes Gemini concept generation)...')
    try {
      await tagImage(image.id)
      console.log('   ✅ tagImage completed')
    } catch (error: any) {
      console.log(`   ❌ tagImage failed: ${error.message}`)
      console.log('   Error stack:', error.stack)
      console.log('   Continuing to check results...')
    }
    
    // Wait a bit for processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Step 2: Check Gemini processing
    const geminiProcessed = await checkGeminiProcessing(image.id, baselineConceptCount)
    
    // Step 3: Check tags
    const tags = await checkTags(image.id)
    
    // Step 4: Check embedding
    const hasEmbedding = await checkEmbedding(image.id)
    
    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('📊 PIPELINE SUMMARY:')
    console.log('═'.repeat(60))
    console.log(`   ✅ Screenshot: ${image ? 'YES' : 'NO'}`)
    console.log(`   ✅ Gemini Processing: ${geminiProcessed ? 'YES' : 'NO'}`)
    console.log(`   ✅ Tags: ${tags.length} tags`)
    console.log(`   ✅ Embedding: ${hasEmbedding ? 'YES' : 'NO'}`)
    console.log('═'.repeat(60))
    
    if (image && tags.length > 0 && hasEmbedding) {
      console.log('\n   ✅ Pipeline completed successfully!')
    } else {
      console.log('\n   ⚠️  Pipeline incomplete - some steps may have failed')
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

