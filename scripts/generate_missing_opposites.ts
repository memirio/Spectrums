/**
 * Generate opposites for concepts that are missing them
 * Uses the updated tagging pipeline with 90% binary rule
 */

import * as fs from 'fs'
import * as path from 'path'
import OpenAI from 'openai'
import 'dotenv/config'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  return new OpenAI({ apiKey })
}

async function generateOpposites(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = [],
  maxRetries: number = 3
): Promise<string[]> {
  const client = getOpenAIClient()
  
  const categoryContext = category ? ` in the category "${category}"` : ''
  const existingIds = existingConcepts.slice(0, 100).map(c => c.id).join(', ')
  
  const prompt = `Generate 3-6 conceptually opposite concept labels for "${conceptLabel}"${categoryContext}.

CRITICAL REQUIREMENTS - STRICTLY ENFORCED:
1. **90% Binary Rule**: If concept A lists B as opposite, then B MUST list A as opposite (90% certainty)
   - Example: If "dark" lists "light" as opposite, then "light" MUST list "dark" as opposite
   - This must be true 90% of the time (mutually exclusive, contradictory)
2. **Verification Test**: For EACH opposite you generate, verify: "Would this opposite concept naturally list '${conceptLabel}' as its opposite?" (90% certainty)
   - Only include opposites that pass this test
3. SINGLE WORDS ONLY - NO EXCEPTIONS. Every opposite must be a single word.
4. NO compound phrases, NO hyphenated words, NO multi-word terms
5. Focus on true conceptual opposites - what contradicts "${conceptLabel}"?
6. Make them specific to design/visual/aesthetic contexts

EXISTING CONCEPT IDs (use these when they match):
${existingIds}
... and ${existingConcepts.length - 100} more

Return JSON:
{
  "opposites": ["opposite1", "opposite2", "opposite3"]
}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in design concepts and visual aesthetics. Generate opposite concept labels that are 90% binary (mutual). Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, logical results
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
        console.error(`  ⚠️  Failed to parse JSON for ${conceptLabel}`)
        return []
      }
      
      const opposites = Array.isArray(parsed.opposites) 
        ? parsed.opposites.filter((o: any) => typeof o === 'string' && o.trim().length > 0)
        : []
      
      return opposites
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('Rate limit')
      
      if (isRateLimit && attempt < maxRetries - 1) {
        const waitSeconds = Math.pow(2, attempt) * 5
        console.log(`  ⏳ Rate limit hit, waiting ${waitSeconds.toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
        continue
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('billing') || attempt === maxRetries - 1) {
        console.error(`  ⚠️  Error: ${errorMessage}`)
        return []
      }
    }
  }
  
  return []
}

function labelToId(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function findConcept(concepts: Concept[], idOrLabel: string): Concept | undefined {
  const normalized = idOrLabel.toLowerCase().trim()
  return concepts.find(c => 
    c.id.toLowerCase() === normalized ||
    c.label.toLowerCase() === normalized
  )
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🔄 Generating Missing Opposites')
  console.log('═'.repeat(70))
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts`)
  console.log()
  
  // Find concepts missing opposites
  const conceptsNeedingOpposites: Concept[] = []
  for (const concept of conceptsData) {
    const hasOpposites = concept.opposites && concept.opposites.length > 0
    if (!hasOpposites) {
      conceptsNeedingOpposites.push(concept)
    }
  }
  
  console.log(`📊 Found ${conceptsNeedingOpposites.length} concepts missing opposites`)
  console.log()
  
  if (conceptsNeedingOpposites.length === 0) {
    console.log('✅ All concepts have opposites!')
    return
  }
  
  // Create backup
  const backupPath = conceptsPath + '.backup.' + Date.now()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  console.log()
  
  // Build concept lookup
  const conceptById = new Map<string, Concept>()
  const conceptByLabel = new Map<string, Concept>()
  for (const concept of conceptsData) {
    conceptById.set(concept.id, concept)
    conceptByLabel.set(concept.label.toLowerCase(), concept)
  }
  
  // Generate opposites for each concept
  let updated = 0
  let failed = 0
  
  for (let i = 0; i < conceptsNeedingOpposites.length; i++) {
    const concept = conceptsNeedingOpposites[i]
    
    console.log(`📝 Processing ${i + 1}/${conceptsNeedingOpposites.length}: "${concept.label}"`)
    
    try {
      const oppositeLabels = await generateOpposites(concept.label, concept.category, conceptsData)
      
      if (oppositeLabels.length > 0) {
        // Convert opposite labels to concept IDs
        const oppositeIds: string[] = []
        for (const oppLabel of oppositeLabels) {
          // Try to find existing concept
          const existing = findConcept(conceptsData, oppLabel)
          if (existing) {
            oppositeIds.push(existing.id)
          } else {
            // Use normalized ID (concept might not exist yet)
            const oppId = labelToId(oppLabel)
            if (oppId !== concept.id && oppId.length > 0) {
              oppositeIds.push(oppId)
            }
          }
        }
        
        if (oppositeIds.length > 0) {
          concept.opposites = oppositeIds
          console.log(`   ✅ Added ${oppositeIds.length} opposites: ${oppositeLabels.slice(0, 3).join(', ')}${oppositeLabels.length > 3 ? '...' : ''}`)
          updated++
        } else {
          console.log(`   ⚠️  No valid opposites found`)
          failed++
        }
      } else {
        console.log(`   ⚠️  No opposites generated`)
        failed++
      }
      
      // Save every 10 concepts
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
        console.log(`   💾 Saved progress`)
      }
      
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failed++
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log()
  }
  
  // Final save
  fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
  
  // Sync opposites to concept-opposites.ts
  console.log('🔄 Syncing opposites to concept-opposites.ts...')
  try {
    const { syncOppositesFromSeed } = await import('../src/lib/update-concept-opposites')
    await syncOppositesFromSeed()
    console.log('  ✅ Successfully synced opposites')
  } catch (error: any) {
    console.error(`  ⚠️  Error syncing opposites: ${error.message}`)
  }
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Concepts updated: ${updated}`)
  console.log(`❌ Concepts failed: ${failed}`)
  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📄 Updated file: ${conceptsPath}`)
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

