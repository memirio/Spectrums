#!/usr/bin/env tsx
/**
 * Add Website Batch 6 through Pipeline 2.0
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

const WEBSITE_ENTRIES = [
  { url: 'https://pop.popingroup.com/', title: 'Popin Group' },
  { url: 'https://www.spylt.com/', title: 'SPYLT' },
  { url: 'https://www.oddcommon.com/', title: 'OddCommon' },
  { url: 'https://www.telefonica100.com/en', title: 'Telefonica 100' },
  { url: 'https://www.sonarmusic.com.au/', title: 'Sonar Music' },
  { url: 'https://www.kanaknaturals.com/', title: 'Kanak Naturals' },
  { url: 'https://uncommonstudio.com.au/', title: 'Uncommon Studio' },
  { url: 'https://www.zaptec.com/', title: 'Zaptec' },
  { url: 'https://www.fountainofyouth.gold/', title: 'Fountain of Youth' },
  { url: 'https://depoly.fiftyseven.co/', title: 'Depoly' },
  { url: 'https://www.boredapeyachtclub.com/', title: 'Bored Ape Yacht Club' },
  { url: 'https://rogierdeboeve.com/', title: 'Rogier de Boeve' },
  { url: 'https://radioradio.radio/', title: 'Radio Radio' },
  { url: 'https://www.drugtestinnocence.org/', title: 'Drug Test Innocence' },
  { url: 'https://thepatchsystem.com/', title: 'The Patch System' },
  { url: 'https://decathlon-wlkr76.index.studio/', title: 'Decathlon' },
  { url: 'https://13322566869.com/', title: '13322566869' },
  { url: 'https://stenger-bike.de/', title: 'Stenger Bike' },
  { url: 'https://techspeed.com/', title: 'Techspeed' },
  { url: 'https://www.neoculturalcouture.com/', title: 'Neo Cultural Couture' },
  { url: 'https://www.dolcegabbana.com/en-us/beauty/perfumes-for-her/dolce/dolce-blue-jasmine-eau-de-parfum---VT00G4VT0009V000.html', title: 'Dolce & Gabbana' },
  { url: 'https://kaizen.makemepulse.com/', title: 'Kaizen' },
  { url: 'https://des.obys.agency/', title: 'Obys Agency' },
  { url: 'https://spaace.io/', title: 'Spaace' },
  { url: 'https://thevariable.com/', title: 'The Variable' },
  { url: 'https://studiofables.com/en', title: 'Studio Fables' },
  { url: 'https://buenasuerte.cl/', title: 'Buenasuerte' },
  { url: 'https://labs.noomoagency.com/', title: 'Noomo Agency Labs' },
  { url: 'https://daylightcomputer.com/', title: 'Daylight Computer' },
  { url: 'https://www.redis.agency/', title: 'Redis Agency' },
  { url: 'https://www.bemo.studio/', title: 'Bemo Studio' },
  { url: 'https://a-chen.webflow.io/', title: 'A Chen' },
  { url: 'https://toyfight.co/', title: 'Toyfight' },
  { url: 'https://www.justgowiththeflow.com/', title: 'Just Go With The Flow' },
  { url: 'https://www.oshanehoward.com/', title: 'Oshane Howard' },
  { url: 'https://affectiosocietatis.com/', title: 'Affectio Societatis' },
  { url: 'https://www.oscarpico.es/', title: 'Oscar Pico' },
  { url: 'https://sloshseltzer.com/', title: 'Slosh Seltzer' },
  { url: 'https://aexlab.com/', title: 'AEX Lab' },
  { url: 'https://localstudio.fr/', title: 'Local Studio' },
  { url: 'https://www.q-industrial.com/en-de', title: 'Q Industrial' },
  { url: 'https://www.fruitful.com/', title: 'Fruitful' },
  { url: 'https://evasanchez.info/', title: 'Eva Sanchez' },
  { url: 'https://rxkstudio.com/', title: 'RXK Studio' },
  { url: 'https://nordquantique.ca/en', title: 'Nord Quantique' },
  { url: 'https://www.synthetictheatre.com/', title: 'Synthetic Theatre' },
  { url: 'https://53w53.com/', title: '53W53' },
  { url: 'https://www.pedenmunk.com/', title: 'Peden Munk' },
  { url: 'https://www.significo.com/', title: 'Significo' },
]

function extractUrlFromFilename(filename: string): string | null {
  const match = filename.match(/\[([^\]]+)\]/)
  if (match) {
    let url = match[1]
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    return url.replace(/\/$/, '')
  }
  return null
}

function normalizeUrl(url: string): string {
  let normalized = url.trim()
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized
  }
  normalized = normalized.replace(/\/$/, '')
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
  console.log('🚀 Adding batch 6 websites through Pipeline 2.0...\n')
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

