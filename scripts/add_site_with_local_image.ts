#!/usr/bin/env tsx
/**
 * Add Site with Local Image
 * 
 * Creates a new site entry and processes its image through the unified pipeline
 * (including concept generation, tagging, and hub detection trigger).
 * 
 * This uses the SAME pipeline for all categories - just set category = 'packaging' (or any category).
 * The pipeline:
 * 1. Fetches/normalizes image
 * 2. Generates CLIP embedding (same model/dimensionality for all categories)
 * 3. Tags with concepts
 * 4. Stores in ImageEmbedding + ImageTag
 * 
 * Usage:
 *   tsx scripts/add_site_with_local_image.ts <url> <title> <image-path> [category]
 * 
 * Examples:
 *   tsx scripts/add_site_with_local_image.ts "https://example.com" "Example" "/path/to/image.png"
 *   tsx scripts/add_site_with_local_image.ts "https://example.com" "Example" "/path/to/image.png" "packaging"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import sharp from 'sharp'
import fs from 'fs'

async function processImage(filePath: string, site: any, category: string = 'website'): Promise<void> {
  console.log(`\n📸 Processing image: ${filePath}`)
  console.log(`   📦 Category: ${category}`)
  
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
  
  // Create Image record (unified asset table - same for all categories)
  // This is the SAME pipeline for websites, packaging, apps, etc.
  // Just set category = 'packaging' (or any category) - no separate pipeline needed!
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: {
      width,
      height,
      bytes,
      category: category, // Update category if changed
    },
    create: {
      siteId: site.id,
      url: imageUrl,
      width,
      height,
      bytes,
      category: category, // Set category (defaults to "website")
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
      await prisma.imageEmbedding.update({
        where: { imageId: image.id } as any,
        data: { contentHash: contentHash } as any,
      })
    } else {
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
  
  // Use the new tagging pipeline (includes concept generation and hub detection trigger)
  console.log(`   🏷️  Running full tagging pipeline (concept generation + tagging + hub detection trigger)...`)
  try {
    const { tagImage } = await import('../src/jobs/tagging')
    
    // Check existing concepts BEFORE generating new ones
    const existingConceptIdsBefore = new Set(
      (await prisma.concept.findMany({ select: { id: true } })).map(c => c.id)
    )
    
    // This will:
    // - Generate new concepts from the image (Gemini/OpenAI fallback)
    // - Tag the image with all concepts (using pre-computed embeddings)
    // - Return IDs of newly created concepts
    // - Trigger hub detection (debounced)
    const newlyCreatedConceptIds = await tagImage(image.id)
    
    console.log(`   ✅ Tagging pipeline completed`)
    
    if (newlyCreatedConceptIds.length > 0) {
      console.log(`   🆕 Generated ${newlyCreatedConceptIds.length} new concept(s): ${newlyCreatedConceptIds.join(', ')}`)
      
      // Filter to only concepts that didn't exist before
      const trulyNewConceptIds = newlyCreatedConceptIds.filter(id => !existingConceptIdsBefore.has(id))
      
      if (trulyNewConceptIds.length > 0) {
        // Tag all existing images with only these new concepts
        console.log(`   🏷️  Tagging all existing images with ${trulyNewConceptIds.length} new concept(s)...`)
        const { tagNewConceptsOnAllImages } = await import('../src/jobs/tag-new-concepts-on-all')
        await tagNewConceptsOnAllImages(trulyNewConceptIds)
        console.log(`   ✅ Tagged all existing images with new concepts`)
      }
    } else {
      console.log(`   ℹ️  No new concepts generated - image tagged with existing concepts only`)
    }
  } catch (tagError: any) {
    console.error(`   ❌ Tagging pipeline failed: ${tagError.message}`)
    throw tagError
  }
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  
  console.log(`\n   ✅ Successfully processed!`)
  console.log(`   🌐 CDN URL: ${imageUrl}`)
  console.log(`   🔄 Incremental hub detection has been triggered for this image (will run after debounce)`)
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('Usage: tsx scripts/add_site_with_local_image.ts <url> <title> <image-path>')
    console.error('')
    console.error('Example:')
    console.error('  tsx scripts/add_site_with_local_image.ts "https://www.permianworld.com/" "Permian" "/Users/victor/Downloads/FireShot/Permian - [www.permianworld.com].png"')
    process.exit(1)
  }
  
  const [url, title, imagePath, category] = args
  const imageCategory = category || 'website' // Default to 'website' if not provided
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Image file not found: ${imagePath}`)
    process.exit(1)
  }
  
  try {
    // Normalize URL
    const normalizedUrl = url.trim().replace(/\/$/, '')
    
    // Check if site already exists
    const existing = await prisma.site.findFirst({
      where: { url: normalizedUrl }
    })
    
    if (existing) {
      console.log(`⚠️  Site already exists: ${existing.title}`)
      console.log(`   URL: ${existing.url}`)
      console.log(`   Updating image for existing site...`)
      
      await processImage(imagePath, existing, imageCategory)
      return
    }
    
    // Create new site
    console.log(`\n📝 Creating new site...`)
    console.log(`   Title: ${title}`)
    console.log(`   URL: ${normalizedUrl}`)
    console.log(`   Category: ${imageCategory}`)
    
    const site = await prisma.site.create({
      data: {
        title,
        url: normalizedUrl,
        description: '',
        imageUrl: null, // Will be updated after processing
        author: null,
      }
    })
    
    console.log(`   ✅ Site created (ID: ${site.id})`)
    
    // Process the image through the unified pipeline (same for all categories)
    await processImage(imagePath, site, imageCategory)
    
    console.log('\n✅ Done!')
    console.log('\n💡 The pipeline has:')
    console.log('   1. ✅ Generated new concepts from the image (if any)')
    console.log('   2. ✅ Tagged the new site with all concepts')
    console.log('   3. ✅ Tagged all existing images with new concepts (if any)')
    console.log('   4. ✅ Triggered hub detection (will run after 5-minute debounce)')
    
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

