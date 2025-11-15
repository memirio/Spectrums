#!/usr/bin/env tsx
/**
 * Cleanup script for concept-opposites.ts
 * 
 * This script:
 * 1. Identifies generic opposites that appear too frequently (e.g., "centered" appears 418 times)
 * 2. Removes generic opposites from concepts with excessive opposites
 * 3. Limits each concept to 5-10 strict opposites
 * 4. Prioritizes keeping true antonyms over generic design terms
 */

import fs from 'fs/promises'
import path from 'path'

type OppositesMap = Record<string, string[]>

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

/**
 * Count how many times each concept appears as an opposite
 */
function countOppositeFrequency(opposites: OppositesMap): Map<string, number> {
  const frequency = new Map<string, number>()
  
  for (const oppList of Object.values(opposites)) {
    for (const opp of oppList) {
      frequency.set(opp, (frequency.get(opp) || 0) + 1)
    }
  }
  
  return frequency
}

/**
 * Check if a generic term is a GOOD opposite for a specific concept
 * Returns true if it makes semantic sense, false if it's just generic noise
 */
function isGoodOpposite(concept: string, opposite: string): boolean {
  const conceptLower = concept.toLowerCase()
  const oppLower = opposite.toLowerCase()
  
  // Known good semantic pairs (generic terms that make sense)
  const goodPairs: Array<[RegExp, RegExp]> = [
    // Uniform/Consistency opposites
    [/^uniform|consistent|regular|same/i, /^(contrast|variety|diversity|difference)/i],
    [/^contrast|variety|diversity/i, /^(uniform|consistent|regular|same)/i],
    
    // Symmetry opposites
    [/^symmetr|balance|centered/i, /^(asymmetr|imbalance|offset)/i],
    [/^asymmetr|imbalance/i, /^(symmetr|balance|centered)/i],
    
    // Space/Layout opposites
    [/^dense|compact|cramped/i, /^(space|spacious|open)/i],
    [/^space|spacious|open/i, /^(dense|compact|cramped)/i],
    
    // Composition opposites
    [/^simple|minimal|clean/i, /^(composition|complex|intricate)/i],
    [/^composition|complex|intricate/i, /^(simple|minimal|clean)/i],
    
    // Harmony/Unity opposites
    [/^chaotic|disordered|random/i, /^(harmony|unity|order)/i],
    [/^harmony|unity|order/i, /^(chaotic|disordered|random)/i],
    
    // Visibility opposites
    [/^clear|visible|obvious/i, /^(obscured|hidden|unclear)/i],
    [/^obscured|hidden/i, /^(clear|visible|obvious)/i],
    
    // Static/Dynamic opposites
    [/^static|still|frozen/i, /^(dynamic|animated|moving|kinetic)/i],
    [/^dynamic|animated|moving|kinetic/i, /^(static|still|frozen)/i],
    
    // Modern/Traditional/Vintage opposites
    [/^modern|contemporary|current|new|futuristic|futurism/i, /^(vintage|traditional|classical|classic|retro|old|antique|historic|historical)/i],
    [/^vintage|traditional|classical|classic|retro|old|antique|historic|historical/i, /^(modern|contemporary|current|new|futuristic|futurism)/i],
    
    // Geometric/Organic opposites
    [/^geometric|geometric|angular|angular|rectilinear|rectilinear|structured|structured/i, /^(organic|organic|fluid|fluid|curved|curved|natural|natural|flowing|flowing)/i],
    [/^organic|organic|fluid|fluid|curved|curved|natural|natural|flowing|flowing/i, /^(geometric|geometric|angular|angular|rectilinear|rectilinear|structured|structured)/i],
    
    // Color/Tone opposites
    [/^warm|warmth|warm/i, /^(cool|coolness|cool)/i],
    [/^cool|coolness|cool/i, /^(warm|warmth|warm)/i],
    [/^light|bright|brightness|bright/i, /^(dark|darkness|dark|shadow|shadows)/i],
    [/^dark|darkness|dark|shadow|shadows/i, /^(light|bright|brightness|bright)/i],
    [/^colorful|color|colour|vibrant|vibrancy|saturated|saturation/i, /^(monochrome|monochromatic|muted|muted|colorless|colourless|desaturated)/i],
    [/^monochrome|monochromatic|muted|muted|colorless|colourless|desaturated/i, /^(colorful|color|colour|vibrant|vibrancy|saturated|saturation)/i],
    [/^bold|boldness|bold/i, /^(muted|muted|subtle|subtle|understated|understated)/i],
    [/^muted|muted|subtle|subtle|understated|understated/i, /^(bold|boldness|bold|vibrant|vibrant)/i],
    
    // Product/Design context opposites
    [/^product/i, /^(art|artistic|creative|experimental)/i],
    [/^art|artistic|creative|experimental/i, /^(product)/i],
    
    // Type/Typography opposites
    [/^type|typography/i, /^(illustration|image|visual|graphic)/i],
    [/^illustration|image|visual|graphic/i, /^(type|typography)/i],
    
    // Serif/Sans opposites
    [/^serif/i, /^(sans|sans-serif|modern|contemporary|futuristic)/i],
    [/^sans|sans-serif/i, /^(serif|traditional|classical)/i],
    
    // Minimalistic opposites
    [/^minimalistic|minimal|minimalism|simple|simplicity|clean|cleanliness/i, /^(maximalist|maximalism|ornate|ornamentation|decorative|decoration|elaborate|elaboration)/i],
    [/^maximalist|maximalism|ornate|ornamentation|decorative|decoration|elaborate|elaboration/i, /^(minimalistic|minimal|minimalism|simple|simplicity|clean|cleanliness)/i],
    
    // Spacious opposites
    [/^spacious/i, /^(dense|compact|cramped|tight)/i],
    [/^dense|compact|cramped|tight/i, /^(spacious)/i],
    
    // Effects opposites
    [/^effects/i, /^(simple|minimal|clean|plain)/i],
    [/^simple|minimal|clean|plain/i, /^(effects)/i],
  ]
  
  for (const [pattern1, pattern2] of goodPairs) {
    if ((pattern1.test(conceptLower) && pattern2.test(oppLower)) ||
        (pattern2.test(conceptLower) && pattern1.test(oppLower))) {
      return true
    }
  }
  
  return false
}

