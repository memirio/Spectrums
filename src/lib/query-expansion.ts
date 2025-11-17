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

// Load curated expansions from JSON file
const CURATED_EXPANSIONS = curatedExpansionsData as Record<string, string[]>

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
  
  return abstractPatterns.some(pattern => pattern.test(q))
}

/**
 * Get expansions from database (Groq-generated)
 */
async function getGroqExpansionsFromDb(term: string): Promise<string[]> {
  try {
    if (!prisma) {
      console.error(`[query-expansion] Prisma client is not available`)
      return []
    }
    const expansions = await prisma.queryExpansion.findMany({
      where: {
        term: term.toLowerCase().trim(),
        source: 'groq'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return expansions.map(e => e.expansion)
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
 */
async function insertGroqExpansions(term: string, expansions: string[], model: string = 'groq'): Promise<void> {
  const normalizedTerm = term.toLowerCase().trim()
  
  console.log(`[query-expansion] insertGroqExpansions: term="${normalizedTerm}", expansions=${expansions.length}`)
  
  try {
    // Insert each expansion (using upsert to handle duplicates)
    for (let i = 0; i < expansions.length; i++) {
      const expansion = expansions[i].trim()
      console.log(`[query-expansion] Inserting expansion ${i + 1}/${expansions.length}: "${expansion.substring(0, 50)}..."`)
      
      try {
        await prisma.queryExpansion.upsert({
          where: {
            term_expansion_source: {
              term: normalizedTerm,
              expansion: expansion,
              source: 'groq'
            }
          },
          update: {
            lastUsedAt: new Date()
          },
          create: {
            term: normalizedTerm,
            expansion: expansion,
            source: 'groq',
            model,
            createdAt: new Date(),
            lastUsedAt: new Date()
          }
        })
        console.log(`[query-expansion] Successfully inserted expansion ${i + 1}`)
      } catch (insertError: any) {
        console.error(`[query-expansion] Error inserting expansion ${i + 1}:`, insertError.message)
        console.error(`[query-expansion] Error details:`, insertError)
        // Continue with next expansion
      }
    }
    console.log(`[query-expansion] Completed inserting ${expansions.length} expansions`)
  } catch (error: any) {
    console.error(`[query-expansion] Fatal error inserting expansions for "${term}":`, error.message)
    console.error(`[query-expansion] Error stack:`, error.stack)
    // Don't throw - caching is best-effort
  }
}

/**
 * Update lastUsedAt for a term (for telemetry)
 */
async function updateLastUsedAt(term: string, source: 'curated' | 'groq'): Promise<void> {
  const normalizedTerm = term.toLowerCase().trim()
  
  try {
    if (source === 'groq') {
      // Update all Groq expansions for this term
      await prisma.queryExpansion.updateMany({
        where: {
          term: normalizedTerm,
          source: 'groq'
        },
        data: {
          lastUsedAt: new Date()
        }
      })
    }
    // Curated expansions don't need tracking (they're in JSON)
  } catch (error: any) {
    // Silently fail - telemetry is best-effort
  }
}

/**
 * Generate expansions using Groq API
 */
async function generateWithGroq(query: string): Promise<{ expansions: string[], model: string }> {
  try {
    console.log(`[query-expansion] generateWithGroq called for "${query}"`)
    const client = getGroqClient()
    
    const prompt = `Expand the abstract query "${query}" into 4-6 visual descriptions that CLIP can match against design images. Focus on general visual patterns, colors, and design elements - not overly specific scenarios.

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
 * 1. Check curated JSON first
 * 2. Check database for Groq expansions
 * 3. If not found, call Groq and cache in DB
 * 4. Merge curated + Groq expansions
 * 5. Update lastUsedAt for telemetry
 */
export async function expandAbstractQuery(query: string): Promise<string[]> {
  const normalized = query.trim().toLowerCase()
  
  console.log(`[query-expansion] Expanding "${query}" (normalized: "${normalized}")`)
  
  // 1. Get curated expansions
  const curated = CURATED_EXPANSIONS[normalized] || []
  console.log(`[query-expansion] Curated expansions: ${curated.length}`)
  
  // 2. Get Groq expansions from database
  let groqFromDb = await getGroqExpansionsFromDb(normalized)
  console.log(`[query-expansion] Groq from DB: ${groqFromDb.length}`)
  
  // 3. If no Groq expansions in DB, generate and cache them
  if (groqFromDb.length === 0) {
    console.log(`[query-expansion] No cached Groq expansions, generating...`)
    const { expansions: generated, model: usedModel } = await generateWithGroq(query)
    console.log(`[query-expansion] Generated ${generated.length} expansions from Groq`)
    if (generated.length > 0) {
      console.log(`[query-expansion] Caching ${generated.length} expansions in DB...`)
      await insertGroqExpansions(normalized, generated, usedModel)
      groqFromDb = generated
      console.log(`[query-expansion] Successfully cached expansions`)
    } else {
      console.log(`[query-expansion] No expansions generated, skipping cache`)
    }
  } else {
    // Update lastUsedAt for telemetry
    console.log(`[query-expansion] Using cached expansions, updating lastUsedAt...`)
    await updateLastUsedAt(normalized, 'groq')
  }
  
  // 4. Merge curated + Groq expansions
  const allExpansions = [...curated, ...groqFromDb]
  console.log(`[query-expansion] Total expansions: ${allExpansions.length} (${curated.length} curated + ${groqFromDb.length} Groq)`)
  
  // 5. Update lastUsedAt for curated (if used)
  if (curated.length > 0) {
    // Curated expansions don't need DB tracking, but we could log usage
  }
  
  // Fallback to original query if no expansions found
  const result = allExpansions.length > 0 ? allExpansions : [query]
  console.log(`[query-expansion] Returning ${result.length} expansions`)
  return result
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
 */
export async function getExpansionEmbeddings(query: string): Promise<number[][]> {
  console.log(`[query-expansion] getExpansionEmbeddings called for "${query}"`)
  const expansions = await expandAbstractQuery(query)
  console.log(`[query-expansion] Got ${expansions.length} expansions, embedding...`)
  
  // Embed all expansions
  const embeddings = await embedTextBatch(expansions)
  console.log(`[query-expansion] Generated ${embeddings.length} embeddings`)
  
  if (embeddings.length === 0) {
    throw new Error(`Failed to generate embeddings for query "${query}"`)
  }
  
  // L2-normalize each embedding individually
  const normalized = embeddings.map(emb => l2norm(emb))
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
