#!/usr/bin/env tsx
/**
 * Production-Ready Site Addition Script
 * 
 * This script adds a site to the Looma database using the official production pipeline.
 * It automatically handles:
 * - Screenshot capture with proper timing
 * - Duplicate prevention
 * - Image embedding
 * - Concept tagging
 * - Gemini concept generation
 * - Auto-tagging of new concepts on all images
 * 
 * Usage:
 *   npx tsx scripts/add_site.ts <url> [title]
 * 
 * Examples:
 *   npx tsx scripts/add_site.ts https://lusion.co/
 *   npx tsx scripts/add_site.ts https://example.com "Example Site"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

async function addSite(url: string, title?: string) {
  try {
    // Normalize URL
    const normalizedUrl = url.trim().replace(/\/$/, '')
    
    // Extract title from URL if not provided
    const siteTitle = title || new URL(normalizedUrl).hostname.replace('www.', '')
    
    console.log(`\n🚀 Adding site: ${normalizedUrl}`)
    console.log(`   Title: ${siteTitle}`)
    console.log('═'.repeat(60))
    
    // Call the production API endpoint
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: siteTitle,
        description: '',
        url: normalizedUrl,
        imageUrl: '', // Empty to trigger screenshot generation
        author: '',
        tags: [],
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error(`   ❌ Failed to add site: ${error.error || response.statusText}`)
      process.exit(1)
    }
    
    const data = await response.json()
    const siteId = data.site?.id
    const alreadyExists = data.alreadyExists || false
    
    if (!siteId) {
      console.error('   ❌ No site ID returned')
      process.exit(1)
    }
    
    if (alreadyExists) {
      console.log(`   ✅ Site already exists: ${siteId}`)
      console.log(`   ℹ️  Returning existing site (no duplicate created)`)
    } else {
      console.log(`   ✅ Site created: ${siteId}`)
    }
    
    // Wait for screenshot to generate (increased timeout for improved timing)
    console.log('\n   ⏳ Waiting for screenshot generation (can take up to 90 seconds with improved timing)...')
    let image = null
    let attempts = 0
    const maxAttempts = 60 // 60 attempts * 1.5s = 90 seconds
    
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
      
      if (attempts % 10 === 0) {
        console.log(`   ⏳ Still waiting... (${attempts * 1.5}s elapsed)`)
      }
    }
    
    if (!image) {
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        include: { images: true },
      })
      image = site?.images[0] || null
    }
    
    if (!image) {
      console.error('\n   ❌ Screenshot not found after waiting')
      console.error('   ⚠️  Screenshot service may not be running or taking longer than expected')
      process.exit(1)
    }
    
    console.log(`   📸 Screenshot URL: ${image.url}`)
    console.log(`   📏 Dimensions: ${image.width}x${image.height}`)
    console.log(`   📦 Size: ${image.bytes} bytes`)
    
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
        where: { id: image.id },
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
    
    // Get final results
    const finalImage = await prisma.image.findUnique({
      where: { id: image.id },
      include: { 
        embedding: true, 
        tags: { 
          include: { concept: true }, 
          take: 10, 
          orderBy: { score: 'desc' } 
        } 
      },
    })
    
    console.log('\n' + '═'.repeat(60))
    console.log('📊 PIPELINE SUMMARY:')
    console.log('═'.repeat(60))
    console.log(`   ✅ Site ID: ${siteId}`)
    console.log(`   ✅ Screenshot: ${image ? 'YES' : 'NO'}`)
    console.log(`   ✅ Embedding: ${finalImage?.embedding ? 'YES' : 'NO'}`)
    console.log(`   ✅ Tags: ${finalImage?.tags.length || 0} tags`)
    
    if (finalImage?.tags.length > 0) {
      console.log('\n   Top tags:')
      finalImage.tags.slice(0, 5).forEach((tag, i) => {
        console.log(`      ${i + 1}. ${tag.concept.label} (${tag.score.toFixed(4)})`)
      })
    }
    
    console.log('═'.repeat(60))
    
    if (image && finalImage?.embedding && finalImage?.tags.length > 0) {
      console.log('\n   ✅ Site successfully added and processed!')
      console.log(`   🎉 Site is now searchable in Looma`)
      console.log(`   🖼️  Screenshot: ${image.url}`)
    } else {
      console.log('\n   ⚠️  Site added but processing incomplete - some steps may have failed')
      console.log('   Check server logs for details')
    }
    
  } catch (error: any) {
    console.error('\n❌ Failed to add site:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/add_site.ts <url> [title]')
    console.error('\nExamples:')
    console.error('  npx tsx scripts/add_site.ts https://lusion.co/')
    console.error('  npx tsx scripts/add_site.ts https://example.com "Example Site"')
    process.exit(1)
  }
  
  const url = args[0]
  const title = args[1]
  
  await addSite(url, title)
}

main().catch(console.error)

