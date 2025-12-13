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

// URLs and their corresponding titles
const entries = [
  { url: 'https://parkjinhan.kr/SMMS', title: 'SMMS - Park Jinhan' },
  { url: 'https://fonshickmann.com/work/agi_coexistence_poster/', title: 'AGI Coexistence Poster - Fons Hickmann' },
  { url: 'https://fonshickmann.com/work/m23_fukushima_chernobyl_poster/', title: 'Fukushima Chernobyl Poster - Fons Hickmann' },
  { url: 'https://parkjinhan.kr/It-s-not-about-knowing-all-the-gimmicks-and-photo-tricks', title: "It's not about knowing all the gimmicks and photo tricks - Park Jinhan" },
  { url: 'https://cecile-roger.com/', title: 'Cécile + Roger' },
  { url: 'https://www.designculture.it/interview/werner-jeker.html', title: 'Werner Jeker - Designculture' },
  { url: 'https://parkjinhan.kr/I-knew-if-I-stayed-around-long-enough-something-like-this-would-happen', title: "I knew if I stayed around long enough, something like this would happen - Park Jinhan" },
  { url: 'https://everyday-practice.com/portfolio/2017sihf_id_poster/', title: '2017 SIHF ID Poster - Everyday Practice' },
  { url: 'https://www.kateprior.com/#/protein/', title: 'Protein - Kate Prior' },
  { url: 'https://www.kateprior.com/#/shredders/', title: 'Shredders - Kate Prior' },
  { url: 'https://www.kateprior.com/#/shake-shack/', title: 'Shake Shack - Kate Prior' },
  { url: 'https://www.kateprior.com/#/indy-man-beer-con/', title: 'Indy Man Beer Con - Kate Prior' },
  { url: 'https://www.kateprior.com/#/openair-st-gallen/', title: 'Openair St Gallen - Kate Prior' },
  { url: 'https://www.kateprior.com/#/zodiac/', title: 'Zodiac - Kate Prior' },
  { url: 'https://www.kateprior.com/#/loud-quiet/', title: 'Loud & Quiet - Kate Prior' },
  { url: 'https://www.designculture.it/interview/wim-crouwel.html#start', title: 'Wim Crouwel - Designculture' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Graphic'

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
  // Normalize URL for matching - convert to the format used in filenames
  // Example: https://www.kateprior.com/#/protein/ -> www.kateprior.com:#:protein
  const normalizedUrl = entryUrl
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, ':')
    .replace(/#/g, '#')
    .toLowerCase()
  
  // Extract the last path segment (e.g., "protein" from "www.kateprior.com:#:protein")
  const urlParts = normalizedUrl.split(':')
  const lastSegment = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]
  
  // Try to find exact match first - look for files that contain the full normalized URL
  for (const file of imageFiles) {
    const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, '')
    // Check if filename contains the full normalized URL pattern
    if (fileName.includes(normalizedUrl)) {
      return path.join(IMAGE_DIR, file)
    }
  }
  
  // Try to match by last segment (for URLs like /protein/, /shredders/, etc.)
  if (lastSegment && lastSegment.length > 2) {
    for (const file of imageFiles) {
      const fileName = file.toLowerCase()
      // Check if filename contains both the domain and the last segment
      const domainMatch = urlParts[0] && fileName.includes(urlParts[0])
      const segmentMatch = fileName.includes(lastSegment.replace(/-/g, '-'))
      
      if (domainMatch && segmentMatch) {
        return path.join(IMAGE_DIR, file)
      }
    }
  }
  
  // Fallback: try partial domain match (but this should be last resort)
  const domain = urlParts[0]
  if (domain) {
    const domainMatches = imageFiles.filter(f => 
      f.toLowerCase().includes(domain.toLowerCase())
    )
    if (domainMatches.length === 1) {
      return path.join(IMAGE_DIR, domainMatches[0])
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
        category: 'graphic',
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
  console.log('🚀 Starting Graphic Design Import (Pipeline 2.0)\n')
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

