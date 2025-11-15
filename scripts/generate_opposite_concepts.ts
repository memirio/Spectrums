#!/usr/bin/env tsx
/**
 * Generate NEW conceptually opposite concepts for existing concepts
 * 
 * This script:
 * 1. Loads all concepts from seed_concepts.json
 * 2. For each concept, uses Gemini to generate 2-4 NEW opposite concept labels
 * 3. Creates new concept entries with proper structure
 * 4. Links them as opposites
 * 5. Outputs new concepts to be added to seed_concepts.json
 */

import 'dotenv/config'
import OpenAI from 'openai'
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

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY or GEMINI_API_KEY environment variable is required')
  }
  return new OpenAI({ apiKey })
}

/**
 * Generate NEW opposite concept labels for a given concept with retry logic
 * Returns an array of NEW concept labels (not existing ones)
 */
async function generateOppositeConcepts(
  concept: Concept,
  existingConceptLabels: Set<string>,
  existingConceptIds: Set<string>,
  maxRetries: number = 5
): Promise<string[]> {
  const client = getOpenAIClient()
  
  const categoryContext = concept.category ? ` in the category "${concept.category}"` : ''
  
  const prompt = `Generate 2-4 NEW conceptually opposite concept labels for "${concept.label}"${categoryContext}.

CRITICAL REQUIREMENTS:
1. PREFER SINGLE WORDS - avoid compound phrases like "Spontaneous Expression" or "Street Culture"
2. Use simple, common words that people actually search for (e.g., "stupid", "dumb", "chaotic", "messy")
3. Generate BRAND NEW concept labels that don't exist yet
4. Focus on true conceptual opposites - what contradicts "${concept.label}"?
5. Make them specific to design/visual/aesthetic contexts
6. NO double-words or compound phrases unless absolutely necessary

Examples of GOOD opposite concept generation (simple, single words):
- "Academia" → ["stupid", "dumb", "ignorant", "uneducated"]
- "Minimal" → ["cluttered", "busy", "messy", "chaotic"]
- "Static" → ["dynamic", "animated", "moving", "active"]
- "Luxury" → ["cheap", "poor", "basic", "simple"]
- "Geometric" → ["organic", "fluid", "curved", "natural"]
- "Clean" → ["dirty", "messy", "chaotic", "disordered"]
- "Professional" → ["casual", "informal", "relaxed", "playful"]

Examples of BAD (avoid these):
- "Spontaneous Expression" (too long, compound phrase)
- "Street Culture" (compound phrase)
- "Anti-Intellectual" (compound word)
- "Motion-Driven" (compound phrase)

The opposite concepts should:
- Be SINGLE WORDS when possible (preferred)
- Be conceptually contradictory to "${concept.label}"
- Be words people actually use in searches
- Be NEW concepts (not just finding existing opposites)
- Be simple and direct

Return a JSON object with an "opposites" array. Format:
{"opposites": ["opposite1", "opposite2", "opposite3"]}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative assistant that generates new concept labels for design and visual aesthetics. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
      
      const text = completion.choices[0]?.message?.content?.trim() || ''
      
      // Parse JSON response
      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch {
        // Try to extract JSON array from text
        const jsonMatch = text.match(/\[.*\]/s) || text.match(/```(?:json)?\s*(\[.*?\])\s*```/s)
        if (jsonMatch) {
          parsed = JSON.parse(Array.isArray(jsonMatch) ? jsonMatch[1] : jsonMatch[0])
        } else {
          throw new Error('Could not parse JSON from response')
        }
      }
      
      // Handle different response formats
      let opposites: string[] = []
      if (Array.isArray(parsed)) {
        opposites = parsed
      } else if (parsed.opposites && Array.isArray(parsed.opposites)) {
        opposites = parsed.opposites
      } else if (parsed.concepts && Array.isArray(parsed.concepts)) {
        opposites = parsed.concepts
      } else {
        throw new Error('Response does not contain an array of opposites')
      }
      if (!Array.isArray(opposites)) {
        throw new Error('Response is not an array')
      }
      
      // Filter out existing concepts and normalize
      const newOpposites = opposites
        .map((opp: string) => String(opp).trim())
        .filter((opp: string) => {
          const normalized = opp.toLowerCase()
          // Check if it already exists as a label or ID
          return !existingConceptLabels.has(normalized) && 
                 !existingConceptIds.has(normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        })
        .slice(0, 4) // Limit to 4
      
      return newOpposites
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('exceeded your current quota')
      const isRateLimit = error.status === 429 && !isQuotaError
      const isServiceUnavailable = error.status === 503 || errorMessage.includes('503') || errorMessage.includes('overloaded')
      
      if (isQuotaError) {
        // Quota/billing errors need account action, not retries
        console.error(`    ❌ Quota/billing error for "${concept.label}": ${errorMessage}`)
        console.error(`       This usually means: billing not set up, spending limit reached, or account needs verification`)
        return []
      }
      
      if (isRateLimit || isServiceUnavailable) {
        if (attempt < maxRetries - 1) {
          // Extract retry delay from error if available (OpenAI sometimes includes this)
          const retryDelayMatch = errorMessage.match(/retry[_-]after[:\s]+(\d+)/i) || 
                                  errorMessage.match(/retry in (\d+(?:\.\d+)?)s/i)
          const baseDelay = retryDelayMatch ? parseFloat(retryDelayMatch[1]) * 1000 : Math.pow(2, attempt) * 2000
          const delay = Math.min(baseDelay, 60000) // Max 60 seconds
          
          console.log(`    ⏳ Rate limit hit, waiting ${(delay / 1000).toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      if (attempt === maxRetries - 1) {
        console.error(`[openai] Error generating opposite concepts for "${concept.label}" after ${maxRetries} attempts: ${errorMessage}`)
        return []
      }
    }
  }
  
  return []
}

