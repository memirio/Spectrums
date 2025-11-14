import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function retagImage(imageId: string) {
  const image = await prisma.image.findUnique({ where: { id: imageId } })
  if (!image) return

  // Get existing embedding
  const existing = await prisma.imageEmbedding.findUnique({ 
    where: { imageId: image.id } 
  })
  
  if (!existing) {
    // No embedding, skip
    return
  }

  const ivec = existing.vector as unknown as number[]
  const { TAG_CONFIG } = await import('../src/lib/tagging-config')
  const concepts = await prisma.concept.findMany()
  
  const scores = concepts.map(c => ({
    conceptId: c.id,
    score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || []),
  }))
  scores.sort((a, b) => b.score - a.score)
  
  // Apply new threshold (0.18) and drop percentage (30%)
  const aboveThreshold = scores.filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
  const chosen: typeof scores = []
  
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
  
  const final = chosen.length > 0 ? chosen : scores.slice(0, TAG_CONFIG.FALLBACK_K)
  const chosenConceptIds = new Set(final.map(t => t.conceptId))

  // Upsert tags
  for (const t of final) {
    await prisma.imageTag.upsert({
      where: { imageId_conceptId: { imageId: image.id, conceptId: t.conceptId } },
      update: { score: t.score },
      create: { imageId: image.id, conceptId: t.conceptId, score: t.score },
    })
  }

  // Delete tags that are no longer in top-K
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
}

async function retagAllImages() {
  console.log('🔄 Starting fast retagging of all images with new threshold (0.18)...\n')
  console.log('(Skipping Gemini concept generation for speed)\n')

  const images = await prisma.image.findMany({
    where: {
      embedding: {
        isNot: null
      }
    },
    include: {
      site: true,
      embedding: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log(`Found ${images.length} images to retag\n`)
  console.log('='.repeat(80))

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ imageId: string; url: string; error: string }> = []

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const site = image.site
    const progress = `[${i + 1}/${images.length}]`

    try {
      if ((i + 1) % 10 === 0 || i === 0) {
        console.log(`${progress} Processing: ${site?.title || 'Unknown'}`)
      }
      
      await retagImage(image.id)
      
      successCount++
      
      if ((i + 1) % 20 === 0) {
        console.log(`✅ Progress: ${i + 1}/${images.length} (${successCount} success, ${errorCount} errors)`)
      }
    } catch (error: any) {
      errorCount++
      const errorMsg = error?.message || String(error)
      errors.push({
        imageId: image.id,
        url: site?.url || 'N/A',
        error: errorMsg
      })
      console.error(`${progress} ❌ Error: ${errorMsg}`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 Retagging Complete!\n')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📈 Total: ${images.length}`)

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.slice(0, 10).forEach(e => {
      console.log(`  - ${e.url}: ${e.error}`)
    })
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`)
    }
  }

  console.log('\n✨ All images have been retagged with the new threshold (0.18)')
}

retagAllImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

