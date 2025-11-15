#!/usr/bin/env tsx
/**
 * Map synonyms and related terms using ONLY existing concepts
 * 
 * This script:
 * 1. Uses existing concepts to find synonyms and related terms
 * 2. Does NOT add or delete any concepts
 * 3. Only links existing concepts to each other
 * 4. Uses semantic similarity, relationships, and patterns
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

/**
 * Find TRUE synonyms (same concept) using embeddings
 * Synonyms must have very high semantic similarity (>0.94) to ensure they represent the same concept
 * CRITICAL: Synonyms must NOT be opposites, and must NOT be in related
 */
async function findTrueSynonyms(
  concept: Concept,
  allConcepts: Concept[],
  embeddings: Map<string, number[]>,
  maxResults: number = 10
): Promise<string[]> {
  const synonyms = new Set<string>()
  const conceptIdLower = concept.id.toLowerCase()
  const conceptEmbedding = embeddings.get(concept.id)
  
  if (!conceptEmbedding) {
    // Fallback: only exact label matches if no embedding
    const conceptLabelLower = (concept.label || concept.id).toLowerCase()
    for (const other of allConcepts) {
      if (other.id.toLowerCase() === conceptIdLower) continue
      const otherLabelLower = (other.label || other.id).toLowerCase()
      // Only exact label match (same concept, different ID)
      if (conceptLabelLower === otherLabelLower) {
        synonyms.add(other.id)
      }
    }
    return Array.from(synonyms)
  }
  
  // Strategy 1: Check if any concept has this as a synonym (bidirectional)
  for (const other of allConcepts) {
    if (other.id.toLowerCase() === conceptIdLower) continue
    if (other.synonyms?.includes(concept.id) || other.synonyms?.includes(concept.label)) {
      // Verify with embeddings that they're truly the same concept
      // CRITICAL: Check if it's an opposite first
      if (areOpposites(concept.id, other.id)) {
        continue // Skip opposites - they cannot be synonyms
      }
      
      const otherEmbedding = embeddings.get(other.id)
      if (otherEmbedding) {
        const similarity = cosineSimilarity(conceptEmbedding, otherEmbedding)
        if (similarity > 0.94) { // Very strict threshold for synonyms (>0.94)
          synonyms.add(other.id)
        }
      } else {
        // Only trust existing relationship if not an opposite
        if (!areOpposites(concept.id, other.id)) {
          synonyms.add(other.id)
        }
      }
    }
  }
  
  // Strategy 2: Find concepts with very high semantic similarity (same concept)
  const similarities: Array<{ id: string; similarity: number }> = []
  for (const other of allConcepts) {
    if (other.id.toLowerCase() === conceptIdLower) continue
    
    const otherEmbedding = embeddings.get(other.id)
    if (!otherEmbedding) continue
    
    const similarity = cosineSimilarity(conceptEmbedding, otherEmbedding)
    
    // Very strict threshold for synonyms - they must represent the SAME concept (>0.94)
    // CRITICAL: Must NOT be opposites, and must NOT be in related
    if (similarity > 0.94) {
      // Explicit opposite check using areOpposites function
      if (!areOpposites(concept.id, other.id)) {
        similarities.push({ id: other.id, similarity })
      }
    }
  }
  
  // Sort by similarity and take top results
  similarities.sort((a, b) => b.similarity - a.similarity)
  for (const { id } of similarities.slice(0, maxResults)) {
    synonyms.add(id)
  }
  
  // Strategy 3: Exact label matches (same concept, different ID)
  const conceptLabelLower = (concept.label || concept.id).toLowerCase()
  for (const other of allConcepts) {
    if (other.id.toLowerCase() === conceptIdLower) continue
    const otherLabelLower = (other.label || other.id).toLowerCase()
    if (conceptLabelLower === otherLabelLower) {
      synonyms.add(other.id)
    }
  }
  
  return Array.from(synonyms).slice(0, 15)
}

/**
 * Find related concepts using existing relationships
 */
