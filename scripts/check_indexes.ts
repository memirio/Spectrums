#!/usr/bin/env tsx
/**
 * Check if the sites.createdAt indexes exist
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    console.log('Checking indexes on sites table...\n')
    
    const indexes = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'sites' 
      AND indexname LIKE '%createdAt%'
      ORDER BY indexname;
    `)
    
    if (indexes.length === 0) {
      console.log('❌ No createdAt indexes found on sites table!')
      console.log('   The indexes need to be created.')
    } else {
      console.log(`✅ Found ${indexes.length} createdAt index(es):\n`)
      for (const idx of indexes) {
        console.log(`   ${idx.indexname}`)
        console.log(`   ${idx.indexdef}\n`)
      }
    }
    
    // Also check all indexes on sites table
    const allIndexes = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'sites'
      ORDER BY indexname;
    `)
    
    console.log(`\nAll indexes on sites table (${allIndexes.length} total):`)
    for (const idx of allIndexes) {
      console.log(`   - ${idx.indexname}`)
    }
    
  } catch (error: any) {
    console.error('Error checking indexes:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

