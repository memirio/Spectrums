#!/usr/bin/env tsx
/**
 * Fix Failed Graphic Uploads
 * 
 * This script identifies which graphic images failed to upload
 * and processes them with improved filename matching.
 */

import 'dotenv/config'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import { canonicalizeImage } from '../src/lib/embeddings'
import fs from 'fs'
import path from 'path'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Graphic'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// All Pinterest URLs from the original list
const GRAPHIC_URLS = [
  'https://it.pinterest.com/pin/7740630605712907/',
  'https://it.pinterest.com/pin/422281209244440/',
  'https://it.pinterest.com/pin/3870349674692045/',
  'https://it.pinterest.com/pin/119838040083465745/',
  'https://it.pinterest.com/pin/308496643246412559/',
  'https://it.pinterest.com/pin/914862421525338/',
  'https://it.pinterest.com/pin/492649951845651/',
  'https://it.pinterest.com/pin/78813062221066372/',
  'https://it.pinterest.com/pin/68748306468/',
  'https://it.pinterest.com/pin/914862418773480/',
  'https://it.pinterest.com/pin/351912466893888/',
  'https://it.pinterest.com/pin/844493664758723/',
  'https://it.pinterest.com/pin/5207355814532858/',
  'https://it.pinterest.com/pin/11751649023184386/',
  'https://it.pinterest.com/pin/108227197290753301/',
  'https://it.pinterest.com/pin/467670742533909813/',
  'https://it.pinterest.com/pin/236790892903817729/',
  'https://it.pinterest.com/pin/44754590041621276/',
  'https://it.pinterest.com/pin/9640586698006858/',
  'https://it.pinterest.com/pin/1900024839411964/',
  'https://it.pinterest.com/pin/3870349674978921/',
  'https://it.pinterest.com/pin/8303580559127749/',
  'https://it.pinterest.com/pin/360710251425566447/',
  'https://it.pinterest.com/pin/1829656095054258/',
  'https://it.pinterest.com/pin/19984792093042285/',
  'https://it.pinterest.com/pin/9992430418487889/',
  'https://it.pinterest.com/pin/4855512089766205/',
  'https://it.pinterest.com/pin/5277724559898471/',
  'https://it.pinterest.com/pin/2744449769543733/',
  'https://it.pinterest.com/pin/14214555069348648/',
  'https://it.pinterest.com/pin/8092474326152906/',
  'https://it.pinterest.com/pin/4644405860091957/',
  'https://it.pinterest.com/pin/1196337404350230/',
  'https://it.pinterest.com/pin/3166662231798345/',
  'https://it.pinterest.com/pin/914862421519045/',
  'http://it.pinterest.com/pin/8444318045501612/',
  'https://it.pinterest.com/pin/1337074888726434/',
  'https://it.pinterest.com/pin/2814818511630038/',
  'https://it.pinterest.com/pin/55450639162981836/',
  'https://it.pinterest.com/pin/2392606048301357/',
  'https://it.pinterest.com/pin/2814818511630620/',
  'http://it.pinterest.com/pin/5066618330241748/',
  'https://it.pinterest.com/pin/9148005521169446/',
  'https://it.pinterest.com/pin/281543726114463/',
  'https://it.pinterest.com/pin/49539664642640427/',
  'https://it.pinterest.com/pin/1196337400869917/',
  'https://it.pinterest.com/pin/211174978199015/',
  'https://it.pinterest.com/pin/1900024839265262/',
  'https://it.pinterest.com/pin/211174977511145/',
  'https://it.pinterest.com/pin/4785143351493294/',
  'https://it.pinterest.com/pin/23432860625454920/',
  'https://it.pinterest.com/pin/4081455906888691/',
  'https://it.pinterest.com/pin/492649952031346/',
  'https://it.pinterest.com/pin/1900024838289859/',
  'https://it.pinterest.com/pin/150659550027616293/',
  'https://it.pinterest.com/pin/6122149485005093/',
  'https://it.pinterest.com/pin/1900024839265265/',
  'https://it.pinterest.com/pin/62628251062475050/',
  'https://it.pinterest.com/pin/885238870522109723/',
  'https://it.pinterest.com/pin/4996249583446573/',
  'https://it.pinterest.com/pin/204773114303995855/',
  'https://it.pinterest.com/pin/1013169247425466776/',
  'https://it.pinterest.com/pin/12455336470666462/',
  'https://it.pinterest.com/pin/300685712644000729/',
  'https://it.pinterest.com/pin/45950858693902807/',
  'https://it.pinterest.com/pin/8303580558403559/',
  'https://it.pinterest.com/pin/865746728378760733/',
]

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
    let title = 'Graphic Design'
    
    // Call Pipeline 2.0 API
    console.log(`   🚀 Calling Pipeline 2.0 API...`)
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        url,
        imageUrl,
        category: 'graphic',
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
  console.log('🔧 Fixing failed graphic uploads...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total URLs: ${GRAPHIC_URLS.length}\n`)
  
  // Get all files in directory
  const allFiles = fs.readdirSync(IMAGE_DIR)
    .filter(f => fs.statSync(path.join(IMAGE_DIR, f)).isFile())
  
  console.log(`📁 Found ${allFiles.length} files in directory\n`)
  
  let successCount = 0
  let errorCount = 0
  const notFound: string[] = []
  
  for (const url of GRAPHIC_URLS) {
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
  console.log(`   📦 Total: ${GRAPHIC_URLS.length}`)
  
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

