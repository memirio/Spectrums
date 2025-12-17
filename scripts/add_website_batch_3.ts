#!/usr/bin/env tsx
/**
 * Add Website Batch 3 through Pipeline 2.0
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

// New website entries to process
const WEBSITE_ENTRIES = [
  { url: 'https://bfcm.stripe.com/', title: 'Stripe BFCM' },
  { url: 'https://www.osmo.supply/', title: 'Osmo Supply' },
  { url: 'https://vwlab.io/pages/showcase', title: 'VW Lab Showcase' },
  { url: 'https://www.rejouice.com/', title: 'Rejouice' },
  { url: 'https://emmpo.com/', title: 'Emmpo' },
  { url: 'https://sonsanddaughters.xyz/', title: 'Sons and Daughters' },
  { url: 'https://bynikistudio.com/', title: 'By Niki Studio' },
  { url: 'https://brunoarizio.com/', title: 'Bruno Arizio' },
  { url: 'https://www.byooooob.com/', title: 'Byooooob' },
  { url: 'https://matvoyce.tv/', title: 'Mat Voyce TV' },
  { url: 'https://www.moooor.com/', title: 'Moooor' },
  { url: 'https://thefirstthelast.agency/', title: 'The First The Last Agency' },
  { url: 'https://dream-machine.lumalabs.ai/', title: 'Dream Machine - Luma Labs' },
  { url: 'https://www.sofihealth.com/', title: 'Sofi Health' },
  { url: 'https://gianlucagradogna.com/', title: 'Gianluca Gradogna' },
  { url: 'https://www.qudrix.com/', title: 'Qudrix' },
  { url: 'https://ahadi-foundation.org/en/', title: 'Ahadi Foundation' },
  { url: 'https://www.osklen.com.br/', title: 'Osklen' },
  { url: 'https://brighteststars.org/en/explore/', title: 'Brightest Stars' },
  { url: 'https://www.polecat.agency/', title: 'Polecat Agency' },
  { url: 'https://era.estate/', title: 'Era Estate' },
  { url: 'https://radga.com/', title: 'Radga' },
  { url: 'https://destigmatize.ca/', title: 'Destigmatize' },
  { url: 'https://www.thomasmonavon.com/', title: 'Thomas Monavon' },
  { url: 'https://monolith.nyc/', title: 'Monolith NYC' },
  { url: 'https://wodniack.dev/', title: 'Wodniack Dev' },
  { url: 'https://keikku.madebyburo.com/', title: 'Keikku Made by Buro' },
  { url: 'https://www.nudolsbanzai.it/', title: 'Nudols Banzai' },
  { url: 'https://ai.google/our-ai-journey/?section=intro', title: 'Google AI Journey' },
  { url: 'https://insidekristallnacht.org/', title: 'Inside Kristallnacht' },
  { url: 'https://studio-onto.com/', title: 'Studio Onto' },
  { url: 'https://www.rhythminfluence.com/', title: 'Rhythm Influence' },
  { url: 'https://www.maxandtiber.com/ch_fr/', title: 'Max and Tiber' },
  { url: 'https://sundaecreative.com/en/home', title: 'Sundae Creative' },
  { url: 'https://chapter.millanova.com/', title: 'Chapter Millanova' },
  { url: 'https://lipstylo.dolcegabbana.com/en/master/dg/online', title: 'Dolce & Gabbana Lipstylo' },
  { url: 'https://www.gentlerain.ai/', title: 'Gentle Rain AI' },
  { url: 'https://by-kin.com/', title: 'By Kin' },
  { url: 'https://travelnextlvl.de/en', title: 'Travel Next Level' },
  { url: 'https://spotstudio.es/', title: 'Spot Studio' },
  { url: 'https://shopify.sunnysideup.work/', title: 'Shopify Sunnysideup' },
  { url: 'https://vantage.ava-case.com/', title: 'Vantage AVA Case' },
  { url: 'https://davidwhyte.com/experience/', title: 'David Whyte Experience' },
  { url: 'https://christmas-2024.riven.ch/', title: 'Christmas 2024 Riven' },
  { url: 'https://www.utsubo.com/', title: 'Utsubo' },
  { url: 'https://elementis.co/', title: 'Elementis' },
  { url: 'https://www.shopify.com/editions/summer2024', title: 'Shopify Summer 2024' },
  { url: 'https://madebyanalogue.co.uk/', title: 'Made by Analogue' },
  { url: 'https://www.wix.com/studio/pantone-color-of-the-year-2025', title: 'Wix Pantone Color 2025' },
  { url: 'https://immersive-g.com/', title: 'Immersive G' },
  { url: 'https://radiance.family/', title: 'Radiance Family' },
  { url: 'https://basehabitation.com/en/', title: 'Base Habitation' },
  { url: 'https://www.leeroy.ca/', title: 'Leeroy' },
  { url: 'https://www.clearstreet.io/', title: 'Clear Street' },
  { url: 'https://mew.xyz/', title: 'Mew' },
  { url: 'https://ayocin.com/', title: 'Ayocin' },
  { url: 'https://dothingsnyc.com/', title: 'Do Things NYC' },
  { url: 'https://bruut.media/', title: 'Bruut Media' },
  { url: 'https://labs.chaingpt.org/', title: 'ChainGPT Labs' },
  { url: 'https://60.belangersalach.ca/', title: 'Belanger Salach 60' },
  { url: 'https://thibaud.film/', title: 'Thibaud Film' },
  { url: 'https://beat.noomoagency.com/', title: 'Beat Noomo Agency' },
  { url: 'https://www.isabelmoranta.com/', title: 'Isabel Moranta' },
  { url: 'https://lifeworld.wetransfer.com/', title: 'Life World WeTransfer' },
  { url: 'https://social-impact-capital.com/', title: 'Social Impact Capital' },
  { url: 'https://shop.abbathemuseum.com/', title: 'Abba The Museum Shop' },
  { url: 'https://www.akercompanies.com/', title: 'Aker Companies' },
  { url: 'https://www.davidebaratta.com/', title: 'Davide Baratta' },
  { url: 'https://ai-in-banking-ux-design.videinfra.com/', title: 'AI in Banking UX Design' },
  { url: 'https://alectear.com/', title: 'Alectear' },
  { url: 'https://www.teletech.events/', title: 'Teletech Events' },
  { url: 'https://amaterasu.ai/', title: 'Amaterasu AI' },
  { url: 'https://www.otherlife.xyz/', title: 'Other Life' },
  { url: 'https://vazzi.fun/', title: 'Vazzi Fun' },
  { url: 'https://saisei-sbj.webflow.io/', title: 'Saisei SBJ' },
  { url: 'https://www.houseofdreamers.fr/fr', title: 'House of Dreamers' },
  { url: 'https://loveandmoney.com/work', title: 'Love and Money' },
  { url: 'https://www.rspca.org.uk/webContent/animalfutures/?utm_source=Unseen&utm_medium=Referral&utm_campaign=AnimalFutures&utm_content=Game', title: 'RSPCA Animal Futures' },
  { url: 'https://thelinestudio.com/', title: 'The Line Studio' },
  { url: 'https://www.hatom.com/', title: 'Hatom' },
  { url: 'https://www.duten.com/en/', title: 'Duten' },
  { url: 'https://gelatolaboca.com/', title: 'Gelato La Boca' },
  { url: 'https://www.oakame.com/en/', title: 'Oakame' },
  { url: 'https://montopnetflix.fr/', title: 'Montop Netflix' },
  { url: 'https://gregorylalle.com/', title: 'Gregory Lalle' },
  { url: 'https://dorstenlesser.com/', title: 'Dorsten Lesser' },
  { url: 'https://p448.com/', title: 'P448' },
  { url: 'https://www.sonder-mr.com/', title: 'Sonder MR' },
  { url: 'https://www.cosmos.studio/', title: 'Cosmos Studio' },
  { url: 'https://kriss.ai/', title: 'Kriss AI' },
  { url: 'https://cocotastudio.com/', title: 'Cocota Studio' },
  { url: 'https://funkhaus.io/en', title: 'Funkhaus' },
  { url: 'https://guillaumecolombel.fr/', title: 'Guillaume Colombel' },
  { url: 'https://broedutrecht.nl/', title: 'Broed Utrecht' },
  { url: 'https://sites.research.google/languages/', title: 'Google Research Languages' },
  { url: 'https://www.vivalalabia.com/', title: 'Viva La Labia' },
  { url: 'https://orkenworld.com/', title: 'Orken World' },
  { url: 'https://nodcoding.com/', title: 'Nod Coding' },
  { url: 'https://htarchitecte.com/en/', title: 'HT Architecte' },
  { url: 'https://harryjatkins.com/', title: 'Harry J Atkins' },
  { url: 'https://www.hartmanncapital.com/', title: 'Hartmann Capital' },
  { url: 'https://www.umault.com/', title: 'Umault' },
  { url: 'https://reown.com/', title: 'Reown' },
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
 * Process a single website entry with retry logic
 */
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
  console.log('🚀 Starting website batch 3 upload through Pipeline 2.0...\n')
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
    console.log(`\n[${entry.title}] Processing...`)
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

