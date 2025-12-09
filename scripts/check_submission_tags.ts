import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Checking recent submission tags...\n')

  // Get the most recent image
  const recentImage = await prisma.image.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      embedding: true,
      site: {
        select: {
          id: true,
          title: true,
          url: true,
        },
      },
    },
  })

  if (!recentImage) {
    console.log('No recent images found.')
    return
  }

  console.log(`📸 Image ID: ${recentImage.id}`)
  console.log(`   Category: ${recentImage.category}`)
  console.log(`   Created: ${recentImage.createdAt.toISOString()}\n`)

  // Get all tags for this image
  const imageTags = await prisma.imageTag.findMany({
    where: { imageId: recentImage.id },
    include: {
      concept: {
        select: {
          id: true,
          label: true,
          locale: true,
        },
      },
    },
    orderBy: {
      score: 'desc',
    },
  })

  console.log(`Total tags: ${imageTags.length}\n`)

  // Check if any concepts were created recently (around the same time as the image)
  const imageCreatedTime = recentImage.createdAt
  const timeWindow = new Date(imageCreatedTime.getTime() - 60000) // 1 minute before
  const timeWindowAfter = new Date(imageCreatedTime.getTime() + 60000) // 1 minute after

  const recentlyCreatedConcepts = await prisma.concept.findMany({
    where: {
      id: {
        in: imageTags.map(t => t.conceptId),
      },
    },
    select: {
      id: true,
      label: true,
      locale: true,
    },
  })

  // Check which concepts existed before vs were created around submission time
  // (We can't easily check creation time for concepts, but we can see if they're in the seed data)
  console.log(`Concepts tagged to this image: ${recentlyCreatedConcepts.length}\n`)

  // Show top 20 tags by score
  console.log('Top 20 tags by score:')
  imageTags.slice(0, 20).forEach((tag, idx) => {
    console.log(`   ${idx + 1}. ${tag.concept.label} (score: ${tag.score.toFixed(4)})`)
  })

  if (imageTags.length > 20) {
    console.log(`   ... and ${imageTags.length - 20} more tags`)
  }

  // Check tag score distribution
  const scores = imageTags.map(t => t.score)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const minScore = Math.min(...scores)
  const maxScore = Math.max(...scores)

  console.log(`\nTag score statistics:`)
  console.log(`   Average: ${avgScore.toFixed(4)}`)
  console.log(`   Min: ${minScore.toFixed(4)}`)
  console.log(`   Max: ${maxScore.toFixed(4)}`)

  // Check if this looks like Pipeline 2.0 (should only have high-scoring tags from existing concepts)
  // vs full pipeline (might have many low-scoring tags from new concepts)
  const highScoreTags = imageTags.filter(t => t.score > 0.3).length
  const mediumScoreTags = imageTags.filter(t => t.score > 0.2 && t.score <= 0.3).length
  const lowScoreTags = imageTags.filter(t => t.score <= 0.2).length

  console.log(`\nTag distribution by score:`)
  console.log(`   High (>0.3): ${highScoreTags}`)
  console.log(`   Medium (0.2-0.3): ${mediumScoreTags}`)
  console.log(`   Low (≤0.2): ${lowScoreTags}`)

  await prisma.$disconnect()
}

main().catch(console.error)

