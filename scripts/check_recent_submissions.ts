import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Checking recent submissions...\n')

  // Get the most recent images (last 5)
  const recentImages = await prisma.image.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      embedding: true,
      site: {
        select: {
          id: true,
          title: true,
          url: true,
        },
      },
    },
  })

  if (recentImages.length === 0) {
    console.log('No images found in database.')
    return
  }

  console.log(`Found ${recentImages.length} recent image(s):\n`)

  for (const image of recentImages) {
    console.log(`📸 Image ID: ${image.id}`)
    console.log(`   URL: ${image.url.substring(0, 80)}...`)
    console.log(`   Category: ${image.category}`)
    console.log(`   Created: ${image.createdAt.toISOString()}`)
    
    if (image.site) {
      console.log(`   Site: ${image.site.title} (${image.site.url})`)
    }
    
    if (image.embedding) {
      console.log(`   ✅ Embedding: EXISTS`)
      console.log(`      Model: ${image.embedding.model}`)
      console.log(`      Vector length: ${Array.isArray(image.embedding.vector) ? image.embedding.vector.length : 'N/A'}`)
      console.log(`      Content hash: ${image.embedding.contentHash?.substring(0, 16)}...`)
    } else {
      console.log(`   ❌ Embedding: MISSING`)
    }
    
    // Check for tags
    const tagCount = await prisma.imageTag.count({
      where: { imageId: image.id },
    })
    console.log(`   Tags: ${tagCount} concept tag(s)`)
    
    console.log('')
  }

  await prisma.$disconnect()
}

main().catch(console.error)

