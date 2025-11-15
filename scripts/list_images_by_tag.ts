import { prisma } from '../src/lib/prisma'

async function listImagesByTag(tagLabel: string) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`Images tagged with "${tagLabel}" (ordered by cosine similarity, then chronologically)`)
  console.log('='.repeat(80))

  // Find the concept (case-insensitive search)
  const allConcepts = await prisma.concept.findMany()
  const concept = allConcepts.find(c => c.label.toLowerCase() === tagLabel.toLowerCase())

  if (!concept) {
    console.log(`❌ No concept found with label "${tagLabel}"`)
    return
  }

  console.log(`\nConcept: ${concept.label} (ID: ${concept.id})`)

  // Get all images tagged with this concept, ordered by score (desc) then by createdAt (asc)
  const imageTags = await prisma.imageTag.findMany({
    where: {
      conceptId: concept.id
    },
    include: {
      image: {
        include: {
          site: true
        }
      }
    },
    orderBy: [
      { score: 'desc' }, // Highest cosine similarity first
      { image: { createdAt: 'asc' } } // Then chronological (oldest first)
    ]
  })

  console.log(`\nTotal images: ${imageTags.length}\n`)

  if (imageTags.length === 0) {
    console.log('No images found with this tag.')
    return
  }

  // Display results
  console.log('Rank | Score    | Created At          | Site URL')
  console.log('-'.repeat(80))
  
  imageTags.forEach((imageTag, index) => {
    const rank = (index + 1).toString().padStart(4)
    const score = imageTag.score.toFixed(4).padStart(8)
    const createdAt = imageTag.image.createdAt.toISOString().split('T')[0] + ' ' + 
                      imageTag.image.createdAt.toISOString().split('T')[1].split('.')[0]
    const siteUrl = imageTag.image.site.url
    
    console.log(`${rank} | ${score} | ${createdAt} | ${siteUrl}`)
  })

  // Summary statistics
  const scores = imageTags.map(it => it.score)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)

  console.log('\n' + '-'.repeat(80))
  console.log(`Statistics:`)
  console.log(`  Average score: ${avgScore.toFixed(4)}`)
  console.log(`  Max score:     ${maxScore.toFixed(4)}`)
  console.log(`  Min score:     ${minScore.toFixed(4)}`)
}

async function main() {
  try {
    await listImagesByTag('3d')
    await listImagesByTag('colorful')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

