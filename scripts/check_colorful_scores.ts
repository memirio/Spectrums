import { prisma } from '../src/lib/prisma'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function checkColorfulScores() {
  console.log('Checking cosine similarity scores for "colorful" concept across all images...\n')

  // Get the colorful concept
  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })

  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }

  const colorfulEmbedding = colorful.embedding as unknown as number[]
  console.log(`✓ Found "colorful" concept with embedding (${colorfulEmbedding.length} dimensions)\n`)

  // Get all images with embeddings
  const images = await prisma.image.findMany({
    include: {
      embedding: true,
      tags: {
        where: { conceptId: 'colorful' }
      },
      site: true
    }
  })

  console.log(`Total images with embeddings: ${images.length}\n`)

  // Calculate scores for all images
  const scores: Array<{
    imageId: string
    siteUrl: string
    score: number
    hasTag: boolean
    createdAt: Date
  }> = []

  for (const img of images) {
    const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
    if (imageEmbedding.length === 0) continue

    const score = cosine(imageEmbedding, colorfulEmbedding)
    const hasTag = img.tags.length > 0

    scores.push({
      imageId: img.id,
      siteUrl: img.site?.url || '',
      score,
      hasTag,
      createdAt: img.createdAt
    })
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  // Filter by MIN_SCORE threshold (0.18)
  const MIN_SCORE = 0.18
  const aboveThreshold = scores.filter(s => s.score >= MIN_SCORE)
  const belowThreshold = scores.filter(s => s.score < MIN_SCORE)

  console.log('='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`Total images checked: ${scores.length}`)
  console.log(`Images with score >= ${MIN_SCORE}: ${aboveThreshold.length}`)
  console.log(`Images with score < ${MIN_SCORE}: ${belowThreshold.length}`)
  console.log(`Images currently tagged with "colorful": ${scores.filter(s => s.hasTag).length}`)

  if (aboveThreshold.length > 0) {
    console.log(`\n⚠️  Found ${aboveThreshold.length} images that should be tagged but aren't!\n`)
    console.log('Top 20 images above threshold (not tagged):')
    console.log('Rank | Score    | Site URL')
    console.log('-'.repeat(80))
    
    aboveThreshold.slice(0, 20).forEach((item, idx) => {
      const rank = (idx + 1).toString().padStart(4)
      const score = item.score.toFixed(4).padStart(8)
      console.log(`${rank} | ${score} | ${item.siteUrl}`)
    })
  } else {
    console.log(`\n✓ All images are correctly handled (none above threshold or all tagged)`)
  }

  // Show statistics
  if (scores.length > 0) {
    const allScores = scores.map(s => s.score)
    const maxScore = Math.max(...allScores)
    const minScore = Math.min(...allScores)
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length

    console.log('\n' + '='.repeat(80))
    console.log('STATISTICS')
    console.log('='.repeat(80))
    console.log(`Max score:     ${maxScore.toFixed(4)}`)
    console.log(`Min score:     ${minScore.toFixed(4)}`)
    console.log(`Average score: ${avgScore.toFixed(4)}`)
    console.log(`Threshold:     ${MIN_SCORE.toFixed(4)}`)
    console.log(`Gap to threshold: ${(MIN_SCORE - maxScore).toFixed(4)}`)
  }
}

async function main() {
  try {
    await checkColorfulScores()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

