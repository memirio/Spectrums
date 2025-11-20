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
    
    if (!q.trim()) {
      return NextResponse.json({ concepts: [] })
    }
    
    // Fetch all concepts
    const concepts = await prisma.concept.findMany({
      orderBy: { label: 'asc' },
    })
    
    const qLower = q.toLowerCase().trim()
    const queryConceptId = labelToConceptId(q)
    
    // Find if the query itself matches a concept (to check for opposites)
    let queryConcept: any = null
    for (const concept of concepts) {
      const label = concept.label.toLowerCase()
      const id = concept.id.toLowerCase()
      const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
      
      if (label === qLower || id === qLower || id === queryConceptId || synonyms.includes(qLower)) {
        queryConcept = concept
        break
      }
    }
    
    // Build suggestions array with both concepts and their synonyms
    const suggestions: Array<{
      id: string
      label: string
      displayText: string // What to show in the UI (could be synonym or label)
      isSynonym: boolean
      parentConceptLabel: string // The actual concept label to use for search
      matchScore: number // Score for this specific match
    }> = []
    
    // Track which concepts we've already added (by concept ID) to avoid duplicates
    const addedConceptIds = new Set<string>()
    
    // Process all concepts and their synonyms
    for (const concept of concepts) {
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
      let matched = false
      
      // Check if query matches label - only exact or starts-with matches (no substring matches)
      const labelExact = label === qLower
      const labelStartsWith = label.startsWith(qLower) || qLower.startsWith(label)
      
      if (labelExact || labelStartsWith || matchesConcept(q, concept)) {
        const score = calculateScore(q, concept)
        bestScore = Math.max(bestScore, score)
        matched = true
      }
      
      // Check if query matches any synonym - only exact or starts-with matches
      for (let i = 0; i < synonyms.length; i++) {
        const syn = synonymsLower[i]
        // Only exact or starts-with matches
        const isExactMatch = syn === qLower
        const isStartsWithMatch = syn.startsWith(qLower) || qLower.startsWith(syn)
        
        if (isExactMatch || isStartsWithMatch) {
          // Calculate score for this synonym match - only exact or starts-with
          let synScore = 0
          if (syn === qLower) synScore = 750
          else if (syn.startsWith(qLower)) synScore = 550
          else if (qLower.startsWith(syn)) synScore = 450
          else {
            // Only very close fuzzy match (1 character difference) for typos
            const synDist = levenshteinDistance(qLower, syn)
            if (synDist === 1 && Math.min(qLower.length, syn.length) >= 3) {
              synScore = 150 // Low score for typo corrections
            }
          }
          bestScore = Math.max(bestScore, synScore)
          matched = true
        }
      }
      
      // Only add the concept once, using the concept label (not the synonym)
      if (matched && bestScore > 0) {
        suggestions.push({
          id: concept.id,
          label: concept.label,
          displayText: concept.label, // Always show concept label, not synonym
          isSynonym: false,
          parentConceptLabel: concept.label,
          matchScore: bestScore,
        })
        addedConceptIds.add(concept.id)
      }
    }
    
    // Sort suggestions by match score (already deduplicated by concept ID)
    const uniqueSuggestions = suggestions
      .filter(s => s.matchScore > 0) // Only include suggestions with a meaningful score
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
      .map(suggestion => ({
        id: suggestion.id,
        label: suggestion.label, // Use concept label for search
        displayText: suggestion.displayText, // Always the concept label
        isSynonym: false, // Always false since we only show concept labels
        synonyms: (concepts.find(c => c.id === suggestion.id)?.synonyms as unknown as string[] || []),
      }))
    
    return NextResponse.json({ concepts: uniqueSuggestions })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

