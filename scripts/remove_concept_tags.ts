// scripts/remove_concept_tags.ts
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
    console.log('No concept ids found for', term)
    process.exit(0)
  }
  let deleted = 0
  for (const cid of conceptIds) {
    const n = await prisma.imageTag.deleteMany({ where: { conceptId: cid } })
    deleted += n.count
  }
  console.log(`Removed ${deleted} tags for term ${term}`)
}

main().catch(e => { console.error(e); process.exit(1) })
