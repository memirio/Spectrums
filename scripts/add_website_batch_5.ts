#!/usr/bin/env tsx
/**
 * Add Website Batch 5 through Pipeline 2.0
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

const WEBSITE_ENTRIES = [
  { url: 'https://fitonist-app.webflow.io/', title: 'Fitonist App' },
  { url: 'https://opos.buzzworthystudio.com/', title: 'Opos Buzzworthy Studio' },
  { url: 'https://www.jordangilroy.com/', title: 'Jordan Gilroy' },
  { url: 'https://yourmajesty.co/', title: 'Your Majesty' },
  { url: 'https://play.makemepulse.com/', title: 'Make Me Pulse Play' },
  { url: 'https://betteroff.studio/', title: 'Better Off Studio' },
  { url: 'https://theartofdocumentary.com/', title: 'The Art of Documentary' },
  { url: 'https://www.digitalmosaik.com/en/', title: 'Digital Mosaik' },
  { url: 'https://www.steviaplease.me/', title: 'Stevia Please' },
  { url: 'https://www.breaking.com/', title: 'Breaking' },
  { url: 'https://superpower.com/', title: 'Superpower' },
  { url: 'https://www.zetr.co/', title: 'Zetr' },
  { url: 'https://www.lowesinnovationlabs.com/', title: 'Lowes Innovation Labs' },
  { url: 'https://work.outloud.co/pohoda', title: 'Out Loud Pohoda' },
  { url: 'https://www.weareuprising.com/', title: 'We Are Uprising' },
  { url: 'https://freespeech.gubrica.com/', title: 'Free Speech Gubrica' },
  { url: 'https://sugar-app.webflow.io/', title: 'Sugar App' },
  { url: 'https://non-linear.studio/', title: 'Non Linear Studio' },
  { url: 'https://den.cool/', title: 'Den Cool' },
  { url: 'https://www.bethebuzz.co/', title: 'Be The Buzz' },
  { url: 'https://portal.uflgame.com/', title: 'UFL Game Portal' },
  { url: 'https://www.planeterthos.com/', title: 'Planet Erthos' },
  { url: 'https://www.paffi.it/', title: 'Paffi' },
  { url: 'https://www.girard-perregaux.com/casquette-collection/', title: 'Girard Perregaux Casquette' },
  { url: 'https://dracarys.robertborghesi.is/', title: 'Dracarys Robert Borghesi' },
  { url: 'https://jobenetuk.dev/', title: 'Jobenet UK' },
  { url: 'https://doze.studio/en', title: 'Doze Studio' },
  { url: 'https://www.defprojetos.com/', title: 'Def Projetos' },
  { url: 'https://www.hevahealth.com/', title: 'Heva Health' },
  { url: 'https://view-source-cumulus.myshopify.com/', title: 'View Source Cumulus' },
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
  maxRetries: number = 3
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
        const delay = Math.min(5000 * Math.pow(2, attempt - 1), 20000)
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
      
      if ((errorMsg.includes('timeout') || errorMsg.includes('connection') || errorMsg.includes('fetch')) && attempt < maxRetries - 1) {
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
  console.log('🚀 Starting website batch 5 upload through Pipeline 2.0...\n')
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
  
  for (let i = 0; i < entriesWithImages.length; i++) {
    const entry = entriesWithImages[i]
    console.log(`\n[${i + 1}/${entriesWithImages.length}] [${entry.title}] Processing...`)
    console.log(`  URL: ${entry.url}`)
    
    const imagePath = findImageFile(entry.url, imageFiles)
    const result = await processEntryWithRetry(entry, imagePath, 3)
    
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
    
    if (i < entriesWithImages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000))
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
      console.log(`  - ${err.entry}: ${err.reason}${err.error ? ` (${err.error})` : ''}`)
    })
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

