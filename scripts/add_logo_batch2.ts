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

// URLs - extract titles from URLs or use default
const entries = [
  { url: 'https://www.instagram.com/p/DG_VLyzu0cq/', title: 'Instagram Post - DG_VLyzu0cq' },
  { url: 'https://www.instagram.com/p/CzD22FAsP9P/', title: 'Instagram Post - CzD22FAsP9P' },
  { url: 'https://www.instagram.com/p/CxfUsL2tClw/?igshid=MTc4MmM1YmI2Ng%3D%3D', title: 'Instagram Post - CxfUsL2tClw' },
  { url: 'https://www.instagram.com/p/CJbqLC6Bq3q/', title: 'Instagram Post - CJbqLC6Bq3q' },
  { url: 'https://it.pinterest.com/pin/211669251231828183/', title: 'Trade Mark Logo - Publishing House' },
  { url: 'https://it.pinterest.com/pin/19703317113461912/', title: 'Wisconsin State Logo Design' },
  { url: 'https://it.pinterest.com/pin/51087777020097802/', title: 'Book Logo Ideas - Joshua Distler' },
  { url: 'https://it.pinterest.com/pin/1618549855728606/', title: 'Monogram Shield Logo' },
  { url: 'https://it.pinterest.com/pin/22095854415835306/', title: 'Abstract Lion Symbol' },
  { url: 'https://it.pinterest.com/pin/29695678788361030/', title: 'Little Lion Logo' },
  { url: 'https://it.pinterest.com/pin/5840674510578224/', title: 'Lion Head Logo Design' },
  { url: 'https://it.pinterest.com/pin/27936460194064859/', title: 'Animal Logo Designs Inspiration' },
  { url: 'https://it.pinterest.com/pin/78742693476511486/', title: 'Ramazanov Ruslan - Logo Design' },
  { url: 'https://it.pinterest.com/pin/45458277483924409/', title: 'Sea Lion Logo Design' },
  { url: 'https://it.pinterest.com/pin/4433299629095146/', title: 'Creative Vision - Hand Logo' },
  { url: 'https://it.pinterest.com/pin/25684660371356018/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/70437488265288/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/129408189289008015/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/1125968651904856/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/8092474327054651/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/633387443819495/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/2251868557743430/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/985231163063170/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/844493675165029/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/12947917675553370/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/26458716563426928/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/3588874697856143/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/25051341670559410/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/4433299629346414/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/5559199536690150/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/4433299630146010/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/15129348744800304/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/1829656095156699/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/844493675410580/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/844493675706887/', title: 'Pinterest Logo Design' },
  { url: 'https://it.pinterest.com/pin/4292562140893478/', title: 'Pinterest Logo Design' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Logo'

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
  // Normalize URL for matching
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
  
  // For Instagram: extract post ID (e.g., "DG_VLyzu0cq" from "instagram.com:p:DG_VLyzu0cq")
  // For Pinterest: extract pin ID (e.g., "211669251231828183" from "it.pinterest.com:pin:211669251231828183")
  
  // Try exact match first
  for (const file of imageFiles) {
    const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, '')
    // Check if filename contains the normalized URL pattern
    if (fileName.includes(normalizedUrl) || normalizedUrl.includes(fileName.replace(/^https-::?/, '').replace(/^https-:/, ''))) {
      return path.join(IMAGE_DIR, file)
    }
  }
  
  // Try to match by domain and last segment
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
  
  // For Instagram: try matching by post ID
  if (domain.includes('instagram.com')) {
    const postIdMatch = entryUrl.match(/\/p\/([^\/\?]+)/)
    if (postIdMatch) {
      const postId = postIdMatch[1]
      for (const file of imageFiles) {
        const fileName = file.toLowerCase()
        if (fileName.includes('instagram') && fileName.includes(postId.toLowerCase())) {
          return path.join(IMAGE_DIR, file)
        }
      }
    }
  }
  
  // For Pinterest: try matching by pin ID
  if (domain.includes('pinterest.com')) {
    const pinIdMatch = entryUrl.match(/\/pin\/(\d+)/)
    if (pinIdMatch) {
      const pinId = pinIdMatch[1]
      for (const file of imageFiles) {
        const fileName = file.toLowerCase()
        if (fileName.includes('pinterest') && fileName.includes(pinId)) {
          return path.join(IMAGE_DIR, file)
        }
      }
    }
  }
  
  // Try to match by domain only (last resort)
  if (domain) {
    const domainMatches = imageFiles.filter(f => {
      const fileName = f.toLowerCase()
      return fileName.includes(domain.replace(/^www\./, ''))
    })
    
    // If only one match, use it
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
  console.log('🚀 Starting Logo Import Batch 2 (Pipeline 2.0)\n')
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

