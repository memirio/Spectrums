/**
 * Check what vibe filter extensions exist for "love" query
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function checkLoveVibeFilter() {
  try {
    const term = 'love'
    console.log(`\n🔍 Checking vibe filter extensions for "${term}"...\n`)
    
    // Check vibe filter extensions (source='vibefilter')
    const vibeExtensions = await prisma.queryExpansion.findMany({
      where: {
        term: term.toLowerCase(),
        source: 'vibefilter'
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (vibeExtensions.length === 0) {
      console.log('❌ No vibe filter extensions found for "love"')
      console.log('\nChecking all sources...')
      const all = await prisma.queryExpansion.findMany({
        where: {
          term: term.toLowerCase()
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      console.log(`\nFound ${all.length} total extensions for "love":`)
      all.forEach((ext, i) => {
        console.log(`\n${i + 1}. Source: ${ext.source}, Category: ${ext.category || 'null'}`)
        console.log(`   Expansion: "${ext.expansion}"`)
        console.log(`   Created: ${ext.createdAt}`)
      })
    } else {
      console.log(`✅ Found ${vibeExtensions.length} vibe filter extension(s) for "love":\n`)
      vibeExtensions.forEach((ext, i) => {
        console.log(`${i + 1}. Category: ${ext.category || 'null'}`)
        console.log(`   Expansion: "${ext.expansion}"`)
        console.log(`   Created: ${ext.createdAt}`)
        console.log(`   Has embedding: ${ext.embedding ? 'Yes' : 'No'}`)
        console.log('')
      })
    }
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

checkLoveVibeFilter()

