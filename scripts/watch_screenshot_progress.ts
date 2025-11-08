import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function checkProgress() {
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
  const timestamp = new Date().toLocaleTimeString()
  
  console.log(`[${timestamp}] 📊 Progress: ${withImages}/${total} (${progress}%) | Images: ${images} | Embeddings: ${imagesWithEmbeddings}`)
  
  return { total, withImages, withoutImages, progress }
}

async function main() {
  console.log('🔍 Monitoring screenshot generation...')
  console.log('Press Ctrl+C to stop\n')
  
  let lastCount = 0
  
  while (true) {
    const { withImages, progress } = await checkProgress()
    
    // If progress changed, show more details
    if (withImages !== lastCount) {
      console.log(`   ⚡ Progress updated! ${withImages - lastCount} new screenshot(s)`)
      lastCount = withImages
    }
    
    if (progress === 100) {
      console.log('\n✅ All screenshots generated!')
      break
    }
    
    // Check every 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000))
  }
  
  await prisma.$disconnect()
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

