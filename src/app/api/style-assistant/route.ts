import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const maxDuration = 30 // 30 seconds for LLM calls

// Get Groq client (using same setup as search route)
function getGroqClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required. Please set it in your environment variables.')
  }
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1'
  })
}

// Available categories
const CATEGORIES = ['all', 'website', 'packaging', 'brand', 'graphic', 'logo']

// Available actions the LLM can trigger
interface GalleryAction {
  type: 'search' | 'filter' | 'sort' | 'add_concept' | 'clear' | 'change_category'
  query?: string // Search query
  mainConcept?: string // Main concept/theme (from first query or identified theme)
  additions?: string[] // Additional refinements (e.g., "3d models" when main is "techy")
  category?: string // Category filter
  concepts?: string[] // Concepts to add/remove
  sortBy?: 'relevance' | 'recent' | 'popular' // Sorting option
  message?: string // Response message to show user
}

export async function POST(request: NextRequest) {
  try {
    console.log('[style-assistant] POST request received')
    const body = await request.json()
    console.log('[style-assistant] Request body:', { 
      message: body.message,
      hasHistory: !!body.conversationHistory,
      currentCategory: body.currentCategory,
      currentQuery: body.currentQuery,
      currentConcepts: body.currentConcepts
    })

    const { message, conversationHistory, currentCategory, currentQuery, currentConcepts } = body

    if (!message || typeof message !== 'string') {
      console.error('[style-assistant] Invalid message:', message)
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('[style-assistant] Getting Groq client...')
    const groq = getGroqClient()
    console.log('[style-assistant] Groq client created successfully')

    // Build context about current gallery state
    const currentState = `
Current gallery state:
- Category: ${currentCategory || 'all'}
- Search query: ${currentQuery || 'none'} ${currentQuery ? '(BUILD ON THIS if user is refining)' : ''}
- Active concepts/filters: ${currentConcepts?.length ? currentConcepts.join(', ') : 'none'}
`

    // Build conversation history context
    const historyContext = conversationHistory && conversationHistory.length > 0
      ? `\nPrevious conversation:\n${conversationHistory.slice(-5).map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')}`
      : ''

    const systemPrompt = `You are a helpful design assistant for a visual design gallery. Users can search, filter, and sort designs.

Available categories: ${CATEGORIES.join(', ')}

You can help users by:
1. Searching for designs: "show me playful designs", "find logos with arrows"
2. Filtering by category: "show only websites", "filter to packaging", "find romantic websites", "show me logo designs"
3. Adding style filters: "add playful filter", "make it more minimal", "also add vintage"
4. Sorting: "sort by most recent", "show popular designs"
5. Combining actions: "show me playful website designs", "find romantic websites", "show me logo designs with arrows"
6. Refining searches: "make them more minimal", "add vintage to that", "also include retro"

IMPORTANT: When users mention a category in their request (like "websites", "website", "logos", "logo", "packaging", "brand", "graphic"), you MUST include the category in your response. Extract the category from phrases like:
- "find romantic websites" → category: "website"
- "show me logo designs" → category: "logo"
- "packaging designs" → category: "packaging"
- "brand identity" → category: "brand"
- "graphic design" → category: "graphic"

CRITICAL - ITERATIVE QUERIES: Build on previous context! If the user has already searched for something, combine new requests with the existing query:
- If current query is "playful" and user says "make it more minimal" → query: "playful minimal"
- If current query is "romantic" and user says "add vintage" → query: "romantic vintage"
- If current query is "playful minimal" and user says "also retro" → query: "playful minimal retro"
- If current query is "medical" and user says "only white websites" → query: "medical white" (COMBINE! Keep "medical" and add "white")
- If current query is "medical" and user says "only white" → query: "medical white" (COMBINE! Keep "medical" and add "white")
- If current query is "medical" and user says "just white" → query: "medical white" (COMBINE!)
- Keywords like "only", "just", "filter to", "show only", "make it", "add" mean the user wants to NARROW DOWN the current results by ADDING more criteria
- ALWAYS include the previous query terms when the user is refining! Never replace unless explicitly asked
- Only replace the query if the user explicitly starts a new search (e.g., "show me something else", "new search for...", "forget that, show me...")

When the user makes a request, respond with ONLY a JSON object in this exact format:
{
  "type": "search" | "filter" | "sort" | "add_concept" | "clear" | "change_category",
  "query": "search query text (if type is search) - COMBINE with existing query if refining",
  "mainConcept": "main theme/concept (e.g., 'techy', 'playful', 'medical') - identify the PRIMARY theme the user is after",
  "additions": ["addition1", "addition2"] (if refining - e.g., ["3d models"] when main is "techy"),
  "category": "category name (if changing category)",
  "concepts": ["concept1", "concept2"] (if adding concepts/filters),
  "sortBy": "relevance" | "recent" | "popular" (if sorting),
  "message": "A brief, friendly response to the user explaining what you're doing"
}

IMPORTANT - MAIN CONCEPT IDENTIFICATION:
- For first queries: Extract the main theme (e.g., "techy", "playful", "medical", "romantic")
- For refinements: Keep the main concept from the previous query, identify new additions
- Example: User says "techy" → mainConcept: "techy", additions: []
- Example: User says "with 3d models" (when current is "techy") → mainConcept: "techy", additions: ["3d models"]
- The mainConcept should be the PRIMARY theme/style the user is searching for

Examples:
User: "Show me playful designs"
Response: {"type": "search", "query": "playful", "message": "Searching for playful designs..."}

User: "Filter to only show websites"
Response: {"type": "change_category", "category": "website", "message": "Filtering to show only website designs..."}

User: "Add a minimal filter"
Response: {"type": "add_concept", "concepts": ["minimal"], "message": "Adding minimal style filter..."}

User: "Show me recent playful website designs"
Response: {"type": "search", "query": "playful", "category": "website", "message": "Searching for recent playful website designs..."}

User: "find romantic websites"
Response: {"type": "search", "query": "romantic", "category": "website", "message": "Searching for romantic website designs..."}

User: "show me logo designs"
Response: {"type": "search", "query": "", "category": "logo", "message": "Showing logo designs..."}

User: "make it more minimal" (when current query is "playful")
Response: {"type": "search", "query": "playful minimal", "message": "Refining search to playful minimal designs..."}

User: "add vintage to that" (when current query is "romantic")
Response: {"type": "search", "query": "romantic vintage", "message": "Adding vintage to your romantic search..."}

User: "also include retro" (when current query is "playful minimal")
Response: {"type": "search", "query": "playful minimal retro", "message": "Adding retro to your playful minimal search..."}

User: "only white websites" (when current query is "medical")
Response: {"type": "search", "query": "medical white", "message": "Filtering to only white medical websites..."}

User: "only white" (when current query is "medical")
Response: {"type": "search", "query": "medical white", "message": "Filtering to only white medical designs..."}

User: "Clear everything"
Response: {"type": "clear", "message": "Clearing all filters and searches..."}

IMPORTANT: Return ONLY the JSON object, no other text or explanation.`

    const userPrompt = `${currentState}${historyContext}

User request: ${message}

Respond with the JSON action object:`

    console.log('[style-assistant] Calling Groq API with prompt:', userPrompt.substring(0, 200))

    let completion
    try {
      completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
      console.log('[style-assistant] Groq API call successful')
    } catch (groqError: any) {
      console.error('[style-assistant] Groq API error:', groqError)
      throw new Error(`Groq API error: ${groqError.message || 'Unknown error'}`)
    }

    const responseText = completion.choices[0]?.message?.content || '{}'
    console.log('[style-assistant] Groq response:', responseText)

    let action: GalleryAction
    try {
      // Try to parse the response directly
      action = JSON.parse(responseText)
    } catch (error) {
      console.error('[style-assistant] Failed to parse JSON response:', error)
      // Fallback: try to extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          action = JSON.parse(jsonMatch[0])
        } catch (parseError) {
          console.error('[style-assistant] Failed to parse extracted JSON:', parseError)
          // Last resort: create a search action from the user's message
          action = {
            type: 'search',
            query: message,
            message: `Searching for "${message}"...`
          }
        }
      } else {
        // Last resort: create a search action from the user's message
        action = {
          type: 'search',
          query: message,
          message: `Searching for "${message}"...`
        }
      }
    }

    // Validate action
    if (!action.type) {
      action = {
        type: 'search',
        query: message,
        message: `Searching for "${message}"...`
      }
    }

    // Add assistant response message
    const assistantMessage = action.message || `I'll help you with that.`

    return NextResponse.json({
      action,
      message: assistantMessage
    })

  } catch (error: any) {
    console.error('[style-assistant] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: error.message || 'An error occurred while processing your request.'
      },
      { status: 500 }
    )
  }
}

