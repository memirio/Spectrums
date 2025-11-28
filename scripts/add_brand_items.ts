#!/usr/bin/env tsx
/**
 * Add Brand Items
 * 
 * Bulk uploads brand images with their titles and URLs.
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

interface BrandItem {
  title: string
  url: string
  imageFile: string
}

const BRAND_ITEMS: BrandItem[] = [
  { title: 'MN', url: 'https://packagingoftheworld.com/2025/11/mn-brand-identity-packaging.html', imageFile: 'MN.webp' },
  { title: 'Tropina', url: 'https://packagingoftheworld.com/2025/11/tropina-visual-brand-identity-design.html', imageFile: 'Tropina.webp' },
  { title: 'Just Juice', url: 'https://packagingoftheworld.com/2025/06/just-juice-brand-identity-packaging-design.html', imageFile: 'Just Juice.webp' },
  { title: 'UrbanPlate', url: 'https://packagingoftheworld.com/2025/04/restaurant-brand-identity-packaging-urbanplate.html', imageFile: 'UrbanPlate.webp' },
  { title: 'Pocha', url: 'https://packagingoftheworld.com/2025/02/pocha-%c2%b7-korean-food-brand-identity.html', imageFile: 'pocha.webp' },
  { title: 'Hole In The Wall', url: 'https://packagingoftheworld.com/2025/02/hole-in-the-wall-%c2%b7-visual-identity-and-packaging-design.html', imageFile: 'Hole In The Wall.webp' },
  { title: 'Fizli', url: 'https://packagingoftheworld.com/2024/12/fizli-beverage-brand-identity-and-packaging.html', imageFile: 'fizli.png' },
  { title: 'Ora mouse', url: 'https://packagingoftheworld.com/2024/12/ora-mouse-brand-identity.html', imageFile: 'Ora mouse.webp' },
  { title: 'Underground', url: 'https://packagingoftheworld.com/2024/08/underground-brand-identity.html', imageFile: 'Underground.jpg' },
  { title: 'Vida', url: 'https://packagingoftheworld.com/2024/05/vida-pura-vida-cocktail-brand-identity-packaging-design.html', imageFile: 'Vida.jpg' },
  { title: 'Papita.Club', url: 'https://packagingoftheworld.com/2024/06/papita-club-lifestyle-brand-brand-identity-design.html', imageFile: 'Papita.Club' },
  { title: 'NINE', url: 'https://packagingoftheworld.com/2024/05/nine-brand-identity-creation.html', imageFile: 'Nine.webp' },
  { title: 'KÜZLER', url: 'https://packagingoftheworld.com/2023/11/kuzler-brand-identity-packaging.html', imageFile: 'KÜZLER.webp' },
  { title: 'Kavic', url: 'https://packagingoftheworld.com/2023/08/kevic-cafe-brand-identity.html', imageFile: 'Kavic.jpg' },
  { title: 'T.A.B.', url: 'https://packagingoftheworld.com/2025/09/t-a-b-packaging-identity.html', imageFile: 'T.A.B.' },
  { title: 'Aurié', url: 'https://packagingoftheworld.com/2025/09/aurie-skincare-brand-design.html', imageFile: 'Aurié.webp' },
  // New batch
  { title: 'KOBA', url: 'https://packagingoftheworld.com/2025/09/weaving-heritage-innovation-koba-textile-identity-by-sold.html', imageFile: 'KOBA.png' },
  { title: 'Rollover', url: 'https://packagingoftheworld.com/2025/08/rollover-brand-refresh.html', imageFile: 'Rollover.webp' },
  { title: 'Curame', url: 'https://packagingoftheworld.com/2025/06/hair-care-branding-curame.html', imageFile: 'CURAME.webp' },
  { title: 'Kham', url: 'https://packagingoftheworld.com/2025/01/kham-leather-branding-packaging.html', imageFile: 'Kham.webp' },
  { title: 'Integhub', url: 'https://packagingoftheworld.com/2025/01/integhub-visual-identity.html', imageFile: 'Integhub.jpg' },
  { title: 'Sol', url: 'https://worldbranddesign.com/sol-radiates-optimism-with-a-new-global-identity-and-packaging-by-love/', imageFile: 'Sol.jpg' },
  { title: 'Dropshop', url: 'https://worldbranddesign.com/crisis-launches-dropshop-a-revamp-of-their-outlet-store-in-partnership-with-dalziel-pow/', imageFile: 'dropshop.jpg' },
  { title: 'The Fine Arts Building', url: 'https://www.canteraestudio.com/work/fab', imageFile: 'The Fine Arts Building.webp' },
  { title: 'Evotix', url: 'https://worldbranddesign.com/evotix-brand-design-creation-by-brud-x-brands2life/', imageFile: 'Evotix.jpg' },
  { title: 'Hopscotch', url: 'https://worldbranddesign.com/hopscotch-brand-design-creation-by-motto/', imageFile: 'Hopscotch.jpg' },
  { title: 'TD Credito', url: 'https://worldbranddesign.com/td-credito-wings-to-your-investment-by-super-brand-consultants/', imageFile: 'TD Credito.jpg' },
  { title: 'Scale 7', url: 'https://worldbranddesign.com/brand-identity-and-brand-language-for-scale-7-by-the-creative-union/', imageFile: 'Scale 7.jpg' },
  { title: 'Babord', url: 'https://worldbranddesign.com/babord-brand-redesign-by-kind/', imageFile: 'Babord.jpg' },
  { title: 'Fathom', url: 'https://worldbranddesign.com/fathom-brand-identity-a-nostalgic-approach-for-a-forward-thinking-company/', imageFile: 'Fathom.jpg' },
  { title: 'BioSystems', url: 'https://worldbranddesign.com/human-centred-biotech-branding-by-morillas/', imageFile: 'BioSystems.jpg' },
  { title: 'Jing-A', url: 'https://worldbranddesign.com/brand-redesign-for-jing-a/', imageFile: 'Jing-A.jpg' },
  { title: 'Bnavan', url: 'https://worldbranddesign.com/backbone-branding-creates-bnavan-brand-identity-and-packaging-design/', imageFile: 'Bnavan.jpg' },
  { title: 'Profaligner', url: 'https://worldbranddesign.com/selwaye-studio-create-profaligner-identity-and-packaging/', imageFile: 'Profaligner.jpg' },
  { title: 'Collectve', url: 'https://worldbranddesign.com/brand-identity-for-collectve-advisors-by-notion-branding/', imageFile: 'Collectve.jpg' },
  { title: 'Good Nature', url: 'https://worldbranddesign.com/fellow-studio-creates-brand-and-packaging-design-for-good-nature-premium-cbd-products/', imageFile: 'Good Nature.jpg' },
  { title: 'LA Developers', url: 'https://worldbranddesign.com/and-us-agency-create-rebranding-for-la-developers/', imageFile: 'LA Developers.jpeg' },
  { title: 'Moja Cooking', url: 'https://worldbranddesign.com/my-creative-spicing-it-up-for-moja-cooking/', imageFile: 'Moja Cooking.jpg' },
  { title: 'Loch Duart', url: 'https://worldbranddesign.com/hunger-give-loch-duart-salmon-a-luxurious-rebrand/', imageFile: 'Loch Duart.png' },
  { title: 'The Disability Resources Centre', url: 'https://worldbranddesign.com/the-bold-rebrand-powering-disability-rights-forward-by-the-edison-agency/', imageFile: 'The Disability Resources Centre.jpeg' },
  { title: 'Moveforth', url: 'https://worldbranddesign.com/moveforth-studio-designs-an-identity-that-reflects-its-specialization-in-brand-ecosystems/', imageFile: 'Moveforth.jpg' },
  { title: 'Doto', url: 'https://worldbranddesign.com/an-identity-where-contrast-meets-clarity-crafted-for-women-living-many-lives-by-studiodraft/', imageFile: 'Doto.jpg' },
  { title: 'IAG', url: 'https://worldbranddesign.com/clout-branding-inspires-genai-movement-with-brand-campaign-for-iag/', imageFile: 'IAG.jpg' },
  { title: 'Ali Tayeb', url: 'https://worldbranddesign.com/ali-tayeb-redefines-the-ali-tayeb-visual-identity-through-a-spinning-top-metaphor-that-unites-motion-and-structure/', imageFile: 'Ali Tayeb.jpg' },
  { title: 'Smål Market', url: 'https://people-people.com/project/smal-market/', imageFile: 'Smål market.jpg' },
  { title: 'sunshine', url: 'https://worldbranddesign.com/agencia-bud-elevates-sunshine-with-a-strategic-architecture-vision-that-redefines-modern-spaces/', imageFile: 'sunshine.jpg' },
  // New batch
  { title: 'Zenova', url: 'https://worldbranddesign.com/arkdentity-redefines-digital-harmony-with-zenovas-ai-powered-design/', imageFile: 'Zenova.jpg' },
  { title: 'Hedepy', url: 'https://worldbranddesign.com/marlon-studio-redefines-hedepy-with-a-human-centered-brand-identity/', imageFile: 'Hedepy.jpg' },
  { title: 'BIG024', url: 'https://worldbranddesign.com/vimem-redefines-temporal-design-with-big024-visual-identity/', imageFile: 'BIG024.jpg' },
  { title: 'Volgafest', url: 'https://worldbranddesign.com/rebranding-of-the-volgafest-festival-by-student-sofya-grazhevich/', imageFile: 'Volgafest.jpg' },
  { title: 'Seoul Stick', url: 'https://www.braaands.co/brands/nominees/seoul-stick', imageFile: 'Seoul Stick.avif' },
  { title: 'Rally club', url: 'https://www.braaands.co/brands/nominees/rally-club', imageFile: 'Rally club.avif' },
  { title: 'EA', url: 'https://www.instrument.com/work/electronic-arts?ref=rebrand', imageFile: 'EA.webp' },
  { title: 'Zazu', url: 'https://www.bruno.co/en-us/zazu?ref=rebrand', imageFile: 'Zazu.avif' },
  { title: 'Plaid', url: 'https://plaid.com/blog/plaid-the-fabric-of-financial-progress/?ref=rebrand', imageFile: 'Plaid.gif' },
  { title: 'Towpath', url: 'https://www.jekyll.studio/towpath?ref=rebrand', imageFile: 'Towpath.webp' },
  { title: 'Superhuman', url: 'https://medium.com/smith-diction/branding-superhuman-and-grammarly-and-coda-8c57f970bead', imageFile: 'Superhuman.gif' },
  { title: 'Trust', url: 'https://www.lovework.studio/projects/trust?ref=rebrand', imageFile: 'Trust.webp' },
  { title: 'Toca boca', url: 'https://boldscandinavia.com/work/tocaboca?ref=rebrand', imageFile: 'Toca boca.webp' },
]

async function processImage(filePath: string, site: any, category: string = 'brand'): Promise<void> {
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
      category: category, // Set category to "brand"
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
  const brandDir = '/Users/victor/Downloads/FireShot/Brand'
  
  console.log('═'.repeat(70))
  console.log('🎨 Brand Items Upload')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${BRAND_ITEMS.length} brand items...\n`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  for (let i = 0; i < BRAND_ITEMS.length; i++) {
    const item = BRAND_ITEMS[i]
    const imagePath = path.join(brandDir, item.imageFile)
    
    console.log(`\n[${i + 1}/${BRAND_ITEMS.length}] ${item.title}`)
    console.log(`   URL: ${item.url}`)
    console.log(`   Image: ${item.imageFile}`)
    
    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️  Image file not found: ${imagePath}`)
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
      await processImage(imagePath, site, 'brand')
      
      successCount++
      
      // Small delay to avoid overwhelming the system
      if (i < BRAND_ITEMS.length - 1) {
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
  console.log(`   Total:   ${BRAND_ITEMS.length}`)
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

