// scripts/reembed_missing_inuse.ts
// Re-embed images that are currently in use (site.imageUrl) but missing embeddings, then re-apply tags

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer } from '../src/lib/embeddings'
import { tagImage } from '../src/jobs/tagging'

async function main() {
  console.log('🧬 Re-embedding in-use images missing embeddings...')

  const sites = await prisma.site.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, imageUrl: true },
  })

  const targets: { imageId: string; url: string }[] = []

  for (const s of sites) {
    if (!s.imageUrl) continue
    const img = await prisma.image.findFirst({ where: { siteId: s.id, url: s.imageUrl } })
    if (!img) continue
    const emb = await prisma.imageEmbedding.findUnique({ where: { imageId: img.id } })
    if (!emb) {
      targets.push({ imageId: img.id, url: img.url })
    }
  }

  console.log(`📌 Missing embeddings for ${targets.length} in-use images`)

  let fixed = 0
  for (const t of targets) {
    try {
      const res = await fetch(t.url)
      if (!res.ok) {
        console.warn(`  ⚠️  Failed to fetch ${t.url} (HTTP ${res.status})`)
        continue
      }
      const ab = await res.arrayBuffer()
      const buf = Buffer.from(ab)
      const { vector, contentHash } = await embedImageFromBuffer(buf)

      await prisma.imageEmbedding.upsert({
        where: { imageId: t.imageId },
        update: { model: 'clip-ViT-L/14', vector: vector as any, contentHash: contentHash as any },
        create: { imageId: t.imageId, model: 'clip-ViT-L/14', vector: vector as any, contentHash: contentHash as any },
      })

      // Re-apply tags for this image only
      await tagImage(t.imageId)

      fixed++
      console.log(`  ✓ Re-embedded and retagged ${t.imageId}`)
    } catch (e: any) {
      console.error(`  ❌ Error re-embedding ${t.imageId}:`, e.message)
    }
  }

  console.log(`\n✅ Done. Fixed ${fixed}/${targets.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
