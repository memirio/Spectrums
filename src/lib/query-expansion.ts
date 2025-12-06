/**
 * Query expansion for abstract terms
 * 
 * Hybrid approach:
 * - Curated expansions: stored in query-expansions.json (versioned, reviewable)
 * - LLM expansions: cached in SQLite database (efficient, analyzable)
 * 
 * Expands abstract queries (love, fun, cozy, serious, etc.) into visual proxies
 * to help CLIP better understand the query intent.
 * 
 * API Configuration:
 * - Uses Groq API (OpenAI-compatible) for query expansion
 * - Uses GROQ_API_KEY environment variable
 * - Caches expansions in database with source='groq' for analytics
 */

import OpenAI from 'openai'
import { embedTextBatch, meanVec, l2norm } from './embeddings'
import { prisma } from './prisma'
import curatedExpansionsData from './query-expansions.json'

// Load curated expansions from JSON file (used for website and general queries)
const CURATED_EXPANSIONS = curatedExpansionsData as Record<string, string[]>

// Brand-specific curated expansions
// These are tailored for brand identity design contexts (logos, brand guidelines, visual identity systems, etc.)
const BRAND_CURATED_EXPANSIONS: Record<string, string[]> = {
  "love": [
    "warm romantic color palette in brand identity",
    "affectionate design with heart motifs in logos",
    "gentle pastel tones in brand guidelines",
    "romantic color scheme in visual identity",
    "soft emotional brand aesthetics"
  ],
  "fun": [
    "bright colorful brand identity with playful graphics",
    "vibrant brand guidelines with bold patterns",
    "cheerful colorful logos with energetic designs",
    "playful typography in brand identity",
    "joyful colorful brand system with rounded shapes"
  ],
  "cozy": [
    "warm brown and orange tones in brand identity",
    "comfortable earthy colors in logos and brand guidelines",
    "inviting warm color palette in visual identity",
    "soft warm brand aesthetics",
    "comfortable homey brand design"
  ],
  "serious": [
    "minimalist professional brand identity",
    "formal corporate logo design",
    "authoritative monochrome brand guidelines",
    "sober professional color scheme in visual identity",
    "structured clean brand system with minimal colors"
  ],
  "calm": [
    "peaceful muted colors in brand identity",
    "tranquil soft color palette in logos",
    "gentle serene tones in brand guidelines",
    "relaxing peaceful visual identity",
    "meditative zen brand aesthetic"
  ],
  "chaotic": [
    "busy cluttered brand identity design",
    "vibrant overwhelming logo graphics",
    "energetic disorganized brand guidelines layout",
    "intense busy visual identity composition",
    "overwhelming visual noise in brand system"
  ],
  "happy": [
    "bright cheerful colors in brand identity",
    "joyful vibrant logo design",
    "sunny optimistic brand guidelines",
    "positive uplifting color palette in visual identity",
    "cheerful bright brand system with playful elements"
  ],
  "sad": [
    "melancholic muted tones in brand identity",
    "gloomy desaturated brand colors",
    "dark somber logo design",
    "mournful quiet brand aesthetic",
    "emotional downtrodden color scheme in visual identity"
  ],
  "energetic": [
    "dynamic bold colors in brand identity",
    "vibrant powerful logo design",
    "fast-paced energetic brand guidelines",
    "intense active visual identity composition",
    "high-energy bold brand system"
  ],
  "peaceful": [
    "tranquil calm brand identity design",
    "gentle soft colors in logos",
    "quiet serene brand guidelines",
    "harmonious balanced visual identity layout",
    "meditative peaceful brand system"
  ],
  "minimal": [
    "clean simple brand identity design",
    "minimalist logo with ample white space",
    "simple geometric shapes in brand guidelines",
    "uncluttered visual identity layout",
    "sparse clean design in brand system"
  ],
  "luxury": [
    "premium elegant brand identity",
    "sophisticated high-end logo design",
    "refined luxurious brand guidelines",
    "exclusive premium visual identity materials",
    "elegant sophisticated brand system"
  ],
  "organic": [
    "natural earthy tones in brand identity",
    "organic green logo design",
    "sustainable eco-friendly brand guidelines aesthetics",
    "natural textures in visual identity",
    "earth-friendly brand system with natural colors"
  ],
  "modern": [
    "contemporary sleek brand identity",
    "cutting-edge modern logo design",
    "futuristic innovative brand guidelines",
    "current trendy visual identity aesthetics",
    "sleek contemporary brand system"
  ],
  "vintage": [
    "retro nostalgic brand identity",
    "classic vintage logo design",
    "antique-inspired brand guidelines",
    "old-fashioned visual identity aesthetics",
    "nostalgic retro brand system"
  ]
}

