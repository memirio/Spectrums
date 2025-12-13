/**
 * Clear vibe filter cache and database entries
 * - Clears all vibe filter entries from database
 * - Or optionally just clears embeddings to force regeneration
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function clearVibeFilterCache() {
  try {
    console.log('\n🧹 Clearing vibe filter cache and database entries...\n')
    
    // Option 1: Clear all vibe filter entries
    const deleteAll = await prisma.queryExpansion.deleteMany({
      where: {
        source: 'vibefilter'
      }
    })
    
    console.log(`✅ Deleted ${deleteAll.count} vibe filter entries from database`)
    console.log('\n💡 In-memory cache will clear on next server restart')
    console.log('   Or you can restart the server to clear it immediately')
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

clearVibeFilterCache()

