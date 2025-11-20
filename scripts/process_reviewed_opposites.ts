import * as fs from 'fs'
import * as path from 'path'
import OpenAI from 'openai'
import { syncOppositesFromSeed } from '../src/lib/update-concept-opposites'
import 'dotenv/config'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
}

type ReviewedOpposites = Record<string, {
  current: string[]
  improved: string[]
  issues: string[]
}>

function getGroqClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required')
  }
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1'
  })
}

/**
 * Generate synonyms and related terms for a new concept using Groq
 */
async function generateSynonymsAndRelated(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = [],
  maxRetries: number = 3
): Promise<{ synonyms: string[], related: string[] }> {
  const client = getGroqClient()
  
  const categoryContext = category ? ` in the category "${category}"` : ''
  const existingIds = existingConcepts.slice(0, 100).map(c => c.id).join(', ')
  
  const prompt = `Generate synonyms and related terms for the design/visual aesthetics concept "${conceptLabel}"${categoryContext}.

REQUIREMENTS:
1. **Synonyms** (3-6 terms): Words that mean the same or very similar to "${conceptLabel}"
   - Use common, searchable words
   - Focus on design/visual/aesthetic contexts
   - Single words preferred, but 2-word phrases acceptable if necessary
   
2. **Related** (3-6 terms): Concepts that are visually or aesthetically related but not synonyms
   - Related visual styles, techniques, or aesthetics
   - Single words preferred
   
EXISTING CONCEPT IDs (avoid duplicates):
${existingIds}
... and ${existingConcepts.length - 100} more

Return JSON:
{
  "synonyms": ["synonym1", "synonym2", ...],
  "related": ["related1", "related2", ...]
}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in design concepts and visual aesthetics. Generate synonyms and related terms for design concepts. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
      
      const text = completion.choices[0]?.message?.content?.trim() || ''
      let parsed: any
      try {
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/(\{[\s\S]*\})/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1] || jsonMatch[0])
        } else {
          parsed = JSON.parse(text)
        }
      } catch (e) {
        console.error(`  ⚠️  Failed to parse JSON for ${conceptLabel}, using defaults`)
        return { synonyms: [], related: [] }
      }
      
      return {
        synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms.filter((s: any) => typeof s === 'string') : [],
        related: Array.isArray(parsed.related) ? parsed.related.filter((r: any) => typeof r === 'string') : []
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('Rate limit') || errorMessage.includes('TPD')
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Extract wait time from error message if available
        const waitMatch = errorMessage.match(/try again in ([\d.]+)s/i)
        const waitSeconds = waitMatch ? parseFloat(waitMatch[1]) : Math.pow(2, attempt) * 5 // Exponential backoff: 5s, 10s, 20s
        
        console.log(`  ⏳ Rate limit hit for ${conceptLabel}, waiting ${waitSeconds.toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
        continue
      }
      
      // If it's a quota error or final attempt, return empty
      if (errorMessage.includes('quota') || errorMessage.includes('billing') || attempt === maxRetries - 1) {
        console.error(`  ⚠️  Error generating synonyms/related for ${conceptLabel}: ${errorMessage}`)
        return { synonyms: [], related: [] }
      }
    }
  }
  
  return { synonyms: [], related: [] }
}

/**
 * Convert a label to a concept ID (kebab-case, lowercase)
 */
function labelToId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Find existing concept by ID or label
 */
function findConcept(concepts: Concept[], idOrLabel: string): Concept | undefined {
  const normalized = idOrLabel.toLowerCase().trim()
  return concepts.find(c => 
    c.id.toLowerCase() === normalized ||
    c.label.toLowerCase() === normalized
  )
}

