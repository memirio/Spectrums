// scripts/enrich_concepts.ts
// Ensure each concept has >=5 synonyms and >=5 related terms, normalize compounds, update DB embeddings

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs/promises'
import * as path from 'path'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function toId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function splitCompound(label: string): { core: string; modifiers: string[] } {
  const parts = label.split(/\s+|-/).filter(Boolean)
  if (parts.length <= 1) return { core: label, modifiers: [] }
  return { core: parts[parts.length - 1], modifiers: parts.slice(0, -1) }
}

function uniqueList(list: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const s of list) {
    const k = String(s || '').trim()
    if (!k) continue
    if (!seen.has(k.toLowerCase())) {
      seen.add(k.toLowerCase())
      out.push(k)
    }
  }
  return out
}

function generateSynonymCandidates(label: string): string[] {
  const s = label.trim()
  const lower = s.toLowerCase()
  const cand: string[] = []
  cand.push(lower)
  // Morphological variants
  if (lower.endsWith('y')) {
    cand.push(lower.slice(0, -1) + 'ies')
    cand.push(lower.slice(0, -1) + 'iness')
    cand.push(lower.slice(0, -1) + 'iful')
  }
  if (lower.endsWith('e')) {
    cand.push(lower + 'd')
    cand.push(lower + 'r')
  }
  // Basic derivations
  if (!lower.endsWith('s')) cand.push(lower + 's')
  if (!lower.endsWith('ed')) cand.push(lower + 'ed')
  if (!lower.endsWith('ing')) cand.push(lower + 'ing')
  if (lower.endsWith('ing')) cand.push(lower.slice(0, -3))
  cand.push(lower + 'ness')
  cand.push(lower + 'ic')
  cand.push(lower + 'ical')
  return uniqueList(cand)
}

const CATEGORY_SEEDS: Record<string, string[]> = {
  'Feeling / Emotion': ['emotion', 'mood', 'sentiment', 'affect', 'tone', 'vibe', 'temperament'],
  'Vibe / Mood': ['atmosphere', 'aura', 'vibe', 'climate', 'ambience', 'style', 'energy'],
  'Philosophical / Existential Concepts': ['concept', 'idea', 'being', 'essence', 'meaning', 'existence', 'metaphor'],
  'Aesthetic / Formal': ['composition', 'form', 'structure', 'balance', 'harmony', 'contrast', 'rhythm'],
  'Natural / Metaphysical Concepts': ['nature', 'element', 'force', 'cycle', 'flow', 'growth', 'energy'],
  'Social / Cultural Concepts': ['society', 'culture', 'identity', 'modernity', 'context', 'community', 'norm'],
  'Design Style': ['style', 'movement', 'genre', 'approach', 'trend', 'school', 'aesthetic'],
  'Color & Tone': ['palette', 'hue', 'tone', 'shade', 'vibrancy', 'saturation', 'contrast'],
  'Texture & Materiality': ['surface', 'grain', 'finish', 'sheen', 'fabric', 'material', 'tactile'],
  'Form & Structure': ['grid', 'module', 'hierarchy', 'geometry', 'scale', 'pattern', 'layout'],
  'Design Technique': ['rendering', 'illustration', 'photography', 'vector', 'typography', 'collage', 'process'],
  'Uncategorized': ['design', 'visual', 'abstract', 'semantic', 'concept', 'style', 'theme'],
}

