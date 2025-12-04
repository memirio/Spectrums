import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'
const IMAGES_DIR = '/Users/victor/Downloads/FireShot/Packaging'

// List of entries with titles and URLs
const entries = [
  { title: 'MOMEN Sandwich', url: 'https://packagingoftheworld.com/2015/04/momen-sandwich.html' },
  { title: 'SACHETTE', url: 'https://packagingoftheworld.com/2015/03/sachette.html' },
  { title: "Don't You Weep!", url: 'https://packagingoftheworld.com/2015/03/dont-you-weep-tissues-student-project.html' },
  { title: '29 février', url: 'https://packagingoftheworld.com/2015/03/29-fevrier-maple-syrup.html' },
  { title: 'SUCRÉ Macarons', url: 'https://packagingoftheworld.com/2015/03/sucre-macarons.html' },
  { title: "Murphy's Farm Market", url: 'https://packagingoftheworld.com/2015/03/murphys-farm-market-pie-boxes.html' },
  { title: 'Nomad Tea Co.', url: 'https://packagingoftheworld.com/2015/03/nomad-tea-co.html' },
  { title: 'Nexavar', url: 'https://packagingoftheworld.com/2015/03/nexavar-creative-packaging-paper-towels.html' },
  { title: 'Sabadì', url: 'https://packagingoftheworld.com/2015/03/sabadi-i-torroni.html' },
  { title: 'VERVE', url: 'https://packagingoftheworld.com/2015/03/verve-juices.html' },
  { title: 'MailChimp', url: 'https://packagingoftheworld.com/2015/03/mailchimp-x-playing-cards.html' },
  { title: 'Corinne', url: 'https://packagingoftheworld.com/2015/03/corinne-cosmetics.html' },
  { title: '3922', url: 'https://packagingoftheworld.com/2015/03/3922.html' },
  { title: 'Typographic Chocolate', url: 'https://packagingoftheworld.com/2015/03/typographic-chocolate-student-project.html' },
  { title: 'The Muzzles', url: 'https://packagingoftheworld.com/2015/03/the-muzzles-creative-stationary-goods.html' },
  { title: 'Shinsegae', url: 'https://packagingoftheworld.com/2015/03/shinsegae-traditional-liquor.html' },
  { title: 'Creativity Stationary', url: 'https://packagingoftheworld.com/2015/02/creativity-stationary-concept.html' },
  { title: 'Moody Skincare', url: 'https://packagingoftheworld.com/2025/12/moody-skincare-moisturiser-range-3d-visualization.html' },
  { title: 'Salt!', url: 'https://packagingoftheworld.com/2025/12/burgopak-design-packaging-for-salt-supplements.html' },
  { title: 'INCARDONA', url: 'https://packagingoftheworld.com/2025/12/incardona-dolcezze-di-sicilia.html' },
  { title: 'SunFruit', url: 'https://packagingoftheworld.com/2025/12/sunfruit.html' },
  { title: 'Practice', url: 'https://packagingoftheworld.com/2025/12/practice.html' },
  { title: 'Bubble Society', url: 'https://packagingoftheworld.com/2025/12/bubble-society.html' },
  { title: 'Good Lứt', url: 'https://packagingoftheworld.com/2025/12/good-lut-all-day-every-day.html' },
  { title: 'WILDFLOW', url: 'https://packagingoftheworld.com/2025/12/wildflow-wildflower-seeds.html' },
  { title: 'Bubble Society 2', url: 'https://packagingoftheworld.com/2025/12/bubble-society-2.html' },
  { title: 'Northern Orchard', url: 'https://packagingoftheworld.com/2025/12/northern-orchard-sauces-and-dips.html' },
  { title: 'ASKYR Skincare', url: 'https://packagingoftheworld.com/2015/02/askyr-skincare-product-student-project.html' },
  { title: 'DELIZET', url: 'https://packagingoftheworld.com/2015/02/delizet-chocolat-fact.html' },
  { title: 'Tadiran', url: 'https://packagingoftheworld.com/2015/02/tadiran-lighting.html' },
  { title: 'Niktea', url: 'https://packagingoftheworld.com/2015/02/niktea.html' },
  { title: 'La-Di-Da-Di', url: 'https://packagingoftheworld.com/2015/02/la-di-da-di-favor-bag.html' },
  { title: 'Aromatologic', url: 'https://packagingoftheworld.com/2015/02/aromatologic-oil-perfumes.html' },
  { title: 'MOIRAI', url: 'https://packagingoftheworld.com/2015/02/moirai-gourmet-selection.html' },
  { title: 'Rare Barrel', url: 'https://packagingoftheworld.com/2015/02/rare-barrel-sour-beer-co.html' },
  { title: 'Lugard', url: 'https://packagingoftheworld.com/2015/02/lugard.html' },
  { title: 'à la eco', url: 'https://packagingoftheworld.com/2015/02/a-la-eco-organic-cotton.html' },
  { title: 'Bora Bora', url: 'https://packagingoftheworld.com/2015/02/bora-bora-by-your-side.html' },
  { title: 'Cau Tre Oolong', url: 'https://packagingoftheworld.com/2015/02/cau-tre-oolong-tea.html' },
  { title: "Bernadett Baji's", url: 'https://packagingoftheworld.com/2015/02/bernadett-bajis-wine.html#' },
  { title: 'Zupagrafika', url: 'https://packagingoftheworld.com/2015/02/brutal-london-by-zupagrafika.html' },
  { title: 'Bloom Boom', url: 'https://packagingoftheworld.com/2015/01/bloom-boom-liquid-fertilizer.html' },
  { title: 'Slow Food', url: 'https://packagingoftheworld.com/2015/01/slow-food.html' },
  { title: 'Origens Chocolate', url: 'https://packagingoftheworld.com/2015/01/origens-chocolate.html' },
  { title: 'Le chocolat des Français', url: 'https://packagingoftheworld.com/2015/01/le-chocolat-des-francais.html' },
  { title: 'Gavio Gazz', url: 'https://packagingoftheworld.com/2015/01/gavio-gazz.html' },
  { title: 'Hlebzavod28', url: 'https://packagingoftheworld.com/2015/01/hlebzavod28.html' },
  { title: 'Tea Tales', url: 'https://packagingoftheworld.com/2015/01/tea-tales-childrens-herbal-tea.html' },
  { title: 'Butter Avenue', url: 'https://packagingoftheworld.com/2015/02/butter-avenue-patisserie-cafe.html' },
  { title: 'Artesanos La Vista', url: 'https://packagingoftheworld.com/2015/02/artesanos-la-vista.html' },
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

