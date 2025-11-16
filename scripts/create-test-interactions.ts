/**
 * Create test interactions for development/testing
 * 
 * This script creates synthetic user interactions to bootstrap training data
 * when you don't have real user traffic yet.
 * 
 * Usage:
 *   npx tsx scripts/create-test-interactions.ts
 * 
 * This will create test interactions based on:
 * - High CLIP scores = likely clicked
 * - High tag scores = likely clicked
 * - Low scores = likely not clicked
 */

import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function createTestInteractions() {
  console.log('Creating test interactions...')

  // Get some test queries
  const testQueries = [
    '3d',
    'colorful',
    'minimalist',
    'playful',
    'elegant',
    'bold',
    'serene',
    'euphoric',
  ]

  // Get all images with embeddings
  const images = await prisma.image.findMany({
    where: { embedding: { isNot: null } },
    include: { embedding: true, tags: true },
    take: 100, // Limit to first 100 for testing
  })

  console.log(`Found ${images.length} images`)

  let totalCreated = 0

  for (const query of testQueries) {
    console.log(`\nProcessing query: "${query}"`)

    // Embed query
    const [queryVec] = await embedTextBatch([query])
    const dim = queryVec.length

    // Rank images by CLIP similarity
    const ranked = images
      .map((img: any) => {
        const imgVec = (img.embedding?.vector as unknown as number[]) || []
        if (imgVec.length !== dim) return null

        const baseScore = cosine(queryVec, imgVec)

        // Get tag features
        const tagScores = img.tags.map((t: any) => t.score || 0)
        const maxTagScore = tagScores.length > 0 ? Math.max(...tagScores) : 0
        const sumTagScores = tagScores.reduce((a: number, b: number) => a + b, 0)

        return {
          imageId: img.id,
          baseScore,
          maxTagScore,
          sumTagScores,
          tagCount: img.tags.length,
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.baseScore - a.baseScore)
      .slice(0, 20) // Top 20 results

    // Create interactions
    // High scores = likely clicked, low scores = not clicked
    for (let i = 0; i < ranked.length; i++) {
      const item = ranked[i] as any
      const position = i + 1

      // Simulate clicks: top 5 results have 70% chance, next 5 have 30%, rest have 10%
      const clickProbability = position <= 5 ? 0.7 : position <= 10 ? 0.3 : 0.1
      const clicked = Math.random() < clickProbability

      // If clicked, simulate dwell time (1-10 seconds)
      const dwellTime = clicked ? Math.floor(Math.random() * 9000) + 1000 : null

      // Create tag features
      const tagFeatures = {
        cosineSimilarity: item.baseScore,
        cosineSimilaritySquared: item.baseScore * item.baseScore,
        maxTagScore: item.maxTagScore,
        sumTagScores: item.sumTagScores,
        directMatchCount: item.tagCount,
        synonymMatchCount: 0,
        relatedMatchCount: 0,
        maxOppositeTagScore: 0,
        sumOppositeTagScores: 0,
      }

      try {
        await prisma.userInteraction.create({
          data: {
            query,
            queryEmbedding: queryVec,
            imageId: item.imageId,
            position,
            baseScore: item.baseScore,
            tagFeatures,
            clicked,
            saved: clicked && Math.random() < 0.1, // 10% of clicks are saved
            dwellTime,
          },
        })
        totalCreated++
      } catch (error: any) {
        // Skip duplicates
        if (!error.message.includes('Unique constraint')) {
          console.error(`Error creating interaction:`, error.message)
        }
      }
    }

    console.log(`  Created ${ranked.length} interactions for "${query}"`)
  }

  console.log(`\n✅ Created ${totalCreated} test interactions`)
  console.log(`\nYou can now:`)
  console.log(`  1. Check stats: npx tsx scripts/check-interaction-stats.ts`)
  console.log(`  2. Export training data: npx tsx scripts/export-training-data.ts (when implemented)`)
}

createTestInteractions()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

