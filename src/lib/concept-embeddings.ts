/**
 * Centralized concept embedding generation
 * 
 * This ensures all concept embeddings are generated using the same method:
 * - Multiple prompts: "website UI with a {term} visual style" (one per token)
 * - Average the embeddings
 * - L2-normalize the result
 * 
 * This prevents embedding corruption from using different generation methods.
 */

import { embedTextBatch, meanVec, l2norm } from './embeddings'

/**
 * Generate embedding for a concept using the standard method
 * 
 * @param label - The concept label
 * @param synonyms - Array of synonym strings
 * @param related - Array of related term strings
 * @returns L2-normalized embedding vector
 */
export async function generateConceptEmbedding(
  label: string,
  synonyms: string[] = [],
  related: string[] = []
): Promise<number[]> {
  // Standard method: multiple prompts with "website UI with a {term} visual style"
  const tokens = [label, ...synonyms, ...related]
  const prompts = tokens.map((t: string) => `website UI with a ${t} visual style`)
  
  const vecs = await embedTextBatch(prompts)
  
  if (vecs.length === 0) {
    throw new Error(`Failed to generate embeddings for concept "${label}"`)
  }
  
  // Average and normalize
  const avg = meanVec(vecs)
  const normalized = l2norm(avg)
  
  return normalized
}

/**
 * Validate that an embedding was generated using the standard method
 * 
 * This checks if regenerating the embedding produces a similar result.
 * If similarity < 0.9, the embedding may be corrupted.
 * 
 * @param label - The concept label
 * @param synonyms - Array of synonym strings
 * @param related - Array of related term strings
 * @param storedEmbedding - The stored embedding to validate
 * @returns Similarity score (0-1, where 1.0 = identical)
 */
export async function validateConceptEmbedding(
  label: string,
  synonyms: string[] = [],
  related: string[] = [],
  storedEmbedding: number[]
): Promise<number> {
  const freshEmbedding = await generateConceptEmbedding(label, synonyms, related)
  
  // Calculate cosine similarity
  const len = Math.min(storedEmbedding.length, freshEmbedding.length)
  let similarity = 0
  for (let i = 0; i < len; i++) {
    similarity += storedEmbedding[i] * freshEmbedding[i]
  }
  
  return similarity
}

