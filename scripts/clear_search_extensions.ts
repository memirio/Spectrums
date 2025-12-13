/**
 * Clear cached search and vibe extensions from database
 * This forces new extensions to be generated with the new format that includes the query
 * Format: "Query, Extension" instead of just "Extension"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function clearSearchExtensions() {
  try {
    console.log('🗑️  Clearing all cached extensions from database...')
    console.log('   (This is needed because extensions now include the query: "Query, Extension")\n')
    
    // Delete all query expansions with source='searchbar' (search extensions)
    const searchResult = await prisma.queryExpansion.deleteMany({
      where: {
        source: 'searchbar'
      }
    })
    
    console.log(`✅ Deleted ${searchResult.count} search extensions (source='searchbar')`)
    
    // Delete all query expansions with source='vibefilter' (vibe extensions)
    const vibeResult = await prisma.queryExpansion.deleteMany({
      where: {
        source: 'vibefilter'
      }
    })
    
    console.log(`✅ Deleted ${vibeResult.count} vibe extensions (source='vibefilter')`)
    console.log(`\n📊 Total deleted: ${searchResult.count + vibeResult.count} extensions`)
    console.log('💡 New extensions will be generated with "Query, Extension" format on next search')
    
  } catch (error: any) {
    console.error('❌ Error clearing extensions:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  clearSearchExtensions()
    .then(() => {
      console.log('✅ Done')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed:', error)
      process.exit(1)
    })
}

export { clearSearchExtensions }

