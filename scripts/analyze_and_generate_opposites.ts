#!/usr/bin/env tsx
/**
 * Analyze seed_concepts.json and generate conceptually opposite tags
 * 
 * This script:
 * 1. Loads all concepts from seed_concepts.json
 * 2. Groups them by category
 * 3. For each concept, analyzes potential opposites based on:
 *    - Category-specific semantic rules
 *    - Design principles (minimal vs maximal, static vs dynamic, etc.)
 *    - Visual/aesthetic contradictions
 *    - Conceptual antonyms
 * 4. Outputs a comprehensive analysis and suggestions
 */

import fs from 'fs/promises'
import path from 'path'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  category?: string
  opposites?: string[]
}

// Category-specific opposite generation rules
const categoryOppositeRules: Record<string, (concept: Concept, allConcepts: Concept[]) => string[]> = {
  'Aesthetic / Formal': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Dimensional opposites
    if (label.includes('3d') || label.includes('three-dimensional')) opposites.push('flat', '2d', 'planar')
    if (label.includes('flat') || label.includes('2d')) opposites.push('3d', 'dimensional', 'volumetric')
    
    // Layout opposites
    if (label.includes('centered') || label.includes('center')) opposites.push('asymmetric', 'offset', 'scattered')
    if (label.includes('asymmetr') || label.includes('asymmetric')) opposites.push('symmetrical', 'balanced', 'centered')
    if (label.includes('symmetr') || label.includes('balance')) opposites.push('asymmetric', 'chaotic', 'unbalanced')
    
    // Typography opposites
    if (label.includes('caps') || label.includes('uppercase')) opposites.push('lowercase', 'mixed-case', 'subtle')
    if (label.includes('serif')) opposites.push('sans-serif', 'modern', 'geometric')
    if (label.includes('sans-serif') || label.includes('geometric')) opposites.push('serif', 'traditional', 'classical')
    
    // Grid/layout opposites
    if (label.includes('grid') || label.includes('based')) opposites.push('organic', 'fluid', 'freeform')
    if (label.includes('organic') || label.includes('fluid')) opposites.push('grid', 'geometric', 'structured')
    
    return opposites
  },
  
  'Design Style': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Style opposites
    if (label.includes('minimal') || label.includes('minimalist')) opposites.push('maximalist', 'ornate', 'decorative')
    if (label.includes('maximal') || label.includes('ornate')) opposites.push('minimal', 'simple', 'restrained')
    if (label.includes('brutalist')) opposites.push('elegant', 'refined', 'polished')
    if (label.includes('elegant') || label.includes('refined')) opposites.push('brutalist', 'raw', 'gritty')
    if (label.includes('modern') || label.includes('contemporary')) opposites.push('traditional', 'classical', 'vintage')
    if (label.includes('traditional') || label.includes('classical') || label.includes('vintage')) opposites.push('modern', 'futuristic', 'contemporary')
    if (label.includes('futuristic') || label.includes('futurism')) opposites.push('retro', 'vintage', 'classical')
    if (label.includes('retro')) opposites.push('futuristic', 'modern', 'contemporary')
    
    return opposites
  },
  
  'Feeling / Emotion': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Emotional opposites
    if (label.includes('calm') || label.includes('peace') || label.includes('serene')) opposites.push('chaotic', 'energetic', 'dramatic')
    if (label.includes('chaotic') || label.includes('energetic') || label.includes('dramatic')) opposites.push('calm', 'peaceful', 'serene')
    if (label.includes('joy') || label.includes('happy') || label.includes('playful')) opposites.push('melancholy', 'somber', 'serious')
    if (label.includes('melancholy') || label.includes('somber') || label.includes('serious')) opposites.push('joyful', 'playful', 'lighthearted')
    if (label.includes('warm') || label.includes('cozy')) opposites.push('cool', 'aloof', 'distant')
    if (label.includes('cool') || label.includes('aloof') || label.includes('distant')) opposites.push('warm', 'friendly', 'inviting')
    
    return opposites
  },
  
  'Texture & Materiality': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Texture opposites
    if (label.includes('smooth') || label.includes('polished') || label.includes('glossy')) opposites.push('rough', 'textured', 'grainy')
    if (label.includes('rough') || label.includes('textured') || label.includes('grainy')) opposites.push('smooth', 'polished', 'glossy')
    if (label.includes('soft') || label.includes('gentle')) opposites.push('hard', 'rigid', 'sharp')
    if (label.includes('hard') || label.includes('rigid') || label.includes('sharp')) opposites.push('soft', 'gentle', 'pliable')
    if (label.includes('solid')) opposites.push('fluid', 'hollow', 'porous')
    if (label.includes('fluid') || label.includes('liquid')) opposites.push('solid', 'rigid', 'static')
    
    return opposites
  },
  
  'Form & Structure': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Structural opposites
    if (label.includes('geometric') || label.includes('angular')) opposites.push('organic', 'curved', 'flowing')
    if (label.includes('organic') || label.includes('curved') || label.includes('flowing')) opposites.push('geometric', 'angular', 'structured')
    if (label.includes('modular') || label.includes('segmented')) opposites.push('monolithic', 'unified', 'integrated')
    if (label.includes('monolithic') || label.includes('unified') || label.includes('integrated')) opposites.push('modular', 'segmented', 'fragmented')
    if (label.includes('static') || label.includes('fixed') || label.includes('still')) opposites.push('dynamic', 'animated', 'kinetic')
    if (label.includes('dynamic') || label.includes('animated') || label.includes('kinetic')) opposites.push('static', 'still', 'frozen')
    
    return opposites
  },
  
  'Vibe / Mood': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Mood opposites
    if (label.includes('luxurious') || label.includes('premium') || label.includes('exclusive')) opposites.push('accessible', 'modest', 'economical')
    if (label.includes('accessible') || label.includes('modest') || label.includes('economical')) opposites.push('luxurious', 'premium', 'exclusive')
    if (label.includes('professional') || label.includes('corporate') || label.includes('formal')) opposites.push('casual', 'playful', 'informal')
    if (label.includes('casual') || label.includes('playful') || label.includes('informal')) opposites.push('professional', 'corporate', 'formal')
    if (label.includes('authoritative') || label.includes('bold') || label.includes('confident')) opposites.push('gentle', 'muted', 'understated')
    if (label.includes('gentle') || label.includes('muted') || label.includes('understated')) opposites.push('authoritative', 'bold', 'confident')
    
    return opposites
  },
  
  'Natural / Metaphysical Concepts': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Natural opposites
    if (label.includes('light') || label.includes('bright') || label.includes('luminous')) opposites.push('dark', 'shadow', 'obscure')
    if (label.includes('dark') || label.includes('shadow') || label.includes('obscure')) opposites.push('light', 'bright', 'luminous')
    if (label.includes('natural') || label.includes('organic')) opposites.push('artificial', 'synthetic', 'manufactured')
    if (label.includes('artificial') || label.includes('synthetic') || label.includes('manufactured')) opposites.push('natural', 'organic', 'authentic')
    
    return opposites
  },
  
  'Social / Cultural Concepts': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Social opposites
    if (label.includes('academia') || label.includes('scholarly')) opposites.push('commercial', 'practical', 'applied')
    if (label.includes('commercial') || label.includes('practical')) opposites.push('academic', 'theoretical', 'scholarly')
    if (label.includes('artistic') || label.includes('creative')) opposites.push('commercial', 'utilitarian', 'functional')
    if (label.includes('utilitarian') || label.includes('functional')) opposites.push('artistic', 'aesthetic', 'decorative')
    
    return opposites
  },
  
  'Philosophical / Existential Concepts': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Philosophical opposites
    if (label.includes('order') || label.includes('structure') || label.includes('harmony')) opposites.push('chaos', 'disorder', 'randomness')
    if (label.includes('chaos') || label.includes('disorder') || label.includes('randomness')) opposites.push('order', 'structure', 'harmony')
    if (label.includes('presence') || label.includes('existence')) opposites.push('absence', 'void', 'emptiness')
    if (label.includes('absence') || label.includes('void') || label.includes('emptiness')) opposites.push('presence', 'existence', 'fullness')
    
    return opposites
  },
  
  'Design Technique': (concept, all) => {
    const label = concept.label.toLowerCase()
    const opposites: string[] = []
    
    // Technique opposites
    if (label.includes('gradient') || label.includes('blend')) opposites.push('solid', 'flat', 'uniform')
    if (label.includes('solid') || label.includes('flat') || label.includes('uniform')) opposites.push('gradient', 'blended', 'varied')
    if (label.includes('contrast') || label.includes('high-contrast')) opposites.push('muted', 'subtle', 'blended')
    if (label.includes('muted') || label.includes('subtle')) opposites.push('contrast', 'bold', 'dramatic')
    if (label.includes('colorful') || label.includes('vibrant')) opposites.push('monochrome', 'muted', 'desaturated')
    if (label.includes('monochrome') || label.includes('muted') || label.includes('desaturated')) opposites.push('colorful', 'vibrant', 'saturated')
    
    return opposites
  }
}

