/**
 * Clean vibe filter database entries:
 * 1. Remove old entries with source='groq' (old name)
 * 2. Remove entries with "vibe, extension" format (should be just extension)
 * 3. Keep only clean 7-element extensions with source='vibefilter'
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function cleanVibeFilterDatabase() {
  try {
    console.log('\n🧹 Cleaning vibe filter database entries...\n')
    
    // 1. Find and delete old entries with source='groq'
    const oldGroqEntries = await prisma.queryExpansion.findMany({
      where: {
        source: 'groq'
      }
    })
    
    if (oldGroqEntries.length > 0) {
      console.log(`Found ${oldGroqEntries.length} entries with old source='groq'`)
      const deleteGroq = await prisma.queryExpansion.deleteMany({
        where: {
          source: 'groq'
        }
      })
      console.log(`✅ Deleted ${deleteGroq.count} old 'groq' entries`)
    } else {
      console.log('✅ No old "groq" entries found')
    }
    
    // 2. Find entries with "vibe, extension" format (should be cleaned)
    const vibefilterEntries = await prisma.queryExpansion.findMany({
      where: {
        source: 'vibefilter'
      }
    })
    
    console.log(`\nFound ${vibefilterEntries.length} entries with source='vibefilter'`)
    
    let cleanedCount = 0
    let duplicateCount = 0
    
    // Check for entries that have "term, extension" format
    for (const entry of vibefilterEntries) {
      const expansion = entry.expansion || ''
      const term = entry.term || ''
      
      // Check if expansion starts with the term (indicating "term, extension" format)
      if (expansion.toLowerCase().startsWith(term.toLowerCase() + ', ')) {
        // Extract just the extension part
        const cleanExtension = expansion.substring(term.length + 2).trim()
        
        // Check if a clean version already exists
        const existingClean = await prisma.queryExpansion.findFirst({
          where: {
            term: entry.term,
            category: entry.category,
            source: 'vibefilter',
            expansion: cleanExtension
          }
        })
        
        if (existingClean) {
          // Clean version exists, delete the duplicate using unique constraint
          await prisma.queryExpansion.delete({
            where: {
              term_expansion_source_category: {
                term: entry.term,
                expansion: entry.expansion,
                source: entry.source,
                category: entry.category
              }
            }
          })
          duplicateCount++
          console.log(`  🗑️  Deleted duplicate: "${entry.term}" (${entry.category}) - had "term, extension" format`)
        } else {
          // Update to clean format using unique constraint
          await prisma.queryExpansion.update({
            where: {
              term_expansion_source_category: {
                term: entry.term,
                expansion: entry.expansion,
                source: entry.source,
                category: entry.category
              }
            },
            data: {
              expansion: cleanExtension
            }
          })
          cleanedCount++
          console.log(`  ✨ Cleaned: "${entry.term}" (${entry.category}) - removed "term, " prefix`)
        }
      }
    }
    
    console.log(`\n✅ Cleaned ${cleanedCount} entries`)
    console.log(`✅ Removed ${duplicateCount} duplicate entries`)
    
    // 3. Show final stats
    const finalCount = await prisma.queryExpansion.count({
      where: {
        source: 'vibefilter'
      }
    })
    console.log(`\n📊 Final count: ${finalCount} clean vibe filter entries`)
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

cleanVibeFilterDatabase()

