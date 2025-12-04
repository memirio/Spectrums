#!/usr/bin/env tsx
/**
 * Add Packaging Items - Batch 5
 * 
 * Bulk uploads new packaging images with their titles and URLs.
 * Testing optimized data transfer (expected ~100 MB for 60 images).
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
  { title: 'BANG', url: 'https://packagingoftheworld.com/2014/10/bang.html', imageFile: 'BANG.jpg' },
  { title: '5 Balsamic Estate', url: 'https://packagingoftheworld.com/2014/10/5-balsamic-estate-vinegar.html', imageFile: '5 Balsamic Estate.jpg' },
  { title: 'Senba Tea', url: 'https://packagingoftheworld.com/2014/10/senba-tea-concept.html', imageFile: 'Senba Tea.jpg' },
  { title: 'GAEA', url: 'https://packagingoftheworld.com/2014/10/gaea-fruit-bars.html', imageFile: 'GAEA.jpg' },
  { title: 'Stitch Bears', url: 'https://packagingoftheworld.com/2014/10/stitch-bears-milk-soap.html', imageFile: 'Stitch Bears.jpg' },
  { title: 'Minori Sake', url: 'https://packagingoftheworld.com/2014/10/minori-sake-student-project.html', imageFile: 'Minori Sake.jpg' },
  { title: 'Guilty Pleasures', url: 'https://packagingoftheworld.com/2014/10/guilty-pleasures.html', imageFile: 'Guilty Pleasures.jpg' },
  { title: 'Gourmet-club', url: 'https://packagingoftheworld.com/2014/09/exotic-coffee-collection-by-paradise.html', imageFile: 'Gourmet-club.jpg' },
  { title: 'Mjólk er góð', url: 'https://packagingoftheworld.com/2014/09/mjolk-er-go.html', imageFile: 'Mjólk er góð.jpg' },
  { title: 'The Bête & Fête Event', url: 'https://packagingoftheworld.com/2014/09/the-bete-fete-event.html', imageFile: 'The Bête & Fête Event.jpg' },
  { title: 'Longplate', url: 'https://packagingoftheworld.com/2014/09/longplate.html', imageFile: 'Longplate.jpg' },
  { title: 'Frutteto', url: 'https://packagingoftheworld.com/2014/09/frutteto.html', imageFile: 'Frutteto.jpg' },
  { title: 'Yousli', url: 'https://packagingoftheworld.com/2014/09/yousli.html', imageFile: 'Yousli.jpg' },
  { title: 'Click and Grow', url: 'https://packagingoftheworld.com/2014/09/click-and-grow-strawberry-smartpot.html', imageFile: 'Click and Grow.jpg' },
  { title: 'The Goode Coffee', url: 'https://packagingoftheworld.com/2014/09/the-goode-coffee-concept.html', imageFile: 'The Goode Coffee.jpg' },
  { title: 'NOA Potions', url: 'https://packagingoftheworld.com/2014/09/noa-potions.html', imageFile: 'NOA Potions.jpg' },
  { title: 'Colores Santos', url: 'https://packagingoftheworld.com/2014/08/colores-santos.html', imageFile: 'Colores Santos.jpg' },
  { title: 'Khulu Soap', url: 'https://packagingoftheworld.com/2014/08/khulu-soap.html', imageFile: 'Khulu Soap.png' },
  { title: 'SHIZEN', url: 'https://packagingoftheworld.com/2014/08/shizen.html', imageFile: 'SHIZEN.jpg' },
  { title: 'Piedra Negra', url: 'https://packagingoftheworld.com/2014/08/piedra-negra.html', imageFile: 'Piedra Negra.jpg' },
  { title: 'SensoryLab', url: 'https://packagingoftheworld.com/2014/08/sensorylab.html', imageFile: 'SensoryLab.jpg' },
  { title: 'Moo Goo Syrups', url: 'https://packagingoftheworld.com/2014/08/moo-goo-syrups.html', imageFile: 'Moo Goo Syrups.jpg' },
  { title: 'Eroski', url: 'https://packagingoftheworld.com/2014/07/eroski-ice-cream-wafers.html', imageFile: 'Eroski.jpg' },
  { title: 'Chelsea', url: 'https://packagingoftheworld.com/2014/07/chelsea-golden-syrup.html', imageFile: 'Chelsea.jpg' },
  { title: 'Party Barons', url: 'https://packagingoftheworld.com/2014/07/party-barons-concept.html', imageFile: 'Party Barons.jpg' },
  { title: 'LEICA X2 EDITION', url: 'https://packagingoftheworld.com/2014/07/the-paper-skin-leica-x2-edition.html', imageFile: 'Leica X2 Edition.jpg' },
  { title: 'Trident Gum', url: 'https://packagingoftheworld.com/2014/07/trident-gum-concept.html', imageFile: 'Trident Gum.jpg' },
  { title: 'Glico', url: 'https://packagingoftheworld.com/2014/07/glico-stand-by-me-doraemon-ar-packaging.html', imageFile: 'Glico.jpg' },
  { title: 'Gbox Studios', url: 'https://packagingoftheworld.com/2014/07/gbox.html', imageFile: 'Gbox Studios.jpg' },
  { title: 'Ridna Marka', url: 'https://packagingoftheworld.com/2014/07/ridna-marka.html', imageFile: 'Ridna Marka.jpg' },
  { title: 'Gogreek', url: 'https://packagingoftheworld.com/2014/07/gogreek-ouzo-miniatures.html', imageFile: 'Gogreek.jpg' },
  { title: 'Artifact Masque', url: 'https://packagingoftheworld.com/2014/06/artifact-masque.html', imageFile: 'Artifact Masque.jpg' },
  { title: 'Real Shit', url: 'https://packagingoftheworld.com/2014/06/real-shit-organic-manure.html', imageFile: 'Real Shit.jpg' },
  { title: 'Light of Day', url: 'https://packagingoftheworld.com/2014/06/light-of-day-warmth-of-sunshine.html', imageFile: 'Light of Day.jpg' },
  { title: 'Lapp & Fao', url: 'https://packagingoftheworld.com/2014/05/lapp-fao-chocolate.html', imageFile: 'Lapp & Fao.png' },
  { title: 'Vital Plus', url: 'https://packagingoftheworld.com/2015/01/vital-plus.html', imageFile: 'Vital Plus.jpg' },
  { title: 'CORONA', url: 'https://packagingoftheworld.com/2015/01/corona-greek-olive-oil.html', imageFile: 'CORONA.jpg' },
  { title: 'Shen Fu Ren', url: 'https://packagingoftheworld.com/2015/01/shen-fu-ren-ginseng-products.html', imageFile: 'Shen Fu Ren.jpg' },
  { title: 'Mason & Co', url: 'https://packagingoftheworld.com/2014/12/mason-co-chocolate-bars-dark-chocolate.html', imageFile: 'Mason & Co.jpg' },
  { title: 'Warm Me', url: 'https://packagingoftheworld.com/2014/12/warm-me-kids-yogurt.html', imageFile: 'Warm Me.jpg' },
  { title: 'FØLE', url: 'https://packagingoftheworld.com/2014/12/fle-skin-care-product-line.html', imageFile: 'FØLE.jpg' },
  { title: 'Starka', url: 'https://packagingoftheworld.com/2014/12/starka.html', imageFile: 'Starka.jpg' },
  { title: 'Basik', url: 'https://packagingoftheworld.com/2014/12/basik.html', imageFile: 'Basik.jpg' },
  { title: 'Sling-Slang', url: 'https://packagingoftheworld.com/2014/12/sling-slang-yoyo.html', imageFile: 'Sling-Slang.jpg' },
  { title: 'Tan Ren Tan', url: 'https://packagingoftheworld.com/2014/12/tan-ren-tan-honey.html', imageFile: 'Tan Ren Tan.jpg' },
  { title: 'Robot Roy', url: 'https://packagingoftheworld.com/2014/12/robot-roy-nutcracker-toy.html', imageFile: 'Robot Roy.jpg' },
  { title: 'Neat Confections', url: 'https://packagingoftheworld.com/2014/11/neat-confections.html', imageFile: 'Neat Confections.jpg' },
  { title: 'Panino', url: 'https://packagingoftheworld.com/2014/11/panino-organic-rice.html', imageFile: 'Panino.jpg' },
  { title: 'Mouth Spray Wine', url: 'https://packagingoftheworld.com/2014/11/mouth-spray-wine-self-promotion.html', imageFile: 'Mouth Spray Wine.png' },
  { title: 'Ashridge Drinks', url: 'https://packagingoftheworld.com/2014/11/ashridge-drinks.html', imageFile: 'Ashridge Drinks.jpg' },
  { title: 'Dunhill', url: 'https://packagingoftheworld.com/2014/11/dunhill-special-reserve-global-travel.html', imageFile: 'Dunhill.jpg' },
  { title: 'Finca de la Rica', url: 'https://packagingoftheworld.com/2014/11/finca-de-la-rica.html', imageFile: 'Finca de la Rica.jpg' },
  { title: 'Spotify', url: 'https://packagingoftheworld.com/2014/11/spotify-goes-physical.html', imageFile: 'Spotify.jpg' },
  { title: 'Zombis Freezer Pops', url: 'https://packagingoftheworld.com/2014/10/zombis-freezer-pops.html', imageFile: 'Zombis Freezer Pops.jpg' },
  { title: 'BLOKOGRAFIA', url: 'https://packagingoftheworld.com/2014/10/blokografia-modernist-alphabet-by.html', imageFile: 'BLOKOGRAFIA.jpg' },
  { title: 'Clutch Bodyshop', url: 'https://packagingoftheworld.com/2014/10/clutch-bodyshop.html', imageFile: 'Clutch Bodyshop.jpg' },
  { title: 'Nom d\'un chien', url: 'https://packagingoftheworld.com/2014/10/nom-dun-chien-concept.html', imageFile: 'Nom d\'un chien.jpg' },
  { title: 'Volksbier', url: 'https://packagingoftheworld.com/2014/10/volksbier.html', imageFile: 'Volksbier.jpg' },
  { title: 'Just Laid', url: 'https://packagingoftheworld.com/2014/10/just-laid-concept.html', imageFile: 'Just Laid.jpg' },
  { title: 'Garzisi Saffron', url: 'https://packagingoftheworld.com/2014/10/garzisi-saffron.html', imageFile: 'Garzisi Saffron.png' },
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
          contentHash: null,
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
      const concepts = await prisma.concept.findMany({
        select: {
          id: true,
          embedding: true,
        },
      })
      
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
      const concepts = await prisma.concept.findMany({
        select: {
          id: true,
          embedding: true,
        },
      })
      
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
  console.log('📦 Packaging Items Upload - Batch 5 (Testing Optimizations)')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${PACKAGING_ITEMS.length} packaging items...`)
  console.log(`Expected data transfer: ~100 MB (with optimizations)\n`)
  
  let successCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  for (let i = 0; i < PACKAGING_ITEMS.length; i++) {
    const item = PACKAGING_ITEMS[i]
    let imagePath = path.join(packagingDir, item.imageFile)
    
    console.log(`\n[${i + 1}/${PACKAGING_ITEMS.length}] Processing: ${item.title}`)
    console.log(`   📎 URL: ${item.url}`)
    console.log(`   🖼️  Image: ${item.imageFile}`)
    
    // Check if image file exists - try exact match first, then fuzzy match for special characters
    if (!fs.existsSync(imagePath)) {
      // Try to find file with similar name (handles special character differences)
      const allFiles = fs.readdirSync(packagingDir)
      const titleLower = item.title.toLowerCase()
      const keyWords = titleLower.split(/[\s'-]+/).filter(w => w.length > 2)
      const fuzzyMatch = allFiles.find(f => {
        const fLower = f.toLowerCase()
        // Match if filename contains at least 2 key words from title
        const matches = keyWords.filter(word => fLower.includes(word))
        return matches.length >= Math.min(2, keyWords.length)
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
  console.log(`\n💡 Check Supabase dashboard for actual data transfer`)
  console.log(`   Expected: ~100 MB (with optimizations)`)
  console.log(`   Before optimization would have been: ~3.1 GB`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