// Packaging-specific curated expansions
// These are tailored for packaging design contexts (product labels, boxes, containers, etc.)
const PACKAGING_CURATED_EXPANSIONS: Record<string, string[]> = {
  "love": [
    "soft pink and red color palette on product labels",
    "warm romantic colors on packaging boxes",
    "gentle pastel tones on product containers",
    "affectionate design with heart motifs on labels",
    "romantic color scheme on gift packaging"
  ],
  "fun": [
    "bright colorful product labels with playful graphics",
    "vibrant packaging boxes with bold patterns",
    "cheerful colorful containers with energetic designs",
    "playful typography on product labels",
    "joyful colorful packaging with rounded shapes"
  ],
  "cozy": [
    "warm brown and orange tones on product packaging",
    "comfortable earthy colors on boxes and labels",
    "inviting warm color palette on containers",
    "soft warm lighting effects on packaging design",
    "comfortable homey aesthetic on product labels"
  ],
  "serious": [
    "minimalist professional product labels",
    "formal corporate packaging design",
    "authoritative monochrome product containers",
    "sober professional color scheme on boxes",
    "structured clean packaging with minimal colors"
  ],
  "calm": [
    "peaceful muted colors on product labels",
    "tranquil soft color palette on packaging",
    "gentle serene tones on containers",
    "relaxing peaceful packaging design",
    "meditative zen aesthetic on product boxes"
  ],
  "chaotic": [
    "busy cluttered product label design",
    "vibrant overwhelming packaging graphics",
    "energetic disorganized container layout",
    "intense busy packaging composition",
    "overwhelming visual noise on product labels"
  ],
  "happy": [
    "bright cheerful colors on product packaging",
    "joyful vibrant product labels",
    "sunny optimistic packaging design",
    "positive uplifting color palette on boxes",
    "cheerful bright containers with playful elements"
  ],
  "sad": [
    "melancholic muted tones on product labels",
    "gloomy desaturated packaging colors",
    "dark somber product container design",
    "mournful quiet packaging aesthetic",
    "emotional downtrodden color scheme on boxes"
  ],
  "energetic": [
    "dynamic bold colors on product labels",
    "vibrant powerful packaging design",
    "fast-paced energetic container graphics",
    "intense active packaging composition",
    "high-energy bold product packaging"
  ],
  "peaceful": [
    "tranquil calm packaging design",
    "gentle soft colors on product labels",
    "quiet serene product containers",
    "harmonious balanced packaging layout",
    "meditative peaceful product boxes"
  ],
  "minimal": [
    "clean simple product label design",
    "minimalist packaging with ample white space",
    "simple geometric shapes on containers",
    "uncluttered product packaging layout",
    "sparse clean design on product boxes"
  ],
  "luxury": [
    "premium elegant product packaging",
    "sophisticated high-end container design",
    "refined luxurious product labels",
    "exclusive premium packaging materials",
    "elegant sophisticated product boxes"
  ],
  "organic": [
    "natural earthy tones on product labels",
    "organic green packaging design",
    "sustainable eco-friendly container aesthetics",
    "natural textures on product packaging",
    "earth-friendly packaging with natural colors"
  ],
  "modern": [
    "contemporary sleek product packaging",
    "cutting-edge modern container design",
    "futuristic innovative product labels",
    "current trendy packaging aesthetics",
    "sleek contemporary product boxes"
  ],
  "vintage": [
    "retro nostalgic product packaging",
    "classic vintage container design",
    "antique-inspired product labels",
    "old-fashioned packaging aesthetics",
    "nostalgic retro product boxes"
  ]
}

