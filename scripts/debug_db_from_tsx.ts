#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const dbUrl = process.env.DATABASE_URL || '(undefined)'
  const siteCount = await prisma.site.count()
  const latestSites = await prisma.site.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { title: true, url: true, createdAt: true },
  })

  console.log(JSON.stringify({ DATABASE_URL: dbUrl, siteCount, latestSites }, null, 2))
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  prisma.$disconnect()
})


