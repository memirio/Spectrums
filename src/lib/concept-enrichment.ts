/**
 * Concept Enrichment
 * 
 * Generates synonyms and related terms for concepts using:
 * 1. Open-source thesaurus (Moby Thesaurus) - fast, accurate, free
 * 2. AI (OpenAI) as fallback for design-specific terms not in thesaurus
 * Falls back gracefully if both fail
 */

import { prisma } from './prisma'

interface Concept {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
}

/**
 * Generate synonyms using open-source thesaurus first, then AI as fallback
 */
export async function generateSynonymsAndRelatedWithAI(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = [],
  maxRetries: number = 2
): Promise<{ synonyms: string[], related: string[] }> {
  // Try thesaurus first (fast, accurate, free) - but only for common English words
  const thesaurusSynonyms = await getSynonymsFromThesaurus(conceptLabel, existingConcepts)
  
  // If we got good synonyms from thesaurus (and it's not a design-specific term), use them
  // For design-specific terms, always use AI even if thesaurus found something
  const isDesignTerm = isDesignSpecificTerm(conceptLabel.toLowerCase())
  
  if (!isDesignTerm && thesaurusSynonyms.length >= 3) {
    console.log(`[concept-enrichment] Found ${thesaurusSynonyms.length} synonyms for "${conceptLabel}" from thesaurus`)
    
    // Generate related terms with AI (thesaurus doesn't have "related" concept)
    let related: string[] = []
    try {
      const aiRelated = await generateRelatedTermsWithAI(conceptLabel, category, existingConcepts)
      related = aiRelated
    } catch (error: any) {
      console.warn(`[concept-enrichment] Failed to generate related terms for "${conceptLabel}": ${error.message}`)
    }
    
    return {
      synonyms: thesaurusSynonyms,
      related: related
    }
  }
  
  // Use AI for design-specific terms or if thesaurus didn't find enough synonyms
  if (isDesignTerm) {
    console.log(`[concept-enrichment] "${conceptLabel}" is a design-specific term, using AI`)
  } else {
    console.log(`[concept-enrichment] Thesaurus found only ${thesaurusSynonyms.length} synonyms for "${conceptLabel}", using AI fallback`)
  }
  return await generateSynonymsAndRelatedWithAIOnly(conceptLabel, category, existingConcepts, maxRetries)
}

/**
 * Get synonyms from open-source thesaurus (Moby Thesaurus)
 * Only use for common English words, not design-specific terms
 */
async function getSynonymsFromThesaurus(
  conceptLabel: string,
  existingConcepts: Concept[]
): Promise<string[]> {
  try {
    const thesaurus = require('thesaurus')
    
    // Normalize the label (lowercase, remove special chars for lookup)
    const normalized = conceptLabel.toLowerCase().trim()
    
    // Skip thesaurus for design-specific terms (numbers, technical terms, compound words)
    // These need AI to understand design context
    if (isDesignSpecificTerm(normalized)) {
      return []
    }
    
    // Get synonyms from thesaurus
    const rawSynonyms = thesaurus.find(normalized) || []
    
    if (rawSynonyms.length === 0) {
      return []
    }
    
    // Clean and filter synonyms
    const cleaned = rawSynonyms
      .map((s: string) => s.toLowerCase().trim())
      .filter((s: string) => {
        // Only single words (no spaces, no hyphens)
        if (s.includes(' ') || s.includes('-')) {
          return false
        }
        // Not the same as the concept
        if (s === normalized) {
          return false
        }
        // Valid length
        if (s.length < 2 || s.length > 30) {
          return false
        }
        // Filter out obviously wrong synonyms for design terms
        if (isObviouslyWrongSynonym(normalized, s)) {
          return false
        }
        return true
      })
      .slice(0, 6) // Limit to 6
    
    // Validate against opposites
    const validated = await validateSynonyms(conceptLabel, cleaned, existingConcepts)
    
    return validated
  } catch (error: any) {
    console.warn(`[concept-enrichment] Thesaurus lookup failed for "${conceptLabel}": ${error.message}`)
    return []
  }
}

/**
 * Check if a term is design-specific and should use AI instead of thesaurus
 */
function isDesignSpecificTerm(term: string): boolean {
  // Numbers (2d, 3d, etc.)
  if (/^\d+d?$/.test(term)) {
    return true
  }
  
  // Technical/design compound terms
  const designTerms = [
    '3d-printed', '3d-printing', '2d', '3d', 'rendering',
    'printed', 'printing', 'modeling', 'sculpture', 'fabrication'
  ]
  if (designTerms.some((dt: string) => term.includes(dt))) {
    return true
  }
  
  // Hyphenated terms (usually design-specific)
  if (term.includes('-')) {
    return true
  }
  
  return false
}

