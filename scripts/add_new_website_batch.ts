#!/usr/bin/env tsx
/**
 * Add New Website Batch through Pipeline 2.0
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
  { url: 'https://www.aramco.com/en/about-us/our-history/the-birth-of-oil', title: 'Aramco - The Birth of Oil' },
  { url: 'https://inkwell.tech/', title: 'Inkwell Tech' },
  { url: 'https://eis-lab.de/en-us', title: 'EIS Lab' },
  { url: 'https://clementgrellier.fr/', title: 'Clément Grellier' },
  { url: 'https://mfisher.com/', title: 'M Fisher' },
  { url: 'https://blueyard.com/', title: 'BlueYard' },
  { url: 'https://www.primeasialeather.com/', title: 'Prime Asia Leather' },
  { url: 'https://www.vvisual.biz/', title: 'V Visual' },
  { url: 'https://capsules.moyra.co/', title: 'Moyra Capsules' },
  { url: 'https://foulards3d.globaltech.gucci/', title: 'Gucci Foulards 3D' },
  { url: 'https://design.cash.app/idents', title: 'Cash App Design - Idents' },
  { url: 'https://www.menuxl.fr/', title: 'Menu XL' },
  { url: 'https://quadplex80.com/', title: 'Quadplex 80' },
  { url: 'https://kodeimmersive.com/', title: 'Kode Immersive' },
  { url: 'https://aurelienvigne.com/', title: 'Aurélien Vigne' },
  { url: 'https://tobacco.nl/en/', title: 'Tobacco' },
  { url: 'https://valentime.noomoagency.com/', title: 'Valentime' },
  { url: 'https://www.nohero.studio/', title: 'No Hero Studio' },
  { url: 'https://thesmile.tv/', title: 'The Smile TV' },
  { url: 'https://bloomparis.tv/', title: 'Bloom Paris TV' },
  { url: 'https://animejs.com/', title: 'Anime.js' },
  { url: 'https://duchateau.com/', title: 'Du Chateau' },
  { url: 'https://whoisguilty.com/', title: 'Who Is Guilty' },
  { url: 'https://jitter.video/', title: 'Jitter Video' },
  { url: 'https://www.madebynull.com/', title: 'Made by Null' },
  { url: 'https://quechua-lookbook.com/ss25/', title: 'Quechua Lookbook SS25' },
  { url: 'https://icggallery.irisceramicagroup.com/en', title: 'ICG Gallery' },
  { url: 'https://truekindskincare.com/', title: 'True Kind Skincare' },
  { url: 'https://www.oharchitecture.com.au/', title: 'OH Architecture' },
  { url: 'https://www.kultiveret.com/', title: 'Kultiveret' },
  { url: 'https://www.andreadiego.es/', title: 'Andrea Diego' },
  { url: 'https://basement.studio/', title: 'Basement Studio' },
  { url: 'https://www.nite-riot.com/', title: 'Nite Riot' },
  { url: 'https://elimar.lmigroupintl.com/', title: 'Elimar' },
  { url: 'https://www.nationalgeographic.com/into-the-amazon/', title: 'National Geographic - Into the Amazon' },
  { url: 'https://www.graphichunters.com/', title: 'Graphic Hunters' },
  { url: 'https://goosebumps.epic.net/', title: 'Goosebumps Epic' },
  { url: 'https://goodisthenewcool.com/', title: 'Good is the New Cool' },
  { url: 'https://dgrees.studio/', title: 'Dgrees Studio' },
  { url: 'https://nvg8.io/', title: 'NVG8' },
  { url: 'https://sui.io/overflow#overview', title: 'Sui Overflow' },
  { url: 'https://247artists.com/', title: '247 Artists' },
  { url: 'https://giannantoniodemalde.com/', title: 'Giannantonio De Malde' },
  { url: 'https://21tsi.com/', title: '21 TSI' },
  { url: 'https://nlc.obys.agency/', title: 'NLC Obys Agency' },
  { url: 'https://marioroudil.com/', title: 'Mario Roudil' },
  { url: 'https://artpill.studio/', title: 'Artpill Studio' },
  { url: 'https://www.composites.archi/', title: 'Composites Archi' },
  { url: 'https://www.rayraylab.com/', title: 'Ray Ray Lab' },
  { url: 'https://www.altermind.studio/', title: 'Altermind Studio' },
  { url: 'https://www.ariostea.it/en', title: 'Ariostea' },
  { url: 'https://cydstumpel.nl/', title: 'Cyd Stumpel' },
  { url: 'https://www.theastralfrontier.com/', title: 'The Astral Frontier' },
  { url: 'https://in-cognita-corp.com/fr', title: 'In Cognita Corp' },
  { url: 'https://spellverse.taprootwizards.com/', title: 'Spellverse Taproot Wizards' },
  { url: 'https://warhol-arts.webflow.io/', title: 'Warhol Arts' },
  { url: 'https://www.spylt.com/', title: 'Spylt' },
  { url: 'https://www.oddcommon.com/', title: 'Odd Common' },
  { url: 'https://horizonte-village.com/', title: 'Horizonte Village' },
  { url: 'https://www.j-vers.com/', title: 'J Vers' },
  { url: 'https://siena.film/', title: 'Siena Film' },
  { url: 'https://yourbana.com/', title: 'Your Bana' },
  { url: 'https://thebluedesert.com/', title: 'The Blue Desert' },
  { url: 'https://seasoned.koto.studio/', title: 'Seasoned Koto Studio' },
  { url: 'https://atolldigital.com/', title: 'Atoll Digital' },
  { url: 'https://www.bleibtgleich.com/', title: 'Bleibt Gleich' },
  { url: 'https://boyd.ae/', title: 'Boyd' },
  { url: 'https://www.leandra-isler.ch/en', title: 'Leandra Isler' },
  { url: 'https://www.burocratik.com/', title: 'Burocratik' },
  { url: 'https://telepathicinstruments.com/', title: 'Telepathic Instruments' },
  { url: 'https://www.ginivini.com/en', title: 'Gini Vini' },
  { url: 'https://45r.jp/ja/45denim-karuta/', title: '45r Denim Karuta' },
  { url: 'https://www.itsmarga.me/', title: 'Its Marga' },
  { url: 'https://madewithgsap.com/', title: 'Made with GSAP' },
  { url: 'https://www.thefoundation.house/', title: 'The Foundation House' },
  { url: 'https://exat.hottype.co/', title: 'Exat Hottype' },
  { url: 'https://www.triplettapizza.com/', title: 'Tripletta Pizza' },
  { url: 'https://mcalpinehouse.com/', title: 'McAlpine House' },
  { url: 'https://www.alnf.org/', title: 'ALNF' },
  { url: 'https://www.markclennon.com/', title: 'Mark Clennon' },
  { url: 'https://www.iheartcomix.com/', title: 'I Heart Comix' },
  { url: 'https://directedbywes.com/', title: 'Directed by Wes' },
  { url: 'https://fiddle.digital/', title: 'Fiddle Digital' },
  { url: 'https://www.saapro.ae/', title: 'SAAPRO' },
  { url: 'https://fancy.design/', title: 'Fancy Design' },
  { url: 'https://pinball.cosmicshelter.com/', title: 'Pinball Cosmic Shelter' },
  { url: 'https://www.animusstudios.com/', title: 'Animus Studios' },
  { url: 'https://www.icebergdoc.org/', title: 'Iceberg Doc' },
  { url: 'https://henriheymans.com/', title: 'Henri Heymans' },
  { url: 'https://365ayearof.cartier.com/en/', title: '365 A Year of Cartier' },
  { url: 'https://arago.wawww.studio/', title: 'Arago Wawww Studio' },
  { url: 'https://www.msport-raptor.com/', title: 'M Sport Raptor' },
  { url: 'https://crazycreative.design/', title: 'Crazy Creative Design' },
  { url: 'https://cielrose.tv/', title: 'Ciel Rose TV' },
  { url: 'https://photoyoshi.com/', title: 'Photo Yoshi' },
  { url: 'https://www.ottografie.nl/', title: 'Ottografie' },
  { url: 'https://www.noovolife.com/', title: 'Noovo Life' },
  { url: 'https://www.zypsy.com/', title: 'Zypsy' },
  { url: 'https://membersexperience-create.lacoste.com/gb/en/', title: 'Lacoste Members Experience' },
  { url: 'https://www.stabondar.com/', title: 'Stabondar' },
  { url: 'https://www.3200kelvin.com/', title: '3200 Kelvin' },
  { url: 'https://brand.dropbox.com/', title: 'Dropbox Brand' },
  { url: 'https://lilfrogeth.com/', title: 'Lil Frogeth' },
  { url: 'https://gufram.it/en/', title: 'Gufram' },
  { url: 'https://www.wheregiantsroam.co.uk/', title: 'Where Giants Roam' },
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
  console.log('🚀 Starting new website batch upload through Pipeline 2.0...\n')
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

