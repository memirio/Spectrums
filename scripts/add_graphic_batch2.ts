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
  { url: 'https://sorianoblanco.tumblr.com/post/791412638522490880/', title: 'Soriano Blanco - Tumblr' },
  { url: 'https://www.behance.net/gallery/219147397/shootshare-Branding?tracking_source=curated_galleries_graphic-design', title: 'Shootshare Branding - Behance' },
  { url: 'https://www.behance.net/gallery/239564835/LOGOS-MARKS-C02?tracking_source=curated_galleries_graphic-design', title: 'LOGOS MARKS C02 - Behance' },
  { url: 'https://www.behance.net/gallery/219578501/MME-Awards-2025?tracking_source=curated_galleries_graphic-design', title: 'MME Awards 2025 - Behance' },
  { url: 'https://www.behance.net/gallery/237555281/YWFT-Eurometra-Font?tracking_source=curated_galleries_graphic-design', title: 'YWFT Eurometra Font - Behance' },
  { url: 'https://www.behance.net/gallery/237831691/Brave-Typeface?tracking_source=curated_galleries_graphic-design', title: 'Brave Typeface - Behance' },
  { url: 'https://www.behance.net/gallery/83408567/ROADBIKE-SERIES-ILLUSTRATIONS-?tracking_source=curated_galleries_illustration', title: 'Roadbike Series Illustrations - Behance' },
  { url: 'https://www.behance.net/gallery/237862371/OriginalMirror-Walk?tracking_source=curated_galleries_illustration', title: 'OriginalMirror Walk - Behance' },
  { url: 'https://www.behance.net/gallery/233610331/A-Figure-Study?tracking_source=curated_galleries_illustration', title: 'A Figure Study - Behance' },
  { url: 'https://www.behance.net/gallery/47415081/Creacion-de-logotipo-videojuego-Aqui-voy-/modules/282876635', title: 'Creacion de logotipo videojuego Aqui voy - Behance' },
  { url: 'https://www.behance.net/gallery/235530385/FEELINGS-SAB?tracking_source=curated_galleries_illustration', title: 'FEELINGS SAB - Behance' },
  { url: 'https://www.behance.net/gallery/236105985/Lucy-Yak-COLLAB?tracking_source=curated_galleries_illustration', title: 'Lucy Yak COLLAB - Behance' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Graphic'

async function uploadImageToSupabaseStorage(imagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(imagePath)
    const fileName = path.basename(imagePath)
    let fileExt = path.extname(fileName)
    // Check if .html file is actually an image by reading first bytes
    if (fileExt === '.html') {
      const header = fileBuffer.slice(0, 4).toString('hex')
      if (header.startsWith('ffd8ff')) {
        fileExt = '.jpg'
      } else if (header.startsWith('89504e47')) {
        fileExt = '.png'
      } else if (header.startsWith('52494646')) {
        fileExt = '.webp'
      }
    }
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
  // Example: https://www.behance.net/gallery/219147397/shootshare-Branding -> behance.net:gallery:219147397:shootshare-Branding
  const normalizedUrl = entryUrl
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, ':')
    .replace(/#/g, '#')
    .replace(/\?.*$/, '') // Remove query parameters
    .toLowerCase()
  
  // Extract key parts for matching
  const urlParts = normalizedUrl.split(':')
  const domain = urlParts[0]
  const lastSegment = urlParts[urlParts.length - 1]
  
  // Try to find exact match first - look for files that contain the full normalized URL
  for (const file of imageFiles) {
    const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp|html)$/i, '')
    // Check if filename contains the full normalized URL pattern
    if (fileName.includes(normalizedUrl) || normalizedUrl.includes(fileName.replace(/^https-::?/, '').replace(/^https-:/, ''))) {
      return path.join(IMAGE_DIR, file)
    }
  }
  
  // Try to match by domain and last segment (for URLs like /gallery/219147397/shootshare-Branding)
  if (lastSegment && lastSegment.length > 2 && domain) {
    for (const file of imageFiles) {
      const fileName = file.toLowerCase()
      // Check if filename contains both the domain and the last segment
      const domainMatch = fileName.includes(domain.replace(/^www\./, ''))
      const segmentMatch = fileName.includes(lastSegment.replace(/-/g, '-').replace(/_/g, '-'))
      
      if (domainMatch && segmentMatch) {
        return path.join(IMAGE_DIR, file)
      }
    }
  }
  
  // Try to match by gallery ID for Behance URLs (e.g., gallery/219147397)
  if (domain === 'www.behance.net' || domain === 'behance.net') {
    const galleryIdMatch = entryUrl.match(/gallery\/(\d+)/)
    if (galleryIdMatch) {
      const galleryId = galleryIdMatch[1]
      for (const file of imageFiles) {
        const fileName = file.toLowerCase()
        if (fileName.includes('behance') && fileName.includes(galleryId)) {
          return path.join(IMAGE_DIR, file)
        }
      }
    }
  }
  
  // Try to match by domain and any unique identifier
  if (domain) {
    const domainMatches = imageFiles.filter(f => {
      const fileName = f.toLowerCase()
      return fileName.includes(domain.replace(/^www\./, ''))
    })
    
    // If only one match, use it
    if (domainMatches.length === 1) {
      return path.join(IMAGE_DIR, domainMatches[0])
    }
    
    // If multiple matches, try to find one that matches a key part of the URL
    if (domainMatches.length > 1 && lastSegment) {
      for (const file of domainMatches) {
        const fileName = file.toLowerCase()
        if (fileName.includes(lastSegment.substring(0, 5))) { // Match first 5 chars of last segment
          return path.join(IMAGE_DIR, file)
        }
      }
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
  console.log('🚀 Starting Graphic Design Import Batch 2 (Pipeline 2.0)\n')
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

