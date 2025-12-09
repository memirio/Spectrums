import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Checking tag usage in queries...\n')

  // Check if image_tags table has data
  const tagCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count FROM image_tags
  `
  console.log(`📊 Total image tags in database: ${tagCount[0].count}\n`)

  // Check if tags are used in /api/sites queries
  console.log('✅ Tags ARE used in /api/sites route:')
  console.log('   - When filtering by concepts (concept scales)')
  console.log('   - Uses image_tags table to find sites where images have ALL selected concepts')
  console.log('   - Query: JOIN image_tags ON images.id = image_tags.imageId\n')

  // Check if tags are used in /api/search queries
  console.log('❌ Tags are NOT used in /api/search route (main zero-shot path):')
  console.log('   - Main search uses only embeddings + pgvector')
  console.log('   - No tag filtering or tag-based scoring\n')

  // Check fallback path
  console.log('⚠️  Tags ARE used in /api/search fallback path (legacy concept-expansion):')
  console.log('   - Only used if zeroShot parameter is false')
  console.log('   - Includes tags in query: include: { embedding: true, tags: true }')
  console.log('   - Boosts score by +0.02 for each matching tag\n')

  // Check if fallback is ever called
  console.log('🔍 Checking if fallback path is used...')
  console.log('   - Need to check if zeroShot parameter is ever set to false')
  console.log('   - Default behavior uses zero-shot (embeddings only)\n')

  // Sample some tags to see what's in there
  const sampleTags = await prisma.imageTag.findMany({
    take: 5,
    include: {
      concept: {
        select: {
          id: true,
          label: true,
        },
      },
      image: {
        select: {
          id: true,
          category: true,
        },
      },
    },
  })

  if (sampleTags.length > 0) {
    console.log('📋 Sample tags:')
    sampleTags.forEach((tag, i) => {
      console.log(`   ${i + 1}. Image ${tag.imageId.substring(0, 12)}... (${tag.image.category})`)
      console.log(`      Concept: ${tag.concept.label} (${tag.concept.id})`)
      console.log(`      Score: ${tag.score.toFixed(4)}\n`)
    })
  }

  await prisma.$disconnect()
}

main().catch(console.error)

