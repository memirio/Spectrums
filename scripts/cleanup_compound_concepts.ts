#!/usr/bin/env tsx
/**
 * Cleanup script to remove compound-phrase concepts
 * 
 * This script:
 * 1. Identifies concepts with compound phrases (multiple words, hyphens)
 * 2. Removes them from the seed_concepts.json
 * 3. Removes references to them from opposites arrays
 * 4. Saves the cleaned file
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
}

/**
 * Check if a concept is a compound phrase (should be removed)
 */
function isCompoundPhrase(concept: Concept): boolean {
  const label = concept.label.toLowerCase()
  const id = concept.id.toLowerCase()
  
  // Count words in label
  const wordCount = label.split(/\s+/).filter(w => w.length > 0).length
  
  // Check for hyphens (compound words)
  const hasHyphen = id.includes('-') && id.split('-').length > 2
  
  // Check for common compound patterns
  const compoundPatterns = [
    /\s+/, // Multiple words
    /-/,   // Hyphenated (if more than 2 parts)
  ]
  
  // Single word concepts are fine
  if (wordCount === 1 && !hasHyphen) {
    return false
  }
  
  // Two-word concepts should be removed for opposites (we want single words)
  if (wordCount === 2) {
    return true // Remove all two-word concepts
  }
  
  // Three or more words = definitely compound
  if (wordCount >= 3) {
    return true
  }
  
  // Hyphenated with 3+ parts = compound
  if (hasHyphen && id.split('-').length >= 3) {
    return true
  }
  
  return false
}

async function main() {
  console.log('🧹 Cleaning up compound-phrase concepts...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(seedContent)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Identify compound concepts to remove
  const compoundConcepts: Concept[] = []
  const simpleConcepts: Concept[] = []
  
  for (const concept of concepts) {
    if (isCompoundPhrase(concept)) {
      compoundConcepts.push(concept)
    } else {
      simpleConcepts.push(concept)
    }
  }
  
  console.log(`📊 Analysis:`)
  console.log(`   Total concepts: ${concepts.length}`)
  console.log(`   Compound phrases to remove: ${compoundConcepts.length}`)
  console.log(`   Simple concepts to keep: ${simpleConcepts.length}\n`)
  
  if (compoundConcepts.length === 0) {
    console.log('✅ No compound phrases found. File is clean!')
    return
  }
  
  // Show some examples
  console.log(`📝 Examples of compound phrases to remove:`)
  for (const c of compoundConcepts.slice(0, 20)) {
    console.log(`   - ${c.label} (${c.id})`)
  }
  if (compoundConcepts.length > 20) {
    console.log(`   ... and ${compoundConcepts.length - 20} more`)
  }
  console.log()
  
  // Create a set of compound concept IDs for quick lookup
  const compoundIds = new Set(compoundConcepts.map(c => c.id.toLowerCase()))
  
  // Remove references to compound concepts from opposites arrays
  let removedReferences = 0
  const cleanedConcepts = simpleConcepts.map(concept => {
    const opposites = concept.opposites || []
    const cleanedOpposites = opposites.filter(opp => {
      const oppId = String(opp).toLowerCase()
      if (compoundIds.has(oppId)) {
        removedReferences++
        return false
      }
      return true
    })
    
    return {
      ...concept,
      opposites: cleanedOpposites.length > 0 ? cleanedOpposites : undefined
    }
  })
  
  console.log(`🧹 Cleanup:`)
  console.log(`   Removed ${compoundConcepts.length} compound-phrase concepts`)
  console.log(`   Removed ${removedReferences} references from opposites arrays\n`)
  
  // Save cleaned file
  await fs.writeFile(seedPath, JSON.stringify(cleanedConcepts, null, 2))
  console.log(`💾 Saved cleaned file: ${seedPath}`)
  console.log(`   Before: ${concepts.length} concepts`)
  console.log(`   After: ${cleanedConcepts.length} concepts`)
  console.log(`   Removed: ${compoundConcepts.length} concepts\n`)
  
  // Save a report of removed concepts
  const reportPath = path.join(process.cwd(), 'scripts', 'removed_compound_concepts.json')
  await fs.writeFile(reportPath, JSON.stringify(compoundConcepts, null, 2))
  console.log(`📋 Report saved: ${reportPath}`)
  console.log(`   Contains ${compoundConcepts.length} removed concepts for reference\n`)
  
  console.log('✅ Cleanup complete!')
}

main().catch(err => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})

