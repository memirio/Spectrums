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

const BASE_URL = 'https://www.behance.net/gallery/239564835/LOGOS-MARKS-C02?tracking_source=curated_galleries_graphic-design'
const BASE_TITLE = 'LOGOS & MARKS C02'

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

async function processImage(imageFile: string, index: number) {
  try {
    const imagePath = path.join(IMAGE_DIR, imageFile)
    // Add number suffix to title to make each entry unique
    const title = `${BASE_TITLE} - ${index + 1}`
    // Add fragment to URL to make each entry unique (e.g., #1, #2, etc.)
    const url = `${BASE_URL}#${index + 1}`
    
    console.log(`\n[${title}] Processing...`)
    console.log(`  📁 File: ${imageFile}`)
    
    if (!fs.existsSync(imagePath)) {
      console.log(`  ⚠️  Image file not found: ${imagePath}`)
      return { success: false, reason: 'file_not_found' }
    }
    
    // Upload image to Supabase storage
    console.log(`  📤 Uploading image to storage...`)
    const imageUrl = await uploadImageToSupabaseStorage(imagePath)
    
    if (!imageUrl) {
      console.log(`  ❌ Failed to upload image`)
      return { success: false, reason: 'upload_failed' }
    }
    
    console.log(`  ✅ Image uploaded: ${imageUrl}`)
    
    // Call API with JSON body
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        url: url,
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
  console.log('🚀 Starting Logo Import (Pipeline 2.0)\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`🔗 Base URL: ${BASE_URL}`)
  console.log(`📝 Base Title: ${BASE_TITLE}\n`)
  
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Image directory not found: ${IMAGE_DIR}`)
    process.exit(1)
  }
  
  const imageFiles = fs.readdirSync(IMAGE_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort() // Sort to ensure consistent order
  
  console.log(`📸 Found ${imageFiles.length} image files\n`)
  
  if (imageFiles.length === 0) {
    console.error('❌ No image files found in directory')
    process.exit(1)
  }
  
  const results = {
    success: 0,
    failed: 0,
    details: [] as Array<{ index: number; file: string; status: string; reason?: string }>,
  }
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i]
    const result = await processImage(imageFile, i)
    
    if (result.success) {
      results.success++
      results.details.push({ index: i + 1, file: imageFile, status: 'success' })
    } else {
      results.failed++
      results.details.push({ index: i + 1, file: imageFile, status: 'failed', reason: result.reason })
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`📦 Total: ${imageFiles.length}`)
  
  if (results.details.length > 0) {
    console.log('\n📋 Details:')
    results.details.forEach(d => {
      const icon = d.status === 'success' ? '✅' : '❌'
      console.log(`  ${icon} Image ${d.index}: ${d.file}${d.reason ? ` (${d.reason})` : ''}`)
    })
  }
}

main().catch(console.error)

