#!/usr/bin/env tsx
/**
 * Test script to regenerate opposites for a specific concept
 */

import fs from 'fs/promises'
import path from 'path'
import { generateOppositesForConceptWithSynonyms } from '../src/lib/openai-opposites'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
  [key: string]: any
}

async function main() {
  const conceptName = process.argv[2] || 'zesty'
  
  console.log(`🔄 Regenerating opposites for "${conceptName}"\n`)
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  const concept = concepts.find(c => c.id === conceptName || c.label.toLowerCase() === conceptName.toLowerCase())
  
  if (!concept) {
    console.error(`❌ Concept "${conceptName}" not found`)
    process.exit(1)
  }
  
  console.log(`📋 Found concept: ${concept.label} (ID: ${concept.id})`)
  console.log(`   Synonyms: ${concept.synonyms?.length || 0}`)
  console.log(`   Current opposites: ${concept.opposites?.length || 0} - ${concept.opposites?.join(', ') || 'none'}\n`)
  
  // Build sets of existing concept labels and IDs
  const existingLabels = new Set<string>()
  const existingIds = new Set<string>()
  for (const c of concepts) {
    existingLabels.add((c.label || c.id).toLowerCase())
    existingIds.add(c.id.toLowerCase())
  }
  
  console.log(`🚀 Generating opposites...\n`)
  
  try {
    const oppositeLabels = await generateOppositesForConceptWithSynonyms(
      concept,
      existingLabels,
      existingIds,
      true // Allow existing concepts
    )
    
    console.log(`\n✅ Generated ${oppositeLabels.length} opposites:`)
    console.log(`   Labels: ${oppositeLabels.join(', ')}`)
    
    // Convert to IDs
    const oppositeIds: string[] = []
    for (const oppLabel of oppositeLabels) {
      const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (oppId !== concept.id && oppId.length > 0) {
        oppositeIds.push(oppId)
        // Check if it exists
        const exists = existingIds.has(oppId)
        console.log(`   - "${oppLabel}" → ID: "${oppId}" ${exists ? '✓ (exists)' : '✗ (new)'}`)
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`   Generated labels: ${oppositeLabels.length}`)
    console.log(`   Converted to IDs: ${oppositeIds.length}`)
    console.log(`   Unique IDs: ${new Set(oppositeIds).size}`)
    
    // Show what would be saved
    const newOpposites = [...new Set(oppositeIds)]
    console.log(`\n💾 Would save ${newOpposites.length} opposites: ${newOpposites.join(', ')}`)
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})

