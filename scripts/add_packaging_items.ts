#!/usr/bin/env tsx
/**
 * Add Packaging Items
 * 
 * Bulk uploads packaging images with their titles and URLs.
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
  { title: 'Drumroll', url: 'https://bpando.org/2024/08/13/donut-doughnut-branding-design-drumroll-by-gander/', imageFile: 'Drumroll.jpg' },
  { title: 'Ginori', url: 'https://bpando.org/2024/05/14/luxury-homeware-ceramics-branding-ginori-1735-italy-florence-auge-design/', imageFile: 'Ginori.jpg' },
  { title: 'Alpina', url: 'https://lovelypackage.com/alpinas-artistic-limited-edition-packaging-for-fathers-day/', imageFile: 'Alpina.jpg' },
  { title: 'magnagaea', url: 'https://lovelypackage.com/creating-an-organic-coffee-brand-identity-the-story-of-magnagaea/', imageFile: 'magnagaea.jpg' },
  { title: 'ZafferanoDelRe', url: 'https://lovelypackage.com/studio-la-regina-designs-zafferano-del-re/', imageFile: 'ZafferanoDelRe.png' },
  { title: 'Esophy', url: 'https://lovelypackage.com/introducing-esophys-cacao-nibbles-a-unique-blend-of-mediterranean-flavours-and-modern-pop-aesthetics-in-packaging-design/', imageFile: 'Esophy.jpg' },
  { title: 'MIRATA', url: 'https://lovelypackage.com/discovering-mirata-wines-a-new-wine-packaging-design/', imageFile: 'MIRATA.jpg' },
  { title: 'KOOKSOONDANG', url: 'https://lovelypackage.com/kooksoondangs-rea-2013-born-a-blend-of-tradition-and-modernity-in-soju-packaging-design/', imageFile: 'KOOKSOONDANG.jpg' },
  { title: 'Jaja', url: 'https://lovelypackage.com/jaja-tequila-a-packaging-design-inspired-by-mexican-sunsets-and-abstract-art/', imageFile: 'Jaja.jpeg' },
  { title: 'Eljanoub', url: 'https://lovelypackage.com/exploring-the-elegance-of-moroccan-tradition-in-eljanoubs-dried-fruit-packaging-design/', imageFile: 'Eljanoub.png' },
  { title: 'Verkligs', url: 'https://lovelypackage.com/werkligs-edgy-and-modern-design-for-wild-bergs-protein-bars/', imageFile: 'Werkligs.jpeg' },
  { title: 'Cy Biopharma', url: 'https://lovelypackage.com/exploring-cy-biopharmas-unique-psychedelic-inspired-design-for-chronic-pain-treatment/', imageFile: 'Cy-Biopharmas.jpeg' },
  { title: 'Dama blanca', url: 'https://lovelypackage.com/dama-blanca-premium-packaging-design-for-salt-of-cadiz/', imageFile: 'Dama-Blanca.jpg' },
  { title: 'Changin', url: 'https://lovelypackage.com/changin-packaging-design/', imageFile: 'Changin.jpg' },
  { title: 'Simply Nuts', url: 'https://lovelypackage.com/simply-nuts-packaging-design-by-studio-oeding/', imageFile: 'SimplyNuts.jpg' },
  { title: 'laphroaig', url: 'https://lovelypackage.com/laphroaigs-wellington-boot-inspired-gift-packaging-design/', imageFile: 'Laphroaig.jpg' },
  { title: 'Insida', url: 'https://lovelypackage.com/exploring-inside-skincare-labs-unique-packaging-displaying-the-chemists-notes/', imageFile: 'inside.jpg' },
  { title: 'Fortnum & Mason', url: 'https://lovelypackage.com/fortnum-masons-inclusive-valentines-range-a-design-bridge-and-partners-collaboration/', imageFile: 'Fortnum-&-Mason.jpg' },
  { title: 'Motivational Sock', url: 'https://lovelypackage.com/motivational-sock-packaging-a-good-start-to-your-day/', imageFile: 'Motivational Sock.jpg' },
  { title: 'Wagamama', url: 'https://lovelypackage.com/sustainable-packaging-wagamama-restaurant-takeaway/', imageFile: 'Wagamama.jpg' },
  { title: 'HUX', url: 'https://lovelypackage.com/hux-packaging-design/', imageFile: 'HUX.jpg' },
  { title: 'Texas Barbecue', url: 'https://lovelypackage.com/texas-barbecue-packaging-design/', imageFile: 'Texas-barbecue.jpg' },
  { title: 'NewFish', url: 'https://lovelypackage.com/newfish-packaging-design-2/', imageFile: 'NewFish.jpg' },
  { title: 'Mara Coffee', url: 'https://lovelypackage.com/mara-coffee-branding-and-packaging-design/', imageFile: 'Mara Coffee.png' },
  { title: 'Goody', url: 'https://packagingoftheworld.com/2025/11/goody-pasta-boom-packaging-design.html', imageFile: 'Goody.png' },
  { title: 'ETERNO', url: 'https://packagingoftheworld.com/2025/11/eterno-2.html', imageFile: 'ETERNO.png' },
  { title: 'SALT', url: 'https://packagingoftheworld.com/2025/11/salt-retinal-skin-student-project.html', imageFile: 'Salt.png' },
  { title: 'Priceless', url: 'https://packagingoftheworld.com/2025/11/priceless-a-brand-dealing-in-the-last-true-currency-attention.html', imageFile: 'Priceless.webp' },
  { title: 'Stadium', url: 'https://packagingoftheworld.com/2025/11/stadium-box-design.html', imageFile: 'Stadium.webp' },
  { title: 'DolceSalavato', url: 'https://packagingoftheworld.com/2025/11/dolcesalavato.html', imageFile: 'DolceSalavato .webp' },
  { title: 'Frizzio Kombucha', url: 'https://packagingoftheworld.com/2025/11/frizzio-kombucha.html', imageFile: 'Frizzio Kombucha.webp' },
  { title: 'Ardenne', url: 'https://packagingoftheworld.com/2025/11/ardenne.html', imageFile: 'Ardenne.webp' },
  { title: 'Outsiders', url: 'https://www.creativeboom.com/news/outsiders-designs-out-of-this-world-identity-for-supernatural-wines/', imageFile: 'Outsiders.jpg' },
  // New entries
  { title: 'Mittereum', url: 'https://packagingoftheworld.com/2025/10/mittereum.html', imageFile: 'mittereum.jpg' },
  { title: 'PERMANENT PAINT', url: 'https://packagingoftheworld.com/2025/08/permanent-paint.html', imageFile: 'permanent paint.jpg' },
  { title: 'NAK corporate gifts', url: 'https://packagingoftheworld.com/2025/08/nak-corporate-gifts.html', imageFile: 'NAK corporate gifts.webp' },
  { title: 'Freedom', url: 'https://packagingoftheworld.com/2025/07/freed%d0%be%d0%bc-packs-for-small-home-repairs.html', imageFile: 'Freedom.webp' },
  { title: 'InSec Disinfect', url: 'https://packagingoftheworld.com/2025/05/insec-disinfect.html', imageFile: 'InSec Disinfect.webp' },
  { title: 'Vörda 2.0', url: 'https://packagingoftheworld.com/2025/04/vorda-2-0.html', imageFile: 'Vorda 2.0' },
  { title: 'Worktree', url: 'https://packagingoftheworld.com/2025/03/worktree-sustainable-packaging-system.html', imageFile: 'Worktree.jpg' },
  { title: 'Urban Design', url: 'https://packagingoftheworld.com/2025/03/manhole-covers-urban-design.html', imageFile: 'Urban Design.jpg' },
  { title: 'Buzzz', url: 'https://packagingoftheworld.com/2024/12/buzzz.html', imageFile: 'Buzzz.webp' },
  { title: 'Dried', url: 'https://packagingoftheworld.com/2024/07/dried-moisture-absorber.html', imageFile: 'Dried.jpg' },
  { title: 'Bodi Heni', url: 'https://packagingoftheworld.com/2024/07/bodi-henis-herbarium-artistic-plant-relief-packaging.html', imageFile: 'Bodi Heni.webp' },
  { title: 'imash', url: 'https://packagingoftheworld.com/2024/07/imash-modular-funeral-urns.html', imageFile: 'imash.jpg' },
  { title: 'Philips Hue', url: 'https://packagingoftheworld.com/2024/04/philips-hue-packaging-redesign.html', imageFile: 'Philips Hue.webp' },
  { title: 'FANCY BOX', url: 'https://packagingoftheworld.com/2024/04/fancy-box-washing-powder-packaging.html', imageFile: 'FANCY BOX.webp' },
  { title: 'Hertools', url: 'https://packagingoftheworld.com/2024/04/womens-construction-tools.html', imageFile: 'Hertools.jpg' },
  { title: 'Design South', url: 'https://packagingoftheworld.com/2024/04/design-south-leap-first-and-trust-the-process.html', imageFile: 'Design South.png' },
  { title: 'Yrus Lights', url: 'https://packagingoftheworld.com/2024/03/yrus-lights.html', imageFile: 'Yrus Lights.png' },
  { title: 'De Stul', url: 'https://packagingoftheworld.com/2024/02/interior-items-de-stul-packaging.html', imageFile: 'De Stul.jpg' },
  { title: 'Oreo & Friends', url: 'https://packagingoftheworld.com/2022/08/oreo-friends.html', imageFile: 'Oreo & Friends.jpg' },
  { title: 'Lush Christmas', url: 'https://packagingoftheworld.com/2021/11/lush-christmas.html', imageFile: 'Lush Christmas.jpg' },
  // More entries
  { title: 'L\'Amour', url: 'https://packagingoftheworld.com/2020/10/lamour-macaroon-bathing-bars.html', imageFile: 'L\'Amour.jpg' },
  { title: 'Allianz', url: 'https://packagingoftheworld.com/2020/04/allianz-life-carrying-package.html', imageFile: 'Allianz.jpg' },
  { title: 'Safari Friends', url: 'https://packagingoftheworld.com/2012/09/safari-friends-collection.html', imageFile: 'Safari Friends.jpg' },
  { title: 'Miyakko', url: 'https://packagingoftheworld.com/2025/11/miyako-umami-flavored-green-iced-tea-beverage.html', imageFile: 'Miyakko.jpg' },
  { title: 'Truly Deeply', url: 'https://packagingoftheworld.com/2025/10/truly-deeply.html', imageFile: 'Truly Deeply .jpg' },
  { title: 'Fresca', url: 'https://packagingoftheworld.com/2025/10/fresca-organic-snack-vegetables-packaging.html', imageFile: 'Fresca.jpg' },
  { title: 'Zhevaka', url: 'https://packagingoftheworld.com/2025/10/zhevaka-dogs-dental-care-treats.html', imageFile: 'Zhevaka.jpg' },
  { title: 'Gelo', url: 'https://packagingoftheworld.com/2025/10/gelo-celo-ice-cream.html', imageFile: 'Gelo.webp' },
  { title: 'Naira needs Sleep', url: 'https://packagingoftheworld.com/2025/10/even-the-naira-needs-sleep-x-sleephammer.html', imageFile: 'Naira needs Sleep.jpg' },
  { title: 'Barilla', url: 'https://packagingoftheworld.com/2025/10/open-in-case-of-pizza.html', imageFile: 'Barilla.jpg' },
  { title: 'CAPCUP', url: 'https://packagingoftheworld.com/2025/10/capcup.html', imageFile: 'CAPCUP.png' },
  { title: 'SOKO', url: 'https://packagingoftheworld.com/2025/10/soko-over-the-moon-ii.html', imageFile: 'SOKO.png' },
  { title: 'Khanak', url: 'https://packagingoftheworld.com/2025/10/khanak.html', imageFile: 'Khanak.jpg' },
  { title: 'Glowwell', url: 'https://packagingoftheworld.com/2025/09/glowwell.html', imageFile: 'Glowwell.jpg' },
  { title: 'BEEFEATER', url: 'https://packagingoftheworld.com/2025/09/beefeater.html', imageFile: 'BEEFEATER.jpg' },
  { title: 'Qia Qia', url: 'https://packagingoftheworld.com/2025/09/qia-qia-firewood-fragrant-peanuts.html', imageFile: 'Qia Qia.jpg' },
  { title: '¡TOMATADOR!', url: 'https://packagingoftheworld.com/2025/09/tomatador-tomato-juice.html', imageFile: '¡TOMATADOR!.jpg' },
  { title: 'Tapeno', url: 'https://packagingoftheworld.com/2025/09/tapeno.html', imageFile: 'Tapeno.jpg' },
  { title: 'THE RICE\'s Guardian', url: 'https://packagingoftheworld.com/2025/09/the-rices-guardian.html', imageFile: 'THE RICE\'s Guardian.png' },
  { title: 'Shiguangqu', url: 'https://packagingoftheworld.com/2025/08/shiguangqu-pet-cat-food-pack.html', imageFile: 'Shiguangqu.webp' },
  { title: 'Boiling point', url: 'https://packagingoftheworld.com/2025/08/boiling-point-where-sustainability-meets-fluid-design.html', imageFile: 'Boiling point.jpg' },
  { title: 'Olura', url: 'https://packagingoftheworld.com/2025/09/olura.html', imageFile: 'Olura.png' },
  { title: 'Nue', url: 'https://packagingoftheworld.com/2025/08/nue.html', imageFile: 'Nue.jpg' },
  { title: 'JoyEats', url: 'https://packagingoftheworld.com/2025/08/joyeats.html', imageFile: 'JoyEats.jpg' },
  { title: 'LITALY', url: 'https://packagingoftheworld.com/2025/08/litaly.html', imageFile: 'LITALY.png' },
  { title: 'Zhaga', url: 'https://packagingoftheworld.com/2025/08/zhaga.html', imageFile: 'Zhaga.jpeg' },
  { title: 'snack!', url: 'https://packagingoftheworld.com/2025/08/snack.html', imageFile: 'snack!.jpg' },
  { title: '600', url: 'https://packagingoftheworld.com/2025/08/a-new-altitude-for-a-timeless-wine.html', imageFile: '600.jpg' },
  { title: 'Regma', url: 'https://packagingoftheworld.com/2025/08/regma-logo.html', imageFile: 'Regma.jpg' },
  { title: 'Roastory', url: 'https://packagingoftheworld.com/2025/08/roastory-coffee.html', imageFile: 'ROASTORY.webp' },
  { title: 'Filema Rodion', url: 'https://packagingoftheworld.com/2025/07/filema-rodion-anniversary-box.html', imageFile: 'Filema Rodion.webp' },
  { title: 'Sorigami', url: 'https://packagingoftheworld.com/2025/07/sorigami.html', imageFile: 'Sorigami.png' },
  { title: 'Innovite', url: 'https://packagingoftheworld.com/2025/07/innovite-forest-can.html', imageFile: 'Innovite.webp' },
  { title: 'Tram', url: 'https://packagingoftheworld.com/2025/07/tram-cream-coffee.html', imageFile: 'Tram.png' },
  { title: 'Parallax', url: 'https://packagingoftheworld.com/2025/07/essential-oils-for-hammam-parallax.html', imageFile: 'Parallax.jpg' },
  { title: 'Naked', url: 'https://packagingoftheworld.com/2025/06/naked.html', imageFile: 'Naked.webp' },
  { title: 'Bee Different', url: 'https://packagingoftheworld.com/2025/06/bee-different.html', imageFile: 'Bee Different.jpg' },
  { title: 'Mask', url: 'https://packagingoftheworld.com/2025/06/mask-eau-de-parfum.html', imageFile: 'Mask.webp' },
  { title: 'Ñamgucheria', url: 'https://packagingoftheworld.com/2025/06/namgucheria.html', imageFile: 'Ñamgucheria.jpg' },
  { title: 'Cheeky donuts', url: 'https://packagingoftheworld.com/2025/06/cheeky-donuts.html', imageFile: 'Cheeky donuts.jpg' },
  { title: 'Chicken', url: 'https://packagingoftheworld.com/2025/05/chicken-drumstick-sauce.html', imageFile: 'Chicken.png' },
  { title: 'LUMO', url: 'https://packagingoftheworld.com/2025/05/lumo.html', imageFile: 'LUMO.jpg' },
  { title: 'Go Bananas!', url: 'https://packagingoftheworld.com/2025/05/go-bananas.html', imageFile: 'Go Bananas!.webp' },
  { title: 'Rainfresh', url: 'https://packagingoftheworld.com/2025/04/rainfresh-daily-fresh-milk.html', imageFile: 'Rainfresh.webp' },
  { title: 'Tría', url: 'https://packagingoftheworld.com/2025/04/tria-single-material-packaging-for-canned-food.html', imageFile: 'Tría.jpg' },
  { title: 'Honey Bear', url: 'https://packagingoftheworld.com/2025/03/honey-bear.html', imageFile: 'Honey Bear.jpg' },
  { title: 'Fun food', url: 'https://packagingoftheworld.com/2025/03/redesign-of-nachos-sauce-packaging.html', imageFile: 'Fun food.webp' },
  { title: 'TSMP', url: 'https://packagingoftheworld.com/2025/03/designing-and-producing-gift-sets-for-tsmp-law-corporation.html', imageFile: 'TSMP.jpeg' },
  { title: 'Shamp', url: 'https://packagingoftheworld.com/2025/02/shamp.html', imageFile: 'Shamp.jpg' },
  { title: 'Social', url: 'https://packagingoftheworld.com/2025/01/social-beer-%c2%b7-brand-identity-design.html', imageFile: 'social.webp' },
  { title: 'Connect 4', url: 'https://packagingoftheworld.com/category/best-rated/page/8', imageFile: 'Connect 4.webp' },
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
  console.log('📦 Packaging Items Upload')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${PACKAGING_ITEMS.length} packaging items...\n`)
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  for (let i = 0; i < PACKAGING_ITEMS.length; i++) {
    const item = PACKAGING_ITEMS[i]
    const imagePath = path.join(packagingDir, item.imageFile)
    
    console.log(`\n[${i + 1}/${PACKAGING_ITEMS.length}] ${item.title}`)
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

