#!/usr/bin/env tsx
/**
 * Generate missing embeddings for images
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'

async function generateEmbeddings() {
  const targetUrls = [
    'saraheismanstudio.com',
    'legora.com',
    'aneshk.design',
    'shapes.gallery',
    'davehawkins.co',
    'balajmarius.com',
    'manifold.bio',
    'kereliott.com',
    'dreamrecorder.ai',
    'creativesouth.com',
    'zigzaglife.in',
    're-do.studio',
    'elliott.mangham.dev',
    'deadsimplejobs.com',
    'banch.bausola.com',
    'do-undo.com',
    'bridgingtables.com',
    'noir.global',
    'tabs.com',
  ]
  
  const sites = await prisma.site.findMany({
    where: {
      OR: targetUrls.map(url => ({
        url: { contains: url }
      }))
    },
    include: { images: true }
  })
  
  console.log(`Found ${sites.length} sites`)
  
  for (const site of sites) {
    for (const img of site.images) {
      if (img.embeddingId) {
        console.log(`✓ ${site.url} - already has embedding`)
        continue
      }
      
      console.log(`\n📸 Processing: ${site.url}`)
      console.log(`   Image URL: ${img.url}`)
      
      try {
        // Fetch image
        const response = await fetch(img.url)
        if (!response.ok) {
          console.log(`   ❌ Failed to fetch: ${response.status}`)
          continue
        }
        
        const buf = Buffer.from(await response.arrayBuffer())
        
        // Canonicalize
        const { hash: contentHash } = await canonicalizeImage(buf)
        console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
        
        // Check if embedding exists by contentHash
        const existingByHash = await prisma.imageEmbedding.findFirst({
          where: { contentHash: contentHash } as any
        })
        
        if (existingByHash) {
          // Reuse existing embedding vector (but create new record for this image)
          await prisma.imageEmbedding.upsert({
            where: { imageId: img.id } as any,
            update: {
              vector: existingByHash.vector as any,
              model: existingByHash.model,
              contentHash: null, // Can't reuse unique contentHash
            } as any,
            create: {
              imageId: img.id,
              model: existingByHash.model,
              vector: existingByHash.vector as any,
              contentHash: null, // Can't reuse unique contentHash
            } as any,
          })
          console.log(`   ♻️  Reused existing embedding vector`)
        } else {
          // Compute new embedding
          console.log(`   🤖 Computing embedding...`)
          const result = await embedImageFromBuffer(buf)
          await prisma.imageEmbedding.upsert({
            where: { imageId: img.id } as any,
            update: {
              vector: result.vector as any,
              model: 'clip-ViT-L/14',
              contentHash: contentHash,
            } as any,
            create: {
              imageId: img.id,
              vector: result.vector as any,
              model: 'clip-ViT-L/14',
              contentHash: contentHash,
            } as any,
          })
          console.log(`   ✅ Embedding computed (dim: ${result.vector.length})`)
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`)
      }
    }
  }
  
  await prisma.$disconnect()
}

generateEmbeddings().catch(console.error)

