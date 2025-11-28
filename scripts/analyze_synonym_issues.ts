#!/usr/bin/env tsx
/**
 * Analyze Synonym Issues
 * 
 * Analyzes all concepts to find:
 * 1. Concepts with synonyms that are also opposites (contradictions)
 * 2. Concepts with potentially bad synonyms
 * 3. Concepts missing synonyms
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Analyzing synonym issues...\n')
  
  // Get all concepts
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      opposites: true
    }
  })
  
  console.log(`📊 Analyzing ${concepts.length} concepts\n`)
  
  // Load opposites map
  let oppositesMap: Map<string, string[]> = new Map()
  let reverseOppositesMap: Map<string, string[]> = new Map()
  try {
    const { CONCEPT_OPPOSITES } = await import('../src/lib/concept-opposites')
    for (const [conceptId, opposites] of Object.entries(CONCEPT_OPPOSITES)) {
      const normalizedId = conceptId.toLowerCase()
      const normalizedOpposites = opposites.map((o: string) => o.toLowerCase())
      oppositesMap.set(normalizedId, normalizedOpposites)
      
      // Build reverse map
      for (const opp of normalizedOpposites) {
        if (!reverseOppositesMap.has(opp)) {
          reverseOppositesMap.set(opp, [])
        }
        reverseOppositesMap.get(opp)!.push(normalizedId)
      }
    }
  } catch (error) {
    console.error('Could not load concept-opposites')
    process.exit(1)
  }
  
  const contradictions: Array<{ concept: string, badSynonyms: string[] }> = []
  const missingSynonyms: string[] = []
  const suspiciousSynonyms: Array<{ concept: string, synonyms: string[], reason: string }> = []
  
  for (const concept of concepts) {
    const synonyms = Array.isArray(concept.synonyms) ? concept.synonyms : []
    const conceptId = concept.id.toLowerCase()
    const conceptOpposites = oppositesMap.get(conceptId) || []
    
    // Check for contradictions
    const badSynonyms = synonyms.filter(syn => {
      const synLower = syn.toLowerCase()
      const synId = synLower.replace(/[^a-z0-9]+/g, '-')
      
      // Check if synonym is in opposites list
      if (conceptOpposites.includes(synLower) || conceptOpposites.includes(synId)) {
        return true
      }
      
      // Check reverse: if this concept is an opposite of the synonym
      const synonymOpposites = oppositesMap.get(synId) || []
      if (synonymOpposites.includes(conceptId) || synonymOpposites.includes(concept.label.toLowerCase())) {
        return true
      }
      
      return false
    })
    
    if (badSynonyms.length > 0) {
      contradictions.push({
        concept: concept.label,
        badSynonyms
      })
    }
    
    // Check for missing synonyms
    if (synonyms.length === 0) {
      missingSynonyms.push(concept.label)
    }
    
    // Check for suspicious patterns
    if (synonyms.length > 0) {
      // Multi-word synonyms (shouldn't happen)
      const multiWord = synonyms.filter(s => s.includes(' ') || s.includes('-'))
      if (multiWord.length > 0) {
        suspiciousSynonyms.push({
          concept: concept.label,
          synonyms: multiWord,
          reason: 'Multi-word synonyms'
        })
      }
    }
  }
  
  // Print report
  console.log('📋 Analysis Report\n')
  
  console.log(`❌ Contradictions (synonyms that are also opposites): ${contradictions.length}`)
  if (contradictions.length > 0) {
    console.log('\n   Examples:')
    contradictions.slice(0, 20).forEach(issue => {
      console.log(`   - "${issue.concept}": ${issue.badSynonyms.join(', ')}`)
    })
    if (contradictions.length > 20) {
      console.log(`   ... and ${contradictions.length - 20} more`)
    }
  }
  
  console.log(`\n⚠️  Missing synonyms: ${missingSynonyms.length}`)
  if (missingSynonyms.length > 0 && missingSynonyms.length <= 50) {
    console.log('\n   Concepts:')
    missingSynonyms.forEach(label => {
      console.log(`   - ${label}`)
    })
  } else if (missingSynonyms.length > 50) {
    console.log(`\n   (Too many to list - ${missingSynonyms.length} concepts)`)
  }
  
  console.log(`\n🔍 Suspicious patterns: ${suspiciousSynonyms.length}`)
  if (suspiciousSynonyms.length > 0) {
    suspiciousSynonyms.forEach(issue => {
      console.log(`   - "${issue.concept}": ${issue.synonyms.join(', ')} (${issue.reason})`)
    })
  }
  
  console.log(`\n✅ Summary:`)
  console.log(`   Total concepts: ${concepts.length}`)
  console.log(`   With contradictions: ${contradictions.length}`)
  console.log(`   Missing synonyms: ${missingSynonyms.length}`)
  console.log(`   With suspicious patterns: ${suspiciousSynonyms.length}`)
  console.log(`   Clean: ${concepts.length - contradictions.length - missingSynonyms.length - suspiciousSynonyms.length}`)
  
  console.log(`\n💡 To fix all issues, run:`)
  console.log(`   npx tsx scripts/review_and_fix_all_synonyms.ts`)
  console.log(`\n   Or with a limit:`)
  console.log(`   npx tsx scripts/review_and_fix_all_synonyms.ts --limit=100`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

