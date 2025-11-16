import { PrismaClient } from '@prisma/client'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import sharp from 'sharp'

const prisma = new PrismaClient()

async function processSite(site: any) {
  try {
    if (!site.imageUrl) {
      return { success: false, error: 'No imageUrl' }
    }

    // Check if Image already exists
    const existingImage = await prisma.image.findFirst({
      where: { siteId: site.id },
    })

    if (existingImage) {
      return { success: true, skipped: true, message: 'Image already exists' }
    }

    // Fetch image
    const resImg = await fetch(site.imageUrl)
    if (!resImg.ok) {
      return { success: false, error: `Failed to fetch image: ${resImg.status}` }
    }

    const ab = await resImg.arrayBuffer()
    const buf = Buffer.from(ab)
    const meta = await sharp(buf, { limitInputPixels: false }).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const bytes = buf.length

    // Create Image record
    const image = await (prisma.image as any).upsert({
      where: { siteId_url: { siteId: site.id, url: site.imageUrl } },
      update: { width, height, bytes },
      create: {
        siteId: site.id,
        url: site.imageUrl,
        width,
        height,
        bytes,
      },
    })

    // Canonicalize and embed
    const { hash: contentHash } = await canonicalizeImage(buf)
    
    // Check if embedding exists for this contentHash (may be for different image)
    const existingByHash = await prisma.imageEmbedding.findFirst({ 
      where: { contentHash: contentHash } as any
    })
    
    // Check if embedding exists for this specific image
    const existingByImage = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id } as any
    })
    
    let ivec: number[]
    if (existingByHash) {
      // Reuse existing embedding vector
      ivec = existingByHash.vector as unknown as number[]
      
      if (existingByImage) {
        // Update existing embedding for this image
        await prisma.imageEmbedding.update({
          where: { imageId: image.id } as any,
          data: { contentHash: contentHash } as any,
        })
      } else {
        // Create new embedding for this image, but reuse the vector
        try {
          await prisma.imageEmbedding.create({
            data: { 
              imageId: image.id, 
              model: existingByHash.model, 
              vector: existingByHash.vector as any, 
              contentHash: contentHash 
            } as any,
          })
        } catch (e: any) {
          // If contentHash already exists (unique constraint), reuse the existing one
          if (e.code === 'P2002' && e.meta?.target?.includes('contentHash')) {
            // ContentHash already exists for a different image - just skip creating a new one
            // The existingByHash already has the correct vector and contentHash
            // We don't need to create a duplicate embedding
            console.log(`  ContentHash already exists, reusing embedding`)
          } else {
            throw e
          }
        }
      }
    } else {
      // Compute new embedding
      const result = await embedImageFromBuffer(buf)
      ivec = result.vector
      
      if (existingByImage) {
        // Update existing embedding for this image
        await prisma.imageEmbedding.update({
          where: { imageId: image.id } as any,
          data: { 
            vector: ivec as any, 
            model: 'clip-ViT-L/14', 
            contentHash: contentHash 
          } as any,
        })
      } else {
        // Create new embedding
        try {
          await prisma.imageEmbedding.create({
            data: { 
              imageId: image.id, 
              vector: ivec as any, 
              model: 'clip-ViT-L/14', 
              contentHash: contentHash 
            } as any,
          })
        } catch (e: any) {
          // If contentHash already exists, update instead
          if (e.code === 'P2002' && e.meta?.target?.includes('contentHash')) {
            await prisma.imageEmbedding.update({
              where: { imageId: image.id } as any,
              data: { 
                vector: ivec as any, 
                model: 'clip-ViT-L/14', 
                contentHash: contentHash 
              } as any,
            })
          } else {
            throw e
          }
        }
      }
    }

    // Tag using zero-shot CLIP (new approach)
    const { tagImageWithZeroShot } = await import('../src/lib/tagging-zero-shot')
    const concepts = await prisma.concept.findMany()
    
    const tagResults = await tagImageWithZeroShot(
      ivec,
      concepts.map(c => ({
        id: c.id,
        label: c.label,
        synonyms: c.synonyms,
        related: c.related
      })),
      TAG_CONFIG.MIN_SCORE,
      TAG_CONFIG.MAX_K,
      TAG_CONFIG.MIN_SCORE_DROP_PCT
    )
    
    const final = tagResults.map(t => ({ c: concepts.find(c => c.id === t.conceptId)!, score: t.score }))
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

    return { success: true, tagsCount: final.length }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

async function main() {
  // Find sites with imageUrl but no Image records
  const sitesToProcess = await prisma.site.findMany({
    where: {
      imageUrl: { not: null },
      images: { none: {} }
    },
    orderBy: { createdAt: 'desc' },
    take: 200, // Process up to 200 at a time
  })

  console.log(`Found ${sitesToProcess.length} sites with screenshots to process\n`)

  const results = []
  for (let i = 0; i < sitesToProcess.length; i++) {
    const site = sitesToProcess[i]
    console.log(`[${i + 1}/${sitesToProcess.length}] Processing ${site.title}...`)
    const result = await processSite(site)
    results.push({ ...result, url: site.url })
    
    if (result.success) {
      if (result.skipped) {
        console.log(`  ⊘ Skipped (already processed)`)
      } else {
        console.log(`  ✓ Processed (${result.tagsCount} tags)`)
      }
    } else {
      console.log(`  ✗ ${result.error}`)
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n=== Summary ===')
  const successful = results.filter(r => r.success && !r.skipped)
  const skipped = results.filter(r => r.skipped)
  const failed = results.filter(r => !r.success)
  
  console.log(`Processed: ${successful.length}/${sitesToProcess.length}`)
  console.log(`Skipped: ${skipped.length}/${sitesToProcess.length}`)
  console.log(`Failed: ${failed.length}/${sitesToProcess.length}`)

  await prisma.$disconnect()
}

main().catch(console.error)

