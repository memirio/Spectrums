#!/usr/bin/env tsx
/**
 * Update Pinterest packaging entries to just "Pinterest"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔄 Updating Pinterest packaging titles...\n')

  // Find all sites with Pinterest URLs that have "Packaging" in the title
  const pinterestSites = await prisma.site.findMany({
    where: {
      url: {
        contains: 'pinterest.com/pin/',
      },
      title: {
        contains: 'Pinterest',
      },
    },
  })

  console.log(`📊 Found ${pinterestSites.length} Pinterest entries to update\n`)

  let updated = 0
  for (const site of pinterestSites) {
    if (site.title && site.title.includes('Pinterest') && site.title !== 'Pinterest') {
      await prisma.site.update({
        where: { id: site.id },
        data: { title: 'Pinterest' },
      })
      console.log(`✅ Updated: ${site.title} → Pinterest`)
      updated++
    }
  }

  console.log(`\n📊 SUMMARY`)
  console.log(`✅ Updated: ${updated} entries`)
  console.log(`\n✅ Done!`)

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('❌ Script failed:', err)
  try {
    await prisma.$disconnect()
  } catch {
    // ignore
  }
  process.exit(1)
})

