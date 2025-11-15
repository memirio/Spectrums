import { prisma } from '../src/lib/prisma'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import { tagImage } from '../src/jobs/tagging'

/**
 * Re-tag all images with the new threshold (0.20) and updated logic (no category guarantees)
 * This removes false positives and ensures only images that truly contain concepts are tagged
 */
async function retagAllImages() {
  console.log('🔄 Re-tagging all images with new threshold and logic...\n')
  console.log(`New MIN_SCORE: ${TAG_CONFIG.MIN_SCORE}`)
  console.log('Category guarantees: REMOVED\n')
  console.log('='.repeat(80))

  const images = await prisma.image.findMany({
    select: { id: true, url: true },
    orderBy: { createdAt: 'asc' }
  })

  console.log(`Found ${images.length} images to re-tag\n`)

  let processed = 0
  let errors = 0
  const startTime = Date.now()

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    
    try {
      await tagImage(image.id)
      processed++
      
      if ((i + 1) % 10 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        const rate = (processed / ((Date.now() - startTime) / 1000)).toFixed(1)
        console.log(`Progress: ${i + 1}/${images.length} (${((i + 1) / images.length * 100).toFixed(1)}%) | ${processed} processed, ${errors} errors | ${rate} img/s`)
      }
    } catch (error: any) {
      errors++
      console.error(`❌ Error tagging image ${image.id}: ${error.message}`)
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('\n' + '='.repeat(80))
  console.log('✅ Re-tagging complete!')
  console.log(`   Processed: ${processed} images`)
  console.log(`   Errors: ${errors} images`)
  console.log(`   Time: ${elapsed}s`)
  console.log(`   Rate: ${(processed / parseFloat(elapsed)).toFixed(1)} img/s`)
  
  // Show statistics
  const totalTags = await prisma.imageTag.count()
  const avgTagsPerImage = totalTags / images.length
  console.log(`\n📊 Statistics:`)
  console.log(`   Total tags: ${totalTags}`)
  console.log(`   Average tags per image: ${avgTagsPerImage.toFixed(1)}`)
  
  // Check 3d tags specifically
  const threeDTags = await prisma.imageTag.count({
    where: { conceptId: '3d' }
  })
  console.log(`   Images tagged with "3d": ${threeDTags}`)
}

async function main() {
  try {
    await retagAllImages()
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

