#!/usr/bin/env tsx
/**
 * Fix Failed Packaging Uploads
 * 
 * This script identifies which packaging images failed to upload
 * and processes them with improved filename matching.
 */

import 'dotenv/config'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import { canonicalizeImage } from '../src/lib/embeddings'
import fs from 'fs'
import path from 'path'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Packaging'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// All Pinterest URLs from the original list
const PINTEREST_URLS = [
  'https://it.pinterest.com/pin/68749424202/',
  'https://it.pinterest.com/pin/281543726114789/',
  'https://it.pinterest.com/pin/492649953237533/',
  'https://it.pinterest.com/pin/64809682135105596/',
  'https://it.pinterest.com/pin/492649952519429/',
  'https://it.pinterest.com/pin/3025924746290608/',
  'https://it.pinterest.com/pin/422281211453434/',
  'https://it.pinterest.com/pin/73676143899344129/',
  'https://it.pinterest.com/pin/4292562140097396/',
  'http://it.pinterest.com/pin/9288742977119647/',
  'https://it.pinterest.com/pin/2674081025945191/',
  'https://it.pinterest.com/pin/37928821858580769/',
  'https://it.pinterest.com/pin/563018697581236/',
  'https://it.pinterest.com/pin/42995371468713076/',
  'https://it.pinterest.com/pin/5840674511726041/',
  'https://it.pinterest.com/pin/140806234497380/',
  'https://it.pinterest.com/pin/13159023905982642/',
  'https://it.pinterest.com/pin/1407443629794242/',
  'https://it.pinterest.com/pin/1407443629669164/',
  'https://it.pinterest.com/pin/211174978247272/',
  'https://it.pinterest.com/pin/281543726097000/',
  'https://it.pinterest.com/pin/211174978240888/',
  'https://it.pinterest.com/pin/1337074887097033/',
  'https://it.pinterest.com/pin/58969076366978139/',
  'https://it.pinterest.com/pin/3377768467757254/',
  'https://it.pinterest.com/pin/4503668373083818/',
  'https://it.pinterest.com/pin/211174975383428/',
  'https://it.pinterest.com/pin/25403185394084254/',
  'https://it.pinterest.com/pin/211174978702346/',
  'https://it.pinterest.com/pin/633387443606757/',
  'https://it.pinterest.com/pin/294634000644890293/',
  'https://it.pinterest.com/pin/16184879907501826/',
  'https://it.pinterest.com/pin/2392606047573160/',
  'https://it.pinterest.com/pin/211174978862829/',
  'https://it.pinterest.com/pin/985231162433910/',
  'https://it.pinterest.com/pin/5136987070734135/',
  'https://it.pinterest.com/pin/1829656094333426/',
  'https://it.pinterest.com/pin/12525705208926976/',
  'https://it.pinterest.com/pin/9781324186157594/',
  'https://it.pinterest.com/pin/51228514502465244/',
  'https://it.pinterest.com/pin/1829656090918020/',
  'https://it.pinterest.com/pin/5277724558780151/',
  'https://it.pinterest.com/pin/4503668373386587/',
  'https://it.pinterest.com/pin/120189883800199378/',
  'https://it.pinterest.com/pin/74520568829494817/',
  'https://it.pinterest.com/pin/5207355813371029/',
  'https://it.pinterest.com/pin/39828777963051402/',
  'https://it.pinterest.com/pin/5277724559847697/',
  'https://it.pinterest.com/pin/46302702416154808/',
  'https://it.pinterest.com/pin/1548181181739846/',
  'https://it.pinterest.com/pin/1149051292444420619/',
  'https://it.pinterest.com/pin/37928821858566704/',
  'https://it.pinterest.com/pin/39195459253486886/',
  'https://it.pinterest.com/pin/85427724177808208/',
  'https://it.pinterest.com/pin/861313497531749549/',
  'https://it.pinterest.com/pin/13159023906128115/',
  'https://it.pinterest.com/pin/2322237302895107/',
  'https://it.pinterest.com/pin/19140367163045462/',
  'https://it.pinterest.com/pin/633387444045803/',
  'https://it.pinterest.com/pin/53198839343095709/',
  'https://it.pinterest.com/pin/18718154695379389/',
  'https://it.pinterest.com/pin/1337074888961710/',
  'https://it.pinterest.com/pin/4433299627029414/',
  'https://it.pinterest.com/pin/6896205673047878/',
  'https://it.pinterest.com/pin/4433299628055123/',
  'https://it.pinterest.com/pin/53832158043946191/',
  'https://it.pinterest.com/pin/13651605115423178/',
  'http://it.pinterest.com/pin/8585055536145592/',
  'https://it.pinterest.com/pin/633387443408475/',
  'https://it.pinterest.com/pin/179721841375325462/',
  'https://it.pinterest.com/pin/2674081025199229/',
  'https://it.pinterest.com/pin/13159023906090029/',
  'https://it.pinterest.com/pin/4151824652119828/',
  'https://it.pinterest.com/pin/5066618330886314/',
  'https://it.pinterest.com/pin/122863896089260224/',
  'https://it.pinterest.com/pin/1759287348743738/',
  'https://it.pinterest.com/pin/25825397860174032/',
  'https://it.pinterest.com/pin/94294185943992160/',
  'https://it.pinterest.com/pin/5840674511020714/',
  'https://it.pinterest.com/pin/1759287348545347/',
  'https://it.pinterest.com/pin/60165345016752301/',
  'https://it.pinterest.com/pin/18647785951438667/',
  'https://it.pinterest.com/pin/1196337404931033/',
  'https://it.pinterest.com/pin/804455552235434368/',
  'https://it.pinterest.com/pin/3729612259001816/',
  'https://it.pinterest.com/pin/4644405860924652/',
  'https://it.pinterest.com/pin/740771838753790215/',
  'https://it.pinterest.com/pin/51650726967939566/',
  'https://it.pinterest.com/pin/492649951021878/',
  'https://it.pinterest.com/pin/633387444071554/',
  'https://it.pinterest.com/pin/1337074889589510/',
  'https://it.pinterest.com/pin/4785143351573381/',
  'https://it.pinterest.com/pin/AY2Tlg8eCXkyLW0qna5KpALuHPzQ3Jijr26UDm6fq6cs3srAlLDJQ9CUFhXfYpfAAtfjSejvlvyUi8eIASjhYFQ/',
  'https://it.pinterest.com/pin/101612535340541282/',
  'https://it.pinterest.com/pin/18436679718450846/',
  'https://it.pinterest.com/pin/205336064246786004/',
  'https://it.pinterest.com/pin/37225134413472452/',
  'https://it.pinterest.com/pin/7670261862177727/',
  'https://it.pinterest.com/pin/140806233898641/',
  'http://it.pinterest.com/pin/1055599908380546/',
  'https://it.pinterest.com/pin/774124930989290/',
  'https://it.pinterest.com/pin/2392606047924390/',
  'https://it.pinterest.com/pin/4925880838077077/',
  'https://it.pinterest.com/pin/318911217384438235/',
  'https://it.pinterest.com/pin/11329436556632938/',
  'https://it.pinterest.com/pin/5277724558794996/',
  'https://it.pinterest.com/pin/22447698138536103/',
  'https://it.pinterest.com/pin/2533343536742118/',
  'https://it.pinterest.com/pin/55169164191239353/',
  'https://it.pinterest.com/pin/2533343536742121/',
  'http://it.pinterest.com/pin/1196337404912602/',
  'https://it.pinterest.com/pin/312296555433898791/',
  'https://it.pinterest.com/pin/5559199537138828/',
  'https://it.pinterest.com/pin/33003009765198405/',
  'https://it.pinterest.com/pin/12596073953564649/',
  'https://it.pinterest.com/pin/2181499816402020/',
]