/**
 * Check if a generic opposite makes semantic sense for a specific concept
 * Returns true only if the opposite is contextually appropriate
 */
function isContextuallyAppropriate(concept: string, opposite: string): boolean {
  const conceptLower = concept.toLowerCase()
  const oppLower = opposite.toLowerCase()
  
  // Context-specific rules for common generic opposites
  const contextualRules: Array<[RegExp, RegExp, string]> = [
    // "flaw" and "mess" only make sense for order/rules/perfection concepts
    [/^(order|ordered|organized|organized|perfection|perfect|precise|precise|refined|polish|polished|clean|cleanliness|structure|structured|system|systematic|method|methodical|discipline|disciplined|rule|rules|regulation|regulations|standard|standards|protocol|protocols|precision|accurate|accuracy|exact|exactness|flawless|flawless|immaculate|immaculate|pristine|pristine)/i, /^(flaw|mess|chaos|chaotic|disorder|disordered|messy|messy|sloppy|sloppy|imperfect|imperfect|error|errors|mistake|mistakes|defect|defects)/i, 'order'],
    [/^(flaw|mess|chaos|chaotic|disorder|disordered|messy|messy|sloppy|sloppy|imperfect|imperfect|error|errors|mistake|mistakes|defect|defects)/i, /^(order|ordered|organized|organized|perfection|perfect|precise|precise|refined|polish|polished|clean|cleanliness|structure|structured|system|systematic|method|methodical|discipline|disciplined|rule|rules|regulation|regulations|standard|standards|protocol|protocols|precision|accurate|accuracy|exact|exactness|flawless|flawless|immaculate|immaculate|pristine|pristine)/i, 'order'],
    
    // "bleak" only for positive/optimistic concepts
    [/^(hope|hopeful|optimistic|optimism|bright|brightness|cheer|cheerful|joy|joyful|happiness|happy|positive|positivity|uplifting|uplift|inspiring|inspiration|vibrant|vibrancy|energetic|energy|enthusiasm|enthusiastic)/i, /^(bleak|bleakness|gloom|gloomy|dismal|dismal|depressing|depression|pessimistic|pessimism|dreary|dreary|desolate|desolation)/i, 'mood'],
    [/^(bleak|bleakness|gloom|gloomy|dismal|dismal|depressing|depression|pessimistic|pessimism|dreary|dreary|desolate|desolation)/i, /^(hope|hopeful|optimistic|optimism|bright|brightness|cheer|cheerful|joy|joyful|happiness|happy|positive|positivity|uplifting|uplift|inspiring|inspiration|vibrant|vibrancy|energetic|energy|enthusiasm|enthusiastic)/i, 'mood'],
    
    // "basic" only for advanced/complex/premium concepts
    [/^(advanced|sophisticated|sophistication|complex|complexity|intricate|intricacy|elaborate|elaboration|premium|luxury|luxurious|refined|refinement|polish|polished|expert|expertise|professional|professionalism|master|mastery)/i, /^(basic|simple|simplicity|plain|plainness|rudimentary|rudimentary|elementary|elementary|fundamental|fundamentals|beginner|beginners|amateur|amateurish|crude|crudeness)/i, 'quality'],
    [/^(basic|simple|simplicity|plain|plainness|rudimentary|rudimentary|elementary|elementary|fundamental|fundamentals|beginner|beginners|amateur|amateurish|crude|crudeness)/i, /^(advanced|sophisticated|sophistication|complex|complexity|intricate|intricacy|elaborate|elaboration|premium|luxury|luxurious|refined|refinement|polish|polished|expert|expertise|professional|professionalism|master|mastery)/i, 'quality'],
    
    // "clumsy" only for graceful/elegant/precise concepts
    [/^(grace|graceful|elegant|elegance|refined|refinement|polish|polished|precise|precision|smooth|smoothness|fluent|fluency|deft|deftness|skillful|skill|skilled|masterful|mastery)/i, /^(clumsy|clumsiness|awkward|awkwardness|ungainly|ungainliness|inelegant|inelegance|rough|roughness|crude|crudeness)/i, 'grace'],
    [/^(clumsy|clumsiness|awkward|awkwardness|ungainly|ungainliness|inelegant|inelegance|rough|roughness|crude|crudeness)/i, /^(grace|graceful|elegant|elegance|refined|refinement|polish|polished|precise|precision|smooth|smoothness|fluent|fluency|deft|deftness|skillful|skill|skilled|masterful|mastery)/i, 'grace'],
  ]
  
  for (const [pattern1, pattern2, context] of contextualRules) {
    if ((pattern1.test(conceptLower) && pattern2.test(oppLower)) ||
        (pattern2.test(conceptLower) && pattern1.test(oppLower))) {
      return true
    }
  }
  
  return false
}

