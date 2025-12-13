import { NextRequest, NextResponse } from 'next/server'
import { getPerformanceLogger } from '@/lib/performance-logger'
import { embedTextBatch, meanVec, l2norm } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { isAbstractQuery, expandAbstractQuery, expandAndEmbedQuery, getExpansionEmbeddings, poolMax, poolSoftmax } from '@/lib/query-expansion'
import { logSearchImpressions, type SearchImpression } from '@/lib/interaction-logger'
import { getCachedSearchResults, cacheSearchResults } from '@/lib/search-cache'
import OpenAI from 'openai'

// Category-specific API keys for vibe extensions
function getGroqClientForCategory(category: string): OpenAI {
  let apiKey: string | undefined
  
  if (category === 'packaging') {
    apiKey = process.env.GROQ_API_KEY_PACKAGING
  } else if (category === 'brand' || category === 'branding') {
    apiKey = process.env.GROQ_API_KEY_BRAND
  } else {
    apiKey = process.env.GROQ_API_KEY
  }
  
  // Fallback to default key if category-specific key is not available
  if (!apiKey) {
    apiKey = process.env.GROQ_API_KEY
  }
  
  if (!apiKey) {
    throw new Error(`API key is required for category "${category}". Please set GROQ_API_KEY or category-specific keys (GROQ_API_KEY_PACKAGING, GROQ_API_KEY_BRAND) in your environment variables.`)
  }
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1'
  })
}

// Category descriptions for context
const CATEGORY_CONTEXTS: Record<string, string> = {
  'packaging': 'product packaging, labels, boxes, containers, and physical product design',
  'website': 'web pages, interfaces, layouts, and digital design',
  'brand': 'logos, brand identity, visual identity systems, and brand guidelines',
  'fonts': 'typography, font design, letterforms, and text styling',
  'apps': 'mobile apps, app interfaces, and application design',
  'graphic': 'graphic design, posters, print design, typography, illustrations, and graphic compositions',
  'logo': 'logo design, logo marks, wordmarks, letterforms, symbol design, brand symbols, and iconography',
  'all': 'general design across all categories'
}

// In-memory cache for vibe extensions (key: `${vibe.toLowerCase()}:${category}`)
// Also cache embeddings to ensure consistent rankings
const globalForVibeExtensions = globalThis as unknown as {
  vibeExtensionsCache: Map<string, string[]>
  vibeEmbeddingsCache: Map<string, number[]> // Cache embeddings: key is `${vibe.toLowerCase()}:${category}`
}

if (!globalForVibeExtensions.vibeExtensionsCache) {
  globalForVibeExtensions.vibeExtensionsCache = new Map()
}
if (!globalForVibeExtensions.vibeEmbeddingsCache) {
  globalForVibeExtensions.vibeEmbeddingsCache = new Map()
}

// Generate search extensions for a single category (concrete, tangible elements)
// Used when source='search' - focuses on concrete symbols, elements, and content
async function generateSearchExtensionsForCategory(query: string, category: string): Promise<string[]> {
  const queryLower = query.toLowerCase()
  const cacheKey = `search:${queryLower}:${category}`
  
  // Check in-memory cache first (fastest)
  const cached = globalForVibeExtensions.vibeExtensionsCache.get(cacheKey)
  if (cached) {
    console.log(`[search-extensions] In-memory cache HIT for ${cacheKey}`)
    return cached
  }
  
  // Check database cache (persists across serverless invocations)
  try {
    const dbCache = await prisma.queryExpansion.findMany({
      where: {
        term: queryLower,
        category: category,
        source: 'searchbar',
        model: 'llama-3.3-70b-versatile'
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    })
    
    if (dbCache.length > 0 && dbCache[0].expansion) {
      const extensions = [dbCache[0].expansion]
      // Populate in-memory cache for faster access
      globalForVibeExtensions.vibeExtensionsCache.set(cacheKey, extensions)
      console.log(`[search-extensions] Database cache HIT for ${cacheKey}`)
      return extensions
    }
  } catch (error: any) {
    console.warn(`[search-extensions] Database cache check failed for ${cacheKey}:`, error.message)
  }
  
  console.log(`[search-extensions] Cache MISS for ${cacheKey}, generating concrete search extension...`)
  
  const categoryContext = CATEGORY_CONTEXTS[category] || 'design in this category'
  const client = getGroqClientForCategory(category)
  
  // Category-specific prompts for search queries (concrete and tangible)
  let prompt = ''
  
  if (category === 'website') {
    prompt = `You are a visual-grounding engine for a CLIP-based web design search system.

Your task is to translate the user's query "${query}" into concrete, visually recognizable WEB INTERFACE ELEMENTS, LAYOUT PATTERNS, OR UI COMPONENTS commonly seen in websites.

Rules:

1. If the query is abstract, map it to common, visible web UI structures or components.

2. Prefer layout patterns and interface elements that are immediately recognizable in screenshots.

3. Use short noun phrases only (2–5 words each).

4. Output 3–7 visual groundings.

5. Do NOT include explanations, styles, moods, branding language, or abstract concepts.

Output ONLY this JSON:

{
  "visual_groundings": []
}

Example for "direction":
{
  "visual_groundings": [
    "arrow icons",
    "scroll indicator arrows",
    "breadcrumb navigation",
    "step progress indicator",
    "directional call to action"
  ]
}

Example for "structure":
{
  "visual_groundings": [
    "grid layout",
    "multi column layout",
    "sectioned content blocks",
    "card layout",
    "aligned content rows"
  ]
}

Example for "interaction":
{
  "visual_groundings": [
    "hover buttons",
    "clickable cards",
    "dropdown menus",
    "toggle switches",
    "accordion panels"
  ]
}`
  } else if (category === 'logo') {
    prompt = `You are a visual-grounding engine for a CLIP-based logo and icon search system.

Your task is to translate the user's query "${query}" into a small set of concrete, visually recognizable symbols or shapes commonly used in logo and icon design.

Rules:

1. If the query is abstract, map it to the most common visual representations.

2. Prefer simple, flat, symbolic forms that are easy to recognize visually.

3. Use short noun phrases only (2–5 words each).

4. Output 3–7 visual groundings.

5. Do NOT include explanations, styles, moods, or abstract language.

Output ONLY this JSON:

{
  "visual_groundings": []
}

Example for "direction":
{
  "visual_groundings": [
    "arrow symbol",
    "directional arrow icon",
    "compass icon",
    "navigation arrow",
    "forward pointing arrow"
  ]
}`
  } else if (category === 'graphic') {
    prompt = `You are a visual-grounding engine for a CLIP-based graphic design search system.

Your task is to translate the user's query "${query}" into concrete, visually recognizable GRAPHIC ELEMENTS commonly seen in posters, patterns, and surface designs.

Rules:

1. If the query is abstract, map it to common visual motifs, shapes, layouts, or repeating elements used in graphic design.

2. Prefer visible, repeatable graphic components over conceptual ideas.

3. Use short noun phrases only (2–5 words each).

4. Output 3–7 visual groundings.

5. Do NOT include explanations, moods, styles, branding language, or abstract terms.

Output ONLY this JSON:

{
  "visual_groundings": []
}

Example for "energy":
{
  "visual_groundings": [
    "zigzag shapes",
    "lightning bolt motifs",
    "radiating lines",
    "dynamic diagonal shapes",
    "repeating wave forms"
  ]
}

Example for "order":
{
  "visual_groundings": [
    "grid layout",
    "repeating square pattern",
    "aligned columns",
    "even spacing",
    "symmetrical arrangement"
  ]
}`
  } else if (category === 'packaging') {
    prompt = `You are a visual-grounding engine for a CLIP-based packaging design search system.

Your task is to translate the user's query "${query}" into concrete, visually recognizable PACKAGING FORMS, STRUCTURES, OR COMMON PACKAGING ELEMENTS used in product design.

Rules:

1. If the query is abstract, map it to the most common physical or visual packaging representations.

2. Prefer tangible packaging formats, materials, and structural elements.

3. Use short noun phrases only (2–5 words each).

4. Output 3–7 visual groundings.

5. Do NOT include explanations, styles, moods, branding language, or abstract concepts.

Output ONLY this JSON:

{
  "visual_groundings": []
}

Example for "direction":
{
  "visual_groundings": [
    "arrow graphic",
    "directional arrows",
    "opening instruction arrow",
    "tear here arrow",
    "folding direction arrows"
  ]
}`
  } else if (category === 'brand' || category === 'branding') {
    prompt = `You are a visual-grounding engine for a CLIP-based branding design search system.

Your task is to translate the user's query "${query}" into concrete, visually recognizable BRAND ASSETS OR BRAND APPLICATION CONTEXTS commonly shown in branding imagery.

Rules:

1. If the query is abstract, map it to common brand assets or real-world brand applications.

2. Include multiple distinct asset types to reflect visual diversity.

3. Prefer tangible, visible artifacts over abstract branding concepts.

4. Use short noun phrases only (2–5 words each).

5. Output 5–9 visual groundings to cover variety.

6. Do NOT include explanations, styles, moods, or abstract language.

Output ONLY this JSON:

{
  "visual_groundings": []
}

Example for "direction":
{
  "visual_groundings": [
    "arrow logo mark",
    "brand symbol icon",
    "directional signage",
    "wayfinding graphics",
    "branded poster",
    "brand guidelines spread",
    "brand application mockup"
  ]
}

Example for "identity":
{
  "visual_groundings": [
    "logo system",
    "brand mark variations",
    "brand guidelines pages",
    "stationery set",
    "business card design",
    "brand application mockup",
    "visual identity system"
  ]
}

Example for "consistency":
{
  "visual_groundings": [
    "repeated brand elements",
    "cohesive brand layouts",
    "multi asset brand system",
    "consistent color usage",
    "brand guideline examples",
    "aligned typography samples"
  ]
}`
  } else {
    // Generic prompt for other categories
    prompt = `Generate exactly 1 concrete search extension for "${query}" in ${categoryContext}.

The extension must describe CONCRETE, TANGIBLE elements related to "${query}":
- Specific symbols, icons, or visual elements representing "${query}" or its synonyms
- Concrete design elements commonly associated with "${query}"
- Tangible visual patterns that appear in ${categoryContext} related to "${query}"

Focus on WHAT YOU CAN SEE, not abstract concepts. Be specific about concrete visual elements.

You must return ONLY a valid JSON array with exactly 1 string element. Do not include any explanation or other text.`
  }

  try {
    // Add timeout to Groq API call (10s max) to prevent hanging
    const groqTimeout = 10000 // 10 seconds
    const groqPromise = client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8
    })
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Groq API call timed out after 10s')), groqTimeout)
    })
    
    const completion = await Promise.race([groqPromise, timeoutPromise]) as any

    const text = completion.choices[0]?.message?.content || ''
    
    // Parse JSON from response
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    const parsed = JSON.parse(jsonText)
    
    // Handle different response formats
    let extensions: string[]
    if ((category === 'logo' || category === 'packaging' || category === 'graphic' || category === 'website' || category === 'brand' || category === 'branding') && parsed.visual_groundings && Array.isArray(parsed.visual_groundings)) {
      // For logo, packaging, graphic, website, and brand categories, use the visual_groundings array
      extensions = parsed.visual_groundings
      console.log(`[search-extensions] ${category} category: received ${extensions.length} visual groundings`)
    } else if (Array.isArray(parsed)) {
      extensions = parsed
    } else if (parsed.extensions && Array.isArray(parsed.extensions)) {
      extensions = parsed.extensions
    } else {
      throw new Error(`Expected array of extensions, got: ${typeof parsed}`)
    }
    
    // Normalize: trim, filter empty, ensure strings
    const normalized = extensions
      .map((item: any) => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter((s: string) => s.length > 0)
    
    // For logo, packaging, graphic, website, and brand categories, combine all visual groundings into a single extension string
    // For other categories, take only the first extension
    let result: string[]
    if ((category === 'logo' || category === 'packaging' || category === 'graphic' || category === 'website' || category === 'brand' || category === 'branding') && normalized.length > 0) {
      // Combine all visual groundings into a single comma-separated string
      const combinedExtension = normalized.join(', ')
      result = [combinedExtension]
      console.log(`[search-extensions] ${category} category: combined ${normalized.length} visual groundings into: "${combinedExtension.substring(0, 150)}..."`)
    } else {
      // For other categories, take only the first extension
      result = normalized.slice(0, 1)
    }
    
    if (result.length === 0) {
      result = []
    }
    
    // Cache the result for future use
    if (result.length > 0) {
      // Combine query with extension: "Query, Extension"
      const extension = result[0]
      const combinedExtension = `${query}, ${extension}`
      const combinedResult = [combinedExtension]
      
      // Store in in-memory cache (fast)
      globalForVibeExtensions.vibeExtensionsCache.set(cacheKey, combinedResult)
      
      // Store in database cache (persists across serverless invocations)
      // Non-blocking: fire and forget to avoid blocking the response
      prisma.queryExpansion.upsert({
        where: {
          term_expansion_source_category: {
            term: queryLower,
            expansion: combinedExtension,
            source: 'searchbar',
            category: category
          }
        },
        update: {
          lastUsedAt: new Date(),
          model: 'llama-3.3-70b-versatile'
        },
        create: {
          term: queryLower,
          expansion: combinedExtension,
            source: 'searchbar',
          category: category,
          model: 'llama-3.3-70b-versatile'
        }
      }).then(() => {
        console.log(`[search-extensions] Stored in database cache: ${cacheKey}`)
      }).catch((error: any) => {
        console.warn(`[search-extensions] Failed to store in database cache for ${cacheKey}:`, error.message)
      })
      
      return combinedResult
    }
    
    return result
  } catch (error: any) {
    console.error(`[search-extensions] Error generating search extensions for category "${category}":`, error.message)
    return []
  }
}