// Initialize Groq client for query expansion (OpenAI-compatible)
let groqClient: OpenAI | null = null

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required for query expansion')
    }
    groqClient = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    })
  }
  return groqClient
}

/**
 * Detect if a query is abstract (emotional, mood-based, etc.)
 */
export function isAbstractQuery(query: string): boolean {
  const q = query.trim().toLowerCase()
  
  // Check against curated terms
  if (CURATED_EXPANSIONS[q]) {
    return true
  }
  
  // Common abstract patterns
  const abstractPatterns = [
    /^(love|hate|joy|sad|happy|angry|calm|chaotic|peaceful|energetic|cozy|serious|fun|playful|melancholic|euphoric|anxious|relaxed|tense|excited|bored)$/i,
    /^(warm|cold|bright|dark|soft|harsh|gentle|intense|mellow|vibrant|muted|bold|subtle)$/i,
    /^(romantic|intimate|distant|close|open|closed|free|restricted)$/i
  ]
  
  return abstractPatterns.some((pattern: RegExp) => pattern.test(q))
}

/**
 * Get expansions from database (Groq-generated)
 * @param term Query term to expand
 * @param category Optional category filter ('website', 'packaging', etc.)
 */
async function getGroqExpansionsFromDb(term: string, category?: string | null): Promise<string[]> {
  try {
    if (!prisma) {
      console.error(`[query-expansion] Prisma client is not available`)
      return []
    }
    const normalizedTerm = term.toLowerCase().trim()
    // Normalize category: null or 'website' means global (stored as 'global')
    const normalizedCategory = category && category !== 'website' ? category : 'global'
    
    // Use raw query to avoid Prisma type issues with category field
    try {
      if (!prisma || typeof (prisma as any).$queryRawUnsafe !== 'function') {
        console.warn(`[query-expansion] Prisma $queryRawUnsafe not available`)
        return []
      }
      
      // Use direct comparison (terms are stored in lowercase) to use the index
      // The index is on (term, source, category), so this query will be fast
      const expansions = await (prisma.$queryRawUnsafe as any)(
        `SELECT "expansion" FROM "query_expansions" WHERE "term" = $1 AND "source" = $2 AND "category" = $3 ORDER BY "createdAt" DESC`,
        normalizedTerm,
        'groq',
        normalizedCategory
      )
      
      if (!Array.isArray(expansions)) {
        console.warn(`[query-expansion] Unexpected result type from query:`, typeof expansions)
        return []
      }
      
      return expansions.map((e: any) => {
        if (typeof e === 'string') return e
        if (e && typeof e === 'object' && 'expansion' in e) return e.expansion
        return String(e || '')
      }).filter(Boolean)
    } catch (rawError: any) {
      // Fallback: return empty array if query fails
      console.warn(`[query-expansion] Error fetching from DB (raw query):`, rawError.message)
      if (rawError.stack) {
        console.warn(`[query-expansion] Error stack:`, rawError.stack)
      }
      return []
    }
  } catch (error: any) {
    console.error(`[query-expansion] Error fetching from DB for "${term}":`, error.message)
    if (error.stack) {
      console.error(`[query-expansion] Error stack:`, error.stack)
    }
    return []
  }
}

/**
 * Insert Groq-generated expansions into database
 * @param term Query term to expand
 * @param expansions Array of expansion strings
 * @param category Optional category ('website', 'packaging', etc.) - null for global/website
 * @param model Model identifier (default: 'groq')
 */
