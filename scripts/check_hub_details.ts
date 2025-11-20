import { prisma } from '../src/lib/prisma'

async function main() {
  const siteUrl = process.argv[2] || 'leoleo.studio'
  
  console.log('═'.repeat(70))
  console.log(`🔍 Hub Details for: ${siteUrl}`)
  console.log('═'.repeat(70))
  console.log()
  
  // Find the site
  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { url: { contains: siteUrl } },
        { title: { contains: siteUrl } },
      ],
    },
    include: {
      images: {
        include: {
          embedding: true,
        },
      },
    },
  })
  
  if (!site) {
    console.log(`❌ Site not found: ${siteUrl}`)
    await prisma.$disconnect()
    return
  }
  
  console.log(`📌 Site: ${site.title}`)
  console.log(`🔗 URL: ${site.url}`)
  console.log(`🖼️  Images: ${site.images.length}`)
  console.log()
  
  // Check hub stats for each image
  for (const img of site.images) {
    console.log(`📸 Image ID: ${img.id.substring(0, 12)}...`)
    
    // Get hub stats using raw SQL to ensure we get all columns
    const hubStats = await prisma.$queryRaw<Array<{
      id: string
      hubCount: number | null
      hubScore: number | null
      hubAvgCosineSimilarity: number | null
      hubAvgCosineSimilarityMargin: number | null
    }>>`
      SELECT 
        id,
        "hubCount",
        "hubScore",
        "hubAvgCosineSimilarity",
        "hubAvgCosineSimilarityMargin"
      FROM images
      WHERE id = ${img.id}
    `
    
    if (hubStats.length > 0) {
      const stats = hubStats[0]
      console.log(`   Hub Count: ${stats.hubCount ?? 'null'}`)
      console.log(`   Hub Score: ${stats.hubScore?.toFixed(4) ?? 'null'}`)
      console.log(`   Avg Cosine Similarity: ${stats.hubAvgCosineSimilarity?.toFixed(4) ?? 'null'}`)
      console.log(`   Avg Cosine Similarity Margin: ${stats.hubAvgCosineSimilarityMargin?.toFixed(4) ?? 'null'}`)
      
      // Calculate penalty
      if (stats.hubScore !== null && stats.hubScore > 0.05) {
        const marginPenaltyFactor = 4.8
        const frequencyPenaltyFactor = 0.09
        const avgCosineSimilarityMargin = stats.hubAvgCosineSimilarityMargin ?? 0
        
        const marginPenalty = Math.max(0, avgCosineSimilarityMargin * marginPenaltyFactor)
        
        // Reduce frequency penalty when margin is negative (performing below average)
        const frequencyPenaltyMultiplier = avgCosineSimilarityMargin < 0 ? 0.5 : 1.0
        const frequencyPenalty = stats.hubScore * frequencyPenaltyFactor * frequencyPenaltyMultiplier
        const absolutePenalty = marginPenalty + frequencyPenalty
        
        // We need baseScore to calculate percentage, but we can show the absolute penalty
        console.log()
        console.log(`   ⚠️  HUB PENALTY CALCULATION:`)
        console.log(`      Margin Penalty: ${marginPenalty.toFixed(4)} (margin: ${avgCosineSimilarityMargin.toFixed(4)} × ${marginPenaltyFactor})`)
        if (avgCosineSimilarityMargin < 0) {
          console.log(`      Frequency Penalty: ${frequencyPenalty.toFixed(4)} (hubScore: ${stats.hubScore.toFixed(4)} × ${frequencyPenaltyFactor} × 0.5 [reduced for negative margin])`)
        } else {
          console.log(`      Frequency Penalty: ${frequencyPenalty.toFixed(4)} (hubScore: ${stats.hubScore.toFixed(4)} × ${frequencyPenaltyFactor})`)
        }
        console.log(`      Absolute Penalty: ${absolutePenalty.toFixed(4)}`)
        console.log(`      → This will be converted to a percentage of baseScore (capped at 20%)`)
      } else {
        console.log(`   ✅ Not penalized (hubScore: ${stats.hubScore ?? 'null'} <= 0.05)`)
      }
    } else {
      console.log(`   ❌ No hub stats found`)
    }
    console.log()
  }
  
  // Also check if it appears in hub detection queries
  console.log('📊 Hub Detection Context:')
  console.log(`   Hub Score > 0.05 means it appears in more than 5% of hub detection queries`)
  console.log(`   Hub Score represents: (appearances in top 40) / (total queries)`)
  console.log(`   Threshold: Only images with hubScore > (40/208) × 1.5 ≈ 0.288 are considered hubs`)
  console.log()
  
  await prisma.$disconnect()
}

main().catch(console.error)

