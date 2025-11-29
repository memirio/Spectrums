/**
 * Zero-shot tagging using CLIP with concept graph expansion
 * 
 * This is the new tagging approach that doesn't rely on pre-computed concept embeddings.
 * Instead, it:
 * 1. Uses the concept graph to expand concept labels with synonyms
 * 2. Embeds the expanded labels directly using CLIP
 * 3. Compares to image embeddings for tagging
 * 
 * This makes concept embeddings optional (only used for validation/legacy).
 */

import { embedTextBatch } from './embeddings'
import { prisma } from './prisma'

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

/**
 * Tag an image using zero-shot CLIP with concept graph expansion
 * 
 * @param imageEmbedding - The CLIP embedding vector for the image (768-dim, normalized)
 * @param concepts - Array of concepts from database (with synonyms/related)
 * @param minScore - Minimum cosine similarity threshold (default: 0.20)
 * @param maxK - Maximum number of tags (default: 700)
 * @param minScoreDropPct - Minimum score drop percentage before stopping (default: 0.30)
 * @returns Array of { conceptId, score } sorted by score descending
 */
export async function tagImageWithZeroShot(
  imageEmbedding: number[],
  concepts: Array<{
    id: string
    label: string
    synonyms: unknown // JSON array
    related: unknown // JSON array
  }>,
  minScore: number = 0.20,
  maxK: number = 700,
  minScoreDropPct: number = 0.30
): Promise<Array<{ conceptId: string; score: number }>> {
  // Build expanded prompts for each concept
  // Format: "website UI with a {term} visual style" for label + synonyms
  const conceptPrompts: Array<{ conceptId: string; prompts: string[] }> = []
  
  for (const concept of concepts) {
    const synonyms = (concept.synonyms as string[] || []).filter((s: any) => s && typeof s === 'string')
    const related = (concept.related as string[] || []).filter((r: any) => r && typeof r === 'string')
    
    // Use label + synonyms for embedding (related terms are less important for tagging)
    const tokens = [concept.label, ...synonyms]
    const prompts = tokens.map((t: string) => `website UI with a ${t} visual style`)
    
    conceptPrompts.push({
      conceptId: concept.id,
      prompts
    })
  }
  
  // Embed all prompts in batches
  const allPrompts: string[] = []
  const promptToConcept: Map<number, string> = new Map()
  let promptIndex = 0
  
  for (const { conceptId, prompts } of conceptPrompts) {
    for (const prompt of prompts) {
      allPrompts.push(prompt)
      promptToConcept.set(promptIndex, conceptId)
      promptIndex++
    }
  }
  
  // Generate embeddings for all prompts
  const promptEmbeddings = await embedTextBatch(allPrompts)
  
  // Group embeddings by concept and average them
  const conceptEmbeddings = new Map<string, number[][]>()
  
  for (let i = 0; i < allPrompts.length; i++) {
    const conceptId = promptToConcept.get(i)!
    if (!conceptEmbeddings.has(conceptId)) {
      conceptEmbeddings.set(conceptId, [])
    }
    conceptEmbeddings.get(conceptId)!.push(promptEmbeddings[i])
  }
  
  // Average and normalize embeddings for each concept
  const conceptVectors = new Map<string, number[]>()
  
  for (const [conceptId, embeddings] of conceptEmbeddings.entries()) {
    if (embeddings.length === 0) continue
    
    // Average the embeddings
    const dim = embeddings[0].length
    const avg = new Array(dim).fill(0)
    for (const emb of embeddings) {
      for (let i = 0; i < dim && i < emb.length; i++) {
        avg[i] += emb[i]
      }
    }
    const n = embeddings.length
    for (let i = 0; i < dim; i++) {
      avg[i] /= n
    }
    
    // L2-normalize
    const norm = Math.sqrt(avg.reduce((s: number, x: number) => s + x * x, 0)) || 1
    const normalized = avg.map((x: number) => x / norm)
    
    conceptVectors.set(conceptId, normalized)
  }
  
  // Score all concepts against image embedding
  const scores = Array.from(conceptVectors.entries())
    .map(([conceptId, conceptVec]) => ({
      conceptId,
      score: cosineSimilarity(imageEmbedding, conceptVec)
    }))
    .filter((s: any) => s.score > 0) // Only keep positive scores
    .sort((a: any, b: any) => b.score - a.score)
  
  // Apply pragmatic tagging logic
  const aboveThreshold = scores.filter((s: any) => s.score >= minScore)
  const chosen: typeof scores = []
  const MIN_TAGS_PER_IMAGE = 8
  let prevScore = aboveThreshold.length > 0 ? aboveThreshold[0].score : 0
  
  for (let i = 0; i < aboveThreshold.length && chosen.length < maxK; i++) {
    const current = aboveThreshold[i]
    
    // Check if score drop is acceptable
    if (chosen.length === 0) {
      chosen.push(current)
      prevScore = current.score
      continue
    }
    
    const dropPct = (prevScore - current.score) / prevScore
    if (dropPct > minScoreDropPct) {
      // If we haven't met MIN_TAGS_PER_IMAGE yet, add it anyway
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        chosen.push(current)
        prevScore = current.score
      } else {
        break // Significant drop and already have enough tags
      }
    } else {
      chosen.push(current)
      prevScore = current.score
    }
  }
  
  // Fallback: ensure minimum tags for coverage
  if (chosen.length < MIN_TAGS_PER_IMAGE) {
    const fallback = scores.slice(0, MIN_TAGS_PER_IMAGE)
    const keep = new Set(chosen.map((c: any) => c.conceptId))
    for (const f of fallback) {
      if (!keep.has(f.conceptId)) {
        chosen.push(f)
        keep.add(f.conceptId)
        if (chosen.length >= MIN_TAGS_PER_IMAGE) break
      }
    }
  }
  
  // Final selection - sorted by score
  return chosen.sort((a, b) => b.score - a.score)
}

