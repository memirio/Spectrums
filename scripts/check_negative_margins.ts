#!/usr/bin/env tsx
/**
 * Check Hubs with Negative Margins
 * 
 * Shows hubs that have negative average cosine similarity margins
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const hubs = await prisma.$queryRaw<any[]>`
    SELECT 
      i.id,
      i.hubScore,
      i.hubAvgCosineSimilarityMargin,
      s.title,
      s.url
    FROM images i
    INNER JOIN sites s ON s.id = i.siteId
    WHERE i.hubScore IS NOT NULL 
      AND i.hubAvgCosineSimilarityMargin IS NOT NULL
    ORDER BY i.hubAvgCosineSimilarityMargin ASC
    LIMIT 20
  `

  console.log('═'.repeat(90))
  console.log('📊 Hubs with Negative Margins (Bottom 20)')
  console.log('═'.repeat(90))
  console.log('Rank | Site Title                    | Hub Score | Margin')
  console.log('─'.repeat(90))

  hubs.forEach((hub, i) => {
    const rank = (i + 1).toString().padStart(4)
    const title = (hub.title || 'N/A').substring(0, 28).padEnd(28)
    const hubScore = hub.hubScore.toFixed(4).padStart(10)
    const margin = hub.hubAvgCosineSimilarityMargin.toFixed(4).padStart(8)
    console.log(`${rank} | ${title} | ${hubScore} | ${margin}`)
  })

  const stats = await prisma.$queryRaw<any[]>`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN hubAvgCosineSimilarityMargin < 0 THEN 1 ELSE 0 END) as negative,
      SUM(CASE WHEN hubAvgCosineSimilarityMargin = 0 THEN 1 ELSE 0 END) as zero,
      SUM(CASE WHEN hubAvgCosineSimilarityMargin > 0 THEN 1 ELSE 0 END) as positive,
      AVG(hubAvgCosineSimilarityMargin) as avg_margin,
      MIN(hubAvgCosineSimilarityMargin) as min_margin,
      MAX(hubAvgCosineSimilarityMargin) as max_margin
    FROM images
    WHERE hubScore IS NOT NULL AND hubAvgCosineSimilarityMargin IS NOT NULL
  `

  const s = stats[0]
  const total = Number(s.total)
  const negative = Number(s.negative)
  const zero = Number(s.zero)
  const positive = Number(s.positive)
  
  console.log('─'.repeat(90))
  console.log('📈 Statistics:')
  console.log(`   Total hubs: ${total}`)
  console.log(`   Negative margin: ${negative} (${(negative / total * 100).toFixed(1)}%)`)
  console.log(`   Zero margin: ${zero} (${(zero / total * 100).toFixed(1)}%)`)
  console.log(`   Positive margin: ${positive} (${(positive / total * 100).toFixed(1)}%)`)
  console.log(`   Average margin: ${Number(s.avg_margin).toFixed(4)}`)
  console.log(`   Min margin: ${Number(s.min_margin).toFixed(4)}`)
  console.log(`   Max margin: ${Number(s.max_margin).toFixed(4)}`)
  console.log('═'.repeat(90))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

