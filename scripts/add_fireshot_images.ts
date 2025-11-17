#!/usr/bin/env tsx
/**
 * Add FireShot screenshots to sites
 * 
 * Maps URLs to FireShot screenshot files and uploads them to MinIO,
 * creating Image records with embeddings and tags.
 * 
 * Usage:
 *   npx tsx scripts/add_fireshot_images.ts
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToMinIO } from './upload_to_minio'
import { tagImage } from '../src/jobs/tagging'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'

// Map URLs to screenshot filenames (from the batch add script)
const urlToScreenshot: Record<string, string> = {
  'https://dontboardme.com': 'FireShot Capture 149 - Main - [dontboardme.com].png',
  'https://en.manayerbamate.com': 'FireShot Capture 151 - MANA yerba mate - Energizing infusion - Made in Quebec - MANA yerba_ - [en.manayerbamate.com].png',
  'https://opalcamera.com/opal-tadpole': 'FireShot Capture 150 - Opal Tadpole — The first portable webcam - [opalcamera.com].png',
  'https://kprverse.com': 'FireShot Capture 152 - KPR - Story - [kprverse.com].png',
  'https://persepolis.getty.edu': 'FireShot Capture 153 - Persepolis Reimagined - [persepolis.getty.edu].png',
  'https://www.chungiyoo.com': 'FireShot Capture 154 - ChungiYoo - Home - [www.chungiyoo.com].png',
  'https://www.kodeclubs.com': 'FireShot Capture 155 - Kode Sports Club - Home - [www.kodeclubs.com].png',
  'https://synchronized.studio': 'FireShot Capture 156 - Synchronized - Digital Creative Studio - [synchronized.studio].png',
  'https://2019.makemepulse.com': 'FireShot Capture 157 - Nomadic Tribe — makemepulse - [2019.makemepulse.com].png',
  'https://www.orano.group/experience/innovation/en/slider': 'FireShot Capture 175 - Orano - [www.orano.group].png',
  'https://activetheory.net': 'FireShot Capture 160 - Active Theory · Creative Digital Experiences - [activetheory.net].png',
  'https://insidethehead.co/chapters': 'FireShot Capture 161 - Inside the head - [insidethehead.co].png',
  'https://mendo.nl': 'FireShot Capture 162 - MENDO - [mendo.nl].png',
  'https://paperplanes.world': 'FireShot Capture 163 - Paper Planes - [paperplanes.world].png',
  'https://www.kikk.be/2016': 'FireShot Capture 164 - Page not found - Kikk Festival - [www.kikk.be].png',
  'http://falter.wild.plus/#en': 'FireShot Capture 166 - Falter Inferno - [falter.wild.plus].png',
  'http://www.because-recollection.com/metronomy': 'FireShot Capture 167 - Because Recollection. - [www.because-recollection.com].png',
  'http://species-in-pieces.com': 'FireShot Capture 168 - In Pieces - 30 Endangered Species, 30 Pieces. - [species-in-pieces.com].png',
  'http://nixon.com': 'FireShot Capture 169 - Nixon EU - Watches for Men & Women - Team-Designed, Custom-Built_ - [se.nixon.com].png',
  'https://www.aquest.it': 'FireShot Capture 170 - Digital Innovation & Creative Experience Agency - AQuest - [www.aquest.it].png',
  'https://24hoursofhappy.com': 'FireShot Capture 171 - Pharrell Williams - Happy - [24hoursofhappy.com].png',
  'https://blacknegative.com/#!/whoweare': 'FireShot Capture 172 - blacknegative - [blacknegative.com].png',
  'https://franshalsmuseum.nl/en': 'FireShot Capture 173 - Home - [franshalsmuseum.nl].png',
}

async function processScreenshot(url: string, screenshotFile: string) {
  let buf: Buffer | null = null
  let canonicalPng: Buffer | null = null
  let rawRgba: Buffer | null = null
  
  try {
    const normalizedUrl = url.trim().replace(/\/$/, '')
    const screenshotPath = path.join(FIRESHOT_DIR, screenshotFile)
    
    console.log(`\n📸 Processing: ${normalizedUrl}`)
    console.log(`   Screenshot: ${screenshotFile}`)
    
    // Check if file exists
    if (!fs.existsSync(screenshotPath)) {
      console.log(`   ⚠️  Screenshot file not found, skipping`)
      return { success: false, error: 'File not found' }
    }
    
    // Find site (try multiple URL variations)
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: normalizedUrl },
          { url: normalizedUrl + '/' },
          { url: url.trim() },
          { url: url.trim().replace(/\/$/, '') },
        ],
      },
      include: { images: true },
    })
    
    if (!site) {
      console.log(`   ⚠️  Site not found in database, skipping`)
      return { success: false, error: 'Site not found' }
    }
    
    console.log(`   ✅ Found site: ${site.title} (${site.id})`)
    
    // Read image file - release immediately after processing
    buf = fs.readFileSync(screenshotPath)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length
    
    console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024 / 1024).toFixed(2)} MB)`)
    
    // Canonicalize to get contentHash - this creates a new buffer
    const canonicalResult = await canonicalizeImage(buf)
    const contentHash = canonicalResult.hash
    canonicalPng = canonicalResult.png
    console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
    
    // Release original buffer early - we have canonical PNG now
    buf = null!
    if (global.gc) global.gc()
    
    // Upload to MinIO (uses file path, not buffer)
    console.log(`   ☁️  Uploading to MinIO...`)
    const imageUrl = await uploadImageToMinIO(screenshotPath, contentHash)
    console.log(`   ✅ Uploaded: ${imageUrl}`)
    
    // Create or update Image record
    const image = await (prisma.image as any).upsert({
      where: { siteId_url: { siteId: site.id, url: imageUrl } },
      update: {
        width,
        height,
        bytes,
      },
      create: {
        siteId: site.id,
        url: imageUrl,
        width,
        height,
        bytes,
      },
    })
    
    console.log(`   ✅ Image record: ${image.id}`)
    
    // Check if embedding already exists by contentHash
    const existing = await prisma.imageEmbedding.findFirst({
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[]
    if (existing) {
      // Reuse existing embedding
      ivec = existing.vector as unknown as number[]
      console.log(`   ♻️  Reusing existing embedding`)
      await prisma.imageEmbedding.upsert({
        where: { imageId: image.id } as any,
        update: { contentHash: contentHash } as any,
        create: {
          imageId: image.id,
          model: existing.model,
          vector: existing.vector as any,
          contentHash: contentHash
        } as any,
      })
    } else {
      // Compute new embedding - this will create more buffers internally
      console.log(`   🤖 Computing embedding...`)
      // Use canonical PNG buffer if available, otherwise read file again
      const embeddingBuf = canonicalPng || fs.readFileSync(screenshotPath)
      const result = await embedImageFromBuffer(embeddingBuf)
      ivec = result.vector
      await prisma.imageEmbedding.upsert({
        where: { imageId: image.id } as any,
        update: {
          vector: ivec as any,
          model: 'clip-ViT-L/14',
          contentHash: contentHash
        } as any,
        create: {
          imageId: image.id,
          vector: ivec as any,
          model: 'clip-ViT-L/14',
          contentHash: contentHash
        } as any,
      })
      console.log(`   ✅ Embedding computed (dim: ${ivec.length})`)
    }
    
    // Release canonical PNG buffer
    canonicalPng = null!
    
    // Force garbage collection after embedding
    if (global.gc) global.gc()
    
    // Skip tagging for now - it's very memory intensive and re-fetches the image
    // Tagging can be done separately in a batch process if needed
    console.log(`   ⏭️  Skipping tagging (memory optimization - can be done separately)`)
    
    // Optional: Tag the image only if explicitly requested via env var
    if (process.env.ENABLE_TAGGING === 'true') {
      try {
        console.log(`   🏷️  Tagging image...`)
        await tagImage(image.id)
        console.log(`   ✅ Tagging complete`)
      } catch (tagError: any) {
        console.log(`   ⚠️  Tagging failed (non-critical): ${tagError.message}`)
      }
    }
    
    return { success: true, imageId: image.id }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`)
    }
    return { success: false, error: error.message }
  } finally {
    // Explicitly release all buffers
    buf = null!
    canonicalPng = null!
    rawRgba = null!
    // Force garbage collection
    if (global.gc) global.gc()
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('📸 Adding FireShot Screenshots to Sites')
  console.log('═'.repeat(60))
  console.log('💾 Memory-optimized: Tagging disabled by default')
  console.log('   Set ENABLE_TAGGING=true to enable tagging (memory intensive)')
  console.log('═'.repeat(60))
  
  const urlsToProcess = Object.entries(urlToScreenshot)
    .filter(([_, file]) => file && file.length > 0)
  
  console.log(`Total sites to process: ${urlsToProcess.length}\n`)
  
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ url: string; error: string }>,
  }
  
  let index = 0
  for (const [url, screenshotFile] of urlsToProcess) {
    index++
    console.log(`\n[${index}/${urlsToProcess.length}]`)
    
    const result = await processScreenshot(url, screenshotFile)
    
    if (result.success) {
      results.success++
    } else {
      results.failed++
      results.errors.push({ url, error: result.error || 'Unknown error' })
    }
    
    // Force garbage collection between images to free memory
    if (global.gc) {
      global.gc()
    }
    
    // Small delay between requests to allow GC to run
    if (index < urlsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 Summary')
  console.log('═'.repeat(60))
  console.log(`✅ Successfully processed: ${results.success}`)
  console.log(`⏭️  Skipped: ${results.skipped}`)
  console.log(`❌ Failed: ${results.failed}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(({ url, error }) => {
      console.log(`   - ${url}: ${error}`)
    })
  }
  
  console.log('\n')
}

// Enable garbage collection if available
// To enable: NODE_OPTIONS=--expose-gc npx tsx scripts/add_fireshot_images.ts
if (global.gc) {
  console.log('✅ Garbage collection enabled (memory will be freed aggressively)')
} else {
  console.log('⚠️  Garbage collection not enabled - memory will be freed automatically by Node.js')
  console.log('   To enable manual GC: NODE_OPTIONS=--expose-gc npx tsx scripts/add_fireshot_images.ts')
}

main()
  .catch(console.error)
  .finally(() => {
    // Force final cleanup
    if (global.gc) global.gc()
    return prisma.$disconnect()
  })

