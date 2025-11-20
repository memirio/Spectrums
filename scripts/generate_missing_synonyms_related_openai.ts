/**
 * ONE-OFF SCRIPT: Generate missing synonyms and related terms using OpenAI
 * 
 * This is a temporary script to complete the synonyms/related generation
 * that was interrupted due to Groq rate limits. This is NOT part of the
 * regular pipeline - it's a one-time fix.
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

/**
 * Generate synonyms and related terms for a concept using OpenAI
 */
async function generateSynonymsAndRelated(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = [],
  maxRetries: number = 3
): Promise<{ synonyms: string[], related: string[] }> {
  const client = getOpenAIClient()
  
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
        model: 'gpt-4o-mini', // Using OpenAI's cheaper model
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
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('Rate limit')
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Exponential backoff for rate limits
        const waitSeconds = Math.pow(2, attempt) * 5 // 5s, 10s, 20s
        
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

async function main() {
  console.log('═'.repeat(70))
  console.log('🔄 ONE-OFF: Generating Missing Synonyms/Related with OpenAI')
  console.log('⚠️  This is a temporary script, NOT part of the regular pipeline')
  console.log('═'.repeat(70))
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts from seed_concepts.json`)
  console.log()
  
  // Find concepts missing synonyms or related
  // Also check if we should resume from a checkpoint
  const checkpointFile = path.join(process.cwd(), 'scripts/generated_opposites/synonyms_checkpoint.json')
  let processedIds = new Set<string>()
  if (fs.existsSync(checkpointFile)) {
    try {
      const checkpoint = JSON.parse(fs.readFileSync(checkpointFile, 'utf-8'))
      processedIds = new Set(checkpoint.processedIds || [])
      console.log(`📂 Resuming from checkpoint: ${processedIds.size} concepts already processed`)
    } catch (e) {
      console.log(`⚠️  Could not load checkpoint, starting fresh`)
    }
  }
  
  const conceptsNeedingUpdate: Concept[] = []
  for (const concept of conceptsData) {
    // Skip if already processed
    if (processedIds.has(concept.id)) {
      continue
    }
    
    const hasSynonyms = concept.synonyms && concept.synonyms.length > 0
    const hasRelated = concept.related && concept.related.length > 0
    
    if (!hasSynonyms || !hasRelated) {
      conceptsNeedingUpdate.push(concept)
    }
  }
  
  console.log(`📊 Found ${conceptsNeedingUpdate.length} concepts missing synonyms or related terms`)
  console.log()
  
  if (conceptsNeedingUpdate.length === 0) {
    console.log('✅ All concepts already have synonyms and related terms!')
    // Clean up checkpoint if done
    if (fs.existsSync(checkpointFile)) {
      fs.unlinkSync(checkpointFile)
      console.log('✅ Checkpoint removed')
    }
    return
  }
  
  // Create backup
  const backupPath = conceptsPath + '.backup.' + Date.now()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  console.log()
  
  // Generate synonyms and related for concepts that need them
  let updated = 0
  let skipped = 0
  
  for (let i = 0; i < conceptsNeedingUpdate.length; i++) {
    const concept = conceptsNeedingUpdate[i]
    const hasSynonyms = concept.synonyms && concept.synonyms.length > 0
    const hasRelated = concept.related && concept.related.length > 0
    
    console.log(`📝 Processing ${i + 1}/${conceptsNeedingUpdate.length}: "${concept.label}"`)
    console.log(`   Current: ${hasSynonyms ? `${concept.synonyms!.length} synonyms` : 'no synonyms'}, ${hasRelated ? `${concept.related!.length} related` : 'no related'}`)
    
    // Only generate what's missing
    if (!hasSynonyms || !hasRelated) {
      try {
        const result = await generateSynonymsAndRelated(concept.label, concept.category, conceptsData)
        
        // Update concept
        if (!hasSynonyms && result.synonyms.length > 0) {
          concept.synonyms = result.synonyms
          console.log(`   ✅ Added ${result.synonyms.length} synonyms`)
        }
        
        if (!hasRelated && result.related.length > 0) {
          concept.related = result.related
          console.log(`   ✅ Added ${result.related.length} related terms`)
        }
        
        updated++
        processedIds.add(concept.id)
        
        // Save incrementally every 10 concepts
        if (updated % 10 === 0) {
          fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
          // Save checkpoint
          fs.writeFileSync(checkpointFile, JSON.stringify({ processedIds: Array.from(processedIds) }, null, 2))
          console.log(`   💾 Saved progress (${updated} updated so far, checkpoint saved)`)
        }
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`)
        skipped++
      }
      
      // Rate limiting: wait between requests (OpenAI is more lenient, but still be careful)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
    } else {
      skipped++
      processedIds.add(concept.id) // Mark as processed even if skipped
      console.log(`   ⏭️  Already has synonyms and related, skipping`)
    }
    
    console.log()
  }
  
  // Final save
  console.log('💾 Saving final results...')
  fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
  
  // Save final checkpoint
  fs.writeFileSync(checkpointFile, JSON.stringify({ processedIds: Array.from(processedIds) }, null, 2))
  
  // If all done, remove checkpoint
  if (conceptsNeedingUpdate.length === updated + skipped) {
    fs.unlinkSync(checkpointFile)
    console.log('✅ All concepts processed, checkpoint removed')
  }
  
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log(`✅ Concepts updated: ${updated}`)
  console.log(`⏭️  Concepts skipped: ${skipped}`)
  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📄 Updated file: ${conceptsPath}`)
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

