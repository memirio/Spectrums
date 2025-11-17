#!/usr/bin/env tsx
/**
 * Test Hub Penalty
 * 
 * Tests that hub images are being penalized in search results
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
  const testQuery = 'dark'
  
  console.log('═'.repeat(70))
  console.log('🧪 Testing Hub Penalty')
  console.log('═'.repeat(70))
  console.log(`\nTest Query: "${testQuery}"\n`)
  
  // 1. Get query embedding
  const [queryVec] = await embedTextBatch([testQuery])
  
  // 2. Get all images with embeddings and hub stats
  // Use raw query to get hubAvgCosineSimilarity and hubAvgCosineSimilarityMargin (new columns)
  const imagesRaw = await prisma.$queryRaw<any[]>`
    SELECT 
      i.id, i.hubScore, i.hubCount, i.hubAvgCosineSimilarity, i.hubAvgCosineSimilarityMargin,
      e.vector,
      s.title, s.url
    FROM images i
    INNER JOIN image_embeddings e ON e.imageId = i.id
    INNER JOIN sites s ON s.id = i.siteId
    WHERE e.vector IS NOT NULL
  `
  
  const images = imagesRaw.map(img => ({
    id: img.id,
    hubScore: img.hubScore,
    hubCount: img.hubCount,
    hubAvgCosineSimilarity: img.hubAvgCosineSimilarity,
    hubAvgCosineSimilarityMargin: img.hubAvgCosineSimilarityMargin,
    embedding: { vector: img.vector },
    site: { title: img.title, url: img.url },
  }))
  
  console.log(`📊 Found ${images.length} images with embeddings\n`)
  
  // 3. Compute base scores (CLIP cosine similarity)
  const scored = images.map(img => {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    const baseScore = cosine(queryVec, ivec)
    return {
      imageId: img.id,
      siteTitle: img.site.title,
      siteUrl: img.site.url,
      baseScore,
      hubScore: img.hubScore ?? null,
      hubCount: img.hubCount ?? null,
      hubAvgCosineSimilarity: img.hubAvgCosineSimilarity ?? null,
      hubAvgCosineSimilarityMargin: img.hubAvgCosineSimilarityMargin ?? null,
    }
  })
  
  // 4. Sort by base score
  scored.sort((a, b) => b.baseScore - a.baseScore)
  
  // 5. Apply hub penalty (same logic as search API - percentage-based multiplier on cosine score)
  const withPenalty = scored.map(item => {
    let hubPenaltyMultiplier = 1.0
    const hubScore = item.hubScore
    const avgCosineSimilarityMargin = item.hubAvgCosineSimilarityMargin ?? 0
    
    if (hubScore !== null && hubScore > 0.05) {
      // Base penalty from margin: how much higher this hub is compared to query averages
      const marginPenaltyFactor = 5.0 // Reduced from 6.0
      const marginPenalty = Math.max(0, avgCosineSimilarityMargin * marginPenaltyFactor)
      
      // Frequency penalty: more frequently appearing hubs get heavier penalty
      const frequencyPenaltyFactor = 0.10 // Reduced from 0.12
      
      // Reduce frequency penalty when margin is negative (performing below average)
      // If margin is negative, reduce frequency penalty by 50% (multiply by 0.5)
      const frequencyPenaltyMultiplier = avgCosineSimilarityMargin < 0 ? 0.5 : 1.0
      const frequencyPenalty = hubScore * frequencyPenaltyFactor * frequencyPenaltyMultiplier
      
      // Combined absolute penalty: margin penalty + frequency penalty
      const absolutePenalty = marginPenalty + frequencyPenalty
      
      // Convert absolute penalty to percentage of baseScore
      // This ensures high semantic similarity (high baseScore) can still rank well
      const penaltyPercentage = item.baseScore > 0 ? Math.min(absolutePenalty / item.baseScore, 0.2) : 0 // Keep cap at 20%
      
      // Apply as multiplier: 1.0 = no penalty, 0.8 = 20% penalty
      hubPenaltyMultiplier = 1.0 - penaltyPercentage
      
      // Ensure multiplier doesn't go below 0.5 (max 50% reduction)
      hubPenaltyMultiplier = Math.max(0.5, hubPenaltyMultiplier)
    }
    
    // Apply hub penalty directly to baseScore (cosine similarity)
    const adjustedBaseScore = item.baseScore * hubPenaltyMultiplier
    const finalScore = adjustedBaseScore // No other adjustments in this test
    
    return {
      ...item,
      hubPenaltyMultiplier,
      adjustedBaseScore,
      marginPenalty: hubScore !== null && hubScore > 0.05 ? Math.max(0, avgCosineSimilarityMargin * 5.0) : 0,
      frequencyPenalty: hubScore !== null && hubScore > 0.05 ? hubScore * 0.10 * (avgCosineSimilarityMargin < 0 ? 0.5 : 1.0) : 0,
      absolutePenalty: hubScore !== null && hubScore > 0.05 ? (Math.max(0, avgCosineSimilarityMargin * 5.0) + hubScore * 0.10 * (avgCosineSimilarityMargin < 0 ? 0.5 : 1.0)) : 0,
      penaltyPercentage: hubScore !== null && hubScore > 0.05 && item.baseScore > 0 ? Math.min((Math.max(0, avgCosineSimilarityMargin * 5.0) + hubScore * 0.10 * (avgCosineSimilarityMargin < 0 ? 0.5 : 1.0)) / item.baseScore, 0.2) : 0,
      finalScore,
    }
  })
  
  // 6. Sort by final score
  withPenalty.sort((a, b) => b.finalScore - a.finalScore)
  
  // 7. Compare top 10: before vs after penalty
  console.log('📊 Top 10 Results - BEFORE Hub Penalty:')
  console.log('─'.repeat(70))
  console.log('Rank | Site Title                    | Base Score | Hub Score | Avg Margin')
  console.log('─'.repeat(70))
  scored.slice(0, 10).forEach((item, i) => {
    const rank = (i + 1).toString().padStart(4)
    const title = (item.siteTitle || 'N/A').substring(0, 28).padEnd(28)
    const baseScore = item.baseScore.toFixed(4).padStart(10)
    const hubScore = item.hubScore !== null ? item.hubScore.toFixed(4).padStart(10) : 'null'.padStart(10)
    const avgMargin = item.hubAvgCosineSimilarityMargin !== null && item.hubAvgCosineSimilarityMargin !== undefined 
      ? item.hubAvgCosineSimilarityMargin.toFixed(4).padStart(10) 
      : 'null'.padStart(10)
    console.log(`${rank} | ${title} | ${baseScore} | ${hubScore} | ${avgMargin}`)
  })
  
  console.log('\n📊 Top 10 Results - AFTER Hub Penalty:')
  console.log('─'.repeat(130))
  console.log('Rank | Site Title                    | Final Score | Base Score | Multiplier | Penalty% | Margin P | Freq P')
  console.log('─'.repeat(130))
  withPenalty.slice(0, 10).forEach((item, i) => {
    const rank = (i + 1).toString().padStart(4)
    const title = (item.siteTitle || 'N/A').substring(0, 28).padEnd(28)
    const finalScore = item.finalScore.toFixed(4).padStart(11)
    const baseScore = item.baseScore.toFixed(4).padStart(10)
    const multiplier = (item as any).hubPenaltyMultiplier !== undefined ? (item as any).hubPenaltyMultiplier.toFixed(3).padStart(10) : '1.000'.padStart(10)
    const penaltyPct = (item as any).penaltyPercentage !== undefined ? ((item as any).penaltyPercentage * 100).toFixed(1).padStart(9) + '%' : '0.0%'.padStart(10)
    const marginPenalty = (item as any).marginPenalty !== undefined ? (item as any).marginPenalty.toFixed(4).padStart(8) : '0.0000'.padStart(8)
    const frequencyPenalty = (item as any).frequencyPenalty !== undefined ? (item as any).frequencyPenalty.toFixed(4).padStart(8) : '0.0000'.padStart(8)
    console.log(`${rank} | ${title} | ${finalScore} | ${baseScore} | ${multiplier} | ${penaltyPct} | ${marginPenalty} | ${frequencyPenalty}`)
  })
  
  // 8. Show which images dropped due to hub penalty
  console.log('\n📉 Hubs With Penalties Applied:')
  console.log('─'.repeat(100))
  
  const beforeMap = new Map(scored.map((item, i) => [item.imageId, i + 1]))
  const afterMap = new Map(withPenalty.map((item, i) => [item.imageId, i + 1]))
  
  // Show all hubs with penalties (not just dropped ones)
  const hubsWithPenalty = withPenalty
    .filter(item => (item as any).hubPenaltyMultiplier < 1.0)
    .sort((a, b) => (a as any).hubPenaltyMultiplier - (b as any).hubPenaltyMultiplier) // Sort by multiplier (lower = more penalty)
    .slice(0, 15)
  
  if (hubsWithPenalty.length > 0) {
    console.log('Site Title                    | Before | After | Drop | Base Score | Multiplier | Penalty% | Hub Score')
    console.log('─'.repeat(100))
    hubsWithPenalty.forEach(item => {
      const beforeRank = beforeMap.get(item.imageId)!
      const afterRank = afterMap.get(item.imageId)!
      const drop = afterRank - beforeRank
      const title = (item.siteTitle || 'N/A').substring(0, 28).padEnd(28)
      const before = beforeRank.toString().padStart(6)
      const after = afterRank.toString().padStart(5)
      const dropStr = drop.toString().padStart(4)
      const baseScore = item.baseScore.toFixed(4).padStart(11)
      const multiplier = (item as any).hubPenaltyMultiplier !== undefined ? (item as any).hubPenaltyMultiplier.toFixed(3).padStart(10) : '1.000'.padStart(10)
      const penaltyPct = (item as any).penaltyPercentage !== undefined ? ((item as any).penaltyPercentage * 100).toFixed(1).padStart(9) + '%' : '0.0%'.padStart(10)
      const hubScore = item.hubScore !== null ? item.hubScore.toFixed(4).padStart(10) : 'null'.padStart(10)
      console.log(`${title} | ${before} | ${after} | ${dropStr} | ${baseScore} | ${multiplier} | ${penaltyPct} | ${hubScore}`)
    })
  } else {
    console.log('   No hubs with penalties found')
  }
  
  console.log('\n' + '═'.repeat(70))
  console.log('✅ Hub penalty test complete!')
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

