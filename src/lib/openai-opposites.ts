/**
 * OpenAI-based opposite concept generation
 * 
 * Generates NEW opposite concepts for existing concepts using OpenAI.
 * Focuses on simple, single-word opposites that people actually search for.
 */

import 'dotenv/config'
import OpenAI from 'openai'

type Concept = {
  id: string
  label: string
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
 * Generate NEW opposite concept labels for a given concept
 * Returns an array of NEW concept labels (not existing ones)
 */
export async function generateOppositeConceptsForNewTag(
  concept: Concept,
  existingConceptLabels: Set<string>,
  existingConceptIds: Set<string>,
  maxRetries: number = 3
): Promise<string[]> {
  const client = getOpenAIClient()
  
  const categoryContext = concept.category ? ` in the category "${concept.category}"` : ''
  
  const prompt = `Generate 2-4 NEW conceptually opposite concept labels for "${concept.label}"${categoryContext}.

CRITICAL REQUIREMENTS - STRICTLY ENFORCED:
1. **90% Binary Rule**: If concept A lists B as opposite, then B MUST list A as opposite (90% certainty)
   - Example: If "dark" lists "light" as opposite, then "light" MUST list "dark" as opposite
   - This must be true 90% of the time (mutually exclusive, contradictory)
2. **Verification Test**: For EACH opposite you generate, verify: "Would this opposite concept naturally list '${concept.label}' as its opposite?" (90% certainty)
   - Only include opposites that pass this test
3. SINGLE WORDS ONLY - NO EXCEPTIONS. Every opposite must be a single word.
4. NO compound phrases, NO hyphenated words, NO multi-word terms
5. Use simple, common words that people actually search for (e.g., "stupid", "dumb", "chaotic", "messy", "dull", "bland")
6. Generate BRAND NEW concept labels that don't exist yet
7. Focus on true conceptual opposites - what contradicts "${concept.label}"?
8. Make them specific to design/visual/aesthetic contexts
9. Prefer common, searchable words over obscure terms

Examples of GOOD opposite concept generation (simple, single words, 90% binary):
- "Academia" → ["ignorant", "uneducated", "unlearned"] (ignorant/uneducated would list "academia" as opposite)
- "Minimal" → ["cluttered", "busy", "messy", "chaotic"] (cluttered/busy would list "minimal" as opposite)
- "Static" → ["dynamic", "animated", "moving", "active"] (dynamic/animated would list "static" as opposite)
- "Luxury" → ["basic", "simple", "modest"] (basic/simple would list "luxury" as opposite)
- "Geometric" → ["organic", "fluid", "curved", "natural"] (organic/fluid would list "geometric" as opposite)
- "Clean" → ["messy", "chaotic", "disordered"] (messy/chaotic would list "clean" as opposite)
- "Professional" → ["casual", "informal", "relaxed", "playful"] (casual/informal would list "professional" as opposite)
- "Modern" → ["old", "vintage", "retro", "traditional"] (old/vintage would list "modern" as opposite)
- "Warm" → ["cold", "cool", "icy", "frozen"] (cold/cool would list "warm" as opposite)
- "Bright" → ["dark", "dim", "dull", "shadowy"] (dark/dim would list "bright" as opposite)

Examples of BAD (STRICTLY FORBIDDEN):
- "Spontaneous Expression" ❌ (compound phrase - REJECT)
- "Street Culture" ❌ (compound phrase - REJECT)
- "Anti-Intellectual" ❌ (hyphenated - REJECT)
- "Motion-Driven" ❌ (compound phrase - REJECT)
- "High-End" ❌ (hyphenated - REJECT)
- "Well-Designed" ❌ (hyphenated - REJECT)

VALIDATION RULES:
- If you generate a multi-word phrase, split it and use only the most meaningful single word
- If you generate a hyphenated word, use only the first part
- If you're unsure, choose the simpler, more common word
- Verify each opposite passes the 90% binary test before including it

Return a JSON object with an "opposites" array containing ONLY single-word strings.
Format: {"opposites": ["word1", "word2", "word3"]}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative assistant that generates new concept labels for design and visual aesthetics. You MUST only generate single-word concepts. Never generate compound phrases, hyphenated words, or multi-word terms. Always return valid JSON.'
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
      
      // Parse JSON response
      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch {
        // Try to extract JSON array from text
        const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
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
      
      // Filter and normalize: ensure single words only
      const newOpposites = opposites
        .map((opp: string) => {
          // Extract first word if multiple words
          const trimmed = String(opp).trim()
          const words = trimmed.split(/\s+/)
          if (words.length > 1) {
            // Use first meaningful word (skip articles)
            const skipWords = ['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for']
            for (const word of words) {
              if (!skipWords.includes(word.toLowerCase()) && word.length > 0) {
                return word
              }
            }
            return words[0] // Fallback to first word
          }
          // Remove hyphens - use first part
          if (trimmed.includes('-')) {
            return trimmed.split('-')[0]
          }
          return trimmed
        })
        .filter((opp: string) => {
          const normalized = opp.toLowerCase().trim()
          // Must be single word (no spaces, no hyphens after processing)
          if (normalized.includes(' ') || normalized.includes('-')) {
            return false
          }
          // Check if it already exists
          return !existingConceptLabels.has(normalized) && 
                 !existingConceptIds.has(normalized.replace(/[^a-z0-9]+/g, '-')) &&
                 normalized.length > 0
        })
        .slice(0, 4) // Limit to 4
      
      if (newOpposites.length > 0) {
        return newOpposites
      }
      
      // If we got opposites but they were all filtered out, try again
      if (attempt < maxRetries - 1) {
        continue
      }
      
      return []
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('exceeded your current quota')
      const isRateLimit = error.status === 429 && !isQuotaError
      const isServiceUnavailable = error.status === 503 || errorMessage.includes('503') || errorMessage.includes('overloaded')
      
      if (isQuotaError) {
        console.error(`[openai-opposites] ❌ Quota/billing error for "${concept.label}": ${errorMessage}`)
        return []
      }
      
      if (isRateLimit || isServiceUnavailable) {
        if (attempt < maxRetries - 1) {
          const baseDelay = Math.pow(2, attempt) * 2000
          const delay = Math.min(baseDelay, 30000) // Max 30 seconds
          
          console.log(`[openai-opposites] ⏳ Rate limit hit, waiting ${(delay / 1000).toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      if (attempt === maxRetries - 1) {
        console.error(`[openai-opposites] Error generating opposite concepts for "${concept.label}" after ${maxRetries} attempts: ${errorMessage}`)
        return []
      }
    }
  }
  
  return []
}