function generateRelatedCandidates(label: string, categoryLabel: string, examples: string[], modifiers: string[]): string[] {
  const out: string[] = []
  out.push(...modifiers.map(m => m.toLowerCase()))
  // Category examples
  out.push(...examples.map(e => e.toLowerCase()))
  // Category seeds
  out.push(...(CATEGORY_SEEDS[categoryLabel] || CATEGORY_SEEDS['Uncategorized']))
  // Heuristic complements
  const lower = label.toLowerCase()
  if (lower === 'grid') out.push('modularity', 'columns', 'baseline')
  if (lower === 'minimal' || lower === 'minimalism') out.push('reduction', 'clarity', 'simplicity')
  return uniqueList(out)
}

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const raw = await fs.readFile(seedPath, 'utf-8')
  const concepts: any[] = JSON.parse(raw)

  // Build category -> examples map from existing entries
  const categoryToExamples = new Map<string, string[]>()
  for (const c of concepts) {
    const cat = c.category || 'Uncategorized'
    const list = categoryToExamples.get(cat) || []
    list.push(c.label)
    categoryToExamples.set(cat, list)
  }

  let changed = 0
  for (const c of concepts) {
    const category = c.category || 'Uncategorized'
    const examples = categoryToExamples.get(category) || []

    // Split compounds: keep core as label, move modifiers to related
    const { core, modifiers } = splitCompound(c.label)
    if (core !== c.label) {
      c.label = core
      c.id = toId(core)
      c.related = Array.isArray(c.related) ? c.related : []
      c.related.push(...modifiers)
      changed++
    }

    // Ensure arrays
    c.synonyms = Array.isArray(c.synonyms) ? c.synonyms : []
    c.related = Array.isArray(c.related) ? c.related : []

    // Generate candidates
    const synCand = generateSynonymCandidates(c.label)
    const relCand = generateRelatedCandidates(c.label, category, examples, modifiers)

    // Merge
    c.synonyms = uniqueList([...c.synonyms, ...synCand])
    c.related = uniqueList([...c.related, ...relCand])

    // Enforce minimum counts strictly (>=5)
    while (c.synonyms.length < 5) {
      // Add from category seeds variations
      const seeds = CATEGORY_SEEDS[category] || CATEGORY_SEEDS['Uncategorized']
      for (const s of seeds) {
        if (c.synonyms.length >= 5) break
        c.synonyms.push(...generateSynonymCandidates(s))
        c.synonyms = uniqueList(c.synonyms)
      }
      if (c.synonyms.length >= 5) break
      // Fallback: duplicate safe variants until threshold (uniqueList prevents exact dupes)
      c.synonyms.push(c.label.toLowerCase() + '-style')
      c.synonyms = uniqueList(c.synonyms)
    }

    while (c.related.length < 5) {
      const seeds = CATEGORY_SEEDS[category] || CATEGORY_SEEDS['Uncategorized']
      for (const s of seeds) {
        if (c.related.length >= 5) break
        c.related.push(s)
        c.related = uniqueList(c.related)
      }
      if (c.related.length >= 5) break
      // Fallback: add examples
      for (const e of examples) {
        if (c.related.length >= 5) break
        c.related.push(e.toLowerCase())
        c.related = uniqueList(c.related)
      }
    }

    // Trim to reasonable sizes
    c.synonyms = c.synonyms.slice(0, 16)
    c.related = c.related.slice(0, 16)
  }

  if (changed > 0) {
    await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
    console.log(`✏️  Normalized compound labels: ${changed}`)
  }

  // Re-embed concepts and upsert into DB
  console.log('🔄 Recomputing concept embeddings and updating database...')
  for (let i = 0; i < concepts.length; i += 50) {
    const batch = concepts.slice(i, i + 50)
    const prompts = batch.map((c) => {
      const syn = (c.synonyms || []).join(', ')
      const rel = (c.related || []).join(', ')
      return `${c.label}. Synonyms: ${syn}. Related: ${rel}.`
    })
    const vecs = await embedTextBatch(prompts)
    for (let j = 0; j < batch.length; j++) {
      const c = batch[j]
      const v = vecs[j]
      if (!v || v.length === 0) continue
      const emb = l2norm(v)
      await prisma.concept.upsert({
        where: { id: c.id },
        update: {
          label: c.label,
          locale: c.locale || 'en',
          synonyms: c.synonyms || [],
          related: c.related || [],
          weight: c.weight ?? 1.0,
          embedding: emb as any,
        },
        create: {
          id: c.id,
          label: c.label,
          locale: c.locale || 'en',
          synonyms: c.synonyms || [],
          related: c.related || [],
          weight: c.weight ?? 1.0,
          embedding: emb as any,
        },
      })
    }
    console.log(`  ✓ Updated ${Math.min(i + 50, concepts.length)}/${concepts.length}`)
  }

  console.log('✅ Enrichment complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
