#!/usr/bin/env tsx
/**
 * Fix synonym and related term contradictions
 * 
 * This script:
 * 1. Removes opposites from synonyms arrays
 * 2. Removes opposites from related arrays
 * 3. Re-validates semantic similarity thresholds (synonyms >0.90, related 0.65-0.90)
 * 4. Reports statistics on fixes
 */

import fs from 'fs/promises'
import path from 'path'
import { embedTextBatch } from '../src/lib/embeddings'
import { hasOppositeTags } from '../src/lib/concept-opposites'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  category?: string
  opposites?: string[]
  [key: string]: any
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function main() {
  console.log('🔧 Fixing synonym and related term contradictions...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`📊 Loaded ${concepts.length} concepts\n`)
  
  // Build concept map for quick lookup
  const conceptMap = new Map<string, Concept>()
  for (const c of concepts) {
    conceptMap.set(c.id.toLowerCase(), c)
    conceptMap.set(c.label.toLowerCase(), c)
  }
  
  // Generate embeddings for all concepts (in batches)
  console.log('📊 Generating embeddings for semantic similarity validation...')
  const embeddings = new Map<string, number[]>()
  const batchSize = 50
  
  for (let i = 0; i < concepts.length; i += batchSize) {
    const batch = concepts.slice(i, i + batchSize)
    const labels = batch.map(c => c.label || c.id)
    const vecs = await embedTextBatch(labels)
    
    for (let j = 0; j < batch.length; j++) {
      embeddings.set(batch[j].id, vecs[j])
    }
    
    process.stdout.write(`\r   Processed ${Math.min(i + batchSize, concepts.length)}/${concepts.length} concepts...`)
  }
  console.log('\n')
  
  // Statistics
  let conceptsFixed = 0
  let synonymsRemovedOpposites = 0
  let relatedRemovedOpposites = 0
  let synonymsRemovedLowSimilarity = 0
  let relatedRemovedLowSimilarity = 0
  let relatedRemovedHighSimilarity = 0
  const examples: Array<{ concept: string; type: string; removed: string[]; reason: string }> = []
  
  // Process each concept
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i]
    let changed = false
    
    // Ensure arrays exist
    if (!concept.synonyms) concept.synonyms = []
    if (!concept.related) concept.related = []
    
    const originalSynonyms = [...concept.synonyms]
    const originalRelated = [...concept.related]
    
    // Get concept embedding for similarity checks
    const conceptEmbedding = embeddings.get(concept.id)
    
    // Fix synonyms: remove opposites and low-similarity terms
    const validSynonyms: string[] = []
    const removedSynonyms: string[] = []
    
    // Pre-compute related terms in lowercase for contradiction checking
    const relatedLower = (concept.related || []).map(r => String(r).toLowerCase())
    
    for (const syn of concept.synonyms) {
      const synLower = syn.toLowerCase()
      
      // FIRST: Check if this term is already in related (contradiction - can't be both)
      // This must be checked first, before any other validation
      if (relatedLower.includes(synLower)) {
        removedSynonyms.push(syn)
        synonymsRemovedLowSimilarity++
        continue
      }
      
      // Check if it's a valid concept reference
      const synConcept = conceptMap.get(synLower)
      if (!synConcept) {
        // Not a valid concept - but keep it for now (will be created as concept later)
        // Only remove if it's clearly invalid (e.g., empty, just punctuation)
        if (!syn || syn.trim().length === 0 || syn.match(/^[^a-z0-9]+$/i)) {
          removedSynonyms.push(syn)
          synonymsRemovedLowSimilarity++
          continue
        }
        // Keep the string - it will be created as a concept by the pipeline
        validSynonyms.push(syn)
        continue
      }
      
      // Check if this synonym is an opposite of the concept
      if (hasOppositeTags(concept.id, [synConcept.id]) || hasOppositeTags(synConcept.id, [concept.id])) {
        removedSynonyms.push(syn)
        synonymsRemovedOpposites++
        continue
      }
      
      // Check semantic similarity (must be >0.94 for synonyms - very strict threshold)
      if (conceptEmbedding && embeddings.has(synConcept.id)) {
        const similarity = cosineSimilarity(conceptEmbedding, embeddings.get(synConcept.id)!)
        // Very strict threshold to 0.94 for synonym matching - only truly identical concepts
        if (similarity <= 0.94) {
          removedSynonyms.push(syn)
          synonymsRemovedLowSimilarity++
          continue
        }
      } else {
        // No embedding available - keep it for now (will be embedded when concept is created)
        // Only validate similarity if embedding exists
        validSynonyms.push(syn)
        continue
      }
      
      // Also check if syn is a string label that matches an opposite
      if (concept.opposites?.includes(syn)) {
        removedSynonyms.push(syn)
        synonymsRemovedOpposites++
        continue
      }
      
      // Keep it
      validSynonyms.push(syn)
    }
    
    if (removedSynonyms.length > 0) {
      concept.synonyms = validSynonyms
      changed = true
      if (examples.length < 10) {
        examples.push({
          concept: concept.label,
          type: 'synonyms',
          removed: removedSynonyms,
          reason: removedSynonyms.some(s => {
            const synC = conceptMap.get(s.toLowerCase())
            if (synC && conceptEmbedding && embeddings.has(synC.id)) {
              const sim = cosineSimilarity(conceptEmbedding, embeddings.get(synC.id)!)
              return sim <= 0.90 ? `low similarity (${sim.toFixed(3)})` : 'opposite'
            }
            return 'opposite'
          })
        })
      }
    }
    
    // Fix related: remove opposites and validate similarity
    const validRelated: string[] = []
    const removedRelated: string[] = []
    
    // Pre-compute synonyms in lowercase for contradiction checking
    const synonymsLower = (concept.synonyms || []).map(s => String(s).toLowerCase())
    
    for (const rel of concept.related) {
      const relLower = rel.toLowerCase()
      
      // FIRST: Check if this term is already in synonyms (contradiction - can't be both)
      // This must be checked first, before any other validation
      if (synonymsLower.includes(relLower)) {
        removedRelated.push(rel)
        relatedRemovedHighSimilarity++
        continue
      }
      
      // Check if it's a valid concept reference
      const relConcept = conceptMap.get(relLower)
      if (!relConcept) {
        // Not a valid concept - but keep it (will be created as concept later)
        // Related terms can be strings that will become concepts
        // Only remove if it's clearly invalid (e.g., empty, just punctuation)
        if (!rel || rel.trim().length === 0 || rel.match(/^[^a-z0-9]+$/i)) {
          removedRelated.push(rel)
          relatedRemovedLowSimilarity++
          continue
        }
        // Keep the string - it will be created as a concept by the pipeline
        validRelated.push(rel)
        continue
      }
      
      // Check if this related term is an opposite of the concept
      if (hasOppositeTags(concept.id, [relConcept.id]) || hasOppositeTags(relConcept.id, [concept.id])) {
        removedRelated.push(rel)
        relatedRemovedOpposites++
        continue
      }
      
      // Check semantic similarity (must be 0.65-0.94 for related)
      if (conceptEmbedding && embeddings.has(relConcept.id)) {
        const similarity = cosineSimilarity(conceptEmbedding, embeddings.get(relConcept.id)!)
        if (similarity < 0.65) {
          removedRelated.push(rel)
          relatedRemovedLowSimilarity++
          continue
        }
        if (similarity >= 0.94) {
          // Too similar - should be a synonym, not related
          removedRelated.push(rel)
          relatedRemovedHighSimilarity++
          continue
        }
      } else {
        // No embedding available - keep it for now (will be embedded when concept is created)
        // Only validate similarity if embedding exists
        validRelated.push(rel)
        continue
      }
      
      // Also check if rel is a string label that matches an opposite
      if (concept.opposites?.includes(rel)) {
        removedRelated.push(rel)
        relatedRemovedOpposites++
        continue
      }
      
      // Keep it
      validRelated.push(rel)
    }
    
    if (removedRelated.length > 0) {
      concept.related = validRelated
      changed = true
      if (examples.length < 20) {
        examples.push({
          concept: concept.label,
          type: 'related',
          removed: removedRelated,
          reason: removedRelated.some(r => {
            const relC = conceptMap.get(r.toLowerCase())
            if (relC && conceptEmbedding && embeddings.has(relC.id)) {
              const sim = cosineSimilarity(conceptEmbedding, embeddings.get(relC.id)!)
              if (sim < 0.65) return `low similarity (${sim.toFixed(3)})`
              if (sim >= 0.90) return `too similar (${sim.toFixed(3)} - should be synonym)`
              return 'opposite'
            }
            return 'opposite'
          })
        })
      }
    }
    
    if (changed) {
      conceptsFixed++
    }
  }
  
  // Save updated concepts
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  
  // Report statistics
  console.log('\n✅ Fix Complete!\n')
  console.log('📊 Statistics:')
  console.log(`   Concepts fixed: ${conceptsFixed}`)
  console.log(`   Synonyms removed (opposites): ${synonymsRemovedOpposites}`)
  console.log(`   Synonyms removed (low similarity): ${synonymsRemovedLowSimilarity}`)
  console.log(`   Related removed (opposites): ${relatedRemovedOpposites}`)
  console.log(`   Related removed (low similarity): ${relatedRemovedLowSimilarity}`)
  console.log(`   Related removed (too similar - should be synonym): ${relatedRemovedHighSimilarity}`)
  
  if (examples.length > 0) {
    console.log('\n📝 Example Fixes:')
    for (const ex of examples.slice(0, 10)) {
      console.log(`   ${ex.concept} (${ex.type}): Removed ${ex.removed.length} terms (${ex.reason})`)
      if (ex.removed.length <= 5) {
        console.log(`      - ${ex.removed.join(', ')}`)
      } else {
        console.log(`      - ${ex.removed.slice(0, 5).join(', ')}, ... (+${ex.removed.length - 5} more)`)
      }
    }
  }
  
  console.log('\n✅ Saved updated concepts to seed_concepts.json')
}

main().catch(console.error)

