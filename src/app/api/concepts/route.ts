import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { areOpposites } from '@/lib/concept-opposites'

// Helper to normalize label to concept ID format
function labelToConceptId(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Strict matching - only exact, starts-with, or synonym matches
// No substring matches to avoid irrelevant suggestions (e.g., "app" when searching "happy")
function matchesConcept(query: string, concept: any): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return false
  
  // Check label - only exact or starts-with matches
  const label = concept.label.toLowerCase()
  if (label === q || label.startsWith(q) || q.startsWith(label)) return true
  
  // Check ID - only exact or starts-with matches
  const id = concept.id.toLowerCase()
  if (id === q || id.startsWith(q) || q.startsWith(id)) return true
  
  // Check synonyms - only exact or starts-with matches
  const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
  for (const syn of synonyms) {
    if (syn === q || syn.startsWith(q) || q.startsWith(syn)) return true
  }
  
  // Check related terms - only exact or starts-with matches
  const related = (concept.related as unknown as string[] || []).map(r => String(r).toLowerCase())
  for (const rel of related) {
    if (rel === q || rel.startsWith(q) || q.startsWith(rel)) return true
  }
  
  return false
}

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  return matrix[len1][len2]
}

// Calculate similarity score for ranking - only exact/starts-with matches, no substring matches
function calculateScore(query: string, concept: any): number {
  const q = query.toLowerCase().trim()
  
  // Exact match on label gets highest score
  const label = concept.label.toLowerCase()
  if (label === q) return 1000
  if (label.startsWith(q)) return 800
  if (q.startsWith(label)) return 600
  
  // Exact match on ID
  const id = concept.id.toLowerCase()
  if (id === q) return 900
  if (id.startsWith(q)) return 700
  if (q.startsWith(id)) return 500
  
  // Check synonyms - only exact or starts-with
  const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
  for (const syn of synonyms) {
    if (syn === q) return 750
    if (syn.startsWith(q)) return 550
    if (q.startsWith(syn)) return 450
  }
  
  // Only allow very close fuzzy matches (distance <= 1) for typos
  const labelDist = levenshteinDistance(q, label)
  const idDist = levenshteinDistance(q, id)
  const minDist = Math.min(labelDist, idDist)
  
  // Only score if very close (1 character difference max)
  if (minDist === 1 && Math.min(q.length, label.length) >= 3) {
    return 200 // Low score for typo corrections
  }
  
  // Check synonyms for very close fuzzy matches
  for (const syn of synonyms) {
    const synDist = levenshteinDistance(q, syn)
    if (synDist === 1 && Math.min(q.length, syn.length) >= 3) {
      return 150 // Low score for synonym typo corrections
    }
  }
  
  return 0 // No match
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const limit = 3 // Show up to 3 suggestions
    
    const qTrimmed = q.trim()
    // Early exit for empty or very short queries
    if (!qTrimmed || qTrimmed.length < 1) {
      return NextResponse.json({ concepts: [] })
    }
    
    const qLower = qTrimmed.toLowerCase()
    const qUpper = qTrimmed.toUpperCase()
    const qTitle = qTrimmed.charAt(0).toUpperCase() + qTrimmed.slice(1).toLowerCase()
    const queryConceptId = labelToConceptId(qTrimmed)
    
    // OPTIMIZATION: Use database-level filtering instead of loading all concepts
    // Filter concepts where label starts with the query (case-insensitive for SQLite)
    // SQLite doesn't support mode: 'insensitive', so we check multiple case variations
    const labelStartsWithQuery = await prisma.concept.findMany({
      where: {
        OR: [
          { label: { startsWith: qLower } },
          { label: { startsWith: qUpper } },
          { label: { startsWith: qTitle } },
          { label: { startsWith: qTrimmed } }, // Original case
        ],
      },
      take: 50, // Limit initial results for performance
      orderBy: { label: 'asc' },
    })
    
    // Also fetch concepts where the ID starts with the query
    const idStartsWithQuery = await prisma.concept.findMany({
      where: {
        OR: [
          { id: { startsWith: qLower } },
          { id: { startsWith: qUpper } },
          { id: { startsWith: qTitle } },
          { id: { startsWith: qTrimmed } }, // Original case
        ],
        // Exclude concepts already found by label
        NOT: {
          id: {
            in: labelStartsWithQuery.map(c => c.id),
          },
        },
      },
      take: 50,
      orderBy: { label: 'asc' },
    })
    
    // Combine and deduplicate
    const conceptMap = new Map<string, any>()
    for (const concept of [...labelStartsWithQuery, ...idStartsWithQuery]) {
      conceptMap.set(concept.id, concept)
    }
    
    // If we have very few results, also search for concepts that contain the query
    // This helps with cases like "3d" matching "3D Rendering"
    if (conceptMap.size < 5 && qLower.length >= 2) {
      const containsMatches = await prisma.concept.findMany({
        where: {
          OR: [
            { label: { contains: qLower } },
            { label: { contains: qUpper } },
            { id: { contains: qLower } },
            { id: { contains: qUpper } },
          ],
          NOT: {
            id: {
              in: Array.from(conceptMap.keys()),
            },
          },
        },
        take: 20, // Limit to prevent performance issues
        orderBy: { label: 'asc' },
      })
      
      for (const concept of containsMatches) {
        conceptMap.set(concept.id, concept)
      }
    }
    
    const concepts = Array.from(conceptMap.values())
    
    // Find if the query itself matches a concept (to check for opposites)
    // Check exact matches first (most likely to be the query concept)
    let queryConcept: any = null
    const exactMatch = await prisma.concept.findFirst({
      where: {
        OR: [
          { label: { equals: qLower } },
          { label: { equals: qUpper } },
          { label: { equals: qTitle } },
          { label: { equals: qTrimmed } },
          { id: { equals: qLower } },
          { id: { equals: qUpper } },
          { id: { equals: queryConceptId } },
        ],
      },
    })
    
    if (exactMatch) {
      queryConcept = exactMatch
      // Add to concepts if not already there
      if (!conceptMap.has(exactMatch.id)) {
        concepts.push(exactMatch)
        conceptMap.set(exactMatch.id, exactMatch)
      }
    } else {
      // Fallback: check loaded concepts for synonym matches
      for (const concept of concepts) {
        const label = concept.label.toLowerCase()
        const id = concept.id.toLowerCase()
        const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
        
        if (label === qLower || id === qLower || id === queryConceptId || synonyms.includes(qLower)) {
          queryConcept = concept
          break
        }
      }
    }
    
    // OPTIMIZATION: For synonym matching, we check the already-loaded concepts
    // Since synonyms are stored in JSON arrays, database-level filtering is complex
    // We'll check synonyms of the concepts we've already loaded (which should cover most cases)
    // If needed, we could add a separate synonym search, but it's expensive
    
    // Use the concepts we've already loaded
    const allConcepts = concepts
    
    // Build suggestions array with both concepts and their synonyms
    const suggestions: Array<{
      id: string
      label: string
      displayText: string
      isSynonym: boolean
      parentConceptLabel: string
      matchScore: number
    }> = []
    
    // Track which concepts we've already added (by concept ID) to avoid duplicates
    const addedConceptIds = new Set<string>()
    
    // OPTIMIZATION: Process concepts with early exits and optimized scoring
    for (const concept of allConcepts) {
      // Skip if this concept is an opposite of the query concept
      if (queryConcept && areOpposites(queryConcept.id, concept.id)) {
        continue
      }
      // Also check by normalized ID
      if (areOpposites(queryConceptId, concept.id)) {
        continue
      }
      
      // Skip if we've already added this concept
      if (addedConceptIds.has(concept.id)) {
        continue
      }
      
      const label = concept.label.toLowerCase()
      const synonyms = (concept.synonyms as unknown as string[] || [])
      const synonymsLower = synonyms.map(s => String(s).toLowerCase())
      
      let bestScore = 0
      
      // Fast path: Check label matches first (most common case)
      if (label === qLower) {
        bestScore = 1000
      } else if (label.startsWith(qLower)) {
        bestScore = 800
      } else if (qLower.startsWith(label)) {
        bestScore = 600
      } else {
        // Check ID matches
        const id = concept.id.toLowerCase()
        if (id === qLower) {
          bestScore = 900
        } else if (id.startsWith(qLower)) {
          bestScore = 700
        } else if (qLower.startsWith(id)) {
          bestScore = 500
        } else {
          // Check synonyms - only exact or starts-with matches
          for (const syn of synonymsLower) {
            if (syn === qLower) {
              bestScore = Math.max(bestScore, 750)
              break // Exact match, no need to check more
            } else if (syn.startsWith(qLower)) {
              bestScore = Math.max(bestScore, 550)
            } else if (qLower.startsWith(syn)) {
              bestScore = Math.max(bestScore, 450)
            }
          }
          
          // Only do expensive Levenshtein for close matches if we don't have a good score yet
          if (bestScore < 200 && qLower.length >= 3) {
            const labelDist = levenshteinDistance(qLower, label)
            if (labelDist === 1) {
              bestScore = Math.max(bestScore, 200)
            } else {
              // Check synonyms for typo corrections
              for (const syn of synonymsLower) {
                const synDist = levenshteinDistance(qLower, syn)
                if (synDist === 1 && syn.length >= 3) {
                  bestScore = Math.max(bestScore, 150)
                  break // Found a close match, no need to check more
                }
              }
            }
          }
        }
      }
      
      // Only add the concept if it has a meaningful score
      if (bestScore > 0) {
        suggestions.push({
          id: concept.id,
          label: concept.label,
          displayText: concept.label,
          isSynonym: false,
          parentConceptLabel: concept.label,
          matchScore: bestScore,
        })
        addedConceptIds.add(concept.id)
        
        // Early exit: if we have enough high-scoring results, we can stop
        // (but continue to check for exact matches which might have higher scores)
        if (suggestions.length >= limit * 2 && bestScore >= 800) {
          break
        }
      }
    }
    
    // Sort suggestions by match score (already deduplicated by concept ID)
    // OPTIMIZATION: Use conceptMap for O(1) lookup instead of O(n) find()
    const uniqueSuggestions = suggestions
      .filter(s => s.matchScore > 0) // Only include suggestions with a meaningful score
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
      .map(suggestion => {
        const concept = conceptMap.get(suggestion.id)
        return {
          id: suggestion.id,
          label: suggestion.label, // Use concept label for search
          displayText: suggestion.displayText, // Always the concept label
          isSynonym: false, // Always false since we only show concept labels
          synonyms: (concept?.synonyms as unknown as string[] || []),
        }
      })
    
    return NextResponse.json({ concepts: uniqueSuggestions })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

