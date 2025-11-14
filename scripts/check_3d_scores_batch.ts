import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

function cosineSimilarity(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length && i < b.length; i++) {
    sum += a[i] * b[i]
  }
  return sum
}

async function check3DScore(url: string) {
  // Find the site
  const site = await prisma.site.findFirst({
    where: {
      url: {
        contains: url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]
      }
    },
    include: {
      images: {
        include: {
          embedding: true
        }
      }
    }
  })

  if (!site) {
    return { url, found: false }
  }

  const image = site.images.find(img => img.embedding)
  if (!image || !image.embedding) {
    return { url, found: true, hasImage: false }
  }

  const concept3d = await prisma.concept.findFirst({
    where: {
      OR: [
        { id: '3d' },
        { id: '3D' },
        { label: { equals: '3D' } as any }
      ]
    }
  })

  if (!concept3d) {
    return { url, found: true, hasImage: true, hasConcept: false }
  }

  const imageVec = image.embedding.vector as unknown as number[]
  const conceptVec = concept3d.embedding as unknown as number[]

  if (!imageVec || !conceptVec) {
    return { url, found: true, hasImage: true, hasConcept: true, hasVectors: false }
  }

  const score = cosineSimilarity(imageVec, conceptVec)

  const tag = await prisma.imageTag.findFirst({
    where: {
      imageId: image.id,
      conceptId: concept3d.id
    }
  })

  // Get ranking
  const allConcepts = await prisma.concept.findMany()
  const allScores = allConcepts.map(c => ({
    id: c.id,
    score: cosineSimilarity(imageVec, (c.embedding as unknown as number[]) || [])
  }))
  allScores.sort((a, b) => b.score - a.score)
  const rank3d = allScores.findIndex(s => s.id === concept3d.id) + 1

  return {
    url,
    found: true,
    title: site.title,
    score,
    rank: rank3d,
    tagged: !!tag,
    aboveMin: score >= 0.15,
    above3D: score >= 0.18
  }
}

async function main() {
  const urls = [
    'https://abhishekjha.me/',
    'https://daydreamplayer.com/',
    'https://madarplatform.com/en',
    'https://minitap.ai/',
    'https://popup.larosee-cosmetiques.com/',
    'https://www.quantamagazine.org/how-we-came-to-know-earth-20250915'
  ]

  console.log('\n🔍 Checking 3D scores for multiple sites...\n')
  console.log('='.repeat(100))

  const results = []
  for (const url of urls) {
    const result = await check3DScore(url)
    results.push(result)
  }

  console.log('\n📊 Results Summary:\n')
  console.log('Site'.padEnd(50) + 'Score'.padEnd(12) + 'Rank'.padEnd(8) + 'Tagged'.padEnd(10) + 'Above 0.18')
  console.log('-'.repeat(100))

  for (const r of results) {
    if (!r.found) {
      console.log(`${r.url.substring(0, 48).padEnd(50)} ❌ NOT FOUND`)
      continue
    }
    if (!r.hasImage) {
      console.log(`${r.url.substring(0, 48).padEnd(50)} ❌ NO IMAGE`)
      continue
    }
    if (r.score !== undefined) {
      const scoreStr = r.score.toFixed(6).padEnd(12)
      const rankStr = `#${r.rank}`.padEnd(8)
      const taggedStr = (r.tagged ? '✅ YES' : '❌ NO').padEnd(10)
      const aboveStr = r.above3D ? '✅ YES' : '❌ NO'
      console.log(`${(r.title || r.url).substring(0, 48).padEnd(50)}${scoreStr}${rankStr}${taggedStr}${aboveStr}`)
    }
  }

  console.log('\n' + '='.repeat(100))
  console.log('\n📈 Detailed Breakdown:\n')

  for (const r of results) {
    if (!r.found || r.score === undefined) continue
    
    console.log(`\n${r.title || r.url}`)
    console.log(`  URL: ${r.url}`)
    console.log(`  3D Score: ${r.score.toFixed(6)}`)
    console.log(`  Rank: #${r.rank} out of 1201 concepts`)
    console.log(`  Above MIN_SCORE (0.15): ${r.aboveMin ? '✅ YES' : '❌ NO'}`)
    console.log(`  Above 3D threshold (0.18): ${r.above3D ? '✅ YES' : '❌ NO'}`)
    console.log(`  Currently Tagged: ${r.tagged ? '✅ YES' : '❌ NO'}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

