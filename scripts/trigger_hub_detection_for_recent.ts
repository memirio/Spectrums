import 'dotenv/config'
import { triggerHubDetectionForImages } from '../src/jobs/hub-detection-trigger'

async function main() {
  console.log('Triggering hub detection for recent submission...\n')

  // Get the most recent image ID
  const { prisma } = await import('../src/lib/prisma')
  const recentImage = await prisma.image.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
    },
  })

  if (!recentImage) {
    console.log('No recent images found.')
    return
  }

  console.log(`Image ID: ${recentImage.id}`)
  console.log('Triggering hub detection (force mode - runs immediately)...\n')

  // Force run immediately (bypass debounce)
  await triggerHubDetectionForImages([recentImage.id], { force: true })

  console.log('✅ Hub detection triggered successfully!')
  console.log('   It may take a few minutes to complete.\n')

  await prisma.$disconnect()
}

main().catch(console.error)