async function insertGroqExpansions(term: string, expansions: string[], category?: string | null, model: string = 'groq'): Promise<void> {
  const normalizedTerm = term.toLowerCase().trim()
  // Normalize category: null or 'website' means global/website (stored as 'global')
  const normalizedCategory = category && category !== 'website' ? category : 'global'
  
  console.log(`[query-expansion] insertGroqExpansions: term="${normalizedTerm}", category="${normalizedCategory || 'global'}", expansions=${expansions.length}`)
  
  // Caching is best-effort - don't block if it fails
  try {
    if (!prisma) {
      console.warn(`[query-expansion] Prisma client not available, skipping cache`)
      return
    }
    
    // Check if expansions already exist for this term-category pair
    // Only insert if none exist (to prevent duplicates)
    const existing = await getGroqExpansionsFromDb(normalizedTerm, category)
    if (existing.length > 0) {
      console.log(`[query-expansion] Expansions already exist for "${normalizedTerm}" (category: "${normalizedCategory}"), skipping insert`)
      return
    }
    
    // Insert new expansions (only if none exist)
    for (let i = 0; i < expansions.length; i++) {
      const expansion = expansions[i].trim()
      if (!expansion) continue // Skip empty expansions
      
      try {
        // Use raw SQL to insert (avoids Prisma type issues with category field)
        // PostgreSQL uses $1, $2, etc. for parameters
        // Use INSERT ... ON CONFLICT DO NOTHING to prevent duplicates
        const now = new Date().toISOString()
        await (prisma.$executeRawUnsafe as any)(
          `INSERT INTO "query_expansions" ("term", "expansion", "source", "category", "model", "createdAt", "lastUsedAt") 
           VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7::timestamp)
           ON CONFLICT ("term", "expansion", "source", "category") DO NOTHING`,
          normalizedTerm,
          expansion,
          'groq',
          normalizedCategory,
          model || 'groq',
          now,
          now
        )
      } catch (insertError: any) {
        // Log but don't throw - caching is best-effort
        // P2002 is unique constraint - that's fine, expansion already exists
        if (insertError.code !== 'P2002' && !insertError.message?.includes('UNIQUE constraint') && !insertError.message?.includes('duplicate')) {
          console.warn(`[query-expansion] Error inserting expansion "${expansion.substring(0, 30)}...":`, insertError.message)
        }
      }
    }
    console.log(`[query-expansion] Completed caching ${expansions.length} expansions for category "${normalizedCategory || 'global'}"`)
  } catch (error: any) {
    // Fatal error - log but don't throw (caching is best-effort)
    console.warn(`[query-expansion] Error caching expansions for "${term}" (category: "${normalizedCategory || 'global'}"):`, error.message)
    // Don't throw - we want search to continue even if caching fails
  }
}

/**
 * Update lastUsedAt for a term (for telemetry)
 * @param term Query term
 * @param source 'curated' | 'groq'
 * @param category Optional category - null for global/website
 */
async function updateLastUsedAt(term: string, source: 'curated' | 'groq', category?: string | null): Promise<void> {
  const normalizedTerm = term.toLowerCase().trim()
  // Normalize category: null or 'website' means global/website (stored as 'global')
  const normalizedCategory = category && category !== 'website' ? category : 'global'
  
  try {
    if (source === 'groq') {
      // Update Groq expansions for this term and category using raw SQL
      try {
        await (prisma.$executeRawUnsafe as any)(
          `UPDATE "query_expansions" SET "lastUsedAt" = $1::timestamp WHERE "term" = $2 AND "source" = $3 AND "category" = $4`,
          new Date().toISOString(),
          normalizedTerm,
          'groq',
          normalizedCategory
        )
      } catch (updateError: any) {
        // Silently fail - telemetry is best-effort
        console.warn(`[query-expansion] Error updating lastUsedAt:`, updateError.message)
      }
    }
    // Curated expansions don't need tracking (they're in JSON)
  } catch (error: any) {
    // Silently fail - telemetry is best-effort
  }
}

/**
 * Generate expansions using Groq API
 * @param query Query term to expand
 * @param category Optional category for category-specific expansions
 */
