#!/usr/bin/env tsx
/**
 * Upload Image from Base64
 * 
 * Accepts base64 image data (from clipboard paste) and uploads it to a site.
 * 
 * Usage:
 *   1. Save image as base64: openssl base64 -in image.png | pbcopy (Mac) or use an online tool
 *   2. Run: tsx scripts/upload_image_from_base64.ts <site-url-or-title>
 *   3. Paste the base64 string when prompted, or pipe it in
 * 
 * Or use stdin:
 *   cat image.png | base64 | tsx scripts/upload_image_from_base64.ts <site-url-or-title>
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import sharp from 'sharp'
import readline from 'readline'

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

async function readBase64FromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = []
    
    // Check if stdin is a TTY (interactive) or piped
    if (process.stdin.isTTY) {
      // Interactive mode - use readline
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      console.log('📋 Paste your base64 image data below (press Ctrl+D or Ctrl+Z when done):')
      console.log('   (You can paste multi-line base64 strings)')
      console.log('')
      
      const lines: string[] = []
      rl.on('line', (line) => {
        lines.push(line.trim())
      })
      
      rl.on('close', () => {
        const base64 = lines.join('').replace(/[\s\n\r]/g, '')
        if (!base64) {
          reject(new Error('No base64 data received'))
        } else {
          resolve(base64)
        }
      })
    } else {
      // Piped mode - read from stdin
      process.stdin.setEncoding('utf8')
      
      process.stdin.on('data', (chunk) => {
        chunks.push(chunk)
      })
      
      process.stdin.on('end', () => {
        const base64 = chunks.join('').replace(/[\s\n\r]/g, '')
        if (!base64) {
          reject(new Error('No base64 data received'))
        } else {
          resolve(base64)
        }
      })
      
      process.stdin.on('error', reject)
    }
  })
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
  
  // For base64 uploads, we'll use a data URL (or upload to MinIO if you prefer)
  // For now, using a data URL that works in the browser
  const dataUrl = `data:image/${meta.format || 'webp'};base64,${buf.toString('base64')}`
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: siteId },
    data: { imageUrl: dataUrl }
  })
  
  return { image, ivec, dataUrl }
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.error('Usage: tsx scripts/upload_image_from_base64.ts <site-url-or-title>')
    console.error('')
    console.error('Examples:')
    console.error('  tsx scripts/upload_image_from_base64.ts "https://www.orthofx.com/products/airflex"')
    console.error('  tsx scripts/upload_image_from_base64.ts "Orthofx"')
    console.error('')
    console.error('Or pipe base64 data:')
    console.error('  cat image.png | base64 | tsx scripts/upload_image_from_base64.ts "orthofx"')
    process.exit(1)
  }
  
  const siteIdentifier = args[0]
  
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
    console.log('')
    
    // Read base64 from stdin
    console.log('📥 Reading base64 image data...')
    const base64Data = await readBase64FromStdin()
    
    // Decode base64 to buffer
    const buf = Buffer.from(base64Data, 'base64')
    
    if (buf.length === 0) {
      throw new Error('Invalid base64 data - decoded buffer is empty')
    }
    
    console.log(`  ✅ Decoded ${(buf.length / 1024).toFixed(1)} KB of image data`)
    console.log('')
    
    // Create a data URL for the image
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const format = meta.format || 'webp'
    const dataUrl = `data:image/${format};base64,${base64Data}`
    
    console.log('📤 Processing image...')
    
    // Process the image (create record, embed, tag)
    const { image } = await processImage(dataUrl, site.id, buf)
    
    console.log('')
    console.log('✅ Successfully uploaded and processed image!')
    console.log(`   Site: ${site.title}`)
    console.log(`   Image ID: ${image.id}`)
    console.log(`   Format: ${format}`)
    console.log(`   Dimensions: ${meta.width}x${meta.height}`)
    console.log('')
    console.log('💡 Note: Using data URL (base64). For production, consider uploading to MinIO/storage first.')
    
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