// Packaging of the World URLs
const POTW_URLS = [
  'https://packagingoftheworld.com/2025/12/menin-80-years-port.html',
  'https://packagingoftheworld.com/2025/12/riot.html',
  'https://packagingoftheworld.com/2025/12/fuji-matcha.html',
  'https://packagingoftheworld.com/2025/12/meltem-ozertem-chinese-zodiac-gold-collection.html',
  'https://packagingoftheworld.com/2025/12/chocol-deluxe-premium-dark-chocolate.html',
  'https://packagingoftheworld.com/2025/12/sunfruit.html',
  'https://packagingoftheworld.com/2015/08/tok-watch-concept.html',
  'https://packagingoftheworld.com/2015/08/saudade-tea.html',
  'https://packagingoftheworld.com/2015/08/edamame-one-smart-bean.html',
  'https://packagingoftheworld.com/2015/08/naravan.html',
  'https://packagingoftheworld.com/2015/08/moreish-skincare.html',
  'https://packagingoftheworld.com/2016/01/gifts-for-good-2016-red-packets.html',
  'https://packagingoftheworld.com/2015/12/cadbury-favourites-limited-edition.html',
  'https://packagingoftheworld.com/2015/12/dark-brew-coffee-house-concept.html',
  'https://packagingoftheworld.com/2015/11/absolut-vodka-x-marvel-concept.html',
  'https://packagingoftheworld.com/2015/11/samsung-exynos.html',
  'https://packagingoftheworld.com/2015/11/la-nevateria.html',
  'https://packagingoftheworld.com/2015/11/sandeman-tourism-pack.html',
  'https://packagingoftheworld.com/2015/10/sangar-optimist.html',
  'https://packagingoftheworld.com/2015/10/bolonaf-chocolate.html',
  'https://packagingoftheworld.com/2015/10/hedali-salt.html',
  'https://packagingoftheworld.com/2016/03/ming-fang-zhen-souvenir-gift.html',
  'https://packagingoftheworld.com/2016/03/molocow-concept-milk-package-concept.html',
  'https://packagingoftheworld.com/2016/03/dune.html',
  'https://packagingoftheworld.com/2016/03/le-santi.html',
  'https://packagingoftheworld.com/2016/02/absinthesis-absinthe-superieure-concept.html',
  'https://packagingoftheworld.com/2016/02/zephyr-glassware-student-project.html',
  'https://packagingoftheworld.com/2016/01/funky-business.html',
  'https://packagingoftheworld.com/2016/01/barbon.html',
  'https://packagingoftheworld.com/2016/01/osti-01-cheese-planer.html',
  'https://packagingoftheworld.com/2016/01/muse-origins.html',
  'https://packagingoftheworld.com/2016/01/tea-talent.html',
  'https://packagingoftheworld.com/2016/01/be-home-butter-knife-and-dish-student.html',
  'https://packagingoftheworld.com/2016/01/bevel-cup-concept.html',
  'https://packagingoftheworld.com/2016/01/tea-charlie.html',
  'https://packagingoftheworld.com/2016/01/coffee-mate-star-wars.html',
  'https://packagingoftheworld.com/2016/01/loving-earth.html',
  'https://packagingoftheworld.com/2016/05/kalifyton.html',
  'https://packagingoftheworld.com/2016/05/milk-nature-concept.html',
  'https://packagingoftheworld.com/2016/05/ocean.html',
  'https://packagingoftheworld.com/2016/05/cans-of-positivity.html',
  'https://packagingoftheworld.com/2016/05/wear-any-clothes-just-as-long-as-theyre.html',
  'https://packagingoftheworld.com/2016/05/bic-socks.html',
  'https://packagingoftheworld.com/2016/05/fratelli-spirini-soft-cheese-let-cows.html',
  'https://packagingoftheworld.com/2016/05/bonnie-clyde.html',
  'https://packagingoftheworld.com/2016/05/abelha-organic-cachaca.html',
  'https://packagingoftheworld.com/2016/05/molotov-wishes.html',
  'https://packagingoftheworld.com/2016/04/danish-selection.html',
  'https://packagingoftheworld.com/2016/04/polo-mint-redesigned.html',
  'https://packagingoftheworld.com/2016/04/piquentum-st-vital.html',
  'https://packagingoftheworld.com/2016/04/standout-project-with-label-litho.html',
  'https://packagingoftheworld.com/2016/04/mesa-baja-grisalon-agroindustria-g.html',
  'https://packagingoftheworld.com/2016/04/holcim-agrocal.html',
  'https://packagingoftheworld.com/2016/04/inizio-olive-oil-concept.html',
  'https://packagingoftheworld.com/2016/04/thelmas-cookies.html',
  'https://packagingoftheworld.com/2016/04/lights4fun.html',
  'https://packagingoftheworld.com/2016/04/m-mega-limited-edition-promo-kit.html',
  'https://packagingoftheworld.com/2016/04/good-karma-coffee.html',
  'https://packagingoftheworld.com/2016/04/cuarentona-fortyish.html',
  'https://packagingoftheworld.com/2016/04/marais.html',
  'https://packagingoftheworld.com/2016/03/patron-en-lalique-serie-1.html',
  'https://packagingoftheworld.com/2016/04/urbanbites.html',
  'https://packagingoftheworld.com/2016/03/pinch-of-soil-student-project.html',
  'https://packagingoftheworld.com/2016/03/upton-belts.html',
  'https://packagingoftheworld.com/2016/03/xoconochco-chocolate-concept.html',
]

