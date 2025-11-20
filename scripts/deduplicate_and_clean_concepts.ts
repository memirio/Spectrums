/**
 * Deduplicate concepts and clean up synonyms/related arrays
 * - Removes duplicate concepts (keeps the one with most complete data)
 * - Cleans synonyms/related to remove low-quality entries
 */

import * as fs from 'fs'
import * as path from 'path'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
}

/**
 * Check if a term is low-quality (should be removed)
 */
function isLowQualityTerm(term: string, conceptLabel: string): boolean {
  const normalized = term.toLowerCase().trim()
  const labelNormalized = conceptLabel.toLowerCase().trim()
  
  // Empty or too short
  if (normalized.length < 2) return true
  
  // Exact duplicate of label
  if (normalized === labelNormalized) return true
  
  // Multi-word phrases (more than 1 word) - synonyms/related should be single words
  const words = normalized.split(/[\s-]+/)
  if (words.length > 1) return true
  
  // Weird variations (ends with weird suffixes that create non-words)
  const weirdSuffixes = ['ed', 'ing', 'ness', 'ic', 'er', 'ies', 'ied']
  for (const suffix of weirdSuffixes) {
    if (normalized.endsWith(suffix)) {
      // If it contains the label and has weird suffix, it's likely low quality
      if (normalized.includes(labelNormalized) && normalized.length > labelNormalized.length + 2) {
        return true
      }
    }
  }
  
  // Check for weird variations like "academias", "academiaed", "academiaic", etc.
  // These are variations of the label with weird suffixes
  if (normalized.startsWith(labelNormalized) && normalized.length > labelNormalized.length) {
    const suffix = normalized.slice(labelNormalized.length)
    // If it's just 's' (plural), that's okay
    if (suffix === 's') {
      // Keep it
    } else if (weirdSuffixes.some(ws => suffix === ws || suffix.endsWith(ws))) {
      // It has a weird suffix, remove it
      return true
    } else if (suffix.length > 1 && !['y', 'ly', 'ful', 'less'].includes(suffix)) {
      // Unknown suffix that's not a common word ending
      return true
    }
  }
  
  // Pluralized versions of other words (like "darks", "serifs", "editorials")
  // Only keep plurals if they're the plural of the concept label itself
  if (normalized.endsWith('s') && normalized !== labelNormalized + 's' && normalized.length > 3) {
    const singular = normalized.slice(0, -1)
    if (singular !== labelNormalized && singular.length > 2) {
      // This is a plural of a different word, likely low quality
      return true
    }
  }
  
  // Contains the concept label plus extra weird stuff (like "academianess", "accessibleed")
  if (normalized.includes(labelNormalized) && normalized.length > labelNormalized.length + 4) {
    // Check if it's a reasonable compound with hyphen
    if (!normalized.includes('-')) {
      return true // No hyphen means it's probably a weird variation
    }
  }
  
  return false
}

/**
 * Clean synonyms array - remove low-quality entries
 */
function cleanSynonyms(synonyms: string[], conceptLabel: string): string[] {
  if (!synonyms || synonyms.length === 0) return []
  
  const cleaned = synonyms
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !isLowQualityTerm(s, conceptLabel))
    .filter((s, i, arr) => arr.indexOf(s) === i) // Remove duplicates
  
  return cleaned
}

/**
 * Clean related array - remove low-quality entries
 */
function cleanRelated(related: string[], conceptLabel: string): string[] {
  if (!related || related.length === 0) return []
  
  const cleaned = related
    .map(r => r.trim())
    .filter(r => r.length > 0)
    .filter(r => !isLowQualityTerm(r, conceptLabel))
    .filter((r, i, arr) => arr.indexOf(r) === i) // Remove duplicates
  
  return cleaned
}

/**
 * Score a concept based on completeness
 */
