#!/usr/bin/env tsx
/**
 * Process Latest 3 FireShot Screenshots
 * 
 * Processes the 3 most recent FireShot screenshots for the last 3 sites:
 * - lusion.co
 * - cornrevolution.resn.global
 * - pangrampangram.com (neue-corp)
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import { uploadImageToMinIO } from './upload_to_minio'
import { tagImage } from '../src/jobs/tagging'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

// Target sites to process - find files by URL pattern
const TARGET_SITES = [
  { url: 'https://lusion.co', urlPattern: 'lusion.co' },
  { url: 'https://cornrevolution.resn.global', urlPattern: 'cornrevolution.resn.global' },
  { url: 'https://pangrampangram.com/products/neue-corp', urlPattern: 'pangrampangram.com' },
]

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
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
      update: { contentHash: contentHash } as any,
      create: { 
        imageId: image.id, 
        model: existing.model, 
        vector: existing.vector as any, 
        contentHash: contentHash 
      } as any,
    })
    console.log(`   ✅ Reused existing embedding`)
  } else {
    // Generate new embedding
    console.log(`   🔍 Generating embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
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
    console.log(`   ✅ Embedding created`)
  }

  // Apply concept tagging
  console.log(`   🏷️  Applying concept tags...`)
  const concepts = await prisma.concept.findMany()
  const scored = concepts
    .map(c => ({ c, score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || []) }))
    .sort((a, b) => b.score - a.score)
  
  // Pragmatic tagging
  const aboveThreshold = scored.filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
  const chosen: typeof scored = []
  
  for (let i = 0; i < aboveThreshold.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
    const current = aboveThreshold[i]
    const prev = chosen[chosen.length - 1]
    
    if (chosen.length === 0) {
      chosen.push(current)
      continue
    }
    
    if (prev && prev.score > 0) {
      const dropPct = (prev.score - current.score) / prev.score
      if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
        break
      }
    }
    
    chosen.push(current)
  }
  
  const final = chosen.length > 0 ? chosen : scored.slice(0, TAG_CONFIG.FALLBACK_K)
  const chosenConceptIds = new Set(final.map(({ c }) => c.id))
  
  // Delete old tags
  await prisma.imageTag.deleteMany({
    where: { imageId: image.id }
  })
  
  // Create new tags
  for (const { c, score } of final) {
    await prisma.imageTag.create({
      data: { imageId: image.id, conceptId: c.id, score },
    })
  }
  
  console.log(`   ✅ Applied ${final.length} tags`)
  
  // Run Gemini concept generation
  console.log(`   🤖 Running Gemini concept generation...`)
  try {
    const newlyCreatedConceptIds = await tagImage(image.id)
    if (newlyCreatedConceptIds.length > 0) {
      console.log(`   ✅ Created ${newlyCreatedConceptIds.length} new concept(s): ${newlyCreatedConceptIds.join(', ')}`)
    } else {
      console.log(`   ✅ No new concepts created`)
    }
  } catch (tagError) {
    console.error(`   ❌ tagImage failed:`, (tagError as Error)?.message)
  }
  
  console.log(`   ✅ Image processing complete!`)
}

async function main() {
  try {
    console.log('🚀 Processing Latest 3 FireShot Screenshots')
    console.log('═'.repeat(60))
    
    const stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
    }
    
    // Process each target site
    for (const target of TARGET_SITES) {
      try {
        // Find file by URL pattern
        const files = fs.readdirSync(FIRESHOT_DIR).filter(f => 
          f.endsWith('.png') && f.includes(target.urlPattern)
        )
        
        if (files.length === 0) {
          console.log(`\n⚠️  No screenshot found for: ${target.urlPattern}`)
          stats.skipped++
          continue
        }
        
        // Use the first matching file (most recent)
        const filename = files[0]
        const filePath = path.join(FIRESHOT_DIR, filename)
        console.log(`\n📁 Found screenshot: ${filename}`)
        
        // Find site by URL
        console.log(`\n🔍 Looking for site: ${target.url}`)
        const site = await prisma.site.findFirst({
          where: {
            url: {
              in: [
                target.url,
                target.url + '/',
                target.url.replace(/\/$/, ''),
                target.url.replace(/\/$/, '') + '/'
              ]
            }
          }
        })
        
        if (!site) {
          console.log(`   ⚠️  No matching site found - skipping`)
          stats.skipped++
          continue
        }
        
        console.log(`   ✅ Found site: ${site.title} (ID: ${site.id})`)
        
        // Process the image
        await processImage(filePath, site)
        stats.processed++
        
      } catch (error: any) {
        console.error(`   ❌ Error processing ${target.filename}:`, error.message)
        stats.errors++
      }
    }
    
    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('📊 Processing Summary:')
    console.log(`   ✅ Successfully processed: ${stats.processed}`)
    console.log(`   ⏭️  Skipped: ${stats.skipped}`)
    console.log(`   ❌ Errors: ${stats.errors}`)
    console.log('═'.repeat(60))
    
    if (stats.processed > 0) {
      console.log('\n✅ Done! All processed images are now uploaded, embedded, and tagged.')
    }
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message || error)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

