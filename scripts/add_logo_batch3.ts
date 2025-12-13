import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'Images'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// URLs with titles extracted from the web search results
const entries = [
  { url: 'https://it.pinterest.com/pin/7670261862142647/', title: '25 Logo Design - Motu' },
  { url: 'https://it.pinterest.com/pin/2322237302910714/', title: '4 Letter Logo - BO' },
  { url: 'https://it.pinterest.com/pin/433260426678275351/', title: 'Abstract KB Logo' },
  { url: 'https://it.pinterest.com/pin/633387443435774/', title: 'Musical Studio Design - DO Studios' },
  { url: 'https://it.pinterest.com/pin/177470041560689303/', title: 'Adelia - Minimal Logo Design' },
  { url: 'https://it.pinterest.com/pin/633387443435868/', title: 'Logo Design - Oleg Coada' },
  { url: 'https://it.pinterest.com/pin/3096293489939667/', title: 'Minimalist Letter Y Branding' },
  { url: 'https://it.pinterest.com/pin/4644405860782408/', title: 'Minimal Sun Logo' },
  { url: 'https://it.pinterest.com/pin/17099673581758522/', title: 'Abstract Logo with Letter J and Arrows' },
  { url: 'https://it.pinterest.com/pin/4362930884038776/', title: 'Institute of Clean Energy Logo' },
  { url: 'https://it.pinterest.com/pin/13299761395495187/', title: 'B Symbol Design' },
  { url: 'https://it.pinterest.com/pin/2603712282184555/', title: 'Creative Typography Poster Design' },
  { url: 'https://it.pinterest.com/pin/844493676190703/', title: 'G Design Letter' },
  { url: 'https://it.pinterest.com/pin/3588874697888536/', title: 'N Arrow Design Logo' },
  { url: 'https://it.pinterest.com/pin/7599893116911501/', title: 'Logo With Loop' },
  { url: 'https://it.pinterest.com/pin/11329436555942911/', title: 'Arrow Direction Mark - K Logo' },
  { url: 'https://it.pinterest.com/pin/1900024839347797/', title: 'Creative Minimalist Business Logo' },
  { url: 'https://it.pinterest.com/pin/3377768468437526/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/13299761396067659/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/4785143351002759/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/11892386513580983/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/121386152452865398/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/124623114682361296/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/111112315802878001/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/248049891972282990/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/38843615660886273/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/282952789083474229/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/521713938102181147/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/36943659439709324/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/16466354884590157/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/48765608461465168/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/7107311908127094/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/33988172185009213/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/10555380371756504/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/10696117860268514/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/85427724176833732/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/2322237302910684/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/774124931000988/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/20688479525316400/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/844493676190714/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/98516310597590422/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/15058979999524646/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/2251868555810036/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/23432860557860412/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/68748607924/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/54606214229622996/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/59109813855845282/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/2251868557345884/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/5277724558963035/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/49961877112503447/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/295971006786687626/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/849491548500128194/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/11329436558273917/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/4996249582994417/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/254101603971660848/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/4433299629481008/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/54465476742136404/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/563018699114734/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/253890497738625400/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/140526450876321247/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/4503668371830890/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/8303580556269052/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/23151385579883541/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/3588874696038771/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/492649950329610/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/7599893117067564/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/1022528290428877517/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/1196337404351096/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/5207355813813562/', title: 'Logo Design' },
  { url: 'https://www.logofav.com/logo/green-letter-m-rounded-overlapping-logo-example-matsuura', title: 'Green Letter M Rounded Overlapping Logo - Matsuura' },
  { url: 'https://it.pinterest.com/pin/36239971996032031/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/3799980930958236/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/633387442608510/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/37014028183384005/', title: 'Logo Design' },
  { url: 'https://it.pinterest.com/pin/844493676190713/', title: 'Logo Design' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Logo 2'

async function uploadImageToSupabaseStorage(imagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(imagePath)
    const fileName = path.basename(imagePath)
    const fileExt = path.extname(fileName)
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const storagePath = `${uniqueId}/${uniqueId}${fileExt}`

    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 
                     fileExt === '.png' ? 'image/png' : 
                     fileExt === '.webp' ? 'image/webp' : 'image/jpeg',
        upsert: false,
      })

    if (error) {
      console.error(`  ❌ Upload error: ${error.message}`)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    return publicUrl
  } catch (error: any) {
    console.error(`  ❌ Upload exception: ${error.message}`)
    return null
  }
}

