import { prisma } from '../src/lib/prisma'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function compareConcepts() {
  console.log('Comparing "3d" vs "colorful" concept scores...\n')

  const concepts = await prisma.concept.findMany({
    where: {
      id: { in: ['3d', 'colorful'] }
    }
  })

  const conceptMap = new Map(concepts.map(c => [c.id, c]))
  const threeD = conceptMap.get('3d')
  const colorful = conceptMap.get('colorful')

  if (!threeD || !colorful) {
    console.log('❌ Missing concepts')
    return
  }

  const threeDEmbedding = threeD.embedding as unknown as number[]
  const colorfulEmbedding = colorful.embedding as unknown as number[]

  const images = await prisma.image.findMany({
    include: {
      embedding: true,
      tags: true,
      site: true
    }
  })

  const MIN_SCORE = 0.18

  const results: Array<{
    imageId: string
    siteUrl: string
    threeDScore: number
    colorfulScore: number
    has3DTag: boolean
    hasColorfulTag: boolean
  }> = []

  for (const img of images) {
    const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
    if (imageEmbedding.length === 0) continue

    const threeDScore = cosine(imageEmbedding, threeDEmbedding)
    const colorfulScore = cosine(imageEmbedding, colorfulEmbedding)
    const has3DTag = img.tags.some(t => t.conceptId === '3d')
    const hasColorfulTag = img.tags.some(t => t.conceptId === 'colorful')

    results.push({
      imageId: img.id,
      siteUrl: img.site?.url || '',
      threeDScore,
      colorfulScore,
      has3DTag,
      hasColorfulTag
    })
  }

  // Sort by colorful score descending
  results.sort((a, b) => b.colorfulScore - a.colorfulScore)

  console.log('='.repeat(100))
  console.log('TOP 20 IMAGES BY "COLORFUL" SCORE')
  console.log('='.repeat(100))
  console.log('Rank | Colorful | 3D Score | Has 3D | Has Colorful | Site URL')
  console.log('-'.repeat(100))

  results.slice(0, 20).forEach((item, idx) => {
    const rank = (idx + 1).toString().padStart(4)
    const colorful = item.colorfulScore.toFixed(4).padStart(8)
    const threeD = item.threeDScore.toFixed(4).padStart(9)
    const has3D = item.has3DTag ? '✓' : '✗'
    const hasColorful = item.hasColorfulTag ? '✓' : '✗'
    const url = item.siteUrl.substring(0, 50) + (item.siteUrl.length > 50 ? '...' : '')
    console.log(`${rank} | ${colorful} | ${threeD} |   ${has3D}   |      ${hasColorful}      | ${url}`)
  })

  // Statistics
  const colorfulScores = results.map(r => r.colorfulScore)
  const threeDScores = results.map(r => r.threeDScore)
  
  console.log('\n' + '='.repeat(100))
  console.log('STATISTICS')
  console.log('='.repeat(100))
  console.log(`\n"Colorful" concept:`)
  console.log(`  Max score:     ${Math.max(...colorfulScores).toFixed(4)}`)
  console.log(`  Min score:     ${Math.min(...colorfulScores).toFixed(4)}`)
  console.log(`  Average score: ${(colorfulScores.reduce((a, b) => a + b, 0) / colorfulScores.length).toFixed(4)}`)
  console.log(`  Above threshold (${MIN_SCORE}): ${results.filter(r => r.colorfulScore >= MIN_SCORE).length}`)
  
  console.log(`\n"3D" concept:`)
  console.log(`  Max score:     ${Math.max(...threeDScores).toFixed(4)}`)
  console.log(`  Min score:     ${Math.min(...threeDScores).toFixed(4)}`)
  console.log(`  Average score: ${(threeDScores.reduce((a, b) => a + b, 0) / threeDScores.length).toFixed(4)}`)
  console.log(`  Above threshold (${MIN_SCORE}): ${results.filter(r => r.threeDScore >= MIN_SCORE).length}`)
  console.log(`  Actually tagged: ${results.filter(r => r.has3DTag).length}`)

  // Correlation
  const correlation = results.reduce((sum, r) => sum + (r.threeDScore * r.colorfulScore), 0) / results.length
  console.log(`\nCorrelation between 3D and Colorful scores: ${correlation.toFixed(4)}`)
}

async function main() {
  try {
    await compareConcepts()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

