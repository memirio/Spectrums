#!/usr/bin/env tsx
/**
 * Add New Packaging Items
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
  { title: 'Weidendorf', url: 'https://packagingoftheworld.com/2025/12/weidendorf-organic-pure-milk.html', imageFile: '​Weidendorf.webp' },
  { title: 'Cocoon', url: 'https://packagingoftheworld.com/2025/12/the-cocoon-transformation-game-board.html', imageFile: 'Cocoon.webp' },
  { title: 'Shabouk', url: 'https://packagingoftheworld.com/2025/12/spring-bloom-rigid-boxes-paper-bags.html', imageFile: 'Shabouk.webp' },
  { title: 'Dr.Skipp', url: 'https://packagingoftheworld.com/2025/11/dr-skipp-disposable-towels.html', imageFile: 'Dr.Skipp' },
  { title: 'Bombae', url: 'https://packagingoftheworld.com/2025/11/bombaes-rollplay-razor-for-women.html', imageFile: 'Bombae.webp' },
  { title: 'Steppe', url: 'https://packagingoftheworld.com/2025/11/steppe.html', imageFile: 'Steppe.webp' },
  { title: 'SUZUNOYA', url: 'https://packagingoftheworld.com/2025/11/suzunoya-canele-package.html', imageFile: 'SUZUNOYA.jpg' },
  { title: 'SHABOUK – SIGNATURE BLUE', url: 'https://packagingoftheworld.com/2025/11/shabouk-signature-blue-orange-rigid-box-collection.html', imageFile: 'Shabouk – Signature Blue.webp' },
  { title: 'BAWI', url: 'https://packagingoftheworld.com/2025/11/bawi-apples.html', imageFile: 'BAWI.webp' },
  { title: 'Skippy Aqua', url: 'https://packagingoftheworld.com/2025/11/skippy-aqua-baby-wet-wipes-packaging-design.html', imageFile: 'Skippy Aqua.png' },
  { title: 'Pizzeta', url: 'https://packagingoftheworld.com/2025/11/pizzeta-pizza-base-that-gestures-italian.html', imageFile: 'Pizzeta.webp' },
  { title: 'NEAP', url: 'https://packagingoftheworld.com/2025/11/neap-protein-gel-packaging-design.html', imageFile: 'NEAP.webp' },
  { title: 'Livora', url: 'https://packagingoftheworld.com/2025/11/livora-pastry-studio.html', imageFile: 'Livora.webp' },
  { title: 'HOPE', url: 'https://packagingoftheworld.com/2025/11/shampoo-hope.html', imageFile: 'HOPE.webp' },
  { title: 'Hello, my name is', url: 'https://packagingoftheworld.com/2025/10/hello-my-name-is.html', imageFile: 'Hello, my name is.jpg' },
  { title: '72H flour line', url: 'https://packagingoftheworld.com/2025/10/72h-flour-line.html', imageFile: '72H flour line.png' },
  { title: 'BOTITO', url: 'https://packagingoftheworld.com/2025/10/botito-eco-guardian.html', imageFile: 'BOTITO.webp' },
  { title: 'MIZU', url: 'https://packagingoftheworld.com/2025/10/mizu-cosmetics.html', imageFile: 'MIZU.webp' },
  { title: 'Brodies', url: 'https://packagingoftheworld.com/2025/10/brodies.html', imageFile: 'Brodies.webp' },
  { title: 'Aromato Coffee', url: 'https://packagingoftheworld.com/2025/10/aromato-coffee.html', imageFile: 'Aromato Coffee.webp' },
  { title: 'Zzzeny', url: 'https://packagingoftheworld.com/2025/09/zzzeny.html', imageFile: 'Zzzeny.webp' },
  { title: 'Palform', url: 'https://packagingoftheworld.com/2025/09/palform.html', imageFile: 'Palform.webp' },
  { title: 'Amo\'ya', url: 'https://packagingoftheworld.com/2025/09/amoya.html', imageFile: 'Amo\'ya.jpg' },
  { title: 'Hanger Tea', url: 'https://packagingoftheworld.com/2010/01/hanger-tea.html', imageFile: 'Hanger Tea.jpg' },
  { title: 'RPM', url: 'https://packagingoftheworld.com/2009/12/rpm-energy-drink_17.html', imageFile: 'RPM.jpg' },
  { title: 'Jamie Oliver', url: 'https://packagingoftheworld.com/2009/12/jamie-oliver.html', imageFile: 'Jamie Oliver.jpg' },
  { title: 'Foxglo', url: 'https://packagingoftheworld.com/2009/11/foxglo.html', imageFile: 'Foxglo.jpg' },
  { title: 'Mambajamba', url: 'https://packagingoftheworld.com/2009/11/mambajamba.html', imageFile: 'Mambajamba.jpg' },
  { title: 'Audiovox EarBudeez', url: 'https://packagingoftheworld.com/2009/10/audiovox-earbudeez.html', imageFile: 'Audiovox EarBudeez.jpg' },
  { title: 'Oh Shit Kits', url: 'https://packagingoftheworld.com/2009/10/oh-shit-kits.html', imageFile: 'Oh Shit Kits.jpg' },
  { title: 'Kleenex', url: 'https://packagingoftheworld.com/2009/10/kleenex.html', imageFile: 'Kleenex.jpg' },
  { title: 'Doritos', url: 'https://packagingoftheworld.com/2009/09/doritos-packaging-concept.html', imageFile: 'Doritos.jpg' },
  { title: 'ClearRX', url: 'https://packagingoftheworld.com/2009/09/clearrx.html', imageFile: 'ClearRX.jpg' },
  { title: 'POP-UP POPCORN', url: 'https://packagingoftheworld.com/2009/09/pop-up-popcorn.html', imageFile: 'Pop-up Popcorn.jpg' },
  { title: 'TastyBone', url: 'https://packagingoftheworld.com/2009/08/tastybone.html', imageFile: 'TastyBone.jpg' },
  { title: 'Gauss Lamps', url: 'https://packagingoftheworld.com/2009/08/gauss-lamps.html', imageFile: 'Gauss Lamps.jpg' },
  { title: 'Monopoly', url: 'https://packagingoftheworld.com/2009/07/monopoly-repackaging.html', imageFile: 'Monopoly.jpg' },
  { title: 'Milli', url: 'https://packagingoftheworld.com/2009/07/milli-shoe-box.html', imageFile: 'Milli.webp' },
  { title: 'Salt&Pepper', url: 'https://packagingoftheworld.com/2009/05/salt-cell.html', imageFile: 'Salt&Pepper.jpg' },
  { title: 'Leftover Packaging', url: 'https://packagingoftheworld.com/2009/05/leftover-packaging.html', imageFile: 'Leftover Packaging.jpg' },
  { title: 'Heinekan', url: 'https://packagingoftheworld.com/2009/05/heinekan-beer-crate.html', imageFile: 'Heinekan.jpg' },
  { title: 'Mario World', url: 'https://packagingoftheworld.com/2009/03/mario-world-board-game.html', imageFile: 'Mario World.jpg' },
  { title: 'not a box lamp', url: 'https://packagingoftheworld.com/2008/11/not-box-lamp.html', imageFile: 'not a box lamp.jpg' },
  { title: 'Re-Pack', url: 'https://packagingoftheworld.com/2010/12/re-pack.html', imageFile: 'Re-Pack.jpg' },
  { title: 'The Yorkshire Saucery', url: 'https://packagingoftheworld.com/2010/11/yorkshire-saucery.html', imageFile: 'The Yorkshire Saucery.jpg' },
  { title: 'Pit Stop Café', url: 'https://packagingoftheworld.com/2010/11/pit-stop-cafe-student-work.html', imageFile: 'Pit Stop Café.jpg' },
  { title: 'Bag in Bag Wine', url: 'https://packagingoftheworld.com/2010/10/bag-in-bag-wine-vernissage.html', imageFile: 'Bag in Bag Wine.jpg' },
  { title: 'Yo-ho-ho Juice', url: 'https://packagingoftheworld.com/2010/10/yo-ho-ho-juice.html', imageFile: 'Yo-ho-ho Juice.jpg' },
  { title: 'Fresh & Easy', url: 'https://packagingoftheworld.com/2010/10/fresh-easy-kids-cereals.html', imageFile: 'Fresh & Easy.jpg' },
  { title: 'Wild Bag', url: 'https://packagingoftheworld.com/2010/10/wild-bag.html', imageFile: 'Wild Bag.jpg' },
  { title: 'Jooze', url: 'https://packagingoftheworld.com/2010/09/jooze-student-work.html', imageFile: 'Jooze.jpg' },
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
  
  // Start from item 25 (index 24) since we got stuck on item 24
  const START_FROM_INDEX = 24
  
  console.log('═'.repeat(70))
  console.log('📦 New Packaging Items Upload')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${PACKAGING_ITEMS.length} packaging items...`)
  console.log(`🔄 Resuming from item ${START_FROM_INDEX + 1} (index ${START_FROM_INDEX})\n`)
  
  let successCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (let i = START_FROM_INDEX; i < PACKAGING_ITEMS.length; i++) {
    const item = PACKAGING_ITEMS[i]
    const imagePath = path.join(packagingDir, item.imageFile)
    
    console.log(`\n[${i + 1}/${PACKAGING_ITEMS.length}] Processing: ${item.title}`)
    console.log(`   📎 URL: ${item.url}`)
    console.log(`   🖼️  Image: ${item.imageFile}`)
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️  Image file not found: ${imagePath}`)
      console.log(`   ⏭️  Skipping...`)
      skippedCount++
      continue
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

