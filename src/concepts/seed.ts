import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import { embedTextBatch, meanVec, l2norm } from '../lib/embeddings'

type ConceptSeed = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
}

const prisma = new PrismaClient()

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const txt = await fs.readFile(seedPath, 'utf-8')
  const items: ConceptSeed[] = JSON.parse(txt)

  let upserted = 0

  for (const c of items) {
    const tokens = [c.label, ...(c.synonyms || []), ...(c.related || [])]
    const prompts = tokens.map(t => `website UI with a ${t} visual style`)
    const vecs = await embedTextBatch(prompts)
    if (vecs.length === 0) {
      console.warn('No embeddings for concept', c.id)
      continue
    }
    const avg = meanVec(vecs)
    const emb = l2norm(avg)

    const row = await prisma.concept.upsert({
      where: { id: c.id },
      update: {
        label: c.label,
        locale: 'en',
        synonyms: c.synonyms,
        related: c.related,
        weight: 1.0,
        embedding: emb,
      },
      create: {
        id: c.id,
        label: c.label,
        locale: 'en',
        synonyms: c.synonyms,
        related: c.related,
        weight: 1.0,
        embedding: emb,
      }
    })

    upserted++
    const preview = (emb.slice(0, 4) as number[]).map(v => v.toFixed(4))
    console.log(`Upserted concept ${row.id} (${row.label}) emb[0..3]=[${preview.join(', ')}]`)
  }

  console.log(`Completed. Upserted ${upserted} concepts.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})