/**
 * Convert a label to a concept ID format
 */
function labelToConceptId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Create a new concept structure
 */
function createNewConcept(
  label: string,
  oppositeOf: Concept,
  category?: string
): Concept {
  const id = labelToConceptId(label)
  
  return {
    id,
    label,
    synonyms: [label.toLowerCase()],
    related: [],
    category: category || oppositeOf.category || 'Uncategorized',
    opposites: [oppositeOf.id.toLowerCase()]
  }
}

async function main() {
  console.log('📚 Loading concepts from seed_concepts.json...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(seedContent)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Build sets of existing labels and IDs
  const existingLabels = new Set<string>()
  const existingIds = new Set<string>()
  for (const c of concepts) {
    existingLabels.add(c.label.toLowerCase())
    existingIds.add(c.id.toLowerCase())
    if (c.synonyms) {
      for (const syn of c.synonyms) {
        existingLabels.add(String(syn).toLowerCase())
      }
    }
  }
  
  console.log(`📊 Existing concepts: ${concepts.length}`)
  console.log(`   Unique labels: ${existingLabels.size}`)
  console.log(`   Unique IDs: ${existingIds.size}\n`)
  
  console.log('🔄 Generating NEW opposite concepts...\n')
  console.log('⚠️  This will make API calls to OpenAI. Processing in batches...\n')
  
  const newConcepts: Concept[] = []
  const updatedConcepts: Concept[] = []
  const batchSize = 3 // Reduced batch size to avoid rate limits
  const delayBetweenBatches = 5000 // 5 seconds between batches
  
  for (let i = 0; i < concepts.length; i += batchSize) {
    const batch = concepts.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1
    const totalBatches = Math.ceil(concepts.length / batchSize)
    
    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (processing ${batch.length} concepts)...`)
    
    const batchPromises = batch.map(async (concept) => {
      try {
        console.log(`  🔍 Generating opposites for "${concept.label}"...`)
        
        const oppositeLabels = await generateOppositeConcepts(
          concept,
          existingLabels,
          existingIds,
          5 // max retries
        )
        
        if (oppositeLabels.length === 0) {
          console.log(`    ⚠️  No new opposites generated for "${concept.label}"`)
          return { concept, newOpposites: [] }
        }
        
        console.log(`    ✅ Generated ${oppositeLabels.length} new opposite concepts: ${oppositeLabels.join(', ')}`)
        
        // Create new concepts
        const newOpps: Concept[] = []
        for (const oppLabel of oppositeLabels) {
          const newConcept = createNewConcept(oppLabel, concept, concept.category)
          
          // Check if ID already exists (might have different label)
          if (existingIds.has(newConcept.id)) {
            console.log(`    ⚠️  Skipping "${oppLabel}" - ID "${newConcept.id}" already exists`)
            continue
          }
          
          newOpps.push(newConcept)
          existingIds.add(newConcept.id)
          existingLabels.add(newConcept.label.toLowerCase())
        }
        
        // Update original concept to include opposites
        const updatedConcept: Concept = {
          ...concept,
          opposites: [
            ...(concept.opposites || []),
            ...newOpps.map(c => c.id)
          ]
        }
        
        return { concept: updatedConcept, newOpposites: newOpps }
      } catch (error: any) {
        console.error(`    ❌ Error processing "${concept.label}": ${error.message}`)
        return { concept, newOpposites: [] }
      }
    })
    
    const results = await Promise.all(batchPromises)
    
    for (const { concept, newOpposites } of results) {
      updatedConcepts.push(concept)
      newConcepts.push(...newOpposites)
    }
    
    // Save incrementally every 50 batches so user can see progress
    if (batchNum % 50 === 0) {
      console.log(`\n💾 Saving progress (batch ${batchNum}/${totalBatches})...`)
      
      // Reload file to get any previous updates
      const currentFileContent = await fs.readFile(seedPath, 'utf-8')
      const currentConcepts: Concept[] = JSON.parse(currentFileContent)
      
      // Create maps for merging
      const updatedConceptsMap = new Map<string, Concept>()
      for (const c of updatedConcepts) {
        updatedConceptsMap.set(c.id.toLowerCase(), c)
      }
      
      const existingNewConceptsMap = new Map<string, Concept>()
      for (const c of currentConcepts) {
        // Check if it's a new concept (not in original concepts list)
        const isOriginal = concepts.some(orig => orig.id.toLowerCase() === c.id.toLowerCase())
        if (!isOriginal) {
          existingNewConceptsMap.set(c.id.toLowerCase(), c)
        }
      }
      
      // Merge: start with current file state, then apply updates
      const mergedConcepts: Concept[] = []
      const processedIds = new Set<string>()
      
      // First, add all current concepts (updated or not)
      for (const currentConcept of currentConcepts) {
        const id = currentConcept.id.toLowerCase()
        processedIds.add(id)
        
        // Use updated version if available, otherwise keep current
        const updated = updatedConceptsMap.get(id)
        if (updated) {
          // Merge opposites: combine existing and new
          const existingOpposites = new Set((currentConcept.opposites || []).map(o => String(o).toLowerCase()))
          const newOpposites = (updated.opposites || []).map(o => String(o).toLowerCase())
          for (const opp of newOpposites) {
            existingOpposites.add(opp)
          }
          mergedConcepts.push({
            ...updated,
            opposites: Array.from(existingOpposites)
          })
        } else {
          mergedConcepts.push(currentConcept)
        }
      }
      
      // Add any new concepts that aren't already in the file
      for (const newConcept of newConcepts) {
        const id = newConcept.id.toLowerCase()
        if (!processedIds.has(id) && !existingNewConceptsMap.has(id)) {
          mergedConcepts.push(newConcept)
          processedIds.add(id)
        }
      }
      
      await fs.writeFile(seedPath, JSON.stringify(mergedConcepts, null, 2))
      console.log(`   ✅ Saved ${mergedConcepts.length} concepts (${newConcepts.length} new so far)\n`)
    }
    
    // Delay between batches to avoid rate limits
    if (i + batchSize < concepts.length) {
      console.log(`  ⏳ Waiting ${delayBetweenBatches / 1000}s before next batch...`)
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
    }
  }
  
  console.log('\n✅ Generation complete!\n')
  console.log('📊 Summary:')
  console.log(`   Original concepts: ${concepts.length}`)
  console.log(`   New opposite concepts generated: ${newConcepts.length}`)
  console.log(`   Concepts with new opposites: ${updatedConcepts.filter(c => c.opposites && c.opposites.length > 0).length}\n`)
  
  // Merge everything: updated concepts + new concepts
  // Create a map of updated concepts by ID for quick lookup
  const updatedConceptsMap = new Map<string, Concept>()
  for (const c of updatedConcepts) {
    updatedConceptsMap.set(c.id.toLowerCase(), c)
  }
  
  // Merge: use updated version if exists, otherwise keep original
  const mergedConcepts: Concept[] = []
  for (const originalConcept of concepts) {
    const updated = updatedConceptsMap.get(originalConcept.id.toLowerCase())
    mergedConcepts.push(updated || originalConcept)
  }
  
  // Add all new concepts at the end
  mergedConcepts.push(...newConcepts)
  
  // Save directly to seed_concepts.json
  await fs.writeFile(seedPath, JSON.stringify(mergedConcepts, null, 2))
  console.log(`💾 Saved directly to: ${seedPath}`)
  console.log(`   Total concepts: ${mergedConcepts.length} (${concepts.length} original + ${newConcepts.length} new)`)
  console.log(`   Updated concepts with new opposites: ${updatedConcepts.filter(c => c.opposites && c.opposites.length > 0).length}\n`)
  
  // Also save backup files for reference
  const outputDir = path.join(process.cwd(), 'scripts', 'generated_opposites')
  await fs.mkdir(outputDir, { recursive: true })
  
  const newConceptsPath = path.join(outputDir, 'new_opposite_concepts.json')
  await fs.writeFile(newConceptsPath, JSON.stringify(newConcepts, null, 2))
  console.log(`📋 Backup: New concepts also saved to: ${newConceptsPath}`)
  
  console.log('\n✅ seed_concepts.json has been updated with new opposite concepts!\n')
}

main().catch(err => {
  console.error('Script failed:', err)
  process.exit(1)
})