// Generic opposite generation based on common patterns
function generateGenericOpposites(concept: Concept, allConcepts: Concept[]): string[] {
  const label = concept.label.toLowerCase()
  const opposites: string[] = []
  
  // Find concepts with opposite meanings in the same category
  const sameCategory = allConcepts.filter(c => c.category === concept.category)
  
  // Common antonym patterns
  const antonymPatterns: Array<[RegExp, string[]]> = [
    [/^minimal/i, ['maximal', 'dense', 'ornate']],
    [/^maximal/i, ['minimal', 'simple', 'restrained']],
    [/^static/i, ['dynamic', 'animated', 'kinetic']],
    [/^dynamic/i, ['static', 'still', 'frozen']],
    [/^geometric/i, ['organic', 'curved', 'flowing']],
    [/^organic/i, ['geometric', 'angular', 'structured']],
    [/^modern/i, ['traditional', 'classical', 'vintage']],
    [/^traditional/i, ['modern', 'contemporary', 'futuristic']],
    [/^bold/i, ['subtle', 'muted', 'gentle']],
    [/^subtle/i, ['bold', 'dramatic', 'confident']],
    [/^warm/i, ['cool', 'cold', 'icy']],
    [/^cool/i, ['warm', 'fiery', 'hot']],
    [/^light/i, ['dark', 'shadow', 'obscure']],
    [/^dark/i, ['light', 'bright', 'luminous']],
    [/^smooth/i, ['rough', 'textured', 'grainy']],
    [/^rough/i, ['smooth', 'polished', 'glossy']],
    [/^soft/i, ['hard', 'rigid', 'sharp']],
    [/^hard/i, ['soft', 'gentle', 'pliable']],
  ]
  
  for (const [pattern, suggestions] of antonymPatterns) {
    if (pattern.test(label)) {
      opposites.push(...suggestions)
      break
    }
  }
  
  return opposites
}

