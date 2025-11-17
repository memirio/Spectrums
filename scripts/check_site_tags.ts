import { prisma } from '../src/lib/prisma'

async function main() {
  const siteUrl = process.argv[2] || 'synchronized.studio'
  
  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { url: { contains: siteUrl } },
        { title: { contains: siteUrl } },
      ],
    },
    include: {
      images: {
        include: {
          tags: {
            include: { concept: true },
            orderBy: { score: 'desc' },
          },
        },
      },
    },
  })
  
  if (!site) {
    console.log(`❌ Site not found: ${siteUrl}`)
    await prisma.$disconnect()
    return
  }
  
  console.log(`📌 Site: ${site.title}`)
  console.log(`🔗 URL: ${site.url}`)
  console.log(`🖼️  Images: ${site.images.length}`)
  console.log()
  
  for (const img of site.images) {
    console.log(`📸 Image ID: ${img.id.substring(0, 12)}...`)
    console.log(`📊 Tags (${img.tags.length} total):`)
    img.tags.slice(0, 20).forEach(t => {
      console.log(`   - ${t.concept.label} (score: ${t.score.toFixed(4)})`)
    })
    if (img.tags.length > 20) {
      console.log(`   ... and ${img.tags.length - 20} more`)
    }
    console.log()
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)
