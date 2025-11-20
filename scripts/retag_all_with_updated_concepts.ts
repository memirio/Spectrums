/**
 * Re-tag all images with updated concepts
 * 
 * This script re-tags all images using the standard tagging function,
 * which will use the updated concept embeddings (with new synonyms/related)
 * and the updated opposites from concept-opposites.ts
 * 
 * Features:
 * - Timeout protection (60s per image)
 * - Exponential backoff retries for 503 errors
 * - Checkpointing to resume from last saved position
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import { join } from 'path'

const CHECKPOINT_FILE = join(__dirname, 'generated_opposites', 'retag_checkpoint.json')
const IMAGE_TIMEOUT_MS = 60000 // 60 seconds per image
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 2000 // 2 seconds

interface Checkpoint {
  lastProcessedIndex: number
  processedIds: string[]
  errorIds: string[]
}

function loadCheckpoint(): Checkpoint | null {
  if (!existsSync(CHECKPOINT_FILE)) return null
  try {
    const data = readFileSync(CHECKPOINT_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

function saveCheckpoint(checkpoint: Checkpoint) {
  writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2))
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    })
  ])
}

/**
 * Tag image with existing concepts only (no concept generation)
 */
async function tagImageOnly(imageId: string, imageIndex: number, totalImages: number): Promise<void> {
  const image = await prisma.image.findUnique({ 
    where: { id: imageId },
    include: { embedding: true, site: { select: { url: true } } }
  })
  
  if (!image) {
    throw new Error(`Image ${imageId} not found`)
  }
  
  if (!image.embedding) {
    throw new Error(`Image ${imageId} has no embedding`)
  }
  
  console.log(`[${imageIndex + 1}/${totalImages}] Processing image ${imageId} (${image.site?.url || 'N/A'})...`)
  
  const ivec = image.embedding.vector as unknown as number[]
  
  // Get all concepts with pre-computed embeddings (much faster than zero-shot)
  console.log(`  📚 Loading concepts...`)
  const concepts = await prisma.concept.findMany()
  console.log(`  📚 Loaded ${concepts.length} concepts`)
  
  // Use pre-computed concept embeddings (fast approach, like before)
  console.log(`  🏷️  Tagging with pre-computed embeddings...`)
  
  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    let s = 0
    for (let i = 0; i < a.length; i++) s += a[i] * b[i]
    return s
  }
  
  const scored = concepts
    .filter(c => c.embedding && Array.isArray(c.embedding))
    .map(c => ({ 
      conceptId: c.id, 
      score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || []) 
    }))
    .filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
    .sort((a, b) => b.score - a.score)
  
  // Apply pragmatic tagging logic (same as zero-shot)
  const chosen: typeof scored = []
  const MIN_TAGS_PER_IMAGE = 8
  let prevScore = scored.length > 0 ? scored[0].score : 0
  
  for (let i = 0; i < scored.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
    const current = scored[i]
    
    if (chosen.length === 0) {
      chosen.push(current)
      prevScore = current.score
      continue
    }
    
    const dropPct = (prevScore - current.score) / prevScore
    if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        chosen.push(current)
        prevScore = current.score
      } else {
        break
      }
    } else {
      chosen.push(current)
      prevScore = current.score
    }
  }
  
  // Fallback: ensure minimum tags
  if (chosen.length < MIN_TAGS_PER_IMAGE) {
    const fallback = scored.slice(0, MIN_TAGS_PER_IMAGE)
    const keep = new Set(chosen.map(c => c.conceptId))
    for (const f of fallback) {
      if (!keep.has(f.conceptId)) {
        chosen.push(f)
        keep.add(f.conceptId)
        if (chosen.length >= MIN_TAGS_PER_IMAGE) break
      }
    }
  }
  
  const tagResults = chosen.sort((a, b) => b.score - a.score)
  console.log(`  🏷️  Found ${tagResults.length} matching tags`)
  
  // Get existing tags to avoid duplicates
  const existingTags = await prisma.imageTag.findMany({
    where: { imageId: image.id },
  })
  const existingConceptIds = new Set(existingTags.map(t => t.conceptId))
  console.log(`  📋 Image already has ${existingTags.length} tags`)
  
  // Only create new tags (don't update or delete existing ones)
  let newTagsCount = 0
  for (const t of tagResults) {
    if (!existingConceptIds.has(t.conceptId)) {
      await prisma.imageTag.create({
        data: { imageId: image.id, conceptId: t.conceptId, score: t.score },
      })
      newTagsCount++
    }
  }
  
  if (newTagsCount > 0) {
    console.log(`  ✅ Added ${newTagsCount} new tags`)
  } else {
    console.log(`  ℹ️  No new tags to add`)
  }
}

