/**
 * Check user interaction statistics
 * 
 * Usage:
 *   npx tsx scripts/check-interaction-stats.ts
 */

import { getInteractionStats } from '../src/lib/interaction-logger'
import { prisma } from '../src/lib/prisma'

async function checkStats() {
  const stats = await getInteractionStats()

  console.log('=== User Interaction Statistics ===\n')
  console.log(`Total Impressions: ${stats.totalImpressions}`)
  console.log(`Total Clicks: ${stats.totalClicks}`)
  console.log(`Total Saves: ${stats.totalSaves}`)
  console.log(`Unique Queries: ${stats.uniqueQueries}`)
  console.log(`Click-Through Rate: ${(stats.clickThroughRate * 100).toFixed(2)}%`)

  // Get top queries
  const topQueries = await prisma.userInteraction.groupBy({
    by: ['query'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  })

  console.log('\n=== Top 10 Queries ===')
  topQueries.forEach((q, i) => {
    console.log(`${i + 1}. "${q.query}": ${q._count.id} impressions`)
  })

  // Get click rate by position
  const clicksByPosition = await prisma.userInteraction.groupBy({
    by: ['position'],
    _count: { id: true },
    _sum: { clicked: true },
    where: { position: { lte: 10 } },
    orderBy: { position: 'asc' },
  })

  console.log('\n=== Click Rate by Position (Top 10) ===')
  clicksByPosition.forEach((p) => {
    const ctr = p._count.id > 0 ? (p._sum.clicked || 0) / p._count.id : 0
    console.log(`Position ${p.position}: ${(ctr * 100).toFixed(1)}% CTR (${p._count.id} impressions)`)
  })

  // Minimum data needed for training
  const minDataNeeded = 1000
  console.log(`\n=== Training Readiness ===`)
  if (stats.totalImpressions >= minDataNeeded) {
    console.log(`\n🎉🎉🎉 THRESHOLD REACHED! 🎉🎉🎉`)
    console.log(`✅ Ready for training! (${stats.totalImpressions} >= ${minDataNeeded} impressions)`)
    console.log(`\n📊 Training Data Summary:`)
    console.log(`   - Total Impressions: ${stats.totalImpressions}`)
    console.log(`   - Total Clicks: ${stats.totalClicks}`)
    console.log(`   - Click-Through Rate: ${(stats.clickThroughRate * 100).toFixed(2)}%`)
    console.log(`   - Unique Queries: ${stats.uniqueQueries}`)
    console.log(`\n🚀 Next Steps:`)
    console.log(`   1. Export training data: npx tsx scripts/export-training-data.ts (when implemented)`)
    console.log(`   2. Train model: python scripts/train_reranker.py`)
    console.log(`   3. See: docs/LEARNED_RERANKER_PLAN.md for details`)
    console.log(`\n`)
  } else {
    const remaining = minDataNeeded - stats.totalImpressions
    const progress = (stats.totalImpressions / minDataNeeded) * 100
    console.log(`\n📈 Progress: ${progress.toFixed(1)}% (${stats.totalImpressions}/${minDataNeeded})`)
    console.log(`⚠️  Need ${remaining} more impressions for training`)
    console.log(`   Current: ${stats.totalImpressions} impressions`)
    
    // Show progress bar
    const barLength = 40
    const filled = Math.floor((stats.totalImpressions / minDataNeeded) * barLength)
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)
    console.log(`   [${bar}]`)
  }
}

checkStats()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

