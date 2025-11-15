#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { pipeline } from '@xenova/transformers'

const root = process.cwd()
const seedPath = path.join(root, 'src', 'concepts', 'seed_concepts.json')
const oppositesPath = path.join(root, 'src', 'lib', 'concept-opposites.ts')
const manualPairsPath = path.join(root, 'scripts', 'generate_opposites.ts')

const DATAMUSE_DELAY_MS = 20
const MAX_DATAMUSE_PER_CONCEPT = 5
const SYNONYM_QUERY_LIMIT = 2
const DATAMUSE_SAMPLE_PER_CONCEPT = 0 // fraction of concepts to hit Datamuse
const MAX_OPPOSITES_PER_CONCEPT = 12

function normalize(term) {
  return term.toLowerCase().trim()
}

function buildTermVariants(term) {
  const normalized = normalize(term)
  if (!normalized) return []
  const variants = new Set([normalized])
  variants.add(normalized.replace(/[^a-z0-9]+/g, '-'))
  variants.add(normalized.replace(/[-_]/g, ' '))
  variants.add(normalized.replace(/[-_\s]+/g, ''))
  if (normalized.endsWith('ies')) {
    variants.add(normalized.slice(0, -3) + 'y')
  }
  if (normalized.endsWith('es')) {
    variants.add(normalized.slice(0, -2))
  }
  if (normalized.endsWith('s')) {
    variants.add(normalized.slice(0, -1))
  }
  return Array.from(variants).filter(Boolean)
}

function buildTermIndex(concepts) {
  const index = new Map()
  for (const concept of concepts) {
    const id = concept.id.toLowerCase()
    const add = (term) => {
      for (const variant of buildTermVariants(term)) {
        if (!index.has(variant)) index.set(variant, new Set())
        index.get(variant).add(id)
      }
    }
    add(concept.id)
    add(concept.label || concept.id)
    for (const syn of concept.synonyms || []) add(String(syn))
    for (const rel of concept.related || []) add(String(rel))
  }
  return index
}

function findConceptIds(term, termIndex) {
  const variants = buildTermVariants(term)
  const result = new Set()
  for (const variant of variants) {
    const ids = termIndex.get(variant)
    if (ids) {
      for (const id of ids) {
        result.add(id)
      }
    }
  }
  if (result.size === 0) {
    const tokens = normalize(term).split(/[^a-z0-9]+/).filter(Boolean)
    if (tokens.length > 1) {
      const last = tokens[tokens.length - 1]
      const ids = termIndex.get(last)
      if (ids) {
        for (const id of ids) result.add(id)
      }
    }
  }
  return Array.from(result)
}

function loadManualPairs(termIndex) {
  const source = fs.readFileSync(manualPairsPath, 'utf8')
  const start = source.indexOf('const OPPOSITE_PAIRS')
  const equalsIdx = source.indexOf('=', start)
  const startBracket = source.indexOf('[', equalsIdx)
  let depth = 0
  let endIdx = -1
  for (let i = startBracket; i < source.length; i++) {
    const ch = source[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        endIdx = i
        break
      }
    }
  }
  const literal = source
    .slice(startBracket, endIdx + 1)
    .replace(/\/\/[^\n]*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  // eslint-disable-next-line no-eval
  const rawPairs = eval(literal)
  const resolved = []
  for (const [a, b] of rawPairs) {
    const idsA = findConceptIds(String(a), termIndex)
    const idsB = findConceptIds(String(b), termIndex)
    for (const idA of idsA) {
      for (const idB of idsB) {
        if (idA !== idB) resolved.push([idA, idB])
      }
    }
  }
  return resolved
}

