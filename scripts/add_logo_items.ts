#!/usr/bin/env tsx
/**
 * Add Logo Items from Pinterest
 * 
 * Bulk uploads logo images from Pinterest URLs.
 * Images should be in /Users/victor/Downloads/FireShot/Logo/
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

interface LogoItem {
  title: string
  url: string
  imageFile: string
}

// Map Pinterest URLs to image filenames
// Image filenames are in format: https-:it.pinterest.com:pin:{PIN_ID}.jpg
const LOGO_ITEMS: LogoItem[] = [
  { title: 'Logo N and U', url: 'https://it.pinterest.com/pin/140807925846393376/', imageFile: 'https-:it.pinterest.com:pin:140807925846393376.jpg' },
  { title: 'Impulse Game App Icon', url: 'https://it.pinterest.com/pin/165225880075750609/', imageFile: 'https-:it.pinterest.com:pin:165225880075750609.jpg' },
  { title: 'Milk Logo', url: 'https://it.pinterest.com/pin/599401031688156558/', imageFile: 'https-:it.pinterest.com:pin:599401031688156558.jpg' },
  { title: 'Experimental Alphabet S', url: 'https://it.pinterest.com/pin/914862420536274/', imageFile: 'https-:it.pinterest.com:pin:914862420536274.jpg' },
  { title: 'Logo Typo S', url: 'https://it.pinterest.com/pin/4785143351020777/', imageFile: 'https-:it.pinterest.com:pin:4785143351020777.jpg' },
  { title: 'S Typography Logo', url: 'https://it.pinterest.com/pin/8373949301250838/', imageFile: 'https-:it.pinterest.com:pin:8373949301250838.jpg' },
  { title: 'FS Official Logo', url: 'https://it.pinterest.com/pin/8373949301265519/', imageFile: 'https-:it.pinterest.com:pin:8373949301265519.jpg' },
  { title: 'Vv Logo', url: 'https://it.pinterest.com/pin/2322237302910721/', imageFile: 'https-:it.pinterest.com:pin:2322237302910721.jpg' },
  { title: 'VB Logo Mark', url: 'https://it.pinterest.com/pin/315814992643635395/', imageFile: 'https-:it.pinterest.com:pin:315814992643635395.jpg' },
  { title: 'Noyo Frames Monogram', url: 'https://it.pinterest.com/pin/18718154694737861/', imageFile: 'https-:it.pinterest.com:pin:18718154694737861.jpg' },
  { title: 'MU Socials Logo', url: 'https://it.pinterest.com/pin/9218374232570740/', imageFile: 'https-:it.pinterest.com:pin:9218374232570740.jpg' },
  { title: 'OK DREAM Logo', url: 'https://it.pinterest.com/pin/2322237302910718/', imageFile: 'https-:it.pinterest.com:pin:2322237302910718.jpg' },
  { title: 'Halo Reflect Logo', url: 'https://it.pinterest.com/pin/11329436558617287/', imageFile: 'https-:it.pinterest.com:pin:11329436558617287.jpg' },
  { title: 'Overlapping Logo Design', url: 'https://it.pinterest.com/pin/32228953578546497/', imageFile: 'https-:it.pinterest.com:pin:32228953578546497.jpg' },
  { title: 'Abstract Design', url: 'https://it.pinterest.com/pin/12525705208670487/', imageFile: 'https-:it.pinterest.com:pin:12525705208670487.jpg' },
  { title: 'Q Logo Ideas', url: 'https://it.pinterest.com/pin/36943659439530095/', imageFile: 'https-:it.pinterest.com:pin:36943659439530095.jpg' },
  { title: 'STANLEY Logo', url: 'https://it.pinterest.com/pin/113786328083418811/', imageFile: 'https-:it.pinterest.com:pin:113786328083418811.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3166662232896544/', imageFile: 'https-:it.pinterest.com:pin:3166662232896544.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/44754590043823533/', imageFile: 'https-:it.pinterest.com:pin:44754590043823533.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/25684660371293454/', imageFile: 'https-:it.pinterest.com:pin:25684660371293454.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/9288742977148250/', imageFile: 'https-:it.pinterest.com:pin:9288742977148250.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/6262886976626761/', imageFile: 'https-:it.pinterest.com:pin:6262886976626761.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/153755774774896806/', imageFile: 'https-:it.pinterest.com:pin:153755774774896806.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/65513369574177061/', imageFile: 'https-:it.pinterest.com:pin:65513369574177061.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/95631192083552956/', imageFile: 'https-:it.pinterest.com:pin:95631192083552956.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/41165784089214845/', imageFile: 'https-:it.pinterest.com:pin:41165784089214845.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/563018697737236/', imageFile: 'https-:it.pinterest.com:pin:563018697737236.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/422281210959620/', imageFile: 'https-:it.pinterest.com:pin:422281210959620.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/1688918605508723/', imageFile: 'https-:it.pinterest.com:pin:1688918605508723.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/4433299629481067/', imageFile: 'https-:it.pinterest.com:pin:4433299629481067.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/4433299629481084/', imageFile: 'https-:it.pinterest.com:pin:4433299629481084.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/35888128283695880/', imageFile: 'https-:it.pinterest.com:pin:35888128283695880.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/563018697740948/', imageFile: 'https-:it.pinterest.com:pin:563018697740948.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/7529524369755931/', imageFile: 'https-:it.pinterest.com:pin:7529524369755931.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/5066618330290961/', imageFile: 'https-:it.pinterest.com:pin:5066618330290961.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/105553185011810641/', imageFile: 'https-:it.pinterest.com:pin:105553185011810641.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/281545414200367551/', imageFile: 'https-:it.pinterest.com:pin:281545414200367551.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/45458277484935826/', imageFile: 'https-:it.pinterest.com:pin:45458277484935826.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3659243437891863/', imageFile: 'https-:it.pinterest.com:pin:3659243437891863.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/633387443435782/', imageFile: 'https-:it.pinterest.com:pin:633387443435782.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/40039884185621743/', imageFile: 'https-:it.pinterest.com:pin:40039884185621743.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/1477812373352589/', imageFile: 'https-:it.pinterest.com:pin:1477812373352589.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/58265388914195213/', imageFile: 'https-:it.pinterest.com:pin:58265388914195213.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/2251868557203367/', imageFile: 'https-:it.pinterest.com:pin:2251868557203367.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/2322237301236704/', imageFile: 'https-:it.pinterest.com:pin:2322237301236704.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/211174978396107/', imageFile: 'https-:it.pinterest.com:pin:211174978396107.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/36591815718295966/', imageFile: 'https-:it.pinterest.com:pin:36591815718295966.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/57420963997772726/', imageFile: 'https-:it.pinterest.com:pin:57420963997772726.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/12807180186655927/', imageFile: 'https-:it.pinterest.com:pin:12807180186655927.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/5207355813404868/', imageFile: 'https-:it.pinterest.com:pin:5207355813404868.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/34973334600772984/', imageFile: 'https-:it.pinterest.com:pin:34973334600772984.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/4433299629480119/', imageFile: 'https-:it.pinterest.com:pin:4433299629480119.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/8162843062742469/', imageFile: 'https-:it.pinterest.com:pin:8162843062742469.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/55872851615957775/', imageFile: 'https-:it.pinterest.com:pin:55872851615957775.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/9007267998061018/', imageFile: 'https-:it.pinterest.com:pin:9007267998061018.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/34762228369467034/', imageFile: 'https-:it.pinterest.com:pin:34762228369467034.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3870349675173864/', imageFile: 'https-:it.pinterest.com:pin:3870349675173864.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/25684660370186600/', imageFile: 'https-:it.pinterest.com:pin:25684660370186600.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/274508539781611639/', imageFile: 'https-:it.pinterest.com:pin:274508539781611639.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/844493675086396/', imageFile: 'https-:it.pinterest.com:pin:844493675086396.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/42573158973593188/', imageFile: 'https-:it.pinterest.com:pin:42573158973593188.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3377768468446594/', imageFile: 'https-:it.pinterest.com:pin:3377768468446594.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/18084835998783511/', imageFile: 'https-:it.pinterest.com:pin:18084835998783511.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/7248049395252705/', imageFile: 'https-:it.pinterest.com:pin:7248049395252705.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/1477812373941452/', imageFile: 'https-:it.pinterest.com:pin:1477812373941452.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/310185493109399365/', imageFile: 'https-:it.pinterest.com:pin:310185493109399365.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/17662623533893087/', imageFile: 'https-:it.pinterest.com:pin:17662623533893087.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/9288742976960897/', imageFile: 'https-:it.pinterest.com:pin:9288742976960897.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/1688918606645145/', imageFile: 'https-:it.pinterest.com:pin:1688918606645145.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/117304765293819999/', imageFile: 'https-:it.pinterest.com:pin:117304765293819999.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/9288742977341918/', imageFile: 'https-:it.pinterest.com:pin:9288742977341918.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/1337074889811234/', imageFile: 'https-:it.pinterest.com:pin:1337074889811234.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/117938083988057976/', imageFile: 'https-:it.pinterest.com:pin:117938083988057976.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/31736372368841756/', imageFile: 'https-:it.pinterest.com:pin:31736372368841756.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/9429480466656564/', imageFile: 'https-:it.pinterest.com:pin:9429480466656564.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/29484572556750754/', imageFile: 'https-:it.pinterest.com:pin:29484572556750754.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/52072939434421383/', imageFile: 'https-:it.pinterest.com:pin:52072939434421383.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/914862420243200/', imageFile: 'https-:it.pinterest.com:pin:914862420243200.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/238761217740058182/', imageFile: 'https-:it.pinterest.com:pin:238761217740058182.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/6122149486701818/', imageFile: 'https-:it.pinterest.com:pin:6122149486701818.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/93238654781049092/', imageFile: 'https-:it.pinterest.com:pin:93238654781049092.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/844493672567238/', imageFile: 'https-:it.pinterest.com:pin:844493672567238.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3870349675173913/', imageFile: 'https-:it.pinterest.com:pin:3870349675173913.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/362399101291500125/', imageFile: 'https-:it.pinterest.com:pin:362399101291500125.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/122441683614722838/', imageFile: 'https-:it.pinterest.com:pin:122441683614722838.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/13792342603921318/', imageFile: 'https-:it.pinterest.com:pin:13792342603921318.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/4151824651719041/', imageFile: 'https-:it.pinterest.com:pin:4151824651719041.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3025924743538616/', imageFile: 'https-:it.pinterest.com:pin:3025924743538616.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/26247610323920169/', imageFile: 'https-:it.pinterest.com:pin:26247610323920169.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/28921622599571022/', imageFile: 'https-:it.pinterest.com:pin:28921622599571022.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/3518505953533081/', imageFile: 'https-:it.pinterest.com:pin:3518505953533081.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/46724914877931730/', imageFile: 'https-:it.pinterest.com:pin:46724914877931730.jpg' },
  { title: 'Logo Design', url: 'https://it.pinterest.com/pin/233342824434849545/', imageFile: 'https-:it.pinterest.com:pin:233342824434849545.jpg' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Logo'

async function processImage(filePath: string, site: any, category: string = 'logo'): Promise<void> {
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
      category: category, // Set category to "logo"
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
          vector: existingByHash.vector,
          contentHash: contentHash,
        } as any,
      })
    }
  } else if (existingForImage) {
    // Image already has an embedding, reuse it
    ivec = existingForImage.vector as unknown as number[]
    console.log(`   ♻️  Reusing existing embedding vector for this image`)
  } else {
    // Generate new embedding
    console.log(`   🧠 Generating CLIP embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    console.log(`   ✅ Generated embedding (${ivec.length} dimensions)`)
    
    // Store embedding
    await prisma.imageEmbedding.create({
      data: {
        imageId: image.id,
        model: 'clip-ViT-L/14',
        vector: ivec as any,
        contentHash: contentHash,
      } as any,
    })
    console.log(`   ✅ Stored embedding in database`)
  }
  
  console.log(`   ✅ Done processing image`)
}

async function main() {
  console.log('🚀 Starting logo import...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`📊 Total items: ${LOGO_ITEMS.length}\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const item of LOGO_ITEMS) {
    try {
      const imagePath = path.join(IMAGE_DIR, item.imageFile)
      
      // Check if image file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image not found: ${item.imageFile}`)
        errorCount++
        continue
      }
      
      // Find or create site
      let site = await prisma.site.findFirst({
        where: { url: item.url }
      })
      
      if (!site) {
        console.log(`\n🏗️  Creating site: ${item.title}`)
        site = await prisma.site.create({
          data: {
            url: item.url,
            title: item.title,
          },
        })
        console.log(`   ✅ Site created (ID: ${site.id})`)
      } else {
        console.log(`\n♻️  Using existing site: ${item.title} (ID: ${site.id})`)
      }
      
      // Process image
      await processImage(imagePath, site, 'logo')
      successCount++
      
    } catch (error: any) {
      console.error(`\n❌ Error processing ${item.title}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n\n📊 Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total: ${LOGO_ITEMS.length}`)
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ Done')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error)
      process.exit(1)
    })
}

export { processImage }