function findRelatedFromRelationships(
  concept: Concept,
  allConcepts: Concept[],
  conceptMap: Map<string, Concept>
): string[] {
  const related = new Set<string>()
  const conceptIdLower = concept.id.toLowerCase()
  
  // Strategy 1: Concepts that share opposites are related
  // BUT: Must explicitly check that shared concepts are NOT opposites of the original concept
  if (concept.opposites && concept.opposites.length > 0) {
    for (const oppositeId of concept.opposites) {
      const oppositeConcept = conceptMap.get(oppositeId.toLowerCase())
      if (oppositeConcept && oppositeConcept.opposites) {
        // Other concepts that have the same opposites are related
        for (const sharedOpposite of oppositeConcept.opposites) {
          const sharedOpp = sharedOpposite.toLowerCase()
          if (sharedOpp !== conceptIdLower && 
              !concept.opposites.includes(sharedOpposite) &&
              !areOpposites(concept.id, sharedOpposite)) { // CRITICAL: Check if it's an opposite
            related.add(sharedOpposite)
          }
        }
      }
    }
  }
  
  // Strategy 2: Concepts that have this as an opposite - find their other opposites
  for (const other of allConcepts) {
    if (other.id.toLowerCase() === conceptIdLower) continue
    if (other.opposites?.includes(concept.id)) {
      // Find other opposites of this concept - they're related to our concept
      // BUT: Must check that these aren't opposites of our concept
      if (other.opposites) {
        for (const opp of other.opposites) {
          const oppLower = opp.toLowerCase()
          if (oppLower !== conceptIdLower && 
              !concept.opposites?.includes(opp) &&
              !areOpposites(concept.id, opp)) { // CRITICAL: Check if it's an opposite
            related.add(opp)
          }
        }
      }
    }
  }
  
  // Strategy 3: Concepts in the same category
  if (concept.category) {
    for (const other of allConcepts) {
      if (other.id.toLowerCase() === conceptIdLower) continue
      if (other.category === concept.category) {
        const otherId = other.id.toLowerCase()
        if (otherId !== conceptIdLower && 
            !concept.opposites?.includes(other.id) &&
            !areOpposites(concept.id, other.id)) { // CRITICAL: Check if it's an opposite
          related.add(other.id)
        }
      }
    }
  }
  
  // Strategy 4: Concepts that share related terms
  if (concept.related && concept.related.length > 0) {
    for (const relatedId of concept.related) {
      const relatedConcept = conceptMap.get(relatedId.toLowerCase())
      if (relatedConcept && relatedConcept.related) {
        for (const sharedRelated of relatedConcept.related) {
          const sharedLower = sharedRelated.toLowerCase()
          if (sharedLower !== conceptIdLower && !concept.opposites?.includes(sharedRelated)) {
            related.add(sharedRelated)
          }
        }
      }
    }
  }
  
  return Array.from(related).slice(0, 20)
}

/**
 * Find CLOSELY related concepts using embeddings
 * Related concepts must have good semantic similarity (0.65-0.94) - related but not the same
 * CRITICAL: Related must NOT be opposites, and must NOT be too similar (>=0.94 = should be synonym)
 */
async function findCloselyRelatedFromEmbeddings(
  concept: Concept,
  allConcepts: Concept[],
  embeddings: Map<string, number[]>,
  maxResults: number = 15
): Promise<string[]> {
  const conceptEmbedding = embeddings.get(concept.id)
  if (!conceptEmbedding) return []
  
  const similarities: Array<{ id: string; similarity: number }> = []
  
  for (const other of allConcepts) {
    if (other.id === concept.id) continue
    
    const otherEmbedding = embeddings.get(other.id)
    if (!otherEmbedding) continue
    
    const similarity = cosineSimilarity(conceptEmbedding, otherEmbedding)
    
    // Related concepts: good similarity (0.65-0.94) - related but not the same
    // Below 0.65 = too different, >= 0.94 = same concept (should be synonym, not related)
    // CRITICAL: Must NOT be opposites, and must NOT be in synonyms
    if (similarity >= 0.65 && similarity < 0.94) {
      // Explicit opposite check
      if (!areOpposites(concept.id, other.id)) {
        similarities.push({ id: other.id, similarity })
      }
    }
  }
  
  // Sort by similarity and return top results
  similarities.sort((a, b) => b.similarity - a.similarity)
  return similarities.slice(0, maxResults).map(s => s.id)
}

