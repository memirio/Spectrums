#!/usr/bin/env tsx
/**
 * Check cosine ranking for a query
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const query = process.argv[2] || 'dark'
  
  console.log('═'.repeat(60))
  console.log(`🔍 Cosine Ranking Check: "${query}"`)
  console.log('═'.repeat(60))
  
  // Embed query
  console.log('\n📝 Embedding query...')
  const [queryVec] = await embedTextBatch([query])
  const dim = queryVec.length
  console.log(`   ✅ Query embedding dimension: ${dim}\n`)
  
  // Get all images with embeddings
  console.log('📸 Loading images with embeddings...')
  const images = await (prisma.image.findMany as any)({
    where: { embedding: { isNot: null } },
    include: { 
      embedding: true, 
      site: true,
    },
  })
  console.log(`   ✅ Found ${images.length} images\n`)
  
  // Calculate cosine similarity
  console.log('🧮 Calculating cosine similarities...')
  const ranked = [] as Array<{
    imageId: string
    siteId: string
    siteTitle: string
    siteUrl: string
    imageUrl: string
    score: number
    topTags: string[]
  }>
  
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== dim) continue
    
    const score = cosine(queryVec, ivec)
    
    ranked.push({
      imageId: img.id,
      siteId: img.siteId,
      siteTitle: img.site?.title || 'Unknown',
      siteUrl: img.site?.url || '',
      imageUrl: img.url || '',
      score,
      topTags: [], // Skip tags for now due to Prisma issue
    })
  }
  
  // Sort by score
  ranked.sort((a, b) => b.score - a.score)
  
  // Show top 10
  console.log('═'.repeat(60))
  console.log(`🏆 Top 10 Matches for "${query}"`)
  console.log('═'.repeat(60))
  console.log()
  
  for (let i = 0; i < Math.min(10, ranked.length); i++) {
    const item = ranked[i]
    console.log(`${(i + 1).toString().padStart(2)}. Score: ${item.score.toFixed(4)}`)
    console.log(`    Site: ${item.siteTitle}`)
    console.log(`    URL:  ${item.siteUrl}`)
    console.log()
  }
  
  console.log('═'.repeat(60))
  console.log(`📊 Total images ranked: ${ranked.length}`)
  console.log(`📈 Score range: ${ranked[ranked.length - 1]?.score.toFixed(4)} - ${ranked[0]?.score.toFixed(4)}`)
  console.log('═'.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

