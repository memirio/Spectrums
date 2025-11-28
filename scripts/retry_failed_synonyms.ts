#!/usr/bin/env tsx
/**
 * Retry Failed Synonyms
 * 
 * Retries synonym generation for concepts that failed in the initial run.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { generateSynonymsAndRelatedWithAI } from '../src/lib/concept-enrichment'
import * as fs from 'fs'

const prisma = new PrismaClient()

interface Concept {
  id: string
  label: string
  synonyms?: string[] | null
  related?: string[] | null
  opposites?: string[] | null
}

async function main() {
  // Read failed concepts from file
  const failedConceptsFile = '/tmp/failed_concepts.txt'
  if (!fs.existsSync(failedConceptsFile)) {
    console.error('❌ Failed concepts file not found:', failedConceptsFile)
    console.log('Extracting failed concepts from log...')
    
    // Extract from log
    const logContent = fs.readFileSync('/tmp/synonym_fix_all.log', 'utf-8')
    const failedMatches = logContent.match(/❌ Error processing "([^"]+)"/g) || []
    const failedConcepts = failedMatches.map(m => m.match(/"([^"]+)"/)?.[1]).filter(Boolean) as string[]
    
    if (failedConcepts.length === 0) {
      console.log('✅ No failed concepts found in log')
      return
    }
    
    fs.writeFileSync(failedConceptsFile, failedConcepts.join('\n'))
    console.log(`📝 Extracted ${failedConcepts.length} failed concepts`)
  }
  
  const failedConceptLabels = fs.readFileSync(failedConceptsFile, 'utf-8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
  
  console.log(`🔍 Retrying ${failedConceptLabels.length} failed concepts...\n`)
  
  // Get all concepts for validation
  const allConcepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      related: true,
      opposites: true
    }
  })
  
  // Find the failed concepts
  const conceptsToRetry = allConcepts.filter(c => 
    failedConceptLabels.some(label => 
      c.label.toLowerCase() === label.toLowerCase()
    )
  )
  
  console.log(`📊 Found ${conceptsToRetry.length} concepts to retry\n`)
  
  if (conceptsToRetry.length === 0) {
    console.log('✅ No concepts found to retry')
    return
  }
  
  let processed = 0
  let updated = 0
  let skipped = 0
  let errors = 0
  
  // Build existing concepts map for validation
  const existingConcepts: Concept[] = allConcepts.map(c => ({
    id: c.id,
    label: c.label,
    synonyms: Array.isArray(c.synonyms) ? c.synonyms : null,
    related: Array.isArray(c.related) ? c.related : null,
    opposites: Array.isArray(c.opposites) ? c.opposites : null
  }))
  
  // Load opposites map for contradiction checking
  let oppositesMap: Map<string, string[]> = new Map()
  try {
    const { CONCEPT_OPPOSITES } = await import('../src/lib/concept-opposites')
    for (const [conceptId, opposites] of Object.entries(CONCEPT_OPPOSITES)) {
      oppositesMap.set(conceptId.toLowerCase(), opposites.map((o: string) => o.toLowerCase()))
    }
  } catch (error) {
    console.warn('Could not load concept-opposites for contradiction checking')
  }
  
  const validateSynonyms = (synonyms: string[], conceptLabel: string, conceptId: string): string[] => {
    return synonyms.filter(syn => {
      const synLower = syn.toLowerCase()
      const labelLower = conceptLabel.toLowerCase()
      
      // Remove if it's the same as the concept label
      if (synLower === labelLower) return false
      
      // Remove if it's an opposite
      const opposites = oppositesMap.get(conceptId.toLowerCase()) || []
      if (opposites.includes(synLower)) return false
      
      return true
    })
  }
  
  for (const concept of conceptsToRetry) {
    processed++
    
    try {
      const currentSynonyms = Array.isArray(concept.synonyms) ? concept.synonyms : []
      const currentRelated = Array.isArray(concept.related) ? concept.related : []
      
      console.log(`[${processed}/${conceptsToRetry.length}] Retrying "${concept.label}"...`)
      console.log(`   Current synonyms: ${currentSynonyms.length > 0 ? currentSynonyms.join(', ') : 'none'}`)
      
      // Regenerate synonyms using the new thesaurus-based approach
      const regenerated = await generateSynonymsAndRelatedWithAI(
        concept.label,
        undefined, // category
        existingConcepts.filter(c => c.id !== concept.id), // exclude current concept
        oppositesMap.get(concept.id.toLowerCase()) || []
      )
      
      // Validate synonyms
      const validatedSynonyms = validateSynonyms(
        regenerated.synonyms || [],
        concept.label,
        concept.id
      )
      
      // Check if we should update
      const synonymsChanged = JSON.stringify(validatedSynonyms.sort()) !== JSON.stringify((currentSynonyms || []).sort())
      const relatedChanged = JSON.stringify((regenerated.related || []).sort()) !== JSON.stringify((currentRelated || []).sort())
      
      if (synonymsChanged || relatedChanged) {
        // Update database
        await prisma.concept.update({
          where: { id: concept.id },
          data: {
            synonyms: validatedSynonyms.length > 0 ? validatedSynonyms : null,
            related: (regenerated.related || []).length > 0 ? regenerated.related : null
          }
        })
        
        updated++
        console.log(`   ✅ Updated:`)
        console.log(`      Synonyms: ${validatedSynonyms.length > 0 ? validatedSynonyms.join(', ') : 'none'}`)
        console.log(`      Related: ${(regenerated.related || []).length > 0 ? regenerated.related?.join(', ') : 'none'}`)
      } else {
        skipped++
        console.log(`   ⏭️  Skipped (no changes needed)`)
      }
      
      // Keep-alive ping every 10 concepts
      if (processed % 10 === 0) {
        await prisma.$queryRaw`SELECT 1`
      }
      
    } catch (error: any) {
      errors++
      console.error(`   ❌ Error processing "${concept.label}":`, error.message)
      
      // Retry logic for database connection errors
      if (error.message?.includes('connection') || error.message?.includes('timeout')) {
        console.log(`   🔄 Retrying after connection error...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        try {
          // Reconnect
          await prisma.$connect()
          
          // Retry the concept
          const regenerated = await generateSynonymsAndRelatedWithAI(
            concept.label,
            undefined,
            existingConcepts.filter(c => c.id !== concept.id),
            oppositesMap.get(concept.id.toLowerCase()) || []
          )
          
          const validatedSynonyms = validateSynonyms(
            regenerated.synonyms || [],
            concept.label,
            concept.id
          )
          
          await prisma.concept.update({
            where: { id: concept.id },
            data: {
              synonyms: validatedSynonyms.length > 0 ? validatedSynonyms : null,
              related: (regenerated.related || []).length > 0 ? regenerated.related : null
            }
          })
          
          updated++
          console.log(`   ✅ Retry successful`)
        } catch (retryError: any) {
          console.error(`   ❌ Retry failed:`, retryError.message)
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 RETRY SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total concepts processed: ${processed}`)
  console.log(`Successfully updated: ${updated}`)
  console.log(`Skipped (no changes): ${skipped}`)
  console.log(`Errors: ${errors}`)
  console.log('='.repeat(50))
  
  if (errors === 0) {
    console.log('\n✅ All failed concepts have been successfully retried!')
  } else {
    console.log(`\n⚠️  ${errors} concepts still have errors. Check the log above for details.`)
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)

