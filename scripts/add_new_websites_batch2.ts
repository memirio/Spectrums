#!/usr/bin/env tsx
/**
 * Add New Website Items through Pipeline 2.0 (Batch 2)
 * 
 * Processes website screenshots from FireShot/Webb directory and uploads them
 * through Pipeline 2.0 (no new concept generation, only tags with existing concepts).
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import { prisma } from '../src/lib/prisma'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Webb'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

// Website entries to process
const WEBSITE_ENTRIES = [
  { url: 'https://www.mathical.com/', title: 'Mathical' },
  { url: 'https://www.breachbunny.com/de', title: 'BreachBunny' },
  { url: 'https://www.cartier.com/en-us/loveconfigurator.html#love=%22%7B%5C%22state%5C%22%3A%7B%5C%22result%5C%22%3Anull%2C%5C%22currentStep%5C%22%3A%5C%22model%5C%22%2C%5C%22currentSelection%5C%22%3A%7B%5C%22model%5C%22%3A%5C%22classic%5C%22%7D%7D%2C%5C%22version%5C%22%3A0%7D%22', title: 'Cartier Love Configurator' },
  { url: 'https://apartamentosguayadeque.com/es', title: 'Apartamentos Guayadeque' },
  { url: 'https://www.jokula.com/', title: 'Jokula' },
  { url: 'https://www.beteropenbaarbestuur.nl/', title: 'Beter Openbaar Bestuur' },
  { url: 'https://okapa.com/', title: 'OKAPA' },
  { url: 'https://docshield.com/', title: 'Docshield' },
  { url: 'https://www.anima-cc.com/', title: 'Anima' },
  { url: 'https://www.voltpile.com/', title: 'Voltpile' },
  { url: 'https://feather.computer/', title: 'Feather' },
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
  // Remove hash fragments and query params for matching
  normalized = normalized.split('#')[0].split('?')[0]
  return normalized.toLowerCase()
}

/**
 * Find image file matching the URL
 */
function findImageFile(entryUrl: string, imageFiles: string[]): string | null {
  const normalizedEntryUrl = normalizeUrl(entryUrl)
  
  for (const file of imageFiles) {
    const fileUrl = extractUrlFromFilename(file)
    if (fileUrl) {
      const normalizedFileUrl = normalizeUrl(fileUrl)
      // Try exact match first
      if (normalizedFileUrl === normalizedEntryUrl) {
        return path.join(IMAGE_DIR, file)
      }
      // Try matching domain (for URLs with paths/hashes)
      const entryDomain = normalizedEntryUrl.replace(/^https:\/\/([^\/]+).*/, '$1')
      const fileDomain = normalizedFileUrl.replace(/^https:\/\/([^\/]+).*/, '$1')
      if (entryDomain === fileDomain && entryDomain !== '') {
        return path.join(IMAGE_DIR, file)
      }
    }
  }
  return null
}

/**
 * Process a single website entry: upload image and call API
 */
async function processEntry(
  entry: { url: string; title: string },
  imagePath: string | null,
  maxRetries: number = 3
): Promise<{ success: boolean; reason?: string; error?: string; status?: number; siteId?: string }> {
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

  // Check if site already exists in the database
  const normalizedEntryUrl = normalizeUrl(entry.url)
  const existingSite = await prisma.site.findFirst({
    where: { 
      url: {
        contains: normalizedEntryUrl.replace('https://', '').split('/')[0], // Match by domain
      }
    },
    select: { id: true, url: true }
  })

  if (existingSite) {
    console.log(`  ⏭️  Site with similar URL already exists (ID: ${existingSite.id}, URL: ${existingSite.url}), skipping API call.`)
    return { success: true, siteId: existingSite.id, reason: 'already_exists' }
  }
  
  // Upload image to Supabase storage first
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
  
  // Retry API call with exponential backoff
  let lastError: any = null
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(5000 * Math.pow(2, attempt - 1), 30000) // Exponential backoff, max 30s
        console.log(`  🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
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
        
        const errorMsg = errorText.toLowerCase()
        // If it's a connection timeout, retry
        if ((errorMsg.includes('timeout') || errorMsg.includes('connection')) && attempt < maxRetries - 1) {
          lastError = { status: response.status, error: errorText }
          continue // Retry
        }
        
        console.log(`  ❌ API error: ${response.status}`)
        console.log(`  Error details: ${errorText.substring(0, 300)}`)
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
      if ((errorMsg.includes('fetch failed') || errorMsg.includes('ECONNREFUSED')) && attempt < maxRetries - 1) {
        lastError = { reason: 'network_error', error: 'Server may be overloaded or unreachable. Retrying...' }
        continue // Retry
      }
      
      return { success: false, reason: 'exception', error: errorMsg }
    }
  }
  return { success: false, reason: 'max_retries_exceeded', error: lastError?.error || 'Unknown error after retries' }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting website upload through Pipeline 2.0 (Batch 2)...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total entries: ${WEBSITE_ENTRIES.length}\n`)
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGE_DIR).filter(file => 
    file.endsWith('.png') && file.includes('FireShot')
  )
  
  console.log(`📸 Found ${imageFiles.length} FireShot images\n`)
  
  const entriesToProcess = WEBSITE_ENTRIES.map(entry => ({
    entry,
    imagePath: findImageFile(entry.url, imageFiles)
  })).filter(item => item.imagePath !== null); // Only process entries for which an image was found

  console.log(`📋 Found ${entriesToProcess.length} entries with matching images (out of ${WEBSITE_ENTRIES.length} total)\n`)
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0, // Added for already existing sites
    noImage: 0,
    errors: [] as Array<{ entry: string; reason: string; error?: string }>,
  }
  
  // Process each entry
  for (const item of entriesToProcess) {
    const result = await processEntry(item.entry, item.imagePath)
    
    if (result.success) {
      if (result.reason === 'already_exists') {
        results.skipped++;
      } else {
        results.success++;
      }
    } else {
      results.failed++
      if (result.reason === 'no_image') {
        results.noImage++
      }
      results.errors.push({
        entry: item.entry.title,
        reason: result.reason || 'unknown',
        error: result.error,
      })
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`⏭️  Skipped (already exists): ${results.skipped}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  No image found: ${results.noImage}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => {
      console.log(`  - ${err.entry}: ${err.reason}${err.error ? ` (${err.error})` : ''}`)
    })
  }
  
  console.log('\n✅ Done!')
  
  await prisma.$disconnect()
}

main().catch(console.error)

