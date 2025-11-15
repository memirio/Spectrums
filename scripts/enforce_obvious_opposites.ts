#!/usr/bin/env tsx
/**
 * Enforce obvious semantic opposites
 * 
 * This script ensures that clear semantic pairs like "modern" ↔ "vintage"
 * are always present in concept-opposites.ts, even if they were removed
 * by the cleanup script.
 */

import fs from 'fs/promises'
import path from 'path'

type OppositesMap = Record<string, string[]>

/**
 * Obvious semantic pairs that should always be present
 */
const OBVIOUS_PAIRS: Array<[string, string]> = [
  // Modern/Traditional/Vintage
  ['modern', 'vintage'],
  ['modern', 'traditional'],
  ['vintage', 'modern'],
  ['traditional', 'modern'],
  ['contemporary', 'vintage'],
  ['contemporary', 'traditional'],
  ['futuristic', 'vintage'],
  ['futurism', 'vintage'],
  ['retro', 'modern'],
  ['old', 'modern'],
  
  // Geometric/Organic
  ['geometric', 'organic'],
  ['organic', 'geometric'],
  ['angular', 'organic'],
  ['rectilinear', 'organic'],
  ['structured', 'organic'],
  
  // Static/Dynamic
  ['static', 'dynamic'],
  ['static', 'animated'],
  ['static', 'kinetic'],
  ['dynamic', 'static'],
  ['animated', 'static'],
  ['kinetic', 'static'],
  
  // Color/Tone
  ['warm', 'cool'],
  ['cool', 'warm'],
  ['light', 'dark'],
  ['dark', 'light'],
  ['colorful', 'monochrome'],
  ['colorful', 'monochromatic'],
  ['monochrome', 'colorful'],
  ['monochromatic', 'colorful'],
  ['vibrant', 'muted'],
  ['muted', 'vibrant'],
  ['bold', 'muted'],
  ['muted', 'bold'],
  ['saturated', 'muted'],
  ['muted', 'saturated'],
  
  // Typography
  ['serif', 'sans'],
  ['serif', 'sans-serif'],
  ['sans', 'serif'],
  ['sans-serif', 'serif'],
  
  // Minimal/Maximal
  ['minimal', 'maximalist'],
  ['minimal', 'maximalism'],
  ['maximalist', 'minimal'],
  ['maximalism', 'minimal'],
  ['minimalistic', 'maximalist'],
  ['maximalist', 'minimalistic'],
  
  // Symmetry
  ['symmetry', 'asymmetry'],
  ['asymmetry', 'symmetry'],
  ['balanced', 'asymmetry'],
  ['asymmetry', 'balanced'],
  
  // Space
  ['spacious', 'dense'],
  ['dense', 'spacious'],
  ['compact', 'spacious'],
  ['spacious', 'compact'],
]

/**
 * Load concept-opposites.ts file
 */
async function loadOppositesFile(): Promise<OppositesMap> {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts')
  const content = await fs.readFile(filePath, 'utf-8')
  
  // Extract the CONCEPT_OPPOSITES object using regex
  const match = content.match(/export const CONCEPT_OPPOSITES[^=]*=\s*({[\s\S]*?})\s*as const/)
  if (!match) {
    throw new Error('Could not parse CONCEPT_OPPOSITES from file')
  }
  
  // Evaluate the object (safe since it's our own file)
  const opposites: OppositesMap = eval(`(${match[1]})`)
  return opposites
}

async function main() {
  console.log('🔧 Enforcing obvious semantic opposites...\n')
  
  const opposites = await loadOppositesFile()
  let added = 0
  let alreadyPresent = 0
  
  // Add obvious pairs
  for (const [concept, opposite] of OBVIOUS_PAIRS) {
    if (!opposites[concept]) {
      opposites[concept] = []
    }
    
    if (!opposites[concept].includes(opposite)) {
      opposites[concept].push(opposite)
      added++
      console.log(`  ✅ Added: ${concept} → ${opposite}`)
    } else {
      alreadyPresent++
    }
    
    // Ensure bidirectional relationship
    if (!opposites[opposite]) {
      opposites[opposite] = []
    }
    
    if (!opposites[opposite].includes(concept)) {
      opposites[opposite].push(concept)
      added++
      console.log(`  ✅ Added: ${opposite} → ${concept}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Added: ${added} relationships`)
  console.log(`   Already present: ${alreadyPresent} relationships`)
  
  // Write updated file
  const filePath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts')
  const originalContent = await fs.readFile(filePath, 'utf-8')
  
  // Generate new CONCEPT_OPPOSITES object
  const sortedKeys = Object.keys(opposites).sort()
  const lines: string[] = []
  
  for (const key of sortedKeys) {
    const opps = opposites[key]
    if (opps.length === 0) continue
    
    const oppsStr = opps.map(o => `'${o}'`).join(', ')
    // Try to get label from comment or use key
    const label = key.charAt(0).toUpperCase() + key.slice(1)
    lines.push(`  '${key}': [${oppsStr}], // ${label}`)
  }
  
  // Replace the CONCEPT_OPPOSITES object
  const newContent = originalContent.replace(
    /export const CONCEPT_OPPOSITES[^=]*=\s*{[\s\S]*?}\s*as const/,
    `export const CONCEPT_OPPOSITES: Record<string, string[]> = {\n${lines.join('\n')}\n} as const`
  )
  
  await fs.writeFile(filePath, newContent)
  console.log(`\n💾 Saved updated file: ${filePath}`)
  console.log(`✅ Done!`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})

