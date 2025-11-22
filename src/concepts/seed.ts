import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import { embedTextBatch, meanVec, l2norm } from '../lib/embeddings'

type ConceptSeed = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  applicableCategories?: string[] // e.g. ["website", "packaging"]
  embeddingStrategy?: string // e.g. "generic", "website_style", "packaging_style"
}

const prisma = new PrismaClient()

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const txt = await fs.readFile(seedPath, 'utf-8')
  const items: ConceptSeed[] = JSON.parse(txt)

  let upserted = 0

  // Use centralized embedding generation to ensure consistency
  const { generateConceptEmbedding } = await import('../lib/concept-embeddings')
  
  for (const c of items) {
    let emb: number[]
    try {
      emb = await generateConceptEmbedding(
        c.label,
        c.synonyms || [],
        c.related || []
      )
    } catch (error: any) {
      console.warn(`No embeddings for concept ${c.id}: ${error.message}`)
      continue
    }

    // Set defaults for category metadata
    const applicableCategories = c.applicableCategories || ['website']
    const embeddingStrategy = c.embeddingStrategy || 'website_style'
    
    const row = await prisma.concept.upsert({
      where: { id: c.id },
      update: {
        label: c.label,
        locale: 'en',
        synonyms: c.synonyms,
        related: c.related,
        weight: 1.0,
        embedding: emb,
        applicableCategories: applicableCategories,
        embeddingStrategy: embeddingStrategy,
      },
      create: {
        id: c.id,
        label: c.label,
        locale: 'en',
        synonyms: c.synonyms,
        related: c.related,
        weight: 1.0,
        embedding: emb,
        applicableCategories: applicableCategories,
        embeddingStrategy: embeddingStrategy,
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


