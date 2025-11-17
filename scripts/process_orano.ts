#!/usr/bin/env tsx
/**
 * Process Orano screenshot through the full pipeline
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import { tagImage } from '../src/jobs/tagging'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'
const ORANO_URL = 'https://www.orano.group/experience/innovation/en/slider'
const SCREENSHOT_FILE = 'FireShot Capture 175 - Orano - [www.orano.group].png'

async function main() {
  console.log('═'.repeat(60))
  console.log('📸 Processing Orano Screenshot')
  console.log('═'.repeat(60))
  
  const screenshotPath = path.join(FIRESHOT_DIR, SCREENSHOT_FILE)
  
  if (!fs.existsSync(screenshotPath)) {
    console.error(`❌ Screenshot not found: ${screenshotPath}`)
    process.exit(1)
  }
  
  console.log(`📸 Screenshot: ${SCREENSHOT_FILE}`)
  console.log(`🌐 URL: ${ORANO_URL}\n`)
  
  // Find site
  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { url: ORANO_URL },
        { url: ORANO_URL + '/' },
        { url: ORANO_URL.replace(/\/$/, '') },
      ],
    },
    include: { images: true },
  })
  
  if (!site) {
    console.error(`❌ Site not found: ${ORANO_URL}`)
    process.exit(1)
  }
  
  console.log(`✅ Found site: ${site.title} (${site.id})\n`)
  
  // Read image file
  console.log('📖 Reading image file...')
  let buf = fs.readFileSync(screenshotPath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024 / 1024).toFixed(2)} MB)\n`)
  
  // Canonicalize to get contentHash
  console.log('🔐 Computing content hash...')
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   Hash: ${contentHash.substring(0, 16)}...\n`)
  
  // Keep reference to original buffer for embedding
  const originalBuf = buf
  
  // Upload to MinIO
  console.log('☁️  Uploading to MinIO...')
  const imageUrl = await uploadImageToMinIO(screenshotPath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}\n`)
  
  // Create or update Image record
  console.log('💾 Creating image record...')
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
  
  console.log(`   ✅ Image record: ${image.id}\n`)
  
  // Check if embedding already exists by contentHash
  const existing = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  let ivec: number[]
  if (existing) {
    console.log('♻️  Reusing existing embedding...')
    ivec = existing.vector as unknown as number[]
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
    console.log(`   ✅ Embedding reused (dim: ${ivec.length})\n`)
  } else {
    console.log('🤖 Computing embedding...')
    const result = await embedImageFromBuffer(originalBuf)
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
    console.log(`   ✅ Embedding computed (dim: ${ivec.length})\n`)
  }
  
  // Release buffers
  buf = null!
  if (global.gc) global.gc()
  
  // Tag the image
  console.log('🏷️  Tagging image (this may take a while - Gemini API + CLIP)...')
  try {
    const newlyCreatedConcepts = await tagImage(image.id)
    const tags = await prisma.imageTag.findMany({
      where: { imageId: image.id },
    })
    console.log(`   ✅ Tagged with ${tags.length} concepts`)
    if (newlyCreatedConcepts.length > 0) {
      console.log(`   ✨ Created ${newlyCreatedConcepts.length} new concept(s): ${newlyCreatedConcepts.slice(0, 5).join(', ')}${newlyCreatedConcepts.length > 5 ? '...' : ''}`)
    }
  } catch (tagError: any) {
    console.error(`   ⚠️  Tagging failed: ${tagError.message}`)
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('✅ Processing complete!')
  console.log('═'.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => {
    if (global.gc) global.gc()
    return prisma.$disconnect()
  })