function scoreConcept(concept: Concept): number {
  let score = 0
  
  // Has label
  if (concept.label && concept.label.length > 0) score += 10
  
  // Has synonyms
  if (concept.synonyms && concept.synonyms.length > 0) {
    score += concept.synonyms.length
  }
  
  // Has related
  if (concept.related && concept.related.length > 0) {
    score += concept.related.length
  }
  
  // Has opposites
  if (concept.opposites && concept.opposites.length > 0) {
    score += concept.opposites.length * 2 // Opposites are more important
  }
  
  // Has category
  if (concept.category && concept.category.length > 0) score += 5
  
  return score
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🧹 Deduplicating and Cleaning Concepts')
  console.log('═'.repeat(70))
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts`)
  console.log()
  
  // Create backup
  const backupPath = conceptsPath + '.backup.' + Date.now()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  console.log()
  
  // Group by ID to find duplicates
  const conceptsById = new Map<string, Concept[]>()
  for (const concept of conceptsData) {
    const id = concept.id.toLowerCase()
    if (!conceptsById.has(id)) {
      conceptsById.set(id, [])
    }
    conceptsById.get(id)!.push(concept)
  }
  
  // Find duplicates
  const duplicates = Array.from(conceptsById.entries())
    .filter(([id, concepts]) => concepts.length > 1)
  
  console.log(`📊 Found ${duplicates.length} duplicate concept IDs`)
  console.log(`   Total duplicate entries: ${duplicates.reduce((sum, [_, concepts]) => sum + concepts.length - 1, 0)}`)
  console.log()
  
  // Deduplicate: keep the concept with highest score
  const deduplicated = new Map<string, Concept>()
  let duplicatesRemoved = 0
  
  for (const [id, concepts] of conceptsById.entries()) {
    if (concepts.length === 1) {
      // No duplicate, keep as-is
      deduplicated.set(id, concepts[0])
    } else {
      // Multiple concepts with same ID - keep the best one
      const scored = concepts.map(c => ({ concept: c, score: scoreConcept(c) }))
      scored.sort((a, b) => b.score - a.score)
      
      const best = scored[0].concept
      deduplicated.set(id, best)
      duplicatesRemoved += concepts.length - 1
      
      console.log(`   🔄 "${id}": kept best version (score: ${scored[0].score}), removed ${concepts.length - 1} duplicate(s)`)
    }
  }
  
  console.log()
  console.log(`✅ Deduplicated: ${duplicatesRemoved} duplicate entries removed`)
  console.log(`   Unique concepts: ${deduplicated.size}`)
  console.log()
  
  // Clean synonyms and related for all concepts
  console.log('🧹 Cleaning synonyms and related terms...')
  let cleanedCount = 0
  
  for (const concept of deduplicated.values()) {
    const originalSynCount = concept.synonyms?.length || 0
    const originalRelCount = concept.related?.length || 0
    
    if (concept.synonyms) {
      concept.synonyms = cleanSynonyms(concept.synonyms, concept.label)
    }
    
    if (concept.related) {
      concept.related = cleanRelated(concept.related, concept.label)
    }
    
    const newSynCount = concept.synonyms?.length || 0
    const newRelCount = concept.related?.length || 0
    
    if (originalSynCount !== newSynCount || originalRelCount !== newRelCount) {
      cleanedCount++
      if (cleanedCount <= 10) {
        console.log(`   🧹 "${concept.label}": synonyms ${originalSynCount}→${newSynCount}, related ${originalRelCount}→${newRelCount}`)
      }
    }
  }
  
  if (cleanedCount > 10) {
    console.log(`   ... and ${cleanedCount - 10} more concepts cleaned`)
  }
  
  console.log()
  console.log(`✅ Cleaned ${cleanedCount} concepts`)
  console.log()
  
  // Convert back to array and sort
  const cleanedConcepts = Array.from(deduplicated.values())
  cleanedConcepts.sort((a, b) => {
    // Sort by category, then label
    const catA = a.category || ''
    const catB = b.category || ''
    if (catA !== catB) return catA.localeCompare(catB)
    return a.label.localeCompare(b.label)
  })
  
  // Save cleaned concepts
  console.log('💾 Saving cleaned concepts...')
  fs.writeFileSync(conceptsPath, JSON.stringify(cleanedConcepts, null, 2))
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`📚 Original concepts: ${conceptsData.length}`)
  console.log(`✅ Unique concepts: ${cleanedConcepts.length}`)
  console.log(`🗑️  Duplicates removed: ${duplicatesRemoved}`)
  console.log(`🧹 Concepts cleaned: ${cleanedCount}`)
  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📄 Updated file: ${conceptsPath}`)
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

