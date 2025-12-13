/**
 * Check what extensions exist for "love" query
 * Shows both vibe filter and search bar extensions
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function checkLoveExtensions() {
  try {
    const term = 'love'
    console.log(`\n🔍 Checking extensions for "${term}"...\n`)
    
    // Check all extensions for this term (any source)
    console.log('📊 ALL EXTENSIONS FOR "love" (any source):')
    console.log('='.repeat(80))
    const allExtensions = await prisma.queryExpansion.findMany({
      where: {
        term: term.toLowerCase()
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (allExtensions.length === 0) {
      console.log('  ❌ No extensions found at all')
    } else {
      const bySource = new Map<string, typeof allExtensions>()
      allExtensions.forEach(ext => {
        const source = ext.source || 'unknown'
        if (!bySource.has(source)) {
          bySource.set(source, [])
        }
        bySource.get(source)!.push(ext)
      })
      
      for (const [source, exts] of bySource.entries()) {
        console.log(`\n  📌 Source: "${source}" (${exts.length} extension(s))`)
        exts.forEach((ext, i) => {
          console.log(`\n     ${i + 1}. Category: ${ext.category || 'null'}`)
          console.log(`        Extension: "${ext.expansion}"`)
          console.log(`        Created: ${ext.createdAt}`)
          console.log(`        Has embedding: ${ext.embedding ? 'Yes' : 'No'}`)
        })
      }
    }
    
    // Check vibe filter extensions (new name)
    console.log('\n\n📊 VIBE FILTER EXTENSIONS (source="vibefilter"):')
    console.log('='.repeat(80))
    const vibeExtensions = await prisma.queryExpansion.findMany({
      where: {
        term: term.toLowerCase(),
        source: 'vibefilter'
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (vibeExtensions.length === 0) {
      console.log('  ❌ No vibe filter extensions found')
    } else {
      vibeExtensions.forEach((ext, i) => {
        console.log(`\n  ${i + 1}. Category: ${ext.category || 'null'}`)
        console.log(`     Extension: "${ext.expansion}"`)
        console.log(`     Created: ${ext.createdAt}`)
        console.log(`     Has embedding: ${ext.embedding ? 'Yes' : 'No'}`)
      })
    }
    
    // Check search bar extensions (new name)
    console.log('\n\n📊 SEARCH BAR EXTENSIONS (source="searchbar"):')
    console.log('='.repeat(80))
    const searchExtensions = await prisma.queryExpansion.findMany({
      where: {
        term: term.toLowerCase(),
        source: 'searchbar'
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (searchExtensions.length === 0) {
      console.log('  ❌ No search bar extensions found')
    } else {
      searchExtensions.forEach((ext, i) => {
        console.log(`\n  ${i + 1}. Category: ${ext.category || 'null'}`)
        console.log(`     Extension: "${ext.expansion}"`)
        console.log(`     Created: ${ext.createdAt}`)
        console.log(`     Has embedding: ${ext.embedding ? 'Yes' : 'No'}`)
      })
    }
    
    // Summary
    console.log('\n\n📈 SUMMARY:')
    console.log('='.repeat(80))
    console.log(`  Vibe filter extensions: ${vibeExtensions.length}`)
    console.log(`  Search bar extensions: ${searchExtensions.length}`)
    
    const categories = new Set([
      ...vibeExtensions.map(e => e.category),
      ...searchExtensions.map(e => e.category)
    ])
    console.log(`  Categories with extensions: ${Array.from(categories).join(', ')}`)
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    // Don't disconnect - prisma is a singleton
  }
}

// Run if called directly
if (require.main === module) {
  checkLoveExtensions()
    .then(() => {
      console.log('\n✅ Done\n')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed:', error)
      process.exit(1)
    })
}

export { checkLoveExtensions }

