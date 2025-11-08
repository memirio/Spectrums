#!/usr/bin/env tsx
/**
 * Manual Image Upload Script
 * 
 * Upload or assign an image to an existing site.
 * Supports both local file paths and HTTP(S) URLs.
 * 
 * Usage:
 *   tsx scripts/upload_image_manual.ts <site-url-or-title> <image-url-or-path>
 * 
 * Examples:
 *   tsx scripts/upload_image_manual.ts "https://www.orthofx.com/products/airflex" "/path/to/image.png"
 *   tsx scripts/upload_image_manual.ts "Orthofx" "https://example.com/screenshot.webp"
 *   tsx scripts/upload_image_manual.ts "orthofx" "./screenshots/orthofx-1200x900.webp"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const TAG_CONFIG = {
  MIN_SCORE: 0.12,
  TOP_K: 5,
  FALLBACK_K: 3,
}

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function readImageBuffer(source: string): Promise<Buffer> {
  // Check if it's a URL
  if (/^https?:\/\//i.test(source)) {
    console.log(`  📥 Fetching image from URL: ${source}`)
    const response = await fetch(source)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: HTTP ${response.status}`)
    }
    const ab = await response.arrayBuffer()
    return Buffer.from(ab)
  }
  
  // Otherwise treat as local file path
  const resolvedPath = path.resolve(source)
  console.log(`  📁 Reading local file: ${resolvedPath}`)
  
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`)
  }
  
  return fs.readFileSync(resolvedPath)
}

async function processImage(imageUrl: string, siteId: string, buf: Buffer) {
  // Get image metadata
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`  📐 Image dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Create or update Image record
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId, url: imageUrl } },
    update: {
      width,
      height,
      bytes,
    },
    create: {
      siteId,
      url: imageUrl,
      width,
      height,
      bytes,
    },
  })
  
  console.log(`  ✅ Image record created/updated (ID: ${image.id})`)
  
  // Canonicalize to get contentHash
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`  🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Check if embedding already exists by contentHash
  const existing = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  let ivec: number[]
  if (existing) {
    // Reuse existing embedding
    ivec = existing.vector as unknown as number[]
    console.log(`  ♻️  Reusing existing embedding (from image ID: ${existing.imageId})`)
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: { contentHash: contentHash } as any,
      create: {
        imageId: image.id,
        model: existing.model,
        vector: existing.vector as any,
        contentHash: contentHash
      } as any,
    })
  } else {
    // Compute new embedding
    console.log(`  🤖 Computing image embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: {
        vector: ivec as any,
        model: 'clip-ViT-L/14',
        contentHash: contentHash
      } as any,
      create: {
        imageId: image.id,
        vector: ivec as any,
        model: 'clip-ViT-L/14',
        contentHash: contentHash
      } as any,
    })
    console.log(`  ✅ Embedding computed (dim: ${ivec.length})`)
  }
  
  // Score against concepts and create tags
  console.log(`  🏷️  Computing tags...`)
  const concepts = await prisma.concept.findMany()
  if (concepts.length > 0) {
    const scored = concepts
      .map(c => ({
        c,
        score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
      }))
      .sort((a, b) => b.score - a.score)
    
    const chosen = scored.filter(s => s.score >= TAG_CONFIG.MIN_SCORE).slice(0, TAG_CONFIG.TOP_K)
      || scored.slice(0, TAG_CONFIG.FALLBACK_K)
    
    // Delete old tags
    await prisma.imageTag.deleteMany({
      where: { imageId: image.id }
    })
    
    // Create new tags
    for (const { c, score } of chosen) {
      await prisma.imageTag.upsert({
        where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
        update: { score },
        create: { imageId: image.id, conceptId: c.id, score },
      })
    }
    
    console.log(`  ✅ Tagged with ${chosen.length} concepts:`)
    chosen.forEach(({ c, score }) => {
      console.log(`     - ${c.label}: ${score.toFixed(3)}`)
    })
  }
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: siteId },
    data: { imageUrl }
  })
  
  return { image, ivec }
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.error('Usage: tsx scripts/upload_image_manual.ts <site-url-or-title> <image-url-or-path>')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/upload_image_manual.ts "https://www.orthofx.com/products/airflex" "/path/to/image.png"')
    console.error('  tsx scripts/upload_image_manual.ts "Orthofx" "https://example.com/screenshot.webp"')
    console.error('  tsx scripts/upload_image_manual.ts "orthofx" "./screenshots/orthofx-1200x900.webp"')
    process.exit(1)
  }
  
  const [siteIdentifier, imageSource] = args
  
  try {
    // Find the site
    let site = null
    
    // Try by URL first
    if (/^https?:\/\//i.test(siteIdentifier)) {
      site = await prisma.site.findFirst({
        where: { url: siteIdentifier }
      })
    }
    
    // If not found, try by title (case-insensitive partial match)
    if (!site) {
      site = await prisma.site.findFirst({
        where: {
          OR: [
            { title: { contains: siteIdentifier, mode: 'insensitive' } },
            { url: { contains: siteIdentifier, mode: 'insensitive' } }
          ]
        }
      })
    }
    
    if (!site) {
      console.error(`❌ Site not found: ${siteIdentifier}`)
      console.error('   Try using the full URL or a unique part of the title')
      process.exit(1)
    }
    
    console.log(`✅ Found site: ${site.title}`)
    console.log(`   URL: ${site.url}`)
    
    // Read image buffer
    const buf = await readImageBuffer(imageSource)
    
    // If it's a local file, we need to upload it somewhere or use a file:// URL
    // For now, we'll use the source as-is for URLs, or create a data URL for local files
    let imageUrl: string
    
    if (/^https?:\/\//i.test(imageSource)) {
      // It's already a URL - use it directly
      imageUrl = imageSource
    } else {
      // For local files, you have a few options:
      // 1. Upload to MinIO/screenshot service (recommended)
      // 2. Use a file:// URL (only works locally)
      // 3. Copy to public folder (if Next.js)
      
      console.log('')
      console.log('⚠️  Local file detected. Options:')
      console.log('   1. Upload to screenshot service (MinIO) - RECOMMENDED')
      console.log('   2. Use file path (only works locally in dev)')
      console.log('')
      console.log('💡 For production use, upload the image to your CDN/storage first,')
      console.log('   then run this script with the CDN URL.')
      console.log('')
      
      // For now, let's use a file:// URL (works in dev)
      imageUrl = `file://${path.resolve(imageSource)}`
      console.log(`   Using file:// URL: ${imageUrl}`)
    }
    
    console.log('')
    console.log('📤 Processing image...')
    
    // Process the image (create record, embed, tag)
    await processImage(imageUrl, site.id, buf)
    
    console.log('')
    console.log('✅ Successfully uploaded and processed image!')
    console.log(`   Site: ${site.title}`)
    console.log(`   Image URL: ${imageUrl}`)
    
  } catch (error: any) {
    console.error('')
    console.error('❌ Error:', error.message || error)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

