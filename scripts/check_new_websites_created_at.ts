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
      title: true,
      url: true,
      createdAt: true,
      imageUrl: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log('\nNew website entries (by createdAt desc):\n')
  for (const s of sites) {
    console.log(`${s.createdAt.toISOString()}  ${s.title}  ${s.url}`)
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  prisma.$disconnect()
})


