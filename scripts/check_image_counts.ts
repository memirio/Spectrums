#!/usr/bin/env tsx
/**
 * Check Image Counts
 * 
 * Shows total images, images with embeddings, and images with hub stats
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const totalImages = await prisma.image.count()
  const imagesWithEmbeddings = await prisma.image.count({
    where: { embedding: { isNot: null } }
  })
  const imagesWithHubStats = await prisma.image.count({
    where: { hubScore: { not: null } }
  })
  
  // Check hub score distribution
  const hubDistribution = await prisma.$queryRaw<any[]>`
    SELECT 
      CASE 
        WHEN hubScore >= 0.1 THEN 'High (≥0.1)'
        WHEN hubScore >= 0.05 THEN 'Medium (0.05-0.1)'
        WHEN hubScore > 0 THEN 'Low (>0)'
        ELSE 'None'
      END as category,
      COUNT(*) as count
    FROM images
    WHERE hubScore IS NOT NULL
    GROUP BY category
    ORDER BY 
      CASE category
        WHEN 'High (≥0.1)' THEN 1
        WHEN 'Medium (0.05-0.1)' THEN 2
        WHEN 'Low (>0)' THEN 3
        ELSE 4
      END
  `

  console.log('═'.repeat(70))
  console.log('📊 Image Statistics')
  console.log('═'.repeat(70))
  console.log(`Total images: ${totalImages}`)
  console.log(`Images with embeddings: ${imagesWithEmbeddings}`)
  console.log(`Images with hub stats: ${imagesWithHubStats}`)
  console.log(`\n💡 Note: Hub stats are computed for ALL images that appear`)
  console.log(`   at least once in top 40 results across test queries.`)
  console.log(`   So if an image appears even once, it gets hub stats.`)
  console.log('─'.repeat(70))
  console.log('📈 Hub Score Distribution:')
  hubDistribution.forEach((row: any) => {
    const count = Number(row.count)
    const percentage = (count / imagesWithHubStats * 100).toFixed(1)
    console.log(`   ${row.category.padEnd(20)}: ${count.toString().padStart(4)} (${percentage}%)`)
  })
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