const CUSTOM_PAIRS = [
  ['academia', 'streetwear'],
  ['accessible', 'luxurious'],
  ['accessible', 'premium'],
  ['friendly', 'authoritative'],
  ['playful', 'professional'],
  ['innocence', 'corruption'],
  ['purity', 'corruption'],
  ['guilt', 'innocence'],
  ['maturity', 'youth'],
  ['maturity', 'naivety'],
  ['seriousness', 'playful'],
  ['seriousness', 'whimsical'],
  ['naivety', 'experience'],
  ['naivety', 'wisdom'],
  ['wisdom', 'ignorance'],
  ['ignorance', 'knowledge'],
  ['youth', 'age'],
  ['youth', 'senior'],
  ['youth', 'old'],
  ['youthfulness', 'senior'],
  ['fire', 'ice'],
  ['fire', 'water'],
  ['warm', 'cool'],
  ['dark', 'light'],
  ['colorful', 'monochrome'],
  ['dense', 'spacious'],
  ['digital', 'craft'],
  ['urban', 'botanical'],
  ['minimal', 'maximalist'],
  ['minimalistic', 'maximalist'],
  ['expressive', 'muted'],
  ['energetic', 'serene'],
  ['organic', 'geometric'],
  ['chaotic', 'order'],
  ['casual', 'professional'],
  ['cozy', 'sterile'],
  ['sleekness', 'chunky'],
  ['luxurious', 'accessible'],
  ['brutalist', 'elegant'],
  ['sun', 'night'],
  ['spontaneity', 'deliberate'],
]

function addOpposite(map, a, b, options = {}) {
  const { reciprocate = true, force = false } = options
  if (!a || !b || a === b) return
  if (!map.has(a)) map.set(a, new Set())
  const setA = map.get(a)
  if (!setA.has(b)) {
    if (force || setA.size < MAX_OPPOSITES_PER_CONCEPT) {
      setA.add(b)
    }
  }
  if (reciprocate) {
    if (!map.has(b)) map.set(b, new Set())
    const setB = map.get(b)
    if (!setB.has(a)) {
      if (force || setB.size < MAX_OPPOSITES_PER_CONCEPT) {
        setB.add(a)
      }
    }
  }
}

const datamuseCache = new Map()

async function fetchDatamuse(term) {
  const normalized = normalize(term)
  if (!normalized || normalized.length < 3) return []
  if (datamuseCache.has(normalized)) return datamuseCache.get(normalized)
  const url = `https://api.datamuse.com/words?max=25&ml=${encodeURIComponent('opposite of ' + term)}`
  let words = []
  try {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      words = data.map((entry) => entry.word.toLowerCase())
    }
  } catch (error) {
    console.warn(`[datamuse] Failed for "${term}": ${error.message}`)
  }
  datamuseCache.set(normalized, words)
  await new Promise((resolve) => setTimeout(resolve, DATAMUSE_DELAY_MS))
  return words
}

async function addDatamuseOpposites(concepts, termIndex, oppositeMap) {
  if (DATAMUSE_SAMPLE_PER_CONCEPT <= 0) {
    console.log('[opposites] Skipping Datamuse (disabled)')
    return
  }
  console.log('[opposites] Querying Datamuse for semantic opposites...')
  let processed = 0
  for (const concept of concepts) {
    if (Math.random() > DATAMUSE_SAMPLE_PER_CONCEPT) {
      processed++
      if (processed % 100 === 0) {
        console.log(`  • (skipped) ${processed}/${concepts.length}`)
      }
      continue
    }
    processed++
    const id = concept.id.toLowerCase()
    const baseSize = (oppositeMap.get(id)?.size) || 0
    const queue = [concept.label, ...(concept.synonyms || []).slice(0, SYNONYM_QUERY_LIMIT)]
    for (const term of queue) {
      if (!term) continue
      const words = await fetchDatamuse(term)
      for (const word of words) {
        for (const candidate of findConceptIds(word, termIndex)) {
          if (candidate !== id) addOpposite(oppositeMap, id, candidate)
        }
      }
      if ((oppositeMap.get(id)?.size || 0) >= Math.max(baseSize + MAX_DATAMUSE_PER_CONCEPT, 1)) {
        break
      }
    }
    if (processed % 100 === 0) {
      console.log(`  • Processed ${processed}/${concepts.length}`)
    }
  }
}

function addManualPairs(oppositeMap, pairs) {
  for (const [a, b] of pairs) {
    addOpposite(oppositeMap, a, b, { force: true })
  }
}

