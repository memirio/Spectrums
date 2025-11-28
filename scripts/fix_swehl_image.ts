#!/usr/bin/env tsx
/**
 * Fix Swehl Image
 * 
 * Re-uploads the image for swehl.com if the file is missing from MinIO
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

async function main() {
  const siteUrl = 'https://swehl.com'
  
  // Find the site
  const site = await prisma.site.findFirst({
    where: { url: siteUrl },
    include: {
      images: true
    }
  })
  
  if (!site) {
    console.log(`❌ Site not found: ${siteUrl}`)
    return
  }
  
  console.log(`\n🔍 Found site: ${site.title}`)
  console.log(`   Current imageUrl: ${site.imageUrl}`)
  
  // Check if we have the image file
  const possiblePaths = [
    '/Users/victor/Downloads/FireShot/swehl.com.png',
    '/Users/victor/Downloads/FireShot/swehl.com.jpg',
    '/Users/victor/Downloads/FireShot/swehl.com.webp',
    path.join(process.cwd(), 'screenshots', 'swehl.com.png'),
    path.join(process.cwd(), 'screenshots', 'swehl.com.jpg'),
  ]
  
  let imagePath: string | null = null
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      imagePath = p
      console.log(`   ✅ Found image file: ${p}`)
      break
    }
  }
  
  if (!imagePath) {
    console.log(`\n❌ Image file not found. Please provide the image file path.`)
    console.log(`   Searched in:`)
    possiblePaths.forEach(p => console.log(`     - ${p}`))
    console.log(`\n   Usage: tsx scripts/fix_swehl_image.ts <image-file-path>`)
    return
  }
  
  // Read and process image
  console.log(`\n📸 Processing image: ${imagePath}`)
  const buf = fs.readFileSync(imagePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Canonicalize
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Upload to MinIO
  console.log(`   ☁️  Uploading to MinIO...`)
  const imageUrl = await uploadImageToMinIO(imagePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
  // Update site imageUrl
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  console.log(`   ✅ Updated site imageUrl`)
  
  // Update or create Image record
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: { 
      width, 
      height, 
      bytes, 
      category: 'website' 
    },
    create: {
      siteId: site.id,
      url: imageUrl,
      width,
      height,
      bytes,
      category: 'website',
    },
  })
  
  console.log(`   ✅ Image record created/updated (ID: ${image.id})`)
  
  // Check if embedding exists
  const existing = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  let ivec: number[]
  if (existing) {
    console.log(`   ♻️  Reusing existing embedding`)
    ivec = existing.vector as unknown as number[]
  } else {
    console.log(`   🤖 Computing new embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    
    await prisma.imageEmbedding.create({
      data: {
        imageId: image.id,
        contentHash,
        vector: ivec as any,
      } as any
    })
    console.log(`   ✅ Embedding created`)
  }
  
  // Link embedding to image if not already linked
  if (existing && existing.imageId !== image.id) {
    await prisma.imageEmbedding.update({
      where: { id: existing.id },
      data: { imageId: image.id } as any
    })
    console.log(`   ✅ Linked embedding to image`)
  }
  
  console.log(`\n✅ Done! Image should now be visible.`)
  
  await prisma.$disconnect()
}

// Allow image path as command line argument
const imagePathArg = process.argv[2]
if (imagePathArg) {
  // Override the search paths with the provided path
  const originalMain = main
  main = async () => {
    const siteUrl = 'https://swehl.com'
    const site = await prisma.site.findFirst({
      where: { url: siteUrl },
      include: { images: true }
    })
    
    if (!site) {
      console.log(`❌ Site not found: ${siteUrl}`)
      return
    }
    
    if (!fs.existsSync(imagePathArg)) {
      console.log(`❌ Image file not found: ${imagePathArg}`)
      return
    }
    
    // Process the image (same logic as above)
    const buf = fs.readFileSync(imagePathArg)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length
    
    console.log(`\n📸 Processing: ${imagePathArg}`)
    console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
    
    const { hash: contentHash } = await canonicalizeImage(buf)
    console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
    
    console.log(`   ☁️  Uploading to MinIO...`)
    const imageUrl = await uploadImageToMinIO(imagePathArg, contentHash)
    console.log(`   ✅ Uploaded: ${imageUrl}`)
    
    await prisma.site.update({
      where: { id: site.id },
      data: { imageUrl }
    })
    
    const image = await (prisma.image as any).upsert({
      where: { siteId_url: { siteId: site.id, url: imageUrl } },
      update: { width, height, bytes, category: 'website' },
      create: { siteId: site.id, url: imageUrl, width, height, bytes, category: 'website' },
    })
    
    const existing = await prisma.imageEmbedding.findFirst({
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[]
    if (existing) {
      ivec = existing.vector as unknown as number[]
    } else {
      const result = await embedImageFromBuffer(buf)
      ivec = result.vector
      await prisma.imageEmbedding.create({
        data: { imageId: image.id, contentHash, vector: ivec as any } as any
      })
    }
    
    if (existing && existing.imageId !== image.id) {
      await prisma.imageEmbedding.update({
        where: { id: existing.id },
        data: { imageId: image.id } as any
      })
    }
    
    console.log(`\n✅ Done!`)
    await prisma.$disconnect()
  }
}

main().catch(console.error)

