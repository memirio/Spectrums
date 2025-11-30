// src/lib/embeddings-openai.ts
// OpenAI embeddings as fallback when @xenova/transformers is not available (e.g., in Vercel serverless)

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = 'text-embedding-3-small' // 1536 dimensions, fast and cheap
// Alternative: 'text-embedding-3-large' (3072 dimensions, more accurate but slower/expensive)

/**
 * Generate text embeddings using OpenAI API
 * This is a fallback when @xenova/transformers is not available
 */
export async function embedTextBatchOpenAI(texts: string[]): Promise<number[][]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for OpenAI embeddings')
  }

  try {
    const response = await openai.embeddings.create({
      model: MODEL,
      input: texts,
    })

    // OpenAI embeddings are already normalized, but we'll ensure they are
    return response.data.map((item) => {
      const vec = item.embedding
      // Normalize to unit vector (L2 norm = 1)
      const norm = Math.sqrt(vec.reduce((sum, x) => sum + x * x, 0)) || 1
      return vec.map((x) => x / norm)
    })
  } catch (error: any) {
    console.error('[embeddings-openai] Failed to generate embeddings:', error.message)
    throw new Error(`OpenAI embeddings failed: ${error.message}`)
  }
}

/**
 * Get embedding dimension for OpenAI model
 */
export function getOpenAIEmbeddingDimension(): number {
  return MODEL === 'text-embedding-3-small' ? 1536 : 3072
}

