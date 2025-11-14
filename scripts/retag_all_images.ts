import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { tagImage } from '../src/jobs/tagging'

async function retagAllImages() {
  console.log('🔄 Starting retagging of all images with new threshold (0.18)...\n')

  // Get all images with embeddings
  const images = await prisma.image.findMany({
    where: {
      embedding: {
        isNot: null
      }
    },
    include: {
      site: true,
      embedding: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log(`Found ${images.length} images to retag\n`)
  console.log('='.repeat(80))

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ imageId: string; url: string; error: string }> = []

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const site = image.site
    const progress = `[${i + 1}/${images.length}]`

    try {
      console.log(`${progress} Tagging: ${site?.title || 'Unknown'} (${site?.url || 'N/A'})`)
      
      await tagImage(image.id)
      
      successCount++
      
      if ((i + 1) % 10 === 0) {
        console.log(`\n✅ Progress: ${i + 1}/${images.length} (${successCount} success, ${errorCount} errors)\n`)
      }
    } catch (error: any) {
      errorCount++
      const errorMsg = error?.message || String(error)
      errors.push({
        imageId: image.id,
        url: site?.url || 'N/A',
        error: errorMsg
      })
      console.error(`${progress} ❌ Error: ${errorMsg}`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 Retagging Complete!\n')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📈 Total: ${images.length}`)

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.slice(0, 10).forEach(e => {
      console.log(`  - ${e.url}: ${e.error}`)
    })
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`)
    }
  }

  console.log('\n✨ All images have been retagged with the new threshold (0.18)')
}

retagAllImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
