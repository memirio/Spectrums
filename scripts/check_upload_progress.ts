#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const targetUrls = [
  'https://saraheismanstudio.com',
  'https://aneshk.design',
  'https://www.shapes.gallery',
  'https://www.davehawkins.co',
  'https://balajmarius.com',
  'https://www.manifold.bio',
  'https://kereliott.com',
  'https://dreamrecorder.ai',
  'https://www.creativesouth.com',
  'https://zigzaglife.in',
  'https://www.re-do.studio',
  'https://elliott.mangham.dev',
  'https://deadsimplejobs.com',
  'https://banch.bausola.com/en',
  'https://do-undo.com',
  'https://bridgingtables.com',
  'https://noir.global',
  'https://www.tabs.com',
  'https://legora.com',
]

async function main() {
  const sites = await prisma.site.findMany({
    where: { url: { in: targetUrls } },
    select: { 
      id: true, 
      title: true, 
      url: true, 
      imageUrl: true,
      images: {
        select: {
          id: true,
          category: true
        }
      }
    }
  })
  
  console.log(`\n📊 Upload Progress: ${sites.length}/19 sites found\n`)
  
  let withImages = 0
  let withTags = 0
  
  for (const site of sites) {
    const image = site.images[0]
    const hasImage = !!image
    let tagCount = 0
    
    if (hasImage) {
      withImages++
      tagCount = await prisma.imageTag.count({
        where: { imageId: image.id }
      })
      if (tagCount > 0) withTags++
    }
    
    const status = tagCount > 0 ? '✅ Complete' : hasImage ? '🔄 Processing' : '⏳ Pending'
    console.log(`${status} ${site.title}`)
    console.log(`   URL: ${site.url}`)
    if (hasImage) {
      console.log(`   Image: ${image.id} (${tagCount} tags)`)
    }
    console.log()
  }
  
  console.log(`\nSummary:`)
  console.log(`  Sites created: ${sites.length}/19`)
  console.log(`  With images: ${withImages}`)
  console.log(`  With tags: ${withTags}`)
  console.log(`  Still processing: ${withImages - withTags}\n`)
  
  await prisma.$disconnect()
}

main().catch(console.error)

