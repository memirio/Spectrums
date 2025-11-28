#!/usr/bin/env tsx
/**
 * Cleanup Duplicate Query Expansions
 * 
 * Removes duplicate expansions, keeping only the most recent generation for each term-category pair.
 * This script groups expansions by term-category and keeps only the most recent set (based on createdAt).
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning up duplicate query expansions...\n')
  
  // Get all Groq expansions grouped by term-category
  const allExpansions = await prisma.$queryRawUnsafe(`
    SELECT "term", "expansion", "source", "category", "createdAt", "model"
    FROM "query_expansions"
    WHERE "source" = 'groq'
    ORDER BY "term", "category", "createdAt" DESC
  `) as any[]
  
  console.log(`📊 Found ${allExpansions.length} total Groq expansions\n`)
  
  // Group by term-category and find the most recent generation time
  const groups = new Map<string, { expansions: any[], latestCreatedAt: Date }>()
  
  for (const exp of allExpansions) {
    const key = `${exp.term.toLowerCase()}-${exp.category || 'global'}`
    
    if (!groups.has(key)) {
      groups.set(key, { expansions: [], latestCreatedAt: new Date(exp.createdAt) })
    }
    
    const group = groups.get(key)!
    const expDate = new Date(exp.createdAt)
    
    // Track the latest creation time
    if (expDate > group.latestCreatedAt) {
      group.latestCreatedAt = expDate
    }
    
    group.expansions.push(exp)
  }
  
  console.log(`📦 Found ${groups.size} unique term-category pairs\n`)
  
  // Identify duplicates (groups with multiple generations)
  const duplicates: Array<{ key: string, total: number, latest: number, old: number }> = []
  
  for (const [key, group] of groups.entries()) {
    const latestDate = group.latestCreatedAt
    const latestExpansions = group.expansions.filter(e => new Date(e.createdAt).getTime() === latestDate.getTime())
    const oldExpansions = group.expansions.filter(e => new Date(e.createdAt).getTime() < latestDate.getTime())
    
    if (oldExpansions.length > 0) {
      duplicates.push({
        key,
        total: group.expansions.length,
        latest: latestExpansions.length,
        old: oldExpansions.length
      })
    }
  }
  
  console.log(`🔍 Found ${duplicates.length} term-category pairs with duplicate generations\n`)
  
  if (duplicates.length === 0) {
    console.log('✅ No duplicates found! Database is clean.\n')
    await prisma.$disconnect()
    return
  }
  
  // Show summary
  const totalToDelete = duplicates.reduce((sum, d) => sum + d.old, 0)
  console.log(`📊 Summary:`)
  console.log(`   Total duplicates to remove: ${totalToDelete}`)
  console.log(`   Will keep: ${duplicates.reduce((sum, d) => sum + d.latest, 0)} expansions\n`)
  
  // Ask for confirmation (or use --yes flag)
  const autoConfirm = process.argv.includes('--yes')
  
  if (!autoConfirm) {
    console.log('⚠️  This will delete old expansions. Use --yes to proceed automatically.\n')
    await prisma.$disconnect()
    return
  }
  
  // Delete old expansions (keep only the most recent generation for each term-category)
  let deleted = 0
  
  for (const dup of duplicates) {
    const [term, category] = dup.key.split('-')
    const categoryValue = category === 'global' ? 'global' : category
    
    // Get the latest creation time for this term-category
    const group = groups.get(dup.key)!
    const latestDate = group.latestCreatedAt
    
    // Delete all expansions older than the latest generation
    try {
      const result = await prisma.$executeRawUnsafe(`
        DELETE FROM "query_expansions"
        WHERE "term" = $1
          AND "source" = 'groq'
          AND "category" = $2
          AND "createdAt" < $3::timestamp
      `, term, categoryValue, latestDate.toISOString())
      
      deleted += dup.old
      console.log(`✅ Cleaned "${term}" (${categoryValue}): removed ${dup.old} old expansions, kept ${dup.latest}`)
    } catch (error: any) {
      console.error(`❌ Error cleaning "${term}" (${categoryValue}):`, error.message)
    }
  }
  
  console.log(`\n✅ Cleanup complete!`)
  console.log(`   Deleted: ${deleted} duplicate expansions`)
  console.log(`   Kept: ${allExpansions.length - deleted} expansions\n`)
  
  await prisma.$disconnect()
}

main().catch(console.error)

