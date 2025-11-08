import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function monitor() {
  const total = await prisma.site.count()
  const withImages = await prisma.site.count({
    where: { images: { some: {} } }
  })
  const withoutImages = total - withImages
  const images = await prisma.image.count()
  const imagesWithEmbeddings = await prisma.image.count({
    where: { embedding: { isNot: null } }
  })
  
  const progress = total > 0 ? Math.round((withImages / total) * 100) : 0
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 Screenshot Generation Progress')
  console.log('═'.repeat(60))
  console.log(`   Total sites:          ${total}`)
  console.log(`   Sites with screenshots: ${withImages} ✅`)
  console.log(`   Sites pending:        ${withoutImages} ⏳`)
  console.log(`   Total images:         ${images}`)
  console.log(`   Images with embeddings: ${imagesWithEmbeddings} 🤖`)
  console.log(`   Progress:             ${withImages}/${total} (${progress}%)`)
  
  if (withoutImages > 0) {
    const remaining = await prisma.site.findMany({
      where: { images: { none: {} } },
      take: 5,
      select: { title: true, url: true }
    })
    console.log('\n   Next 5 sites pending:')
    remaining.forEach(s => console.log(`     • ${s.title}`))
  }
  
  console.log('═'.repeat(60) + '\n')
}

async function main() {
  await monitor()
  await prisma.$disconnect()
}

main().catch(console.error)

