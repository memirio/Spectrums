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
  console.log(`\n🔍 Checking 3D score for: ${url}\n`)

  // Find the site
  const site = await prisma.site.findFirst({
    where: {
      url: {
        contains: url.replace('https://', '').replace('http://', '').replace('www.', '')
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
    console.log(`❌ Site not found: ${url}`)
    return
  }

  console.log(`✅ Site found: ${site.title}`)
  console.log(`   URL: ${site.url}`)
  console.log(`   Image count: ${site.images.length}`)

  if (site.images.length === 0) {
    console.log(`❌ No images found for this site`)
    return
  }

  // Get the first image with embedding
  const image = site.images.find(img => img.embedding)
  if (!image || !image.embedding) {
    console.log(`❌ No image embedding found`)
    return
  }

  console.log(`\n📸 Using image: ${image.url}`)

  // Get the 3D concept
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
    console.log(`❌ 3D concept not found in database`)
    return
  }

  console.log(`\n🎯 3D Concept found: ${concept3d.label} (ID: ${concept3d.id})`)

  // Calculate cosine similarity
  const imageVec = image.embedding.vector as unknown as number[]
  const conceptVec = concept3d.embedding as unknown as number[]

  if (!imageVec || !conceptVec) {
    console.log(`❌ Missing embedding vectors`)
    return
  }

  const score = cosineSimilarity(imageVec, conceptVec)

  console.log(`\n📊 Results:`)
  console.log(`   Cosine Similarity Score: ${score.toFixed(6)}`)
  console.log(`   MIN_SCORE threshold: 0.15`)
  console.log(`   3D-specific threshold: 0.18`)
  console.log(`   Above MIN_SCORE (0.15): ${score >= 0.15 ? '✅ YES' : '❌ NO'}`)
  console.log(`   Above 3D threshold (0.18): ${score >= 0.18 ? '✅ YES' : '❌ NO'}`)

  // Check if it's currently tagged
  const tag = await prisma.imageTag.findFirst({
    where: {
      imageId: image.id,
      conceptId: concept3d.id
    }
  })

  if (tag) {
    console.log(`\n🏷️  Current tag status: TAGGED (score: ${tag.score.toFixed(6)})`)
  } else {
    console.log(`\n🏷️  Current tag status: NOT TAGGED`)
  }

  // Get all concept scores for context
  const allConcepts = await prisma.concept.findMany()
  const allScores = allConcepts.map(c => ({
    id: c.id,
    label: c.label,
    score: cosineSimilarity(imageVec, (c.embedding as unknown as number[]) || [])
  }))
  allScores.sort((a, b) => b.score - a.score)

  const rank3d = allScores.findIndex(s => s.id === concept3d.id) + 1
  console.log(`\n📈 Ranking:`)
  console.log(`   3D rank: #${rank3d} out of ${allScores.length} concepts`)
  console.log(`\n   Top 10 concepts:`)
  allScores.slice(0, 10).forEach((s, i) => {
    const marker = s.id === concept3d.id ? ' 🎯' : ''
    console.log(`   ${i + 1}. ${s.label.padEnd(20)} ${s.score.toFixed(6)}${marker}`)
  })
}

const url = process.argv[2] || 'https://www.weareinertia.com/'
check3DScore(url)
  .catch(console.error)
  .finally(() => prisma.$disconnect())

