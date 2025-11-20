/**
 * Fix the 27 concepts that failed during the OpenAI synonyms/related generation
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
        model: 'gpt-4o-mini',
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
        const waitSeconds = Math.pow(2, attempt) * 5
        console.log(`  ⏳ Rate limit hit, waiting ${waitSeconds.toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
        continue
      }
      
      if (errorMessage.includes('quota') || errorMessage.includes('billing') || attempt === maxRetries - 1) {
        console.error(`  ⚠️  Error: ${errorMessage}`)
        return { synonyms: [], related: [] }
      }
    }
  }
  
  return { synonyms: [], related: [] }
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🔧 Fixing Missing Synonyms/Related Terms')
  console.log('═'.repeat(70))
  console.log()
  
  // Load seed concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  console.log(`📚 Loaded ${conceptsData.length} concepts`)
  console.log()
  
  // Find concepts missing synonyms or related
  const conceptsNeedingFix: Concept[] = []
  for (const concept of conceptsData) {
    const hasSynonyms = concept.synonyms && concept.synonyms.length > 0
    const hasRelated = concept.related && concept.related.length > 0
    
    if (!hasSynonyms || !hasRelated) {
      conceptsNeedingFix.push(concept)
    }
  }
  
  console.log(`📊 Found ${conceptsNeedingFix.length} concepts missing synonyms or related`)
  console.log()
  
  if (conceptsNeedingFix.length === 0) {
    console.log('✅ All concepts have synonyms and related terms!')
    return
  }
  
  // Create backup
  const backupPath = conceptsPath + '.backup.' + Date.now()
  console.log(`💾 Creating backup: ${backupPath}`)
  fs.copyFileSync(conceptsPath, backupPath)
  console.log()
  
  // Fix each concept
  let updated = 0
  let failed = 0
  
  for (let i = 0; i < conceptsNeedingFix.length; i++) {
    const concept = conceptsNeedingFix[i]
    const hasSynonyms = concept.synonyms && concept.synonyms.length > 0
    const hasRelated = concept.related && concept.related.length > 0
    
    console.log(`📝 Processing ${i + 1}/${conceptsNeedingFix.length}: "${concept.label}"`)
    console.log(`   Current: ${hasSynonyms ? `${concept.synonyms!.length} synonyms` : 'no synonyms'}, ${hasRelated ? `${concept.related!.length} related` : 'no related'}`)
    
    try {
      const result = await generateSynonymsAndRelated(concept.label, concept.category, conceptsData)
      
      if (!hasSynonyms && result.synonyms.length > 0) {
        concept.synonyms = result.synonyms
        console.log(`   ✅ Added ${result.synonyms.length} synonyms`)
      }
      
      if (!hasRelated && result.related.length > 0) {
        concept.related = result.related
        console.log(`   ✅ Added ${result.related.length} related terms`)
      }
      
      if (result.synonyms.length > 0 || result.related.length > 0) {
        updated++
      } else {
        failed++
        console.log(`   ⚠️  No synonyms/related generated`)
      }
      
      // Save after each concept (small batch, so save frequently)
      fs.writeFileSync(conceptsPath, JSON.stringify(conceptsData, null, 2))
      
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failed++
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log()
  }
  
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