/**
 * Filter out obviously wrong synonyms (e.g., "movie" for "3d")
 */
function isObviouslyWrongSynonym(concept: string, synonym: string): boolean {
  // Common wrong synonyms for design terms
  const wrongMappings: Record<string, string[]> = {
    '3d': ['movie', 'film', 'picture', 'pic', 'flick', 'appearance', 'cinema', 'motion'],
    '2d': ['second', '2nd', 'ordinal', 'secondary'],
    '3d-printed': ['movie', 'film', 'picture'],
    'printed': ['movie', 'film', 'picture'],
    'rendering': ['movie', 'film', 'picture']
  }
  
  const wrongSynonyms = wrongMappings[concept.toLowerCase()]
  if (wrongSynonyms && wrongSynonyms.includes(synonym.toLowerCase())) {
    return true
  }
  
  // Check if synonym is a common word that doesn't match design context
  const commonNonDesignWords = ['movie', 'film', 'picture', 'pic', 'flick', 'cinema', 'theater', 'show']
  if (commonNonDesignWords.includes(synonym.toLowerCase()) && !concept.toLowerCase().includes('movie') && !concept.toLowerCase().includes('film')) {
    return true
  }
  
  return false
}

/**
 * Generate related terms using AI (thesaurus doesn't have "related" concept)
 */
async function generateRelatedTermsWithAI(
  conceptLabel: string,
  category?: string,
  existingConcepts: Concept[] = []
): Promise<string[]> {
  const OpenAI = (await import('openai')).default
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    return []
  }
  
  const client = new OpenAI({ apiKey })
  const categoryContext = category ? ` in the category "${category}"` : ''
  
  const prompt = `Generate 3-6 related terms (NOT synonyms) for the design/visual aesthetics concept "${conceptLabel}"${categoryContext}.

**Related** terms: Concepts that are visually or aesthetically related but NOT synonyms
- Related visual styles, techniques, or aesthetics that complement "${conceptLabel}"
- These should be distinct from synonyms - they're related but don't mean the same thing
- SINGLE WORDS ONLY (no multi-word phrases, no hyphens)
- Lowercase preferred

Return JSON:
{
  "related": ["related1", "related2", ...]
}`

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in design concepts. Generate related terms (not synonyms) for design concepts. Always return valid JSON. Use only single words.'
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
    const parsed = JSON.parse(text)
    
    const cleanRelated = Array.isArray(parsed.related)
      ? parsed.related
          .filter((r: any) => typeof r === 'string')
          .map((r: string) => r.toLowerCase().trim())
          .filter((r: string) => r.length > 0 && !r.includes(' ') && !r.includes('-'))
          .slice(0, 6)
      : []
    
    return cleanRelated
  } catch (error: any) {
    console.warn(`[concept-enrichment] Failed to generate related terms: ${error.message}`)
    return []
  }
}

/**
 * Generate synonyms and related terms using OpenAI only (fallback for design-specific terms)
 */
