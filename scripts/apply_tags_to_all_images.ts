// scripts/apply_tags_to_all_images.ts
// Apply tags to images that are currently in use on the site (site.imageUrl)
// Uses existing concept embeddings and image embeddings; does not call Gemini

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { TAG_CONFIG } from '../src/lib/tagging-config'

function cos(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

// Use TAG_CONFIG for consistency
const MIN_SCORE = TAG_CONFIG.MIN_SCORE
const MAX_K = TAG_CONFIG.MAX_K
const MIN_SCORE_DROP_PCT = TAG_CONFIG.MIN_SCORE_DROP_PCT
const MIN_TAGS_PER_IMAGE = 8 // Minimum tags per image for coverage

async function main() {
  console.log('🏷️  Applying tags to images in use (no Gemini calls)...\n')

  // Load all concepts with embeddings
  const concepts = await prisma.concept.findMany({})
  if (concepts.length === 0) {
    console.error('No concepts found. Aborting.')
    process.exit(1)
  }

  // Find sites with imageUrl set (images currently in use in UI)
  const sites = await prisma.site.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, title: true, url: true, imageUrl: true },
  })

  // Resolve image records for those URLs
  const images: { id: string; url: string; siteId: string }[] = []
  for (const s of sites) {
    if (!s.imageUrl) continue
    const img = await prisma.image.findFirst({ where: { siteId: s.id, url: s.imageUrl } })
    if (img) images.push({ id: img.id, url: img.url, siteId: s.id })
  }

  console.log(`📊 Found ${images.length} images in use to tag\n`)

  let processed = 0
  let errors = 0

  for (const image of images) {
    try {
      const emb = await prisma.imageEmbedding.findUnique({ where: { imageId: image.id } })
      const ivec = (emb?.vector as unknown as number[]) || []
      if (ivec.length === 0) {
        console.warn(`  ⚠️  Missing embedding for image ${image.id}, skipping`)
        continue
      }

      const scored = concepts.map(c => ({
        id: c.id,
        label: c.label,
        score: cos(ivec, (c.embedding as unknown as number[]) || [])
      }))
      scored.sort((a, b) => b.score - a.score)

      // Pragmatic tagging: keep while score >= MIN_SCORE, within drop threshold from last kept
      const chosen: typeof scored = []
      const maxScore = scored.length > 0 ? scored[0].score : 0
      let prevScore = maxScore
      
      for (const s of scored) {
        if (chosen.length >= MAX_K) break
        
        if (s.score < MIN_SCORE) {
          // If we haven't met MIN_TAGS_PER_IMAGE yet, add it anyway
          if (chosen.length < MIN_TAGS_PER_IMAGE) {
            chosen.push(s)
            prevScore = s.score
            continue
          } else {
            break // Below min score and already have enough tags
          }
        }
        
        // Check if score drop is acceptable
        const dropPct = (prevScore - s.score) / prevScore
        if (dropPct > MIN_SCORE_DROP_PCT) {
          // If we haven't met MIN_TAGS_PER_IMAGE yet, add it anyway
          if (chosen.length < MIN_TAGS_PER_IMAGE) {
            chosen.push(s)
            prevScore = s.score
          } else {
            break // Significant drop and already have enough tags
          }
        } else {
          chosen.push(s)
          prevScore = s.score
        }
      }

      // Fallback: ensure minimum tags for coverage (force fill even if below MIN_SCORE)
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        const fallback = scored.slice(0, MIN_TAGS_PER_IMAGE)
        // Merge without duplicates
        const keep = new Set(chosen.map(c => c.id))
        for (const f of fallback) {
          if (!keep.has(f.id)) {
            chosen.push(f)
            keep.add(f.id)
          }
        }
      }

      // Upsert chosen tags
      for (const s of chosen) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: s.id } },
          update: { score: s.score },
          create: { imageId: image.id, conceptId: s.id, score: s.score },
        })
      }

      // Optionally prune tags not in chosen (keep DB tidy)
      const keepIds = new Set(chosen.map(s => s.id))
      await prisma.imageTag.deleteMany({
        where: { imageId: image.id, conceptId: { notIn: Array.from(keepIds) } },
      })

      processed++
      if (processed % 10 === 0) {
        console.log(`  ✓ Tagged ${processed}/${images.length}`)
      }
    } catch (e: any) {
      errors++
      console.error(`  ❌ Error tagging image ${image.id}:`, e.message)
    }
  }

  console.log('\n✅ Tag application complete!')
  console.log(`  Processed: ${processed}`)
  console.log(`  Errors: ${errors}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
