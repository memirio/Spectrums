/**
 * One-off script to auto-classify concepts with LLM
 * 
 * For each concept, asks an LLM to determine:
 * - applicableCategories: ["website"], ["packaging"], ["website", "packaging"], or []
 * - embeddingStrategy: "generic", "website_style", or "packaging_style"
 * 
 * Updates seed_concepts.json and database with classifications.
 * Safe to run multiple times (idempotent).
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs/promises'
import * as path from 'path'
import OpenAI from 'openai'

interface Concept {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
  applicableCategories?: string[]
  embeddingStrategy?: string
}

interface LLMClassification {
  applicableCategories: string[]
  embeddingStrategy: 'generic' | 'website_style' | 'packaging_style'
}

const CHECKPOINT_FILE = path.join(process.cwd(), 'scripts', 'concept_classification_checkpoint.json')
const BATCH_SIZE = 10 // Process concepts in batches
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds between batches

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  return new OpenAI({ apiKey })
}

/**
 * Classify a single concept using OpenAI
 */
async function classifyConceptWithLLM(
  concept: Concept,
  client: OpenAI,
  maxRetries: number = 3
): Promise<LLMClassification> {
  const synonyms = (concept.synonyms || []).slice(0, 10).join(', ') // Limit for prompt
  const related = (concept.related || []).slice(0, 10).join(', ')
  const opposites = (concept.opposites || []).slice(0, 5).join(', ')
  
  const prompt = `Classify this design concept for category relevance and embedding strategy.

CONCEPT:
- Label: "${concept.label}"
${synonyms ? `- Synonyms: ${synonyms}` : ''}
${related ? `- Related terms: ${related}` : ''}
${opposites ? `- Opposites: ${opposites}` : ''}

CATEGORIES:
- "website": Web design, UI/UX, digital interfaces, layouts, navigation
- "packaging": Product packaging, labels, boxes, physical product design
- "app": Mobile app design, app interfaces
- "fonts": Typography, font design, letterforms
- "graphic-design": Print design, posters, branding materials
- "branding": Brand identity, logos, brand visuals

EMBEDDING STRATEGIES:
- "generic": Colors, moods, textures, vibes, emotions (works across all categories)
- "website_style": Layout patterns, UI structure, navigation, web-specific design elements
- "packaging_style": Physical form, product photography, packaging visuals, materiality

Determine:
1. Which categories this concept is relevant to (can be multiple or none)
2. Which embedding strategy fits best

Return ONLY valid JSON in this exact format:
{
  "applicableCategories": ["website", "packaging"],
  "embeddingStrategy": "generic"
}

Rules:
- If concept is about colors, moods, textures, emotions → "generic" strategy, applicable to relevant categories
- If concept is about layouts, UI, navigation → "website_style" strategy, ["website", "app"]
- If concept is about physical form, packaging, products → "packaging_style" strategy, ["packaging"]
- If concept applies broadly → multiple categories, "generic" strategy
- If concept is very specific to one category → that category, specific strategy`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini', // Using cheaper model for bulk classification
        messages: [
          {
            role: 'system',
            content: 'You are an expert in design concepts and visual aesthetics. Classify design concepts for category relevance and embedding strategy. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent classifications
        response_format: { type: 'json_object' }
      })
      
      const text = completion.choices[0]?.message?.content?.trim() || ''
      let parsed: any
      
      try {
        // Try to extract JSON from response
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/(\{[\s\S]*\})/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } else {
          parsed = JSON.parse(text)
        }
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse JSON for "${concept.label}", using defaults`)
        return {
          applicableCategories: ['website'],
          embeddingStrategy: 'website_style'
        }
      }
      
      // Validate and normalize response
      const categories = Array.isArray(parsed.applicableCategories) 
        ? parsed.applicableCategories.filter((c: any) => 
            ['website', 'packaging', 'app', 'fonts', 'graphic-design', 'branding'].includes(c)
          )
        : []
      
      const strategy = ['generic', 'website_style', 'packaging_style'].includes(parsed.embeddingStrategy)
        ? parsed.embeddingStrategy
        : 'website_style'
      
      // Default to website if no categories found
      const finalCategories = categories.length > 0 ? categories : ['website']
      
      return {
        applicableCategories: finalCategories,
        embeddingStrategy: strategy as 'generic' | 'website_style' | 'packaging_style'
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('Rate limit')
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Exponential backoff for rate limits
        const waitSeconds = Math.pow(2, attempt) * 5 // 5s, 10s, 20s
        console.log(`  ⏳ Rate limit hit for "${concept.label}", waiting ${waitSeconds.toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
        continue
      }
      
      // If it's a quota error or final attempt, return defaults
      if (errorMessage.includes('quota') || errorMessage.includes('billing') || attempt === maxRetries - 1) {
        console.error(`  ⚠️  Error classifying "${concept.label}": ${errorMessage}, using defaults`)
        return {
          applicableCategories: ['website'],
          embeddingStrategy: 'website_style'
        }
      }
    }
  }
  
  // Fallback defaults
  return {
    applicableCategories: ['website'],
    embeddingStrategy: 'website_style'
  }
}

/**
 * Load checkpoint to resume from where we left off
 */
async function loadCheckpoint(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(CHECKPOINT_FILE, 'utf-8')
    const checkpoint = JSON.parse(content)
    return new Set(checkpoint.processedIds || [])
  } catch {
    return new Set()
  }
}

/**
 * Save checkpoint
 */
