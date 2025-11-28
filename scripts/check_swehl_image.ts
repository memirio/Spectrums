#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const site = await prisma.site.findFirst({
    where: { url: 'https://swehl.com' },
    include: {
      images: {
        include: {
          embedding: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })
  
  if (!site) {
    console.log('Site not found')
    await prisma.$disconnect()
    return
  }
  
  console.log('\nSite:', site.title)
  console.log('URL:', site.url)
  console.log('Site imageUrl:', site.imageUrl)
  console.log('Number of images:', site.images.length)
  
  for (const img of site.images) {
    console.log(`\nImage ID: ${img.id}`)
    console.log('  URL:', img.url)
    console.log('  Category:', img.category)
    console.log('  Has embedding:', !!img.embedding)
    if (img.embedding) {
      console.log('  Embedding ID:', img.embedding.id)
    }
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)