async function main() {
  console.log('🔧 Mapping synonyms and related terms using ONLY existing concepts...\n')
  console.log('⚠️  This script does NOT add or delete concepts - only links existing ones\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Create concept map for quick lookup
  const conceptMap = new Map<string, Concept>()
  for (const concept of concepts) {
    conceptMap.set(concept.id.toLowerCase(), concept)
  }
  
  // Generate embeddings for all concepts (in batches)
  console.log('📊 Generating embeddings for semantic similarity...')
  const embeddings = new Map<string, number[]>()
  const batchSize = 50
  
  for (let i = 0; i < concepts.length; i += batchSize) {
    const batch = concepts.slice(i, i + batchSize)
    const texts = batch.map(c => c.label || c.id)
    
    try {
      const batchEmbeddings = await embedTextBatch(texts)
      for (let j = 0; j < batch.length; j++) {
        embeddings.set(batch[j].id, batchEmbeddings[j])
      }
      
      if ((i + batchSize) % 500 === 0 || i + batchSize >= concepts.length) {
        console.log(`   Generated ${Math.min(i + batchSize, concepts.length)}/${concepts.length} embeddings...`)
      }
    } catch (err) {
      console.error(`   ⚠️  Failed to generate embeddings for batch ${i}-${i + batchSize}:`, err)
    }
  }
  
  console.log(`✅ Generated ${embeddings.size} embeddings\n`)
  
  // Process each concept
  let updated = 0
  let synonymsAdded = 0
  let relatedAdded = 0
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i]
    let changed = false
    
    // Ensure arrays exist
    if (!concept.synonyms) concept.synonyms = []
    if (!concept.related) concept.related = []
    
    const existingSynSet = new Set(concept.synonyms.map(s => String(s).toLowerCase()))
    const existingRelatedSet = new Set(concept.related.map(r => String(r).toLowerCase()))
    const conceptIdLower = concept.id.toLowerCase()
    
    // Find TRUE synonyms (same concept) using embeddings
    const conceptSynonyms = await findTrueSynonyms(concept, concepts, embeddings, 10)
    for (const syn of conceptSynonyms) {
      // CRITICAL: Don't add if it's already in related (contradiction)
      if (!existingSynSet.has(syn.toLowerCase()) && 
          syn.toLowerCase() !== conceptIdLower &&
          !concept.related?.includes(syn)) {
        concept.synonyms.push(syn)
        synonymsAdded++
        changed = true
        existingSynSet.add(syn.toLowerCase())
      }
    }
    
    // Find related from relationships
    const relationshipRelated = findRelatedFromRelationships(concept, concepts, conceptMap)
    for (const rel of relationshipRelated) {
      // CRITICAL: Don't add if it's already in synonyms (contradiction)
      if (!existingRelatedSet.has(rel.toLowerCase()) && 
          rel.toLowerCase() !== conceptIdLower && 
          !concept.opposites?.includes(rel) &&
          !areOpposites(concept.id, rel) &&
          !concept.synonyms?.includes(rel)) { // CRITICAL: Check if it's in synonyms
        concept.related.push(rel)
        relatedAdded++
        changed = true
        existingRelatedSet.add(rel.toLowerCase())
      }
    }
    
    // Find CLOSELY related from embeddings (semantic similarity 0.5-0.85)
    if (embeddings.has(concept.id)) {
      const embeddingRelated = await findCloselyRelatedFromEmbeddings(concept, concepts, embeddings, 15)
      for (const rel of embeddingRelated) {
        // CRITICAL: Don't add if it's already in synonyms (contradiction)
        if (!existingRelatedSet.has(rel.toLowerCase()) && 
            rel.toLowerCase() !== conceptIdLower && 
            !concept.opposites?.includes(rel) &&
            !areOpposites(concept.id, rel) &&
            !concept.synonyms?.includes(rel)) { // CRITICAL: Check if it's in synonyms
          concept.related.push(rel)
          relatedAdded++
          changed = true
          existingRelatedSet.add(rel.toLowerCase())
        }
      }
    }
    
    // Remove duplicates
    concept.synonyms = Array.from(new Set(concept.synonyms))
    concept.related = Array.from(new Set(concept.related))
    
    if (changed) {
      updated++
    }
    
    if ((i + 1) % 500 === 0) {
      console.log(`   Processed ${i + 1}/${concepts.length} concepts...`)
    }
  }
  
  // Save
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  
  console.log(`\n✅ Summary:`)
  console.log(`   Concepts updated: ${updated}`)
  console.log(`   Synonyms added: ${synonymsAdded}`)
  console.log(`   Related terms added: ${relatedAdded}`)
  console.log(`   Total concepts: ${concepts.length} (unchanged)`)
  console.log(`\n💾 Saved to: ${seedPath}`)
  console.log(`✅ Done! All links use only existing concepts.`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})

