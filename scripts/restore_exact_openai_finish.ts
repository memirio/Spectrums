#!/usr/bin/env tsx
/**
 * Restore to exact state after OpenAI finished
 * 
 * From the log: "Total concepts: 3518 (2462 original + 1056 new)"
 * We need to ensure:
 * 1. All 1,056 new concepts are present
 * 2. All original concepts have their opposites updated
 * 3. All opposites are bidirectional
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
  console.log('🔄 Restoring to exact post-OpenAI state...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const backupPath = path.join(process.cwd(), 'scripts', 'generated_opposites', 'new_opposite_concepts.json')
  
  // Load backup (OpenAI-generated concepts)
  console.log('📦 Loading OpenAI-generated concepts...')
  const backupContent = await fs.readFile(backupPath, 'utf-8')
  const newConcepts: Concept[] = JSON.parse(backupContent)
  console.log(`✅ Loaded ${newConcepts.length} new concepts\n`)
  
  // Load current file
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
  
  // Build final concepts list
  const finalConcepts: Concept[] = []
  const processedIds = new Set<string>()
  
  // Step 1: Add all current concepts, updating their opposites
  for (const currentConcept of currentConcepts) {
    const id = currentConcept.id.toLowerCase()
    processedIds.add(id)
    
    const updated: Concept = {
      ...currentConcept,
      opposites: [...(currentConcept.opposites || [])]
    }
    
    // Add new concepts as opposites if they reference this concept
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
  
  // Step 2: Add all new concepts (use backup version to ensure proper structure)
  let newAdded = 0
  let newUpdated = 0
  for (const newConcept of newConcepts) {
    const id = newConcept.id.toLowerCase()
    if (!processedIds.has(id)) {
      // Add as new
      finalConcepts.push(newConcept)
      processedIds.add(id)
      newAdded++
    } else {
      // Update existing with OpenAI version (has proper opposites)
      const existing = finalConcepts.find(c => c.id.toLowerCase() === id)
      if (existing) {
        // Replace opposites with OpenAI version
        existing.opposites = [...(newConcept.opposites || [])]
        newUpdated++
      }
    }
  }
  
  // Step 3: Ensure all opposites are bidirectional
  const conceptMap = new Map<string, Concept>()
  for (const concept of finalConcepts) {
    conceptMap.set(concept.id.toLowerCase(), concept)
  }
  
  let bidirectionalLinks = 0
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
  
  // Stats
  const withOpposites = finalConcepts.filter(c => c.opposites && c.opposites.length > 0).length
  
  console.log(`\n✅ Summary:`)
  console.log(`   Total concepts: ${finalConcepts.length}`)
  console.log(`   New concepts added: ${newAdded}`)
  console.log(`   New concepts updated: ${newUpdated}`)
  console.log(`   Concepts with opposites: ${withOpposites} (${(withOpposites/finalConcepts.length*100).toFixed(1)}%)`)
  console.log(`   Bidirectional links ensured: ${bidirectionalLinks}`)
  console.log(`\n💾 Saved to: ${seedPath}`)
  console.log(`✅ Restored to exact post-OpenAI state!`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})

