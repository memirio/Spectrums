import { prisma } from '../src/lib/prisma'
import { TAG_CONFIG } from '../src/lib/tagging-config'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function checkColorfulTaggingPotential() {
  console.log('Simulating re-tagging to see how many images would get "colorful" tag...\n')

  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })

  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }

  const images = await prisma.image.findMany({
    include: {
      embedding: true,
      tags: true
    }
  })

  console.log(`Analyzing ${images.length} images...\n`)

  const allConcepts = await prisma.concept.findMany()
  const colorfulEmbedding = colorful.embedding as unknown as number[]

  let wouldBeTagged = 0
  let aboveThresholdButNotTagged = 0
  let belowThreshold = 0
  let alreadyTagged = 0

  const results: Array<{
    imageId: string
    colorfulScore: number
    colorfulRank: number
    totalTagged: number
    wouldBeTagged: boolean
  }> = []

  for (const img of images) {
    const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
    if (imageEmbedding.length === 0) continue

    // Calculate all concept scores
    const scores = allConcepts.map(c => ({
      conceptId: c.id,
      score: cosine(imageEmbedding, c.embedding as unknown as number[])
    })).sort((a, b) => b.score - a.score)

    // Find colorful's score and rank
    const colorfulScore = cosine(imageEmbedding, colorfulEmbedding)
    const colorfulRank = scores.findIndex(s => s.conceptId === 'colorful') + 1

    // Simulate tagging logic (simplified version)
    const aboveThreshold = scores.filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
    const MIN_TAGS_PER_IMAGE = 8
    const MAX_K = TAG_CONFIG.MAX_K

    // Category guarantees (simplified - assume at least one per category)
    // For now, just take top concepts with score drop logic
    const chosen: typeof scores = []
    let prevScore = aboveThreshold.length > 0 ? aboveThreshold[0].score : 0

    for (let i = 0; i < aboveThreshold.length && chosen.length < MAX_K; i++) {
      const current = aboveThreshold[i]
      
      if (chosen.length === 0) {
        chosen.push(current)
        prevScore = current.score
        continue
      }

      const dropPct = (prevScore - current.score) / prevScore
      if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
        if (chosen.length < MIN_TAGS_PER_IMAGE) {
          chosen.push(current)
          prevScore = current.score
        } else {
          break
        }
      } else {
        chosen.push(current)
        prevScore = current.score
      }
    }

    // Fallback: ensure minimum tags
    if (chosen.length < MIN_TAGS_PER_IMAGE) {
      const fallback = scores.slice(0, MIN_TAGS_PER_IMAGE)
      const keep = new Set(chosen.map(c => c.conceptId))
      for (const f of fallback) {
        if (!keep.has(f.conceptId)) {
          chosen.push(f)
        }
      }
    }

    const wouldBeTaggedNow = chosen.some(c => c.conceptId === 'colorful')
    const currentlyTagged = img.tags.some(t => t.conceptId === 'colorful')

    results.push({
      imageId: img.id,
      colorfulScore,
      colorfulRank,
      totalTagged: chosen.length,
      wouldBeTagged: wouldBeTaggedNow
    })

    if (wouldBeTaggedNow) {
      wouldBeTagged++
      if (!currentlyTagged) {
        aboveThresholdButNotTagged++
      } else {
        alreadyTagged++
      }
    } else if (colorfulScore >= TAG_CONFIG.MIN_SCORE) {
      aboveThresholdButNotTagged++
    } else {
      belowThreshold++
    }
  }

  console.log('='.repeat(80))
  console.log('RESULTS')
  console.log('='.repeat(80))
  console.log(`Total images analyzed: ${results.length}`)
  console.log(`Images that would be tagged with "colorful": ${wouldBeTagged}`)
  console.log(`  - Currently tagged: ${alreadyTagged}`)
  console.log(`  - Would be newly tagged: ${aboveThresholdButNotTagged}`)
  console.log(`Images above threshold but NOT tagged: ${aboveThresholdButNotTagged}`)
  console.log(`Images below threshold: ${belowThreshold}`)

  // Show distribution
  const wouldBeTaggedResults = results.filter(r => r.wouldBeTagged)
  const notTaggedResults = results.filter(r => !r.wouldBeTagged && r.colorfulScore >= TAG_CONFIG.MIN_SCORE)

  if (wouldBeTaggedResults.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('IMAGES THAT WOULD BE TAGGED')
    console.log('='.repeat(80))
    console.log('Rank | Colorful Score | Colorful Rank | Total Tags')
    console.log('-'.repeat(80))
    wouldBeTaggedResults
      .sort((a, b) => b.colorfulScore - a.colorfulScore)
      .slice(0, 20)
      .forEach((r, i) => {
        console.log(`${(i + 1).toString().padStart(4)} | ${r.colorfulScore.toFixed(4).padStart(13)} | ${r.colorfulRank.toString().padStart(13)} | ${r.totalTagged.toString().padStart(10)}`)
      })
  }

  if (notTaggedResults.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('IMAGES ABOVE THRESHOLD BUT NOT TAGGED (sample)')
    console.log('='.repeat(80))
    console.log('Rank | Colorful Score | Colorful Rank | Total Tags | Reason')
    console.log('-'.repeat(80))
    notTaggedResults
      .sort((a, b) => b.colorfulScore - a.colorfulScore)
      .slice(0, 10)
      .forEach((r, i) => {
        const reason = r.colorfulRank > r.totalTagged 
          ? `Rank too low (${r.colorfulRank} > ${r.totalTagged})`
          : 'Score drop too large'
        console.log(`${(i + 1).toString().padStart(4)} | ${r.colorfulScore.toFixed(4).padStart(13)} | ${r.colorfulRank.toString().padStart(13)} | ${r.totalTagged.toString().padStart(10)} | ${reason}`)
      })
  }

  // Statistics
  const avgRankTagged = wouldBeTaggedResults.length > 0
    ? wouldBeTaggedResults.reduce((sum, r) => sum + r.colorfulRank, 0) / wouldBeTaggedResults.length
    : 0
  const avgRankNotTagged = notTaggedResults.length > 0
    ? notTaggedResults.reduce((sum, r) => sum + r.colorfulRank, 0) / notTaggedResults.length
    : 0

  console.log('\n' + '='.repeat(80))
  console.log('STATISTICS')
  console.log('='.repeat(80))
  console.log(`Average "colorful" rank for tagged images: ${avgRankTagged.toFixed(1)}`)
  console.log(`Average "colorful" rank for non-tagged (above threshold): ${avgRankNotTagged.toFixed(1)}`)
  console.log(`\nConclusion: ~${wouldBeTagged} images would actually get the "colorful" tag after re-tagging`)
}

async function main() {
  try {
    await checkColorfulTaggingPotential()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

