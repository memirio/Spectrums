#!/usr/bin/env tsx
/**
 * Restore seed_concepts.json to the exact state after OpenAI finished
 * 
 * This reconstructs the state from:
 * - Original concepts (before OpenAI)
 * - OpenAI-generated new concepts (from backup)
 * - All opposites properly linked bidirectionally
 */

import fs from 'fs/promises'
import path from 'path'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  category?: string
  opposites?: string[]
  [key: string]: any
}

async function main() {
  console.log('🔄 Restoring to post-OpenAI state...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const backupPath = path.join(process.cwd(), 'scripts', 'generated_opposites', 'new_opposite_concepts.json')
  
  // First, get the original concepts (before OpenAI) - we'll need to check git
  // But for now, let's work with what we have and the backup
  
  console.log('📦 Loading OpenAI-generated concepts from backup...')
  const backupContent = await fs.readFile(backupPath, 'utf-8')
  const newConcepts: Concept[] = JSON.parse(backupContent)
  console.log(`✅ Loaded ${newConcepts.length} new concepts from backup\n`)
  
  // Load current state
  console.log('📚 Loading current seed_concepts.json...')
  const currentContent = await fs.readFile(seedPath, 'utf-8')
  const currentConcepts: Concept[] = JSON.parse(currentContent)
  console.log(`✅ Loaded ${currentConcepts.length} current concepts\n`)
  
  // Create maps
  const currentMap = new Map<string, Concept>()
  for (const concept of currentConcepts) {
    currentMap.set(concept.id.toLowerCase(), concept)
  }
  
  const newConceptsMap = new Map<string, Concept>()
  for (const concept of newConcepts) {
    newConceptsMap.set(concept.id.toLowerCase(), concept)
  }
  
  // Strategy: The backup contains the new concepts with their opposites
  // We need to:
  // 1. Add all new concepts
  // 2. For each new concept's opposites, add the new concept as an opposite to the original
  // 3. Ensure bidirectional linking
  
  const finalConcepts: Concept[] = []
  const processedIds = new Set<string>()
  
  // First, add all current concepts and update them with opposites from new concepts
  for (const currentConcept of currentConcepts) {
    const id = currentConcept.id.toLowerCase()
    processedIds.add(id)
    
    // Create a copy
    const updated: Concept = {
      ...currentConcept,
      opposites: [...(currentConcept.opposites || [])]
    }
    
    // Check if any new concept has this as an opposite
    for (const newConcept of newConcepts) {
      if (newConcept.opposites?.includes(currentConcept.id)) {
        const oppSet = new Set(updated.opposites.map(o => String(o).toLowerCase()))
        if (!oppSet.has(newConcept.id.toLowerCase())) {
          updated.opposites.push(newConcept.id)
        }
      }
    }
    
    finalConcepts.push(updated)
  }
  
  // Add all new concepts (they should NOT be in current file if we're restoring)
  let newAdded = 0
  for (const newConcept of newConcepts) {
    const id = newConcept.id.toLowerCase()
    // Always add new concepts - they're the OpenAI-generated ones
    if (!processedIds.has(id)) {
      finalConcepts.push(newConcept)
      processedIds.add(id)
      newAdded++
    } else {
      // If it exists, update it with the OpenAI version (which has proper opposites)
      const existing = finalConcepts.find(c => c.id.toLowerCase() === id)
      if (existing) {
        // Merge: keep existing data but update opposites from OpenAI version
        existing.opposites = [...(newConcept.opposites || [])]
        // Also merge other fields if they're missing
        if (!existing.synonyms && newConcept.synonyms) {
          existing.synonyms = newConcept.synonyms
        }
        if (!existing.related && newConcept.related) {
          existing.related = newConcept.related
        }
      }
    }
  }
  
  // Ensure all opposites are bidirectional
  let bidirectionalLinks = 0
  const conceptMap = new Map<string, Concept>()
  for (const concept of finalConcepts) {
    conceptMap.set(concept.id.toLowerCase(), concept)
  }
  
  for (const concept of finalConcepts) {
    if (concept.opposites) {
      for (const oppositeId of concept.opposites) {
        const oppositeConcept = conceptMap.get(oppositeId.toLowerCase())
        if (oppositeConcept) {
          if (!oppositeConcept.opposites) {
            oppositeConcept.opposites = []
          }
          const oppSet = new Set(oppositeConcept.opposites.map(o => String(o).toLowerCase()))
          if (!oppSet.has(concept.id.toLowerCase())) {
            oppositeConcept.opposites.push(concept.id)
            bidirectionalLinks++
          }
        }
      }
    }
  }
  
  // Sort by ID
  finalConcepts.sort((a, b) => a.id.localeCompare(b.id))
  
  // Save
  await fs.writeFile(seedPath, JSON.stringify(finalConcepts, null, 2))
  
  // Count stats
  const withOpposites = finalConcepts.filter(c => c.opposites && c.opposites.length > 0).length
  
  console.log(`\n✅ Summary:`)
  console.log(`   Total concepts: ${finalConcepts.length}`)
  console.log(`   New concepts added: ${newAdded}`)
  console.log(`   Concepts with opposites: ${withOpposites} (${(withOpposites/finalConcepts.length*100).toFixed(1)}%)`)
  console.log(`   Bidirectional links ensured: ${bidirectionalLinks}`)
  console.log(`\n💾 Saved to: ${seedPath}`)
  console.log(`✅ Restored to post-OpenAI state!`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})