/**
 * Check if an opposite is generic and should be removed
 * Only removes if it's generic AND doesn't make semantic sense
 */
function shouldRemoveGenericOpposite(
  concept: string,
  opposite: string,
  frequency: Map<string, number>,
  totalConcepts: number
): boolean {
  const count = frequency.get(opposite) || 0
  const percentage = (count / totalConcepts) * 100
  
  // Lower threshold: if it appears for >10% of concepts, it's potentially generic
  const isPotentiallyGeneric = percentage > 10 || count > 100
  
  if (!isPotentiallyGeneric) {
    return false // Not generic enough to worry about
  }
  
  // Even if generic, keep it if it makes semantic sense (good pairs)
  if (isGoodOpposite(concept, opposite)) {
    return false // Keep it - it's a good opposite
  }
  
  // Even if generic, keep it if it's contextually appropriate
  if (isContextuallyAppropriate(concept, opposite)) {
    return false // Keep it - it makes contextual sense
  }
  
  // Remove if it's generic AND doesn't make sense
  return true
}

/**
 * Check if an opposite is a true antonym (strict opposite)
 */
function isStrictAntonym(concept: string, opposite: string): boolean {
  const conceptLower = concept.toLowerCase()
  const oppLower = opposite.toLowerCase()
  
  // Known strict antonym patterns
  const strictPairs: Array<[RegExp, RegExp]> = [
    [/^minimal/i, /^maximal/i],
    [/^maximal/i, /^minimal/i],
    [/^static/i, /^(dynamic|animated|kinetic)/i],
    [/^dynamic|animated|kinetic/i, /^static/i],
    [/^geometric/i, /^organic/i],
    [/^organic/i, /^geometric/i],
    [/^symmetr/i, /^asymmetr/i],
    [/^asymmetr/i, /^symmetr/i],
    [/^centered/i, /^(scattered|offset|asymmetric)/i],
    [/^warm/i, /^cool/i],
    [/^cool/i, /^warm/i],
    [/^light/i, /^dark/i],
    [/^dark/i, /^light/i],
    [/^colorful/i, /^(monochrome|muted|colorless)/i],
    [/^monochrome|muted|colorless/i, /^colorful/i],
    [/^smooth/i, /^rough/i],
    [/^rough/i, /^smooth/i],
    [/^soft/i, /^hard/i],
    [/^hard/i, /^soft/i],
    [/^calm/i, /^(chaotic|energetic|dramatic)/i],
    [/^chaotic/i, /^(calm|peace|serene)/i],
    [/^luxurious/i, /^(accessible|modest|economy)/i],
    [/^accessible|modest/i, /^(luxurious|premium)/i],
    [/^professional/i, /^(casual|playful|informal)/i],
    [/^casual|playful/i, /^(professional|corporate|formal)/i],
    [/^brutalist/i, /^(elegant|refined|polished)/i],
    [/^elegant|refined/i, /^brutalist/i],
    [/^modern/i, /^(traditional|classical|vintage)/i],
    [/^traditional|classical/i, /^(modern|contemporary)/i],
  ]
  
  for (const [pattern1, pattern2] of strictPairs) {
    if ((pattern1.test(conceptLower) && pattern2.test(oppLower)) ||
        (pattern2.test(conceptLower) && pattern1.test(oppLower))) {
      return true
    }
  }
  
  return false
}

