/**
 * Fill missing synonyms and related terms for concepts
 * 
 * This script identifies concepts missing synonyms or related terms
 * and generates them using OpenAI API.
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
   - SINGLE WORDS ONLY (no multi-word phrases, no hyphens)
   - Lowercase preferred
   
2. **Related** (3-6 terms): Concepts that are visually or aesthetically related but not synonyms
   - Related visual styles, techniques, or aesthetics
   - SINGLE WORDS ONLY (no multi-word phrases, no hyphens)
   - Lowercase preferred

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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in design concepts and visual aesthetics. Generate synonyms and related terms for design concepts. Always return valid JSON. Use only single words, no multi-word phrases or hyphens.'
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
      
      // Clean and filter: only single words, lowercase
      const cleanSynonyms = Array.isArray(parsed.synonyms) 
        ? parsed.synonyms
            .filter((s: any) => typeof s === 'string')
            .map((s: string) => s.toLowerCase().trim())
            .filter((s: string) => s.length > 0 && !s.includes(' ') && !s.includes('-'))
        : []
      
      const cleanRelated = Array.isArray(parsed.related)
        ? parsed.related
            .filter((r: any) => typeof r === 'string')
            .map((r: string) => r.toLowerCase().trim())
            .filter((r: string) => r.length > 0 && !r.includes(' ') && !r.includes('-'))
        : []
      
      return {
        synonyms: cleanSynonyms,
        related: cleanRelated
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 // Exponential backoff
        console.error(`  ⚠️  Error generating for ${conceptLabel} (attempt ${attempt + 1}/${maxRetries}): ${errorMessage}`)
        console.error(`  ⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        console.error(`  ❌ Failed to generate for ${conceptLabel} after ${maxRetries} attempts: ${errorMessage}`)
        return { synonyms: [], related: [] }
      }
    }
  }
  
  return { synonyms: [], related: [] }
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🔧 Fill Missing Synonyms and Related Terms')
  console.log('═'.repeat(70))
  console.log()
  
  // Load concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts`)
  console.log()
  
  // Create backup
  const backupPath = conceptsPath + '.backup.' + Date.now()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  console.log()
  
  // Find concepts missing synonyms or related
  const needsSynonyms = conceptsData.filter(c => !c.synonyms || c.synonyms.length === 0)
  const needsRelated = conceptsData.filter(c => !c.related || c.related.length === 0)
  const needsBoth = conceptsData.filter(c => 
    (!c.synonyms || c.synonyms.length === 0) || 
    (!c.related || c.related.length === 0)
  )
  
  console.log(`📊 Found:`)
  console.log(`   Missing synonyms: ${needsSynonyms.length}`)
  console.log(`   Missing related: ${needsRelated.length}`)
  console.log(`   Missing either: ${needsBoth.length}`)
  console.log()
  
  if (needsBoth.length === 0) {
    console.log('✅ All concepts have synonyms and related terms!')
    return
  }
  
  // Checkpoint file
  const checkpointPath = path.join(process.cwd(), 'scripts/generated_opposites/synonyms_related_checkpoint.json')
  let processed: Set<string> = new Set()
  let checkpoint: any = {}
  
  // Load checkpoint if exists
  if (fs.existsSync(checkpointPath)) {
    try {
      checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'))
      processed = new Set(checkpoint.processed || [])
      console.log(`📂 Resuming from checkpoint: ${processed.size} concepts already processed`)
      console.log()
    } catch (e) {
      console.log('📂 Starting fresh (no valid checkpoint found)')
      console.log()
    }
  }
  
  let updated = 0
  let failed = 0
  
  // Process concepts
  for (let i = 0; i < needsBoth.length; i++) {
    const concept = needsBoth[i]
    
    if (processed.has(concept.id)) {
      console.log(`⏭️  Skipping ${i + 1}/${needsBoth.length}: "${concept.label}" (already processed)`)
      continue
    }
    
    const needsSyn = !concept.synonyms || concept.synonyms.length === 0
    const needsRel = !concept.related || concept.related.length === 0
    
    console.log(`📝 Processing ${i + 1}/${needsBoth.length}: "${concept.label}"`)
    console.log(`   Missing: ${needsSyn ? 'synonyms' : ''} ${needsRel ? 'related' : ''}`)
    
    try {
      const result = await generateSynonymsAndRelated(
        concept.label,
        concept.category,
        conceptsData
      )
      
      // Update concept
      if (needsSyn && result.synonyms.length > 0) {
        concept.synonyms = result.synonyms
        console.log(`   ✅ Added ${result.synonyms.length} synonyms: ${result.synonyms.slice(0, 3).join(', ')}${result.synonyms.length > 3 ? '...' : ''}`)
      }
      
      if (needsRel && result.related.length > 0) {
        concept.related = result.related
        console.log(`   ✅ Added ${result.related.length} related: ${result.related.slice(0, 3).join(', ')}${result.related.length > 3 ? '...' : ''}`)
      }
      
      if ((needsSyn && result.synonyms.length === 0) || (needsRel && result.related.length === 0)) {
        console.log(`   ⚠️  Some fields still empty after generation`)
        failed++
      } else {
        updated++
      }
      
      // Mark as processed
      processed.add(concept.id)
      
      // Save checkpoint every 10 concepts
      if ((i + 1) % 10 === 0) {
        checkpoint.processed = Array.from(processed)
        fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2))
        console.log(`   💾 Checkpoint saved`)
      }
      
      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failed++
    }
    
    console.log()
  }
  
  // Save final checkpoint
  checkpoint.processed = Array.from(processed)
  fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2))
  
  // Save updated concepts
  console.log('💾 Saving updated concepts...')
  fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
  
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

