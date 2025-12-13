import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'Images'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'
const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Graphic'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Kate Prior entries with their correct image filenames
const katePriorEntries = [
  { url: 'https://www.kateprior.com/#/protein/', title: 'Protein - Kate Prior', imageFile: 'https-::www.kateprior.com:.jpg' },
  { url: 'https://www.kateprior.com/#/shredders/', title: 'Shredders - Kate Prior', imageFile: 'https-:www.kateprior.com:#:shredders.webp' },
  { url: 'https://www.kateprior.com/#/shake-shack/', title: 'Shake Shack - Kate Prior', imageFile: 'https-:www.kateprior.com:#:shake-shack.webp' },
  { url: 'https://www.kateprior.com/#/indy-man-beer-con/', title: 'Indy Man Beer Con - Kate Prior', imageFile: 'https-:www.kateprior.com:#:indy-man-beer-con.webp' },
  { url: 'https://www.kateprior.com/#/openair-st-gallen/', title: 'Openair St Gallen - Kate Prior', imageFile: 'https-:www.kateprior.com:#:openair-st-gallen.webp' },
  { url: 'https://www.kateprior.com/#/zodiac/', title: 'Zodiac - Kate Prior', imageFile: 'https-:www.kateprior.com:#:zodiac.webp' },
  { url: 'https://www.kateprior.com/#/loud-quiet/', title: 'Loud & Quiet - Kate Prior', imageFile: 'https-:www.kateprior.com:#:loud-quiet.webp' },
]

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

async function deleteKatePriorSites() {
  console.log('🗑️  Deleting existing Kate Prior sites...\n')
  
  const sites = await prisma.site.findMany({
    where: {
      url: { contains: 'kateprior.com' }
    },
    include: {
      images: true
    }
  })
  
  console.log(`Found ${sites.length} Kate Prior sites to delete`)
  
  for (const site of sites) {
    console.log(`  Deleting: ${site.title} (${site.url})`)
    await prisma.site.delete({
      where: { id: site.id }
    })
  }
  
  console.log(`✅ Deleted ${sites.length} sites\n`)
}

async function addSiteWithCorrectImage(entry: typeof katePriorEntries[0]) {
  try {
    console.log(`\n[${entry.title}] Processing...`)
    
    const imagePath = path.join(IMAGE_DIR, entry.imageFile)
    
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
        title: entry.title,
        url: entry.url,
        imageUrl: imageUrl,
        category: 'graphic',
        skipConceptGeneration: true, // Pipeline 2.0
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
    return { success: true, siteId: result.site?.id }
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`)
    return { success: false, reason: 'exception', error: error.message }
  }
}

async function main() {
  console.log('🔧 Fixing Kate Prior entries with correct images\n')
  
  // Step 1: Delete existing Kate Prior sites
  await deleteKatePriorSites()
  
  // Step 2: Re-add them with correct images
  console.log('📤 Re-adding Kate Prior sites with correct images...\n')
  
  const results = {
    success: 0,
    failed: 0,
  }
  
  for (const entry of katePriorEntries) {
    const result = await addSiteWithCorrectImage(entry)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`📦 Total: ${katePriorEntries.length}`)
}

main().catch(console.error)

