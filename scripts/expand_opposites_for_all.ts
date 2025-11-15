#!/usr/bin/env tsx
/**
 * Expand opposites for all concepts that have fewer opposites than expected
 * Targets concepts with many synonyms but few opposites
 */

import fs from 'fs/promises'
import path from 'path'
import { generateOppositesForConceptWithSynonyms } from '../src/lib/openai-opposites'
import { updateConceptOpposites, clearConceptsCache } from '../src/lib/update-concept-opposites'

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
  console.log('🔄 Expanding opposites for concepts with few opposites\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Find concepts that need more opposites
  // Target: concepts with >5 synonyms but <5 opposites
  const conceptsNeedingMoreOpposites: Concept[] = []
  for (const concept of concepts) {
    const synCount = concept.synonyms?.length || 0
    const oppCount = concept.opposites?.length || 0
    
    // If has many synonyms but few opposites, add more
    if (synCount > 5 && oppCount < 5) {
      conceptsNeedingMoreOpposites.push(concept)
    }
  }
  
  console.log(`📊 Found ${conceptsNeedingMoreOpposites.length} concepts with >5 synonyms but <5 opposites\n`)
  
  if (conceptsNeedingMoreOpposites.length === 0) {
    console.log('✅ All concepts have sufficient opposites!')
    return
  }
  
  // Build sets of existing concept labels and IDs
  const existingLabels = new Set<string>()
  const existingIds = new Set<string>()
  for (const c of concepts) {
    existingLabels.add((c.label || c.id).toLowerCase())
    existingIds.add(c.id.toLowerCase())
  }
  
  // Process in batches
  const BATCH_SIZE = 5
  const DELAY_BETWEEN_BATCHES = 3000
  let processed = 0
  let expanded = 0
  
  console.log(`🚀 Processing ${conceptsNeedingMoreOpposites.length} concepts in batches of ${BATCH_SIZE}...\n`)
  
  for (let i = 0; i < conceptsNeedingMoreOpposites.length; i += BATCH_SIZE) {
    const batch = conceptsNeedingMoreOpposites.slice(i, i + BATCH_SIZE)
    
    for (const concept of batch) {
      try {
        const currentOppCount = concept.opposites?.length || 0
        const synCount = concept.synonyms?.length || 0
        
        console.log(`[${processed + 1}/${conceptsNeedingMoreOpposites.length}] Expanding opposites for "${concept.label}" (${synCount} synonyms, ${currentOppCount} opposites)...`)
        
        const oppositeLabels = await generateOppositesForConceptWithSynonyms(
          concept,
          existingLabels,
          existingIds,
          true
        )
        
        if (oppositeLabels.length > 0) {
          // Initialize opposites array if needed
          if (!concept.opposites) {
            concept.opposites = []
          }
          
          const existingOppSet = new Set(concept.opposites)
          let added = 0
          
          // Convert labels to IDs and add to opposites
          for (const oppLabel of oppositeLabels) {
            const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            if (oppId !== concept.id && oppId.length > 0 && !existingOppSet.has(oppId)) {
              concept.opposites.push(oppId)
              existingOppSet.add(oppId)
              added++
            }
          }
          
          if (added > 0) {
            expanded++
            console.log(`   ✅ Added ${added} new opposites (now ${concept.opposites.length} total): ${oppositeLabels.slice(0, added).join(', ')}`)
          } else {
            console.log(`   ⚠️  No new opposites added (all duplicates)`)
          }
        } else {
          console.log(`   ⚠️  No opposites generated`)
        }
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`)
      }
      
      processed++
    }
    
    // Save progress after each batch
    if (i + BATCH_SIZE < conceptsNeedingMoreOpposites.length) {
      console.log(`\n💾 Saving progress...`)
      await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
      console.log(`   ✅ Saved ${processed}/${conceptsNeedingMoreOpposites.length} concepts\n`)
      
      console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...\n`)
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
    }
  }
  
  // Final save
  console.log(`\n💾 Saving final results...`)
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  console.log(`   ✅ Saved all concepts\n`)
  
  // Sync to concept-opposites.ts
  console.log(`🔄 Syncing opposites to concept-opposites.ts...`)
  clearConceptsCache()
  
  let synced = 0
  for (const concept of conceptsNeedingMoreOpposites) {
    if (concept.opposites && concept.opposites.length > 0) {
      try {
        await updateConceptOpposites(concept.id, concept.opposites)
        synced++
      } catch (error: any) {
        console.warn(`   ⚠️  Failed to sync "${concept.label}": ${error.message}`)
      }
    }
  }
  
  console.log(`\n✅ Complete!`)
  console.log(`   Processed: ${processed} concepts`)
  console.log(`   Expanded: ${expanded} concepts`)
  console.log(`   Synced to concept-opposites.ts: ${synced} concepts`)
  
  // Final stats
  const withManySyn = concepts.filter(c => (c.synonyms?.length || 0) > 5).length
  const withManyOpp = concepts.filter(c => (c.opposites?.length || 0) >= 5).length
  const stillFew = concepts.filter(c => {
    const syn = c.synonyms?.length || 0
    const opp = c.opposites?.length || 0
    return syn > 5 && opp < 5
  }).length
  
  console.log(`\n📊 Final Statistics:`)
  console.log(`   Concepts with >5 synonyms: ${withManySyn}`)
  console.log(`   Concepts with ≥5 opposites: ${withManyOpp}`)
  console.log(`   Still need more opposites: ${stillFew}`)
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})