// Find existing concepts that match the opposite labels
function findMatchingConcepts(oppositeLabels: string[], allConcepts: Concept[]): string[] {
  const matches: string[] = []
  const labelMap = new Map<string, string>()
  
  // Build label -> id map
  for (const c of allConcepts) {
    labelMap.set(c.label.toLowerCase(), c.id.toLowerCase())
    // Also check synonyms
    if (c.synonyms) {
      for (const syn of c.synonyms) {
        labelMap.set(syn.toLowerCase(), c.id.toLowerCase())
      }
    }
  }
  
  for (const oppLabel of oppositeLabels) {
    const match = labelMap.get(oppLabel.toLowerCase())
    if (match) {
      matches.push(match)
    }
  }
  
  return matches
}

async function main() {
  console.log('📚 Loading concepts from seed_concepts.json...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(seedContent)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Group by category
  const byCategory = new Map<string, Concept[]>()
  for (const c of concepts) {
    const cat = c.category || 'Uncategorized'
    if (!byCategory.has(cat)) {
      byCategory.set(cat, [])
    }
    byCategory.get(cat)!.push(c)
  }
  
  console.log('📊 Concepts by category:')
  for (const [cat, items] of Array.from(byCategory.entries()).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   ${cat}: ${items.length} concepts`)
  }
  console.log()
  
  // Generate opposites for each concept
  console.log('🔍 Generating conceptually opposite tags...\n')
  
  const results: Array<{
    concept: Concept
    categoryOpposites: string[]
    genericOpposites: string[]
    matchedConcepts: string[]
    finalOpposites: string[]
  }> = []
  
  for (const concept of concepts) {
    const category = concept.category || 'Uncategorized'
    
    // Get category-specific opposites
    const categoryRule = categoryOppositeRules[category]
    const categoryOpposites = categoryRule ? categoryRule(concept, concepts) : []
    
    // Get generic opposites
    const genericOpposites = generateGenericOpposites(concept, concepts)
    
    // Combine and find matching concepts
    const allOppositeLabels = [...new Set([...categoryOpposites, ...genericOpposites])]
    const matchedConcepts = findMatchingConcepts(allOppositeLabels, concepts)
    
    // Final opposites (limit to 3-5)
    const finalOpposites = matchedConcepts.slice(0, 5)
    
    results.push({
      concept,
      categoryOpposites,
      genericOpposites,
      matchedConcepts,
      finalOpposites
    })
  }
  
  // Statistics
  const withOpposites = results.filter(r => r.finalOpposites.length > 0)
  const withoutOpposites = results.filter(r => r.finalOpposites.length === 0)
  
  console.log('📊 Analysis Results:')
  console.log(`   Concepts with opposites found: ${withOpposites.length} (${((withOpposites.length / concepts.length) * 100).toFixed(1)}%)`)
  console.log(`   Concepts without opposites: ${withoutOpposites.length} (${((withoutOpposites.length / concepts.length) * 100).toFixed(1)}%)\n`)
  
  // Show examples
  console.log('📝 Examples of generated opposites:')
  for (const result of results.slice(0, 20)) {
    if (result.finalOpposites.length > 0) {
      console.log(`   ${result.concept.label} (${result.concept.category || 'N/A'}) → [${result.finalOpposites.join(', ')}]`)
    }
  }
  
  // Show concepts without opposites
  if (withoutOpposites.length > 0) {
    console.log(`\n⚠️  Concepts without opposites (first 20):`)
    for (const result of withoutOpposites.slice(0, 20)) {
      console.log(`   - ${result.concept.label} (${result.concept.category || 'N/A'})`)
    }
  }
  
  // Generate output file
  const outputPath = path.join(process.cwd(), 'scripts', 'generated_opposites_analysis.json')
  const output = results.map(r => ({
    id: r.concept.id,
    label: r.concept.label,
    category: r.concept.category,
    opposites: r.finalOpposites,
    suggestedLabels: [...r.categoryOpposites, ...r.genericOpposites].slice(0, 10)
  }))
  
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2))
  console.log(`\n💾 Analysis saved to: ${outputPath}`)
  console.log(`   This file contains suggested opposites for all ${concepts.length} concepts\n`)
}

main().catch(err => {
  console.error('Script failed:', err)
  process.exit(1)
})