async function generateWithGroq(query: string, category?: string | null): Promise<{ expansions: string[], model: string }> {
  try {
    console.log(`[query-expansion] generateWithGroq called for "${query}"${category ? `, category: "${category}"` : ''}`)
    const client = getGroqClient()
    
    // Build category-specific context for the prompt
    const categoryContext = category 
      ? `\n\nCONTEXT: This expansion is for ${category} designs. Focus on visual patterns relevant to ${category} (e.g., ${category === 'packaging' ? 'product labels, boxes, containers' : category === 'brand' ? 'logos, brand identity, visual identity systems, brand guidelines' : category === 'website' ? 'web pages, interfaces, layouts' : 'designs in this category'}).`
      // Note: This is an optional optimization. For new categories not explicitly handled,
      // the system uses generic context ("designs in this category"), which works fine.
      : ''
    
    const prompt = `Expand the abstract query "${query}" into 4-6 visual descriptions that CLIP can match against design images. Focus on general visual patterns, colors, and design elements - not overly specific scenarios.${categoryContext}

CRITICAL: Write descriptions that are:
- Concrete enough for CLIP to understand (specific colors, shapes, patterns)
- General enough to match many designs (not tied to one specific scenario)
- Focused on visual patterns (what you see, not abstract concepts)

Good examples:
- "bright yellow and orange gradient background" (concrete colors, general pattern)
- "rounded shapes with soft shadows" (concrete elements, general pattern)
- "large bold text on colorful background" (concrete typography, general composition)
- "overlapping circles in bright colors" (concrete pattern, general application)
- "dimly lit scene with high contrast" (concrete lighting, general scene)

Bad examples (too specific):
- "website header with colorful illustrations of confetti, balloons, and streamers on a light blue background" (too specific scenario)
- "landing page with animated graphics of fireworks, glitter, and sparkles" (too specific scenario)
- "portrait of a person wearing a red dress in a studio with specific lighting setup" (too specific scenario)

Bad examples (too abstract):
- "vibrant explosive color palette" (too abstract, what does it look like?)
- "dynamic swirling patterns" (too abstract, what patterns?)

Examples:
- "love" → ["soft pink and red gradient background", "rounded shapes with warm colors", "gentle glowing effects and pastel colors", "warm-toned color palette"]
- "fun" → ["bright saturated colors with playful rounded shapes", "vibrant colorful buttons and icons", "bold colorful text on bright backgrounds", "multiple bright colors in playful compositions"]
- "cozy" → ["warm brown and orange color scheme", "soft rounded corners with warm lighting", "comfortable spacing with earthy tones", "warm ambient colors with soft shadows"]
- "serious" → ["black and white color scheme", "sharp edges with high contrast", "geometric shapes in monochrome", "structured grid layout with minimal colors"]
- "dark" → ["black background with white elements", "dark color palette with high contrast", "dimly lit scene with shadows", "low-light composition with bright accents"]

Return ONLY a JSON array of strings. Each string should describe a general visual pattern that CLIP can match across different designs.

Format: ["description1", "description2", "description3", "description4"]`
    
    console.log(`[query-expansion] Calling Groq API...`)
    
    // Try models in order of preference (user needs to enable at least one in Groq console)
    const modelsToTry = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'meta-llama/llama-4-maverick-17b-128e-instruct',
      'meta-llama/llama-4-scout-17b-16e-instruct',
      'qwen/qwen3-32b'
    ]
    
    let completion
    let lastError
    let usedModel = ''
    for (const model of modelsToTry) {
      try {
        completion = await client.chat.completions.create({
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        } as any)
        usedModel = model
        console.log(`[query-expansion] Using model: ${model}`)
        break
      } catch (error: any) {
        lastError = error
        if (!error.message.includes('blocked') && !error.message.includes('decommissioned')) {
          // If it's not a blocking issue, throw immediately
          throw error
        }
        // Otherwise, try next model
        continue
      }
    }
    
    if (!completion) {
      throw new Error(`All models are blocked. Please enable at least one model in your Groq console: https://console.groq.com/settings/project/limits. Last error: ${lastError?.message}`)
    }
    
    const text = completion.choices[0]?.message?.content || ''
    console.log(`[query-expansion] Groq response (first 200 chars): ${text.substring(0, 200)}`)
    
    // Parse JSON from response
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    console.log(`[query-expansion] Parsing JSON...`)
    const parsed = JSON.parse(jsonText)
    
    // Handle both { "expansions": [...] } and direct array formats
    let expansions: string[]
    if (Array.isArray(parsed)) {
      expansions = parsed
    } else if (parsed.expansions && Array.isArray(parsed.expansions)) {
      expansions = parsed.expansions
    } else if (parsed.array && Array.isArray(parsed.array)) {
      expansions = parsed.array
    } else {
      throw new Error(`Expected array of expansions, got: ${typeof parsed}`)
    }
    
    console.log(`[query-expansion] Parsed expansions:`, expansions)
    
    // Normalize: trim, filter empty, ensure strings
    const normalized = expansions
      .map((item: any) => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 6) // Limit to 6 expansions max
    
    console.log(`[query-expansion] Normalized expansions (${normalized.length}):`, normalized)
    return {
      expansions: normalized.length > 0 ? normalized : [],
      model: usedModel || 'unknown'
    }
  } catch (error: any) {
    console.error(`[query-expansion] Error generating with Groq for "${query}":`, error.message)
    console.error(`[query-expansion] Error stack:`, error.stack)
    if (error.cause) {
      console.error(`[query-expansion] Error cause:`, error.cause)
    }
    return { expansions: [], model: 'error' }
  }
}

