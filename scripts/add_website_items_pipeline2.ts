#!/usr/bin/env tsx
/**
 * Add Website Items through Pipeline 2.0
 * 
 * Processes website screenshots from FireShot directory and uploads them
 * through Pipeline 2.0 (no new concept generation, only tags with existing concepts).
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

// Website entries to process
const WEBSITE_ENTRIES = [
  { url: 'https://www.flim.ai/', title: 'Flim' },
  { url: 'https://www.seventeenagency.com/', title: 'Seventeen Agency' },
  { url: 'https://paya.ar/', title: 'PAYÁ - Film Haus' },
  { url: 'https://jacques-cie.com/', title: 'Jacques + Cie' },
  { url: 'https://titangatequity.com/', title: 'TitanGate Equity' },
  { url: 'https://davincii.com/', title: 'DaVincii' },
  { url: 'https://www.paolovendramini.com/', title: 'Paolo Vendramini' },
  { url: 'https://newgenre.studio/', title: 'New Genre' },
  { url: 'https://www.creativegiants.art/', title: 'Creative Giants' },
  { url: 'https://ribbit.dk/', title: 'Ribbit' },
  { url: 'https://themonolithproject.net/', title: 'The Monolith Project' },
  { url: 'https://www.glyphic.bio/', title: 'Glyphic Biotechnologies' },
  { url: 'https://sofaknows.com/', title: 'SofaKnows' },
  { url: 'https://oceanfilms.com.br/', title: 'Ocean Films' },
  { url: 'https://wearecollins.com/', title: 'COLLINS' },
  { url: 'https://mobbin.com/', title: 'Mobbin' },
  { url: 'https://www.madhstore.com/', title: 'MADH' },
  { url: 'https://bassbcn.com/', title: 'BASS Barcelona' },
  { url: 'https://www.sandbar.com/', title: 'Sandbar' },
  { url: 'https://s-o.io/', title: 'SPECIAL OFFER, Inc.' },
  { url: 'https://www.groth.studio/', title: 'Groth Studio' },
  { url: 'https://www.early.works/', title: 'Early Works' },
  { url: 'https://roma-template.framer.website/', title: 'Roma Template' },
  { url: 'https://www.wist.chat/', title: 'Wist Chat' },
  { url: 'https://reevo.ai/', title: 'Reevo' },
  { url: 'https://www.getrally.com/', title: 'Rally' },
  { url: 'https://www.brandium.nl/', title: 'Brandium' },
  { url: 'https://www.everbloom.bio/', title: 'Everbloom' },
  { url: 'https://www.massivemusic.com/', title: 'MassiveMusic' },
  { url: 'https://proto.xyz/', title: 'Proto' },
  { url: 'https://byebyebad.com/', title: 'byebyebad' },
  { url: 'https://mikevandersanden.com/', title: 'Mike van der Sanden' },
  { url: 'https://www.sananes.co/', title: 'Aaron Sananes' },
  { url: 'https://picmal.app/', title: 'Picmal' },
  { url: 'https://assassins-creed-mirage-one.webflow.io/', title: 'Assassins Creed Mirage' },
  { url: 'https://maikasui.com/', title: 'maikasui' },
  { url: 'https://heavn-one.webflow.io/', title: 'HEAVN One' },
  { url: 'https://www.fizzy.do/', title: 'Fizzy' },
  { url: 'https://alcove.news/', title: 'Alcove' },
  { url: 'https://sleep-well-creatives.com/', title: 'Sleep Well Creatives' },
  { url: 'https://telescope.fyi/', title: 'Telescope' },
  { url: 'https://www.transform9.com/', title: 'Transform9' },
  { url: 'https://www.overpass.com/', title: 'Overpass' },
  { url: 'https://vivienscreative.com.au/', title: "Vivien's Creative" },
  { url: 'https://middlename.co.uk/', title: 'Middle Name' },
  { url: 'https://markus.se/', title: 'Markus Reklambyrå' },
  { url: 'https://redneck.media/', title: 'REDNECK - Web Studio' },
  { url: 'https://theremin.app/', title: 'Theremix - Virtual Theremin' },
  { url: 'https://www.m-trust.co.jp/', title: 'エムトラスト株式会社' },
  { url: 'https://www.atrio.it/', title: 'àtrio - Agenzia di Comunicazione' },
  { url: 'https://mark-appleby.com/', title: 'Mark Appleby - Web Developer' },
  { url: 'https://rinnai.jp/microbubble/', title: 'Rinnai Micro Bubble Bath Unit' },
]

/**
 * Extract URL from filename
 * Pattern: "FireShot Capture XXX - Title - [URL].png"
 */
