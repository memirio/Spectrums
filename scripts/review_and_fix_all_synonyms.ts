#!/usr/bin/env tsx
/**
 * Review and Fix All Synonyms
 * 
 * Reviews all concepts in the database and regenerates synonyms using:
 * 1. Thesaurus (open-source, accurate)
 * 2. AI fallback (for design-specific terms)
 * 
 * Validates against opposites to prevent contradictions.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { generateSynonymsAndRelatedWithAI } from '../src/lib/concept-enrichment'

const prisma = new PrismaClient()

interface Concept {
  id: string
  label: string
  synonyms?: string[] | null
  related?: string[] | null
  opposites?: string[] | null
}

async function main() {
  console.log('🔍 Reviewing and fixing all synonyms...\n')
  
  // Get all concepts
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      related: true,
      opposites: true
    },
    orderBy: {
      label: 'asc'
    }
  })
  
  console.log(`📊 Found ${concepts.length} concepts to review\n`)
  
  // Check for limit argument
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined
  
  const conceptsToProcess = limit 
    ? concepts.slice(0, limit)
    : concepts
  
  console.log(`Processing ${conceptsToProcess.length} concepts${limit ? ` (limited to ${limit})` : ''}...\n`)
  
  let processed = 0
  let updated = 0
  let skipped = 0
  let errors = 0
  
  // Build existing concepts map for validation
  const existingConcepts: Concept[] = concepts.map(c => ({
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
  
  for (const concept of conceptsToProcess) {
    processed++
    
    try {
      const currentSynonyms = Array.isArray(concept.synonyms) ? concept.synonyms : []
      const currentRelated = Array.isArray(concept.related) ? concept.related : []
      
      // Generate synonyms even if concept has none (they might be missing)
      // Only skip if we explicitly want to (not the case here)
      if (currentSynonyms.length === 0 && currentRelated.length === 0) {
        console.log(`[${processed}/${conceptsToProcess.length}] Processing "${concept.label}" (no synonyms/related - generating new ones)...`)
      }
      
      // Regenerate synonyms using the new thesaurus-based approach
      console.log(`[${processed}/${conceptsToProcess.length}] Processing "${concept.label}"...`)
      console.log(`   Current synonyms: ${currentSynonyms.length > 0 ? currentSynonyms.join(', ') : 'none'}`)
      
      const regenerated = await generateSynonymsAndRelatedWithAI(
        concept.label,
        undefined, // category
        existingConcepts.filter(c => c.id !== concept.id), // exclude current concept
        2 // max retries
      )
      
      const newSynonyms = regenerated.synonyms || []
      const newRelated = regenerated.related || []
      
      // Check if current synonyms are obviously wrong (design-specific terms with generic synonyms)
      const hasBadSynonyms = hasObviouslyWrongSynonyms(concept.label, currentSynonyms)
      
      // Check if current synonyms include the concept label itself (should be filtered)
      const hasSelfAsSynonym = currentSynonyms.some(syn => {
        const synLower = syn.toLowerCase()
        const synId = synLower.replace(/[^a-z0-9]+/g, '-')
        const conceptLabelLower = concept.label.toLowerCase()
        const conceptLabelId = conceptLabelLower.replace(/[^a-z0-9]+/g, '-')
        return synLower === conceptLabelLower || synId === conceptLabelId || synId === concept.id.toLowerCase()
      })
      
      // Check if current synonyms include contradictions (synonyms that are also opposites)
      const hasContradictions = currentSynonyms.some(syn => {
        const synLower = syn.toLowerCase()
        const synId = synLower.replace(/[^a-z0-9]+/g, '-')
        const conceptOpposites = oppositesMap.get(concept.id.toLowerCase()) || []
        return conceptOpposites.includes(synLower) || conceptOpposites.includes(synId)
      })
      
      // If we have bad synonyms, contradictions, or self-references, always use new ones
      const hasIssues = hasBadSynonyms || hasSelfAsSynonym || hasContradictions
      
      // If we have bad synonyms, always use new ones (even if empty, better than wrong ones)
      // Otherwise, preserve existing if new is empty
      const finalSynonyms = hasIssues
        ? newSynonyms  // Force use new (even if empty) if current have issues
        : (newSynonyms.length > 0 ? newSynonyms : currentSynonyms)
      const finalRelated = newRelated.length > 0 ? newRelated : currentRelated
      
      // Check if synonyms changed
      const synonymsChanged = 
        finalSynonyms.length !== currentSynonyms.length ||
        !finalSynonyms.every(s => currentSynonyms.includes(s)) ||
        !currentSynonyms.every(s => finalSynonyms.includes(s))
      
      const relatedChanged = 
        finalRelated.length !== currentRelated.length ||
        !finalRelated.every(r => currentRelated.includes(r)) ||
        !currentRelated.every(r => finalRelated.includes(r))
      
      if (synonymsChanged || relatedChanged) {
        // Update database
        // If we have bad synonyms, always use new ones (even if empty - better than wrong ones)
        // Otherwise, preserve existing if new is empty
        const synonymsToSave = hasBadSynonyms 
          ? (finalSynonyms.length > 0 ? finalSynonyms : null)  // Remove bad ones even if no replacement
          : (finalSynonyms.length > 0 ? finalSynonyms : (currentSynonyms.length > 0 ? currentSynonyms : null))
        
        // Handle database connection issues with retry
        let updateSuccess = false
        let retries = 0
        while (!updateSuccess && retries < 3) {
          try {
            await prisma.concept.update({
              where: { id: concept.id },
              data: {
                synonyms: synonymsToSave,
                related: finalRelated.length > 0 ? finalRelated : (currentRelated.length > 0 ? currentRelated : null)
              }
            })
            updateSuccess = true
          } catch (error: any) {
            const errorMsg = error.message || String(error)
            if (errorMsg.includes('closed the connection') || errorMsg.includes('connection') || errorMsg.includes('timeout')) {
              retries++
              if (retries < 3) {
                console.warn(`   ⚠️  Database connection issue, retrying (${retries}/3)...`)
                // Reconnect by disconnecting and reconnecting
                await prisma.$disconnect()
                await new Promise(resolve => setTimeout(resolve, 1000))
                // Prisma client will auto-reconnect on next query
              } else {
                throw error
              }
            } else {
              throw error
            }
          }
        }
        
        updated++
        console.log(`   ✅ Updated:`)
        if (synonymsChanged) {
          const removed = currentSynonyms.filter(s => !finalSynonyms.includes(s))
          const added = finalSynonyms.filter(s => !currentSynonyms.includes(s))
          console.log(`      Synonyms: ${currentSynonyms.length} → ${finalSynonyms.length}`)
          if (hasIssues) {
            if (hasSelfAsSynonym) {
              console.log(`      ⚠️  Removed self-reference`)
            }
            if (hasContradictions) {
              console.log(`      ⚠️  Removed contradictions`)
            }
            if (hasBadSynonyms) {
              console.log(`      ⚠️  Removed bad synonyms`)
            }
          }
          if (finalSynonyms.length > 0) {
            console.log(`      New: ${finalSynonyms.join(', ')}`)
          } else if (removed.length > 0) {
            console.log(`      Removed: ${removed.join(', ')}`)
          }
        }
        if (relatedChanged) {
          console.log(`      Related: ${currentRelated.length} → ${finalRelated.length}`)
          if (finalRelated.length > 0) {
            console.log(`      New: ${finalRelated.join(', ')}`)
          } else if (currentRelated.length > 0) {
            console.log(`      Preserved existing: ${currentRelated.join(', ')}`)
          }
        }
      } else {
        console.log(`   ⏭️  No changes needed`)
      }
      
      // Small delay to avoid rate limiting and keep connection alive
      if (processed % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500))
        // Ping database every 100 concepts to keep connection alive
        if (processed % 100 === 0) {
          try {
            await prisma.concept.findFirst({ take: 1 })
          } catch (error) {
            // Connection issue - will be handled on next update
            console.warn(`   ⚠️  Connection check failed at concept ${processed}`)
          }
        }
      }
      
    } catch (error: any) {
      errors++
      console.error(`   ❌ Error processing "${concept.label}": ${error.message}`)
      // Continue with next concept
    }
  }
  
  console.log(`\n✅ Review complete!`)
  console.log(`   Processed: ${processed}`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors: ${errors}`)
  
  // Show summary of concepts that still have issues
  console.log(`\n🔍 Checking for remaining issues...`)
  const allConceptsAfter = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      opposites: true
    }
  })
  
  // oppositesMap already loaded above, reuse it
  
  // Find concepts with synonyms that are also opposites
  const issues: Array<{ concept: string, badSynonyms: string[] }> = []
  for (const concept of allConceptsAfter) {
    const synonyms = Array.isArray(concept.synonyms) ? concept.synonyms : []
    const conceptId = concept.id.toLowerCase()
    const conceptOpposites = oppositesMap.get(conceptId) || []
    
    const badSynonyms = synonyms.filter(syn => {
      const synLower = syn.toLowerCase()
      return conceptOpposites.includes(synLower)
    })
    
    if (badSynonyms.length > 0) {
      issues.push({
        concept: concept.label,
        badSynonyms
      })
    }
  }
  
  if (issues.length > 0) {
    console.log(`\n⚠️  Found ${issues.length} concepts with synonyms that are also opposites:`)
    issues.slice(0, 20).forEach(issue => {
      console.log(`   - "${issue.concept}": ${issue.badSynonyms.join(', ')}`)
    })
    if (issues.length > 20) {
      console.log(`   ... and ${issues.length - 20} more`)
    }
  } else {
    console.log(`✅ No contradictions found!`)
  }
}

/**
 * Check if synonyms are obviously wrong for a design concept
 */
function hasObviouslyWrongSynonyms(conceptLabel: string, synonyms: string[]): boolean {
  const normalized = conceptLabel.toLowerCase()
  
  // Design-specific terms that shouldn't have generic synonyms
  const designTerms = ['3d', '2d', '3d-printed', 'rendering', 'printed']
  if (!designTerms.some(dt => normalized.includes(dt))) {
    return false
  }
  
  // Bad synonyms for design terms
  const badSynonyms = ['movie', 'film', 'picture', 'pic', 'flick', 'appearance', 'cinema', 'second', '2nd', 'ordinal']
  
  // Check if any synonyms are in the bad list
  return synonyms.some(syn => badSynonyms.includes(syn.toLowerCase()))
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

