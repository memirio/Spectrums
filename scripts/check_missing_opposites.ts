#!/usr/bin/env tsx
/**
 * Check for concepts missing opposites
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking for concepts missing opposites...\n')
  
  // Fetch all concepts
  const allConcepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      opposites: true,
    },
    orderBy: { label: 'asc' }
  })
  
  console.log(`📊 Total concepts: ${allConcepts.length}`)
  
  // Find concepts missing opposites
  const missingOpposites = allConcepts.filter(c => {
    const opp = c.opposites as any
    return opp === null || !Array.isArray(opp) || opp.length === 0
  })
  
  console.log(`❌ Missing opposites: ${missingOpposites.length}\n`)
  
  // Check for "aggression" specifically
  const aggression = allConcepts.find(c => 
    c.label.toLowerCase().includes('aggress')
  )
  
  if (aggression) {
    console.log(`\n🔍 Found "aggression" concept:`)
    console.log(`  ID: ${aggression.id}`)
    console.log(`  Label: ${aggression.label}`)
    console.log(`  Opposites: ${JSON.stringify(aggression.opposites)}`)
    console.log(`  Has opposites: ${aggression.opposites && Array.isArray(aggression.opposites) && aggression.opposites.length > 0}`)
  } else {
    console.log(`\n⚠️  "aggression" concept not found`)
  }
  
  // Show first 20 missing
  console.log(`\n📋 First 20 concepts missing opposites:`)
  missingOpposites.slice(0, 20).forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.label} (${c.id})`)
  })
  
  if (missingOpposites.length > 20) {
    console.log(`  ... and ${missingOpposites.length - 20} more`)
  }
}

main().catch(console.error)