function addSeedOpposites(concepts, termIndex, oppositeMap) {
  const missing = new Map()
  let appliedPairs = 0
  for (const concept of concepts) {
    const declaredOpposites = concept.opposites
    if (!Array.isArray(declaredOpposites) || declaredOpposites.length === 0) continue
    const conceptId = concept.id.toLowerCase()
    for (const label of declaredOpposites) {
      const ids = findConceptIds(label, termIndex)
      if (!ids.length) {
        const normalized = label.toLowerCase().trim()
        if (!missing.has(normalized)) {
          missing.set(normalized, new Set())
        }
        missing.get(normalized).add(conceptId)
        continue
      }
      for (const targetId of ids) {
        if (targetId === conceptId) continue
        addOpposite(oppositeMap, conceptId, targetId, { force: true })
        appliedPairs++
      }
    }
  }
  return {
    appliedPairs,
    missing: Array.from(missing.entries()).map(([label, conceptsSet]) => ({
      label,
      conceptIds: Array.from(conceptsSet)
    }))
  }
}

function buildAxisPairs() {
  const pairs = new Set()
  for (const [a, b] of CUSTOM_PAIRS) {
    const key = [a.toLowerCase(), b.toLowerCase()].sort().join('|')
    pairs.add(key)
  }
  return Array.from(pairs).map((key) => key.split('|'))
}

function buildConceptTexts(concepts) {
  return concepts.map((concept) => {
    const parts = [concept.label]
    if (concept.synonyms?.length) parts.push(`Synonyms: ${concept.synonyms.slice(0, 6).join(', ')}`)
    if (concept.related?.length) parts.push(`Related: ${concept.related.slice(0, 6).join(', ')}`)
    if (concept.category) parts.push(`Category: ${concept.category}`)
    return parts.join('. ')
  })
}

async function computeEmbeddings(texts) {
  const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  const vectors = []
  for (const text of texts) {
    const output = await model(text, { pooling: 'mean', normalize: true })
    vectors.push(output.data)
  }
  return vectors
}

function dot(a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

function applyAxisFallback(concepts, embeddings, axisPairs, idToIndex, oppositeMap) {
  const missing = concepts.filter((concept) => !oppositeMap.has(concept.id.toLowerCase()) || oppositeMap.get(concept.id.toLowerCase()).size === 0)
  if (!missing.length) return
  console.log(`[opposites] Applying axis fallback for ${missing.length} concepts`)
  const axes = axisPairs
    .map(([a, b]) => {
      const idxA = idToIndex.get(a)
      const idxB = idToIndex.get(b)
      if (idxA === undefined || idxB === undefined) return null
      return { a, b, vecA: embeddings[idxA], vecB: embeddings[idxB] }
    })
    .filter(Boolean)

  for (const concept of missing) {
    const id = concept.id.toLowerCase()
    const idx = idToIndex.get(id)
    if (idx === undefined) continue
    const vec = embeddings[idx]
    const scored = axes
      .map(({ a, b, vecA, vecB }) => {
        const simA = dot(vec, vecA)
        const simB = dot(vec, vecB)
        return { a, b, diff: simA - simB }
      })
      .sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff))

    let added = 0
    for (const axis of scored) {
      const target = axis.diff >= 0 ? axis.b : axis.a
      if (!target || target === id) continue
      addOpposite(oppositeMap, id, target, { reciprocate: false })
      added++
      if (added >= 2) break
    }
    if (added === 0 && scored.length) {
      const fallback = scored[0]
      const target = fallback.diff >= 0 ? fallback.b : fallback.a
      if (target && target !== id) addOpposite(oppositeMap, id, target, { reciprocate: false })
    }
  }
}

