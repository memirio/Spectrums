// scripts/force_tag_topN.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

function cos(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function findConcept(term: string) {
  const t = term.toLowerCase().trim()
  const all = await prisma.concept.findMany()
  for (const c of all) {
    const id = c.id.toLowerCase()
    const label = c.label.toLowerCase()
    const syn = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
    if (id === t || label === t || syn.includes(t)) return c
  }
  return null
}

async function main() {
  const term = (process.argv[2] || '3d').trim()
  const minScore = parseFloat(process.argv[3] || '0.18')
  const maxN = parseInt(process.argv[4] || '100', 10)

  const concept = await findConcept(term)
  if (!concept) {
    console.error('Concept not found for:', term)
    process.exit(1)
  }
  const cvec = (concept.embedding as unknown as number[]) || []
  if (cvec.length === 0) {
    console.error('Concept embedding missing')
    process.exit(1)
  }

  const images = await (prisma.image.findMany as any)({ include: { embedding: true, site: true } })
  const scored: Array<{ imageId: string; score: number }> = []
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== cvec.length) continue
    const s = cos(ivec, cvec)
    if (s >= minScore) scored.push({ imageId: img.id, score: s })
  }
  scored.sort((a, b) => b.score - a.score)
  const chosen = scored.slice(0, maxN)

  console.log(`Force-tagging ${chosen.length} images for concept "${concept.id}" with minScore=${minScore}`)

  let upserts = 0
  for (const it of chosen) {
    await prisma.imageTag.upsert({
      where: { imageId_conceptId: { imageId: it.imageId, conceptId: concept.id } },
      update: { score: it.score },
      create: { imageId: it.imageId, conceptId: concept.id, score: it.score },
    })
    upserts++
  }

  const total = await prisma.imageTag.count({ where: { conceptId: concept.id } })
  console.log(`Upserts: ${upserts}, total 3d tags now: ${total}`)
}

main().catch(e => { console.error(e); process.exit(1) })
