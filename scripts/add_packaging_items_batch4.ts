#!/usr/bin/env tsx
/**
 * Add Packaging Items - Batch 4
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
  { title: 'Jeanyuan', url: 'https://packagingoftheworld.com/2012/12/jeanyuan.html', imageFile: 'Jeanyuan.jpg' },
  { title: 'Bombay Sapphire', url: 'https://packagingoftheworld.com/2012/11/bombay-sapphire-electro-global-travel.html', imageFile: 'Bombay Sapphire.gif' },
  { title: 'Trafiq', url: 'https://packagingoftheworld.com/2012/11/trafiq.html', imageFile: 'Trafiq.jpg' },
  { title: 'Toast For Cheese', url: 'https://packagingoftheworld.com/2012/11/toast-for-cheese.html', imageFile: 'Toast For Cheese.jpg' },
  { title: 'Foxy Tea', url: 'https://packagingoftheworld.com/2012/10/foxy-tea.html', imageFile: 'Foxy Tea.jpg' },
  { title: 'Pietro Gala', url: 'https://packagingoftheworld.com/2012/10/pietro-gala.html', imageFile: 'Pietro Gala.jpg' },
  { title: 'Tzukaun', url: 'https://packagingoftheworld.com/2012/10/tzukaun-seafood-pastry-gift-set.html', imageFile: 'Tzukaun.jpg' },
  { title: 'FU NIANG FANG', url: 'https://packagingoftheworld.com/2012/10/fu-niang-fang-roselle-vinegar.html', imageFile: 'FU NIANG FANG.JPG' },
  { title: 'Dominos', url: 'https://packagingoftheworld.com/2012/10/dominos-homemade-pan-pizza-boxes.html', imageFile: 'Dominos.jpg' },
  { title: 'Tesco', url: 'https://packagingoftheworld.com/2012/10/tesco-cancer-research-uk-packaging.html', imageFile: 'Tesco.jpg' },
  { title: 'Hopper', url: 'https://packagingoftheworld.com/2012/10/hopper-belgian-beer-student-work.html', imageFile: 'Hopper.jpg' },
  { title: 'Poilu', url: 'https://packagingoftheworld.com/2012/09/poilu-student-work.html', imageFile: 'Poilu.jpg' },
  { title: 'Flaminio', url: 'https://packagingoftheworld.com/2012/09/flaminio.html', imageFile: 'Flaminio.jpg' },
  { title: 'STACKED Wines', url: 'https://packagingoftheworld.com/2012/09/stacked-wines.html', imageFile: 'STACKED Wines.jpg' },
  { title: 'Pasta La Vista', url: 'https://packagingoftheworld.com/2012/09/pasta-la-vista-concept.html', imageFile: 'Pasta La Vista.jpg' },
  { title: 'Jones Jumble', url: 'https://packagingoftheworld.com/2012/08/jones-jumble-soda.html', imageFile: 'Jones Jumble.jpg' },
  { title: 'Spine Vodka', url: 'https://packagingoftheworld.com/2012/08/spine-vodka-concept.html', imageFile: 'Spine Vodka.jpg' },
  { title: 'Thise Mejeri', url: 'https://packagingoftheworld.com/2012/08/thise-mejeri-student-work.html', imageFile: 'Thise Mejeri.jpg' },
  { title: 'McDonalds', url: 'https://packagingoftheworld.com/2012/08/pack-up-for-mcdonalds.html', imageFile: 'McDonalds.jpg' },
  { title: 'Good Food', url: 'https://packagingoftheworld.com/2012/07/good-food.html', imageFile: 'Good Food.jpg' },
  { title: 'Moon Cake Imperial Palace', url: 'https://packagingoftheworld.com/2012/07/moon-cake-imperial-palace.html', imageFile: 'Moon Cake Imperial Palace.jpg' },
  { title: 'Birdy Juice', url: 'https://packagingoftheworld.com/2012/07/birdy-juice-concept.html', imageFile: 'Birdy Juice.jpg' },
  { title: 'Einem', url: 'https://packagingoftheworld.com/2012/07/einem-chocolate-packaging.html', imageFile: 'Einem.jpg' },
  { title: 'Bite', url: 'https://packagingoftheworld.com/2012/06/bite.html', imageFile: 'Bite.jpg' },
  { title: 'Bzzz', url: 'https://packagingoftheworld.com/2012/06/bzzz.html', imageFile: 'Bzzz.jpg' },
  { title: 'Patakukkonen', url: 'https://packagingoftheworld.com/2012/06/patakukkonen.html', imageFile: 'Patakukkonen.jpg' },
  { title: 'Oxford', url: 'https://packagingoftheworld.com/2012/06/oxford-tissue-paper.html', imageFile: 'Oxford.jpg' },
  { title: 'Medicine Package', url: 'https://packagingoftheworld.com/2013/04/medicine-package-student-project.html', imageFile: 'Medicine Package.jpg' },
  { title: 'Oulim', url: 'https://packagingoftheworld.com/2013/04/korea-traditional-accesary-package.html', imageFile: 'Oulim.jpg' },
  { title: 'Hrsz. 737', url: 'https://packagingoftheworld.com/2013/04/hrsz-737-wine-label-concept.html', imageFile: 'Hrsz. 737.jpg' },
  { title: 'Alishan', url: 'https://packagingoftheworld.com/2013/03/alishan-tea-science.html', imageFile: 'Alishan.png' },
  { title: 'Wodka Wanessa', url: 'https://packagingoftheworld.com/2013/03/wodka-wanessa.html', imageFile: 'Wodka Wanessa.jpg' },
  { title: 'Business in a Box', url: 'https://packagingoftheworld.com/2013/03/business-in-box.html', imageFile: 'Business in a Box.jpeg' },
  { title: 'Yield', url: 'https://packagingoftheworld.com/2013/03/yield-picnic-bag.html', imageFile: 'Yield.jpg' },
  { title: 'Undercover Wine', url: 'https://packagingoftheworld.com/2013/03/undercover-wine.html', imageFile: 'Undercover Wine.jpg' },
  { title: 'Simone', url: 'https://packagingoftheworld.com/2013/02/simone-concept.html', imageFile: 'Simone.JPG' },
  { title: 'Jaf Tea', url: 'https://packagingoftheworld.com/2013/02/jaf-tea.html', imageFile: 'Jaf Tea.jpg' },
  { title: 'Bolu', url: 'https://packagingoftheworld.com/2013/02/bolu.html', imageFile: 'Bolu.jpg' },
  { title: 'Youth Lab', url: 'https://packagingoftheworld.com/2013/02/youth-lab-cosmetics.html', imageFile: 'Youth Lab.jpg' },
  { title: 'NIVEA Bar Soap', url: 'https://packagingoftheworld.com/2013/01/the-disappearing-package-nivea-bar-soap.html', imageFile: 'NIVEA Bar Soap.jpg' },
  { title: 'Generous', url: 'https://packagingoftheworld.com/2013/01/generous.html', imageFile: 'Generous.jpg' },
  { title: 'Eat&Go', url: 'https://packagingoftheworld.com/2013/01/eat-concept.html', imageFile: 'Eat&Go.jpg' },
  { title: 'Chocolates With Attitude', url: 'https://packagingoftheworld.com/2013/01/chocolates-with-attitude-2012.html', imageFile: 'Chocolates With Attitude.jpg' },
  { title: 'Panda Liquorice', url: 'https://packagingoftheworld.com/2013/01/panda-liquorice.html', imageFile: 'Panda Liquorice.jpg' },
  { title: 'Joveg', url: 'https://packagingoftheworld.com/2013/01/joveg-natural-pet-care.html', imageFile: 'Joveg.jpg' },
  { title: 'Medici', url: 'https://packagingoftheworld.com/2013/01/medici-cosmetics-milano.html', imageFile: 'Medici.jpg' },
  { title: 'Fairminds', url: 'https://packagingoftheworld.com/2012/12/fairminds.html', imageFile: 'Fairminds.jpg' },
  { title: 'Che Guarana', url: 'https://packagingoftheworld.com/2012/12/che-guarana-power-to-people.html', imageFile: 'Che Guarana.jpg' },
  { title: 'Village Farms', url: 'https://packagingoftheworld.com/2012/12/village-farms-rebrand.html', imageFile: 'Village Farms.jpg' },
  { title: 'Southern Pastures', url: 'https://packagingoftheworld.com/2013/11/southern-pastures.html', imageFile: 'Southern Pastures.png' },
  { title: 'Paperboy', url: 'https://packagingoftheworld.com/2013/11/paperboy.html', imageFile: 'Paperboy.jpg' },
  { title: 'S-TONE', url: 'https://packagingoftheworld.com/2013/11/s-tone-concept.html', imageFile: 'S-TONE.jpg' },
  { title: 'Even Better with Age', url: 'https://packagingoftheworld.com/2013/11/even-better-with-age.html', imageFile: 'Even Better with Age.jpg' },
  { title: 'Bozi Oko', url: 'https://packagingoftheworld.com/2013/10/spa-cosmetics-line-bozi-oko.html', imageFile: 'Bozi Oko.jpg' },
  { title: 'EDEN', url: 'https://packagingoftheworld.com/2013/10/eden.html', imageFile: 'EDEN.jpg' },
  { title: 'Wild Bounty', url: 'https://packagingoftheworld.com/2013/10/wild-bounty.html', imageFile: 'Wild Bounty.jpg' },
  { title: 'Firewood Vodka', url: 'https://packagingoftheworld.com/2013/10/firewood-vodka-concept.html', imageFile: 'Firewood Vodka.jpg' },
  { title: 'Taiwan High', url: 'https://packagingoftheworld.com/2013/10/taiwan-high-mountain-tea.html', imageFile: 'Taiwan High.jpg' },
  { title: 'Mastic Tears', url: 'https://packagingoftheworld.com/2013/10/mastic-tears-liqueur.html', imageFile: 'Mastic Tears.jpg' },
  { title: 'RÖNKKÖ Watches', url: 'https://packagingoftheworld.com/2013/10/ronkko-watches.html', imageFile: 'RÖNKKÖ Watches.jpg' },
  { title: 'The Black Book of Cards', url: 'https://packagingoftheworld.com/2013/09/the-black-book-of-cards-typographic-deck.html', imageFile: 'The Black Book of Cards.jpg' },
  { title: 'Sunfeel', url: 'https://packagingoftheworld.com/2013/09/sunfeel.html', imageFile: 'Sunfeel.jpg' },
  { title: 'Morrisons', url: 'https://packagingoftheworld.com/2013/09/morrisons-just-for-kids.html', imageFile: 'Morrisons.jpg' },
  { title: 'Sorvete Italia', url: 'https://packagingoftheworld.com/2013/09/sorvete-italia.html', imageFile: 'Sorvete Italia.jpg' },
  { title: 'Southwestern Distillery', url: 'https://packagingoftheworld.com/2013/09/southwestern-distillerys-gin-and-pastis.html', imageFile: 'Southwestern Distillery.jpg' },
  { title: 'Twinings', url: 'https://packagingoftheworld.com/2013/08/twinings-signature-blends.html', imageFile: 'Twinings.jpg' },
  { title: 'Görtz Shoelace', url: 'https://packagingoftheworld.com/2013/08/gortz-shoelace-birds.html', imageFile: 'Görtz Shoelace.jpg' },
  { title: 'Bookcafe Blend', url: 'https://packagingoftheworld.com/2013/08/bookcafe-blend-ground-coffee.html', imageFile: 'Bookcafe Blend.jpg' },
  { title: 'LIA Olive', url: 'https://packagingoftheworld.com/2013/07/lia-olive-oil.html', imageFile: 'LIA Olive.jpg' },
  { title: 'Blood Of Grapes', url: 'https://packagingoftheworld.com/2013/07/blood-of-grapes-concept.html', imageFile: 'Blood Of Grapes.jpg' },
  { title: 'Harry Bromptons', url: 'https://packagingoftheworld.com/2013/07/harry-bromptons-ice-tea.html', imageFile: 'Harry Bromptons.jpg' },
  { title: 'Pings Popchips', url: 'https://packagingoftheworld.com/2013/07/pings-popchips.html', imageFile: 'Pings Popchips.jpg' },
  { title: 'Square Fish', url: 'https://packagingoftheworld.com/2013/07/square-fish.html', imageFile: 'Square Fish.jpg' },
  { title: 'Ghost Ship Rum', url: 'https://packagingoftheworld.com/2013/07/ghost-ship-rum.html', imageFile: 'Ghost Ship Rum.jpg' },
  { title: 'SKINS', url: 'https://packagingoftheworld.com/2013/07/skins-shoe-package-design-concept.html', imageFile: 'SKINS.jpg' },
  { title: 'Red Kap', url: 'https://packagingoftheworld.com/2013/07/red-kap.html', imageFile: 'Red Kap.jpg' },
  { title: 'Fisherman Boots', url: 'https://packagingoftheworld.com/2013/06/fisherman-boots.html', imageFile: 'Fisherman Boots.jpg' },
  { title: 'BEEloved honey', url: 'https://packagingoftheworld.com/2013/06/beeloved-honey.html', imageFile: 'BEEloved honey.jpg' },
  { title: 'Curve Bakery', url: 'https://packagingoftheworld.com/2013/06/curve-bakery.html', imageFile: 'Curve Bakery.jpg' },
  { title: 'ChickChirik', url: 'https://packagingoftheworld.com/2013/05/chickchirik.html', imageFile: 'ChickChirik.jpg' },
  { title: 'Smooch', url: 'https://packagingoftheworld.com/2013/05/smooch.html', imageFile: 'Smooch.jpg' },
  { title: 'Acid Make-Out', url: 'https://packagingoftheworld.com/2013/05/sometime-acid-make-out-cd-packaging.html', imageFile: 'Acid Make-Out.jpg' },
  { title: 'Lapka', url: 'https://packagingoftheworld.com/2013/05/lapka.html', imageFile: 'Lapka.jpg' },
  { title: 'McDonough Farm', url: 'https://packagingoftheworld.com/2013/05/mcdonough-farm-student-project.html', imageFile: 'McDonough Farm.jpg' },
  { title: 'SoyMilk', url: 'https://packagingoftheworld.com/2013/05/soymilk.html', imageFile: 'SoyMilk.jpg' },
  { title: 'Taste of Greece', url: 'https://packagingoftheworld.com/2014/05/taste-of-greece.html', imageFile: 'Taste of Greece.jpg' },
  { title: 'Santo Habito', url: 'https://packagingoftheworld.com/2014/05/santo-habito.html', imageFile: 'Santo Habito.jpg' },
  { title: 'Exotic Mix', url: 'https://packagingoftheworld.com/2014/05/exotic-mix.html', imageFile: 'Exotic Mix.jpg' },
  { title: 'Olivia Organic', url: 'https://packagingoftheworld.com/2014/05/olivia-organic-extra-virgin-olive-oil.html', imageFile: 'Olivia Organic.jpg' },
  { title: 'YAgoDA', url: 'https://packagingoftheworld.com/2014/05/yagoda-ice-cream.html', imageFile: 'YAgoDA.jpg' },
  { title: 'Mustang.', url: 'https://packagingoftheworld.com/2014/05/mustang-inside-out-mailing.html', imageFile: 'Mustang.jpg' },
  { title: 'Nescafé', url: 'https://packagingoftheworld.com/2014/05/nescafe-alarm-cap.html', imageFile: 'Nescafé.jpeg' },
  { title: 'Ford Jekson', url: 'https://packagingoftheworld.com/2014/05/ford-jekson-concept.html', imageFile: 'Ford Jekson.jpg' },
  { title: 'Mokaya Chocolates', url: 'https://packagingoftheworld.com/2014/05/mokaya-chocolates.html', imageFile: 'Mokaya Chocolates.jpg' },
  { title: 'NibMor', url: 'https://packagingoftheworld.com/2014/04/nibmor.html', imageFile: 'NibMor.jpg' },
  { title: 'MLK', url: 'https://packagingoftheworld.com/2014/04/mlk.html', imageFile: 'MLK.jpg' },
  { title: 'Cale Brewery', url: 'https://packagingoftheworld.com/2014/04/cale-brewery.html', imageFile: 'Cale Brewery.jpg' },
  { title: 'Bookjigs Woodland', url: 'https://packagingoftheworld.com/2014/04/bookjigs-woodland-product-line-packaging.html', imageFile: 'Bookjigs Woodland.jpg' },
  { title: 'Nada', url: 'https://packagingoftheworld.com/2014/03/nada-student-project.html', imageFile: 'Nada.jpg' },
  { title: 'Figula Olaszrizling', url: 'https://packagingoftheworld.com/2014/03/figula-olaszrizling-2013-student-project.html', imageFile: 'Figula Olaszrizling.jpg' },
  { title: 'DEMOCRACY Vodka', url: 'https://packagingoftheworld.com/2014/03/democracy-vodka-concept.html', imageFile: 'DEMOCRACY Vodka.jpg' },
  { title: 'Büro', url: 'https://packagingoftheworld.com/2014/03/buro.html', imageFile: 'Büro.jpg' },
  { title: 'Oops! Panties', url: 'https://packagingoftheworld.com/2014/03/oops-panties.html', imageFile: 'Oops! Panties.jpg' },
  { title: 'Birds & Bees', url: 'https://packagingoftheworld.com/2014/02/birds-bees.html', imageFile: 'Birds & Bees.jpg' },
  { title: 'Heal\'s', url: 'https://packagingoftheworld.com/2014/02/heals.html', imageFile: 'Heal\'s.jpg' },
  { title: 'The World\'s Most Eco-Friendly Calendar', url: 'https://packagingoftheworld.com/2014/02/the-worlds-most-eco-friendly-calendar.html', imageFile: 'The World\'s Most Eco-Friendly Calendar.jpg' },
  { title: 'Secret Location', url: 'https://packagingoftheworld.com/2014/02/secret-location-concept-store.html', imageFile: 'Secret Location.jpg' },
  { title: 'Halls', url: 'https://packagingoftheworld.com/2014/02/halls-packaging-concept.html', imageFile: 'Halls.jpg' },
  { title: 'ANNYEONG', url: 'https://packagingoftheworld.com/2014/01/annyeong-korea.html', imageFile: 'ANNYEONG.jpg' },
  { title: 'Doctor Manzana', url: 'https://packagingoftheworld.com/2014/01/doctor-manzana.html', imageFile: 'Doctor Manzana.jpg' },
  { title: 'Nitsiakos', url: 'https://packagingoftheworld.com/2013/11/nitsiakos-pet-food-packaging-concept.html', imageFile: 'Nitsiakos.jpg' },
  { title: 'Blue Goose', url: 'https://packagingoftheworld.com/2013/11/blue-goose.html', imageFile: 'Blue Goose.jpg' },
  { title: 'Un Air De Diptique', url: 'https://packagingoftheworld.com/2013/11/un-air-de-diptique.html', imageFile: 'Un Air De Diptique.jpg' },
  { title: '52 North', url: 'https://packagingoftheworld.com/2013/11/52-north.html', imageFile: '52 North.jpg' },
  { title: 'Pomato', url: 'https://packagingoftheworld.com/2013/11/pomato.html', imageFile: 'Pomato.jpg' },
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
  console.log('📦 Packaging Items Upload - Batch 4')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${PACKAGING_ITEMS.length} packaging items...\n`)
  
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
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

