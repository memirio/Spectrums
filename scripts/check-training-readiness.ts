/**
 * Quick check for training readiness
 * Shows a clear notification if 1000+ interactions are available
 * 
 * Usage:
 *   npx tsx scripts/check-training-readiness.ts
 * 
 * Can be run periodically or added to a cron job
 */

import { getInteractionStats } from '../src/lib/interaction-logger'
import { prisma } from '../src/lib/prisma'

const MIN_INTERACTIONS_NEEDED = 1000

async function checkTrainingReadiness() {
  const stats = await getInteractionStats()

  console.log('=== Training Readiness Check ===\n')

  if (stats.totalImpressions >= MIN_INTERACTIONS_NEEDED) {
    console.log('🎉🎉🎉 THRESHOLD REACHED! 🎉🎉🎉\n')
    console.log(`✅ You have ${stats.totalImpressions} interactions - ready to train!`)
    console.log(`\n📊 Data Summary:`)
    console.log(`   - Total Impressions: ${stats.totalImpressions}`)
    console.log(`   - Total Clicks: ${stats.totalClicks}`)
    console.log(`   - Click-Through Rate: ${(stats.clickThroughRate * 100).toFixed(2)}%`)
    console.log(`   - Total Saves: ${stats.totalSaves}`)
    console.log(`   - Unique Queries: ${stats.uniqueQueries}`)
    console.log(`\n🚀 Next Steps:`)
    console.log(`   1. Export training data: npx tsx scripts/export-training-data.ts`)
    console.log(`   2. Train model: python scripts/train_reranker.py`)
    console.log(`   3. See: docs/LEARNED_RERANKER_PLAN.md for full guide`)
    console.log(`\n`)
    
    // Exit with success code (useful for cron/automation)
    process.exit(0)
  } else {
    const remaining = MIN_INTERACTIONS_NEEDED - stats.totalImpressions
    const progress = (stats.totalImpressions / MIN_INTERACTIONS_NEEDED) * 100
    
    console.log(`📈 Progress: ${progress.toFixed(1)}%`)
    console.log(`   Current: ${stats.totalImpressions} impressions`)
    console.log(`   Needed: ${MIN_INTERACTIONS_NEEDED} impressions`)
    console.log(`   Remaining: ${remaining} impressions`)
    
    // Progress bar
    const barLength = 40
    const filled = Math.floor((stats.totalImpressions / MIN_INTERACTIONS_NEEDED) * barLength)
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)
    console.log(`   [${bar}]`)
    console.log(`\n💡 Tip: Keep using the site to collect more interaction data!`)
    console.log(`   Run this script again to check progress.\n`)
    
    // Exit with non-zero code (useful for cron/automation)
    process.exit(1)
  }
}

checkTrainingReadiness()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