function findImageFile(entryUrl: string, imageFiles: string[]): string | null {
  // For Pinterest: extract pin ID
  if (entryUrl.includes('pinterest.com/pin/')) {
    const pinIdMatch = entryUrl.match(/\/pin\/(\d+)/)
    if (pinIdMatch) {
      const pinId = pinIdMatch[1]
      // Look for files matching the pattern: https-:it.pinterest.com:pin:PIN_ID.jpg
      for (const file of imageFiles) {
        const fileName = file.toLowerCase()
        // Check if filename contains both 'pinterest' and the exact pin ID
        if (fileName.includes('pinterest') && fileName.includes(`pin:${pinId}`)) {
          return path.join(IMAGE_DIR, file)
        }
        // Also try without the colon (some files might have different formatting)
        if (fileName.includes('pinterest') && fileName.includes(pinId) && !fileName.includes(`pin:${pinId}`)) {
          // Make sure it's not a partial match (e.g., pin ID 123 matching 1234)
          const pinIdRegex = new RegExp(`[^0-9]${pinId}[^0-9]|^${pinId}[^0-9]|[^0-9]${pinId}$|^${pinId}$`)
          if (pinIdRegex.test(fileName)) {
            return path.join(IMAGE_DIR, file)
          }
        }
      }
    }
  }
  
  // For Instagram: extract post ID
  if (entryUrl.includes('instagram.com/p/')) {
    const postIdMatch = entryUrl.match(/\/p\/([^\/\?]+)/)
    if (postIdMatch) {
      const postId = postIdMatch[1]
      // Look for files matching the pattern: https-:www.instagram.com:p:POST_ID.jpeg
      for (const file of imageFiles) {
        const fileName = file.toLowerCase()
        if (fileName.includes('instagram') && fileName.includes(`p:${postId.toLowerCase()}`)) {
          return path.join(IMAGE_DIR, file)
        }
      }
    }
  }
  
  // For logofav: try matching by domain
  if (entryUrl.includes('logofav.com')) {
    for (const file of imageFiles) {
      const fileName = file.toLowerCase()
      if (fileName.includes('logofav')) {
        return path.join(IMAGE_DIR, file)
      }
    }
  }
  
  // Fallback: try to normalize URL and match
  const normalizedUrl = entryUrl
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, ':')
    .replace(/#/g, '#')
    .replace(/\?.*$/, '')
    .toLowerCase()
  
  for (const file of imageFiles) {
    const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, '')
    const cleanFileName = fileName.replace(/^https-::?/, '').replace(/^https-:/, '')
    if (cleanFileName.includes(normalizedUrl) || normalizedUrl.includes(cleanFileName)) {
      return path.join(IMAGE_DIR, file)
    }
  }
  
  return null
}

async function processEntry(entry: { title: string; url: string }, imagePath: string | null) {
  try {
    console.log(`\n[${entry.title}] Processing...`)
    
    if (!imagePath) {
      console.log(`  ⚠️  No matching image found, skipping`)
      return { success: false, reason: 'no_image' }
    }
    
    if (!fs.existsSync(imagePath)) {
      console.log(`  ⚠️  Image file not found: ${imagePath}`)
      return { success: false, reason: 'file_not_found' }
    }
    
    // Upload image to Supabase storage first
    console.log(`  📤 Uploading image to storage...`)
    const imageUrl = await uploadImageToSupabaseStorage(imagePath)
    
    if (!imageUrl) {
      console.log(`  ❌ Failed to upload image`)
      return { success: false, reason: 'upload_failed' }
    }
    
    console.log(`  ✅ Image uploaded: ${imageUrl}`)
    
    // Call API with JSON body (not form data)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: entry.title,
        url: entry.url,
        imageUrl: imageUrl,
        category: 'logo',
        skipConceptGeneration: true, // Pipeline 2.0: Skip concept generation
      }),
    })
    
    if (!response.ok) {
      let errorText = ''
      try {
        const errorJson = await response.json()
        errorText = JSON.stringify(errorJson, null, 2)
      } catch {
        errorText = await response.text()
      }
      console.log(`  ❌ API error: ${response.status}`)
      console.log(`  Error details: ${errorText}`)
      return { success: false, reason: 'api_error', status: response.status, error: errorText }
    }
    
    const result = await response.json()
    console.log(`  ✅ Success! Site ID: ${result.site?.id || 'unknown'}`)
    if (result.error) {
      console.log(`  ⚠️  Warning: ${result.error}`)
    }
    return { success: true, siteId: result.site?.id }
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`)
    return { success: false, reason: 'exception', error: error.message }
  }
}

async function main() {
  console.log('🚀 Starting Logo Import Batch 3 (Pipeline 2.0)\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}\n`)
  
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Image directory not found: ${IMAGE_DIR}`)
    process.exit(1)
  }
  
  const imageFiles = fs.readdirSync(IMAGE_DIR).filter(f => 
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  )
  
  console.log(`📸 Found ${imageFiles.length} image files\n`)
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    details: [] as Array<{ title: string; status: string; reason?: string }>,
  }
  
  for (const entry of entries) {
    const imagePath = findImageFile(entry.url, imageFiles)
    const result = await processEntry(entry, imagePath)
    
    if (result.success) {
      results.success++
      results.details.push({ title: entry.title, status: 'success' })
    } else if (result.reason === 'no_image' || result.reason === 'file_not_found') {
      results.skipped++
      results.details.push({ title: entry.title, status: 'skipped', reason: result.reason })
    } else {
      results.failed++
      results.details.push({ title: entry.title, status: 'failed', reason: result.reason })
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  Skipped: ${results.skipped}`)
  console.log(`📦 Total: ${entries.length}`)
  
  if (results.details.length > 0) {
    console.log('\n📋 Details:')
    results.details.forEach(d => {
      const icon = d.status === 'success' ? '✅' : d.status === 'skipped' ? '⚠️' : '❌'
      console.log(`  ${icon} ${d.title}${d.reason ? ` (${d.reason})` : ''}`)
    })
  }
}

main().catch(console.error)

