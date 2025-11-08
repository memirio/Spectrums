import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const images = await prisma.image.findMany({
    orderBy: { id: 'desc' },
    take: 20,
    select: { id: true },
  })

  if (!images.length) {
    console.log('No images found in DB.')
    return
  }

  const imageIds = images.map(i => i.id)
  const [embeds, tags] = await Promise.all([
    prisma.imageEmbedding.findMany({
      where: { imageId: { in: imageIds }, model: 'clip-ViT-L/14' },
      select: { imageId: true },
    }),
    prisma.imageTag.groupBy({
      by: ['imageId'],
      where: { imageId: { in: imageIds } },
      _count: { _all: true },
    }),
  ])

  const embedSet = new Set(embeds.map(e => e.imageId))
  const tagMap = new Map(tags.map(t => [t.imageId, t._count._all]))

  console.log('\nRecent images (newest first by id):')
  for (const img of images) {
    const hasEmbed = embedSet.has(img.id)
    const tagCount = tagMap.get(img.id) ?? 0
    console.log(`• ${img.id}\n  -> embedding: ${hasEmbed ? 'yes' : 'NO'} | tags: ${tagCount}`)
  }
}

main().catch(err => {
  console.error(err)
}).finally(async () => {
  await prisma.$disconnect()
  process.exit(0)
})


