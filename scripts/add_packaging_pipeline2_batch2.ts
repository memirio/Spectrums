import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'
const IMAGES_DIR = '/Users/victor/Downloads/FireShot/Packaging'

// New entries for this batch
const entries = [
  { title: 'Baco and Nysa', url: 'https://packagingoftheworld.com/2015/05/baco-and-nysa.html' },
  { title: 'DEVOUT. Champagne', url: 'https://packagingoftheworld.com/2015/05/devout-champagne-concept.html' },
  { title: 'Fly High Red', url: 'https://packagingoftheworld.com/2015/05/fly-high-red-packets.html' },
  { title: 'Cacao Barry', url: 'https://packagingoftheworld.com/2015/05/cacao-barry-worlds-50-best-restaurants.html' },
  { title: 'Ahal', url: 'https://packagingoftheworld.com/2015/04/ahal.html' },
  { title: 'Nike', url: 'https://packagingoftheworld.com/2015/04/nike-opening-packaging.html' },
  { title: 'EVO', url: 'https://packagingoftheworld.com/2015/04/the-economical-packaging-evo.html' },
  { title: 'Titses', url: 'https://packagingoftheworld.com/2015/04/titses.html' },
  { title: 'Finchtail', url: 'https://packagingoftheworld.com/2015/04/finchtail.html' },
  { title: 'Peetri Lõheäri', url: 'https://packagingoftheworld.com/2015/04/peetri-loheari-fish-packaging.html' },
  { title: 'Siemalab', url: 'https://packagingoftheworld.com/2015/04/nativetech-by-siemalab.html' },
  { title: 'News Of The Wooled', url: 'https://packagingoftheworld.com/2015/04/news-of-wooled-introduction-to-knitting.html' },
  { title: 'Kalev', url: 'https://packagingoftheworld.com/2015/04/kalev-chocolate-bars.html' },
  { title: 'NoMad', url: 'https://packagingoftheworld.com/2015/04/nomad-playing-cards.html' },
  { title: "Gino's Garden", url: 'https://packagingoftheworld.com/2015/04/olive-by-ginos-garden.html' },
  { title: 'CopperMuse', url: 'https://packagingoftheworld.com/2015/04/coppermuse-vodka.html' },
  { title: 'Csernyik pince', url: 'https://packagingoftheworld.com/2015/04/csernyik-pince-nyitany-wine-label.html' },
  { title: 'Savon Stories', url: 'https://packagingoftheworld.com/2015/04/savon-stories-organic-soap.html' },
  { title: 'Flores & Vegetais', url: 'https://packagingoftheworld.com/2015/04/flores-vegetais.html' },
  { title: 'Smile Water', url: 'https://packagingoftheworld.com/2015/04/smile-water.html' },
  { title: 'Aero Brand', url: 'https://packagingoftheworld.com/2015/04/aero-brand-student-project.html' },
  { title: 'Depend Cosmetics', url: 'https://packagingoftheworld.com/2015/04/depend-cosmetics-redesign-student.html' },
  { title: 'The Yachtsetter', url: 'https://packagingoftheworld.com/2015/04/the-yachtsetter.html' },
  { title: "L' ARTIGIANO", url: 'https://packagingoftheworld.com/2015/04/l-artigiano.html' },
]

// Normalize filename for matching (remove special chars, lowercase, handle accents)
function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Find matching image file for an entry
function findImageFile(entryTitle: string, imageFiles: string[]): string | null {
  const normalizedTitle = normalizeFilename(entryTitle)
  
  // Try exact match first
  for (const file of imageFiles) {
    const normalizedFile = normalizeFilename(path.basename(file, path.extname(file)))
    if (normalizedFile === normalizedTitle) {
      return file
    }
  }
  
  // Try partial match
  const titleWords = normalizedTitle.split(' ')
  for (const file of imageFiles) {
    const normalizedFile = normalizeFilename(path.basename(file, path.extname(file)))
    const fileWords = normalizedFile.split(' ')
    
    // Check if all title words appear in file name
    if (titleWords.every(word => fileWords.some(fw => fw.includes(word) || word.includes(fw)))) {
      return file
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
        category: 'packaging',
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
  console.log('🚀 Starting Pipeline 2.0 batch upload (no concept generation)')
  console.log(`📁 Images directory: ${IMAGES_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📦 Total entries: ${entries.length}`)
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .map(file => path.join(IMAGES_DIR, file))
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })
  
  console.log(`🖼️  Found ${imageFiles.length} image files`)
  
  // Process each entry
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  }
  
  for (const entry of entries) {
    const imagePath = findImageFile(entry.title, imageFiles)
    const result = await processEntry(entry, imagePath)
    
    if (result.success) {
      results.success++
    } else if (result.reason === 'no_image' || result.reason === 'file_not_found') {
      results.skipped++
    } else {
      results.failed++
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n📊 Summary:')
  console.log(`  ✅ Success: ${results.success}`)
  console.log(`  ❌ Failed: ${results.failed}`)
  console.log(`  ⏭️  Skipped: ${results.skipped}`)
  console.log(`  📦 Total: ${entries.length}`)
}

main().catch(console.error)