/**
 * Generate opposites for a concept that has synonyms but no opposites
 * This is used to backfill opposites for existing concepts
 * Returns an array of opposite concept labels (can be existing or new)
 */
export async function generateOppositesForConceptWithSynonyms(
  concept: Concept,
  existingConceptLabels: Set<string>,
  existingConceptIds: Set<string>,
  allowExistingConcepts: boolean = true,
  maxRetries: number = 3
): Promise<string[]> {
  const client = getOpenAIClient()
  
  const categoryContext = concept.category ? ` in the category "${concept.category}"` : ''
  const synonymsContext = concept.synonyms && concept.synonyms.length > 0 
    ? `\n\nThis concept has the following synonyms: ${concept.synonyms.slice(0, 5).join(', ')}${concept.synonyms.length > 5 ? '...' : ''}`
    : ''
  
  const prompt = `Generate 4-8 conceptually opposite concept labels for "${concept.label}"${categoryContext}.${synonymsContext}

CRITICAL REQUIREMENTS - STRICTLY ENFORCED:
1. **90% Binary Rule**: If concept A lists B as opposite, then B MUST list A as opposite (90% certainty)
   - Example: If "dark" lists "light" as opposite, then "light" MUST list "dark" as opposite
   - This must be true 90% of the time (mutually exclusive, contradictory)
2. **Verification Test**: For EACH opposite you generate, verify: "Would this opposite concept naturally list '${concept.label}' as its opposite?" (90% certainty)
   - Only include opposites that pass this test
3. SINGLE WORDS ONLY - NO EXCEPTIONS. Every opposite must be a single word.
4. NO compound phrases, NO hyphenated words, NO multi-word terms
5. Use simple, common words that people actually search for (e.g., "stupid", "dumb", "chaotic", "messy", "dull", "bland")
6. Focus on true conceptual opposites - what contradicts "${concept.label}"?
7. Make them specific to design/visual/aesthetic contexts
8. Prefer common, searchable words over obscure terms
${allowExistingConcepts ? '9. You can suggest existing concepts OR new concepts - both are acceptable' : '9. Generate BRAND NEW concept labels that don\'t exist yet'}

Examples of GOOD opposite concept generation (simple, single words, 90% binary):
- "Academia" → ["ignorant", "uneducated", "unlearned"] (ignorant/uneducated would list "academia" as opposite)
- "Minimal" → ["cluttered", "busy", "messy", "chaotic"] (cluttered/busy would list "minimal" as opposite)
- "Static" → ["dynamic", "animated", "moving", "active"] (dynamic/animated would list "static" as opposite)
- "Luxury" → ["basic", "simple", "modest"] (basic/simple would list "luxury" as opposite)
- "Geometric" → ["organic", "fluid", "curved", "natural"] (organic/fluid would list "geometric" as opposite)
- "Clean" → ["messy", "chaotic", "disordered"] (messy/chaotic would list "clean" as opposite)
- "Professional" → ["casual", "informal", "relaxed", "playful"] (casual/informal would list "professional" as opposite)
- "Modern" → ["old", "vintage", "retro", "traditional"] (old/vintage would list "modern" as opposite)
- "Warm" → ["cold", "cool", "icy", "frozen"] (cold/cool would list "warm" as opposite)
- "Bright" → ["dark", "dim", "dull", "shadowy"] (dark/dim would list "bright" as opposite)
- "Abstraction" → ["concrete", "literal", "realistic", "tangible"] (concrete/literal would list "abstraction" as opposite)
- "Abundance" → ["scarcity", "lack", "deficiency", "poverty"] (scarcity/lack would list "abundance" as opposite)
- "Accent" → ["plain", "neutral", "bland", "unadorned"] (plain/neutral would list "accent" as opposite)

Examples of BAD (STRICTLY FORBIDDEN):
- "Spontaneous Expression" ❌ (compound phrase - REJECT)
- "Street Culture" ❌ (compound phrase - REJECT)
- "Anti-Intellectual" ❌ (hyphenated - REJECT)
- "Motion-Driven" ❌ (compound phrase - REJECT)

VALIDATION RULES:
- If you generate a multi-word phrase, split it and use only the most meaningful single word
- If you generate a hyphenated word, use only the first part
- If you're unsure, choose the simpler, more common word
- Verify each opposite passes the 90% binary test before including it

Return a JSON object with an "opposites" array containing ONLY single-word strings.
Format: {"opposites": ["word1", "word2", "word3"]}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative assistant that generates opposite concept labels for design and visual aesthetics. You MUST only generate single-word concepts. Never generate compound phrases, hyphenated words, or multi-word terms. Always return valid JSON.'
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
      
      // Parse JSON response
      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch {
        // Try to extract JSON array from text
        const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
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
      
      // Filter and normalize: ensure single words only
      const processedOpposites = opposites
        .map((opp: string) => {
          // Extract first word if multiple words
          const trimmed = String(opp).trim()
          const words = trimmed.split(/\s+/)
          if (words.length > 1) {
            // Use first meaningful word (skip articles)
            const skipWords = ['the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for']
            for (const word of words) {
              if (!skipWords.includes(word.toLowerCase()) && word.length > 0) {
                return word
              }
            }
            return words[0] // Fallback to first word
          }
          // Remove hyphens - use first part
          if (trimmed.includes('-')) {
            return trimmed.split('-')[0]
          }
          return trimmed
        })
        .filter((opp: string) => {
          const normalized = opp.toLowerCase().trim()
          // Must be single word (no spaces, no hyphens after processing)
          if (normalized.includes(' ') || normalized.includes('-')) {
            return false
          }
          // Check if it already exists (if allowExistingConcepts is false, filter them out)
          if (!allowExistingConcepts) {
            return !existingConceptLabels.has(normalized) && 
                   !existingConceptIds.has(normalized.replace(/[^a-z0-9]+/g, '-')) &&
                   normalized.length > 0
          }
          // If allowExistingConcepts is true, just check it's not empty
          return normalized.length > 0
        })
        .slice(0, 8) // Limit to 8
      
      if (processedOpposites.length > 0) {
        return processedOpposites
      }
      
      // If we got opposites but they were all filtered out, try again
      if (attempt < maxRetries - 1) {
        continue
      }
      
      return []
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('billing') || errorMessage.includes('exceeded your current quota')
      const isRateLimit = error.status === 429 && !isQuotaError
      const isServiceUnavailable = error.status === 503 || errorMessage.includes('503') || errorMessage.includes('overloaded')
      
      if (isQuotaError) {
        console.error(`[openai-opposites] ❌ Quota/billing error for "${concept.label}": ${errorMessage}`)
        return []
      }
      
      if (isRateLimit || isServiceUnavailable) {
        if (attempt < maxRetries - 1) {
          const baseDelay = Math.pow(2, attempt) * 2000
          const delay = Math.min(baseDelay, 30000) // Max 30 seconds
          
          console.log(`[openai-opposites] ⏳ Rate limit hit, waiting ${(delay / 1000).toFixed(1)}s before retry ${attempt + 2}/${maxRetries}...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      if (attempt === maxRetries - 1) {
        console.error(`[openai-opposites] Error generating opposites for "${concept.label}" after ${maxRetries} attempts: ${errorMessage}`)
        return []
      }
    }
  }
  
  return []
}

