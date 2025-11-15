#!/usr/bin/env tsx
/**
 * One-off script to backfill opposites for all concepts in seed_concepts.json
 * that have synonyms but no opposites
 * 
 * This addresses the 687 concepts (28%) that are missing opposites
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
  console.log('🔄 Backfilling opposites for concepts with synonyms but no opposites\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(content)
  
  console.log(`✅ Loaded ${concepts.length} concepts from seed_concepts.json\n`)
  
  // Find concepts with synonyms but no opposites
  const conceptsNeedingOpposites: Concept[] = []
  for (const concept of concepts) {
    const hasSynonyms = concept.synonyms && concept.synonyms.length > 0
    const hasOpposites = concept.opposites && concept.opposites.length > 0
    
    if (hasSynonyms && !hasOpposites) {
      conceptsNeedingOpposites.push(concept)
    }
  }
  
  console.log(`📊 Found ${conceptsNeedingOpposites.length} concepts with synonyms but no opposites\n`)
  
  if (conceptsNeedingOpposites.length === 0) {
    console.log('✅ All concepts already have opposites!')
    return
  }
  
  // Build sets of existing concept labels and IDs for filtering
  const existingLabels = new Set<string>()
  const existingIds = new Set<string>()
  for (const c of concepts) {
    existingLabels.add((c.label || c.id).toLowerCase())
    existingIds.add(c.id.toLowerCase())
  }
  
  // Process concepts in batches to avoid rate limits
  const BATCH_SIZE = 5
  const DELAY_BETWEEN_BATCHES = 3000 // 3 seconds
  let processed = 0
  let succeeded = 0
  let failed = 0
  
  console.log(`🚀 Processing ${conceptsNeedingOpposites.length} concepts in batches of ${BATCH_SIZE}...\n`)
  
  for (let i = 0; i < conceptsNeedingOpposites.length; i += BATCH_SIZE) {
    const batch = conceptsNeedingOpposites.slice(i, i + BATCH_SIZE)
    
    for (const concept of batch) {
      try {
        console.log(`[${processed + 1}/${conceptsNeedingOpposites.length}] Generating opposites for "${concept.label}" (${concept.synonyms?.length || 0} synonyms)...`)
        
        const oppositeLabels = await generateOppositesForConceptWithSynonyms(
          concept,
          existingLabels,
          existingIds,
          true // Allow existing concepts as opposites
        )
        
        if (oppositeLabels.length > 0) {
          // Initialize opposites array if needed
          if (!concept.opposites) {
            concept.opposites = []
          }
          
          // Convert labels to IDs and add to opposites
          for (const oppLabel of oppositeLabels) {
            const oppId = oppLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            if (oppId !== concept.id && oppId.length > 0 && !concept.opposites.includes(oppId)) {
              concept.opposites.push(oppId)
            }
          }
          
          succeeded++
          console.log(`   ✅ Generated ${oppositeLabels.length} opposites: ${oppositeLabels.join(', ')}`)
        } else {
          failed++
          console.log(`   ⚠️  No opposites generated`)
        }
      } catch (error: any) {
        failed++
        console.error(`   ❌ Error: ${error.message}`)
      }
      
      processed++
    }
    
    // Save progress after each batch
    if (i + BATCH_SIZE < conceptsNeedingOpposites.length) {
      console.log(`\n💾 Saving progress...`)
      await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
      console.log(`   ✅ Saved ${processed}/${conceptsNeedingOpposites.length} concepts\n`)
      
      // Delay between batches to avoid rate limits
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
  for (const concept of conceptsNeedingOpposites) {
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
  console.log(`   Succeeded: ${succeeded} concepts`)
  console.log(`   Failed: ${failed} concepts`)
  console.log(`   Synced to concept-opposites.ts: ${synced} concepts`)
  
  // Final stats
  const withOpposites = concepts.filter(c => c.opposites && c.opposites.length > 0).length
  const withSynonyms = concepts.filter(c => c.synonyms && c.synonyms.length > 0).length
  const stillMissing = concepts.filter(c => 
    (c.synonyms && c.synonyms.length > 0) && (!c.opposites || c.opposites.length === 0)
  ).length
  
  console.log(`\n📊 Final Statistics:`)
  console.log(`   Total concepts: ${concepts.length}`)
  console.log(`   Concepts with synonyms: ${withSynonyms} (${(withSynonyms / concepts.length * 100).toFixed(1)}%)`)
  console.log(`   Concepts with opposites: ${withOpposites} (${(withOpposites / concepts.length * 100).toFixed(1)}%)`)
  console.log(`   Still missing opposites: ${stillMissing} (${(stillMissing / concepts.length * 100).toFixed(1)}%)`)
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})

