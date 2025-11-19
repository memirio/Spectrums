/**
 * Concept Enrichment
 * 
 * Generates synonyms and related terms for concepts using AI (OpenAI)
 * Falls back gracefully if API fails
 */

import { prisma } from './prisma'

interface Concept {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
}

/**
 * Generate synonyms and related terms using OpenAI
 */
export async function generateSynonymsAndRelatedWithAI(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = [],
  maxRetries: number = 2
): Promise<{ synonyms: string[], related: string[] }> {
  const OpenAI = (await import('openai')).default
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  
  const client = new OpenAI({ apiKey })
  
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
${existingConcepts.length > 100 ? `... and ${existingConcepts.length - 100} more` : ''}

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
        console.error(`[concept-enrichment] Failed to parse JSON for ${conceptLabel}, attempt ${attempt + 1}/${maxRetries}`)
        if (attempt === maxRetries - 1) {
          return { synonyms: [], related: [] }
        }
        continue
      }
      
      // Clean and filter: only single words, lowercase
      const cleanSynonyms = Array.isArray(parsed.synonyms) 
        ? parsed.synonyms
            .filter((s: any) => typeof s === 'string')
            .map((s: string) => s.toLowerCase().trim())
            .filter((s: string) => s.length > 0 && !s.includes(' ') && !s.includes('-'))
            .slice(0, 6)
        : []
      
      const cleanRelated = Array.isArray(parsed.related)
        ? parsed.related
            .filter((r: any) => typeof r === 'string')
            .map((r: string) => r.toLowerCase().trim())
            .filter((r: string) => r.length > 0 && !r.includes(' ') && !r.includes('-'))
            .slice(0, 6)
        : []
      
      return {
        synonyms: cleanSynonyms,
        related: cleanRelated
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('quota')
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Exponential backoff for rate limits
        const delay = Math.pow(2, attempt) * 1000
        console.warn(`[concept-enrichment] Rate limit hit for "${conceptLabel}", retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      if (attempt === maxRetries - 1) {
        console.error(`[concept-enrichment] Failed to generate synonyms/related for "${conceptLabel}" after ${maxRetries} attempts: ${errorMessage}`)
        throw error
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
  
  return { synonyms: [], related: [] }
}

