import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function investigateColorfulEmbedding() {
  console.log('Investigating "colorful" concept embedding issue...\n')

  // Get the colorful concept
  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })

  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }

  const colorfulEmbedding = colorful.embedding as unknown as number[]
  console.log(`✓ Found "colorful" concept embedding (${colorfulEmbedding.length} dimensions)\n`)

  // Check how the embedding was generated
  console.log('='.repeat(80))
  console.log('HOW "COLORFUL" EMBEDDING WAS GENERATED')
  console.log('='.repeat(80))
  const synonyms = (colorful.synonyms as unknown as string[]) || []
  const related = (colorful.related as unknown as string[]) || []
  const tokens = [colorful.label, ...synonyms, ...related]
  const prompts = tokens.map(t => `website UI with a ${t} visual style`)
  
  console.log('Tokens used:', tokens.slice(0, 10).join(', '), tokens.length > 10 ? '...' : '')
  console.log('Prompts used:', prompts.slice(0, 3).join('\n  - '), prompts.length > 3 ? '\n  - ...' : '')
  console.log(`Total prompts: ${prompts.length}\n`)

  // Test different embedding approaches
  console.log('='.repeat(80))
  console.log('TESTING DIFFERENT EMBEDDING APPROACHES')
  console.log('='.repeat(80))

  const testPrompts = [
    'colorful',  // Simple word
    'website UI with a colorful visual style',  // Current approach
    'a colorful website design',  // Alternative 1
    'colorful user interface',  // Alternative 2
    'vibrant and colorful design',  // Alternative 3
    'website with bright colors',  // Alternative 4
  ]

  console.log('\nEmbedding different prompts and comparing with current embedding:\n')
  const testEmbeddings = await embedTextBatch(testPrompts)
  
  console.log('Prompt | Cosine Similarity to Current Embedding')
  console.log('-'.repeat(80))
  for (let i = 0; i < testPrompts.length; i++) {
    const similarity = cosine(testEmbeddings[i], colorfulEmbedding)
    console.log(`${testPrompts[i].padEnd(50)} | ${similarity.toFixed(4)}`)
  }

  // Check specific websites
  const targetUrls = [
    'https://www.easytomorrow.com/en',
    'https://palermo.ddd.live/',
    'https://compsych.konpo.co/',
    'https://stripe.com/en-se',
    'https://www.walrus.xyz/',
    'https://ponpon-mania.com/chapters',
    'https://ponpon-mania.com/',
    'https://experiencethebestyou.com/',
  ]

  console.log('\n' + '='.repeat(80))
  console.log('CHECKING SPECIFIC WEBSITES')
  console.log('='.repeat(80))

  const sites = await prisma.site.findMany({
    where: {
      url: { in: targetUrls }
    },
    include: {
      images: {
        include: {
          embedding: true,
          tags: {
            where: { conceptId: 'colorful' }
          }
        }
      }
    }
  })

  console.log(`\nFound ${sites.length} sites from the list\n`)

  for (const site of sites) {
    console.log(`\n📍 ${site.url}`)
    console.log(`   Title: ${site.title}`)
    
    for (const img of site.images) {
      const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
      if (imageEmbedding.length === 0) {
        console.log(`   ⚠️  Image ${img.id}: No embedding`)
        continue
      }

      const score = cosine(imageEmbedding, colorfulEmbedding)
      const hasTag = img.tags.length > 0
      const threshold = 0.18
      
      console.log(`   Image ${img.id}:`)
      console.log(`     Score: ${score.toFixed(4)} (threshold: ${threshold})`)
      console.log(`     Tagged: ${hasTag ? '✓' : '✗'}`)
      console.log(`     Gap: ${(threshold - score).toFixed(4)}`)
    }
  }

  // Compare with "3d" to see the difference
  console.log('\n' + '='.repeat(80))
  console.log('COMPARING WITH "3D" CONCEPT')
  console.log('='.repeat(80))

  const threeD = await prisma.concept.findUnique({
    where: { id: '3d' }
  })

  if (threeD) {
    const threeDEmbedding = threeD.embedding as unknown as number[]
    const threeDSynonyms = (threeD.synonyms as unknown as string[]) || []
    const threeDRelated = (threeD.related as unknown as string[]) || []
    const threeDTokens = [threeD.label, ...threeDSynonyms, ...threeDRelated]
    const threeDPrompts = threeDTokens.map(t => `website UI with a ${t} visual style`)

    console.log(`\n"3D" concept:`)
    console.log(`  Tokens: ${threeDTokens.slice(0, 10).join(', ')}${threeDTokens.length > 10 ? '...' : ''}`)
    console.log(`  Total prompts: ${threeDPrompts.length}`)
    
    // Check one of the colorful sites with 3D scores
    if (sites.length > 0 && sites[0].images.length > 0) {
      const testImage = sites[0].images[0]
      const testImageEmbedding = (testImage.embedding?.vector as unknown as number[]) || []
      if (testImageEmbedding.length > 0) {
        const colorfulScore = cosine(testImageEmbedding, colorfulEmbedding)
        const threeDScore = cosine(testImageEmbedding, threeDEmbedding)
        console.log(`\n  Example comparison (${sites[0].url}):`)
        console.log(`    Colorful score: ${colorfulScore.toFixed(4)}`)
        console.log(`    3D score:      ${threeDScore.toFixed(4)}`)
        console.log(`    Difference:    ${(threeDScore - colorfulScore).toFixed(4)}`)
      }
    }
  }
}

async function main() {
  try {
    await investigateColorfulEmbedding()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

