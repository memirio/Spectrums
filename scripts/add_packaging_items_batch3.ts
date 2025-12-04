#!/usr/bin/env tsx
/**
 * Add Packaging Items - Batch 3
 * 
 * Bulk uploads new packaging images with their titles and URLs.
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

interface PackagingItem {
  title: string
  url: string
  imageFile: string
}

const PACKAGING_ITEMS: PackagingItem[] = [
  { title: 'Olvi Cider', url: 'https://packagingoftheworld.com/2012/06/olvi-cider.html', imageFile: 'Olvi Cider.jpg' },
  { title: 'Imajen Exploration Tools', url: 'https://packagingoftheworld.com/2012/06/imajen-exploration-tools.html', imageFile: 'Imajen Exploration Tools.jpg' },
  { title: 'AIAIAI', url: 'https://packagingoftheworld.com/2012/06/aiaiai.html', imageFile: 'AIAIAI.jpg' },
  { title: 'Siid Cha', url: 'https://packagingoftheworld.com/2012/05/siid-cha.html', imageFile: 'Siid Cha.jpg' },
  { title: 'HP Z1 Workstation', url: 'https://packagingoftheworld.com/2012/05/hp-z1-workstation-cardboard-desk.html', imageFile: 'HP Z1 Workstation.jpg' },
  { title: 'Cry Baby', url: 'https://packagingoftheworld.com/2012/04/designed-by-dunlops-in-house-creative.html', imageFile: 'Cry Baby.jpg' },
  { title: 'X-tape', url: 'https://packagingoftheworld.com/2012/04/x-tape.html', imageFile: 'X-tape.JPG' },
  { title: 'Origami Food Box', url: 'https://packagingoftheworld.com/2012/04/sustainable-origami-food-box.html', imageFile: 'Origami Food Box.JPG' },
  { title: 'Hokkaido', url: 'https://packagingoftheworld.com/2012/04/hokkaido-non-sterilized-milk.html', imageFile: 'Hokkaido.jpg' },
  { title: 'Forsee Dice', url: 'https://packagingoftheworld.com/2012/03/forsee-dice-student-work.html', imageFile: 'Forsee Dice.jpg' },
  { title: 'Granny\'s Secret', url: 'https://packagingoftheworld.com/2012/02/grannys-secret.html', imageFile: 'Granny's Secret.jpg' },
  { title: 'Ego', url: 'https://packagingoftheworld.com/2012/02/ego.html', imageFile: 'Ego.jpg' },
  { title: 'Siraya Harvest', url: 'https://packagingoftheworld.com/2012/02/siraya-harvest.html', imageFile: 'Siraya Harvest.jpg' },
  { title: 'Sofi Bath Bombs', url: 'https://packagingoftheworld.com/2012/02/sofi-bath-bombs.html', imageFile: 'Sofi Bath Bombs.jpg' },
  { title: 'SS Jewelry Box', url: 'https://packagingoftheworld.com/2012/02/ss-jewelry-box.html', imageFile: 'SS Jewelry Box.JPG' },
  { title: 'Mood Garden', url: 'https://packagingoftheworld.com/2012/02/mood-garden.html', imageFile: 'Mood Garden.png' },
  { title: 'Again, New Beginning', url: 'https://packagingoftheworld.com/2012/01/again-new-beginning.html', imageFile: 'Again, New Beginning.jpg' },
  { title: 'Nucleus', url: 'https://packagingoftheworld.com/2012/01/nucleus.html', imageFile: 'Nucleus.jpg' },
  { title: 'Yo! Sushi', url: 'https://packagingoftheworld.com/2011/12/yo-sushi.html', imageFile: 'Yo! Sushi.jpg' },
  { title: 'Help Remedies', url: 'https://packagingoftheworld.com/2011/11/help-remedies.html', imageFile: 'Help Remedies.jpg' },
  { title: 'Aufschwung Swing', url: 'https://packagingoftheworld.com/2011/11/aufschwung-swing.html', imageFile: 'Aufschwung Swing.jpg' },
  { title: 'Zuuk Tea Package', url: 'https://packagingoftheworld.com/2011/11/zuuk-tea-package-student-work.html', imageFile: 'Zuuk Tea Package.jpg' },
  { title: 'Durex Banana', url: 'https://packagingoftheworld.com/2011/10/durex-banana-student-work.html', imageFile: 'Durex Banana.jpg' },
  { title: 'Caffè Cortesia', url: 'https://packagingoftheworld.com/2011/10/caffe-cortesia.html', imageFile: 'Caffè Cortesia.jpg' },
  { title: 'Chinese Take-Out', url: 'https://packagingoftheworld.com/2011/10/eco-friendly-chinese-take-out.html', imageFile: 'Chinese Take-Out.jpg' },
  { title: 'Re-Wine', url: 'https://packagingoftheworld.com/2011/09/re-wine.html', imageFile: 'Re-Wine.jpg' },
  { title: 'Yo\'Play Blox', url: 'https://packagingoftheworld.com/2011/09/yoplay-blox-concept.html', imageFile: 'Yo'Play Blox.jpg' },
  { title: 'Eames Skincare', url: 'https://packagingoftheworld.com/2011/09/eames-skincare.html', imageFile: 'Eames Skincare.jpg' },
  { title: 'Aura Health & Wellbeing', url: 'https://packagingoftheworld.com/2011/09/aura-health-wellbeing.html', imageFile: 'Aura Health & Wellbeing.jpg' },
  { title: 'Gutfried', url: 'https://packagingoftheworld.com/2011/08/gutfried-concept.html', imageFile: 'Gutfried.png' },
]

async function processImage(filePath: string, site: any, category: string = 'packaging'): Promise<void> {
  console.log(`\n📸 Processing image: ${path.basename(filePath)}`)
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
  
  // Upload to Supabase Storage
  console.log(`   ☁️  Uploading to Supabase Storage...`)
  const imageUrl = await uploadImageToSupabaseStorage(filePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
  // Create Image record (unified asset table - same for all categories)
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
      category: category, // Set category to "packaging"
    },
  })
  
  console.log(`   ✅ Image record created/updated (ID: ${image.id})`)
  
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
    
    // Verify that tags were actually created (don't fail silently)
    const tagCount = await prisma.imageTag.count({
      where: { imageId: image.id }
    })
    
    if (tagCount === 0) {
      console.warn(`   ⚠️  WARNING: Tagging completed but no tags were created for image ${image.id}`)
      console.warn(`   🔄 Attempting fallback tagging...`)
      
      // Fallback: Use simple tagging approach if full pipeline didn't create tags
      const { TAG_CONFIG } = await import('../src/lib/tagging-config')
      const concepts = await prisma.concept.findMany()
      
      function cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0
        let s = 0
        for (let i = 0; i < a.length; i++) s += a[i] * b[i]
        return s
      }
      
      const scored = concepts.map(c => ({
        id: c.id,
        score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
      }))
      scored.sort((a, b) => b.score - a.score)
      
      const chosen: typeof scored = []
      const maxScore = scored.length > 0 ? scored[0].score : 0
      for (const s of scored) {
        if (s.score < TAG_CONFIG.MIN_SCORE) break
        if (s.score < maxScore * 0.48) break
        if (chosen.length === 0) {
          chosen.push(s)
          continue
        }
        const prev = chosen[chosen.length - 1].score
        if (s.score >= prev * (1 - TAG_CONFIG.MIN_SCORE_DROP_PCT)) {
          chosen.push(s)
        } else {
          break
        }
        if (chosen.length >= TAG_CONFIG.MAX_K) break
      }
      
      if (chosen.length < TAG_CONFIG.FALLBACK_K) {
        const fallback = scored.slice(0, TAG_CONFIG.FALLBACK_K)
        const keep = new Set(chosen.map(c => c.id))
        for (const f of fallback) {
          if (!keep.has(f.id)) {
            chosen.push(f)
            keep.add(f.id)
          }
        }
      }
      
      // Create tags
      for (const s of chosen) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: s.id } },
          update: { score: s.score },
          create: { imageId: image.id, conceptId: s.id, score: s.score },
        })
      }
      
      const finalTagCount = await prisma.imageTag.count({
        where: { imageId: image.id }
      })
      console.log(`   ✅ Fallback tagging created ${finalTagCount} tags`)
    } else {
      console.log(`   ✅ Tagging pipeline completed (${tagCount} tags created)`)
    }
    
    if (newlyCreatedConceptIds.length > 0) {
      console.log(`   🆕 Generated ${newlyCreatedConceptIds.length} new concept(s): ${newlyCreatedConceptIds.join(', ')}`)
      
      // Filter to only concepts that didn't exist before
      const trulyNewConceptIds = newlyCreatedConceptIds.filter(id => !existingConceptIdsBefore.has(id))
      
      if (trulyNewConceptIds.length > 0) {
        // Tag all existing images with only these new concepts
        // Run in background (fire and forget) to avoid blocking the upload script
        console.log(`   🏷️  Scheduling background tagging of all existing images with ${trulyNewConceptIds.length} new concept(s)...`)
        const { tagNewConceptsOnAllImages } = await import('../src/jobs/tag-new-concepts-on-all')
        // Don't await - run in background so script doesn't hang
        tagNewConceptsOnAllImages(trulyNewConceptIds).catch((err: any) => {
          console.error(`   ⚠️  Background tagging failed (non-fatal): ${err.message}`)
        })
        console.log(`   ✅ Background tagging scheduled (will complete asynchronously)`)
      }
    } else {
      console.log(`   ℹ️  No new concepts generated - image tagged with existing concepts only`)
    }
  } catch (tagError: any) {
    console.error(`   ❌ Tagging pipeline failed: ${tagError.message}`)
    console.error(`   🔄 Attempting fallback tagging as last resort...`)
    
    // Last resort: Try simple tagging even if full pipeline failed
    try {
      const { TAG_CONFIG } = await import('../src/lib/tagging-config')
      const concepts = await prisma.concept.findMany()
      
      function cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0
        let s = 0
        for (let i = 0; i < a.length; i++) s += a[i] * b[i]
        return s
      }
      
      const scored = concepts.map(c => ({
        id: c.id,
        score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
      }))
      scored.sort((a, b) => b.score - a.score)
      
      const chosen = scored.slice(0, Math.max(TAG_CONFIG.FALLBACK_K, 10))
      
      for (const s of chosen) {
        if (s.score >= TAG_CONFIG.MIN_SCORE) {
          await prisma.imageTag.upsert({
            where: { imageId_conceptId: { imageId: image.id, conceptId: s.id } },
            update: { score: s.score },
            create: { imageId: image.id, conceptId: s.id, score: s.score },
          })
        }
      }
      
      const fallbackTagCount = await prisma.imageTag.count({
        where: { imageId: image.id }
      })
      console.log(`   ✅ Fallback tagging created ${fallbackTagCount} tags (recovered from error)`)
    } catch (fallbackError: any) {
      console.error(`   ❌ Fallback tagging also failed: ${fallbackError.message}`)
      // Don't throw - log error but continue (image is still uploaded, just without tags)
      // This ensures the upload doesn't fail completely if tagging has issues
    }
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
  const packagingDir = '/Users/victor/Downloads/FireShot/Packaging'
  
  console.log('═'.repeat(70))
  console.log('📦 Packaging Items Upload - Batch 3')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${PACKAGING_ITEMS.length} packaging items...\n`)
  
  let successCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (let i = 0; i < PACKAGING_ITEMS.length; i++) {
    const item = PACKAGING_ITEMS[i]
    const imagePath = path.join(packagingDir, item.imageFile)
    
    console.log(`\n[${i + 1}/${PACKAGING_ITEMS.length}] Processing: ${item.title}`)
    console.log(`   📎 URL: ${item.url}`)
    console.log(`   🖼️  Image: ${item.imageFile}`)
    
    // Check if image file exists - try exact match first, then fuzzy match for special characters
    if (!fs.existsSync(imagePath)) {
      // Try to find file with similar name (handles special character differences)
      const allFiles = fs.readdirSync(packagingDir)
      const fuzzyMatch = allFiles.find(f => {
        const normalized1 = f.toLowerCase().replace(/[''"]/g, "'")
        const normalized2 = item.imageFile.toLowerCase().replace(/[''"]/g, "'")
        return normalized1 === normalized2 || f.toLowerCase().includes(item.imageFile.toLowerCase().split('.')[0])
      })
      if (fuzzyMatch) {
        imagePath = path.join(packagingDir, fuzzyMatch)
        console.log(`   🔍 Found fuzzy match: ${fuzzyMatch}`)
      } else {
        console.log(`   ⚠️  Image file not found: ${imagePath}`)
        console.log(`   ⏭️  Skipping...`)
        skippedCount++
        continue
      }
    }
    
    try {
      // Normalize URL
      const normalizedUrl = item.url.trim().replace(/\/$/, '')
      
      // Check if site already exists
      let site = await prisma.site.findFirst({
        where: { url: normalizedUrl }
      })
      
      if (site) {
        console.log(`   ⚠️  Site already exists: ${site.title}`)
        console.log(`   📝 Updating existing site with new title...`)
        // Update the title to match the provided label
        site = await prisma.site.update({
          where: { id: site.id },
          data: { title: item.title }
        })
      } else {
        // Create new site
        site = await prisma.site.create({
          data: {
            title: item.title,
            url: normalizedUrl,
            description: '',
            imageUrl: null, // Will be updated after processing
            author: null,
          }
        })
        console.log(`   ✅ Site created (ID: ${site.id})`)
      }
      
      // Process the image through the unified pipeline
      await processImage(imagePath, site, 'packaging')
      
      successCount++
      
      // Small delay to avoid overwhelming the system
      if (i < PACKAGING_ITEMS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message || error}`)
      errorCount++
    }
  }
  
  console.log('\n' + '═'.repeat(70))
  console.log('✅ Upload Complete!')
  console.log('═'.repeat(70))
  console.log(`   Success: ${successCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  console.log(`   Errors:  ${errorCount}`)
  console.log(`   Total:   ${PACKAGING_ITEMS.length}`)
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

