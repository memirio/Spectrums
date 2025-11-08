// scripts/tune_3d_concept.ts
import 'dotenv/config'
import * as fs from 'fs/promises'
import * as path from 'path'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch, l2norm } from '../src/lib/embeddings'

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const raw = await fs.readFile(seedPath, 'utf-8')
  const concepts: any[] = JSON.parse(raw)

  const targetIdx = concepts.findIndex(c => String(c.id).toLowerCase() === '3d' || String(c.label).toLowerCase() === '3d')
  if (targetIdx === -1) {
    console.error('3d concept not found in seed')
    process.exit(1)
  }

  const preciseSynonyms = [
    'three-dimensional',
    '3d-rendering',
    '3d-model',
    'volumetric',
    'polygonal',
    'mesh',
    'occlusion',
    'raytraced',
    'depth-cue',
    'shaded'
  ]
  const preciseRelated = [
    'lighting',
    'shadows',
    'perspective',
    'parallax',
    'extrusion',
    'subsurface-scattering',
    'normal-map',
    'texture-map'
  ]

  concepts[targetIdx].synonyms = preciseSynonyms
  concepts[targetIdx].related = preciseRelated

  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  console.log('✓ Updated 3d concept synonyms/related in seed')

  // Re-embed just this concept and update DB
  const c = concepts[targetIdx]
  const prompt = `${c.label}. Synonyms: ${c.synonyms.join(', ')}. Related: ${c.related.join(', ')}.`
  const [vec] = await embedTextBatch([prompt])
  const emb = l2norm(vec)
  await prisma.concept.update({ where: { id: c.id }, data: { synonyms: c.synonyms, related: c.related, embedding: emb as any } })
  console.log('✓ Re-embedded 3d concept in DB')
}

main().catch(e => { console.error(e); process.exit(1) })
