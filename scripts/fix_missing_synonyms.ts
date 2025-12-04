#!/usr/bin/env tsx
/**
 * Fix Missing Synonyms
 * 
 * Finds concepts missing synonyms or with null synonyms and fills them using:
 * - Semantic similarity (embeddings) for finding true synonyms
 * - Knowledge-based mappings
 * - Existing concepts in the database
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

interface Concept {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  opposites: string[] | null
  embedding: number[]
}

// Cosine similarity
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

// Check if two concepts are opposites (simple check)
function areOpposites(conceptId1: string, conceptId2: string, allConcepts: Concept[]): boolean {
  const c1 = allConcepts.find(c => c.id === conceptId1)
  const c2 = allConcepts.find(c => c.id === conceptId2)
  if (!c1 || !c2) return false
  
  if (c1.opposites && c1.opposites.includes(conceptId2)) return true
  if (c2.opposites && c2.opposites.includes(conceptId1)) return true
  
  return false
}

// Find synonyms using semantic similarity (very high similarity = synonyms)
function findSynonymsUsingSimilarity(
  concept: Concept,
  allConcepts: Concept[],
  minSimilarity: number = 0.94, // Very high threshold for synonyms
  maxResults: number = 10
): string[] {
  if (!concept.embedding || concept.embedding.length === 0) {
    return []
  }

  const similarities = allConcepts
    .filter(c => 
      c.id !== concept.id && 
      c.embedding && 
      c.embedding.length > 0 &&
      !areOpposites(concept.id, c.id, allConcepts) // Exclude opposites
    )
    .map(c => ({
      id: c.id,
      label: c.label,
      similarity: cosineSimilarity(concept.embedding, c.embedding)
    }))
    .filter(s => s.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)

  return similarities.map(s => s.id)
}

// Find synonyms by reverse lookup (concepts that list this as synonym)
function findSynonymsFromReverseLookup(
  concept: Concept,
  allConcepts: Concept[]
): string[] {
  const synonyms: string[] = []
  
  for (const other of allConcepts) {
    if (other.id === concept.id) continue
    if (other.synonyms && Array.isArray(other.synonyms)) {
      // Check if this concept is listed as a synonym
      if (other.synonyms.includes(concept.id) || other.synonyms.includes(concept.label)) {
        // Verify it's not an opposite
        if (!areOpposites(concept.id, other.id, allConcepts)) {
          synonyms.push(other.id)
        }
      }
    }
  }
  
  return synonyms
}

// Knowledge-based synonym mappings
function generateSynonymsFromKnowledge(label: string): string[] {
  const lower = label.toLowerCase()
  
  const map: Record<string, string[]> = {
    // Environmental
    'biodegradable': ['compostable', 'decomposable', 'biodegradable-material'],
    'biodegradability': ['compostability', 'decomposability'],
    'eco-friendly': ['environmentally-friendly', 'green', 'sustainable'],
    'eco-friendliness': ['sustainability', 'environmental-friendliness'],
    'eco-design': ['sustainable-design', 'green-design', 'environmental-design'],
    
    // Colors
    'burgundy': ['maroon', 'wine', 'burgundy-red'],
    'chocolate': ['brown', 'cocoa', 'chocolate-brown'],
    'scarlet': ['crimson', 'red', 'bright-red'],
    'ruby': ['red', 'crimson', 'ruby-red'],
    'sangria': ['wine-red', 'burgundy', 'deep-red'],
    
    // Actions/Processes
    'cutting': ['slicing', 'dividing', 'separating'],
    'canning': ['preserving', 'bottling', 'packaging'],
    'die-cut': ['cut-out', 'perforated', 'shaped'],
    'dynamics': ['movement', 'motion', 'activity'],
    'deceleration': ['slowing', 'braking', 'reduction'],
    
    // Business/Economics
    'capital': ['funds', 'money', 'resources'],
    'capitalism': ['free-market', 'market-economy'],
    'commerce': ['trade', 'business', 'commercial'],
    'cooperative': ['collaborative', 'joint', 'shared'],
    'egalitarian': ['equal', 'fair', 'democratic'],
    
    // Qualities
    'creative': ['innovative', 'imaginative', 'artistic'],
    'decadent': ['indulgent', 'luxurious', 'opulent'],
    'exploitative': ['exploiting', 'taking-advantage'],
    
    // States/Conditions
    'exhaustion': ['fatigue', 'tiredness', 'weariness'],
    'fatigue': ['exhaustion', 'tiredness', 'weariness'],
    'feathered': ['plumed', 'winged', 'bird-like'],
    
    // Food/Dairy
    'dairy': ['milk-products', 'lactose', 'milk-based'],
    
    // Shapes/Forms
    'cubist': ['geometric', 'angular', 'cubic'],
    
    // Technical
    'chemicals': ['compounds', 'substances', 'materials'],
    'ehs': ['environmental-health-safety', 'safety', 'health-safety'],
    'generative-art': ['algorithmic-art', 'procedural-art', 'code-art'],
    'cel-shade': ['cel-shading', 'toon-shading', 'cartoon-shading'],
    
    // Brewery
    'brewery': ['brewing', 'beer-production', 'brewhouse'],
  }
  
  // Direct match
  if (map[lower]) return map[lower]
  
  // Try removing common suffixes
  if (lower.endsWith('ness')) {
    const base = lower.slice(0, -4)
    if (map[base]) return map[base]
  }
  
  if (lower.endsWith('ity') || lower.endsWith('ability')) {
    const base = lower.replace(/ity$|ability$/, '')
    if (map[base]) return map[base]
  }
  
  if (lower.endsWith('ing')) {
    const base = lower.slice(0, -3)
    if (map[base]) return map[base]
  }
  
  if (lower.endsWith('ed')) {
    const base = lower.slice(0, -2)
    if (map[base]) return map[base]
  }
  
  // Pattern matching
  if (lower.includes('biodegrad')) return ['compostable', 'decomposable']
  if (lower.includes('eco')) return ['green', 'sustainable', 'environmental']
  if (lower.includes('capital')) return ['funds', 'money', 'resources']
  if (lower.includes('commerce') || lower.includes('commercial')) return ['trade', 'business']
  if (lower.includes('creative') || lower.includes('creat')) return ['innovative', 'imaginative', 'artistic']
  if (lower.includes('exhaust') || lower.includes('fatigue')) return ['tiredness', 'weariness']
  if (lower.includes('feather') || lower.includes('wing')) return ['plumed', 'bird-like']
  if (lower.includes('dairy')) return ['milk-products', 'lactose']
  if (lower.includes('cub')) return ['geometric', 'angular', 'cubic']
  if (lower.includes('chemical')) return ['compounds', 'substances']
  if (lower.includes('brew')) return ['brewing', 'beer-production']
  
  return []
}

async function main() {
  console.log('🔍 Finding concepts missing synonyms or with null synonyms...\n')
  
  // Fetch all concepts
  const allConceptsRaw = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      related: true,
      opposites: true,
      embedding: true,
    }
  })
  
  // Parse concepts and clean null values
  const allConcepts: Concept[] = allConceptsRaw.map(c => {
    let synonyms = Array.isArray(c.synonyms) ? c.synonyms : []
    // Remove null values from synonyms array
    synonyms = synonyms.filter(s => s !== null && s !== undefined && s !== 'null')
    
    return {
      id: c.id,
      label: c.label,
      synonyms: synonyms,
      related: Array.isArray(c.related) ? c.related : [],
      opposites: Array.isArray(c.opposites) ? c.opposites : null,
      embedding: Array.isArray(c.embedding) ? c.embedding as number[] : [],
    }
  })
  
  console.log(`📊 Total concepts: ${allConcepts.length}`)
  
  // Find concepts missing synonyms
  const missingSynonyms = allConcepts.filter(c => 
    !c.synonyms || c.synonyms.length === 0
  )
  
  console.log(`❌ Missing synonyms: ${missingSynonyms.length}\n`)
  
  if (missingSynonyms.length > 0) {
    console.log('🔄 Finding synonyms for concepts missing them...\n')
    
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < missingSynonyms.length; i++) {
      const concept = missingSynonyms[i]
      console.log(`[${i + 1}/${missingSynonyms.length}] Processing: "${concept.label}" (${concept.id})`)
      
      try {
        let synonymIds: string[] = []
        
        // Strategy 1: Reverse lookup (concepts that list this as synonym)
        const reverseSynonyms = findSynonymsFromReverseLookup(concept, allConcepts)
        if (reverseSynonyms.length > 0) {
          synonymIds = reverseSynonyms
          const synonymLabels = reverseSynonyms.map(id => {
            const found = allConcepts.find(c => c.id === id)
            return found ? found.label : id
          })
          console.log(`  ✅ Found ${synonymIds.length} synonyms from reverse lookup: ${synonymLabels.join(', ')}`)
        }
        
        // Strategy 2: Semantic similarity (very high similarity = synonyms)
        if (synonymIds.length < 3 && concept.embedding && concept.embedding.length > 0) {
          console.log(`  🔍 Searching for synonyms using semantic similarity...`)
          const semanticSynonyms = findSynonymsUsingSimilarity(concept, allConcepts, 0.94, 10)
          if (semanticSynonyms.length > 0) {
            synonymIds = Array.from(new Set([...synonymIds, ...semanticSynonyms]))
            const synonymLabels = semanticSynonyms.map(id => {
              const found = allConcepts.find(c => c.id === id)
              return found ? found.label : id
            })
            console.log(`  ✅ Found ${semanticSynonyms.length} synonyms using semantic similarity: ${synonymLabels.join(', ')}`)
          } else {
            console.log(`  ⚠️  Semantic similarity found 0 synonyms (threshold: 0.94)`)
          }
        } else if (synonymIds.length < 3) {
          console.log(`  ⚠️  No embedding available for semantic search`)
        }
        
        // Strategy 3: Knowledge-based synonyms
        if (synonymIds.length < 3) {
          console.log(`  🔄 Trying knowledge-based synonyms...`)
          const knowledgeSynonyms = generateSynonymsFromKnowledge(concept.label)
          
          if (knowledgeSynonyms.length > 0) {
            console.log(`  ✅ Generated ${knowledgeSynonyms.length} synonyms from knowledge base: ${knowledgeSynonyms.join(', ')}`)
            
            // Try to find existing concept IDs for these synonyms
            const foundIds: string[] = []
            for (const synLabel of knowledgeSynonyms) {
              // Try exact match
              const exact = allConcepts.find(c => 
                c.label.toLowerCase() === synLabel.toLowerCase() ||
                c.id.toLowerCase() === synLabel.toLowerCase()
              )
              if (exact && !areOpposites(concept.id, exact.id, allConcepts)) {
                foundIds.push(exact.id)
              }
            }
            
            if (foundIds.length > 0) {
              synonymIds = Array.from(new Set([...synonymIds, ...foundIds]))
              console.log(`  ✅ Found ${foundIds.length} matching concepts from knowledge base`)
            } else {
              // Use normalized labels as potential synonyms (they might be new concepts)
              const normalizedIds = knowledgeSynonyms.map(s => s.toLowerCase().replace(/\s+/g, '-'))
              synonymIds = Array.from(new Set([...synonymIds, ...normalizedIds]))
              console.log(`  ✅ Using normalized labels as synonyms: ${normalizedIds.join(', ')}`)
            }
          } else {
            console.log(`  ⚠️  Knowledge base found 0 synonyms`)
          }
        }
        
        if (synonymIds.length === 0) {
          console.log(`  ⚠️  No synonyms found, skipping`)
          failCount++
          continue
        }
        
        // Update database
        await prisma.concept.update({
          where: { id: concept.id },
          data: { synonyms: synonymIds }
        })
        
        console.log(`  ✅ Updated database with ${synonymIds.length} synonyms`)
        successCount++
      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
        failCount++
      }
      
      console.log('')
    }
    
    console.log(`\n📊 Synonyms Summary:`)
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Failed: ${failCount}`)
  }
  
  // Also clean up any concepts that have null in their synonyms array
  console.log('\n🧹 Cleaning up concepts with null in synonyms array...\n')
  
  let cleanedCount = 0
  for (const concept of allConceptsRaw) {
    const synonyms = concept.synonyms as any
    if (Array.isArray(synonyms) && synonyms.includes(null)) {
      const cleaned = synonyms.filter((s: any) => s !== null && s !== undefined && s !== 'null')
      await prisma.concept.update({
        where: { id: concept.id },
        data: { synonyms: cleaned }
      })
      cleanedCount++
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`✅ Cleaned ${cleanedCount} concepts with null in synonyms array`)
  } else {
    console.log(`✅ No concepts with null in synonyms array found`)
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