async function generateSynonymsAndRelatedWithAIOnly(
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
  const existingIds = existingConcepts.slice(0, 100).map((c: any) => c.id).join(', ')
  
  const prompt = `Generate synonyms and related terms for the design/visual aesthetics concept "${conceptLabel}"${categoryContext}.

CRITICAL REQUIREMENTS FOR SYNONYMS:
1. **Synonyms** (3-6 terms): Words that mean THE SAME THING or are INTERCHANGEABLE with "${conceptLabel}"
   - Must be TRUE synonyms - words that could replace "${conceptLabel}" in a sentence without changing meaning
   - Examples: "happy" → ["joyful", "cheerful", "glad"] (all mean the same)
   - Examples: "minimal" → ["simple", "sparse", "bare"] (all mean minimal design)
   - DO NOT include words that are merely related, associated, or contextually similar
   - DO NOT include opposites or antonyms
   - DO NOT include words that are tangentially related but don't mean the same thing
   - Use common, searchable words
   - Focus on design/visual/aesthetic contexts
   - SINGLE WORDS ONLY (no multi-word phrases, no hyphens)
   - Lowercase preferred
   
2. **Related** (3-6 terms): Concepts that are visually or aesthetically related but NOT synonyms
   - Related visual styles, techniques, or aesthetics that complement "${conceptLabel}"
   - These should be distinct from synonyms - they're related but don't mean the same thing
   - SINGLE WORDS ONLY (no multi-word phrases, no hyphens)
   - Lowercase preferred

VALIDATION TEST FOR SYNONYMS:
Before including a word as a synonym, ask: "If I replace '${conceptLabel}' with this word in a design description, would it mean exactly the same thing?"
- If YES → it's a synonym
- If NO → it's NOT a synonym (put it in "related" or exclude it)

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
          content: 'You are an expert in design concepts and visual aesthetics. Generate TRUE synonyms (words that mean the same thing) and related terms for design concepts. Synonyms must be interchangeable - they must mean exactly the same thing. Do NOT include words that are merely related or associated. Always return valid JSON. Use only single words, no multi-word phrases or hyphens.'
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
      
      // Validate synonyms: filter out words that are clearly not synonyms
      // Check against known opposites to avoid contradictions
      const validatedSynonyms = await validateSynonyms(conceptLabel, cleanSynonyms, existingConcepts)
      
      return {
        synonyms: validatedSynonyms,
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

/**
 * Validate synonyms by checking they're not opposites and are semantically reasonable
 */
async function validateSynonyms(
  conceptLabel: string,
  synonyms: string[],
  existingConcepts: Concept[]
): Promise<string[]> {
  if (synonyms.length === 0) {
    return []
  }
  
  // Load concept-opposites mapping to check for contradictions
  let oppositesMap: Map<string, string[]> = new Map()
  let reverseOppositesMap: Map<string, string[]> = new Map() // opposite -> concepts that list it as opposite
  try {
    const { CONCEPT_OPPOSITES } = await import('./concept-opposites')
    // Build a map of concept ID -> opposites
    for (const [conceptId, opposites] of Object.entries(CONCEPT_OPPOSITES)) {
      const normalizedId = conceptId.toLowerCase()
      const normalizedOpposites = opposites.map((o: string) => o.toLowerCase())
      oppositesMap.set(normalizedId, normalizedOpposites)
      
      // Build reverse map: for each opposite, track which concepts list it
      for (const opp of normalizedOpposites) {
        if (!reverseOppositesMap.has(opp)) {
          reverseOppositesMap.set(opp, [])
        }
        reverseOppositesMap.get(opp)!.push(normalizedId)
      }
    }
  } catch (error) {
    // If concept-opposites.ts doesn't exist or fails to load, continue without validation
    console.warn('[concept-enrichment] Could not load concept-opposites for validation, skipping contradiction check')
  }
  
  // Normalize concept label to ID format for lookup
  const conceptId = conceptLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  
  // Get opposites for this concept
  const conceptOpposites = oppositesMap.get(conceptId) || []
  
  // Also check reverse: if this concept is listed as an opposite of the synonym
  const conceptsThatOpposeThis = reverseOppositesMap.get(conceptId) || []
  
  // Filter synonyms that are:
  // 1. Not in the opposites list (contradiction check)
  // 2. Not the same as the concept itself (including label variations)
  // 3. Not listed as opposites by other concepts
  const validated = synonyms.filter((syn: string) => {
    const synLower = syn.toLowerCase()
    const synId = synLower.replace(/[^a-z0-9]+/g, '-')
    const conceptLabelLower = conceptLabel.toLowerCase()
    const conceptLabelId = conceptLabelLower.replace(/[^a-z0-9]+/g, '-')
    
    // Skip if it's the same as the concept ID
    if (synId === conceptId) {
      console.warn(`[concept-enrichment] Filtered "${syn}" from synonyms of "${conceptLabel}" - it's the same as the concept ID`)
      return false
    }
    
    // Skip if it's the same as the concept label (exact match or normalized match)
    if (synLower === conceptLabelLower || synId === conceptLabelId) {
      console.warn(`[concept-enrichment] Filtered "${syn}" from synonyms of "${conceptLabel}" - it's the same as the concept label`)
      return false
    }
    
    // Skip if it's in the opposites list (contradiction)
    if (conceptOpposites.includes(synLower) || conceptOpposites.includes(synId)) {
      console.warn(`[concept-enrichment] Filtered "${syn}" from synonyms of "${conceptLabel}" - it's an opposite`)
      return false
    }
    
    // Skip if this concept is listed as an opposite of the synonym (bidirectional check)
    const synonymOpposites = oppositesMap.get(synId) || []
    if (synonymOpposites.includes(conceptId) || synonymOpposites.includes(conceptLabel.toLowerCase())) {
      console.warn(`[concept-enrichment] Filtered "${syn}" from synonyms of "${conceptLabel}" - "${conceptLabel}" is an opposite of "${syn}"`)
      return false
    }
    
    // Check if any existing concept with this synonym is an opposite
    for (const existingConcept of existingConcepts) {
      if (existingConcept.id.toLowerCase() === synId || existingConcept.label.toLowerCase() === synLower) {
        const existingOpposites = oppositesMap.get(existingConcept.id.toLowerCase()) || []
        if (existingOpposites.includes(conceptId) || existingOpposites.includes(conceptLabel.toLowerCase())) {
          console.warn(`[concept-enrichment] Filtered "${syn}" from synonyms of "${conceptLabel}" - "${syn}" is an opposite of "${conceptLabel}"`)
          return false
        }
      }
    }
    
    return true
  })
  
  return validated
}