const ALL_URLS = [...PINTEREST_URLS, ...POTW_URLS]

// Convert URL to expected filename format
function urlToFilename(url: string): string[] {
  const candidates: string[] = []
  
  // Handle Pinterest URLs
  if (url.includes('pinterest.com')) {
    const pinId = url.match(/pin\/([^\/]+)/)?.[1]
    if (pinId) {
      // Try both https and http variants
      candidates.push(`https-:it.pinterest.com:pin:${pinId}.jpg`)
      candidates.push(`http-:it.pinterest.com:pin:${pinId}.jpg`)
      candidates.push(`https-:it.pinterest.com:pin:${pinId}.jpeg`)
      candidates.push(`http-:it.pinterest.com:pin:${pinId}.jpeg`)
      candidates.push(`https-:it.pinterest.com:pin:${pinId}.png`)
      candidates.push(`http-:it.pinterest.com:pin:${pinId}.png`)
    }
  }
  
  // Handle packagingoftheworld.com URLs
  if (url.includes('packagingoftheworld.com')) {
    const match = url.match(/packagingoftheworld\.com\/(\d{4})\/(\d{2})\/([^\/]+)\.html/)
    if (match) {
      const [, year, month, slug] = match
      // Try different extensions
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        candidates.push(`https-::packagingoftheworld.com:${year}:${month}:${slug}${ext}`)
      }
    }
  }
  
  return candidates
}

