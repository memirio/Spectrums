#!/usr/bin/env tsx
/**
 * Add Packaging Batch 1 through Pipeline 2.0
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Packaging'
const API_URL = process.env.API_URL || 'http://localhost:3000/api/sites'

const PACKAGING_ENTRIES = [
  { url: 'https://packagingoftheworld.com/2025/12/ophie-lip-oil.html', title: 'Ophie Lip Oil', imageName: 'ophie' },
  { url: 'https://packagingoftheworld.com/2025/12/vinum-snob-wine-label-design.html', title: 'Vinum Snob Wine Label', imageName: 'vinum' },
  { url: 'https://packagingoftheworld.com/2025/12/tiny-cup-society.html', title: 'Tiny Cup Society', imageName: 'tiny-cup-society' },
  { url: 'https://packagingoftheworld.com/2025/12/lacora-high-butterfat-butter-crafted-from-new-zealand-dairy.html', title: 'LACORA High Butterfat Butter', imageName: 'LACORA' },
  { url: 'https://packagingoftheworld.com/2025/12/sprezza-seltzer.html', title: 'Sprezza Seltzer', imageName: 'Sprezza' },
  { url: 'https://packagingoftheworld.com/2025/12/clementina-orange-juice.html', title: 'Clementina Orange Juice', imageName: 'Clementina' },
  { url: 'https://packagingoftheworld.com/2025/12/primos-soda.html', title: 'Primo\'s Soda', imageName: 'Primo' },
  { url: 'https://packagingoftheworld.com/2025/12/66matcha.html', title: '66matcha', imageName: '66matcha' },
  { url: 'https://packagingoftheworld.com/2025/12/aero-soda-summer-edition-packaging.html', title: 'Aero Soda', imageName: 'Aero Soda' },
  { url: 'https://it.pinterest.com/pin/2181499816541648/', title: 'Pinterest', imageName: '2181499816541648' },
  { url: 'https://www.studioplush.co/our-work/raye-beauty', title: 'Raye Beauty', imageName: 'raye' },
  { url: 'https://it.pinterest.com/pin/205054589279331915/', title: 'Pinterest', imageName: '205054589279331915' },
  { url: 'https://it.pinterest.com/pin/5348093303207558/', title: 'Pinterest', imageName: '5348093303207558' },
  { url: 'https://it.pinterest.com/pin/695172892526291152/', title: 'Pinterest', imageName: '695172892526291152' },
  { url: 'https://it.pinterest.com/pin/3729612259184152/', title: 'Pinterest', imageName: '3729612259184152' },
  { url: 'https://it.pinterest.com/pin/3729612266126344/', title: 'Pinterest', imageName: '3729612266126344' },
  { url: 'https://it.pinterest.com/pin/13159023906090029/', title: 'Pinterest', imageName: '13159023906090029' },
  { url: 'https://it.pinterest.com/pin/2392606048660891/', title: 'Pinterest', imageName: '2392606048660891' },
  { url: 'https://it.pinterest.com/pin/224617100161625628/', title: 'Pinterest', imageName: '224617100161625628' },
  { url: 'https://it.pinterest.com/pin/7318418141231932/', title: 'Pinterest', imageName: '7318418141231932' },
  { url: 'https://it.pinterest.com/pin/13440498884132998/', title: 'Pinterest', imageName: '13440498884132998' },
  { url: 'https://it.pinterest.com/pin/211174978653760/', title: 'Pinterest', imageName: '211174978653760' },
  { url: 'https://it.pinterest.com/pin/4503668372875960/', title: 'Pinterest', imageName: '4503668372875960' },
  { url: 'https://it.pinterest.com/pin/7599893117142193/', title: 'Pinterest', imageName: '7599893117142193' },
  { url: 'https://it.pinterest.com/pin/33003009764823014/', title: 'Pinterest', imageName: '33003009764823014' },
  { url: 'https://it.pinterest.com/pin/5277724558780151/', title: 'Pinterest', imageName: '5277724558780151' },
  { url: 'https://it.pinterest.com/pin/43839796370526849/', title: 'Pinterest', imageName: '43839796370526849' },
  { url: 'https://it.pinterest.com/pin/4081455906171061/', title: 'Pinterest', imageName: '4081455906171061' },
  { url: 'https://it.pinterest.com/pin/151152131238661174/', title: 'Pinterest', imageName: '151152131238661174' },
  { url: 'https://it.pinterest.com/pin/4433299627029414/', title: 'Pinterest', imageName: '4433299627029414' },
  { url: 'https://it.pinterest.com/pin/230316968440543141/', title: 'Pinterest', imageName: '230316968440543141' },
  { url: 'https://it.pinterest.com/pin/3729612264695358/', title: 'Pinterest', imageName: '3729612264695358' },
  { url: 'https://it.pinterest.com/pin/211174978653955/', title: 'Pinterest', imageName: '211174978653955' },
  { url: 'https://it.pinterest.com/pin/5277724559915710/', title: 'Pinterest', imageName: '5277724559915710' },
  { url: 'https://it.pinterest.com/pin/85427724177808208/', title: 'Pinterest', imageName: '85427724177808208' },
  { url: 'https://it.pinterest.com/pin/7599893117149076/', title: 'Pinterest', imageName: '7599893117149076' },
  { url: 'https://it.pinterest.com/pin/184647653468119321/', title: 'Pinterest', imageName: '184647653468119321' },
]

function findImageFile(entry: { url: string; title: string; imageName: string }, imageFiles: string[]): string | null {
  // For Pinterest URLs, match by pin ID (suffix of URL)
  if (entry.url.includes('pinterest.com/pin/')) {
    const pinId = entry.url.match(/pin\/(\d+)/)?.[1]
    if (pinId) {
      const matchingFile = imageFiles.find(file => file.includes(pinId))
      if (matchingFile) {
        return path.join(IMAGE_DIR, matchingFile)
      }
    }
  }
  
  // For packagingoftheworld URLs, match by URL path
  if (entry.url.includes('packagingoftheworld.com')) {
    const urlPath = entry.url.split('/').pop()?.replace('.html', '')
    if (urlPath) {
      // Try exact match first
      let matchingFile = imageFiles.find(file => 
        file.toLowerCase().includes(urlPath.toLowerCase().replace(/-/g, ''))
      )
      
      // If no match, try with the imageName
      if (!matchingFile && entry.imageName) {
        matchingFile = imageFiles.find(file => {
          const fileName = file.toLowerCase()
          const imageNameLower = entry.imageName.toLowerCase()
          return fileName.includes(imageNameLower) || fileName.includes(imageNameLower.replace(/\s+/g, ''))
        })
      }
      
      if (matchingFile) {
        return path.join(IMAGE_DIR, matchingFile)
      }
    }
  }
  
  // For other URLs, match by imageName
  if (entry.imageName) {
    const matchingFile = imageFiles.find(file => {
      const fileName = file.toLowerCase()
      const imageNameLower = entry.imageName.toLowerCase()
      
      // Check if filename contains the imageName (with or without spaces)
      if (fileName.includes(imageNameLower) || fileName.includes(imageNameLower.replace(/\s+/g, ''))) {
        return true
      }
      
      // For "raye", check for "raye" in filename
      if (imageNameLower === 'raye' && fileName.includes('raye')) {
        return true
      }
      
      return false
    })
    
    if (matchingFile) {
      return path.join(IMAGE_DIR, matchingFile)
    }
  }
  
  return null
}

async function main() {
  console.log('📦 Starting packaging batch upload...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total entries: ${PACKAGING_ENTRIES.length}\n`)

  // Get all image files
  const imageFiles = fs.readdirSync(IMAGE_DIR).filter(file => 
    file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  )
  console.log(`📸 Found ${imageFiles.length} images\n`)

  // Filter entries that have matching images
  const entriesToProcess = PACKAGING_ENTRIES.filter(entry => {
    const imagePath = findImageFile(entry, imageFiles)
    if (!imagePath) {
      console.warn(`⚠️  No matching image found for ${entry.title}`)
    }
    return !!imagePath
  })

  console.log(`📋 Found ${entriesToProcess.length} entries with matching images\n`)

  for (let i = 0; i < entriesToProcess.length; i++) {
    const entry = entriesToProcess[i]
    const imagePath = findImageFile(entry, imageFiles)

    if (!imagePath) {
      console.warn(`⚠️  Skipping ${entry.title} - no matching image`)
      continue
    }

    console.log(`[${i + 1}/${entriesToProcess.length}] [${entry.title}] Processing...`)
    console.log(`  URL: ${entry.url}`)
    console.log(`  Image: ${path.basename(imagePath)}`)

    try {
      // Step 1: Upload image to Supabase Storage
      console.log('  📤 Uploading image to storage...')
      let imageUrl: string | null = null
      try {
        imageUrl = await uploadImageToSupabaseStorage(imagePath)
      } catch (error: any) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      if (!imageUrl) {
        throw new Error('Failed to upload image: No URL returned')
      }

      console.log(`  ✅ Image uploaded: ${imageUrl}`)

      // Step 2: Submit site data to API
      const siteResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: entry.title,
          url: entry.url,
          imageUrl: imageUrl,
          category: 'packaging',
          skipConceptGeneration: true, // Use Pipeline 2.0 - no new tag creation
        }),
      })

      if (!siteResponse.ok) {
        const errorData = await siteResponse.json()
        throw new Error(`Site submission failed: ${siteResponse.status} ${JSON.stringify(errorData)}`)
      }

      const siteData = await siteResponse.json()
      console.log(`  ✅ Success! Site ID: ${siteData.id}`)

      // Add a delay to prevent overwhelming the server
      if (i < entriesToProcess.length - 1) {
        const delay = 15000 // 15 seconds
        console.log(`  ⏳ Waiting ${delay / 1000} seconds before next entry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    } catch (error: any) {
      console.error(`  ❌ Error processing ${entry.title}:`, error.message)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Processed: ${entriesToProcess.length}`)
  console.log(`❌ Failed: ${PACKAGING_ENTRIES.length - entriesToProcess.length}`)
  console.log('\n✅ Done!')
}

main().catch(async (err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})