async function tagImageWithRetry(imageId: string, imageIndex: number, totalImages: number, retries = MAX_RETRIES): Promise<void> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await withTimeout(tagImageOnly(imageId, imageIndex, totalImages), IMAGE_TIMEOUT_MS)
      return // Success
    } catch (error: any) {
      const errorMsg = error?.message || String(error)
      const is503 = errorMsg.includes('503') || errorMsg.includes('Service Unavailable') || errorMsg.includes('overloaded')
      
      if (attempt < retries && is503) {
        // Exponential backoff for 503 errors
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt)
        console.log(`  ⚠️  503 error, retrying in ${delay}ms (attempt ${attempt + 1}/${retries + 1})...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // Not a 503, or out of retries
      throw error
    }
  }
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🏷️  Re-tagging All Images with Updated Concepts')
  console.log('═'.repeat(70))
  console.log()
  console.log('This will:')
  console.log('  - Add new tags to images with existing concepts only (no new concept generation)')
  console.log('  - Use updated concept synonyms/related terms')
  console.log('  - Use updated opposites from concept-opposites.ts')
  console.log('  - Will NOT update or delete existing tags')
  console.log('  - Timeout: 60s per image')
  console.log('  - Retries: 3 attempts with exponential backoff for 503 errors')
  console.log()
  
  // Load checkpoint if exists
  const checkpoint = loadCheckpoint()
  let startIndex = 0
  const processedIds = new Set<string>(checkpoint?.processedIds || [])
  const errorIds = new Set<string>(checkpoint?.errorIds || [])
  
  if (checkpoint) {
    startIndex = checkpoint.lastProcessedIndex + 1
    console.log(`📂 Resuming from checkpoint: image ${startIndex + 1}`)
    console.log(`   Already processed: ${processedIds.size}`)
    console.log(`   Previous errors: ${errorIds.size}`)
    console.log()
  }
  
  // Get all images with embeddings
  const images = await prisma.image.findMany({
    where: {
      embedding: {
        isNot: null
      }
    },
    include: {
      site: {
        select: {
          title: true,
          url: true
        }
      },
      embedding: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log(`📊 Found ${images.length} images to re-tag`)
  console.log()
  console.log('═'.repeat(70))
  console.log()
  
  let processed = processedIds.size
  let errors = errorIds.size
  const startTime = Date.now()
  const errorsList: Array<{ imageId: string; url: string; error: string }> = []
  
  for (let i = startIndex; i < images.length; i++) {
    const image = images[i]
    const site = image.site
    
    // Skip if already processed
    if (processedIds.has(image.id)) {
      continue
    }
    
    try {
      await tagImageWithRetry(image.id, i, images.length)
      processed++
      processedIds.add(image.id)
      errorIds.delete(image.id) // Remove from errors if it succeeds on retry
      
      // Save checkpoint every 10 images
      if ((i + 1) % 10 === 0) {
        saveCheckpoint({
          lastProcessedIndex: i,
          processedIds: Array.from(processedIds),
          errorIds: Array.from(errorIds)
        })
      }
      
      // Progress update every 10 images
      if ((i + 1) % 10 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        const rate = (processed / ((Date.now() - startTime) / 1000)).toFixed(1)
        const progress = ((i + 1) / images.length * 100).toFixed(1)
        console.log(`Progress: ${i + 1}/${images.length} (${progress}%) | ${processed} processed, ${errors} errors | ${rate} img/s`)
      }
    } catch (error: any) {
      errors++
      const errorMsg = error?.message || String(error)
      errorsList.push({
        imageId: image.id,
        url: site?.url || 'N/A',
        error: errorMsg
      })
      errorIds.add(image.id)
      console.error(`❌ Error tagging image ${image.id} (${site?.url || 'N/A'}): ${errorMsg}`)
      
      // Save checkpoint on error too
      saveCheckpoint({
        lastProcessedIndex: i,
        processedIds: Array.from(processedIds),
        errorIds: Array.from(errorIds)
      })
    }
    
    // Small delay between images to avoid overwhelming the API
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  // Final checkpoint save
  saveCheckpoint({
    lastProcessedIndex: images.length - 1,
    processedIds: Array.from(processedIds),
    errorIds: Array.from(errorIds)
  })
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const rate = (processed / ((Date.now() - startTime) / 1000)).toFixed(1)
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Processed: ${processed} images`)
  console.log(`❌ Errors: ${errors} images`)
  console.log(`⏱️  Time: ${elapsed}s`)
  console.log(`📈 Rate: ${rate} img/s`)
  console.log(`📊 Success rate: ${((processed / images.length) * 100).toFixed(1)}%`)
  console.log()
  
  if (errorsList.length > 0) {
    console.log('❌ Errors encountered:')
    errorsList.slice(0, 10).forEach(e => {
      console.log(`  - ${e.url}: ${e.error}`)
    })
    if (errorsList.length > 10) {
      console.log(`  ... and ${errorsList.length - 10} more errors`)
    }
    console.log()
  }
  
  // Show statistics
  const totalTags = await prisma.imageTag.count()
  const avgTagsPerImage = totalTags / images.length
  console.log('📊 Tagging Statistics:')
  console.log(`   Total tags: ${totalTags}`)
  console.log(`   Average tags per image: ${avgTagsPerImage.toFixed(1)}`)
  console.log()
  console.log('═'.repeat(70))
  console.log('✅ Re-tagging complete!')
  console.log('═'.repeat(70))
  
  // Clean up checkpoint file on successful completion
  if (errors === 0 && existsSync(CHECKPOINT_FILE)) {
    unlinkSync(CHECKPOINT_FILE)
    console.log('🧹 Checkpoint file cleaned up')
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