async function main() {
  console.log('🧹 Cleaning up concept-opposites.ts...\n')
  
  const opposites = await loadOppositesFile()
  const totalConcepts = Object.keys(opposites).length
  
  console.log(`✅ Loaded ${totalConcepts} concepts with opposites\n`)
  
  // Count frequency
  const frequency = countOppositeFrequency(opposites)
  
  console.log(`📊 Analysis:`)
  console.log(`   Top 10 most common opposites:`)
  const sortedFreq = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  for (const [opp, count] of sortedFreq) {
    const pct = ((count / totalConcepts) * 100).toFixed(1)
    console.log(`     ${opp}: ${count} times (${pct}%)`)
  }
  console.log()
  
  // Clean up opposites - be selective about generic terms
  const cleaned: OppositesMap = {}
  let totalRemoved = 0
  let conceptsWithExcessive = 0
  let keptGeneric = 0
  let removedGeneric = 0
  
  for (const [concept, oppList] of Object.entries(opposites)) {
    // Filter: remove generic opposites only if they don't make semantic sense
    const filtered = oppList.filter(opp => {
      const shouldRemove = shouldRemoveGenericOpposite(concept, opp, frequency, totalConcepts)
      if (shouldRemove) {
        removedGeneric++
        return false
      }
      // Check if it's a generic term we're keeping
      const count = frequency.get(opp) || 0
      const isGeneric = (count / totalConcepts) > 0.20 || count > 100
      if (isGeneric) {
        keptGeneric++
      }
      return true
    })
    
    // If still too many, prioritize strict antonyms
    if (filtered.length > 10) {
      conceptsWithExcessive++
      
      // Separate strict antonyms from others
      const strictAntonyms: string[] = []
      const others: string[] = []
      
      for (const opp of filtered) {
        if (isStrictAntonym(concept, opp)) {
          strictAntonyms.push(opp)
        } else {
          others.push(opp)
        }
      }
      
      // Keep all strict antonyms, then add others up to limit
      const maxOthers = Math.max(0, 10 - strictAntonyms.length)
      const final = [...strictAntonyms, ...others.slice(0, maxOthers)]
      
      cleaned[concept] = final
      totalRemoved += oppList.length - final.length
    } else {
      cleaned[concept] = filtered
      totalRemoved += oppList.length - filtered.length
    }
  }
  
  console.log(`🧹 Cleanup:`)
  console.log(`   Removed ${totalRemoved} generic/excessive opposites`)
  console.log(`   Concepts with excessive opposites: ${conceptsWithExcessive}`)
  console.log(`   Average opposites per concept: ${(Object.values(cleaned).reduce((sum, arr) => sum + arr.length, 0) / totalConcepts).toFixed(1)}\n`)
  
  // Write cleaned file
  const filePath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts')
  const originalContent = await fs.readFile(filePath, 'utf-8')
  
  // Generate new CONCEPT_OPPOSITES object
  const sortedKeys = Object.keys(cleaned).sort()
  const lines: string[] = []
  
  for (const key of sortedKeys) {
    const opps = cleaned[key]
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
  console.log(`💾 Saved cleaned file: ${filePath}`)
  console.log(`   Before: ${Object.values(opposites).reduce((sum, arr) => sum + arr.length, 0)} total opposites`)
  console.log(`   After: ${Object.values(cleaned).reduce((sum, arr) => sum + arr.length, 0)} total opposites`)
  console.log(`   Reduction: ${((totalRemoved / Object.values(opposites).reduce((sum, arr) => sum + arr.length, 0)) * 100).toFixed(1)}%\n`)
  
  console.log('✅ Cleanup complete!')
}

main().catch(err => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})