function extractUrlFromFilename(filename: string): string | null {
  const match = filename.match(/\[([^\]]+)\]/)
  if (match) {
    let url = match[1]
    // Normalize URL (remove trailing slash, ensure https)
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    return url.replace(/\/$/, '')
  }
  return null
}

/**
 * Normalize URL for matching
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim()
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized
  }
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')
  // Remove www. prefix for matching
  normalized = normalized.replace(/^https?:\/\/(www\.)?/, 'https://')
  return normalized.toLowerCase()
}

/**
 * Find image file matching the URL
 */
function findImageFile(entryUrl: string, imageFiles: string[]): string | null {
  const normalizedEntryUrl = normalizeUrl(entryUrl)
  
  for (const imageFile of imageFiles) {
    const extractedUrl = extractUrlFromFilename(imageFile)
    if (extractedUrl) {
      const normalizedExtractedUrl = normalizeUrl(extractedUrl)
      if (normalizedExtractedUrl === normalizedEntryUrl) {
        return path.join(IMAGE_DIR, imageFile)
      }
    }
  }
  
  // Try domain-only matching as fallback
  const entryDomain = new URL(entryUrl).hostname.replace(/^www\./, '')
  for (const imageFile of imageFiles) {
    const extractedUrl = extractUrlFromFilename(imageFile)
    if (extractedUrl) {
      try {
        const extractedDomain = new URL(extractedUrl).hostname.replace(/^www\./, '')
        if (extractedDomain === entryDomain) {
          return path.join(IMAGE_DIR, imageFile)
        }
      } catch {
        // Invalid URL, skip
      }
    }
  }
  
  return null
}


/**
 * Process a single website entry
 */
async function processEntry(entry: { title: string; url: string }, imagePath: string | null) {
  try {
    console.log(`\n[${entry.title}] Processing...`)
    console.log(`  URL: ${entry.url}`)
    
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
        category: 'website',
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
    const errorMsg = error.message || String(error)
    console.log(`  ❌ Error: ${errorMsg}`)
    
    // If it's a network error, provide more context
    if (errorMsg.includes('fetch failed') || errorMsg.includes('ECONNREFUSED')) {
      return { success: false, reason: 'network_error', error: 'Server may be overloaded or unreachable. Try again later.' }
    }
    
    return { success: false, reason: 'exception', error: errorMsg }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting website upload through Pipeline 2.0...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total entries: ${WEBSITE_ENTRIES.length}\n`)
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGE_DIR).filter(file => 
    file.endsWith('.png') && file.includes('FireShot')
  )
  
  console.log(`📸 Found ${imageFiles.length} FireShot images\n`)
  
  const results = {
    success: 0,
    failed: 0,
    noImage: 0,
    errors: [] as Array<{ entry: string; reason: string; error?: string }>,
  }
  
  // Filter entries to only those with matching images
  const entriesWithImages = WEBSITE_ENTRIES.filter(entry => {
    const imagePath = findImageFile(entry.url, imageFiles)
    return imagePath !== null && fs.existsSync(imagePath)
  })
  
  console.log(`📋 Found ${entriesWithImages.length} entries with matching images (out of ${WEBSITE_ENTRIES.length} total)\n`)
  
  // Process each entry
  for (const entry of entriesWithImages) {
    const imagePath = findImageFile(entry.url, imageFiles)
    const result = await processEntry(entry, imagePath, 3)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
      if (result.reason === 'no_image') {
        results.noImage++
      }
      results.errors.push({
        entry: entry.title,
        reason: result.reason,
        error: result.error,
      })
    }
    
    // Longer delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  No image found: ${results.noImage}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => {
      console.log(`  - ${err.entry}: ${err.reason}${err.error ? ` (${err.error})` : ''}`)
    })
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

