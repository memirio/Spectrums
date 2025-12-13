#!/usr/bin/env tsx
/**
 * Add Graphic Items from Pinterest (Pipeline 2.0)
 * 
 * Bulk uploads graphic design images from Pinterest URLs using Pipeline 2.0.
 * Pipeline 2.0: Tags with existing concepts only (no new concept generation).
 * Images should be in /Users/victor/Downloads/FireShot/Graphic/
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import { canonicalizeImage } from '../src/lib/embeddings'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

interface GraphicItem {
  title: string
  url: string
  imageFile: string
}

// Map Pinterest URLs to image filenames
const GRAPHIC_ITEMS: GraphicItem[] = [
  { title: 'Angel Numbers Intuition 111', url: 'https://it.pinterest.com/pin/7740630605712907/', imageFile: 'https-:it.pinterest.com:pin:7740630605712907.jpg' },
  { title: 'Logo For Reiki', url: 'https://it.pinterest.com/pin/422281209244440/', imageFile: 'https-:it.pinterest.com:pin:422281209244440.jpg' },
  { title: 'Let Your Soul Glow', url: 'https://it.pinterest.com/pin/3870349674692045/', imageFile: 'https-:it.pinterest.com:pin:3870349674692045.jpg' },
  { title: 'Spiritual Aura Aesthetic', url: 'https://it.pinterest.com/pin/119838040083465745/', imageFile: 'https-:it.pinterest.com:pin:119838040083465745.jpg' },
  { title: 'Aura Quotes', url: 'https://it.pinterest.com/pin/308496643246412559/', imageFile: 'https-:it.pinterest.com:pin:308496643246412559.jpg' },
  { title: 'Typography Poster Focus', url: 'https://it.pinterest.com/pin/914862421525338/', imageFile: 'https-:it.pinterest.com:pin:914862421525338.jpg' },
  { title: 'Graphic Design Trends 2024', url: 'https://it.pinterest.com/pin/492649951845651/', imageFile: 'https-:it.pinterest.com:pin:492649951845651.jpg' },
  { title: 'Energy Graphic Design', url: 'https://it.pinterest.com/pin/78813062221066372/', imageFile: 'https-:it.pinterest.com:pin:78813062221066372.jpg' },
  { title: 'Contemporary Space Design', url: 'https://it.pinterest.com/pin/68748306468/', imageFile: 'https-:it.pinterest.com:pin:68748306468.jpg' },
  { title: 'Envision Logo Design', url: 'https://it.pinterest.com/pin/914862418773480/', imageFile: 'https-:it.pinterest.com:pin:914862418773480.jpg' },
  { title: 'Round Poster', url: 'https://it.pinterest.com/pin/351912466893888/', imageFile: 'https-:it.pinterest.com:pin:351912466893888.jpg' },
  { title: 'Intuition First', url: 'https://it.pinterest.com/pin/844493664758723/', imageFile: 'https-:it.pinterest.com:pin:844493664758723.jpg' },
  { title: 'Houdini Gradient Node', url: 'https://it.pinterest.com/pin/5207355814532858/', imageFile: 'https-:it.pinterest.com:pin:5207355814532858.jpg' },
  { title: 'Gradient Square Design', url: 'https://it.pinterest.com/pin/11751649023184386/', imageFile: 'https-:it.pinterest.com:pin:11751649023184386.jpg' },
  { title: 'Trust Your Intuition', url: 'https://it.pinterest.com/pin/108227197290753301/', imageFile: 'https-:it.pinterest.com:pin:108227197290753301.jpg' },
  { title: 'Planets Graphic Design', url: 'https://it.pinterest.com/pin/467670742533909813/', imageFile: 'https-:it.pinterest.com:pin:467670742533909813.jpg' },
  { title: 'Graphic Design Balance', url: 'https://it.pinterest.com/pin/236790892903817729/', imageFile: 'https-:it.pinterest.com:pin:236790892903817729.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/44754590041621276/', imageFile: 'https-:it.pinterest.com:pin:44754590041621276.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/9640586698006858/', imageFile: 'https-:it.pinterest.com:pin:9640586698006858.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1900024839411964/', imageFile: 'https-:it.pinterest.com:pin:1900024839411964.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/3870349674978921/', imageFile: 'https-:it.pinterest.com:pin:3870349674978921.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/8303580559127749/', imageFile: 'https-:it.pinterest.com:pin:8303580559127749.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/360710251425566447/', imageFile: 'https-:it.pinterest.com:pin:360710251425566447.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1829656095054258/', imageFile: 'https-:it.pinterest.com:pin:1829656095054258.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/19984792093042285/', imageFile: 'https-:it.pinterest.com:pin:19984792093042285.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/9992430418487889/', imageFile: 'https-:it.pinterest.com:pin:9992430418487889.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/4855512089766205/', imageFile: 'https-:it.pinterest.com:pin:4855512089766205.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/5277724559898471/', imageFile: 'https-:it.pinterest.com:pin:5277724559898471.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/2744449769543733/', imageFile: 'https-:it.pinterest.com:pin:2744449769543733.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/14214555069348648/', imageFile: 'https-:it.pinterest.com:pin:14214555069348648.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/8092474326152906/', imageFile: 'https-:it.pinterest.com:pin:8092474326152906.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/4644405860091957/', imageFile: 'https-:it.pinterest.com:pin:4644405860091957.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1196337404350230/', imageFile: 'https-:it.pinterest.com:pin:1196337404350230.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/3166662231798345/', imageFile: 'https-:it.pinterest.com:pin:3166662231798345.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/914862421519045/', imageFile: 'https-:it.pinterest.com:pin:914862421519045.jpg' },
  { title: 'Graphic Design', url: 'http://it.pinterest.com/pin/8444318045501612/', imageFile: 'http-:it.pinterest.com:pin:8444318045501612.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1337074888726434/', imageFile: 'https-:it.pinterest.com:pin:1337074888726434.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/2814818511630038/', imageFile: 'https-:it.pinterest.com:pin:2814818511630038.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/55450639162981836/', imageFile: 'https-:it.pinterest.com:pin:55450639162981836.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/2392606048301357/', imageFile: 'https-:it.pinterest.com:pin:2392606048301357.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/2814818511630620/', imageFile: 'https-:it.pinterest.com:pin:2814818511630620.jpg' },
  { title: 'Graphic Design', url: 'http://it.pinterest.com/pin/5066618330241748/', imageFile: 'http-:it.pinterest.com:pin:5066618330241748.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/9148005521169446/', imageFile: 'https-:it.pinterest.com:pin:9148005521169446.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/281543726114463/', imageFile: 'https-:it.pinterest.com:pin:281543726114463.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/49539664642640427/', imageFile: 'https-:it.pinterest.com:pin:49539664642640427.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1196337400869917/', imageFile: 'https-:it.pinterest.com:pin:1196337400869917.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/211174978199015/', imageFile: 'https-:it.pinterest.com:pin:211174978199015.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1900024839265262/', imageFile: 'https-:it.pinterest.com:pin:1900024839265262.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/211174977511145/', imageFile: 'https-:it.pinterest.com:pin:211174977511145.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/4785143351493294/', imageFile: 'https-:it.pinterest.com:pin:4785143351493294.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/23432860625454920/', imageFile: 'https-:it.pinterest.com:pin:23432860625454920.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/4081455906888691/', imageFile: 'https-:it.pinterest.com:pin:4081455906888691.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/492649952031346/', imageFile: 'https-:it.pinterest.com:pin:492649952031346.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1900024838289859/', imageFile: 'https-:it.pinterest.com:pin:1900024838289859.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/150659550027616293/', imageFile: 'https-:it.pinterest.com:pin:150659550027616293.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/6122149485005093/', imageFile: 'https-:it.pinterest.com:pin:6122149485005093.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1900024839265265/', imageFile: 'https-:it.pinterest.com:pin:1900024839265265.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/62628251062475050/', imageFile: 'https-:it.pinterest.com:pin:62628251062475050.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/885238870522109723/', imageFile: 'https-:it.pinterest.com:pin:885238870522109723.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/4996249583446573/', imageFile: 'https-:it.pinterest.com:pin:4996249583446573.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/204773114303995855/', imageFile: 'https-:it.pinterest.com:pin:204773114303995855.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/1013169247425466776/', imageFile: 'https-:it.pinterest.com:pin:1013169247425466776.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/12455336470666462/', imageFile: 'https-:it.pinterest.com:pin:12455336470666462.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/300685712644000729/', imageFile: 'https-:it.pinterest.com:pin:300685712644000729.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/45950858693902807/', imageFile: 'https-:it.pinterest.com:pin:45950858693902807.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/8303580558403559/', imageFile: 'https-:it.pinterest.com:pin:8303580558403559.jpg' },
  { title: 'Graphic Design', url: 'https://it.pinterest.com/pin/865746728378760733/', imageFile: 'https-:it.pinterest.com:pin:865746728378760733.jpg' },
]

const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Graphic'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function processEntry(entry: GraphicItem, imagePath: string | null) {
  try {
    console.log(`\n📸 Processing: ${entry.title}`)
    console.log(`   URL: ${entry.url}`)
    
    if (!imagePath || !fs.existsSync(imagePath)) {
      console.log(`   ⚠️  Image not found: ${entry.imageFile}`)
      return { success: false, error: 'Image not found' }
    }
    
    // Read and process image
    const buf = fs.readFileSync(imagePath)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length
    
    console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
    
    // Canonicalize to get contentHash
    const { hash: contentHash } = await canonicalizeImage(buf)
    console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
    
    // Upload to Supabase Storage
    console.log(`   ☁️  Uploading to Supabase Storage...`)
    const imageUrl = await uploadImageToSupabaseStorage(imagePath, contentHash)
    console.log(`   ✅ Uploaded: ${imageUrl}`)
    
    // Call Pipeline 2.0 API endpoint
    console.log(`   🚀 Calling Pipeline 2.0 API...`)
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: entry.title,
        url: entry.url,
        imageUrl: imageUrl,
        category: 'graphic',
        skipConceptGeneration: true, // Pipeline 2.0: Use existing concepts only
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`   ❌ API error (${response.status}): ${errorText}`)
      return { success: false, error: `API error: ${response.status}` }
    }
    
    const result = await response.json()
    console.log(`   ✅ Successfully processed via Pipeline 2.0`)
    console.log(`   🏷️  Site ID: ${result.site?.id || 'N/A'}`)
    console.log(`   🖼️  Image ID: ${result.image?.id || 'N/A'}`)
    
    return { success: true, result }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('🚀 Starting graphic import (Pipeline 2.0)...\n')
  console.log(`📁 Image directory: ${IMAGE_DIR}`)
  console.log(`🌐 API URL: ${API_URL}`)
  console.log(`📊 Total items: ${GRAPHIC_ITEMS.length}\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const entry of GRAPHIC_ITEMS) {
    const imagePath = path.join(IMAGE_DIR, entry.imageFile)
    const result = await processEntry(entry, imagePath)
    
    if (result.success) {
      successCount++
    } else {
      errorCount++
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n\n📊 Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📦 Total: ${GRAPHIC_ITEMS.length}`)
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('\n✅ Done')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error)
      process.exit(1)
    })
}

export { processEntry }

