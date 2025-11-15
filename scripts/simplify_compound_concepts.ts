#!/usr/bin/env tsx
/**
 * Simplify compound phrases to single words
 * 
 * Examples:
 * - "Vibrant Hue" -> "Vibrant"
 * - "Matte Black" -> "Matte"
 * - "Rustic Texture" -> "Rustic"
 * 
 * This script:
 * 1. Identifies compound phrases (2+ words or hyphens)
 * 2. Extracts the most meaningful single word
 * 3. Merges the compound phrase into the simple word (if it exists) or creates it
 * 4. Updates all references (opposites, related, synonyms)
 * 5. Removes the compound phrase entries
 */

import fs from 'fs/promises'
import path from 'path'

type Concept = {
  id: string
  label: string
  category?: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  [key: string]: any
}

const SKIP_WORDS = new Set(['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'into', 'onto', 'upon', 'over', 'under', 'above', 'below', 'between', 'among', 'through', 'during', 'before', 'after', 'since', 'until', 'while', 'because', 'although', 'though', 'despite', 'regardless'])

/**
 * Check if a concept is a compound phrase
 */
function isCompoundPhrase(concept: Concept): boolean {
  const label = concept.label || ''
  const words = label.split(/\s+/)
  const hasHyphen = /[-_]/.test(label)
  
  return words.length > 1 || hasHyphen
}

/**
 * Extract simple word from compound phrase
 */
function extractSimpleWord(concept: Concept): string | null {
  const label = concept.label || ''
  const words = label.split(/\s+/)
  const hasHyphen = /[-_]/.test(label)
  
  if (hasHyphen) {
    // Split by hyphen/underscore and take first part
    const parts = label.split(/[-_]/)
    if (parts.length > 0 && parts[0].trim()) {
      return parts[0].trim()
    }
  }
  
  if (words.length > 1) {
    // Take first meaningful word (skip articles, prepositions)
    for (const word of words) {
      const lower = word.toLowerCase().replace(/[^a-z]/g, '')
      if (lower && !SKIP_WORDS.has(lower)) {
        return word
      }
    }
    // If all words are skip words, take first word
    return words[0]
  }
  
  return null
}

/**
 * Normalize concept ID for lookup
 */
function normalizeId(id: string): string {
  return id.toLowerCase().trim()
}

async function main() {
  console.log('🔧 Simplifying compound phrases to single words...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Create a map of concepts by ID for quick lookup
  const conceptMap = new Map<string, Concept>()
  for (const concept of concepts) {
    conceptMap.set(normalizeId(concept.id), concept)
  }
  
  // Find compound phrases
  const compoundPhrases: Array<{ concept: Concept; simpleWord: string }> = []
  const simpleWords = new Set<string>()
  
  for (const concept of concepts) {
    if (isCompoundPhrase(concept)) {
      const simpleWord = extractSimpleWord(concept)
      if (simpleWord) {
        compoundPhrases.push({ concept, simpleWord })
        simpleWords.add(normalizeId(simpleWord))
      }
    }
  }
  
  console.log(`📊 Found ${compoundPhrases.length} compound phrases\n`)
  
  // Group by simple word
  const groupedBySimple = new Map<string, Concept[]>()
  for (const { concept, simpleWord } of compoundPhrases) {
    const key = normalizeId(simpleWord)
    if (!groupedBySimple.has(key)) {
      groupedBySimple.set(key, [])
    }
    groupedBySimple.get(key)!.push(concept)
  }
  
  console.log(`📊 Will merge into ${groupedBySimple.size} simple words\n`)
  
  // Process each group
  const conceptsToRemove = new Set<string>()
  const conceptsToUpdate = new Map<string, Concept>()
  let merged = 0
  let created = 0
  let updated = 0
  
  for (const [simpleWordId, compoundConcepts] of groupedBySimple.entries()) {
    // Check if simple word concept already exists
    let simpleConcept = conceptMap.get(simpleWordId)
    
    if (!simpleConcept) {
      // Create new simple concept
      const firstCompound = compoundConcepts[0]
      simpleConcept = {
        id: simpleWordId,
        label: simpleWordId.charAt(0).toUpperCase() + simpleWordId.slice(1),
        category: firstCompound.category,
        synonyms: [],
        related: [],
        opposites: [],
      }
      created++
      console.log(`  ✨ Created: "${simpleConcept.label}" (from ${compoundConcepts.length} compounds)`)
    } else {
      updated++
      console.log(`  🔄 Updating: "${simpleConcept.label}" (merging ${compoundConcepts.length} compounds)`)
    }
    
    // Merge data from compound phrases
    for (const compound of compoundConcepts) {
      // Merge synonyms
      if (compound.synonyms) {
        if (!simpleConcept.synonyms) simpleConcept.synonyms = []
        for (const syn of compound.synonyms) {
          if (!simpleConcept.synonyms.includes(syn)) {
            simpleConcept.synonyms.push(syn)
          }
        }
        // Add compound label as synonym
        if (!simpleConcept.synonyms.includes(compound.label)) {
          simpleConcept.synonyms.push(compound.label)
        }
      }
      
      // Merge related
      if (compound.related) {
        if (!simpleConcept.related) simpleConcept.related = []
        for (const rel of compound.related) {
          if (!simpleConcept.related.includes(rel)) {
            simpleConcept.related.push(rel)
          }
        }
      }
      
      // Merge opposites
      if (compound.opposites) {
        if (!simpleConcept.opposites) simpleConcept.opposites = []
        for (const opp of compound.opposites) {
          if (!simpleConcept.opposites.includes(opp)) {
            simpleConcept.opposites.push(opp)
          }
        }
      }
      
      // Mark compound for removal
      conceptsToRemove.add(normalizeId(compound.id))
      merged++
    }
    
    conceptsToUpdate.set(simpleWordId, simpleConcept)
  }
  
  console.log(`\n📊 Processing updates...\n`)
  
  // Update all concepts to replace references to compound phrases with simple words
  let referencesUpdated = 0
  for (const concept of concepts) {
    let changed = false
    
    // Update opposites
    if (concept.opposites) {
      const newOpposites: string[] = []
      for (const opp of concept.opposites) {
        const oppId = normalizeId(opp)
        if (conceptsToRemove.has(oppId)) {
          // Find the simple word this compound maps to
          for (const { concept: comp, simpleWord } of compoundPhrases) {
            if (normalizeId(comp.id) === oppId) {
              const simpleId = normalizeId(simpleWord)
              if (!newOpposites.includes(simpleId)) {
                newOpposites.push(simpleId)
              }
              changed = true
              break
            }
          }
        } else {
          newOpposites.push(opp)
        }
      }
      if (changed) {
        concept.opposites = newOpposites
        referencesUpdated++
      }
    }
    
    // Update related
    if (concept.related) {
      const newRelated: string[] = []
      for (const rel of concept.related) {
        const relId = normalizeId(rel)
        if (conceptsToRemove.has(relId)) {
          for (const { concept: comp, simpleWord } of compoundPhrases) {
            if (normalizeId(comp.id) === relId) {
              const simpleId = normalizeId(simpleWord)
              if (!newRelated.includes(simpleId)) {
                newRelated.push(simpleId)
              }
              changed = true
              break
            }
          }
        } else {
          newRelated.push(rel)
        }
      }
      if (changed && concept.related) {
        concept.related = newRelated
      }
    }
    
    // Update synonyms
    if (concept.synonyms) {
      const newSynonyms: string[] = []
      for (const syn of concept.synonyms) {
        const synId = normalizeId(syn)
        if (conceptsToRemove.has(synId)) {
          for (const { concept: comp, simpleWord } of compoundPhrases) {
            if (normalizeId(comp.id) === synId) {
              const simpleId = normalizeId(simpleWord)
              if (!newSynonyms.includes(simpleId)) {
                newSynonyms.push(simpleId)
              }
              changed = true
              break
            }
          }
        } else {
          newSynonyms.push(syn)
        }
      }
      if (changed && concept.synonyms) {
        concept.synonyms = newSynonyms
      }
    }
  }
  
  // Remove compound phrases and update/insert simple concepts
  const finalConcepts: Concept[] = []
  const updatedIds = new Set(conceptsToUpdate.keys())
  
  for (const concept of concepts) {
    const conceptId = normalizeId(concept.id)
    
    if (conceptsToRemove.has(conceptId)) {
      // Skip compound phrases
      continue
    } else if (updatedIds.has(conceptId)) {
      // Replace with updated simple concept
      finalConcepts.push(conceptsToUpdate.get(conceptId)!)
      updatedIds.delete(conceptId)
    } else {
      // Keep as is
      finalConcepts.push(concept)
    }
  }
  
  // Add any new simple concepts that weren't in the original
  for (const [id, concept] of conceptsToUpdate.entries()) {
    if (updatedIds.has(id)) {
      finalConcepts.push(concept)
    }
  }
  
  // Sort by ID
  finalConcepts.sort((a, b) => a.id.localeCompare(b.id))
  
  // Save
  await fs.writeFile(seedPath, JSON.stringify(finalConcepts, null, 2))
  
  console.log(`\n✅ Summary:`)
  console.log(`   Compound phrases processed: ${compoundPhrases.length}`)
  console.log(`   Merged into simple words: ${merged}`)
  console.log(`   New simple concepts created: ${created}`)
  console.log(`   Existing concepts updated: ${updated}`)
  console.log(`   References updated: ${referencesUpdated}`)
  console.log(`   Final concepts: ${finalConcepts.length} (removed ${concepts.length - finalConcepts.length})`)
  console.log(`\n💾 Saved to: ${seedPath}`)
  console.log(`✅ Done!`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})

