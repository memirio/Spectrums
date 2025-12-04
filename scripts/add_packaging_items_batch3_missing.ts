#!/usr/bin/env tsx
/**
 * Add Missing Packaging Items from Batch 3
 * Processes the 2 items that were skipped due to filename issues
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { uploadImageToSupabaseStorage } from './upload_to_supabase_storage'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const packagingDir = '/Users/victor/Downloads/FireShot/Packaging'

const MISSING_ITEMS = [
  { title: 'Granny\'s Secret', url: 'https://packagingoftheworld.com/2012/02/grannys-secret.html' },
  { title: 'Yo\'Play Blox', url: 'https://packagingoftheworld.com/2011/09/yoplay-blox-concept.html' },
]

async function processImage(filePath: string, site: any, category: string = 'packaging'): Promise<void> {
  console.log(`\n📸 Processing image: ${path.basename(filePath)}`)
  console.log(`   📦 Category: ${category}`)
  
  const buf = fs.readFileSync(filePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  console.log(`   ☁️  Uploading to Supabase Storage...`)
  const imageUrl = await uploadImageToSupabaseStorage(filePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: { width, height, bytes, category },
    create: { siteId: site.id, url: imageUrl, width, height, bytes, category },
  })
  
  console.log(`   ✅ Image record created/updated (ID: ${image.id})`)
  
  const existingByHash = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  const existingForImage = await prisma.imageEmbedding.findUnique({
    where: { imageId: image.id } as any
  })
  
  let ivec: number[]
  if (existingByHash) {
    ivec = existingByHash.vector as unknown as number[]
    console.log(`   ♻️  Reusing existing embedding vector`)
    
    if (existingForImage) {
      await prisma.imageEmbedding.update({
        where: { imageId: image.id } as any,
        data: { contentHash: contentHash } as any,
      })
    } else {
      await prisma.imageEmbedding.create({
        data: {
          imageId: image.id,
          model: existingByHash.model,
          vector: existingByHash.vector as any,
          contentHash: null,
        } as any,
      })
    }
  } else {
    console.log(`   🤖 Computing image embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: { vector: ivec as any, model: 'clip-ViT-L/14', contentHash: contentHash } as any,
      create: { imageId: image.id, vector: ivec as any, model: 'clip-ViT-L/14', contentHash: contentHash } as any,
    })
    console.log(`   ✅ Embedding computed (dim: ${ivec.length})`)
  }
  
  console.log(`   🏷️  Running full tagging pipeline...`)
  try {
    const { tagImage } = await import('../src/jobs/tagging')
    const existingConceptIdsBefore = new Set(
      (await prisma.concept.findMany({ select: { id: true } })).map(c => c.id)
    )
    
    const newlyCreatedConceptIds = await tagImage(image.id)
    
    const tagCount = await prisma.imageTag.count({
      where: { imageId: image.id }
    })
    
    if (tagCount === 0) {
      console.warn(`   ⚠️  WARNING: No tags created, attempting fallback...`)
      const { TAG_CONFIG } = await import('../src/lib/tagging-config')
      const concepts = await prisma.concept.findMany()
      
      function cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0
        let s = 0
        for (let i = 0; i < a.length; i++) s += a[i] * b[i]
        return s
      }
      
      const scored = concepts.map(c => ({
        id: c.id,
        score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
      }))
      scored.sort((a, b) => b.score - a.score)
      
      const chosen: typeof scored = []
      const maxScore = scored.length > 0 ? scored[0].score : 0
      for (const s of scored) {
        if (s.score < TAG_CONFIG.MIN_SCORE) break
        if (s.score < maxScore * 0.48) break
        if (chosen.length === 0) {
          chosen.push(s)
          continue
        }
        const prev = chosen[chosen.length - 1].score
        if (s.score >= prev * (1 - TAG_CONFIG.MIN_SCORE_DROP_PCT)) {
          chosen.push(s)
        } else {
          break
        }
        if (chosen.length >= TAG_CONFIG.MAX_K) break
      }
      
      if (chosen.length < TAG_CONFIG.FALLBACK_K) {
        const fallback = scored.slice(0, TAG_CONFIG.FALLBACK_K)
        const keep = new Set(chosen.map(c => c.id))
        for (const f of fallback) {
          if (!keep.has(f.id)) {
            chosen.push(f)
            keep.add(f.id)
          }
        }
      }
      
      for (const s of chosen) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: s.id } },
          update: { score: s.score },
          create: { imageId: image.id, conceptId: s.id, score: s.score },
        })
      }
      
      const finalTagCount = await prisma.imageTag.count({
        where: { imageId: image.id }
      })
      console.log(`   ✅ Fallback tagging created ${finalTagCount} tags`)
    } else {
      console.log(`   ✅ Tagging pipeline completed (${tagCount} tags created)`)
    }
    
    if (newlyCreatedConceptIds.length > 0) {
      console.log(`   🆕 Generated ${newlyCreatedConceptIds.length} new concept(s)`)
      const trulyNewConceptIds = newlyCreatedConceptIds.filter(id => !existingConceptIdsBefore.has(id))
      
      if (trulyNewConceptIds.length > 0) {
        console.log(`   🏷️  Scheduling background tagging...`)
        const { tagNewConceptsOnAllImages } = await import('../src/jobs/tag-new-concepts-on-all')
        tagNewConceptsOnAllImages(trulyNewConceptIds).catch((err: any) => {
          console.error(`   ⚠️  Background tagging failed (non-fatal): ${err.message}`)
        })
      }
    }
  } catch (tagError: any) {
    console.error(`   ❌ Tagging pipeline failed: ${tagError.message}`)
  }
  
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  
  console.log(`\n   ✅ Successfully processed!`)
  console.log(`   🌐 CDN URL: ${imageUrl}`)
}

async function main() {
  console.log('═'.repeat(70))
  console.log('📦 Processing Missing Items from Batch 3')
  console.log('═'.repeat(70))
  console.log(`\nProcessing ${MISSING_ITEMS.length} items...\n`)
  
  const allFiles = fs.readdirSync(packagingDir)
  
  for (let i = 0; i < MISSING_ITEMS.length; i++) {
    const item = MISSING_ITEMS[i]
    
    // Find file by matching key words from title
    const titleLower = item.title.toLowerCase()
    const keyWords = titleLower.split(/[\s'-]+/).filter(w => w.length > 2)
    const fuzzyMatch = allFiles.find(f => {
      const fLower = f.toLowerCase()
      // Match if filename contains at least 2 key words from title
      const matches = keyWords.filter(word => fLower.includes(word))
      return matches.length >= Math.min(2, keyWords.length)
    })
    
    if (!fuzzyMatch) {
      console.log(`\n[${i + 1}/${MISSING_ITEMS.length}] ⚠️  Could not find file for: ${item.title}`)
      continue
    }
    
    const imagePath = path.join(packagingDir, fuzzyMatch)
    
    console.log(`\n[${i + 1}/${MISSING_ITEMS.length}] Processing: ${item.title}`)
    console.log(`   📎 URL: ${item.url}`)
    console.log(`   🖼️  Image: ${fuzzyMatch}`)
    
    try {
      const normalizedUrl = item.url.trim().replace(/\/$/, '')
      
      let site = await prisma.site.findFirst({
        where: { url: normalizedUrl }
      })
      
      if (site) {
        console.log(`   ⚠️  Site already exists: ${site.title}`)
        site = await prisma.site.update({
          where: { id: site.id },
          data: { title: item.title }
        })
      } else {
        site = await prisma.site.create({
          data: {
            title: item.title,
            url: normalizedUrl,
            description: '',
            imageUrl: null,
            author: null,
          }
        })
        console.log(`   ✅ Site created (ID: ${site.id})`)
      }
      
      await processImage(imagePath, site, 'packaging')
      
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message || error}`)
    }
  }
  
  console.log('\n' + '═'.repeat(70))
  console.log('✅ Complete!')
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