// Generate vibe extensions for a single category (cached to ensure consistent results)
async function generateVibeExtensionsForCategory(vibe: string, category: string): Promise<string[]> {
  const vibeLower = vibe.toLowerCase()
  const cacheKey = `${vibeLower}:${category}`
  
  // Check in-memory cache first (fastest)
  const cached = globalForVibeExtensions.vibeExtensionsCache.get(cacheKey)
  if (cached) {
    console.log(`[vibe-cache] In-memory cache HIT for ${cacheKey}`)
    return cached
  }
  
  // Check database cache (persists across serverless invocations)
  // Don't filter by model - some entries might not have it set
  try {
    const dbCache = await prisma.queryExpansion.findMany({
      where: {
        term: vibeLower,
        category: category,
        source: 'vibefilter'
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    })
    
    if (dbCache.length > 0 && dbCache[0].expansion) {
      const extensions = [dbCache[0].expansion]
      // Populate in-memory cache for faster access
      globalForVibeExtensions.vibeExtensionsCache.set(cacheKey, extensions)
      console.log(`[vibe-cache] Database cache HIT for ${cacheKey}`)
      return extensions
    }
  } catch (error: any) {
    console.warn(`[vibe-cache] Database cache check failed for ${cacheKey}:`, error.message)
  }
  
  console.log(`[vibe-cache] Cache MISS for ${cacheKey} (cache size: ${globalForVibeExtensions.vibeExtensionsCache.size}), generating...`)
  
  const categoryContext = CATEGORY_CONTEXTS[category] || 'design in this category'
  const client = getGroqClientForCategory(category)
  
  // Logo-specific prompt that focuses on symbols, iconography, and letterforms
  const logoPrompt = category === 'logo' ? `Generate exactly 1 semantic extension for "${vibe}" in logo design.

The extension must be a single comma-separated string with exactly these 5 attributes in order:
1. Symbol/Icon style - describe the type of logo mark (e.g., "geometric wordmark design", "organic icon mark", "abstract letterform symbol", "emblem style mark")
2. Shapes and forms characteristics - describe the shape qualities (e.g., "round and curved forms", "beveled angular edges", "sharp geometric shapes", "interlocking curved patterns")
3. Visual style - describe the overall aesthetic (e.g., "minimalist geometric style", "vintage retro aesthetic", "futuristic modern design", "organic natural forms")
4. Typography style - describe the letterform characteristics (e.g., "bold sans-serif letterforms", "elegant serif typography", "playful script letterforms", "geometric display type")
5. Level of detail - describe the complexity (e.g., "minimal simplified forms", "detailed ornate elements", "simplified icon shapes", "complex intricate patterns")

CRITICAL: 
- Focus on SYMBOLS, SHAPES, and TYPOGRAPHY - not colors or generic UI elements
- Be descriptive and specific about visual characteristics
- Each attribute should be a descriptive phrase that captures the visual quality

Examples:
- ["geometric wordmark design, round and curved forms, minimalist geometric style, bold sans-serif letterforms, minimal simplified forms"]
- ["organic icon mark, beveled angular edges, vintage retro aesthetic, elegant serif typography, detailed ornate elements"]
- ["abstract letterform symbol, sharp geometric shapes, futuristic modern design, geometric display type, simplified icon shapes"]
- ["emblem style mark, interlocking curved patterns, organic natural forms, playful script letterforms, complex intricate patterns"]

You must return ONLY a valid JSON array with exactly 1 string element. Do not include any explanation or other text.` : `Generate exactly 1 semantic extension for "${vibe}" in ${categoryContext}.

CRITICAL RULES:
1. CLIP only sees STATIC images - NEVER mention animations, motion, interactions, or dynamic effects
2. Focus on distinctive but GENERAL visual characteristics (not overly specific elements that only match 1-2 examples)
3. Avoid generic terms that apply to all designs
4. Use terms that are distinctive enough to differentiate "${vibe}" from opposite styles, but general enough to match many examples

The extension must be a single comma-separated string with exactly these 7 elements in order:
1. Distinctive style characteristic (e.g., "3D rendered surfaces", "romantic floral motifs", "whimsical hand-drawn style" - NOT generic "website design" or overly specific "dreamcatcher icon")
2. Color palette specifics (e.g., "pastel gradient backgrounds", "soft pink and rose tones", "vibrant neon accents" - describe color characteristics, not specific objects)
3. Typography characteristics (e.g., "playful script letterforms", "elegant serif headings", "bold geometric display type" - describe TYPEFACE STYLE, not just "typography")
4. Composition approach (e.g., "asymmetrical scattered layouts", "centered symmetrical arrangements", "overlapping layered elements" - describe LAYOUT PATTERN, not just "layout")
5-7. Three distinctive visual elements (e.g., "rounded corner elements", "soft drop shadows", "abstract geometric shapes", "decorative border patterns" - be distinctive but GENERAL, avoid overly specific items like "glowing button" or "dreamcatcher icon")

IMPORTANT RULES:
- DO NOT use generic terms like "website design", "packaging design", "typography", "layout", "composition" - these match everything
- DO NOT mention animations, motion, interactions, dynamic effects, or anything that requires movement (CLIP only sees static images)
- DO NOT use overly specific elements that only match 1-2 examples (e.g., "dreamcatcher icon", "glowing button", "specific object names")
- DO use distinctive but general visual characteristics that appear in many "${vibe}" designs
- Each element should be a descriptive phrase (2-5 words) that highlights what makes "${vibe}" designs visually distinct
- Focus on visual elements that would NOT appear in opposite styles (e.g., for "playful", avoid terms that also match "serious" or "professional")

Examples:
- For "playful": ["whimsical hand-drawn style, vibrant neon color accents, playful script letterforms, asymmetrical scattered layouts, rounded corner elements, soft drop shadows, stylized decorative shapes"]
- For "romantic": ["delicate floral motifs, soft pastel pink tones, elegant serif script typography, centered symmetrical arrangements, embossed texture effects, decorative border patterns, vintage ornamental details"]

You must return ONLY a valid JSON array with exactly 1 string element. Do not include any explanation or other text.`
  
  const prompt = logoPrompt

  try {
    // Add timeout to Groq API call (10s max) to prevent hanging
    const groqTimeout = 10000 // 10 seconds
    const groqPromise = client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8
    })
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Groq API call timed out after 10s')), groqTimeout)
    })
    
    const completion = await Promise.race([groqPromise, timeoutPromise]) as any

    const text = completion.choices[0]?.message?.content || ''
    
    // Parse JSON from response
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    const parsed = JSON.parse(jsonText)
    
    // Handle both array and object formats
    let extensions: string[]
    if (Array.isArray(parsed)) {
      extensions = parsed
    } else if (parsed.extensions && Array.isArray(parsed.extensions)) {
      extensions = parsed.extensions
    } else {
      throw new Error(`Expected array of extensions, got: ${typeof parsed}`)
    }
    
    // Normalize: trim, filter empty, ensure strings, take first one only
    const normalized = extensions
      .map((item: any) => typeof item === 'string' ? item.trim() : String(item).trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 1) // Take only the first extension
    
    const result = normalized.length > 0 ? normalized : []
    
    // Cache in memory only (database storage handled in main search route)
    if (result.length > 0) {
      globalForVibeExtensions.vibeExtensionsCache.set(cacheKey, result)
    }
    
    return result
  } catch (error: any) {
    console.error(`[search] Error generating vibe extensions for category "${category}":`, error.message)
    return []
  }
}

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

/**
 * Get popularity metrics for images (show_count, click_count, CTR)
 * Used to penalize "hub" images that appear frequently but are rarely clicked
 */
async function getImagePopularityMetrics(
  imageIds: string[],
  topN: number = 20
): Promise<Map<string, { showCount: number; clickCount: number; ctr: number }>> {
  if (imageIds.length === 0) return new Map()

  try {
    // Check if userInteraction model exists (use as any to bypass type checking)
    const userInteractionModel = (prisma as any).userInteraction
    if (!userInteractionModel) {
      console.warn(`[search] userInteraction model not available, returning empty metrics`)
      const emptyMetrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
      for (const imageId of imageIds) {
        emptyMetrics.set(imageId, { showCount: 0, clickCount: 0, ctr: 0 })
      }
      return emptyMetrics
    }

    // Count how many times each image appears in top N results across all queries
    const impressions = await userInteractionModel.groupBy({
      by: ['imageId'],
      where: {
        imageId: { in: imageIds },
        position: { lte: topN }, // Only count top N positions
      },
      _count: {
        id: true,
      },
    })

    // Count clicks for each image
    const clicks = await userInteractionModel.groupBy({
      by: ['imageId'],
      where: {
        imageId: { in: imageIds },
        clicked: true,
      },
      _count: {
        id: true,
      },
    })

    // Build maps for quick lookup
    // IMPORTANT: Sort impressions and clicks by imageId to ensure deterministic Map building
    const sortedImpressions = [...impressions].sort((a, b) => (a.imageId || '').localeCompare(b.imageId || ''))
    const sortedClicks = [...clicks].sort((a, b) => (a.imageId || '').localeCompare(b.imageId || ''))
    
    const impressionMap = new Map<string, number>()
    for (const imp of sortedImpressions) {
      impressionMap.set(imp.imageId, imp._count.id)
    }

    const clickMap = new Map<string, number>()
    for (const click of sortedClicks) {
      clickMap.set(click.imageId, click._count.id)
    }

    // Build result map in sorted order to ensure deterministic Map building
    const sortedImageIds = [...imageIds].sort()
    const metrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
    for (const imageId of sortedImageIds) {
      const showCount = impressionMap.get(imageId) || 0
      const clickCount = clickMap.get(imageId) || 0
      // Round CTR to 6 decimal places to ensure deterministic calculations
      const ctr = showCount > 0 ? Math.round((clickCount / showCount) * 1000000) / 1000000 : 0

      metrics.set(imageId, { showCount, clickCount, ctr })
    }

    return metrics
  } catch (error: any) {
    // If userInteraction table doesn't exist or query fails, return empty metrics
    console.warn(`[search] Failed to get popularity metrics: ${error.message}`)
    const emptyMetrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
    for (const imageId of imageIds) {
      emptyMetrics.set(imageId, { showCount: 0, clickCount: 0, ctr: 0 })
    }
    return emptyMetrics
  }
}

// Increase timeout for vector search queries (can be slow without proper index)
export const maxDuration = 60 // 60 seconds

