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

async function processSite(siteUrl: string, imageUrl: string) {
  const site = await prisma.site.findFirst({ 
    where: { url: siteUrl },
    include: { images: true }
  })
  if (!site) {
    console.log(`Site not found: ${siteUrl}`)
    return false
  }
  
  if (site.images.length > 0) {
    console.log(`✅ ${site.title} already has images`)
    return true
  }
  
  console.log(`Processing: ${site.title}...`)
  
  try {
    // Fetch image to get metadata
    const resImg = await fetch(imageUrl)
    if (!resImg.ok) {
      throw new Error(`HTTP ${resImg.status}`)
    }
    
    const ab = await resImg.arrayBuffer()
    const buf = Buffer.from(ab)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length
    
    // Create Image record
    const image = await (prisma.image as any).upsert({
      where: { siteId_url: { siteId: site.id, url: imageUrl } },
      update: { width, height, bytes },
      create: {
        siteId: site.id,
        url: imageUrl,
        width,
        height,
        bytes,
      },
    })
    
    // Canonicalize and embed
    const { hash: contentHash } = await canonicalizeImage(buf)
    const existing = await prisma.imageEmbedding.findFirst({
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[]
    const existingForImage = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id } as any
    })
    
    if (existing && existingForImage) {
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
      data: { imageUrl }
    })
    
    console.log(`  ✅ Successfully processed\n`)
    return true
  } catch (e: any) {
    console.log(`  ❌ Error: ${e.message || e}\n`)
    return false
  }
}

async function main() {
  console.log('Processing manually identified completed jobs...\n')
  
  const completed = [
    { url: 'https://www.drinkzoi.co', imageUrl: 'http://localhost:9000/screenshots/369991d596cb486b9fcd0e0adb89bf1a8599c1dd/369991d596cb486b9fcd0e0adb89bf1a8599c1dd.1200x900.webp' },
    { url: 'https://unstructured.io', imageUrl: 'http://localhost:9000/screenshots/b0d2892f2fb2ca0ca4f20b375ebf0cc5f9c01a6c/b0d2892f2fb2ca0ca4f20b375ebf0cc5f9c01a6c.1200x900.webp' },
    { url: 'https://www.barntilbords.no', imageUrl: 'http://localhost:9000/screenshots/40cdf539f2eba024355b455263f8dca8e343a33a/40cdf539f2eba024355b455263f8dca8e343a33a.1200x900.webp' },
  ]
  
  let processed = 0
  for (const item of completed) {
    const success = await processSite(item.url, item.imageUrl)
    if (success) processed++
  }
  
  console.log(`\n✅ Done! Processed ${processed}/${completed.length} sites`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

