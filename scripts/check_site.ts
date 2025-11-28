#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const url = 'https://swehl.com'
  const normalizedUrl = url.replace(/\/$/, '')
  
  const site = await prisma.site.findFirst({
    where: { 
      url: { 
        in: [url, normalizedUrl, url + '/', normalizedUrl + '/']
      }
    },
    include: {
      images: {
        select: {
          id: true,
          url: true,
          category: true,
          width: true,
          height: true
        }
      }
    }
  })
  
  if (site) {
    console.log('\n✅ Site found:')
    console.log(`   Title: ${site.title}`)
    console.log(`   URL: ${site.url}`)
    console.log(`   Image URL: ${site.imageUrl || 'null'}`)
    console.log(`   Images: ${site.images.length}`)
    site.images.forEach(img => {
      console.log(`   - Image ID: ${img.id}`)
      console.log(`     URL: ${img.url}`)
      console.log(`     Category: ${img.category}`)
      console.log(`     Size: ${img.width}x${img.height}`)
    })
  } else {
    console.log('\n❌ Site not found in database')
    console.log(`   Searched for: ${url}`)
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)