/**
 * Get expansions for a query term (hybrid: curated + database + Groq)
 * 
 * Flow:
 * 1. Check curated JSON first (category-aware if available)
 * 2. Check database for Groq expansions
 * 3. If not found, call Groq and cache in DB
 * 4. Merge curated + Groq expansions
 * 5. Update lastUsedAt for telemetry
 * 
 * @param query Query term to expand
 * @param category Optional category ('website', 'packaging', etc.) for category-specific expansions
 */
export async function expandAbstractQuery(query: string, category?: string | null): Promise<string[]> {
  try {
    if (!query || typeof query !== 'string') {
      console.warn(`[query-expansion] Invalid query:`, query)
      return [query || '']
    }
    
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return [query]
    }
    
    console.log(`[query-expansion] Expanding "${query}" (normalized: "${normalized}")${category ? `, category: "${category}"` : ''}`)
    
    // 1. Get curated expansions (category-specific for packaging/brand, global for website/others)
    let curated: string[] = []
    try {
      if (category === 'packaging') {
        // Use packaging-specific curated expansions
        curated = PACKAGING_CURATED_EXPANSIONS[normalized] || []
        console.log(`[query-expansion] Packaging-specific curated expansions: ${curated.length}`)
      } else if (category === 'brand') {
        // Use brand-specific curated expansions
        curated = BRAND_CURATED_EXPANSIONS[normalized] || []
        console.log(`[query-expansion] Brand-specific curated expansions: ${curated.length}`)
      } else {
        // Use global curated expansions (for website and other categories)
        curated = CURATED_EXPANSIONS[normalized] || []
        console.log(`[query-expansion] Global curated expansions: ${curated.length}`)
      }
    } catch (curatedError: any) {
      console.warn(`[query-expansion] Error getting curated expansions:`, curatedError.message)
      curated = []
    }
    
    // 2. Get Groq expansions from database
    let groqFromDb: string[] = []
    try {
      groqFromDb = await getGroqExpansionsFromDb(normalized, category)
      console.log(`[query-expansion] Groq from DB: ${groqFromDb.length}`)
    } catch (dbError: any) {
      console.warn(`[query-expansion] Error fetching from DB:`, dbError.message)
      groqFromDb = []
    }
    
    // 3. Only generate new expansions if none exist in DB
    // IMPORTANT: Always use existing cached expansions if available - don't generate new ones
    if (groqFromDb.length === 0) {
      console.log(`[query-expansion] No cached Groq expansions found, generating new ones...`)
      try {
        const { expansions: generated, model: usedModel } = await generateWithGroq(query, category)
        console.log(`[query-expansion] Generated ${generated.length} expansions from Groq`)
        if (generated.length > 0) {
          groqFromDb = generated // Use generated expansions immediately
          // Cache asynchronously (don't block on cache errors)
          // Pass category to cache function so expansions are stored with category
          insertGroqExpansions(normalized, generated, category, usedModel).catch((cacheError) => {
            console.warn(`[query-expansion] Cache failed (non-blocking):`, cacheError.message)
          })
        } else {
          console.log(`[query-expansion] No expansions generated, skipping cache`)
        }
      } catch (genError: any) {
        console.warn(`[query-expansion] Error generating expansions:`, genError.message)
        // Continue with empty groqFromDb - will fall back to curated or original query
        groqFromDb = []
      }
    } else {
      // Use existing cached expansions - don't generate new ones
      console.log(`[query-expansion] Using ${groqFromDb.length} existing cached expansions (skipping generation)`)
      // Update lastUsedAt for telemetry (non-blocking)
      // Pass category so we update the correct cached expansions
      updateLastUsedAt(normalized, 'groq', category).catch((err) => {
        // Silently fail - telemetry is best-effort
      })
    }
    
    // 4. Merge curated + Groq expansions
    const allExpansions = [...curated, ...groqFromDb]
    console.log(`[query-expansion] Total expansions: ${allExpansions.length} (${curated.length} curated + ${groqFromDb.length} Groq)`)
    
    // Fallback to original query if no expansions found
    const result = allExpansions.length > 0 ? allExpansions : [query]
    console.log(`[query-expansion] Returning ${result.length} expansions`)
    return result
  } catch (error: any) {
    console.error(`[query-expansion] Fatal error in expandAbstractQuery:`, error)
    console.error(`[query-expansion] Error stack:`, error?.stack)
    // Always return at least the original query
    return [query || '']
  }
}

