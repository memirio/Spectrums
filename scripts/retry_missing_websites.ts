#!/usr/bin/env tsx
/**
 * Retry Upload for Missing Websites
 * 
 * Retries uploading the 3 missing websites that have image files.
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

// Missing websites with image files found
const MISSING_WEBSITES = [
  { url: 'https://neverhack.com/en', title: 'Neverhack', filename: 'FireShot Capture 462 - Advanced cybersecurity solutions - Neverhack - [neverhack.com].png' },
  { url: 'https://mallardandclaret.com/', title: 'Mallard and Claret', filename: 'FireShot Capture 463 - Mallard & Claret - Highly bespoke websites for ambitious brands_ - [mallardandclaret.com].png' },
  { url: 'https://history.jailhouselawyers.org/', title: 'Jailhouse Lawyers – History', filename: 'FireShot Capture 464 - Our Roots • Flashlights - [history.jailhouselawyers.org].png' },
]

/**
 * Process a single website entry with retry logic
 */
async function processEntryWithRetry(
  entry: { title: string; url: string; filename: string },
  maxRetries: number = 3
): Promise<{ success: boolean; reason?: string }> {
  const imagePath = path.join(IMAGE_DIR, entry.filename)
  
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
    return { success: false, reason: 'upload_failed' }
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
        const delay = Math.min(3000 * Math.pow(2, attempt - 1), 15000) // Exponential backoff, max 15s
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
        return { success: false, reason: 'api_error', ...lastError }
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
      
      // If it's a connection error and we have retries left, continue
      if ((errorMsg.includes('timeout') || errorMsg.includes('connection') || errorMsg.includes('fetch')) && attempt < maxRetries - 1) {
        continue // Retry
      }
      
      console.log(`  ❌ Error: ${error.message}`)
      return { success: false, reason: 'exception', error: error.message }
    }
  }
  
  // All retries exhausted
  console.log(`  ❌ All ${maxRetries} retry attempts failed`)
  return { success: false, reason: 'max_retries_exceeded', error: lastError?.message }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Retrying upload for missing websites...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total entries to retry: ${MISSING_WEBSITES.length}\n`)
  console.log('ℹ️  Note: Seventeen Agency image file not found, skipping.\n')
  
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ entry: string; reason: string; error?: string }>,
  }
  
  // Process each entry with longer delays
  for (const entry of MISSING_WEBSITES) {
    console.log(`\n[${entry.title}] Processing...`)
    console.log(`  URL: ${entry.url}`)
    console.log(`  Image: ${entry.filename}`)
    
    const result = await processEntryWithRetry(entry, 3)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
      results.errors.push({
        entry: entry.title,
        reason: result.reason || 'unknown',
        error: result.error,
      })
    }
    
    // Longer delay between entries to avoid overwhelming the database
    if (entry !== MISSING_WEBSITES[MISSING_WEBSITES.length - 1]) {
      console.log(`  ⏳ Waiting 5 seconds before next entry...`)
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(err => {
      console.log(`  - ${err.entry}: ${err.reason}${err.error ? ` (${err.error})` : ''}`)
    })
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