function writeConceptOpposites(oppositeMap, labelMap) {
  const sortedIds = Array.from(oppositeMap.keys()).sort((a, b) => a.localeCompare(b))
  const lines = sortedIds
    .map((id) => {
      const values = Array.from(oppositeMap.get(id) || [])
        .sort()
        .map((opp) => `'${opp}'`)
        .join(', ')
      const label = labelMap.get(id) || id
      return `  '${id}': [${values}], // ${label}`
    })
    .filter((line) => !line.includes('[]'))
  const header = `/**
 * Comprehensive Concept Opposites Mapping
 * 
 * Generated via scripts/generate_semantic_opposites.mjs
 * Combines manual rules, Datamuse antonym lookups, and semantic axes.
 */

export const CONCEPT_OPPOSITES: Record<string, string[]> = {
`
  const footer = `} as const

/**
 * Check if two concepts are opposites
 */
export function areOpposites(conceptId1: string, conceptId2: string): boolean {
  const opposites1 = CONCEPT_OPPOSITES[conceptId1.toLowerCase()] || []
  const opposites2 = CONCEPT_OPPOSITES[conceptId2.toLowerCase()] || []
  
  return opposites1.includes(conceptId2.toLowerCase()) || 
         opposites2.includes(conceptId1.toLowerCase())
}

/**
 * Check if any of the image's tags are opposites of the query concept
 */
export function hasOppositeTags(queryConceptId: string, imageTagIds: string[]): boolean {
  const queryId = queryConceptId.toLowerCase()
  for (const tagId of imageTagIds) {
    if (areOpposites(queryId, tagId.toLowerCase())) {
      return true
    }
  }
  return false
}
`
  fs.writeFileSync(oppositesPath, `${header}${lines.join('\n')}
${footer}`)
}

function updateSeedOpposites(concepts, oppositeMap, labelMap) {
  const idToOpps = new Map()
  for (const [id, set] of oppositeMap.entries()) {
    idToOpps.set(id, Array.from(set).sort())
  }
  const updated = concepts.map((concept) => {
    const id = concept.id.toLowerCase()
    const oppIds = idToOpps.get(id) || []
    const oppLabels = oppIds.map((oppId) => labelMap.get(oppId) || oppId)
    if (oppLabels.length) {
      return { ...concept, opposites: oppLabels }
    }
    const { opposites, ...rest } = concept
    return rest
  })
  fs.writeFileSync(seedPath, `${JSON.stringify(updated, null, 2)}\n`)
}

async function main() {
  const concepts = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
  const labelMap = new Map(concepts.map((concept) => [concept.id.toLowerCase(), concept.label]))
  const termIndex = buildTermIndex(concepts)
  const oppositeMap = new Map()
  const seedOppositeStats = addSeedOpposites(concepts, termIndex, oppositeMap)
  console.log(`[opposites] Applied ${seedOppositeStats.appliedPairs} seed-defined opposite pairs`)
  if (seedOppositeStats.missing.length > 0) {
    const reportPath = path.join(process.cwd(), 'scripts', 'missing-opposites-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(seedOppositeStats.missing, null, 2))
    console.log(`[opposites] ${seedOppositeStats.missing.length} opposite labels missing tags -> ${reportPath}`)
  }
  await addDatamuseOpposites(concepts, termIndex, oppositeMap)
  addManualPairs(oppositeMap, loadManualPairs(termIndex))
  addManualPairs(
    oppositeMap,
    CUSTOM_PAIRS.map(([a, b]) => [a.toLowerCase(), b.toLowerCase()]).filter(([a, b]) => termIndex.has(a) && termIndex.has(b))
  )

  const texts = buildConceptTexts(concepts)
  console.log('[opposites] Computing embeddings (this may take a minute)...')
  const embeddings = await computeEmbeddings(texts)
  const idToIndex = new Map(concepts.map((concept, idx) => [concept.id.toLowerCase(), idx]))
  applyAxisFallback(concepts, embeddings, buildAxisPairs(), idToIndex, oppositeMap)

  const covered = concepts.filter((concept) => oppositeMap.get(concept.id.toLowerCase())?.size)
  console.log(`[opposites] Coverage: ${covered.length}/${concepts.length}`)

  writeConceptOpposites(oppositeMap, labelMap)
  updateSeedOpposites(concepts, oppositeMap, labelMap)
}

main().catch((error) => {
  console.error('Failed to generate opposites:', error)
  process.exit(1)
})
