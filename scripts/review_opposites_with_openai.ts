import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
}

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
 * Review and improve opposites for concepts using OpenAI
 * 
 * Requirements:
 * 1. Check that opposites are 90% binary (if A is opposite of B, then B should be opposite of A)
 * 2. Generate new opposites that fit this criteria
 * 3. Return new opposites for implementation
 */
async function reviewAndImproveOpposites(
  concepts: Concept[],
  batchSize: number = 10,
  onBatchComplete?: (results: Map<string, { current: string[], improved: string[], issues: string[] }>) => void
): Promise<Map<string, { current: string[], improved: string[], issues: string[] }>> {
  const client = getGroqClient()
  const results = new Map<string, { current: string[], improved: string[], issues: string[] }>()
  
  // Build concept lookup maps
  const conceptById = new Map<string, Concept>()
  const conceptByLabel = new Map<string, Concept>()
  for (const concept of concepts) {
    conceptById.set(concept.id, concept)
    conceptByLabel.set(concept.label.toLowerCase(), concept)
  }
  
  // Process in batches
  for (let i = 0; i < concepts.length; i += batchSize) {
    const batch = concepts.slice(i, i + batchSize)
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(concepts.length / batchSize)} (${i + 1}-${Math.min(i + batchSize, concepts.length)} of ${concepts.length})`)
    
    for (const concept of batch) {
      try {
        const currentOpposites = concept.opposites || []
        
        // Build context: check binary relationships
        const binaryIssues: string[] = []
        for (const oppId of currentOpposites) {
          const oppConcept = conceptById.get(oppId) || conceptByLabel.get(oppId.toLowerCase())
          if (oppConcept) {
            const oppOpposites = oppConcept.opposites || []
            if (!oppOpposites.includes(concept.id) && !oppOpposites.some(o => 
              conceptById.get(o)?.label.toLowerCase() === concept.label.toLowerCase() ||
              conceptByLabel.get(o.toLowerCase())?.id === concept.id
            )) {
              binaryIssues.push(`${concept.label} → ${oppConcept.label} (but ${oppConcept.label} doesn't list ${concept.label} as opposite)`)
            }
          }
        }
        
        // Build a sample of common concept IDs for reference (first 200)
        const sampleConcepts = concepts.slice(0, 200).map(c => `"${c.id}"`).join(', ')
        
        // Prepare prompt for Groq/OpenAI
        const prompt = `Review and improve concept opposites for a design/visual aesthetics system.

CONCEPT TO REVIEW:
- ID: "${concept.id}"
- Label: "${concept.label}"
- Category: "${concept.category || 'N/A'}"
- Current Opposites: ${currentOpposites.length > 0 ? JSON.stringify(currentOpposites) : 'none'}

BINARY RELATIONSHIP CHECK:
${binaryIssues.length > 0 ? `⚠️ Issues found:\n${binaryIssues.map(issue => `  - ${issue}`).join('\n')}` : '✅ All current opposites are binary (mutual)'}

CRITICAL REQUIREMENTS (90% Binary Rule):
1. **90% Binary Rule**: If concept A lists B as opposite, then B MUST list A as opposite (90% certainty)
   - Example: If "dark" lists "light" as opposite, then "light" MUST list "dark" as opposite
   - This must be true 90% of the time (mutually exclusive, contradictory)
2. Opposites must be TRUE conceptual opposites (mutually exclusive, contradictory)
3. Focus on design/visual/aesthetic contexts
4. Use existing concept IDs when possible (see sample below)
5. Generate 3-6 high-quality opposites that are 90% certain to be binary

SAMPLE EXISTING CONCEPT IDs (use these when they match):
${sampleConcepts}
... and ${concepts.length - 200} more concepts in the database

INSTRUCTIONS:
1. Review the current opposites and identify any that violate the 90% binary rule
2. For each current opposite, verify: "Would this concept naturally list '${concept.label}' as its opposite?" (90% certainty)
3. Generate improved opposites that:
   - Are 90% certain to be binary (mutual)
   - Are true conceptual opposites of "${concept.label}"
   - Use existing concept IDs when possible (match by meaning, not exact spelling)
   - Are relevant to design/visual aesthetics
4. For EACH improved opposite, verify: "If X is opposite of '${concept.label}', then '${concept.label}' is opposite of X" (90% certainty test)

Return a JSON object with this structure:
{
  "issues": ["list of specific issues found with current opposites"],
  "improvedOpposites": ["array of concept IDs (preferred) or labels that are 90% binary opposites"],
  "reasoning": "brief explanation of why these opposites are 90% binary and mutually exclusive"
}`

        const completion = await client.chat.completions.create({
          model: 'llama-3.3-70b-versatile', // Groq model
          messages: [
            {
              role: 'system',
              content: 'You are an expert in design concepts and visual aesthetics. You review and improve concept opposites to ensure they are 90% binary (mutual). Always return valid JSON.'
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
          // Try to extract JSON from markdown code blocks if present
          let jsonText = text
          const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/(\{[\s\S]*\})/)
          if (jsonMatch) {
            jsonText = jsonMatch[1] || jsonMatch[0]
          }
          parsed = JSON.parse(jsonText)
        } catch (e) {
          console.error(`❌ Failed to parse JSON for ${concept.label}:`, text.substring(0, 300))
          console.error(`   Error:`, (e as Error).message)
          results.set(concept.id, {
            current: currentOpposites,
            improved: currentOpposites, // Keep current if parsing fails
            issues: [...binaryIssues, `Failed to parse Groq response: ${(e as Error).message}`]
          })
          continue
        }
        
        const improvedOpposites = Array.isArray(parsed.improvedOpposites) 
          ? parsed.improvedOpposites 
          : (parsed.improved || [])
        const issues = [
          ...binaryIssues,
          ...(Array.isArray(parsed.issues) ? parsed.issues : [])
        ]
        
        // Validate improved opposites are strings
        const validImprovedOpposites = improvedOpposites
          .filter((opp: any) => typeof opp === 'string')
          .map((opp: string) => opp.trim())
          .filter((opp: string) => opp.length > 0)
        
        results.set(concept.id, {
          current: currentOpposites,
          improved: validImprovedOpposites,
          issues
        })
        
        console.log(`  ✅ ${concept.label}: ${currentOpposites.length} → ${improvedOpposites.length} opposites`)
        
        // Rate limiting: wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error: any) {
        console.error(`❌ Error processing ${concept.label}:`, error.message)
        results.set(concept.id, {
          current: concept.opposites || [],
          improved: concept.opposites || [],
          issues: [`Error: ${error.message}`]
        })
      }
    }
    
    // Save incrementally after each batch
    if (onBatchComplete) {
      onBatchComplete(results)
    }
  }
  
  return results
}

