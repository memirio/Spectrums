import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function testSimpleColorfulEmbedding() {
  console.log('Testing simpler "colorful" embedding approaches...\n')

  // Get current colorful embedding
  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })
  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }
  const currentEmbedding = colorful.embedding as unknown as number[]

  // Test different embedding strategies
  const strategies = [
    {
      name: 'Current (complex)',
      prompts: ['website UI with a colorful visual style', 'website UI with a vibrant visual style'],
    },
    {
      name: 'Simple word only',
      prompts: ['colorful'],
    },
    {
      name: 'Simple + synonyms',
      prompts: ['colorful', 'vibrant', 'bright', 'colorful design'],
    },
    {
      name: 'Visual description',
      prompts: ['colorful website', 'bright colors', 'vibrant colors', 'colorful design'],
    },
  ]

  // Get test images (the colorful websites)
  const targetUrls = [
    'https://www.easytomorrow.com/en',
    'https://palermo.ddd.live/',
    'https://compsych.konpo.co/',
    'https://stripe.com/en-se',
  ]

  const sites = await prisma.site.findMany({
    where: { url: { in: targetUrls } },
    include: {
      images: {
        include: { embedding: true }
      }
    }
  })

  console.log('='.repeat(100))
  console.log('EMBEDDING STRATEGY COMPARISON')
  console.log('='.repeat(100))

  const results: Array<{
    strategy: string
    embedding: number[]
    scores: number[]
  }> = []

  for (const strategy of strategies) {
    console.log(`\n📊 Strategy: ${strategy.name}`)
    console.log(`   Prompts: ${strategy.prompts.join(', ')}`)
    
    // Generate embedding for this strategy
    const vecs = await embedTextBatch(strategy.prompts)
    const avg = meanVec(vecs)
    const embedding = l2norm(avg)
    
    // Test against images
    const scores: number[] = []
    for (const site of sites) {
      for (const img of site.images) {
        const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
        if (imageEmbedding.length > 0) {
          const score = cosine(imageEmbedding, embedding)
          scores.push(score)
        }
      }
    }

    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0
    const minScore = scores.length > 0 ? Math.min(...scores) : 0

    console.log(`   Scores on test images:`)
    console.log(`     Average: ${avgScore.toFixed(4)}`)
    console.log(`     Max:     ${maxScore.toFixed(4)}`)
    console.log(`     Min:     ${minScore.toFixed(4)}`)
    console.log(`     Above 0.18 threshold: ${scores.filter(s => s >= 0.18).length}/${scores.length}`)

    results.push({ strategy: strategy.name, embedding, scores })
  }

  // Compare with current embedding
  console.log('\n' + '='.repeat(100))
  console.log('CURRENT EMBEDDING PERFORMANCE')
  console.log('='.repeat(100))
  
  const currentScores: number[] = []
  for (const site of sites) {
    for (const img of site.images) {
      const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
      if (imageEmbedding.length > 0) {
        const score = cosine(imageEmbedding, currentEmbedding)
        currentScores.push(score)
        console.log(`  ${site.url}: ${score.toFixed(4)}`)
      }
    }
  }

  const currentAvg = currentScores.length > 0 ? currentScores.reduce((a, b) => a + b, 0) / currentScores.length : 0
  const currentMax = currentScores.length > 0 ? Math.max(...currentScores) : 0
  console.log(`\n  Current embedding average: ${currentAvg.toFixed(4)}`)
  console.log(`  Current embedding max:     ${currentMax.toFixed(4)}`)
  console.log(`  Above 0.18 threshold:      ${currentScores.filter(s => s >= 0.18).length}/${currentScores.length}`)

  // Find best strategy
  console.log('\n' + '='.repeat(100))
  console.log('RECOMMENDATION')
  console.log('='.repeat(100))
  
  const bestStrategy = results.reduce((best, curr) => {
    const currAvg = curr.scores.length > 0 ? curr.scores.reduce((a, b) => a + b, 0) / curr.scores.length : 0
    const bestAvg = best.scores.length > 0 ? best.scores.reduce((a, b) => a + b, 0) / best.scores.length : 0
    return currAvg > bestAvg ? curr : best
  })

  console.log(`\n✓ Best strategy: ${bestStrategy.strategy}`)
  const bestAvg = bestStrategy.scores.length > 0 
    ? bestStrategy.scores.reduce((a, b) => a + b, 0) / bestStrategy.scores.length 
    : 0
  console.log(`  Average score improvement: ${(bestAvg - currentAvg).toFixed(4)}`)
  console.log(`  Improvement: ${((bestAvg / currentAvg - 1) * 100).toFixed(1)}%`)
}

async function main() {
  try {
    await testSimpleColorfulEmbedding()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

