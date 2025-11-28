#!/usr/bin/env tsx
/**
 * Update Site Image
 * 
 * Updates the image for an existing site with a new local image file.
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import sharp from 'sharp'
import fs from 'fs'

async function updateImage(siteUrl: string, imagePath: string) {
  // Normalize URL (with trailing slash)
  const normalizedUrl = siteUrl.trim()
  
  // Find existing site
  const site = await prisma.site.findFirst({
    where: { url: normalizedUrl }
  })
  
  if (!site) {
    console.log(`❌ Site not found: ${normalizedUrl}`)
    return
  }
  
  console.log(`\n📸 Updating image for: ${site.title}`)
  console.log(`   URL: ${site.url}`)
  
  // Read image file
  const buf = fs.readFileSync(imagePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Canonicalize
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Upload to Supabase Storage
  console.log(`   ☁️  Uploading to Supabase Storage...`)
  const imageUrl = await uploadImageToSupabaseStorage(imagePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
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
  
  // Compute embedding
  console.log(`   🤖 Computing image embedding...`)
  const result = await embedImageFromBuffer(buf)
  await prisma.imageEmbedding.upsert({
    where: { imageId: image.id } as any,
    update: { 
      vector: result.vector as any, 
      model: 'clip-ViT-L/14', 
      contentHash 
    } as any,
    create: {
      imageId: image.id,
      vector: result.vector as any,
      model: 'clip-ViT-L/14',
      contentHash,
    } as any,
  })
  console.log(`   ✅ Embedding computed (dim: ${result.vector.length})`)
  
  // Tag the image
  console.log(`   🏷️  Running tagging pipeline...`)
  const { tagImage } = await import('../src/jobs/tagging')
  await tagImage(image.id)
  console.log(`   ✅ Tagging completed`)
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  
  console.log(`\n   ✅ Successfully updated image for ${site.title}`)
  console.log(`   🌐 CDN URL: ${imageUrl}`)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.error('Usage: tsx scripts/update_site_image.ts <site-url> <image-path>')
    console.error('')
    console.error('Example:')
    console.error('  tsx scripts/update_site_image.ts "http://martinbriceno.xyz/" "/Users/victor/Downloads/FireShot/martinbriceno.xyz.png"')
    process.exit(1)
  }
  
  const [siteUrl, imagePath] = args
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image file not found: ${imagePath}`)
    process.exit(1)
  }
  
  try {
    await updateImage(siteUrl, imagePath)
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