async function saveCheckpoint(processedIds: Set<string>): Promise<void> {
  await fs.writeFile(
    CHECKPOINT_FILE,
    JSON.stringify({ processedIds: Array.from(processedIds) }, null, 2)
  )
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🤖 Auto-Classify Concepts with LLM')
  console.log('═'.repeat(70))
  console.log()
  
  // Load concepts from seed file
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  console.log('📚 Loading concepts from seed_concepts.json...')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const seedConcepts: Concept[] = JSON.parse(seedContent)
  console.log(`✅ Loaded ${seedConcepts.length} concepts from seed file`)
  
  // Also load concepts from database that might not be in seed file
  console.log('📚 Loading concepts from database...')
  const dbConcepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      related: true,
      opposites: true,
      applicableCategories: true,
      embeddingStrategy: true,
    }
  })
  
  // Create a map of concepts by ID
  const conceptMap = new Map<string, Concept>()
  
  // Add seed concepts first
  for (const c of seedConcepts) {
    conceptMap.set(c.id, c)
  }
  
  // Add DB concepts that aren't in seed (convert DB format to Concept format)
  for (const dbc of dbConcepts) {
    if (!conceptMap.has(dbc.id)) {
      conceptMap.set(dbc.id, {
        id: dbc.id,
        label: dbc.label,
        synonyms: (dbc.synonyms as unknown as string[]) || [],
        related: (dbc.related as unknown as string[]) || [],
        opposites: (dbc.opposites as unknown as string[]) || [],
        applicableCategories: (dbc.applicableCategories as unknown as string[]) || undefined,
        embeddingStrategy: dbc.embeddingStrategy || undefined,
      })
    }
  }
  
  const concepts = Array.from(conceptMap.values())
  console.log(`✅ Total concepts to process: ${concepts.length} (${seedConcepts.length} from seed, ${concepts.length - seedConcepts.length} from DB only)`)
  console.log()
  
  // Load checkpoint
  const processedIds = await loadCheckpoint()
  console.log(`📋 Checkpoint: ${processedIds.size} concepts already processed`)
  console.log()
  
  // Filter out already processed concepts
  const conceptsToProcess = concepts.filter(c => !processedIds.has(c.id))
  console.log(`🔄 Processing ${conceptsToProcess.length} concepts (${concepts.length - conceptsToProcess.length} already processed)`)
  console.log()
  
  if (conceptsToProcess.length === 0) {
    console.log('✅ All concepts already processed!')
    return
  }
  
  // Initialize OpenAI client
  const client = getOpenAIClient()
  
  let processed = 0
  let updated = 0
  let errors = 0
  
  // Process in batches
  for (let i = 0; i < conceptsToProcess.length; i += BATCH_SIZE) {
    const batch = conceptsToProcess.slice(i, i + BATCH_SIZE)
    console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(conceptsToProcess.length / BATCH_SIZE)} (${batch.length} concepts)...`)
    
    // Process batch
    for (const concept of batch) {
      try {
        console.log(`  🔍 Classifying: "${concept.label}" (${concept.id})`)
        
        // Classify with LLM
        const classification = await classifyConceptWithLLM(concept, client)
        
        // Update concept
        concept.applicableCategories = classification.applicableCategories
        concept.embeddingStrategy = classification.embeddingStrategy
        
        console.log(`    ✅ Categories: [${classification.applicableCategories.join(', ')}], Strategy: ${classification.embeddingStrategy}`)
        
        // Update in database
        await prisma.concept.upsert({
          where: { id: concept.id },
          update: {
            applicableCategories: classification.applicableCategories,
            embeddingStrategy: classification.embeddingStrategy,
          },
          create: {
            id: concept.id,
            label: concept.label,
            locale: 'en',
            synonyms: concept.synonyms || [],
            related: concept.related || [],
            opposites: concept.opposites || [],
            weight: 1.0,
            embedding: [], // Will be generated separately
            applicableCategories: classification.applicableCategories,
            embeddingStrategy: classification.embeddingStrategy,
          }
        })
        
        processed++
        updated++
        processedIds.add(concept.id)
        
        // Save checkpoint every 10 concepts
        if (processed % 10 === 0) {
          await saveCheckpoint(processedIds)
        }
      } catch (error: any) {
        console.error(`  ❌ Error processing "${concept.label}": ${error.message}`)
        errors++
        // Still mark as processed to avoid infinite retries
        processedIds.add(concept.id)
      }
    }
    
    // Save checkpoint after each batch
    await saveCheckpoint(processedIds)
    
    // Delay between batches to avoid rate limits
    if (i + BATCH_SIZE < conceptsToProcess.length) {
      console.log(`  ⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`)
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
    }
    
    console.log()
  }
  
  // Write updated concepts back to seed file (only seed concepts, not DB-only ones)
  console.log('💾 Writing updated concepts to seed_concepts.json...')
  // Filter to only concepts that were originally in seed file
  const seedConceptIds = new Set(seedConcepts.map(c => c.id))
  const conceptsToWrite = concepts.filter(c => seedConceptIds.has(c.id))
  await fs.writeFile(seedPath, JSON.stringify(conceptsToWrite, null, 2))
  console.log(`✅ Updated seed_concepts.json (${conceptsToWrite.length} concepts)`)
  console.log(`   Note: ${concepts.length - conceptsToWrite.length} DB-only concepts were classified but not written to seed file`)
  console.log()
  
  // Final summary
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Processed: ${processed} concepts`)
  console.log(`✅ Updated: ${updated} concepts`)
  if (errors > 0) {
    console.log(`⚠️  Errors: ${errors} concepts`)
  }
  console.log(`📋 Checkpoint saved: ${processedIds.size} total processed`)
  console.log()
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

