// scripts/apply_tags_to_all.ts
// Apply tags to ALL images using existing concept embeddings (no Gemini)

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

function cos(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

// Use TAG_CONFIG values to match the actual tagging system
import { TAG_CONFIG } from '../src/lib/tagging-config'

const MIN_SCORE = TAG_CONFIG.MIN_SCORE // 0.20
const MAX_K = TAG_CONFIG.MAX_K // 700 (was 200 - this was the problem!)
const MIN_SCORE_DROP_PCT = TAG_CONFIG.MIN_SCORE_DROP_PCT // 0.30 (was 0.4)
const ALPHA_OF_MAX = 0.48 // Keep this for backward compatibility
const MIN_TAGS_PER_IMAGE = TAG_CONFIG.FALLBACK_K // 6 (was 8, but use FALLBACK_K from config)

async function main() {
  console.log('🏷️  Applying tags to ALL images (no Gemini calls)...\n')

  const concepts = await prisma.concept.findMany({})
  if (concepts.length === 0) {
    console.error('No concepts found. Aborting.')
    process.exit(1)
  }

  const images = await prisma.image.findMany({ select: { id: true, url: true } })
  console.log(`📊 Found ${images.length} images to tag\n`)

  let processed = 0
  let errors = 0
  let skipped = 0

  for (const image of images) {
    try {
      const emb = await prisma.imageEmbedding.findUnique({ where: { imageId: image.id } })
      const ivec = (emb?.vector as unknown as number[]) || []
      if (ivec.length === 0) {
        skipped++
        continue
      }

      const scored = concepts.map(c => ({
        id: c.id,
        label: c.label,
        score: cos(ivec, (c.embedding as unknown as number[]) || [])
      }))
      scored.sort((a, b) => b.score - a.score)

      const chosen: typeof scored = []
      const maxScore = scored.length > 0 ? scored[0].score : 0
      for (const s of scored) {
        if (s.score < MIN_SCORE) break
        if (s.score < maxScore * ALPHA_OF_MAX) break
        if (chosen.length === 0) {
          chosen.push(s)
          continue
        }
        const prev = chosen[chosen.length - 1].score
        if (s.score >= prev * (1 - MIN_SCORE_DROP_PCT)) {
          chosen.push(s)
        } else {
          break
        }
        if (chosen.length >= MAX_K) break
      }

      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        const fallback = scored.slice(0, MIN_TAGS_PER_IMAGE)
        const keep = new Set(chosen.map(c => c.id))
        for (const f of fallback) {
          if (!keep.has(f.id)) {
            chosen.push(f)
            keep.add(f.id)
          }
        }
      }

      // Upsert chosen and prune others
      for (const s of chosen) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: s.id } },
          update: { score: s.score },
          create: { imageId: image.id, conceptId: s.id, score: s.score },
        })
      }

      const keepIds = new Set(chosen.map(s => s.id))
      await prisma.imageTag.deleteMany({ where: { imageId: image.id, conceptId: { notIn: Array.from(keepIds) } } })

      processed++
      if (processed % 25 === 0) {
        console.log(`  ✓ Tagged ${processed}/${images.length} (skipped ${skipped})`)
      }
    } catch (e: any) {
      errors++
      console.error(`  ❌ Error tagging image ${image.id}:`, e.message)
    }
  }

  console.log('\n✅ Tag application complete!')
  console.log(`  Processed: ${processed}`)
  console.log(`  Skipped (no embedding): ${skipped}`)
  console.log(`  Errors: ${errors}`)
}

main().catch(e => { console.error(e); process.exit(1) })