async function main() {
  const skipSynonyms = process.argv.includes('--skip-synonyms')
  
  console.log('═'.repeat(70))
  console.log('🔄 Processing Reviewed Opposites')
  if (skipSynonyms) {
    console.log('⚠️  Skipping synonym/related generation (use --skip-synonyms to enable)')
  }
  console.log('═'.repeat(70))
  console.log()
  
  // Load reviewed opposites
  const reviewedPath = path.join(process.cwd(), 'scripts/generated_opposites/reviewed_opposites.json')
  if (!fs.existsSync(reviewedPath)) {
    console.error(`❌ Reviewed opposites file not found: ${reviewedPath}`)
    console.error(`   Run review_opposites_with_openai.ts first`)
    process.exit(1)
  }
  
  const reviewedData = JSON.parse(fs.readFileSync(reviewedPath, 'utf-8')) as ReviewedOpposites
  console.log(`📚 Loaded reviewed opposites for ${Object.keys(reviewedData).length} concepts`)
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts from seed_concepts.json`)
  console.log()
  
  // Build lookup maps
  const conceptById = new Map<string, Concept>()
  const conceptByLabel = new Map<string, Concept>()
  for (const concept of conceptsData) {
    conceptById.set(concept.id, concept)
    conceptByLabel.set(concept.label.toLowerCase(), concept)
  }
  
  // Step 1: Collect all new opposites that don't exist as concepts
  const newOpposites = new Set<string>()
  for (const [conceptId, reviewed] of Object.entries(reviewedData)) {
    for (const opp of reviewed.improved) {
      const existing = findConcept(conceptsData, opp)
      if (!existing) {
        newOpposites.add(opp)
      }
    }
  }
  
  console.log(`📊 Found ${newOpposites.size} new opposites that need to be added as concepts`)
  console.log()
  
  // Step 2: Generate synonyms and related for new opposites
  const newConcepts: Concept[] = []
  let processed = 0
  
  for (const oppLabel of newOpposites) {
    processed++
    console.log(`📝 Processing ${processed}/${newOpposites.size}: "${oppLabel}"`)
    
    let synonyms: string[] = []
    let related: string[] = []
    
    if (!skipSynonyms) {
      const result = await generateSynonymsAndRelated(oppLabel, undefined, conceptsData)
      synonyms = result.synonyms
      related = result.related
    } else {
      console.log(`  ⏭️  Skipping synonym/related generation (use without --skip-synonyms to enable)`)
    }
    
    const newConcept: Concept = {
      id: labelToId(oppLabel),
      label: oppLabel,
      synonyms: synonyms.length > 0 ? synonyms : undefined,
      related: related.length > 0 ? related : undefined,
      opposites: [], // Will be set when we process the reverse relationship
      category: 'Aesthetic / Formal' // Default category, can be improved later
    }
    
    newConcepts.push(newConcept)
    console.log(`  ✅ Created concept "${newConcept.id}"${!skipSynonyms ? ` with ${synonyms.length} synonyms, ${related.length} related` : ' (synonyms/related skipped)'}`)
    
    // Rate limiting: wait longer to avoid rate limits (only if generating synonyms)
    if (!skipSynonyms) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  // Step 3: Update existing concepts with improved opposites
  console.log()
  console.log('🔄 Updating existing concepts with improved opposites...')
  let updated = 0
  
  for (const concept of conceptsData) {
    const reviewed = reviewedData[concept.id]
    if (!reviewed) continue
    
    const hasChanges = 
      (concept.opposites || []).length !== reviewed.improved.length ||
      !(concept.opposites || []).every((opp, i) => reviewed.improved[i] === opp) ||
      !reviewed.improved.every((opp, i) => (concept.opposites || [])[i] === opp)
    
    if (hasChanges) {
      // Map improved opposites to concept IDs
      const improvedIds = reviewed.improved.map(opp => {
        const existing = findConcept(conceptsData, opp)
        if (existing) return existing.id
        
        // Find in new concepts
        const newConcept = newConcepts.find(nc => 
          nc.id === labelToId(opp) || 
          nc.label.toLowerCase() === opp.toLowerCase()
        )
        if (newConcept) return newConcept.id
        
        // Use the label as ID (will be converted)
        return labelToId(opp)
      })
      
      concept.opposites = improvedIds
      updated++
    }
  }
  
  // Step 4: Set reverse opposites for new concepts
  console.log()
  console.log('🔄 Setting reverse opposites for new concepts...')
  
  for (const newConcept of newConcepts) {
    const reverseOpposites: string[] = []
    
    // Find all concepts that list this new concept as opposite
    for (const concept of conceptsData) {
      const reviewed = reviewedData[concept.id]
      if (reviewed && reviewed.improved.includes(newConcept.label)) {
        reverseOpposites.push(concept.id)
      }
    }
    
    // Also check new concepts
    for (const otherNewConcept of newConcepts) {
      if (otherNewConcept.id === newConcept.id) continue
      // This would require checking reviewed data for new concepts, but for now we'll set it later
    }
    
    if (reverseOpposites.length > 0) {
      newConcept.opposites = reverseOpposites
    }
  }
  
  // Step 5: Add new concepts to concepts array
  const allConcepts = [...conceptsData, ...newConcepts]
  
  // Step 6: Save updated seed_concepts.json
  const backupPath = conceptsPath + '.backup'
  console.log()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  
  console.log(`💾 Saving updated concepts to: ${conceptsPath}`)
  fs.writeFileSync(conceptsPath, JSON.stringify(allConcepts, null, 2))
  
  // Step 7: Save new concepts separately for review
  const newConceptsPath = path.join(process.cwd(), 'scripts/generated_opposites/new_concepts_from_opposites.json')
  fs.writeFileSync(newConceptsPath, JSON.stringify(newConcepts, null, 2))
  
  // Step 8: Sync opposites to concept-opposites.ts
  console.log()
  console.log('🔄 Syncing opposites to concept-opposites.ts...')
  try {
    await syncOppositesFromSeed()
    console.log('  ✅ Successfully synced opposites to concept-opposites.ts')
  } catch (error: any) {
    console.error(`  ⚠️  Error syncing opposites: ${error.message}`)
    console.error(`     You may need to run syncOppositesFromSeed() manually`)
  }
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Concepts updated: ${updated}`)
  console.log(`🆕 New concepts created: ${newConcepts.length}`)
  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📄 Updated file: ${conceptsPath}`)
  console.log(`📄 New concepts saved to: ${newConceptsPath}`)
  console.log(`🔄 Opposites synced to: src/lib/concept-opposites.ts`)
  console.log()
  console.log('⚠️  NEXT STEP: Re-tag all images with updated opposites')
  console.log('   Run: npx tsx scripts/sync_and_retag_all.ts')
  console.log('   (This will sync opposites and re-tag all images)')
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

