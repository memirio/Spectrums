import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function compareColorfulEmbeddings() {
  console.log('Comparing stored vs freshly generated "colorful" embeddings...\n')

  // Get current colorful concept
  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })
  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }

  const storedEmbedding = colorful.embedding as unknown as number[]
  const synonyms = (colorful.synonyms as unknown as string[]) || []
  const related = (colorful.related as unknown as string[]) || []
  const tokens = [colorful.label, ...synonyms, ...related]
  const prompts = tokens.map(t => `website UI with a ${t} visual style`)

  console.log(`Using ${prompts.length} prompts to regenerate embedding...`)
  console.log(`First 5 prompts: ${prompts.slice(0, 5).join(', ')}...\n`)

  // Regenerate embedding using the same method
  const vecs = await embedTextBatch(prompts)
  const avg = meanVec(vecs)
  const freshEmbedding = l2norm(avg)

  // Compare the embeddings themselves
  const embeddingSimilarity = cosine(storedEmbedding, freshEmbedding)
  console.log('='.repeat(80))
  console.log('EMBEDDING COMPARISON')
  console.log('='.repeat(80))
  console.log(`Similarity between stored and fresh embedding: ${embeddingSimilarity.toFixed(4)}`)
  console.log(`(1.0 = identical, <0.9 = significantly different)\n`)

  // Test on actual images
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

  console.log('='.repeat(80))
  console.log('SCORE COMPARISON ON TEST IMAGES')
  console.log('='.repeat(80))
  console.log('Site URL | Stored Score | Fresh Score | Difference')
  console.log('-'.repeat(80))

  let storedTotal = 0
  let freshTotal = 0
  let count = 0

  for (const site of sites) {
    for (const img of site.images) {
      const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
      if (imageEmbedding.length === 0) continue

      const storedScore = cosine(imageEmbedding, storedEmbedding)
      const freshScore = cosine(imageEmbedding, freshEmbedding)
      const diff = freshScore - storedScore

      const url = site.url.substring(0, 40).padEnd(40)
      console.log(`${url} | ${storedScore.toFixed(4).padStart(11)} | ${freshScore.toFixed(4).padStart(10)} | ${diff > 0 ? '+' : ''}${diff.toFixed(4)}`)

      storedTotal += storedScore
      freshTotal += freshScore
      count++
    }
  }

  const storedAvg = storedTotal / count
  const freshAvg = freshTotal / count
  const improvement = freshAvg - storedAvg

  console.log('-'.repeat(80))
  console.log(`Average: ${' '.repeat(40)} | ${storedAvg.toFixed(4).padStart(11)} | ${freshAvg.toFixed(4).padStart(10)} | ${improvement > 0 ? '+' : ''}${improvement.toFixed(4)}`)
  console.log(`\nImprovement: ${((improvement / storedAvg) * 100).toFixed(1)}%`)
  console.log(`Above 0.18 threshold:`)
  console.log(`  Stored: ${sites.flatMap(s => s.images).filter(img => {
    const emb = (img.embedding?.vector as unknown as number[]) || []
    return emb.length > 0 && cosine(emb, storedEmbedding) >= 0.18
  }).length}/${count}`)
  console.log(`  Fresh:  ${sites.flatMap(s => s.images).filter(img => {
    const emb = (img.embedding?.vector as unknown as number[]) || []
    return emb.length > 0 && cosine(emb, freshEmbedding) >= 0.18
  }).length}/${count}`)

  // Check if embeddings are actually different
  if (embeddingSimilarity < 0.99) {
    console.log('\n' + '='.repeat(80))
    console.log('⚠️  WARNING: Embeddings are significantly different!')
    console.log('='.repeat(80))
    console.log('The stored embedding may have been generated with:')
    console.log('  - Different model version')
    console.log('  - Different prompt format')
    console.log('  - Different normalization')
    console.log('  - Or corrupted during storage')
    console.log('\nRecommendation: Regenerate the "colorful" concept embedding')
  }
}

async function main() {
  try {
    await compareColorfulEmbeddings()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

