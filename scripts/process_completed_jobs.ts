import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import sharp from 'sharp'

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function processCompletedJob(site: { id: string; title: string; url: string }) {
  const base64 = Buffer.from(site.url).toString('base64').slice(0, 24)
  const jobId = `looma-${base64}`
  
  try {
    const statusResponse = await fetch(`${SCREENSHOT_API_URL}/api/screenshot/${jobId}`)
    if (!statusResponse.ok) {
      return { success: false, reason: `Status check failed: ${statusResponse.status}` }
    }
    
    const status = await statusResponse.json()
    if (status.status !== 'done' || !status.imageUrl) {
      return { success: false, reason: `Job not done: ${status.status}` }
    }
    
    console.log(`  ✅ Found completed screenshot for ${site.title}`)
    
    // Fetch image to get metadata
    const resImg = await fetch(status.imageUrl)
    if (!resImg.ok) {
      throw new Error(`HTTP ${resImg.status} for ${status.imageUrl}`)
    }
    
    const ab = await resImg.arrayBuffer()
    const buf = Buffer.from(ab)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length
    
    // Create Image record
    const image = await (prisma.image as any).upsert({
      where: { siteId_url: { siteId: site.id, url: status.imageUrl } },
      update: { width, height, bytes },
      create: {
        siteId: site.id,
        url: status.imageUrl,
        width,
        height,
        bytes,
      },
    })
    
    // Canonicalize to get contentHash
    const { hash: contentHash } = await canonicalizeImage(buf)
    
    // Check if embedding already exists by contentHash
    const existing = await prisma.imageEmbedding.findFirst({
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[]
    const existingForImage = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id } as any
    })
    
    if (existing && existingForImage) {
      if (existingForImage.contentHash !== contentHash) {
        await prisma.imageEmbedding.update({
          where: { imageId: image.id } as any,
          data: { contentHash: contentHash } as any
        })
      }
      ivec = existing.vector as unknown as number[]
    } else if (existing) {
      ivec = existing.vector as unknown as number[]
      await prisma.imageEmbedding.create({
        data: {
          imageId: image.id,
          model: existing.model,
          vector: existing.vector as any,
          contentHash: contentHash
        } as any,
      })
    } else {
      const result = await embedImageFromBuffer(buf)
      ivec = result.vector
      await prisma.imageEmbedding.upsert({
        where: { imageId: image.id },
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
    }
    
    // Score and create tags
    const concepts = await prisma.concept.findMany()
    if (concepts.length > 0) {
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
    }
    
    // Update site.imageUrl
    await prisma.site.update({
      where: { id: site.id },
      data: { imageUrl: status.imageUrl }
    })
    
    return { success: true }
  } catch (error: any) {
    return { success: false, reason: error.message || 'Unknown error' }
  }
}

async function main() {
  console.log('Processing completed screenshot jobs...\n')
  
  const sitesWithoutImages = await prisma.site.findMany({
    where: { images: { none: {} } },
    include: { images: true }
  })
  
  console.log(`Found ${sitesWithoutImages.length} sites without images\n`)
  
  let processed = 0
  let skipped = 0
  
  for (const site of sitesWithoutImages) {
    if (site.url?.includes('disantinowater')) {
      console.log(`⏭️  Skipping ${site.title} (known problematic)`)
      skipped++
      continue
    }
    
    console.log(`Processing: ${site.title} (${site.url})`)
    const result = await processCompletedJob(site)
    
    if (result.success) {
      processed++
      console.log(`  ✅ Successfully processed\n`)
    } else {
      console.log(`  ⚠️  ${result.reason}\n`)
    }
  }
  
  console.log(`\n✅ Done!`)
  console.log(`   Processed: ${processed}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Total: ${sitesWithoutImages.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

