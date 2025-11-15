import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

/**
 * Regenerate the "3d" concept embedding with a more specific focus
 * to reduce false positives (abstract/futuristic aesthetics vs actual 3D elements)
 */
async function regenerate3DEmbedding() {
  console.log('REGENERATING 3D EMBEDDING WITH MORE SPECIFIC FOCUS\n')
  console.log('='.repeat(80))

  // Get current 3d concept
  const threeD = await prisma.concept.findUnique({
    where: { id: '3d' }
  })

  if (!threeD) {
    console.log('❌ 3d concept not found')
    process.exit(1)
  }

  // Use more specific prompts that emphasize actual 3D graphics/rendering
  // rather than abstract/futuristic aesthetics
  const specificPrompts = [
    'website UI with 3D graphics and depth',
    'website UI with three-dimensional rendered elements',
    'website UI with 3D visual effects',
    'website UI with 3D rendered graphics',
    'website UI with volumetric 3D design',
  ]

  console.log('Generating new embedding with specific prompts:')
  specificPrompts.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))

  const vecs = await embedTextBatch(specificPrompts)
  const newEmbedding = l2norm(meanVec(vecs))

  // Update in database
  await prisma.concept.update({
    where: { id: '3d' },
    data: {
      embedding: newEmbedding
    }
  })

  console.log('\n✅ Successfully regenerated 3d embedding')
  console.log('   Embedding length:', newEmbedding.length)
  console.log('   L2 norm:', Math.sqrt(newEmbedding.reduce((s, x) => s + x * x, 0)).toFixed(6))

  // Test on sample images
  console.log('\n' + '='.repeat(80))
  console.log('TESTING NEW EMBEDDING ON SAMPLE IMAGES:')
  console.log('='.repeat(80))

  function cosine(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length)
    let s = 0
    for (let i = 0; i < len; i++) s += a[i] * b[i]
    return s
  }

  const testUrls = [
    { url: 'https://www.clou.ch/', type: 'FP' },
    { url: 'https://vooban.com/', type: 'FP' },
    { url: 'https://www.aether1.ai/', type: 'TP' },
    { url: 'https://www.mastercard.com/businessoutcomes/', type: 'TP' },
  ]

  for (const { url, type } of testUrls) {
    const img = await prisma.image.findFirst({
      where: { site: { url } },
      include: { embedding: true }
    })

    if (img && img.embedding) {
      const imgEmb = (img.embedding.vector as unknown as number[]) || []
      const score = cosine(newEmbedding, imgEmb)
      const marker = type === 'TP' ? '✅' : '❌'
      console.log(`${marker} ${type}: ${url.substring(0, 50).padEnd(50)} ${score.toFixed(4)}`)
    }
  }

  console.log('\n⚠️  NOTE: You will need to re-tag all images for this change to take effect.')
  console.log('   Run: npx tsx scripts/sync_and_retag_all.ts')
}

async function main() {
  try {
    await regenerate3DEmbedding()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