export async function GET(request: NextRequest) {
  const perf = getPerformanceLogger()
  perf.clear() // Clear previous metrics for this request
  
  try {
    perf.start('api.search.GET', {
      url: request.url,
      timestamp: new Date().toISOString(),
    })

    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q') || ''
    // Normalize query to lowercase for case-insensitive search
    const q = rawQuery.trim().toLowerCase()
    const category = searchParams.get('category') || null // Get category filter: 'website', 'packaging', 'all', or null
    const source = searchParams.get('source') || 'vibefilter' // 'search' or 'vibefilter' - determines which extension system to use
    const extensionSystem = source === 'search' ? '🔍 SEARCH (concrete)' : '🎨 VIBE FILTER (abstract)'
    console.log(`\n🔎 [search] API called: q="${q}", category="${category || 'null'}", source="${source}" (${extensionSystem})`)
    console.log(`🔎 [search] Full URL: ${request.url}`)
    console.log(`🔎 [search] Category parameter received: "${category}" (type: ${typeof category})`)
    const debug = searchParams.get('debug') === '1'
    const zeroShot = searchParams.get('ZERO_SHOT') !== 'false' // default true
    
    // Parse slider positions
    let sliderPositions: Record<string, number> = {}
    const slidersParam = searchParams.get('sliders')
    if (slidersParam) {
      try {
        sliderPositions = JSON.parse(slidersParam)
      } catch (e) {
        console.warn('[search] Failed to parse slider positions:', e)
      }
    }
    
    if (!q) {
      perf.end('api.search.GET')
      return NextResponse.json({ images: [], _performance: perf.getSummary() })
    }

    if (zeroShot) {
      perf.start('api.search.GET.zeroShot', { q, category })
      
      // CLIP-FIRST RETRIEVAL: Primary semantic signal
      // 1. Compute query embedding (with expansion for abstract terms)
      // Query is already normalized to lowercase
      
      perf.start('api.search.GET.zeroShot.analyzeQuery')
      // Count words in query
      const wordCount = q.trim().split(/\s+/).filter((w: string) => w.length > 0).length
      const useExpansion = wordCount < 3 // Only use expansion for queries with less than 3 words (1-2 words)
      
      let isAbstract = false
      if (useExpansion) {
        // Only check if abstract if query is 2 words or less
        isAbstract = perf.measureSync('api.search.GET.zeroShot.analyzeQuery.isAbstract', () => {
          return isAbstractQuery(q)
        })
      } else {
        // For queries with more than 2 words, skip expansion
        isAbstract = false
      }
      perf.end('api.search.GET.zeroShot.analyzeQuery', { wordCount, useExpansion, isAbstract })
      
      const usePooling = searchParams.get('pooling') || 'softmax' // 'max' or 'softmax', default 'softmax'
      const poolingTemp = parseFloat(searchParams.get('pooling_temp') || '0.05')
      
      
      let queryVec: number[] | null = null
      let expansionEmbeddings: number[][] | null = null
      const isExpanded = isAbstract && useExpansion
      
      // Generate vibe filter extensions for all categories if this looks like a vibe filter
      // Single-word queries are treated as vibe filters (no abstract detection needed)
      // Extensions are generated immediately, not stored
      const vibeExtensionsByCategory: Record<string, number[][]> = {}
      
      console.log(`\n🔍 [search] Extension path decision:`)
      console.log(`   Query: "${q}"`)
      console.log(`   Category: "${category || 'null'}"`)
      console.log(`   wordCount: ${wordCount}`)
      console.log(`   source: "${source}"`)
      console.log(`   isAbstract: ${isAbstract}`)
      console.log(`   useExpansion: ${useExpansion}`)
      console.log(`   isExpanded: ${isExpanded}`)
      const condition1 = wordCount < 3 && source === 'vibefilter'
      const condition2 = wordCount < 3 && source === 'search'
      console.log(`   Condition 1 (vibefilter): wordCount < 3 && source === 'vibefilter' = ${condition1}`)
      console.log(`   Condition 2 (search): wordCount < 3 && source === 'search' = ${condition2}`)
      console.log(`   Condition 3 (expansion): isExpanded = ${isExpanded}`)
      console.log(`   🔍 DEBUG: wordCount=${wordCount}, source="${source}", source type=${typeof source}`)
      
      // For queries with less than 3 words, generate vibe extensions only if source is 'vibefilter'
      // If source is 'search', use search extension system (concrete, tangible elements)
      if (wordCount < 3 && source === 'vibefilter') {
        console.log(`\n✅ [search] Taking VIBE FILTER path`)
        console.log(`   [search] Vibe word: "${q}"`)
        console.log(`   [search] Will generate extensions for: website, packaging, brand, fonts, apps, graphic, logo`)
        perf.start('api.search.GET.zeroShot.generateVibeExtensions', { vibeWord: q.trim() })
        const vibeWord = q.trim()
        try {
          // Generate extensions for all categories in parallel
          const categoriesToGenerate = ['website', 'packaging', 'brand', 'fonts', 'apps', 'graphic', 'logo']
          
          // Step 1: Check database cache for embeddings first, then generate Groq extensions if needed
          perf.start('api.search.GET.zeroShot.generateVibeExtensions.step1_checkCache')
          const vibeLower = vibeWord.toLowerCase()
          const cacheCheckPromises = categoriesToGenerate.map(async (cat) => {
            try {
              perf.start(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`)
              const embeddingCacheKey = `${vibeLower}:${cat}`
              
              // First check in-memory cache (fastest)
              const cachedEmbedding = globalForVibeExtensions.vibeEmbeddingsCache.get(embeddingCacheKey)
              if (cachedEmbedding) {
                console.log(`[vibe-cache] In-memory embedding cache HIT for ${embeddingCacheKey}`)
                // Verify database entry exists - if not, we need to regenerate
                const dbCacheForExtension = await prisma.queryExpansion.findFirst({
                  where: {
                    term: vibeLower,
                    category: cat,
                    source: 'vibefilter'
                  },
                  orderBy: { createdAt: 'desc' }
                })
                if (dbCacheForExtension?.expansion && dbCacheForExtension.embedding) {
                  // Database entry exists with both expansion and embedding - all good
                  console.log(`[vibe-cache] ✅ Database entry verified: "${dbCacheForExtension.expansion.substring(0, 100)}..."`)
                  perf.end(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`, { cached: 'memory+db' })
                  return { category: cat, extension: dbCacheForExtension.expansion, embedding: cachedEmbedding, needsEmbedding: false, needsGroq: false }
                } else if (dbCacheForExtension?.expansion && !dbCacheForExtension.embedding) {
                  // Database has expansion but no embedding - need to embed it
                  console.warn(`[vibe-cache] ⚠️  Database has expansion but no embedding for ${embeddingCacheKey}`)
                  console.warn(`[vibe-cache]    Will regenerate embedding from: "${dbCacheForExtension.expansion.substring(0, 100)}..."`)
                  return { category: cat, extension: dbCacheForExtension.expansion, embedding: null, needsEmbedding: true, needsGroq: false }
                } else {
                  // Database entry missing - in-memory cache is orphaned, need to regenerate
                  console.error(`[vibe-cache] ❌ CRITICAL: In-memory cache has embedding but NO database entry for ${embeddingCacheKey}`)
                  console.error(`[vibe-cache]    This means previous database storage failed! Will regenerate extension.`)
                  // Clear the orphaned in-memory cache
                  globalForVibeExtensions.vibeEmbeddingsCache.delete(embeddingCacheKey)
                  // Fall through to generate new extension
                }
              }
              
              // Then check database cache for embedding (persists across serverless invocations)
              // Don't filter by model - some entries might not have it set
              try {
                const dbCache = await prisma.queryExpansion.findFirst({
                  where: {
                    term: vibeLower,
                    category: cat,
                    source: 'vibefilter'
                  },
                  orderBy: { createdAt: 'desc' }
                })
                
                if (dbCache) {
                  // If we have an embedding, use it directly
                  if (dbCache.embedding) {
                    const dbEmbedding = dbCache.embedding as unknown as number[]
                    if (Array.isArray(dbEmbedding) && dbEmbedding.length > 0) {
                      // Populate in-memory cache for faster access
                      globalForVibeExtensions.vibeEmbeddingsCache.set(embeddingCacheKey, dbEmbedding)
                      console.log(`[vibe-cache] ✅ Database embedding cache HIT for ${embeddingCacheKey}`)
                      if (dbCache.expansion) {
                        console.log(`[vibe-cache] Extension: "${dbCache.expansion.substring(0, 150)}..."`)
                      }
                      perf.end(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`, { cached: 'database' })
                      return { category: cat, extension: dbCache.expansion || null, embedding: dbEmbedding, needsEmbedding: false, needsGroq: false }
                    }
                  }
                  // If we have expansion text but no embedding, we'll need to generate embedding
                  if (dbCache.expansion && !dbCache.embedding) {
                    console.log(`[vibe-cache] Found expansion text but no embedding for ${embeddingCacheKey}, will generate embedding`)
                    // Return the extension so it can be embedded
                    return { category: cat, extension: dbCache.expansion, embedding: null, needsEmbedding: true, needsGroq: false }
                  }
                }
              } catch (dbError: any) {
                console.warn(`[vibe-cache] Database cache check failed for ${embeddingCacheKey}:`, dbError.message)
              }
              
              console.log(`[vibe-cache] Cache MISS for ${embeddingCacheKey}, generating...`)
              
              // Generate extension with Groq
              const extensions = await perf.measure(`api.search.GET.zeroShot.generateVibeExtensions.${cat}.groq`, async () => {
                return await generateVibeExtensionsForCategory(vibeWord, cat)
              })
              if (extensions.length > 0) {
                // Take only the first extension (single string per category)
                const extension = extensions[0]
                perf.end(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`, { needsEmbedding: true })
                return { category: cat, extension, embedding: null, needsEmbedding: true, needsGroq: false }
              }
              perf.end(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`, { noExtensions: true })
              return { category: cat, extension: null, embedding: null, needsEmbedding: false, needsGroq: false }
            } catch (error: any) {
              perf.end(`api.search.GET.zeroShot.generateVibeExtensions.${cat}`, { error: error.message })
              console.warn(`[search] Failed to generate vibe extensions for category "${cat}":`, error.message)
              return { category: cat, extension: null, embedding: null, needsEmbedding: false, needsGroq: false }
            }
          })
          
          const cacheResults = await Promise.all(cacheCheckPromises)
          perf.end('api.search.GET.zeroShot.generateVibeExtensions.step1_checkCache', { 
            cached: cacheResults.filter(r => !r.needsEmbedding && r.embedding).length,
            needsEmbedding: cacheResults.filter(r => r.needsEmbedding).length
          })
          
          // Step 2: Batch embed all extensions that need embedding in a single call
          perf.start('api.search.GET.zeroShot.generateVibeExtensions.step2_batchEmbed')
          const extensionsToEmbed = cacheResults
            .filter(r => r.needsEmbedding && r.extension)
            .map(r => ({ category: r.category, extension: r.extension! }))
          
          console.log(`[vibe-cache] 📝 Extensions to embed: ${extensionsToEmbed.length}`)
          extensionsToEmbed.forEach(e => {
            console.log(`[vibe-cache]    - ${e.category}: "${e.extension.substring(0, 80)}..."`)
          })
          
          let batchEmbeddings: number[][] = []
          let embedError: any = null
          if (extensionsToEmbed.length > 0) {
            try {
              // Combine vibe word with extension: "Vibe, Extension"
              // This includes the vibe word as part of the semantic meaning
              const extensionTexts = extensionsToEmbed.map(e => `${vibeWord}, ${e.extension}`)
              console.log(`[vibe-cache] 🔄 Embedding ${extensionTexts.length} combined texts (vibe + extension)...`)
              console.log(`[vibe-cache]    Example: "${extensionTexts[0]?.substring(0, 100)}..."`)
              batchEmbeddings = await perf.measure('api.search.GET.zeroShot.generateVibeExtensions.step2_batchEmbed.embedTextBatch', async () => {
                return await embedTextBatch(extensionTexts)
              })
              console.log(`[vibe-cache] ✅ Successfully embedded ${batchEmbeddings.length} texts`)
            } catch (err: any) {
              // If embedding fails (e.g., service timeout), log and continue without embeddings
              // The search will still work, just without vibe extensions for these categories
              embedError = err
              console.warn(`[search] Failed to embed vibe extensions (${extensionsToEmbed.length} extensions):`, err.message)
              // Continue with empty batchEmbeddings - vibe extensions will be skipped for these categories
            }
          }
          perf.end('api.search.GET.zeroShot.generateVibeExtensions.step2_batchEmbed', { 
            batchSize: extensionsToEmbed.length,
            embedded: batchEmbeddings.length,
            error: embedError?.message || null
          })
          
          // Step 3: Normalize, cache embeddings (in-memory and database), map back to categories
          perf.start('api.search.GET.zeroShot.generateVibeExtensions.step3_normalize')
          
          // Process all embeddings in parallel (not sequential) to avoid blocking
          const normalizePromises = extensionsToEmbed.map(async ({ category, extension }, i) => {
            const embedding = batchEmbeddings[i]
            if (!embedding) return null
            
            const embeddingCacheKey = `${vibeLower}:${category}`
            // L2-normalize the embedding
            const normalizedEmbedding = perf.measureSync(`api.search.GET.zeroShot.generateVibeExtensions.step3_normalize.${category}`, () => {
              return l2norm(embedding)
            })
            
            // Cache the normalized embedding in memory
            globalForVibeExtensions.vibeEmbeddingsCache.set(embeddingCacheKey, normalizedEmbedding)
            
            // Store just the extension (7-element format) in database, not "vibe, extension"
            // The embedding was computed from "vibe, extension" but we store clean extension text
            // Store embedding in database for persistence (non-blocking - fire and forget)
            // Don't await - let it run in background to avoid blocking the response
            prisma.queryExpansion.upsert({
              where: {
                term_expansion_source_category: {
                  term: vibeLower,
                  expansion: extension, // Store just the 7-element extension, not "vibe, extension"
                  source: 'vibefilter',
                  category: category
                }
              },
              update: {
                embedding: normalizedEmbedding,
                lastUsedAt: new Date()
              },
              create: {
                term: vibeLower,
                expansion: extension, // Store just the 7-element extension, not "vibe, extension"
                source: 'vibefilter',
                category: category,
                model: 'llama-3.3-70b-versatile',
                embedding: normalizedEmbedding,
                lastUsedAt: new Date()
              }
            }).then(() => {
              console.log(`[vibe-cache] ✅ Successfully stored in database: ${embeddingCacheKey}`)
              console.log(`[vibe-cache]    Term: "${vibeLower}", Category: "${category}", Source: "vibefilter"`)
              console.log(`[vibe-cache]    Expansion: "${extension.substring(0, 100)}..."`)
            }).catch((dbError: any) => {
              console.error(`[vibe-cache] ❌ FAILED to store in database for ${embeddingCacheKey}:`, dbError.message)
              console.error(`[vibe-cache]    Error details:`, dbError)
              console.error(`[vibe-cache]    Term: "${vibeLower}", Category: "${category}", Source: "vibefilter"`)
              console.error(`[vibe-cache]    Expansion: "${extension.substring(0, 100)}..."`)
            })
            
            // Find the corresponding result and update it
            const result = cacheResults.find(r => r.category === category)
            if (result) {
              result.embedding = normalizedEmbedding
            }
            
            return { category, embedding: normalizedEmbedding }
          })
          
          // Wait for all normalizations to complete (but database writes are fire-and-forget)
          await Promise.all(normalizePromises)
          
          perf.end('api.search.GET.zeroShot.generateVibeExtensions.step3_normalize', { 
            normalized: extensionsToEmbed.length 
          })
          
          // Step 4: Build final vibeExtensionsByCategory map
          for (const result of cacheResults) {
            if (result.embedding) {
              // Store as array with single embedding for compatibility with scoring logic
              vibeExtensionsByCategory[result.category] = [result.embedding]
              console.log(`[vibe-cache] ✅ Added embedding for category="${result.category}"`)
            } else {
              console.warn(`[vibe-cache] ⚠️  No embedding for category="${result.category}" (extension: ${result.extension ? 'exists' : 'missing'})`)
            }
          }
          console.log(`[vibe-cache] 📊 Final vibeExtensionsByCategory: ${Object.keys(vibeExtensionsByCategory).join(', ') || 'EMPTY'}`)
          perf.end('api.search.GET.zeroShot.generateVibeExtensions', { 
            categoriesGenerated: Object.keys(vibeExtensionsByCategory).length 
          })
        } catch (error: any) {
          perf.end('api.search.GET.zeroShot.generateVibeExtensions', { error: error.message })
          console.warn(`[search] Failed to generate vibe extensions:`, error.message)
        }
      } else if (wordCount < 3 && source === 'search') {
        // Generate search extensions (concrete, tangible elements) for search queries
        console.log(`\n✅ [search] Taking SEARCH EXTENSION path (wordCount=${wordCount}, source="${source}")`)
        perf.start('api.search.GET.zeroShot.generateSearchExtensions', { searchQuery: q.trim() })
        const searchQuery = q.trim()
        try {
          console.log(`\n🔍 [search-extensions] Generating concrete search extensions for "${searchQuery}"`)
          
          // Generate extensions for all categories in parallel
          const categoriesToGenerate = ['website', 'packaging', 'brand', 'fonts', 'apps', 'graphic', 'logo']
          
          // Step 1: Check database cache for embeddings first, then generate Groq extensions if needed
          perf.start('api.search.GET.zeroShot.generateSearchExtensions.step1_checkCache')
          const searchLower = searchQuery.toLowerCase()
          const cacheCheckPromises = categoriesToGenerate.map(async (cat) => {
            try {
              perf.start(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`)
              const embeddingCacheKey = `search:${searchLower}:${cat}`
              
              // First check in-memory cache (fastest)
              const cachedEmbedding = globalForVibeExtensions.vibeEmbeddingsCache.get(embeddingCacheKey)
              if (cachedEmbedding) {
                console.log(`[search-extensions] In-memory embedding cache HIT for ${embeddingCacheKey}`)
                perf.end(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`, { cached: 'memory' })
                return { category: cat, extension: null, embedding: cachedEmbedding, needsEmbedding: false }
              }
              
              // Then check database cache for embedding (persists across serverless invocations)
              // IMPORTANT: Only check for source='search' to avoid using vibe filter extensions
              try {
                const dbCache = await prisma.queryExpansion.findFirst({
                  where: {
                    term: searchLower,
                    category: cat,
                    source: 'searchbar', // CRITICAL: Only use search extensions, not vibe filters
                    model: 'llama-3.3-70b-versatile'
                  },
                  orderBy: { createdAt: 'desc' }
                })
                
                if (dbCache && dbCache.embedding) {
                  const dbEmbedding = dbCache.embedding as unknown as number[]
                  if (Array.isArray(dbEmbedding) && dbEmbedding.length > 0) {
                    // Populate in-memory cache for faster access
                    globalForVibeExtensions.vibeEmbeddingsCache.set(embeddingCacheKey, dbEmbedding)
                    console.log(`[search-extensions] ✅ Database embedding cache HIT for ${embeddingCacheKey} (source=searchbar)`)
                    console.log(`[search-extensions] Extension text: "${dbCache.expansion?.substring(0, 150)}..."`)
                    perf.end(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`, { cached: 'database', source: 'searchbar' })
                    return { category: cat, extension: null, embedding: dbEmbedding, needsEmbedding: false }
                  }
                } else {
                  // Check if vibe filter extension exists (for debugging)
                  const vibeCache = await prisma.queryExpansion.findFirst({
                    where: {
                      term: searchLower,
                      category: cat,
                      source: 'vibefilter', // Vibe filters use 'vibefilter' source
                      model: 'llama-3.3-70b-versatile'
                    },
                    orderBy: { createdAt: 'desc' }
                  })
                  if (vibeCache) {
                    console.log(`[search-extensions] ⚠️  Found vibe filter extension for "${searchLower}:${cat}" but NOT using it (source=searchbar requires search extensions)`)
                  }
                }
              } catch (dbError: any) {
                console.warn(`[search-extensions] Database cache check failed for ${embeddingCacheKey}:`, dbError.message)
              }
              
              console.log(`[search-extensions] ❌ Cache MISS for ${embeddingCacheKey}, generating NEW concrete search extension...`)
              
              // Generate extension with Groq (using search-specific prompts)
              const extensions = await perf.measure(`api.search.GET.zeroShot.generateSearchExtensions.${cat}.groq`, async () => {
                return await generateSearchExtensionsForCategory(searchQuery, cat)
              })
              if (extensions.length > 0) {
                // Take only the first extension (single string per category)
                const extension = extensions[0]
                console.log(`[search-extensions] ✅ Generated NEW extension for ${cat}: "${extension.substring(0, 150)}..."`)
                perf.end(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`, { needsEmbedding: true, generated: true })
                return { category: cat, extension, embedding: null, needsEmbedding: true }
              } else {
                console.warn(`[search-extensions] ⚠️  No extensions generated for ${cat}`)
              }
              perf.end(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`, { noExtensions: true })
              return { category: cat, extension: null, embedding: null, needsEmbedding: false }
            } catch (error: any) {
              perf.end(`api.search.GET.zeroShot.generateSearchExtensions.${cat}`, { error: error.message })
              console.warn(`[search-extensions] Failed to generate search extensions for category "${cat}":`, error.message)
              return { category: cat, extension: null, embedding: null, needsEmbedding: false }
            }
          })
          
          const cacheResults = await Promise.all(cacheCheckPromises)
          perf.end('api.search.GET.zeroShot.generateSearchExtensions.step1_checkCache', { 
            cached: cacheResults.filter(r => !r.needsEmbedding && r.embedding).length,
            needsEmbedding: cacheResults.filter(r => r.needsEmbedding).length
          })
          
          // Step 2: Batch embed all extensions that need embedding in a single call
          perf.start('api.search.GET.zeroShot.generateSearchExtensions.step2_batchEmbed')
          const extensionsToEmbed = cacheResults
            .filter(r => r.needsEmbedding && r.extension)
            .map(r => ({ category: r.category, extension: r.extension! }))
          
          let batchEmbeddings: number[][] = []
          let embedError: any = null
          if (extensionsToEmbed.length > 0) {
            try {
              // Combine query with extension: "Query, Extension"
              const extensionTexts = extensionsToEmbed.map(e => `${searchQuery}, ${e.extension}`)
              batchEmbeddings = await perf.measure('api.search.GET.zeroShot.generateSearchExtensions.step2_batchEmbed.embedTextBatch', async () => {
                return await embedTextBatch(extensionTexts)
              })
            } catch (err: any) {
              // If embedding fails (e.g., service timeout), log and continue without embeddings
              embedError = err
              console.warn(`[search-extensions] Failed to embed search extensions (${extensionsToEmbed.length} extensions):`, err.message)
            }
          }
          perf.end('api.search.GET.zeroShot.generateSearchExtensions.step2_batchEmbed', { 
            batchSize: extensionsToEmbed.length,
            embedded: batchEmbeddings.length,
            error: embedError?.message || null
          })
          
          // Step 3: Normalize, cache embeddings (in-memory and database), map back to categories
          perf.start('api.search.GET.zeroShot.generateSearchExtensions.step3_normalize')
          
          // Process all embeddings in parallel (not sequential) to avoid blocking
          const normalizePromises = extensionsToEmbed.map(async ({ category, extension }, i) => {
            const embedding = batchEmbeddings[i]
            if (!embedding) return null
            
            const embeddingCacheKey = `search:${searchLower}:${category}`
            // L2-normalize the embedding
            const normalizedEmbedding = perf.measureSync(`api.search.GET.zeroShot.generateSearchExtensions.step3_normalize.${category}`, () => {
              return l2norm(embedding)
            })
            
            // Cache the normalized embedding in memory
            globalForVibeExtensions.vibeEmbeddingsCache.set(embeddingCacheKey, normalizedEmbedding)
            
            // Combine query with extension: "Query, Extension" for storage
            const combinedExtension = `${searchQuery}, ${extension}`
            
            // Store embedding in database for persistence (non-blocking - fire and forget)
            prisma.queryExpansion.upsert({
              where: {
                term_expansion_source_category: {
                  term: searchLower,
                  expansion: combinedExtension,
                  source: 'searchbar',
                  category: category
                }
              },
              update: {
                embedding: normalizedEmbedding,
                lastUsedAt: new Date()
              },
              create: {
                term: searchLower,
                expansion: combinedExtension,
                source: 'searchbar',
                category: category,
                model: 'llama-3.3-70b-versatile',
                embedding: normalizedEmbedding,
                lastUsedAt: new Date()
              }
            }).then(() => {
              console.log(`[search-extensions] Stored embedding in database cache: ${embeddingCacheKey}`)
            }).catch((dbError: any) => {
              console.warn(`[search-extensions] Failed to store embedding in database for ${embeddingCacheKey}:`, dbError.message)
            })
            
            // Find the corresponding result and update it
            const result = cacheResults.find(r => r.category === category)
            if (result) {
              result.embedding = normalizedEmbedding
            }
            
            return { category, embedding: normalizedEmbedding }
          })
          
          // Wait for all normalizations to complete (but database writes are fire-and-forget)
          await Promise.all(normalizePromises)
          
          perf.end('api.search.GET.zeroShot.generateSearchExtensions.step3_normalize', { 
            normalized: extensionsToEmbed.length 
          })
          
          // Step 4: Build final searchExtensionsByCategory map
          for (const result of cacheResults) {
            if (result.embedding) {
              // Store as array with single embedding for compatibility with scoring logic
              vibeExtensionsByCategory[result.category] = [result.embedding]
            }
          }
          
          console.log(`[search-extensions] ✅ Generated extensions for ${Object.keys(vibeExtensionsByCategory).length} categories`)
          console.log(`[search-extensions] Categories with extensions: ${Object.keys(vibeExtensionsByCategory).join(', ')}`)
          // Log what extensions are being used
          for (const [cat, embeddings] of Object.entries(vibeExtensionsByCategory)) {
            const result = cacheResults.find(r => r.category === cat)
            if (result?.extension) {
              console.log(`[search-extensions] 📝 Using for ${cat}: "${result.extension.substring(0, 150)}..."`)
            } else if (result?.embedding) {
              console.log(`[search-extensions] 📝 Using cached embedding for ${cat} (extension text not available)`)
            }
          }
          perf.end('api.search.GET.zeroShot.generateSearchExtensions', { 
            categoriesGenerated: Object.keys(vibeExtensionsByCategory).length 
          })
        } catch (error: any) {
          perf.end('api.search.GET.zeroShot.generateSearchExtensions', { error: error.message })
          console.warn(`[search-extensions] Failed to generate search extensions:`, error.message)
        }
      }
      
      const hasVibeExtensions = Object.keys(vibeExtensionsByCategory).length > 0
      
      console.log(`\n📊 [search] Extension system status:`)
      console.log(`   wordCount: ${wordCount}`)
      console.log(`   source: "${source}"`)
      console.log(`   isExpanded: ${isExpanded}`)
      console.log(`   hasVibeExtensions: ${hasVibeExtensions}`)
      console.log(`   vibeExtensionsByCategory keys: ${Object.keys(vibeExtensionsByCategory).join(', ') || 'none'}`)
      
      if (hasVibeExtensions) {
        // Set expansionEmbeddings to null - we'll compute per-category in scoring
        expansionEmbeddings = null
        // Use category-specific extension for pgvector search when category filter is active
        // This ensures we retrieve the best candidates for the selected category
        // If category is 'all' or null, use website extension as default
        const categoryForQuery = category && category !== 'all' ? category : 'website'
        console.log(`[search] 🔍 Selecting query embedding for category="${categoryForQuery}"`)
        console.log(`[search] Available extensions: ${Object.keys(vibeExtensionsByCategory).join(', ')}`)
        perf.start('api.search.GET.zeroShot.getQueryEmbedding')
        
        // CRITICAL: Only use vibe extension embeddings, never fallback to raw query
        // If no vibe extensions are available, this is an error condition
        const queryEmbedding = vibeExtensionsByCategory[categoryForQuery]?.[0] || 
                               vibeExtensionsByCategory['website']?.[0] ||
                               Object.values(vibeExtensionsByCategory)[0]?.[0]
        
        let usedExtensionCategory = 'fallback'
        if (!queryEmbedding) {
          console.error(`[search] ❌ ERROR: No vibe extension embeddings available! vibeExtensionsByCategory keys: ${Object.keys(vibeExtensionsByCategory).join(', ')}`)
          console.error(`[search] This should not happen - vibe extensions should have been generated`)
          // Fallback to raw query only as last resort
          const [fallbackVec] = await perf.measure('api.search.GET.zeroShot.getQueryEmbedding.embedFallback', async () => {
            return await embedTextBatch([q])
          })
          queryVec = fallbackVec
          usedExtensionCategory = 'fallback'
          console.warn(`[search] ⚠️  Using fallback embedding for raw query "${q}" (vibe extensions failed)`)
        } else {
          queryVec = queryEmbedding
          usedExtensionCategory = vibeExtensionsByCategory[categoryForQuery]?.[0] ? categoryForQuery :
                                  vibeExtensionsByCategory['website']?.[0] ? 'website' :
                                  Object.keys(vibeExtensionsByCategory)[0] || 'unknown'
          console.log(`[search] ✅ Using vibe extension embedding from category="${usedExtensionCategory}" for initial pgvector search`)
        }
        perf.end('api.search.GET.zeroShot.getQueryEmbedding', { 
          hasVibeExtension: !!vibeExtensionsByCategory[categoryForQuery]?.[0],
          usedCategory: usedExtensionCategory,
          requestedCategory: categoryForQuery
        })
      } else if (isExpanded) {
        console.log(`\n✅ [search] Taking EXPANSION path (isExpanded=${isExpanded}, wordCount=${wordCount}, source="${source}")`)
        // Use max/softmax pooling for expansions (OR semantics)
        // When category is 'all', generate expansions for all categories
        if (category === 'all') {
          // Generate expansions for all categories in parallel (non-blocking)
          const allCategories = ['website', 'packaging', 'brand', 'graphic', 'logo']
          Promise.all(
            allCategories.map((cat: string) => 
              expandAbstractQuery(q, cat).catch((err: any) => {
                console.warn(`[search] Failed to generate expansions for category "${cat}":`, err.message)
                return []
              })
            )
          ).catch(err => {
            console.warn(`[search] Error generating multi-category expansions:`, err.message)
          })
        }
        // Pass category to getExpansionEmbeddings for category-specific expansions
        // For 'all', use null (global) for the actual search, but expansions are generated above
        const expansionCategory = category && category !== 'all' ? category : null
        console.log(`\n🎯 [search] EXPANSION CONFIGURATION:`)
        console.log(`   Query: "${q}"`)
        console.log(`   Category: "${category || 'null'}"`)
        console.log(`   Expansion Category: "${expansionCategory || 'null'}"`)
        console.log(`   isAbstract: ${isAbstract}, useExpansion: ${useExpansion}, isExpanded: ${isExpanded}`)
        expansionEmbeddings = await getExpansionEmbeddings(q, expansionCategory)
        console.log(`[search] Got ${expansionEmbeddings.length} expansion embedding vectors`)
        // For backward compatibility, also compute averaged embedding (used in debug mode)
        // IMPORTANT: Pass category so initial pgvector search uses category-specific expansions
        queryVec = await expandAndEmbedQuery(q, expansionCategory)
        console.log(`[search] ✅ Query vector computed (dim: ${queryVec.length}) - will be used for pgvector search\n`)
      } else {
        // Direct embedding for concrete queries or queries with >2 words
        perf.start('api.search.GET.zeroShot.embedQuery')
        try {
          const [vec] = await perf.measure('api.search.GET.zeroShot.embedQuery.embedTextBatch', async () => {
            return await embedTextBatch([q])
          })
          queryVec = vec
          perf.end('api.search.GET.zeroShot.embedQuery')
        } catch (error: any) {
          perf.end('api.search.GET.zeroShot.embedQuery', { error: error.message })
          console.error('[search] Failed to embed query:', error.message)
          return NextResponse.json(
            { 
              error: 'Search temporarily unavailable',
              message: 'Embedding service is not available in this environment. Please try again later.',
              details: process.env.NODE_ENV === 'development' ? error.message : undefined,
              _performance: perf.getSummary(),
            },
            { status: 503 }
          )
        }
      }
      const dim = queryVec.length
      
      // 2. Retrieve images with embeddings (filter by category if specified)
      // OPTIMIZATION: Only load embedding vectors and minimal image data
      // We'll load full site data only for top results
      const whereClause: any = { embedding: { isNot: null } }
      // Filter by category if specified and not 'all'
      if (category && category !== 'all') {
        whereClause.category = category
      }
      
      // OPTIMIZATION: Use pgvector for fast approximate nearest neighbor search
      // This dramatically reduces computation by only loading top K candidates
      
      // Convert query vector to pgvector format
      const queryVectorStr = '[' + queryVec!.join(',') + ']'
      
      // Use pgvector similarity search (cosine distance: 1 - cosine similarity)
      // IMPORTANT: When using vibe extensions, we need more candidates because scoring uses category-specific extensions
      // which can reorder items. We need enough candidates to ensure items that rank in top 100 after reordering are included.
      const TOP_CANDIDATES = hasVibeExtensions ? 200 : 100
      
      let imageEmbeddings: any[] = []
      
      try {
        // OPTIMIZATION: Cache pgvector availability check (doesn't change during runtime)
        const globalForPgvector = globalThis as unknown as { pgvectorAvailable?: boolean }
        let pgvectorAvailable: { exists: boolean }[]
        
        if (globalForPgvector.pgvectorAvailable === undefined) {
          try {
            pgvectorAvailable = await prisma.$queryRaw<[{ exists: boolean }]>`
              SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns c
                JOIN pg_type t ON t.oid = (
                  SELECT atttypid 
                  FROM pg_attribute 
                  WHERE attrelid = (
                    SELECT oid FROM pg_class WHERE relname = 'image_embeddings'
                  ) 
                  AND attname = 'vector'
                )
                WHERE c.table_name = 'image_embeddings' 
                AND c.column_name = 'vector'
                AND t.typname = 'vector'
              ) as exists
            `
          } catch (error) {
            pgvectorAvailable = [{ exists: false }]
          }
          globalForPgvector.pgvectorAvailable = pgvectorAvailable[0].exists
        } else {
          pgvectorAvailable = [{ exists: globalForPgvector.pgvectorAvailable }]
        }
        
        if (pgvectorAvailable[0].exists) {
          // Use pgvector for fast ANN search
          // Build query with parameterized category filter
          let pgvectorQuery = `
            SELECT 
              ie."imageId",
              ie.model,
              ie.vector,
              1 - (ie.vector <=> $1::vector) as similarity,
              i.id,
              i."siteId",
              i.url,
              i.category
            FROM "image_embeddings" ie
            JOIN "images" i ON i.id = ie."imageId"
            WHERE ie.vector IS NOT NULL
          `
          
          const queryParams: any[] = [queryVectorStr]
          
          if (category && category !== 'all') {
            pgvectorQuery += ` AND i.category = $${queryParams.length + 1}`
            queryParams.push(category)
            console.log(`[search] 🔍 pgvector search: filtering by category="${category}"`)
            console.log(`[search] 🔍 SQL query will include: AND i.category = $${queryParams.length}`)
          } else {
            console.log(`[search] 🔍 pgvector search: NO category filter (category="${category || 'null'}")`)
          }
          
          pgvectorQuery += ` ORDER BY ie.vector <=> $1::vector, ie."imageId" ASC LIMIT $${queryParams.length + 1}`
          queryParams.push(TOP_CANDIDATES)
          
          console.log(`[search] 🔍 Executing pgvector query:`)
          console.log(`   Category filter: ${category && category !== 'all' ? `"${category}"` : 'none'}`)
          console.log(`   Top candidates: ${TOP_CANDIDATES}`)
          console.log(`   Query vector dim: ${queryVec.length}`)
          perf.start('api.search.GET.zeroShot.pgvectorQuery', { topCandidates: TOP_CANDIDATES, category })
          const pgvectorResults = await perf.measure('api.search.GET.zeroShot.pgvectorQuery.execute', async () => {
            return await prisma.$queryRawUnsafe<any[]>(pgvectorQuery, ...queryParams)
          }, { topCandidates: TOP_CANDIDATES, category })
          perf.end('api.search.GET.zeroShot.pgvectorQuery', { resultCount: pgvectorResults.length })
          console.log(`[search] ✅ pgvector returned ${Array.isArray(pgvectorResults) ? pgvectorResults.length : 0} candidates`)
          if (pgvectorResults.length > 0) {
            const categories = [...new Set(pgvectorResults.map((r: any) => r.category || 'unknown'))]
            const categoryCounts = new Map<string, number>()
            pgvectorResults.forEach((r: any) => {
              const cat = r.category || 'unknown'
              categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1)
            })
            console.log(`   All candidate categories: ${Array.from(categoryCounts.entries()).map(([cat, count]) => `${cat}:${count}`).join(', ')}`)
            if (category && category !== 'all') {
              const expectedCount = categoryCounts.get(category) || 0
              const unexpectedCount = pgvectorResults.length - expectedCount
              if (unexpectedCount > 0) {
                console.warn(`   ⚠️  WARNING: Expected only "${category}" images, but found ${unexpectedCount} images from other categories!`)
              } else {
                console.log(`   ✅ All ${pgvectorResults.length} candidates are from category "${category}" as expected`)
              }
            }
          }
          
          // Transform results to match expected format
          // pgvector returns vectors as strings or arrays - normalize to array
          imageEmbeddings = pgvectorResults.map((row: any) => {
            let vector = row.vector
            // pgvector might return vector as string "[1,2,3]" or as array
            if (typeof vector === 'string') {
              try {
                vector = JSON.parse(vector)
              } catch (e) {
                vector = []
              }
            } else if (!Array.isArray(vector)) {
              // Try to convert to array if it's array-like
              vector = Array.from(vector || [])
            }
            return {
            imageId: row.imageId,
            model: row.model,
              vector: vector, // Normalized to array
            image: {
              id: row.id,
              siteId: row.siteId,
              url: row.url,
              category: row.category || 'website',
            },
            similarity: row.similarity, // Pre-computed similarity
            }
          })
          
          if (imageEmbeddings.length === 0) {
            console.warn(`[search] WARNING: pgvector returned 0 images! This might indicate a problem with the query vector or database.`)
          } else {
            // Safety check: Filter out images with wrong category if category filter is active
            if (category && category !== 'all') {
              const beforeFilter = imageEmbeddings.length
              const categoryBreakdown = new Map<string, number>()
              imageEmbeddings.forEach((emb: any) => {
                const imgCategory = emb.image?.category || 'website'
                categoryBreakdown.set(imgCategory, (categoryBreakdown.get(imgCategory) || 0) + 1)
              })
              console.log(`[search] 📊 Category breakdown BEFORE filtering: ${Array.from(categoryBreakdown.entries()).map(([cat, count]) => `${cat}:${count}`).join(', ')}`)
              
              imageEmbeddings = imageEmbeddings.filter((emb: any) => {
                const imgCategory = emb.image?.category || 'website'
                return imgCategory === category
              })
              const afterFilter = imageEmbeddings.length
              if (beforeFilter !== afterFilter) {
                console.warn(`[search] ⚠️  FILTERED OUT ${beforeFilter - afterFilter} images with wrong category! Expected "${category}", but found images from other categories.`)
                console.warn(`[search] This indicates a database issue - images may have incorrect category values.`)
                console.warn(`[search] Removed categories: ${Array.from(categoryBreakdown.entries()).filter(([cat]) => cat !== category).map(([cat, count]) => `${cat}:${count}`).join(', ')}`)
              } else {
                console.log(`[search] ✅ All ${imageEmbeddings.length} images have correct category "${category}"`)
              }
            }
          }
        } else {
          // Fallback to loading all embeddings (old method)
          imageEmbeddings = await (prisma.imageEmbedding.findMany as any)({
            where: {
              image: whereClause,
            },
            select: {
              imageId: true,
              vector: true,
              model: true,
              image: {
                select: {
                  id: true,
                  siteId: true,
                  url: true,
                  category: true,
                },
              },
            },
          })
        }
      } catch (error: any) {
        // If pgvector query fails, fallback to old method
        console.warn(`[search] pgvector query failed, falling back:`, error.message)
        imageEmbeddings = await (prisma.imageEmbedding.findMany as any)({
          where: {
            image: whereClause,
          },
          select: {
            imageId: true,
            vector: true,
            model: true,
            image: {
              select: {
                id: true,
                siteId: true,
                url: true,
                category: true,
              },
            },
          },
        })
      }
      
      // OPTIMIZATION: Use pre-computed similarity if available (pgvector), otherwise compute
      const scoredImages: Array<{
        id: string
        siteId: string | null
        url: string
        category: string
        score: number
        baseScore: number
        embedding: any
      }> = []
      
      // Pre-compute query vector length for optimization
      const queryVecArray = queryVec!
      
      let dimensionMismatchCount = 0
      
      for (let i = 0; i < (imageEmbeddings as any[]).length; i++) {
        const emb = (imageEmbeddings as any[])[i]
        let baseScore: number
        const imageCategory = emb.image.category || 'website'
        
        // If we have vibe extensions, use pgvector similarity (same as direct search)
        // The initial pgvector search already used the vibe extension embedding, so the similarity is correct
        // We should use pgvector similarity to match direct search behavior
        if (hasVibeExtensions) {
          // Use pgvector similarity if available (matches direct search behavior)
          if (emb.similarity !== undefined) {
            baseScore = emb.similarity
          } else {
            // Fallback: recompute with category-specific extension if pgvector similarity not available
            if (vibeExtensionsByCategory[imageCategory] && vibeExtensionsByCategory[imageCategory].length > 0) {
              const categoryExtension = vibeExtensionsByCategory[imageCategory][0]
              const ivec = (emb.vector as unknown as number[]) || []
              if (ivec.length !== dim) {
                dimensionMismatchCount++
                if (dimensionMismatchCount <= 3) {
                  console.warn(`[search] Dimension mismatch: ivec.length=${ivec.length}, dim=${dim}, category=${imageCategory}`)
                }
                continue
              }
              baseScore = Math.round(cosine(categoryExtension, ivec) * 1000000) / 1000000
            } else {
              // No category extension available, use queryVec
              const ivec = (emb.vector as unknown as number[]) || []
              if (ivec.length !== dim) continue
              baseScore = Math.round(cosine(queryVecArray, ivec) * 1000000) / 1000000
            }
          }
        } else if (emb.similarity !== undefined) {
          // If similarity is pre-computed (pgvector) and we're not using vibe extensions, use it
          baseScore = emb.similarity
        } else {
          // Otherwise compute cosine similarity (fallback)
          const ivec = (emb.vector as unknown as number[]) || []
          if (ivec.length !== dim) continue
          
          if (isExpanded && expansionEmbeddings) {
            const expansionScores = expansionEmbeddings.map(expVec => cosine(expVec, ivec))
            if (usePooling === 'max') {
              baseScore = poolMax(expansionScores)
            } else {
              baseScore = poolSoftmax(expansionScores, poolingTemp)
            }
            // Log top scoring expansion for debugging
            if (i < 10) { // Log first 10 for debugging
              const maxScoreIdx = expansionScores.indexOf(Math.max(...expansionScores))
              const maxScore = Math.max(...expansionScores)
              console.log(`[search] Image ${i} (${emb.image?.category || 'unknown'}): score=${baseScore.toFixed(4)}, best expansion #${maxScoreIdx} (${maxScore.toFixed(4)})`)
            }
          } else {
            // Round to ensure deterministic scoring
            baseScore = Math.round(cosine(queryVecArray, ivec) * 1000000) / 1000000
          }
        }
        
        scoredImages.push({
          id: emb.image.id,
          siteId: emb.image.siteId,
          url: emb.image.url,
          category: imageCategory,
          score: baseScore,
          baseScore,
          embedding: { vector: emb.vector, model: emb.model },
        })
      }
      
      // Sort by score (pgvector results are already sorted, but we sort anyway for consistency)
      // Use secondary sort by ID for deterministic ordering when scores are equal
      scoredImages.sort((a, b) => {
        // Use very tight threshold to ensure deterministic ordering
        if (Math.abs(b.baseScore - a.baseScore) > 0.000001) {
          return b.baseScore - a.baseScore
        }
        // Secondary sort by image ID for deterministic ordering
        return (a.id || '').localeCompare(b.id || '')
      })
      
      if (scoredImages.length === 0 && imageEmbeddings.length > 0) {
        console.error(`[search] ERROR: ${imageEmbeddings.length} embeddings loaded but 0 scored!`)
        console.error(`[search] Sample embedding:`, {
          hasVector: !!imageEmbeddings[0]?.vector,
          vectorType: typeof imageEmbeddings[0]?.vector,
          vectorLength: Array.isArray(imageEmbeddings[0]?.vector) ? imageEmbeddings[0]?.vector.length : 'not array',
          imageCategory: imageEmbeddings[0]?.image?.category,
          dim: dim
        })
      }
      const topCandidates = scoredImages // Already limited by pgvector query
      
      // OPTIMIZATION: Load site data in parallel with other queries
      const siteIds = new Set(topCandidates.map(img => img.siteId).filter(Boolean))
      const sitesPromise = siteIds.size > 0 ? (prisma.site.findMany as any)({
        where: { id: { in: Array.from(siteIds) } },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          author: true,
        },
        orderBy: { id: 'asc' }, // Deterministic ordering
      }) : Promise.resolve([])
      const sites = await sitesPromise
      const topCandidatesSiteMap = new Map(sites.map((s: any) => [s.id, s]))
      
      // Build images array with site data for top candidates
      const images = topCandidates.map(img => ({
        ...img,
        site: topCandidatesSiteMap.get(img.siteId || '') || null,
      }))
      
      if (scoredImages.length === 0) {
        console.warn(`[search] WARNING: No images were scored! Check if imageEmbeddings were loaded correctly.`)
      }
      
      // 3. CLIP-FIRST: Rank by cosine similarity (already computed above)
      // Convert scored images to ranked format
      const ranked = images.map((img: any) => ({
        imageId: img.id,
        siteId: img.siteId || '',
        url: img.url,
        siteUrl: img.site?.url || '',
        score: img.score,
        baseScore: img.baseScore,
        site: img.site ? {
          id: img.site.id,
          title: img.site.title,
          description: img.site.description,
          url: img.site.url,
          imageUrl: img.url,
          author: img.site.author,
          tags: [],
          category: img.category || 'website',
        } : null,
      }))
      
      // Ensure ranked is sorted by score (with deterministic secondary sort)
      ranked.sort((a: any, b: any) => {
        // Use very tight threshold to ensure deterministic ordering
        if (Math.abs(b.score - a.score) > 0.000001) {
          return b.score - a.score
        }
        // Secondary sort by image ID for deterministic ordering
        return (a.imageId || '').localeCompare(b.imageId || '')
      })
      
      // OPTIMIZATION: Don't add remaining candidates - we already have enough (TOP_CANDIDATES = 200)
      // This reduces data transfer and processing time
      
      if (debug) {
        // Debug mode: return top results with scores
        return NextResponse.json({
          query: q,
          mode: 'debug',
          pooling: usePooling,
          images: ranked.slice(0, 60).map((r: any) => ({
            imageId: r.imageId,
            siteUrl: r.siteUrl,
            score: r.baseScore,
            contentHash: null,
            model: 'clip-ViT-L/14',
          })),
        })
      }
      
      // LIGHT RERANK: Apply very small tag-based adjustments (only to top K)
      // OPTIMIZATION: Reduce rerank size to speed up queries
      const TOP_K_FOR_RERANK = 100
      const topK = ranked.slice(0, TOP_K_FOR_RERANK)
      const remaining = ranked.slice(TOP_K_FOR_RERANK)
      
      // 1. Find relevant concepts (string match only - simpler and more precise)
      // OPTIMIZATION: Cache concepts in memory to avoid loading on every request
      // Query is already normalized to lowercase
      const queryTokens = q.split(/[\s,]+/).filter(Boolean)
      
      // Cache concepts in global scope (cleared on server restart)
      // Include embeddings and opposites for slider logic
      const globalForConcepts = globalThis as unknown as { concepts?: any[] }
      if (!globalForConcepts.concepts) {
        globalForConcepts.concepts = await prisma.concept.findMany({
          select: {
            id: true,
            label: true,
            embedding: true,
            opposites: true,
          },
        })
      }
      const allConcepts = globalForConcepts.concepts
      
      const relevantConceptIds = new Set<string>()
      for (const concept of allConcepts) {
        const conceptLower = concept.label.toLowerCase()
        const conceptIdLower = concept.id.toLowerCase()
        
        // Exact match (query is already lowercase)
        if (conceptLower === q || conceptIdLower === q) {
          relevantConceptIds.add(concept.id)
        }
        // Token match (only if token is substantial, not single letters)
        else {
          for (const token of queryTokens) {
            if (token.length >= 2 && (conceptLower === token || conceptIdLower === token)) {
              relevantConceptIds.add(concept.id)
              break
            }
          }
        }
      }
      
      // Get opposites for relevant concepts
      const oppositeConceptIds = new Set<string>()
      for (const conceptId of relevantConceptIds) {
        const concept = allConcepts.find((c: any) => c.id === conceptId)
        if (concept?.opposites) {
          const opposites = (concept.opposites as unknown as string[]) || []
          for (const oppId of opposites) {
            oppositeConceptIds.add(oppId)
          }
        }
      }
      
      // OPTIMIZATION: Parallelize all database queries for top K images
      // Sort imageIds to ensure deterministic order for database queries
      const topKImageIds = topK.map((r: any) => r.imageId).sort()
      
      // Load all data in parallel
      const [topKImagesWithHub, popularityMetrics] = await Promise.all([
        // 2. Load hub scores (with error handling)
        (async () => {
          try {
            return await (prisma.image.findMany as any)({
              where: { id: { in: topKImageIds } },
              select: { id: true, hubScore: true, hubCount: true, hubAvgCosineSimilarity: true, hubAvgCosineSimilarityMargin: true },
              orderBy: { id: 'asc' }, // Deterministic ordering
            })
          } catch (error: any) {
            console.warn(`[search] Failed to load hub scores: ${error.message}`)
            return []
          }
        })(),
        // 3. Get popularity metrics (with error handling)
        getImagePopularityMetrics(topKImageIds, 20).catch(() => {
          const emptyMetrics = new Map<string, { showCount: number; clickCount: number; ctr: number }>()
          for (const imageId of topKImageIds) {
            emptyMetrics.set(imageId, { showCount: 0, clickCount: 0, ctr: 0 })
          }
          return emptyMetrics
        }),
      ])
      
      // Build hub scores map
      // IMPORTANT: Sort by imageId to ensure deterministic Map building
      const sortedHubImages = [...topKImagesWithHub].sort((a, b) => (a.id || '').localeCompare(b.id || ''))
      const hubScoresByImage = new Map<string, { hubScore: number | null; hubCount: number | null; hubAvgCosineSimilarity: number | null; hubAvgCosineSimilarityMargin: number | null }>()
      let hubScoreCount = 0
      for (const img of sortedHubImages) {
        const hubScore = img.hubScore ?? null
        const hubCount = img.hubCount ?? null
        const hubAvgCosineSimilarity = img.hubAvgCosineSimilarity ?? null
        const hubAvgCosineSimilarityMargin = img.hubAvgCosineSimilarityMargin ?? null
        if (hubScore !== null) hubScoreCount++
        hubScoresByImage.set(img.id, { hubScore, hubCount, hubAvgCosineSimilarity, hubAvgCosineSimilarityMargin })
      }
      
      // Initialize with null values for images not found (in sorted order for consistency)
      const sortedImageIds = [...topKImageIds].sort()
      for (const imageId of sortedImageIds) {
        if (!hubScoresByImage.has(imageId)) {
          hubScoresByImage.set(imageId, { hubScore: null, hubCount: null, hubAvgCosineSimilarity: null, hubAvgCosineSimilarityMargin: null })
        }
      }
      
      // 4.5. Pre-compute opposite concept embeddings for slider logic (if sliders are set)
      const conceptEmbeddingMap = new Map<string, number[]>()
      let allConceptsForSliders: any[] = []
      let conceptMapForSliders = new Map<string, any>()
      if (Object.keys(sliderPositions).length > 0) {
        const queryTokens = q.split(/[\s,]+/).filter(Boolean)
        // Use cached concepts (already loaded above)
        allConceptsForSliders = allConcepts as any[]
        conceptMapForSliders = new Map(allConceptsForSliders.map((c: any) => [c.label.toLowerCase(), c]))
        
        for (const token of queryTokens) {
          // Try to find slider position by token (exact match) or by concept label/id
          let sliderPos = sliderPositions[token]
          if (sliderPos === undefined) {
            // Try to find by concept label (case-insensitive)
            const concept = conceptMapForSliders.get(token.toLowerCase())
            if (concept) {
              sliderPos = sliderPositions[concept.label] || 
                         sliderPositions[concept.label.toLowerCase()] ||
                         sliderPositions[concept.id] ||
                         sliderPositions[concept.id.toLowerCase()]
            }
          }
          
          // Also try direct lookup by lowercase token
          if (sliderPos === undefined) {
            sliderPos = sliderPositions[token.toLowerCase()]
          }
          
          // Try normalized matching (remove whitespace)
          if (sliderPos === undefined) {
            for (const [key, pos] of Object.entries(sliderPositions)) {
              if (key.toLowerCase().replace(/\s+/g, '') === token.toLowerCase().replace(/\s+/g, '')) {
                sliderPos = pos
                break
              }
            }
          }
          
          if (sliderPos === undefined || sliderPos >= 0.5) continue
          
          const concept = conceptMapForSliders.get(token.toLowerCase())
          if (!concept) continue
          
          const opposites = (concept.opposites as unknown as string[]) || []
          if (opposites.length > 0) {
            const firstOppositeId = opposites[0].toLowerCase()
            const oppositeConcept = allConceptsForSliders.find((c: any) => c.id.toLowerCase() === firstOppositeId)
            if (oppositeConcept) {
              const oppositeEmbedding = (oppositeConcept.embedding as unknown as number[]) || []
              if (oppositeEmbedding.length > 0 && oppositeEmbedding.length === dim) {
                // Store with multiple keys to ensure we can find it later
                conceptEmbeddingMap.set(token.toLowerCase(), oppositeEmbedding)
                conceptEmbeddingMap.set(concept.label.toLowerCase(), oppositeEmbedding)
                conceptEmbeddingMap.set(concept.id.toLowerCase(), oppositeEmbedding)
              }
            }
          }
        }
      }
      
      // 5. Apply very light boosts/penalties (tag-based) + slider adjustments
      console.log(`\n📊 [search] RERANKING:`)
      console.log(`   Candidates to rerank: ${imageEmbeddings.length}`)
      console.log(`   Top K for rerank: ${topK.length}`)
      console.log(`   Using ${isExpanded && expansionEmbeddings ? expansionEmbeddings.length + ' expansion embeddings' : 'single query vector'} for scoring`)
      console.log(`   Pooling method: ${usePooling}`)
      perf.start('api.search.GET.zeroShot.rerank', { topKCount: topK.length })
      
      // IMPORTANT: Sort topK deterministically by score (with imageId as tiebreaker) BEFORE processing
      // This ensures that items are processed in a consistent order, preventing non-deterministic calculations
      perf.start('api.search.GET.zeroShot.rerank.sort')
      const sortedTopK = perf.measureSync('api.search.GET.zeroShot.rerank.sort.topK', () => {
        return [...topK].sort((a: any, b: any) => {
          // Primary sort by score (descending)
          const scoreA = a.score ?? a.baseScore ?? 0
          const scoreB = b.score ?? b.baseScore ?? 0
          if (Math.abs(scoreB - scoreA) > 0.000001) {
            return scoreB - scoreA
          }
          // Secondary sort by imageId for deterministic ordering
          const idA = a.imageId || a.id || ''
          const idB = b.imageId || b.id || ''
          return idA.localeCompare(idB)
        })
      })
      perf.end('api.search.GET.zeroShot.rerank.sort')
      
      perf.start('api.search.GET.zeroShot.rerank.calculateScores')
      const reranked = perf.measureSync('api.search.GET.zeroShot.rerank.calculateScores.map', () => {
        return sortedTopK.map((item: any) => {
        let boost = 0
        let penalty = 0
        
        // Apply popularity/ubiquity penalty (hub effect)
        // Penalize images that appear frequently but are rarely clicked
        const metrics = popularityMetrics.get(item.imageId)
        let popularityPenalty = 0
        if (metrics) {
          const { showCount, clickCount, ctr } = metrics
          
          // Only penalize if:
          // - Image has been shown at least 5 times (frequently shown)
          // - CTR is below 0.1 (10% - rarely clicked)
          // Penalty scales with showCount and inverse of CTR
          if (showCount >= 5 && ctr < 0.1) {
            // Penalty formula: (showCount / 100) * (0.1 - ctr) * 0.1
            // This gives a small penalty that scales with ubiquity and low CTR
            // Round intermediate calculations to ensure deterministic results
            const ubiquityFactor = Math.min(showCount / 100, 1.0) // Cap at 1.0
            const lowCtrFactor = (0.1 - ctr) / 0.1 // 0 to 1, higher for lower CTR
            popularityPenalty = Math.round((ubiquityFactor * lowCtrFactor * 0.1) * 1000000) / 1000000 // Max penalty of 0.1, rounded
          }
        }
        
        // 6. Apply hub score penalty (from detect_hub_images.ts)
        // Penalty directly affects the cosine similarity score (baseScore)
        // This ensures images with high semantic similarity can still rank well even if they're hubs
        let hubPenaltyMultiplier = 1.0 // Multiplier applied to baseScore (1.0 = no penalty)
        const hubData = hubScoresByImage.get(item.imageId)
        if (hubData?.hubScore !== null && hubData?.hubScore !== undefined) {
          const hubScore = hubData.hubScore
          const avgCosineSimilarityMargin = hubData.hubAvgCosineSimilarityMargin ?? 0
          
          // Penalize if hub score is high (appears in many queries)
          // Goal: Drop hubs by as many positions as they gained from being hubs
          if (hubScore > 0.05) {
            // Base penalty from margin: how much higher this hub is compared to query averages
            // Lightened penalty to reduce hub advantage without over-penalizing
            const marginPenaltyFactor = 4.8 // Reduced from 5.0
            const marginPenalty = Math.max(0, avgCosineSimilarityMargin * marginPenaltyFactor)
            
            // Frequency penalty: more frequently appearing hubs get heavier penalty
            // Lightened penalty to reduce frequency advantage
            // For hubScore = 0.5 (appears in 50% of queries), frequency penalty = 0.5 * 0.09 = 0.045
            // For hubScore = 0.98 (appears in 98% of queries), frequency penalty = 0.98 * 0.09 = 0.088
            const frequencyPenaltyFactor = 0.09 // Reduced from 0.10
            
            // Reduce frequency penalty when margin is negative (performing below average)
            // If margin is negative, reduce frequency penalty by 50% (multiply by 0.5)
            // This still penalizes over-exposure but less aggressively when the image isn't actually superior
            const frequencyPenaltyMultiplier = avgCosineSimilarityMargin < 0 ? 0.5 : 1.0
            const frequencyPenalty = hubScore * frequencyPenaltyFactor * frequencyPenaltyMultiplier
            
            // Combined absolute penalty: margin penalty + frequency penalty
            const absolutePenalty = marginPenalty + frequencyPenalty
            
            // Convert absolute penalty to percentage of baseScore
            // This ensures high semantic similarity (high baseScore) can still rank well
            // Example: baseScore=0.25, absolutePenalty=0.04 → penaltyPct=0.04/0.25=0.16 (16% reduction)
            //          baseScore=0.15, absolutePenalty=0.04 → penaltyPct=0.04/0.15=0.27 (27% reduction, capped at 20%)
            const penaltyPercentage = item.baseScore > 0 ? Math.min(absolutePenalty / item.baseScore, 0.2) : 0 // Keep cap at 20%
            
            // Apply as multiplier: 1.0 = no penalty, 0.8 = 20% penalty
            hubPenaltyMultiplier = 1.0 - penaltyPercentage
            
            // Ensure multiplier doesn't go below 0.5 (max 50% reduction)
            hubPenaltyMultiplier = Math.max(0.5, hubPenaltyMultiplier)
          }
        }
        
        // Apply hub penalty directly to baseScore (cosine similarity)
        // This ensures high semantic similarity can still rank well
        // IMPORTANT: When using vibe extensions, similarity is the primary signal, so reduce hub penalty impact
        // Round intermediate values to ensure deterministic calculations
        let adjustedBaseScore: number
        if (hasVibeExtensions) {
          // For vibe extensions, reduce hub penalty impact (apply 50% of penalty) to preserve similarity ranking
          const reducedHubPenaltyMultiplier = hubPenaltyMultiplier < 1.0 ? 
            Math.max(0.95, 1.0 - ((1.0 - hubPenaltyMultiplier) * 0.5)) : 1.0
          adjustedBaseScore = Math.round((item.baseScore * reducedHubPenaltyMultiplier) * 1000000) / 1000000
        } else {
          adjustedBaseScore = Math.round((item.baseScore * hubPenaltyMultiplier) * 1000000) / 1000000
        }
        
        // Calculate base final score
        // IMPORTANT: When using vibe extensions, baseScore is the similarity to the category-specific extension
        // This should be the PRIMARY ranking factor. Penalties should be minimal to preserve similarity-based ranking.
        // For vibe extensions, reduce or disable popularity penalty to ensure similarity is the dominant factor
        let finalScore: number
        if (hasVibeExtensions) {
          // When using vibe extensions, similarity to the category extension is the primary signal
          // Apply minimal penalties (10% of normal) to preserve similarity ranking
          const reducedPopularityPenalty = popularityPenalty * 0.1
          finalScore = Math.round((adjustedBaseScore + boost - penalty - reducedPopularityPenalty) * 1000000) / 1000000
        } else {
          // For non-vibe extensions, use full penalty (original behavior)
          finalScore = Math.round((adjustedBaseScore + boost - penalty - popularityPenalty) * 1000000) / 1000000
        }
        
        // Apply slider-based ranking logic if sliders are set
        if (Object.keys(sliderPositions).length > 0 && allConceptsForSliders.length > 0) {
          const queryTokens = q.split(/[\s,]+/).filter(Boolean)
          
          const img = images.find((img: any) => img.id === item.imageId) as any
          if (img) {
            const ivec = (img.embedding?.vector as unknown as number[]) || []
            if (ivec.length === dim) {
              for (const token of queryTokens) {
                // Try to find slider position by token (exact match) or by concept label/id
                let sliderPos = sliderPositions[token]
                if (sliderPos === undefined) {
                  // Try to find by concept label (case-insensitive)
                  const concept = conceptMapForSliders.get(token.toLowerCase())
                  if (concept) {
                    // Try exact label match first, then case-insensitive
                    sliderPos = sliderPositions[concept.label] || 
                               sliderPositions[concept.label.toLowerCase()] ||
                               sliderPositions[concept.id] ||
                               sliderPositions[concept.id.toLowerCase()]
                  }
                }
                
                // Also try direct lookup by lowercase token
                if (sliderPos === undefined) {
                  sliderPos = sliderPositions[token.toLowerCase()]
                }
                
                if (sliderPos === undefined) {
                  // Try one more time with normalized matching
                  for (const [key, pos] of Object.entries(sliderPositions)) {
                    if (key.toLowerCase() === token.toLowerCase() || 
                        key.toLowerCase().replace(/\s+/g, '') === token.toLowerCase().replace(/\s+/g, '')) {
                      sliderPos = pos
                      break
                    }
                  }
                }
                
                if (sliderPos === undefined) {
                  // Silently skip if no match found (might be a custom concept)
                  continue
                }
                
                const concept = conceptMapForSliders.get(token.toLowerCase())
                if (!concept) continue
                
                if (sliderPos > 0.5) {
                  // Slider between 0.51 and 1.0: Towards Concept A
                  // At 1.0: Normal ranking (best Concept A matches first)
                  // At 0.51: Reverse ranking (worst Concept A matches first)
                  const reverseFactor = (1.0 - sliderPos) * 2 // 0 at 1.0, 0.98 at 0.51
                  
                  // For reverse: invert the score - make lower scores rank higher
                  const scoreRange = 0.5 // Assume scores are roughly in range 0-0.5
                  const invertedScore = scoreRange - finalScore
                  
                  // Blend: at 1.0 use normal, at 0.51 use fully inverted
                  // Round to ensure deterministic calculations
                  finalScore = Math.round((finalScore * (1 - reverseFactor) + invertedScore * reverseFactor) * 1000000) / 1000000
                } else if (sliderPos < 0.5) {
                  // Slider between 0 and 0.49: Towards opposite
                  // At 0.0: Normal ranking for opposite (best opposite matches first)
                  // At 0.49: Reverse ranking for opposite (worst opposite matches first)
                  const opposites = (concept.opposites as unknown as string[]) || []
                  if (opposites.length > 0) {
                    // Interpolate between opposite (0.0) and middle (0.5)
                    const oppositeFactor = (0.5 - sliderPos) * 2 // 1.0 at 0.0, 0.02 at 0.49
                    
                    // Try multiple keys to find opposite embedding
                    let oppositeEmbedding = conceptEmbeddingMap.get(token.toLowerCase())
                    if (!oppositeEmbedding) {
                      oppositeEmbedding = conceptEmbeddingMap.get(concept.label.toLowerCase())
                    }
                    if (!oppositeEmbedding) {
                      oppositeEmbedding = conceptEmbeddingMap.get(concept.id.toLowerCase())
                    }
                    
                    if (oppositeEmbedding && oppositeEmbedding.length === dim) {
                      const oppositeSimilarity = cosine(oppositeEmbedding, ivec)
                      
                      // At 0.0: Use 100% opposite similarity (normal ranking for opposite)
                      // At 0.49: Use mostly opposite similarity but reverse it
                      // Calculate reverse factor for opposite: at 0.49, we want reverse
                      const oppositeReverseFactor = (0.5 - sliderPos) * 2 // 1.0 at 0.0, 0.02 at 0.49
                      // But we want reverse at 0.49, so: reverseFactor = 1.0 - oppositeReverseFactor when sliderPos is near 0.5
                      // Actually, let's think: at 0.0 we want normal opposite, at 0.49 we want reverse opposite
                      // So: at 0.0: use oppositeSimilarity as-is
                      //     at 0.49: invert oppositeSimilarity
                      const oppositeScoreRange = 0.5
                      const invertedOppositeScore = oppositeScoreRange - oppositeSimilarity
                      
                      // At 0.0: Use oppositeSimilarity directly (normal opposite ranking)
                      // At 0.49: Use inverted oppositeSimilarity (reverse opposite ranking)
                      // reverseFactor = sliderPos / 0.5 gives:
                      // - At 0.0: 0 (normal)
                      // - At 0.49: 0.98 (reverse) - this is what we want!
                      const reverseOppositeFactor = sliderPos / 0.5 // 0 at 0.0, 0.98 at 0.49
                      const blendedOppositeScore = oppositeSimilarity * (1 - reverseOppositeFactor) + invertedOppositeScore * reverseOppositeFactor
                      
                      // Now blend between original score and the opposite score
                      // At 0.0: Use 100% opposite score (normal opposite ranking)
                      // At 0.49: Use mostly opposite score (but reversed)
                      // Round to ensure deterministic calculations
                      finalScore = Math.round((finalScore * (1 - oppositeFactor) + blendedOppositeScore * oppositeFactor) * 1000000) / 1000000
                    }
                  }
                }
                // At exactly 0.5: No change (middle point)
              }
            }
          }
        }
        
        // Round finalScore to 4 decimal places to ensure deterministic ordering
        // This groups items with very similar scores together while maintaining more precision
        const roundedFinalScore = Math.round(finalScore * 10000) / 10000
        
        return {
          ...item,
          score: roundedFinalScore, // Rounded to 3 decimal places for deterministic ordering
          baseScore: item.baseScore, // Original cosine similarity
          adjustedBaseScore, // Cosine similarity after hub penalty multiplier
          boost,
          penalty,
          popularityPenalty,
          hubPenaltyMultiplier, // Multiplier applied to baseScore
          popularityMetrics: metrics || { showCount: 0, clickCount: 0, ctr: 0 },
          hubScore: hubData?.hubScore || null,
          hubCount: hubData?.hubCount || null,
        }
        })
      })
      perf.end('api.search.GET.zeroShot.rerank.calculateScores', { rerankedCount: reranked.length })
      
      // Rerank by finalScore (with deterministic secondary sort for consistent rankings)
      perf.start('api.search.GET.zeroShot.rerank.finalSort')
      // IMPORTANT: Always use imageId as tiebreaker to ensure completely deterministic ordering
      // This prevents any floating-point precision differences from causing non-deterministic results
      perf.measureSync('api.search.GET.zeroShot.rerank.finalSort.sort', () => {
        reranked.sort((a: any, b: any) => {
        // Round scores to 4 decimal places to eliminate floating-point precision differences
        const scoreA = Math.round((a.score ?? 0) * 10000) / 10000
        const scoreB = Math.round((b.score ?? 0) * 10000) / 10000
        
        // Primary sort by rounded score (descending)
        const scoreDiff = scoreB - scoreA
        // Use a threshold to group items with very similar scores
        // Items with scores within 0.0001 will be sorted by imageId for deterministic ordering
        if (Math.abs(scoreDiff) > 0.0001) {
          return scoreDiff
        }
        // Always use secondary sort by image ID for deterministic ordering
        // This ensures consistent results even when rounded scores are very close
        const idA = a.imageId || a.id || ''
        const idB = b.imageId || b.id || ''
        return idA.localeCompare(idB)
        })
      })
      perf.end('api.search.GET.zeroShot.rerank.finalSort')
      
      // Also sort remaining results deterministically (by baseScore, then imageId)
      perf.start('api.search.GET.zeroShot.rerank.sortRemaining')
      perf.measureSync('api.search.GET.zeroShot.rerank.sortRemaining.sort', () => {
        remaining.sort((a: any, b: any) => {
        // Use extremely tight threshold to catch all floating-point differences
        if (Math.abs(b.baseScore - a.baseScore) > 1e-10) {
          return b.baseScore - a.baseScore
        }
        // Always use secondary sort by image ID for deterministic ordering
        return (a.imageId || '').localeCompare(b.imageId || '')
        })
      })
      perf.end('api.search.GET.zeroShot.rerank.sortRemaining')
      
      // Combine reranked top K with remaining results
      perf.start('api.search.GET.zeroShot.combineResults')
      // Ensure finalRanked is sorted deterministically
      // Note: reranked items have 'score' (finalScore), remaining items have 'baseScore'
      const finalRanked = perf.measureSync('api.search.GET.zeroShot.combineResults.sort', () => {
        return [...reranked, ...remaining].sort((a: any, b: any) => {
        // Use score if available (reranked items), otherwise use baseScore (remaining items)
        // Round scores to 4 decimal places to eliminate floating-point precision differences
        const scoreA = Math.round((a.score ?? a.baseScore ?? 0) * 10000) / 10000
        const scoreB = Math.round((b.score ?? b.baseScore ?? 0) * 10000) / 10000
        
        // Primary sort by rounded score
        if (scoreB !== scoreA) {
          return scoreB - scoreA
        }
        // Always use secondary sort by imageId for deterministic ordering
        return (a.imageId || '').localeCompare(b.imageId || '')
        })
      })
      perf.end('api.search.GET.zeroShot.combineResults', { finalRankedCount: finalRanked.length })
      perf.end('api.search.GET.zeroShot.rerank')
      
      // Log search impressions for learned reranker training
      // Only log top 20 results to avoid excessive logging
      const topResultsForLogging = finalRanked.slice(0, 20)
      const impressions: SearchImpression[] = topResultsForLogging.map((item: any, index: number) => {
        const position = index + 1
        
        // No tag features (image tags removed from this build)
        
        // Get hub features for this image
        const hubData = hubScoresByImage.get(item.imageId)
        const hubCount = hubData?.hubCount ?? null
        const hubScore = hubData?.hubScore ?? null
        
        // Compute transformed hub features for learned reranker
        const logHubCount = hubCount !== null ? Math.log(1 + hubCount) : undefined
        const normalizedHubScore = hubScore !== null ? Math.min(hubScore, 1.0) : undefined // Already 0-1, but ensure cap
        
        return {
          query: q,
          queryEmbedding: queryVec,
          imageId: item.imageId,
          position,
          baseScore: item.baseScore,
          tagFeatures: {
            cosineSimilarity: item.baseScore,
            cosineSimilaritySquared: item.baseScore * item.baseScore,
            // Tag features removed (image tags not used in this build)
            maxTagScore: 0,
            sumTagScores: 0,
            directMatchCount: 0,
            synonymMatchCount: 0,
            relatedMatchCount: 0,
            maxOppositeTagScore: 0,
            sumOppositeTagScores: 0,
          },
          popularityFeatures: item.popularityMetrics || {
            showCount: 0,
            clickCount: 0,
            ctr: 0,
          },
          hubFeatures: {
            hubCount,
            hubScore,
            logHubCount,
            normalizedHubScore,
          },
        }
      })
      
      // Log impressions asynchronously (don't block response)
      logSearchImpressions(impressions).catch((error) => {
        console.error(`[search] Failed to log impressions:`, error.message)
      })
      
      // Deduplicate sites by ID (keep best match per site)
      const siteMap = new Map<string, { site: any; score: number }>()
      for (const r of finalRanked) {
        // Skip if site is null (remaining candidates without site data)
        if (!r.site || !r.site.id) continue
        const siteId = r.site.id
        const existing = siteMap.get(siteId)
        if (!existing || r.score > existing.score) {
          siteMap.set(siteId, { site: { ...r.site, score: r.score }, score: r.score })
        }
      }
      // Sort by score (descending) to maintain ranking
      // Use secondary sort by site ID for deterministic ordering when scores are equal
      const uniqueSites = Array.from(siteMap.values())
        .sort((a: any, b: any) => {
          // Use very tight threshold to ensure deterministic ordering
          if (Math.abs(b.score - a.score) > 0.000001) {
            return b.score - a.score
          }
          // Secondary sort by site ID for deterministic ordering
          return (a.site?.id || '').localeCompare(b.site?.id || '')
        })
        .map((item: any) => item.site)
      
      // OPTIMIZATION: Return only top results (pagination will be added later)
      // Limit results to improve response time and reduce data transfer
      const MAX_RESULTS = 100 // Return top 100 results initially
      
      // Log first 5 images from finalRanked before limiting
      if (finalRanked.length > 0) {
        const first5 = finalRanked.slice(0, 5).map((r: any) => ({
          imageId: r.imageId?.substring(0, 12) || 'unknown',
          score: (r.score ?? r.baseScore ?? 0).toFixed(6),
          siteId: r.site?.id?.substring(0, 12) || 'unknown'
        }))
      }
      
      const limitedSites = uniqueSites.slice(0, MAX_RESULTS)
      const limitedImages = finalRanked.slice(0, MAX_RESULTS)
      
      // Log comprehensive results summary
      console.log(`\n📊 [search] FINAL RESULTS SUMMARY:`)
      console.log(`   Query: "${q}"`)
      console.log(`   Category: "${category || 'null'}"`)
      console.log(`   Total candidates: ${finalRanked.length}`)
      console.log(`   Unique sites: ${uniqueSites.length}`)
      console.log(`   Returning: ${limitedSites.length} sites, ${limitedImages.length} images`)
      if (limitedImages.length > 0) {
        console.log(`   Top 5 scores: ${limitedImages.slice(0, 5).map((r: any) => (r.score ?? r.baseScore ?? 0).toFixed(4)).join(', ')}`)
        console.log(`   Top 5 categories: ${limitedImages.slice(0, 5).map((r: any) => r.site?.category || 'unknown').join(', ')}`)
        console.log(`   Top 5 titles: ${limitedImages.slice(0, 5).map((r: any) => (r.site?.title || 'Untitled').substring(0, 30)).join(', ')}`)
      }
      console.log(`\n`)
      
      perf.start('api.search.GET.zeroShot.serializeResponse')
      const results = { 
        query: q, 
        sites: limitedSites,
        images: limitedImages,
        total: finalRanked.length, // Include total for pagination
        _performance: perf.getSummary(), // Include performance data
      }
      perf.end('api.search.GET.zeroShot.serializeResponse', { 
        responseSize: JSON.stringify(results).length,
        sitesCount: limitedSites.length,
        imagesCount: limitedImages.length,
      })
      
      // Cache results (skip for debug mode)
      if (!debug && q) {
        perf.start('api.search.GET.zeroShot.cacheResults')
        cacheSearchResults(q, category, 100, 0, results)
        perf.end('api.search.GET.zeroShot.cacheResults')
      }
      
      perf.end('api.search.GET.zeroShot')
      perf.end('api.search.GET', { totalDuration: perf.getMetrics().reduce((sum, m) => sum + m.duration, 0) })
      
      // Log performance report
      console.log('\n' + perf.getReport())
      
      return NextResponse.json(results)
    }

    // If zeroShot is false, return empty results (legacy path removed)
    // The zero-shot path is the only supported search method
    return NextResponse.json({ 
      query: q,
      images: [],
      sites: [],
      total: 0,
      _performance: perf.getSummary(),
      _message: 'Zero-shot search is required. Set ZERO_SHOT=false is no longer supported.'
    })
  } catch (e: any) {
    console.error(`[search] ERROR in search API:`, e)
    console.error(`[search] Error stack:`, e?.stack)
    const errorQuery = request.url ? new URL(request.url).searchParams.get('q') || '' : ''
    return NextResponse.json({ 
      error: String(e?.message || e),
      images: [],
      query: errorQuery
    }, { status: 500 })
  }
}


