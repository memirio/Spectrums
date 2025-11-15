import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function testSearchRanking() {
  console.log('Testing search ranking for "3d" query...\n')

  const query = '3d'
  
  // Get the 3d concept
  const threeDConcept = await prisma.concept.findUnique({
    where: { id: '3d' }
  })
  
  if (!threeDConcept) {
    console.log('❌ 3d concept not found')
    return
  }

  // Get all images with 3d tag
  const images = await prisma.image.findMany({
    include: {
      embedding: true,
      tags: {
        where: { conceptId: '3d' }
      },
      site: true
    }
  })

  const taggedImages = images.filter(img => img.tags.some(t => t.conceptId === '3d'))
  
  console.log(`Found ${taggedImages.length} images with "3d" tag\n`)

  // Simulate search ranking
  const [queryVec] = await embedTextBatch([query])
  const matchedConceptIds = new Set(['3d'])

  const ranked: Array<{
    imageId: string
    siteUrl: string
    tagScore: number
    baseScore: number
    finalScore: number
    directHitsCount: number
    hasAllMatches: boolean
    hasOppositeTags: boolean
  }> = []

  for (const img of taggedImages) {
    const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
    if (imageEmbedding.length === 0) continue

    const baseScore = cosine(queryVec, imageEmbedding)
    const tag = img.tags.find(t => t.conceptId === '3d')
    const tagScore = tag?.score || 0

    // Simulate the search ranking logic
    const DIRECT_MULTIPLIER = 10
    const ZERO_WITH_DIRECT = 0.10
    
    const directMatches = tag ? [{ conceptId: '3d', score: tagScore }] : []
    const directSum = directMatches.reduce((s, t) => s + t.score, 0)
    const tagScoreBoost = DIRECT_MULTIPLIER * directSum
    const finalScore = tagScoreBoost + baseScore * ZERO_WITH_DIRECT

    ranked.push({
      imageId: img.id,
      siteUrl: img.site?.url || '',
      tagScore,
      baseScore,
      finalScore,
      directHitsCount: directMatches.length,
      hasAllMatches: true,
      hasOppositeTags: false
    })
  }

  // Sort by search ranking logic
  ranked.sort((a, b) => {
    // 1. hasAllMatches (both true, skip)
    // 2. directHitsCount (both 1, skip)
    // 3. final score
    if (Math.abs(a.finalScore - b.finalScore) > 0.01) {
      return b.finalScore - a.finalScore
    }
    // 4. baseScore
    if (Math.abs(a.baseScore - b.baseScore) > 0.0001) {
      return b.baseScore - a.baseScore
    }
    return 0
  })

  console.log('='.repeat(100))
  console.log('SEARCH RANKING SIMULATION (Top 20)')
  console.log('='.repeat(100))
  console.log('Rank | Tag Score | Base Score | Final Score | Site URL')
  console.log('-'.repeat(100))

  ranked.slice(0, 20).forEach((r, i) => {
    const rank = (i + 1).toString().padStart(4)
    const tag = r.tagScore.toFixed(4).padStart(10)
    const base = r.baseScore.toFixed(4).padStart(10)
    const final = r.finalScore.toFixed(4).padStart(11)
    const url = r.siteUrl.substring(0, 50).padEnd(50)
    console.log(`${rank} | ${tag} | ${base} | ${final} | ${url}`)
  })

  // Check mastercard specifically
  const mastercard = ranked.find(r => r.siteUrl.includes('mastercard'))
  if (mastercard) {
    const mastercardRank = ranked.findIndex(r => r.siteUrl === mastercard.siteUrl) + 1
    console.log('\n' + '='.repeat(100))
    console.log('MASTERCARD ANALYSIS')
    console.log('='.repeat(100))
    console.log(`Mastercard rank in search: ${mastercardRank}`)
    console.log(`Tag score: ${mastercard.tagScore.toFixed(4)}`)
    console.log(`Base score: ${mastercard.baseScore.toFixed(4)}`)
    console.log(`Final score: ${mastercard.finalScore.toFixed(4)}`)
    console.log(`\nTop 5 for comparison:`)
    ranked.slice(0, 5).forEach((r, i) => {
      console.log(`  ${i+1}. Final: ${r.finalScore.toFixed(4)}, Tag: ${r.tagScore.toFixed(4)}, Base: ${r.baseScore.toFixed(4)} | ${r.siteUrl.substring(0, 40)}`)
    })
  }
}

async function main() {
  try {
    await testSearchRanking()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

