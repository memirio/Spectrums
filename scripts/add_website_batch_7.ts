#!/usr/bin/env tsx
/**
 * Add Website Batch 7 through Pipeline 2.0
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

const WEBSITE_ENTRIES = [
  { url: 'https://inkfishnyc.com/', title: 'Inkfish' },
  { url: 'https://analogueagency.com/', title: 'Analogue Agency' },
  { url: 'https://www.str8fire.io/', title: 'STR8FIRE' },
  { url: 'https://arocksworld.com/', title: 'A Rocks World' },
  { url: 'https://canvascreative.co/', title: 'Canvas Creative' },
  { url: 'https://raxo.co/', title: 'Raxo' },
  { url: 'https://backstage.bonjovi.com/', title: 'Bon Jovi Backstage' },
  { url: 'https://format-3.co/', title: 'Format 3' },
  { url: 'https://escape.cafe/', title: 'Escape Cafe' },
  { url: 'https://www.wow-showroom.com/mouse-parallax', title: 'WOW Showroom' },
  { url: 'https://kzero.com/', title: 'Kzero' },
  { url: 'https://steamboat.pha5e.com/', title: 'Steamboat' },
  { url: 'https://fuji.halfof8.com/', title: 'Fuji' },
  { url: 'https://scrib3.co/', title: 'Scrib3' },
  { url: 'https://www.wrightsferrymansion.org/', title: 'Wrights Ferry Mansion' },
  { url: 'https://artificial-garage.com/', title: 'Artificial Garage' },
  { url: 'https://boss-halo-store.dogstudio.co/', title: 'Boss Halo Store' },
  { url: 'https://www.filmsecession.com/', title: 'Film Secession' },
  { url: 'https://equinox.space/', title: 'Equinox' },
  { url: 'https://www.theo.be/', title: 'Theo' },
  { url: 'https://askphill.com/', title: 'Ask Phill' },
  { url: 'https://www.lyon-beton.com/', title: 'Lyon Beton' },
  { url: 'https://revenant.tv/', title: 'Revenant' },
  { url: 'https://www.eseagency.ch/en', title: 'ESE Agency' },
  { url: 'https://www.relyonkaide.com/', title: 'Rely On Kaide' },
  { url: 'https://www.widelab.co/', title: 'Widelab' },
  { url: 'https://futurerecord.ai/', title: 'Future Record' },
  { url: 'https://www.metalab.com/', title: 'Metalab' },
  { url: 'https://www.match.studio/', title: 'Match Studio' },
  { url: 'https://aircord.co.jp/en/', title: 'Aircord' },
  { url: 'https://madeinhaus.com/', title: 'Made In Haus' },
  { url: 'https://intrusionproject.com/', title: 'Intrusion Project' },
  { url: 'https://columbia100.watson.la/', title: 'Columbia 100' },
  { url: 'https://www.yard.me/', title: 'Yard' },
  { url: 'https://vntnr.co/', title: 'VNTNR' },
  { url: 'https://wildeweide.nl/en/', title: 'Wilde Weide' },
  { url: 'https://gabrielcontassot.com/', title: 'Gabriel Contassot' },
  { url: 'https://mccann.com/', title: 'McCann' },
  { url: 'https://www.wrk-timepieces.com/products/acf-01', title: 'WRK Timepieces' },
  { url: 'https://quatre.merci-michel.com/en', title: 'Quatre Merci Michel' },
  { url: 'https://masaigon.space/en', title: 'Masaigon' },
  { url: 'https://www.phsofia.com/', title: 'PHSofia' },
  { url: 'https://www.workshophospitality.com/', title: 'Workshop Hospitality' },
  { url: 'https://organimo.com/', title: 'Organimo' },
  { url: 'https://www.tagheuer.com/fr/en/eyewear-collection/collection-eyewear.html', title: 'Tag Heuer Eyewear' },
  { url: 'https://vendredi-society.com/', title: 'Vendredi Society' },
  { url: 'https://axelvanhessche.com/', title: 'Axel Van Hessche' },
  { url: 'https://akaru.fr/', title: 'Akaru' },
  { url: 'https://twicemediahouse.com/', title: 'Twice Media House' },
]

function extractUrlFromFilename(filename: string): string | null {
  const match = filename.match(/\[([^\]]+)\]/)
  if (match) {
    let url = match[1]
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    return url.replace(/\/$/, '').replace(/#$/, '')
  }
  return null
}

function normalizeUrl(url: string): string {
  let normalized = url.trim()
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized
  }
  normalized = normalized.replace(/\/$/, '').replace(/#$/, '')
  normalized = normalized.replace(/^https?:\/\/(www\.)?/, 'https://')
  return normalized.toLowerCase()
}

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
  
  try {
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
  } catch {
    // Invalid entry URL
  }
  
  return null
}

async function processEntryWithRetry(
  entry: { title: string; url: string },
  imagePath: string | null,
  maxRetries: number = 5
): Promise<{ success: boolean; reason?: string; error?: string }> {
  if (!imagePath) {
    console.log(`  ⚠️  No matching image found, skipping`)
    return { success: false, reason: 'no_image' }
  }
  
  if (!fs.existsSync(imagePath)) {
    console.log(`  ⚠️  Image file not found: ${imagePath}`)
    return { success: false, reason: 'file_not_found' }
  }
  
  console.log(`  📤 Uploading image to storage...`)
  let imageUrl: string | null = null
  try {
    imageUrl = await uploadImageToSupabaseStorage(imagePath)
  } catch (error: any) {
    console.log(`  ❌ Failed to upload image: ${error.message}`)
    return { success: false, reason: 'upload_failed', error: error.message }
  }
  
  if (!imageUrl) {
    console.log(`  ❌ Failed to upload image`)
    return { success: false, reason: 'upload_failed' }
  }
  
  console.log(`  ✅ Image uploaded: ${imageUrl}`)
  
  let lastError: any = null
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(15000 * Math.pow(2, attempt - 1), 90000)
        console.log(`  🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
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
          skipConceptGeneration: true,
        }),
        signal: AbortSignal.timeout(180000),
      })
      
      if (!response.ok) {
        let errorText = ''
        try {
          const errorJson = await response.json()
          errorText = JSON.stringify(errorJson, null, 2)
        } catch {
          errorText = await response.text()
        }
        
        const errorMsg = errorText.toLowerCase()
        if ((errorMsg.includes('timeout') || errorMsg.includes('connection')) && attempt < maxRetries - 1) {
          lastError = { status: response.status, error: errorText }
          continue
        }
        
        console.log(`  ❌ API error: ${response.status}`)
        console.log(`  Error details: ${errorText.substring(0, 300)}`)
        return { success: false, reason: 'api_error', error: errorText }
      }
      
      const result = await response.json()
      console.log(`  ✅ Success! Site ID: ${result.site?.id || 'unknown'}`)
      if (result.error) {
        console.log(`  ⚠️  Warning: ${result.error}`)
      }
      return { success: true }
    } catch (error: any) {
      lastError = error
      const errorMsg = error.message?.toLowerCase() || String(error).toLowerCase()
      
      if ((errorMsg.includes('timeout') || errorMsg.includes('connection') || errorMsg.includes('fetch') || errorMsg.includes('aborted')) && attempt < maxRetries - 1) {
        continue
      }
      
      console.log(`  ❌ Error: ${error.message}`)
      return { success: false, reason: 'exception', error: error.message }
    }
  }
  
  console.log(`  ❌ All ${maxRetries} retry attempts failed`)
  return { success: false, reason: 'max_retries_exceeded', error: lastError?.message }
}

async function main() {
  console.log('🚀 Adding batch 7 websites through Pipeline 2.0...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total entries: ${WEBSITE_ENTRIES.length}\n`)
  
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
  
  const entriesWithImages = WEBSITE_ENTRIES.filter(entry => {
    const imagePath = findImageFile(entry.url, imageFiles)
    return imagePath !== null && fs.existsSync(imagePath)
  })
  
  console.log(`📋 Found ${entriesWithImages.length} entries with matching images (out of ${WEBSITE_ENTRIES.length} total)\n`)
  
  // Process with 15 second delays between entries
  for (let i = 0; i < entriesWithImages.length; i++) {
    const entry = entriesWithImages[i]
    console.log(`\n[${i + 1}/${entriesWithImages.length}] [${entry.title}] Processing...`)
    console.log(`  URL: ${entry.url}`)
    
    const imagePath = findImageFile(entry.url, imageFiles)
    const result = await processEntryWithRetry(entry, imagePath, 5)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
      if (result.reason === 'no_image') {
        results.noImage++
      }
      results.errors.push({
        entry: entry.title,
        reason: result.reason || 'unknown',
        error: result.error,
      })
    }
    
    // 15 second delay between entries
    if (i < entriesWithImages.length - 1) {
      console.log(`  ⏳ Waiting 15 seconds before next entry...`)
      await new Promise(resolve => setTimeout(resolve, 15000))
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  No image found: ${results.noImage}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => {
      console.log(`  - ${err.entry}: ${err.reason}${err.error ? ` (${err.error.substring(0, 100)})` : ''}`)
    })
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

