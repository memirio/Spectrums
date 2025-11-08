import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const FALLBACK_PATH = '/fallback.webp'
const FALLBACK_FILE = resolve(process.cwd(), 'public', 'fallback.webp')

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const startTime = Date.now()
  
  console.log('🔍 Finding images with picsum.photos URLs (without /id/)...')
  
  // Find all Image rows with picsum.photos URLs (but not with /id/)
  const images = await prisma.image.findMany({
    where: {
      url: {
        contains: 'picsum.photos',
        not: {
          contains: '/id/'
        }
      }
    },
    include: { site: true }
  })
  
  console.log(`Found ${images.length} images to fix`)
  
  if (images.length === 0) {
    console.log('✅ No images to fix')
    return
  }
  
  // Load fallback image
  const fallbackBuf = readFileSync(FALLBACK_FILE)
  const { hash: fallbackHash } = await canonicalizeImage(fallbackBuf)
  
  console.log(`📦 Fallback image hash: ${fallbackHash.slice(0, 12)}...`)
  
  // Check if embedding already exists for fallback
  let fallbackEmbedding = await prisma.imageEmbedding.findFirst({
    where: { contentHash: fallbackHash } as any
  })
  
  // If no embedding exists, compute it once (we'll reuse it for all images)
  if (!fallbackEmbedding) {
    console.log('📊 Computing fallback embedding (will be reused for all images)...')
    const { vector } = await embedImageFromBuffer(fallbackBuf)
    // Store it in memory for reuse
    fallbackEmbedding = {
      model: 'clip-ViT-L/14',
      vector: vector as any,
      contentHash: fallbackHash
    } as any
  }
  
  let embeddingsReused = 0
  let embeddingsCreated = 0
  let sitesUpdated = 0
  
  // Process each image
  for (const image of images) {
    console.log(`\n🔄 Processing image ${image.id} (${image.url})`)
    
    // Update Image URL to fallback
    await prisma.image.update({
      where: { id: image.id },
      data: { url: FALLBACK_PATH }
    })
    
    // Update Site imageUrl if it matches
    if (image.site?.imageUrl && image.site.imageUrl.includes('picsum.photos') && !image.site.imageUrl.includes('/id/')) {
      await prisma.site.update({
        where: { id: image.siteId },
        data: { imageUrl: FALLBACK_PATH }
      })
      sitesUpdated++
    }
    
    // Check if this image already has an embedding with the same contentHash
    const existingForImage = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id }
    })
    
    if (existingForImage && (existingForImage.contentHash as string | null) === fallbackHash) {
      // Already has correct embedding, just update contentHash if needed
      if ((existingForImage.contentHash as string | null) !== fallbackHash) {
        await prisma.imageEmbedding.update({
          where: { imageId: image.id },
          data: { contentHash: fallbackHash } as any
        })
      }
      embeddingsReused++
      console.log(`  ✓ Reused existing embedding for image`)
    } else {
      // Check if any other image already has this embedding stored
      const existingInDb = await prisma.imageEmbedding.findFirst({
        where: { contentHash: fallbackHash } as any
      })
      
      if (existingInDb) {
        // Reuse from database
        await prisma.imageEmbedding.upsert({
          where: { imageId: image.id },
          update: { contentHash: fallbackHash } as any,
          create: {
            imageId: image.id,
            model: existingInDb.model,
            vector: existingInDb.vector as any,
            contentHash: fallbackHash
          } as any,
        })
        embeddingsReused++
        console.log(`  ✓ Reused embedding from database`)
      } else {
        // Use the computed embedding
        await prisma.imageEmbedding.upsert({
          where: { imageId: image.id },
          update: {
            vector: fallbackEmbedding!.vector as any,
            model: fallbackEmbedding!.model,
            contentHash: fallbackHash
          } as any,
          create: {
            imageId: image.id,
            vector: fallbackEmbedding!.vector as any,
            model: fallbackEmbedding!.model,
            contentHash: fallbackHash
          } as any,
        })
        embeddingsCreated++
        console.log(`  ✓ Created new embedding (first time, will be reused)`)
      }
    }
    
    // Re-tag the image
    const embedding = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id }
    })
    
    if (embedding) {
      const ivec = embedding.vector as unknown as number[]
      const concepts = await prisma.concept.findMany({ where: { active: true } })
      
      // Delete old tags
      await prisma.imageTag.deleteMany({
        where: { imageId: image.id }
      })
      
      // Score and create new tags
      const scores = concepts
        .map(c => ({
          c,
          score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
        }))
        .sort((a, b) => b.score - a.score)
      
      const MIN_SCORE = 0.12
      const TOP_K = 5
      const chosen = scores.filter(s => s.score >= MIN_SCORE).slice(0, TOP_K) || scores.slice(0, 3)
      
      for (const { c, score } of chosen) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
          update: { score },
          create: { imageId: image.id, conceptId: c.id, score },
        })
      }
      
      console.log(`  ✓ Re-tagged with ${chosen.length} concepts`)
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  
  console.log('\n📊 Summary:')
  console.log(`  Images updated: ${images.length}`)
  console.log(`  Sites updated: ${sitesUpdated}`)
  console.log(`  Embeddings reused: ${embeddingsReused}`)
  console.log(`  Embeddings created: ${embeddingsCreated}`)
  console.log(`  Total time: ${duration}s`)
  console.log('\n✅ Fix complete!')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

