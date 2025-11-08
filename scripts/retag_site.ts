#!/usr/bin/env tsx
/**
 * Retag a Site by URL
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings'
import { TAG_CONFIG } from '../src/lib/tagging-config'

function cosine(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0)
}

async function main() {
  const siteUrl = process.argv[2]
  if (!siteUrl) {
    console.error('Usage: tsx scripts/retag_site.ts <site-url>')
    process.exit(1)
  }

  const site = await prisma.site.findFirst({
    where: { url: { contains: siteUrl } },
    include: { images: { include: { embedding: true } } }
  })

  if (!site) {
    console.error(`Site not found: ${siteUrl}`)
    process.exit(1)
  }

  if (!site.images || site.images.length === 0) {
    console.error(`Site has no images: ${site.title}`)
    process.exit(1)
  }

  const image = site.images[0]
  if (!image.url) {
    console.error(`Image has no URL`)
    process.exit(1)
  }

  console.log(`Retagging: ${site.title}`)
  console.log(`  URL: ${site.url}`)
  console.log(`  Image: ${image.url}`)

  // Fetch and embed
  const res = await fetch(image.url)
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const { hash: contentHash } = await canonicalizeImage(buf)
  const result = await embedImageFromBuffer(buf)
  const ivec = result.vector

  // Update embedding if needed
  await prisma.imageEmbedding.upsert({
    where: { imageId: image.id } as any,
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

  // Score and tag
  const concepts = await prisma.concept.findMany()
  const scored = concepts
    .map(c => ({
      c,
      score: cosine(ivec, (c.embedding as unknown as number[]) || [])
    }))
    .sort((a, b) => b.score - a.score)

  const chosen = scored.filter(s => s.score >= TAG_CONFIG.MIN_SCORE).slice(0, TAG_CONFIG.TOP_K)
    || scored.slice(0, TAG_CONFIG.FALLBACK_K)

  // Delete old tags
  await prisma.imageTag.deleteMany({
    where: { imageId: image.id }
  })

  // Create new tags
  for (const { c, score } of chosen) {
    await prisma.imageTag.upsert({
      where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
      update: { score },
      create: { imageId: image.id, conceptId: c.id, score },
    })
  }

  console.log(`\n✅ Tagged with ${chosen.length} concepts:`)
  chosen.forEach(({ c, score }) => {
    console.log(`   - ${c.label}: ${score.toFixed(3)}`)
  })
}

main().finally(() => prisma.$disconnect())

