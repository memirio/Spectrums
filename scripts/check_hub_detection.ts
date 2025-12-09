import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Checking hub detection for recent submission...\n')

  // Get the most recent image
  const recentImage = await prisma.image.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      url: true,
      category: true,
      createdAt: true,
      hubCount: true,
      hubScore: true,
      hubAvgCosineSimilarity: true,
      hubAvgCosineSimilarityMargin: true,
    },
  })

  if (!recentImage) {
    console.log('No recent images found.')
    return
  }

  console.log(`📸 Image ID: ${recentImage.id}`)
  console.log(`   Category: ${recentImage.category}`)
  console.log(`   Created: ${recentImage.createdAt.toISOString()}\n`)

  console.log('Hub Detection Stats:')
  console.log(`   hubCount: ${recentImage.hubCount ?? 'null'}`)
  console.log(`   hubScore: ${recentImage.hubScore ?? 'null'}`)
  console.log(`   hubAvgCosineSimilarity: ${recentImage.hubAvgCosineSimilarity ?? 'null'}`)
  console.log(`   hubAvgCosineSimilarityMargin: ${recentImage.hubAvgCosineSimilarityMargin ?? 'null'}\n`)

  if (recentImage.hubCount === null) {
    console.log('❌ Hub detection has NOT been run yet (all values are null)')
    console.log('   Hub detection runs in the background after tagging.')
    console.log('   It may take a few minutes to complete.\n')
  } else {
    console.log('✅ Hub detection has been run')
    if (recentImage.hubCount > 0) {
      console.log(`   ⚠️  This image appears in ${recentImage.hubCount} query(ies)`)
      console.log(`   Hub score: ${recentImage.hubScore?.toFixed(4) ?? 'N/A'}`)
    } else {
      console.log('   ✓ Not detected as a hub (hubCount = 0)')
    }
  }

  // Check if there are any user interactions for this image
  const interactionCount = await prisma.userInteraction.count({
    where: { imageId: recentImage.id },
  })

  console.log(`\nUser Interactions: ${interactionCount}`)

  await prisma.$disconnect()
}

main().catch(console.error)
