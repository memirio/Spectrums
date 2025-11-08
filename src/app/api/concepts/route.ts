import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple fuzzy matching - check if query matches label, synonyms, or related terms
function matchesConcept(query: string, concept: any): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return false
  
  // Check label
  const label = concept.label.toLowerCase()
  if (label.includes(q) || q.includes(label)) return true
  
  // Check ID
  const id = concept.id.toLowerCase()
  if (id.includes(q) || q.includes(id)) return true
  
  // Check synonyms
  const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
  for (const syn of synonyms) {
    if (syn.includes(q) || q.includes(syn)) return true
  }
  
  // Check related terms
  const related = (concept.related as unknown as string[] || []).map(r => String(r).toLowerCase())
  for (const rel of related) {
    if (rel.includes(q) || q.includes(rel)) return true
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

// Calculate similarity score for ranking
function calculateScore(query: string, concept: any): number {
  const q = query.toLowerCase().trim()
  let score = 0
  
  // Exact match on label gets highest score
  const label = concept.label.toLowerCase()
  if (label === q) return 1000
  if (label.startsWith(q)) return 800
  if (label.includes(q)) return 600
  
  // Exact match on ID
  const id = concept.id.toLowerCase()
  if (id === q) return 900
  if (id.startsWith(q)) return 700
  if (id.includes(q)) return 500
  
  // Check synonyms
  const synonyms = (concept.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
  for (const syn of synonyms) {
    if (syn === q) return 750
    if (syn.startsWith(q)) return 550
    if (syn.includes(q)) return 400
  }
  
  // Fuzzy matching with Levenshtein distance
  const labelDist = levenshteinDistance(q, label)
  const idDist = levenshteinDistance(q, id)
  const minDist = Math.min(labelDist, idDist)
  
  // Score based on distance (smaller distance = higher score)
  if (minDist <= 2) {
    score = 300 - (minDist * 50) // 300 for dist=0, 250 for dist=1, 200 for dist=2
  } else if (minDist <= 3) {
    score = 100 - (minDist * 20) // 100 for dist=3
  }
  
  // Check synonyms for fuzzy matching
  for (const syn of synonyms) {
    const synDist = levenshteinDistance(q, syn)
    if (synDist <= 2) {
      score = Math.max(score, 250 - (synDist * 50))
    }
  }
  
  return score
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const limit = 1 // Always show only 1 suggestion
    
    if (!q.trim()) {
      return NextResponse.json({ concepts: [] })
    }
    
    // Fetch all concepts
    const concepts = await prisma.concept.findMany({
      orderBy: { label: 'asc' },
    })
    
    // Filter and score concepts
    const matched = concepts
      .map(concept => ({
        concept,
        score: calculateScore(q, concept),
      }))
      .filter(item => item.score > 0 || matchesConcept(q, item.concept))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        id: item.concept.id,
        label: item.concept.label,
        synonyms: item.concept.synonyms as unknown as string[] || [],
      }))
    
    return NextResponse.json({ concepts: matched })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

