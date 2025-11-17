#!/usr/bin/env tsx
/**
 * List Top Hubs
 * 
 * Shows the top N hubs with their statistics
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const args = process.argv.slice(2)
  const topNArg = args.find(arg => arg.startsWith('--top-n='))
  const topN = topNArg ? parseInt(topNArg.split('=')[1]) || 20 : 20

  const hubs = await prisma.$queryRaw<any[]>`
    SELECT 
      i.id,
      i.hubCount,
      i.hubScore,
      i.hubAvgCosineSimilarity,
      i.hubAvgCosineSimilarityMargin,
      s.title,
      s.url
    FROM images i
    INNER JOIN sites s ON s.id = i.siteId
    WHERE i.hubScore IS NOT NULL
    ORDER BY i.hubScore DESC
    LIMIT ${topN}
  `

  console.log('═'.repeat(120))
  console.log(`🔝 Top ${topN} Hub Images`)
  console.log('═'.repeat(120))
  console.log('Rank | Site Title                    | Hub Score | Hub Count | Avg Cosine | Margin')
  console.log('─'.repeat(120))

  hubs.forEach((hub, i) => {
    const rank = (i + 1).toString().padStart(4)
    const title = (hub.title || 'N/A').substring(0, 28).padEnd(28)
    const hubScore = hub.hubScore.toFixed(4).padStart(10)
    const hubCount = hub.hubCount ? hub.hubCount.toString().padStart(10) : 'null'.padStart(10)
    const avgCosine = hub.hubAvgCosineSimilarity !== null 
      ? hub.hubAvgCosineSimilarity.toFixed(4).padStart(10) 
      : 'null'.padStart(10)
    const margin = hub.hubAvgCosineSimilarityMargin !== null 
      ? hub.hubAvgCosineSimilarityMargin.toFixed(4).padStart(8) 
      : 'null'.padStart(8)
    console.log(`${rank} | ${title} | ${hubScore} | ${hubCount} | ${avgCosine} | ${margin}`)
  })

  console.log('─'.repeat(120))
  
  const stats = await prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*) as total_hubs,
      AVG(hubScore) as avg_hub_score,
      MAX(hubScore) as max_hub_score,
      MIN(hubScore) as min_hub_score,
      AVG(hubAvgCosineSimilarityMargin) as avg_margin,
      SUM(CASE WHEN hubAvgCosineSimilarityMargin > 0 THEN 1 ELSE 0 END) as positive_margin_count,
      SUM(CASE WHEN hubAvgCosineSimilarityMargin <= 0 THEN 1 ELSE 0 END) as negative_margin_count
    FROM images
    WHERE hubScore IS NOT NULL
  `

  const s = stats[0]
  console.log('📊 Hub Statistics:')
  console.log(`   Total hubs: ${Number(s.total_hubs)}`)
  console.log(`   Average hub score: ${Number(s.avg_hub_score).toFixed(4)}`)
  console.log(`   Max hub score: ${Number(s.max_hub_score).toFixed(4)}`)
  console.log(`   Min hub score: ${Number(s.min_hub_score).toFixed(4)}`)
  console.log(`   Average margin: ${Number(s.avg_margin).toFixed(4)}`)
  console.log(`   Hubs with positive margin: ${Number(s.positive_margin_count)} (will be penalized)`)
  console.log(`   Hubs with negative margin: ${Number(s.negative_margin_count)} (no penalty)`)
  console.log('═'.repeat(120))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

