/**
 * Test script to simulate vibe filter generation and check if extensions are saved
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function testVibeFilterGeneration() {
  try {
    const testTerm = 'love'
    console.log(`\n🧪 Testing vibe filter generation for "${testTerm}"...\n`)
    
    // Check current state
    const before = await prisma.queryExpansion.findMany({
      where: {
        term: testTerm.toLowerCase(),
        source: 'vibefilter'
      }
    })
    console.log(`📊 Current entries for "${testTerm}" (source='vibefilter'): ${before.length}`)
    before.forEach((e, i) => {
      console.log(`  ${i + 1}. Category: ${e.category}, Has embedding: ${!!e.embedding}`)
    })
    
    // Simulate what happens when user adds vibe filter
    // This would trigger the API call
    console.log(`\n💡 To test generation:`)
    console.log(`   1. Add "${testTerm}" as a vibe filter in the UI`)
    console.log(`   2. Check server logs for:`)
    console.log(`      - "[search] Taking VIBE FILTER path"`)
    console.log(`      - "[vibe-cache] Cache MISS for ${testTerm.toLowerCase()}:website, generating..."`)
    console.log(`      - "[vibe-cache] Stored in database cache: ${testTerm.toLowerCase()}:website"`)
    console.log(`   3. Check for errors in logs`)
    
    // Check if there are any entries with errors (no expansion but should have)
    const allEntries = await prisma.queryExpansion.findMany({
      where: {
        term: testTerm.toLowerCase()
      }
    })
    
    console.log(`\n📋 All entries for "${testTerm}" (any source): ${allEntries.length}`)
    allEntries.forEach((e, i) => {
      console.log(`  ${i + 1}. Source: ${e.source}, Category: ${e.category}, Has expansion: ${!!e.expansion}, Has embedding: ${!!e.embedding}`)
    })
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

testVibeFilterGeneration()

