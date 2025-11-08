#!/usr/bin/env tsx
/**
 * Process Single FireShot Image
 * 
 * Processes a single FireShot screenshot for a specific site URL.
 * 
 * Usage:
 *   tsx scripts/process_single_fireshot.ts <site-url> [image-path]
 * 
 * If image-path is not provided, searches /Users/victor/Downloads/FireShot for matching file.
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'
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

/**
 * Find image file matching the site URL
 */
function findImageFile(siteUrl: string): string | null {
  if (!fs.existsSync(FIRESHOT_DIR)) {
    return null
  }
  
  // Extract domain from URL
  const domainMatch = siteUrl.match(/https?:\/\/([^\/]+)/)
  if (!domainMatch) return null
  
  const domain = domainMatch[1].replace(/^www\./, '').toLowerCase()
  const domainParts = domain.split('.')
  const baseDomain = domainParts[0] // e.g., "ponpon-mania"
  
  // Look for files matching the domain
  const files = fs.readdirSync(FIRESHOT_DIR)
    .filter(f => {
      const ext = path.extname(f).toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)
    })
    .map(f => path.join(FIRESHOT_DIR, f))
  
  // Try exact domain match first
  for (const file of files) {
    const name = path.basename(file, path.extname(file)).toLowerCase()
    if (name.includes(baseDomain.replace(/-/g, '')) || name.includes(baseDomain)) {
      return file
    }
  }
  
  // Try partial match
  const searchTerm = baseDomain.replace(/-/g, '')
  for (const file of files) {
    const name = path.basename(file, path.extname(file)).toLowerCase()
    if (name.includes(searchTerm)) {
      return file
    }
  }
  
  return null
}

async function processImage(filePath: string, site: any): Promise<void> {
  const filename = path.basename(filePath)
  console.log(`\n📸 Processing: ${filename}`)
  console.log(`   Site: ${site.title}`)
  console.log(`   URL: ${site.url}`)
  
  // Read image file
  const buf = fs.readFileSync(filePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Canonicalize to get contentHash before upload
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Upload to MinIO/CDN
  console.log(`   ☁️  Uploading to MinIO...`)
  const imageUrl = await uploadImageToMinIO(filePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
  // Delete any existing images for this site
  const existingImages = await prisma.image.findMany({
    where: { siteId: site.id }
  })
  
  if (existingImages.length > 0) {
    console.log(`   🗑️  Removing ${existingImages.length} old image(s)...`)
    await prisma.image.deleteMany({
      where: { siteId: site.id }
    })
  }
  
  // Create Image record
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: {
      width,
      height,
      bytes,
    },
    create: {
      siteId: site.id,
      url: imageUrl,
      width,
      height,
      bytes,
    },
  })
  
  console.log(`   ✅ Image record created (ID: ${image.id})`)
  
  // Check if embedding already exists by contentHash
  const existing = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  let ivec: number[]
  if (existing) {
    // Reuse existing embedding
    ivec = existing.vector as unknown as number[]
    console.log(`   ♻️  Reusing existing embedding (from image ID: ${existing.imageId})`)
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
    console.log(`   🤖 Computing image embedding...`)
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
    console.log(`   ✅ Embedding computed (dim: ${ivec.length})`)
  }
  
  // Score against concepts and create tags
  console.log(`   🏷️  Computing tags...`)
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
    
    // Delete old tags for this image
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
    
    console.log(`   ✅ Tagged with ${chosen.length} concepts:`)
    chosen.forEach(({ c, score }) => {
      console.log(`      - ${c.label}: ${score.toFixed(3)}`)
    })
  }
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  
  console.log(`\n   ✅ Successfully processed and tagged!`)
  console.log(`   🌐 CDN URL: ${imageUrl}`)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.error('Usage: tsx scripts/process_single_fireshot.ts <site-url> [image-path]')
    console.error('')
    console.error('Example:')
    console.error('  tsx scripts/process_single_fireshot.ts "https://ponpon-mania.com/chapters"')
    process.exit(1)
  }
  
  const siteUrl = args[0]
  const imagePath = args[1] || findImageFile(siteUrl)
  
  if (!imagePath) {
    console.error(`❌ Image not found for: ${siteUrl}`)
    console.error('   Please provide the image path or ensure the file exists in FireShot directory')
    process.exit(1)
  }
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ File not found: ${imagePath}`)
    process.exit(1)
  }
  
  try {
    // Extract base domain from URL
    const domainMatch = siteUrl.match(/https?:\/\/([^\/]+)/)
    const baseDomain = domainMatch ? domainMatch[1].replace(/^www\./, '').split('/')[0] : ''
    
    // Find the site by base domain
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: siteUrl },
          { url: { contains: baseDomain } },
          { url: { contains: siteUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '') } }
        ]
      }
    })
    
    if (!site) {
      console.error(`❌ Site not found: ${siteUrl}`)
      process.exit(1)
    }
    
    console.log(`✅ Found site: ${site.title}`)
    console.log(`   URL: ${site.url}`)
    console.log(`   Image: ${imagePath}`)
    
    // Process the image
    await processImage(imagePath, site)
    
    console.log('\n✅ Done!')
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

