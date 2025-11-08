// scripts/delete_site_without_image_by_title.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const keyword = (process.argv[2] || '').trim()
  if (!keyword) {
    console.error('Usage: tsx scripts/delete_site_without_image_by_title.ts <keyword>')
    process.exit(1)
  }

  const sites = await prisma.site.findMany({
    where: {
      OR: [
        { title: { contains: keyword } as any },
        { url: { contains: keyword } as any },
      ],
    },
    include: {
      images: true,
    },
  })

  if (sites.length === 0) {
    console.log('No sites found matching keyword:', keyword)
    process.exit(0)
  }

  console.log(`Found ${sites.length} matching sites:`)
  for (const s of sites) {
    console.log(`- ${s.title} | ${s.url} | imageUrl=${s.imageUrl ?? 'null'} | images=${s.images.length}`)
  }

  // Choose deletions: no images OR null imageUrl
  const toDelete = sites.filter(s => (s.images.length === 0) || !s.imageUrl)

  if (toDelete.length === 0) {
    console.log('No sites without images or with null imageUrl to delete.')
    process.exit(0)
  }

  for (const del of toDelete) {
    console.log(`Deleting: ${del.title} (${del.url}) ...`)
    // Delete related records first
    const imageIds = del.images.map(i => i.id)
    if (imageIds.length > 0) {
      await prisma.imageTag.deleteMany({ where: { imageId: { in: imageIds } } })
      await prisma.imageEmbedding.deleteMany({ where: { imageId: { in: imageIds } } })
      await prisma.image.deleteMany({ where: { id: { in: imageIds } } })
    }
    await prisma.siteTag.deleteMany({ where: { siteId: del.id } })
    await prisma.site.delete({ where: { id: del.id } })
    console.log('  ✓ Deleted')
  }

  console.log('\nDone.')
}

main().catch(e => { console.error(e); process.exit(1) })