async function processEntry(url: string) {
  try {
    console.log(`\n📸 Processing: ${url}`)
    
    // Get all possible filename candidates
    const candidates = urlToFilename(url)
    let imagePath: string | null = null
    
    // Try each candidate
    for (const candidate of candidates) {
      const fullPath = path.join(IMAGE_DIR, candidate)
      if (fs.existsSync(fullPath)) {
        imagePath = fullPath
        console.log(`   ✅ Found: ${candidate}`)
        break
      }
    }
    
    if (!imagePath) {
      console.log(`   ⚠️  No matching file found. Tried: ${candidates.join(', ')}`)
      return { success: false, error: 'File not found', candidates }
    }
    
    // Read and process image
    const buf = fs.readFileSync(imagePath)
    const { hash: contentHash } = await canonicalizeImage(buf)
    
    // Upload to Supabase Storage
    console.log(`   ☁️  Uploading...`)
    const imageUrl = await uploadImageToSupabaseStorage(imagePath, contentHash)
    console.log(`   ✅ Uploaded: ${imageUrl}`)
    
    // Extract title from URL
    let title = 'Packaging Design'
    if (url.includes('packagingoftheworld.com')) {
      const slug = url.match(/\/([^\/]+)\.html$/)?.[1]
      if (slug) {
        title = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
    
    // Call Pipeline 2.0 API
    console.log(`   🚀 Calling Pipeline 2.0 API...`)
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        url,
        imageUrl,
        category: 'packaging',
        skipConceptGeneration: true,
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`   ❌ API error (${response.status}): ${errorText}`)
      return { success: false, error: `API error: ${response.status}` }
    }
    
    const result = await response.json()
    console.log(`   ✅ Successfully processed`)
    return { success: true, result }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('🔧 Fixing failed packaging uploads...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total URLs: ${ALL_URLS.length}\n`)
  
  // Get all files in directory
  const allFiles = fs.readdirSync(IMAGE_DIR)
    .filter(f => fs.statSync(path.join(IMAGE_DIR, f)).isFile())
  
  console.log(`📁 Found ${allFiles.length} files in directory\n`)
  
  let successCount = 0
  let errorCount = 0
  const notFound: string[] = []
  
  for (const url of ALL_URLS) {
    const result = await processEntry(url)
    
    if (result.success) {
      successCount++
    } else {
      errorCount++
      if (result.error === 'File not found') {
        notFound.push(url)
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n\n📊 Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total: ${ALL_URLS.length}`)
  
  if (notFound.length > 0) {
    console.log(`\n⚠️  Files not found (${notFound.length}):`)
    notFound.slice(0, 10).forEach(url => console.log(`   - ${url}`))
    if (notFound.length > 10) {
      console.log(`   ... and ${notFound.length - 10} more`)
    }
  }
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

