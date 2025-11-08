#!/usr/bin/env tsx
/**
 * Create Site with Image
 * 
 * Creates a new site entry and processes its image through the full pipeline.
 * 
 * Usage:
 *   tsx scripts/create_site_with_image.ts <url> <title> <image-path>
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import sharp from 'sharp'
import fs from 'fs'

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

async function processImage(filePath: string, site: any): Promise<void> {
  console.log(`\n📸 Processing image: ${filePath}`)
  
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
  const existingByHash = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  // Check if this image already has an embedding
  const existingForImage = await prisma.imageEmbedding.findUnique({
    where: { imageId: image.id } as any
  })
  
  let ivec: number[]
  if (existingByHash) {
    // Reuse existing embedding vector from another image with same contentHash
    ivec = existingByHash.vector as unknown as number[]
    console.log(`   ♻️  Reusing existing embedding vector (from image ID: ${existingByHash.imageId})`)
    
    if (existingForImage) {
      // Update existing embedding to use the same contentHash (vector should already match)
      await prisma.imageEmbedding.update({
        where: { imageId: image.id } as any,
        data: { contentHash: contentHash } as any,
      })
    } else {
      // Create new embedding pointing to this image, but we can't use the same contentHash
      // Instead, we'll use a slightly modified approach: create with the vector but without unique constraint
      // Actually, contentHash is unique, so we need to either:
      // 1. Set contentHash to null (but it's nullable)
      // 2. Or compute a new hash for this image's embedding
      // For now, let's create without contentHash to avoid constraint violation
      await prisma.imageEmbedding.create({
        data: {
          imageId: image.id,
          model: existingByHash.model,
          vector: existingByHash.vector as any,
          contentHash: null, // Can't reuse unique contentHash, but vector is the same
        } as any,
      })
    }
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
    
    // Create tags
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
  
  console.log(`\n   ✅ Successfully processed!`)
  console.log(`   🌐 CDN URL: ${imageUrl}`)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('Usage: tsx scripts/create_site_with_image.ts <url> <title> <image-path>')
    console.error('')
    console.error('Example:')
    console.error('  tsx scripts/create_site_with_image.ts "https://ponpon-mania.com/chapters" "Ponpon-mania - Chapters" "/path/to/image.png"')
    process.exit(1)
  }
  
  const [url, title, imagePath] = args
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image file not found: ${imagePath}`)
    process.exit(1)
  }
  
  try {
    // Check if site already exists
    const existing = await prisma.site.findFirst({
      where: { url: url }
    })
    
    if (existing) {
      console.log(`⚠️  Site already exists: ${existing.title}`)
      console.log(`   URL: ${existing.url}`)
      console.log(`   Updating image for existing site...`)
      
      await processImage(imagePath, existing)
      return
    }
    
    // Create new site
    console.log(`\n📝 Creating new site...`)
    console.log(`   Title: ${title}`)
    console.log(`   URL: ${url}`)
    
    const site = await prisma.site.create({
      data: {
        title,
        url,
        description: '',
        imageUrl: null, // Will be updated after processing
        author: null,
      }
    })
    
    console.log(`   ✅ Site created (ID: ${site.id})`)
    
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

