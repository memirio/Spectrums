import { prisma } from '../src/lib/prisma'

async function analyze3DFalsePositives() {
  console.log('Analyzing "3d" tag false positives...\n')

  // Get top 10 images tagged with 3d
  const top10 = [
    'https://www.clou.ch/',
    'https://electrafilmworks.com/',
    'https://www.aether1.ai/',
    'https://www.mastercard.com/businessoutcomes/',
    'https://www.weareinertia.com/',
    'https://www.leoleo.studio/',
    'https://vooban.com/',
    'https://portfolio-25-phi.vercel.app',
    'https://www.reformcollective.com/',
    'https://oflyn.fr/',
  ]

  const images = await prisma.image.findMany({
    where: {
      site: {
        url: { in: top10 }
      }
    },
    include: {
      tags: {
        where: { conceptId: '3d' }
      },
      site: true,
      embedding: true
    }
  })

  console.log('='.repeat(100))
  console.log('TOP 10 "3D" TAGGED IMAGES ANALYSIS')
  console.log('='.repeat(100))

  const threeDConcept = await prisma.concept.findUnique({
    where: { id: '3d' }
  })
  const threeDEmbedding = threeDConcept?.embedding as unknown as number[]

  function cosine(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length)
    let s = 0
    for (let i = 0; i < len; i++) s += a[i] * b[i]
    return s
  }

  for (const img of images) {
    const tag = img.tags.find(t => t.conceptId === '3d')
    const imageEmbedding = (img.embedding?.vector as unknown as number[]) || []
    
    // Calculate zero-shot similarity
    const zeroShotScore = imageEmbedding.length > 0 
      ? cosine(imageEmbedding, threeDEmbedding)
      : 0

    console.log(`\n📍 ${img.site?.url}`)
    console.log(`   Tag score: ${tag?.score.toFixed(4)}`)
    console.log(`   Zero-shot score: ${zeroShotScore.toFixed(4)}`)
    console.log(`   Difference: ${((tag?.score || 0) - zeroShotScore).toFixed(4)}`)
    
    // Get all tags for this image to see what else it's tagged with
    const allTags = await prisma.imageTag.findMany({
      where: { imageId: img.id },
      include: { concept: true },
      orderBy: { score: 'desc' }
    })
    
    console.log(`   Top 10 tags:`)
    allTags.slice(0, 10).forEach((t, i) => {
      console.log(`     ${i+1}. ${t.concept.label.padEnd(25)} ${t.score.toFixed(4)}`)
    })
  }

  // Check threshold and score distribution
  console.log('\n' + '='.repeat(100))
  console.log('THRESHOLD ANALYSIS')
  console.log('='.repeat(100))
  
  const all3DTags = await prisma.imageTag.findMany({
    where: { conceptId: '3d' },
    orderBy: { score: 'desc' }
  })

  const scores = all3DTags.map(t => t.score)
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const median = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]

  console.log(`Total images tagged with "3d": ${all3DTags.length}`)
  console.log(`Score distribution:`)
  console.log(`  Min:     ${min.toFixed(4)}`)
  console.log(`  Max:     ${max.toFixed(4)}`)
  console.log(`  Average: ${avg.toFixed(4)}`)
  console.log(`  Median:  ${median.toFixed(4)}`)
  console.log(`  Threshold: 0.18`)
  console.log(`\nImages above threshold: ${scores.filter(s => s >= 0.18).length}`)
  console.log(`Images below threshold: ${scores.filter(s => s < 0.18).length}`)
  
  // Check if threshold should be higher
  const potentialThresholds = [0.20, 0.22, 0.24, 0.26]
  console.log(`\nIf threshold were higher:`)
  for (const thresh of potentialThresholds) {
    const above = scores.filter(s => s >= thresh).length
    console.log(`  ${thresh.toFixed(2)}: ${above} images (${((above / scores.length) * 100).toFixed(1)}%)`)
  }
}

async function main() {
  try {
    await analyze3DFalsePositives()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

