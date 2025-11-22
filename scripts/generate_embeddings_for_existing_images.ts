#!/usr/bin/env tsx
/**
 * Generate embeddings for all existing images that don't have embeddings yet.
 * This is useful after a migration or if embeddings were lost.
 * 
 * NOTE: This only generates embeddings, it does NOT create new tags/concepts.
 * Existing tags are preserved.
 */

import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'

async function main() {
  console.log('🔍 Finding images without embeddings...')
  
  // Find all images that don't have embeddings
  const imagesWithoutEmbeddings = await prisma.image.findMany({
    where: {
      embedding: null
    },
    select: {
      id: true,
      url: true,
      category: true
    }
  })
  
  console.log(`📊 Found ${imagesWithoutEmbeddings.length} images without embeddings`)
  
  if (imagesWithoutEmbeddings.length === 0) {
    console.log('✅ All images already have embeddings!')
    return
  }
  
  console.log(`\n🚀 Starting to generate embeddings only (no new tags)...`)
  console.log(`   This will process ${imagesWithoutEmbeddings.length} images`)
  console.log(`   Each image will be fetched and embedded (tags preserved)\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < imagesWithoutEmbeddings.length; i++) {
    const image = imagesWithoutEmbeddings[i]
    const progress = `[${i + 1}/${imagesWithoutEmbeddings.length}]`
    
    try {
      console.log(`${progress} Processing image ${image.id} (${image.category})...`)
      console.log(`   URL: ${image.url}`)
      
      // Fetch image
      const res = await fetch(image.url)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${image.url}`)
      }
      const ab = await res.arrayBuffer()
      const buf = Buffer.from(ab)
      
      // Canonicalize to get contentHash
      const { hash: contentHash } = await canonicalizeImage(buf)
      
      // Check if embedding exists by contentHash (for reuse)
      const existingByHash = await prisma.imageEmbedding.findFirst({
        where: { contentHash: contentHash } as any
      })
      
      let ivec: number[]
      if (existingByHash) {
        // Reuse existing embedding
        ivec = existingByHash.vector as unknown as number[]
        console.log(`   ♻️  Reusing existing embedding (from another image)`)
        await prisma.imageEmbedding.create({
          data: {
            imageId: image.id,
            model: existingByHash.model,
            vector: existingByHash.vector as any,
            contentHash: contentHash
          } as any,
        })
      } else {
        // Compute new embedding
        console.log(`   🤖 Computing new embedding...`)
        const result = await embedImageFromBuffer(buf)
        ivec = result.vector
        await prisma.imageEmbedding.create({
          data: {
            imageId: image.id,
            vector: ivec as any,
            model: 'clip-ViT-L/14',
            contentHash: contentHash
          } as any,
        })
        console.log(`   ✅ Embedding computed (dim: ${ivec.length})`)
      }
      
      successCount++
      
      // Small delay to avoid overwhelming the system
      if (i < imagesWithoutEmbeddings.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      errorCount++
      
      // Continue with next image even if this one fails
    }
    
    // Progress update every 10 images
    if ((i + 1) % 10 === 0) {
      console.log(`\n📊 Progress: ${successCount} succeeded, ${errorCount} failed\n`)
    }
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('✅ Complete!')
  console.log(`   Success: ${successCount}`)
  console.log(`   Failed:  ${errorCount}`)
  console.log(`   Total:   ${imagesWithoutEmbeddings.length}`)
  console.log('═'.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

