#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function main() {
  const url = 'https://activetheory.net'
  
  // Find the site
  const site = await prisma.site.findFirst({
    where: {
      url: {
        contains: 'activetheory'
      } as any
    },
    include: {
      images: {
        include: {
          embedding: true
        }
      }
    }
  })
  
  if (!site) {
    console.log('❌ Site not found:', url)
    await prisma.$disconnect()
    return
  }
  
  console.log(`\n✅ Found site: ${site.title}`)
  console.log(`   URL: ${site.url}`)
  console.log(`   Site ID: ${site.id}`)
  console.log(`   Images: ${site.images.length}`)
  
  // Get the main image
  const mainImage = site.images.find(img => img.url === site.imageUrl) || site.images[0]
  if (!mainImage || !mainImage.embedding) {
    console.log('❌ No image with embedding found')
    await prisma.$disconnect()
    return
  }
  
  console.log(`\n📸 Main image:`)
  console.log(`   Image ID: ${mainImage.id}`)
  console.log(`   URL: ${mainImage.url}`)
  
  // Embed queries
  const [techyEmb, models3dEmb] = await embedTextBatch(['techy', '3d models'])
  const imageVec = mainImage.embedding.vector as unknown as number[]
  
  // Calculate similarities
  const techySim = cosine(techyEmb, imageVec)
  const models3dSim = cosine(models3dEmb, imageVec)
  const combinedSim = techySim * 0.75 + models3dSim * 0.25
  
  console.log(`\n📊 Similarity scores:`)
  console.log(`   "techy": ${techySim.toFixed(4)}`)
  console.log(`   "3d models": ${models3dSim.toFixed(4)}`)
  console.log(`   Combined (75/25): ${combinedSim.toFixed(4)}`)
  
  // Check if it's in the top results
  console.log(`\n🔍 Checking if it appears in search results...`)
  console.log(`   Site ID prefix: ${site.id.substring(0, 8)}`)
  
  await prisma.$disconnect()
}

main().catch(console.error)