async function main() {
  const limit = process.argv.includes('--limit') 
    ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) || 10
    : undefined
  
  console.log('═'.repeat(70))
  console.log('🔍 Reviewing Concept Opposites with Groq (OpenAI-compatible)')
  console.log('═'.repeat(70))
  console.log()
  
  // Load concepts
  const conceptsPath = path.join(process.cwd(), 'src/concepts/seed_concepts.json')
  const conceptsData = JSON.parse(fs.readFileSync(conceptsPath, 'utf-8')) as Concept[]
  
  console.log(`📚 Loaded ${conceptsData.length} concepts`)
  console.log()
  
  // Filter concepts that have opposites
  const conceptsWithOpposites = conceptsData.filter(c => c.opposites && c.opposites.length > 0)
  
  console.log(`📊 Total concepts: ${conceptsData.length}`)
  console.log(`📊 Concepts with opposites: ${conceptsWithOpposites.length}`)
  console.log()
  
  // Review concepts that have opposites (focus on fixing existing ones)
  let conceptsToReview = conceptsWithOpposites.length > 0 
    ? conceptsWithOpposites 
    : conceptsData.slice(0, 50) // Sample if none have opposites
  
  // Apply limit if specified
  if (limit && limit > 0) {
    conceptsToReview = conceptsToReview.slice(0, limit)
    console.log(`⚠️  Limited to first ${limit} concepts (use without --limit to process all)`)
    console.log()
  }
  
  console.log(`🔍 Will review ${conceptsToReview.length} concepts...`)
  console.log()
  
  // Generate output path
  const outputPath = path.join(process.cwd(), 'scripts/generated_opposites/reviewed_opposites.json')
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // Load existing results if file exists (for incremental saving)
  let existingOutput: Record<string, {
    current: string[]
    improved: string[]
    issues: string[]
  }> = {}
  if (fs.existsSync(outputPath)) {
    try {
      existingOutput = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
      console.log(`📂 Loaded ${Object.keys(existingOutput).length} existing results`)
    } catch (e) {
      console.log(`⚠️  Could not load existing results, starting fresh`)
    }
  }
  
  // Review opposites with incremental saving
  const results = await reviewAndImproveOpposites(conceptsToReview, 5, (batchResults) => {
    // Save incrementally after each batch
    const output: Record<string, {
      current: string[]
      improved: string[]
      issues: string[]
    }> = { ...existingOutput }
    
    for (const [conceptId, data] of batchResults.entries()) {
      output[conceptId] = data
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
    existingOutput = output // Update for next batch
  })
  
  // Final save (in case callback wasn't called for last batch)
  const output: Record<string, {
    current: string[]
    improved: string[]
    issues: string[]
  }> = { ...existingOutput }
  
  for (const [conceptId, data] of results.entries()) {
    output[conceptId] = data
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  
  // Print summary
  console.log()
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  
  let totalIssues = 0
  let totalImproved = 0
  let totalUnchanged = 0
  
  for (const [conceptId, data] of results.entries()) {
    if (data.issues.length > 0) totalIssues++
    if (data.improved.length !== data.current.length || 
        !data.improved.every((opp, i) => data.current[i] === opp)) {
      totalImproved++
    } else {
      totalUnchanged++
    }
  }
  
  console.log(`✅ Concepts reviewed: ${results.size}`)
  console.log(`⚠️  Concepts with issues: ${totalIssues}`)
  console.log(`🔄 Concepts with improved opposites: ${totalImproved}`)
  console.log(`✓ Concepts unchanged: ${totalUnchanged}`)
  console.log()
  console.log(`📄 Results saved to: ${outputPath}`)
  console.log()
  console.log('═'.repeat(70))
}

main().catch(console.error)

