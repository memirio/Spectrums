import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function runQuery(q: string) {
  console.log(`\n=== Query: ${q} ===`)
  const queryTerms = q.split(/[,+\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean)
  const [queryVec] = await embedTextBatch([q.trim()])
  const dim = queryVec.length

  const [concepts, images] = await Promise.all([
    prisma.concept.findMany(),
    prisma.image.findMany({ where: { embedding: { isNot: null } }, include: { embedding: true, site: true } }) as any
  ])

  const matchedConceptIds = new Set<string>()
  for (const term of queryTerms) {
    for (const c of concepts) {
      const conceptId = c.id.toLowerCase()
      const label = c.label.toLowerCase()
      const synonyms = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
      if (conceptId === term || label === term || synonyms.includes(term)) {
        matchedConceptIds.add(c.id)
      }
    }
  }

  const allImageIds = images.map((img: any) => img.id)
  const tags = allImageIds.length > 0 ? await prisma.imageTag.findMany({ where: { imageId: { in: allImageIds } } as any }) : []

  const byImageAll: Map<string, Array<{ conceptId: string; score: number }>> = new Map()
  for (const t of tags) {
    if (!byImageAll.has(t.imageId)) byImageAll.set(t.imageId, [])
    byImageAll.get(t.imageId)!.push({ conceptId: t.conceptId, score: t.score })
  }

  const byImageMatch: Map<string, Map<string, number>> = new Map()
  if (matchedConceptIds.size > 0) {
    for (const t of tags) {
      if (!matchedConceptIds.has(t.conceptId)) continue
      if (!byImageMatch.has(t.imageId)) byImageMatch.set(t.imageId, new Map())
      byImageMatch.get(t.imageId)!.set(t.conceptId, t.score)
    }
  }

  type Row = { siteUrl: string; siteTitle: string; score: number; directHits: number; relatedSum: number; base: number }
  const rows: Row[] = []
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== dim) continue
    const base = cosine(queryVec, ivec)

    const allTags = byImageAll.get(img.id) || []
    const imgMatches = byImageMatch.get(img.id)

    let directSum = 0
    let relatedMax = 0
    let directHits = 0
    if (imgMatches && matchedConceptIds.size > 0) {
      for (const cid of matchedConceptIds) {
        const s = imgMatches.get(cid)
        if (s !== undefined) {
          directSum += s
          directHits++
        }
      }
      // related-only preview: take only strongest non-direct tag as related max
      for (const { conceptId, score } of allTags) {
        if (matchedConceptIds.has(conceptId)) continue
        if (score > relatedMax) relatedMax = score
      }
    }

    const DIRECT_MULT = 10
    const ZERO_WITH_DIRECT = 0.10
    const ZERO_WITH_RELATED = 0.10
    const RELATED_MIN = 0.20

    let final = base
    if (directSum > 0 || relatedMax > 0) {
      if (directSum > 0) {
        const tagScore = DIRECT_MULT * directSum
        final = tagScore + base * ZERO_WITH_DIRECT
      } else if (relatedMax >= RELATED_MIN) {
        const tagScore = relatedMax
        final = tagScore + base * ZERO_WITH_RELATED
      } else {
        final = base * ZERO_WITH_RELATED
      }
    }

    if (img.site) {
      rows.push({ siteUrl: img.site.url, siteTitle: img.site.title || img.site.url, score: final, directHits, relatedSum: relatedMax, base })
    }
  }

  rows.sort((a, b) => b.score - a.score)
  const top = rows.slice(0, 20)
  for (const r of top) {
    console.log(`- ${r.siteTitle} | ${r.siteUrl} | score=${r.score.toFixed(3)} | direct=${r.directHits} base=${r.base.toFixed(3)}`)
  }
}

async function main() {
  const queries = ['3d', 'color', 'illustration', 'color + grid']
  for (const q of queries) {
    await runQuery(q)
  }
}

main().catch(e => { console.error('Script failed:', e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })


