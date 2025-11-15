#!/usr/bin/env tsx
/**
 * Restore synonyms more aggressively
 * 
 * This script:
 * 1. Uses a lower threshold (0.88) to find more synonyms
 * 2. Still enforces: no opposites, no contradictions
 * 3. Creates concepts for synonyms/related that don't exist yet (as strings for now)
 * 4. Focuses on concepts with <3 synonyms
 */

import fs from 'fs/promises'
import path from 'path'
import { embedTextBatch } from '../src/lib/embeddings'
import { areOpposites } from '../src/lib/concept-opposites'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  category?: string
  opposites?: string[]
  [key: string]: any
}

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
  console.log('🔧 Restoring synonyms more aggressively...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`📊 Loaded ${concepts.length} concepts\n`)
  
  // Build concept map
  const conceptMap = new Map<string, Concept>()
  for (const c of concepts) {
    conceptMap.set(c.id.toLowerCase(), c)
    conceptMap.set(c.label.toLowerCase(), c)
  }
  
  // Generate embeddings
  console.log('📊 Generating embeddings...')
  const embeddings = new Map<string, number[]>()
  const batchSize = 50
  
  for (let i = 0; i < concepts.length; i += batchSize) {
    const batch = concepts.slice(i, i + batchSize)
    const labels = batch.map(c => c.label || c.id)
    const vecs = await embedTextBatch(labels)
    
    for (let j = 0; j < batch.length; j++) {
      embeddings.set(batch[j].id, vecs[j])
    }
    
    process.stdout.write(`\r   Processed ${Math.min(i + batchSize, concepts.length)}/${concepts.length}...`)
  }
  console.log('\n')
  
  // Focus on concepts with <3 synonyms
  const conceptsNeedingSynonyms = concepts.filter(c => 
    (c.synonyms || []).length < 3
  )
  
  console.log(`📊 Found ${conceptsNeedingSynonyms.length} concepts with <3 synonyms\n`)
  
  let synonymsAdded = 0
  let conceptsUpdated = 0
  
  for (let i = 0; i < conceptsNeedingSynonyms.length; i++) {
    const concept = conceptsNeedingSynonyms[i]
    const conceptEmbedding = embeddings.get(concept.id)
    
    if (!conceptEmbedding) continue
    
    if (!concept.synonyms) concept.synonyms = []
    const existingSynSet = new Set(concept.synonyms.map(s => String(s).toLowerCase()))
    const existingRelatedSet = new Set((concept.related || []).map(r => String(r).toLowerCase()))
    const conceptIdLower = concept.id.toLowerCase()
    
    let added = false
    
    // Find synonyms with lower threshold (0.88 instead of 0.94)
    const candidateSynonyms: Array<{ id: string; similarity: number }> = []
    
    for (const other of concepts) {
      if (other.id.toLowerCase() === conceptIdLower) continue
      
      // Skip if already in synonyms or related
      if (existingSynSet.has(other.id.toLowerCase()) || 
          existingRelatedSet.has(other.id.toLowerCase())) {
        continue
      }
      
      // Skip if it's an opposite
      if (areOpposites(concept.id, other.id)) {
        continue
      }
      
      const otherEmbedding = embeddings.get(other.id)
      if (!otherEmbedding) continue
      
      const similarity = cosineSimilarity(conceptEmbedding, otherEmbedding)
      
      // Lower threshold: 0.88 for more synonyms
      if (similarity > 0.88) {
        candidateSynonyms.push({ id: other.id, similarity })
      }
    }
    
    // Sort by similarity and take top candidates
    candidateSynonyms.sort((a, b) => b.similarity - a.similarity)
    
    // Add up to 5 synonyms to reach at least 3 total
    const needed = Math.max(0, 3 - concept.synonyms.length)
    const toAdd = candidateSynonyms.slice(0, Math.min(needed, 5))
    
    for (const { id } of toAdd) {
      if (!concept.synonyms.includes(id)) {
        concept.synonyms.push(id)
        synonymsAdded++
        added = true
      }
    }
    
    if (added) {
      conceptsUpdated++
    }
    
    if ((i + 1) % 100 === 0) {
      process.stdout.write(`\r   Processed ${i + 1}/${conceptsNeedingSynonyms.length}...`)
    }
  }
  
  console.log('\n')
  
  // Save
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  
  console.log('✅ Complete!\n')
  console.log(`📊 Statistics:`)
  console.log(`   Concepts updated: ${conceptsUpdated}`)
  console.log(`   Synonyms added: ${synonymsAdded}`)
}

main().catch(console.error)

