#!/usr/bin/env tsx
/**
 * Migrate generated opposite concepts to seed_concepts.json
 * 
 * This script:
 * 1. Loads new opposite concepts from generated_opposites/
 * 2. Loads updated concepts with new opposites
 * 3. Merges them into seed_concepts.json
 * 4. Deletes the temporary generated files
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

async function main() {
  console.log('🔄 Migrating generated opposite concepts to seed_concepts.json...\n')
  
  const outputDir = path.join(process.cwd(), 'scripts', 'generated_opposites')
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  
  // Check if generated files exist
  const newConceptsPath = path.join(outputDir, 'new_opposite_concepts.json')
  const updatedConceptsPath = path.join(outputDir, 'updated_concepts_with_opposites.json')
  
  let newConcepts: Concept[] = []
  let updatedConcepts: Concept[] = []
  
  try {
    // Load new concepts
    if (await fs.access(newConceptsPath).then(() => true).catch(() => false)) {
      const newContent = await fs.readFile(newConceptsPath, 'utf-8')
      newConcepts = JSON.parse(newContent)
      console.log(`✅ Loaded ${newConcepts.length} new opposite concepts`)
    } else {
      console.log(`⚠️  New concepts file not found: ${newConceptsPath}`)
    }
    
    // Load updated concepts
    if (await fs.access(updatedConceptsPath).then(() => true).catch(() => false)) {
      const updatedContent = await fs.readFile(updatedConceptsPath, 'utf-8')
      updatedConcepts = JSON.parse(updatedContent)
      console.log(`✅ Loaded ${updatedConcepts.length} updated concepts with new opposites`)
    } else {
      console.log(`⚠️  Updated concepts file not found: ${updatedConceptsPath}`)
    }
  } catch (error: any) {
    console.error(`❌ Error loading generated files: ${error.message}`)
    process.exit(1)
  }
  
  if (newConcepts.length === 0 && updatedConcepts.length === 0) {
    console.log('\n⚠️  No generated concepts to migrate. Exiting.')
    process.exit(0)
  }
  
  // Load original seed concepts
  console.log('\n📚 Loading seed_concepts.json...')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const originalConcepts: Concept[] = JSON.parse(seedContent)
  console.log(`✅ Loaded ${originalConcepts.length} original concepts\n`)
  
  // Create a map of updated concepts by ID
  const updatedConceptsMap = new Map<string, Concept>()
  for (const c of updatedConcepts) {
    updatedConceptsMap.set(c.id.toLowerCase(), c)
  }
  
  // Create a set of existing concept IDs to avoid duplicates
  const existingIds = new Set<string>()
  for (const c of originalConcepts) {
    existingIds.add(c.id.toLowerCase())
  }
  
  // Merge: update existing concepts with new opposites, add new concepts
  const mergedConcepts: Concept[] = []
  let updatedCount = 0
  let newCount = 0
  
  // First, update existing concepts
  for (const originalConcept of originalConcepts) {
    const updated = updatedConceptsMap.get(originalConcept.id.toLowerCase())
    if (updated) {
      // Merge opposites: combine existing and new, remove duplicates
      const existingOpposites = new Set((originalConcept.opposites || []).map(o => String(o).toLowerCase()))
      const newOpposites = (updated.opposites || []).map(o => String(o).toLowerCase())
      
      for (const opp of newOpposites) {
        existingOpposites.add(opp)
      }
      
      mergedConcepts.push({
        ...originalConcept,
        opposites: Array.from(existingOpposites)
      })
      updatedCount++
    } else {
      mergedConcepts.push(originalConcept)
    }
  }
  
  // Then, add new concepts (avoid duplicates)
  for (const newConcept of newConcepts) {
    if (!existingIds.has(newConcept.id.toLowerCase())) {
      mergedConcepts.push(newConcept)
      existingIds.add(newConcept.id.toLowerCase())
      newCount++
    } else {
      console.log(`⚠️  Skipping duplicate concept: ${newConcept.label} (${newConcept.id})`)
    }
  }
  
  // Save merged concepts to seed_concepts.json
  console.log(`\n💾 Saving merged concepts to ${seedPath}...`)
  await fs.writeFile(seedPath, JSON.stringify(mergedConcepts, null, 2))
  console.log(`✅ Saved ${mergedConcepts.length} concepts (${originalConcepts.length} original + ${newCount} new)`)
  console.log(`   Updated ${updatedCount} concepts with new opposites\n`)
  
  // Delete temporary files
  console.log('🧹 Cleaning up temporary files...')
  const filesToDelete = [
    newConceptsPath,
    updatedConceptsPath,
    path.join(outputDir, 'seed_concepts_with_new_opposites.json')
  ]
  
  for (const filePath of filesToDelete) {
    try {
      if (await fs.access(filePath).then(() => true).catch(() => false)) {
        await fs.unlink(filePath)
        console.log(`   ✅ Deleted: ${path.basename(filePath)}`)
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not delete ${path.basename(filePath)}: ${error.message}`)
    }
  }
  
  console.log('\n✅ Migration complete!')
  console.log(`   New concepts added: ${newCount}`)
  console.log(`   Concepts updated: ${updatedCount}`)
  console.log(`   Total concepts in seed_concepts.json: ${mergedConcepts.length}\n`)
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})

