import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()

// Initialize OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
    openaiClient = new OpenAI({
      apiKey,
    })
  }
  return openaiClient
}

interface Concept {
  id: string
  label: string
  opposites: string[] | null
  related: string[] | null
  synonyms: string[] | null
}

async function generateRelationships(
  concept: Concept, 
  allConcepts: Map<string, Concept>,
  labelToIdMap: Map<string, string>
): Promise<{
  opposites: string[]
}> {
  const client = getOpenAIClient()
  
  // Build a list of existing concept labels for reference (limit to avoid token limits)
  const existingConcepts = Array.from(allConcepts.values())
    .slice(0, 300)
    .map(c => `"${c.label}" (id: ${c.id})`)
    .join(', ')

  const prompt = `You are helping to build a design concept taxonomy. For the concept "${concept.label}" (id: ${concept.id}), generate OPPOSITES: 1-3 design concepts that are the visual/design opposite.

Examples:
- "Minimal" opposite "Maximal"
- "Dark" opposite "Light"
- "Serious" opposite "Playful"
- "Chaotic" opposite "Ordered"
- "Rough" opposite "Smooth"

IMPORTANT:
- You MUST use the exact concept ID from this list: ${existingConcepts}
- If you can't find a good match in the list, you can suggest a new concept label, but prefer existing ones
- Return ONLY valid JSON in this exact format:
{
  "opposites": ["concept-id-1", "concept-id-2"]
}

- Use the EXACT concept ID from the list above (the part after "id: ")
- If the concept doesn't have a clear opposite, return an empty array

Concept: "${concept.label}" (id: ${concept.id})
Context: This is a design concept used for visual search and tagging of websites, packaging, and brand designs.`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a design taxonomy expert. Return only valid JSON, no explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const text = response.choices[0]?.message?.content
    if (!text) {
      throw new Error('Empty response from Groq')
    }

    const parsed = JSON.parse(text)
    
    // Validate and normalize the response
    const opposites = Array.isArray(parsed.opposites) 
      ? parsed.opposites.map((id: string) => id.toLowerCase().trim())
      : []

    return { opposites }
  } catch (error: any) {
    console.error(`Error generating relationships for "${concept.label}":`, error.message)
    return { opposites: [] }
  }
}

async function main() {
  console.log('Generating concept relationships...\n')

  // Fetch all concepts
  const concepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      opposites: true,
      related: true,
      synonyms: true,
    },
  })

  console.log(`Found ${concepts.length} total concepts\n`)

  // Build concept map and label-to-ID mapping
  const conceptMap = new Map<string, Concept>()
  const labelToIdMap = new Map<string, string>()
  
  for (const concept of concepts) {
    conceptMap.set(concept.id, {
      id: concept.id,
      label: concept.label,
      opposites: (concept.opposites as string[] | null) || [],
      related: (concept.related as string[] | null) || [],
      synonyms: (concept.synonyms as string[] | null) || [],
    })
    // Map label (case-insensitive) to ID
    labelToIdMap.set(concept.label.toLowerCase(), concept.id)
    // Also map ID to itself (in case LLM returns IDs)
    labelToIdMap.set(concept.id.toLowerCase(), concept.id)
  }

  // Find concepts that need opposites only
  const needsOpposites = concepts.filter(
    c => !c.opposites || (c.opposites as string[]).length === 0
  )

  console.log(`Concepts needing opposites: ${needsOpposites.length}\n`)

  // Process concepts that need opposites
  const toProcess = new Set<string>()
  for (const concept of needsOpposites) {
    toProcess.add(concept.id)
  }

  // Check for limit argument (e.g., --limit 10)
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined

  const conceptsToProcess = limit 
    ? Array.from(toProcess).slice(0, limit)
    : Array.from(toProcess)

  console.log(`Processing ${conceptsToProcess.length} concepts${limit ? ` (limited to ${limit})` : ''}...\n`)

  let processed = 0
  let updated = 0

  for (const conceptId of conceptsToProcess) {
    const concept = conceptMap.get(conceptId)
    if (!concept) continue

    processed++
    console.log(`[${processed}/${conceptsToProcess.length}] Processing "${concept.label}" (${conceptId})...`)

    // Generate relationships
    const generated = await generateRelationships(concept, conceptMap, labelToIdMap)
    
    // Merge with existing data (only opposites)
    const existingOpposites = (concept.opposites || []) as string[]

    // Convert labels/IDs to concept IDs (handle both labels and IDs from LLM)
    const convertToIds = (items: string[]): string[] => {
      return items
        .map(item => {
          const normalized = item.toLowerCase().trim()
          // Try direct ID match first
          if (conceptMap.has(normalized)) {
            return normalized
          }
          // Try label-to-ID mapping
          const id = labelToIdMap.get(normalized)
          if (id) {
            return id
          }
          // Try partial match (e.g., "minimal" matches "minimalist")
          for (const [label, id] of labelToIdMap.entries()) {
            if (label.includes(normalized) || normalized.includes(label)) {
              return id
            }
          }
          return null
        })
        .filter((id): id is string => id !== null && conceptMap.has(id))
    }

    // Filter out invalid concept IDs and convert labels to IDs
    const validOpposites = convertToIds(generated.opposites)
    
    // Merge opposites (avoid duplicates)
    const mergedOpposites = Array.from(new Set([...existingOpposites, ...validOpposites]))

    // Update if there are changes
    const hasChanges = mergedOpposites.length !== existingOpposites.length

    if (hasChanges) {
      await prisma.concept.update({
        where: { id: conceptId },
        data: {
          opposites: mergedOpposites.length > 0 ? mergedOpposites : null,
        },
      })

      console.log(`  ✅ Updated:`)
      if (mergedOpposites.length > existingOpposites.length) {
        const added = mergedOpposites.filter(o => !existingOpposites.includes(o))
        console.log(`     Opposites: ${existingOpposites.length} → ${mergedOpposites.length} (added: ${added.join(', ')})`)
      }
      updated++
    } else {
      console.log(`  ⏭️  No opposites found or no changes needed`)
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`\n✅ Processed ${processed} concepts, updated ${updated}`)
  
  // Now ensure all opposite relationships are bidirectional
  console.log('\n🔧 Ensuring bidirectional opposite relationships...')
  
  const allConceptsAfter = await prisma.concept.findMany({
    select: {
      id: true,
      opposites: true,
    },
  })

  let bidirectionalFixes = 0
  for (const concept of allConceptsAfter) {
    const opposites = (concept.opposites as string[] | null) || []
    for (const oppositeId of opposites) {
      const oppositeConcept = allConceptsAfter.find(c => c.id === oppositeId)
      if (oppositeConcept) {
        const oppositeOpposites = (oppositeConcept.opposites as string[] | null) || []
        if (!oppositeOpposites.includes(concept.id)) {
          await prisma.concept.update({
            where: { id: oppositeId },
            data: {
              opposites: [...oppositeOpposites, concept.id],
            },
          })
          bidirectionalFixes++
        }
      }
    }
  }

  console.log(`✅ Fixed ${bidirectionalFixes} bidirectional relationships\n`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

