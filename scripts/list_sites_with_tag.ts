// scripts/list_sites_with_tag.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function findConceptIds(term: string): Promise<string[]> {
  const t = term.toLowerCase().trim()
  const concepts = await prisma.concept.findMany()
  const ids: string[] = []
  for (const c of concepts) {
    const id = c.id.toLowerCase()
    const label = c.label.toLowerCase()
    const syn = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
    if (id === t || label === t || syn.includes(t)) ids.push(c.id)
  }
  return Array.from(new Set(ids))
}

async function main() {
  const term = (process.argv[2] || '3d').trim()
  const conceptIds = await findConceptIds(term)
  if (conceptIds.length === 0) {
    console.log(`No concept found for term: ${term}`)
    process.exit(0)
  }
  console.log(`Concept IDs for "${term}": ${conceptIds.join(', ')}`)

  const tags = await prisma.imageTag.findMany({
    where: { conceptId: { in: conceptIds } },
    include: { image: { include: { site: true } } },
  })

  const siteMap = new Map<string, { title: string; url: string; maxScore: number }>()
  for (const t of tags) {
    const site = t.image?.site
    if (!site) continue
    const cur = siteMap.get(site.id)
    if (!cur || t.score > cur.maxScore) {
      siteMap.set(site.id, { title: site.title, url: site.url, maxScore: t.score })
    }
  }

  const list = Array.from(siteMap.values()).sort((a, b) => b.maxScore - a.maxScore)
  console.log(`\nSites tagged with "${term}" (${list.length}):`)
  for (const s of list) {
    console.log(`- ${s.title} | ${s.url} | score=${s.maxScore.toFixed(3)}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
