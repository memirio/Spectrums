#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('📊 Counting website images...')

  // Count all images in website category
  const imageCount = await prisma.image.count({
    where: {
      category: 'website',
    },
  })

  console.log(`\n🖼️ Website images: ${imageCount}`)

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('❌ Error counting website images:', err)
  try {
    await prisma.$disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})