/**
 * Pool scores using max (hard max)
 * Returns the maximum score from all expansion scores
 */
export function poolMax(scores: number[]): number {
  if (scores.length === 0) return 0
  return Math.max(...scores)
}

/**
 * Pool scores using softmax (logsumexp)
 * Returns a smoothed version of max pooling using temperature
 * @param scores Array of cosine similarity scores
 * @param temperature Temperature parameter (lower = sharper, higher = smoother). Default 0.05
 */
export function poolSoftmax(scores: number[], temperature: number = 0.05): number {
  if (scores.length === 0) return 0
  if (scores.length === 1) return scores[0]
  
  // logsumexp: log(sum(exp(s / tau))) * tau
  // This is numerically stable and gives a smooth approximation of max
  const tau = temperature
  const sum = scores.reduce((acc, s) => acc + Math.exp(s / tau), 0)
  return Math.log(sum) * tau
}

/**
 * Get expansion embeddings (not averaged - for max/softmax pooling)
 * Returns array of L2-normalized embedding vectors, one per expansion
 * @param query Query term to expand
 * @param category Optional category for category-specific expansions
 */
export async function getExpansionEmbeddings(query: string, category?: string | null): Promise<number[][]> {
  console.log(`[query-expansion] getExpansionEmbeddings called for "${query}"${category ? `, category: "${category}"` : ''}`)
  const expansions = await expandAbstractQuery(query, category)
  console.log(`[query-expansion] Got ${expansions.length} expansions, embedding...`)
  
  // Embed all expansions
  const embeddings = await embedTextBatch(expansions)
  console.log(`[query-expansion] Generated ${embeddings.length} embeddings`)
  
  if (embeddings.length === 0) {
    throw new Error(`Failed to generate embeddings for query "${query}"`)
  }
  
  // L2-normalize each embedding individually
  const normalized = embeddings.map((emb: number[]) => l2norm(emb))
  console.log(`[query-expansion] Returning ${normalized.length} normalized embedding vectors`)
  
  return normalized
}

/**
 * Expand query and create averaged embedding (legacy - for backward compatibility)
 * Returns the averaged, L2-normalized embedding vector
 * @deprecated Use getExpansionEmbeddings with max/softmax pooling instead
 */
export async function expandAndEmbedQuery(query: string): Promise<number[]> {
  console.log(`[query-expansion] expandAndEmbedQuery called for "${query}" (using mean pooling - consider using max/softmax)`)
  const embeddings = await getExpansionEmbeddings(query)
  
  // Average the embeddings (legacy behavior)
  const avg = meanVec(embeddings)
  
  // L2-normalize
  const normalized = l2norm(avg)
  console.log(`[query-expansion] Returning averaged normalized embedding vector (dim: ${normalized.length})`)
  
  return normalized
}
