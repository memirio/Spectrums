import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'
import fs from 'fs/promises'
import path from 'path'

type ConceptSeed = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  category?: string // optional category for filtering
}

// Parse command-line arguments
const args = process.argv.slice(2)
const force = args.includes('--force')
const onlyFlag = args.find(arg => arg.startsWith('--only='))
const onlyCategory = onlyFlag ? onlyFlag.split('=')[1] : null

// Build embedding prompt: "<label>. Synonyms: <synonyms-joined>. Related: <related-joined>."
function buildPrompt(c: ConceptSeed): string {
  const synStr = c.synonyms.length > 0 ? c.synonyms.join(', ') : ''
  const relStr = c.related.length > 0 ? c.related.join(', ') : ''
  
  let prompt = c.label
  if (synStr) prompt += `. Synonyms: ${synStr}`
  if (relStr) prompt += `. Related: ${relStr}`
  
  return prompt
}

// Ensure vector is unit-normalized
function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1
  return vec.map(x => x / norm)
}

async function main() {
  // Load seed concepts
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const txt = await fs.readFile(seedPath, 'utf-8')
  let items: ConceptSeed[] = JSON.parse(txt)
  
  // Filter by category if --only specified
  if (onlyCategory) {
    items = items.filter(c => c.category === onlyCategory)
    if (items.length === 0) {
      console.error(`No concepts found for category: ${onlyCategory}`)
      process.exit(1)
    }
    console.log(`[seed] Filtering to category: ${onlyCategory} (${items.length} concepts)`)
  }
  
  // Check if concepts exist
  const existingCount = await prisma.concept.count()
  if (existingCount === 0 && !force) {
    console.warn('⚠️  No concepts exist in database. Use --force to seed anyway.')
    process.exit(1)
  }
  
  console.log(`[seed] Processing ${items.length} concepts...`)
  console.log(`[seed] Force mode: ${force ? 'ON (will re-embed)' : 'OFF (preserve existing)'}`)
  
  // Build prompts and batch embed
  const prompts = items.map(buildPrompt)
  const vecs = await embedTextBatch(prompts)
  
  if (vecs.length !== items.length) {
    console.error(`Embedding mismatch: ${items.length} concepts but ${vecs.length} vectors`)
    process.exit(1)
  }
  
  // Normalize all vectors
  const normalizedVecs = vecs.map(normalize)
  
  let created = 0
  let updated = 0
  let skipped = 0
  
  // Upsert each concept
  for (let i = 0; i < items.length; i++) {
    const c = items[i]
    const emb = normalizedVecs[i]
    
    // Check if concept exists
    const existing = await prisma.concept.findUnique({ where: { id: c.id } })
    
    let action: 'created' | 'updated' | 'skipped'
    if (!existing) {
      // Create new
      await prisma.concept.create({
        data: {
          id: c.id,
          label: c.label,
          locale: 'en',
          synonyms: c.synonyms as any,
          related: c.related as any,
          weight: 1.0,
          embedding: emb as any,
        },
      })
      action = 'created'
      created++
    } else if (force) {
      // Force update (re-embed)
      await prisma.concept.update({
        where: { id: c.id },
        data: {
          label: c.label,
          locale: 'en',
          synonyms: c.synonyms as any,
          related: c.related as any,
          embedding: emb as any,
        },
      })
      action = 'updated'
      updated++
    } else {
      // Preserve existing
      action = 'skipped'
      skipped++
    }
    
    // Log summary for each concept
    const preview = emb.slice(0, 4).map(v => v.toFixed(4)).join(', ')
    const normCheck = Math.sqrt(emb.reduce((s, x) => s + x * x, 0))
    console.log(
      `  ${action.padEnd(8)} ${c.id.padEnd(20)} ` +
      `synonyms:${c.synonyms.length.toString().padStart(2)} ` +
      `related:${c.related.length.toString().padStart(2)} ` +
      `dim:${emb.length} norm:${normCheck.toFixed(3)} [${preview}...]`
    )
  }
  
  // Final summary
  console.log('\n[seed] Summary:')
  console.log(`  Created:  ${created}`)
  console.log(`  Updated:  ${updated}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Total:    ${items.length}`)
  console.log('[seed] Done.')
}

main()
  .catch(err => {
    console.error('[seed] Error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
