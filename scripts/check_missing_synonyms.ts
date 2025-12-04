#!/usr/bin/env tsx
/**
 * Check for concepts missing synonyms
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking for concepts missing synonyms...\n')
  
  // Fetch all concepts
  const allConcepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
    },
    orderBy: { label: 'asc' }
  })
  
  console.log(`📊 Total concepts: ${allConcepts.length}`)
  
  // Find concepts missing synonyms
  const missingSynonyms = allConcepts.filter(c => {
    const syn = c.synonyms as any
    return syn === null || !Array.isArray(syn) || syn.length === 0 || (syn.length === 1 && syn[0] === null)
  })
  
  console.log(`❌ Missing synonyms: ${missingSynonyms.length}\n`)
  
  // Show first 30 missing
  console.log(`📋 First 30 concepts missing synonyms:`)
  missingSynonyms.slice(0, 30).forEach((c, i) => {
    const syn = c.synonyms as any
    console.log(`  ${i + 1}. ${c.label} (${c.id}) - synonyms: ${JSON.stringify(syn)}`)
  })
  
  if (missingSynonyms.length > 30) {
    console.log(`  ... and ${missingSynonyms.length - 30} more`)
  }
  
  // Count concepts with null in synonyms array
  const withNullSynonyms = allConcepts.filter(c => {
    const syn = c.synonyms as any
    return Array.isArray(syn) && syn.includes(null)
  })
  
  if (withNullSynonyms.length > 0) {
    console.log(`\n⚠️  Concepts with null in synonyms array: ${withNullSynonyms.length}`)
    withNullSynonyms.slice(0, 10).forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.label} (${c.id})`)
    })
  }
}

main().catch(console.error)

