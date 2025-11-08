import { PrismaClient } from '@prisma/client'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import sharp from 'sharp'

const prisma = new PrismaClient()

async function processSite(site: any) {
  try {
    console.log(`Processing: ${site.title} - ${site.url}`)
    
    // Step 1: Get screenshot from screenshot service
    const svcBase = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'
    const idemKey = `looma-${Buffer.from(site.url).toString('base64').slice(0, 24)}`
    
    let imageUrl: string | null = null
    
    try {
      const enqueue = await fetch(`${svcBase}/api/screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idemKey,
        },
        body: JSON.stringify({ url: site.url, viewport: { width: 1200, height: 900 } }),
      })

      if (enqueue.ok) {
        const data = await enqueue.json()
        if (data.imageUrl) {
          imageUrl = data.imageUrl
        } else if (data.statusUrl) {
          // Poll for completion
          const deadline = Date.now() + 30_000
          while (Date.now() < deadline) {
            await new Promise(r => setTimeout(r, 1500))
            const statusRes = await fetch(`${svcBase}${data.statusUrl}`)
            if (!statusRes.ok) break
            const status = await statusRes.json()
            if (status.status === 'done' && status.imageUrl) {
              imageUrl = status.imageUrl
              break
            }
            if (status.status === 'error') break
          }
        }
      }
    } catch (e) {
      console.warn(`  Screenshot service error: ${(e as Error).message}`)
      return { success: false, error: 'Screenshot service unavailable' }
    }

    if (!imageUrl) {
      console.log(`  No screenshot URL returned`)
      return { success: false, error: 'No screenshot generated' }
    }

    // Step 2: Update site with imageUrl
    await prisma.site.update({
      where: { id: site.id },
      data: { imageUrl },
    })

    // Step 3: Fetch image and create Image record
    const resImg = await fetch(imageUrl)
    if (!resImg.ok) {
      return { success: false, error: 'Failed to fetch image' }
    }

    const ab = await resImg.arrayBuffer()
    const buf = Buffer.from(ab)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length

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

    // Step 4: Canonicalize and embed
    const { hash: contentHash } = await canonicalizeImage(buf)
    
    const existing = await prisma.imageEmbedding.findFirst({ 
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[]
    if (existing) {
      ivec = existing.vector as unknown as number[]
      await prisma.imageEmbedding.upsert({
        where: { imageId: image.id },
        update: { contentHash: contentHash } as any,
        create: { 
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

    // Step 5: Tag
    const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0)
    const concepts = await prisma.concept.findMany()
    const scored = concepts
      .map(c => ({ c, score: cos(ivec, (c.embedding as unknown as number[]) || []) }))
      .sort((a, b) => b.score - a.score)
    
    const aboveThreshold = scored.filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
    const chosen: typeof scored = []
    
    for (let i = 0; i < aboveThreshold.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
      const current = aboveThreshold[i]
      const prev = chosen[chosen.length - 1]
      
      if (chosen.length === 0) {
        chosen.push(current)
        continue
      }
      
      if (prev && prev.score > 0) {
        const dropPct = (prev.score - current.score) / prev.score
        if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
          break
        }
      }
      
      chosen.push(current)
    }
    
    const final = chosen.length > 0 ? chosen : scored.slice(0, TAG_CONFIG.FALLBACK_K)
    const chosenConceptIds = new Set(final.map(({ c }) => c.id))
    
    for (const { c, score } of final) {
      await prisma.imageTag.upsert({
        where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
        update: { score },
        create: { imageId: image.id, conceptId: c.id, score },
      })
    }

    // Cleanup old tags
    const existingTags = await prisma.imageTag.findMany({
      where: { imageId: image.id },
    })
    
    for (const existingTag of existingTags) {
      if (!chosenConceptIds.has(existingTag.conceptId)) {
        await prisma.imageTag.delete({
          where: { imageId_conceptId: { imageId: image.id, conceptId: existingTag.conceptId } },
        })
      }
    }

    console.log(`  ✓ Completed: ${final.length} tags created`)
    return { success: true, tagsCount: final.length }
  } catch (error) {
    console.error(`  ✗ Error: ${error instanceof Error ? error.message : String(error)}`)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

async function main() {
  // Get sites without images created today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const pendingSites = await prisma.site.findMany({
    where: {
      createdAt: { gte: today },
      imageUrl: null,
      images: { none: {} }
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log(`Found ${pendingSites.length} sites pending processing\n`)

  const results = []
  for (let i = 0; i < pendingSites.length; i++) {
    const site = pendingSites[i]
    console.log(`[${i + 1}/${pendingSites.length}] Processing ${site.title}...`)
    const result = await processSite(site)
    results.push({ ...result, url: site.url })
    
    // Small delay between sites
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n=== Summary ===')
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`Success: ${successful.length}/${pendingSites.length}`)
  console.log(`Failed: ${failed.length}/${pendingSites.length}`)
  
  if (failed.length > 0) {
    console.log('\nFailed URLs:')
    failed.forEach(r => console.log(`  - ${r.url}: ${r.error}`))
  }

  await prisma.$disconnect()
}

main().catch(console.error)

