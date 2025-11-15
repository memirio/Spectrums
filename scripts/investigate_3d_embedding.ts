import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function investigate3DEmbedding() {
  console.log('INVESTIGATING 3D EMBEDDING ISSUE\n')
  console.log('='.repeat(80))

  // Get current 3d concept
  const threeD = await prisma.concept.findUnique({
    where: { id: '3d' }
  })

  if (!threeD || !threeD.embedding) {
    console.log('❌ 3d concept not found or has no embedding')
    process.exit(1)
  }

  const currentEmbedding = threeD.embedding as unknown as number[]
  const synonyms = (threeD.synonyms as unknown as string[]) || []
  const related = (threeD.related as unknown as string[]) || []

  console.log('Current 3d concept:')
  console.log(`  Label: ${threeD.label}`)
  console.log(`  Synonyms: ${synonyms.length} terms`)
  console.log(`  Related: ${related.length} terms`)
  console.log(`  Total tokens in embedding: ${1 + synonyms.length + related.length}`)

  // Test different embedding approaches
  console.log('\n' + '='.repeat(80))
  console.log('TESTING DIFFERENT EMBEDDING APPROACHES:')
  console.log('='.repeat(80))

  // Approach 1: Current (with all synonyms/related)
  console.log('\n1. Current approach (label + synonyms + related):')
  const tokens1 = ['3d', ...synonyms, ...related]
  const prompts1 = tokens1.map(t => `website UI with a ${t} visual style`)
  const vecs1 = await embedTextBatch(prompts1)
  const embedding1 = l2norm(meanVec(vecs1))
  const similarity1 = cosine(currentEmbedding, embedding1)
  console.log(`   Similarity to stored: ${similarity1.toFixed(4)}`)
  console.log(`   Tokens used: ${tokens1.length}`)

  // Approach 2: Just label + key synonyms
  console.log('\n2. Simplified (label + key synonyms only):')
  const keySynonyms = ['three-dimensional', '3d-rendering', 'volumetric']
  const tokens2 = ['3d', ...keySynonyms]
  const prompts2 = tokens2.map(t => `website UI with a ${t} visual style`)
  const vecs2 = await embedTextBatch(prompts2)
  const embedding2 = l2norm(meanVec(vecs2))
  const similarity2 = cosine(currentEmbedding, embedding2)
  console.log(`   Similarity to stored: ${similarity2.toFixed(4)}`)
  console.log(`   Tokens used: ${tokens2.length}`)

  // Approach 3: Just the label
  console.log('\n3. Minimal (label only):')
  const tokens3 = ['3d']
  const prompts3 = tokens3.map(t => `website UI with a ${t} visual style`)
  const vecs3 = await embedTextBatch(prompts3)
  const embedding3 = l2norm(meanVec(vecs3))
  const similarity3 = cosine(currentEmbedding, embedding3)
  console.log(`   Similarity to stored: ${similarity3.toFixed(4)}`)
  console.log(`   Tokens used: ${tokens3.length}`)

  // Approach 4: More specific prompt
  console.log('\n4. More specific prompt (3D graphics focus):')
  const specificPrompts = [
    'website UI with 3D graphics and depth',
    'website UI with three-dimensional rendered elements',
    'website UI with 3D visual effects'
  ]
  const vecs4 = await embedTextBatch(specificPrompts)
  const embedding4 = l2norm(meanVec(vecs4))
  const similarity4 = cosine(currentEmbedding, embedding4)
  console.log(`   Similarity to stored: ${similarity4.toFixed(4)}`)

  // Test on false positives and true positives
  console.log('\n' + '='.repeat(80))
  console.log('TESTING ON FALSE POSITIVES vs TRUE POSITIVES:')
  console.log('='.repeat(80))

  const falsePositives = [
    'https://www.clou.ch/',
    'https://vooban.com/',
    'https://www.reformcollective.com/',
  ]

  const truePositives = [
    'https://www.aether1.ai/',
    'https://www.mastercard.com/businessoutcomes/',
    'https://www.leoleo.studio/',
  ]

  async function testEmbedding(embedding: number[], name: string) {
    console.log(`\n${name}:`)
    console.log('-'.repeat(80))

    // False positives
    const falseScores: number[] = []
    for (const url of falsePositives) {
      const img = await prisma.image.findFirst({
        where: { site: { url } },
        include: { embedding: true }
      })
      if (img && img.embedding) {
        const imgEmb = (img.embedding.vector as unknown as number[]) || []
        const score = cosine(embedding, imgEmb)
        falseScores.push(score)
        console.log(`  FP: ${url.substring(0, 40).padEnd(40)} ${score.toFixed(4)}`)
      }
    }

    // True positives
    const trueScores: number[] = []
    for (const url of truePositives) {
      const img = await prisma.image.findFirst({
        where: { site: { url } },
        include: { embedding: true }
      })
      if (img && img.embedding) {
        const imgEmb = (img.embedding.vector as unknown as number[]) || []
        const score = cosine(embedding, imgEmb)
        trueScores.push(score)
        console.log(`  TP: ${url.substring(0, 40).padEnd(40)} ${score.toFixed(4)}`)
      }
    }

    const falseAvg = falseScores.reduce((a, b) => a + b, 0) / falseScores.length
    const trueAvg = trueScores.reduce((a, b) => a + b, 0) / trueScores.length
    const separation = trueAvg - falseAvg

    console.log(`\n  False positives avg: ${falseAvg.toFixed(4)}`)
    console.log(`  True positives avg:  ${trueAvg.toFixed(4)}`)
    console.log(`  Separation:          ${separation.toFixed(4)} ${separation > 0 ? '✅' : '❌'}`)
  }

  await testEmbedding(embedding1, '1. Current (all synonyms/related)')
  await testEmbedding(embedding2, '2. Simplified (key synonyms)')
  await testEmbedding(embedding3, '3. Minimal (label only)')
  await testEmbedding(embedding4, '4. Specific prompt (3D graphics)')

  // Check what concepts the false positives are actually matching
  console.log('\n' + '='.repeat(80))
  console.log('WHAT ARE FALSE POSITIVES ACTUALLY MATCHING?')
  console.log('='.repeat(80))

  for (const url of falsePositives.slice(0, 2)) {
    const img = await prisma.image.findFirst({
      where: { site: { url } },
      include: {
        tags: {
          include: { concept: true },
          orderBy: { score: 'desc' }
        }
      }
    })

    if (img) {
      console.log(`\n${url}:`)
      console.log(`  Top 15 tags:`)
      img.tags.slice(0, 15).forEach((t, i) => {
        const is3d = t.conceptId === '3d'
        const marker = is3d ? ' 👈 3D' : ''
        console.log(`    ${(i + 1).toString().padStart(2)}. ${t.concept.label.padEnd(25)} ${t.score.toFixed(4)}${marker}`)
      })
    }
  }
}

async function main() {
  try {
    await investigate3DEmbedding()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

