#!/usr/bin/env tsx
/**
 * Clean and validate opposites in seed_concepts.json
 * 
 * This script:
 * 1. Removes contradictions (concepts that are both related AND opposite)
 * 2. Limits opposites to 3-5 strict opposites per concept
 * 3. Removes opposites that are too similar (synonyms, related concepts)
 * 4. Validates that opposites are true contradictions
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

/**
 * Check if two concepts are too similar to be opposites
 */
function areTooSimilar(
  concept1: Concept,
  concept2Label: string,
  allConcepts: Concept[]
): boolean {
  const label1 = concept1.label.toLowerCase()
  const label2 = concept2Label.toLowerCase()
  
  // Same concept
  if (label1 === label2) return true
  
  // Check if label2 is a synonym of concept1
  const synonyms1 = (concept1.synonyms || []).map(s => String(s).toLowerCase())
  if (synonyms1.includes(label2)) return true
  
  // Check if label2 is in related concepts
  const related1 = (concept1.related || []).map(r => String(r).toLowerCase())
  if (related1.includes(label2)) return true
  
  // Find concept2 and check reverse relationships
  const concept2 = allConcepts.find(c => 
    c.label.toLowerCase() === label2 || 
    c.id.toLowerCase() === label2
  )
  
  if (concept2) {
    // Check if concept1 is a synonym of concept2
    const synonyms2 = (concept2.synonyms || []).map(s => String(s).toLowerCase())
    if (synonyms2.includes(label1) || synonyms2.includes(concept1.id.toLowerCase())) return true
    
    // Check if concept1 is related to concept2
    const related2 = (concept2.related || []).map(r => String(r).toLowerCase())
    if (related2.includes(label1) || related2.includes(concept1.id.toLowerCase())) return true
    
    // Check if IDs are too similar (e.g., "art" and "artistic")
    const id1 = concept1.id.toLowerCase()
    const id2 = concept2.id.toLowerCase()
    if (id1.includes(id2) || id2.includes(id1)) {
      // Allow if one is clearly a prefix (e.g., "minimal" and "minimalist" are related, not opposite)
      return true
    }
  }
  
  return false
}

/**
 * Score how good an opposite is (higher = better, more strict)
 * Only true antonyms get positive scores
 */
function scoreOpposite(
  concept: Concept,
  oppositeLabel: string,
  allConcepts: Concept[]
): number {
  // Penalize if too similar
  if (areTooSimilar(concept, oppositeLabel, allConcepts)) {
    return -1000 // Strong penalty
  }
  
  const label = concept.label.toLowerCase()
  const opp = oppositeLabel.toLowerCase()
  
  // STRICT: Only accept known antonym patterns
  // These are verified true opposites
  const strictAntonymPatterns: Array<[RegExp, RegExp, number]> = [
    // Dimensional
    [/^3d|three.?dimensional/i, /^(2d|flat|planar|two.?dimensional)/i, 20],
    [/^flat|2d|planar/i, /^(3d|dimensional|volumetric)/i, 20],
    
    // Style
    [/^minimal|minimalist/i, /^maximal|maximalist/i, 20],
    [/^maximal|maximalist/i, /^minimal|minimalist/i, 20],
    [/^brutalist/i, /^elegant|refined|polished/i, 20],
    [/^elegant|refined/i, /^brutalist|raw|gritty/i, 20],
    [/^modern|contemporary/i, /^(traditional|classical|vintage|retro)/i, 20],
    [/^traditional|classical|vintage|retro/i, /^(modern|contemporary|futuristic)/i, 20],
    [/^futuristic|futurism/i, /^(traditional|classical|vintage|retro)/i, 20],
    
    // Form
    [/^geometric|angular/i, /^organic|curved|flowing|amorphous/i, 20],
    [/^organic|curved|flowing|amorphous/i, /^geometric|angular|structured/i, 20],
    [/^symmetr|balance/i, /^asymmetr|imbalance|chaotic/i, 20],
    [/^asymmetr|imbalance/i, /^symmetr|balance|centered/i, 20],
    [/^centered|central/i, /^(scattered|offset|asymmetric|peripheral)/i, 20],
    [/^static|still|fixed/i, /^(dynamic|animated|kinetic|motion)/i, 20],
    [/^dynamic|animated|kinetic/i, /^(static|still|frozen)/i, 20],
    [/^modular|segmented/i, /^(monolithic|unified|integrated)/i, 20],
    [/^monolithic|unified/i, /^(modular|segmented|fragmented)/i, 20],
    
    // Color & Tone
    [/^warm|cozy/i, /^cool|cold|icy/i, 20],
    [/^cool|cold/i, /^warm|fiery|hot/i, 20],
    [/^light|bright|luminous/i, /^dark|shadow|obscure/i, 20],
    [/^dark|shadow/i, /^light|bright|luminous/i, 20],
    [/^colorful|vibrant|saturated/i, /^(monochrome|muted|colorless|desaturated)/i, 20],
    [/^monochrome|muted|colorless/i, /^(colorful|vibrant|saturated)/i, 20],
    [/^pastel/i, /^(vibrant|bold|saturated)/i, 20],
    [/^neon/i, /^(muted|subtle|pastel)/i, 20],
    
    // Texture
    [/^smooth|polished|glossy/i, /^(rough|textured|grainy|matte)/i, 20],
    [/^rough|textured|grainy/i, /^(smooth|polished|glossy)/i, 20],
    [/^soft|gentle/i, /^(hard|rigid|sharp)/i, 20],
    [/^hard|rigid|sharp/i, /^(soft|gentle|pliable)/i, 20],
    [/^solid/i, /^(fluid|hollow|porous)/i, 20],
    [/^fluid/i, /^(solid|rigid|static)/i, 20],
    
    // Mood & Vibe
    [/^calm|peace|serene/i, /^(chaotic|energetic|dramatic|turbulent)/i, 20],
    [/^chaotic|energetic|dramatic/i, /^(calm|peace|serene|tranquil)/i, 20],
    [/^luxurious|premium|exclusive/i, /^(accessible|modest|economy|austerity)/i, 20],
    [/^accessible|modest/i, /^(luxurious|premium|exclusive)/i, 20],
    [/^professional|corporate|formal/i, /^(casual|playful|informal|relaxed)/i, 20],
    [/^casual|playful|informal/i, /^(professional|corporate|formal)/i, 20],
    [/^authoritative|bold|confident/i, /^(gentle|muted|understated|subtle)/i, 20],
    [/^gentle|muted|understated/i, /^(authoritative|bold|confident)/i, 20],
    
    // Social/Cultural
    [/^academia|scholarly/i, /^(commercial|practical|applied|streetwear)/i, 20],
    [/^artistic|creative/i, /^(commercial|utilitarian|functional)/i, 20],
    [/^commercial|utilitarian/i, /^(artistic|aesthetic|decorative)/i, 20],
    
    // Layout
    [/^grid|based/i, /^(organic|fluid|freeform|masonry)/i, 20],
    [/^dense|compact/i, /^(spacious|minimal|open)/i, 20],
    [/^spacious|open/i, /^(dense|compact|cramped)/i, 20],
  ]
  
  for (const [pattern1, pattern2, points] of strictAntonymPatterns) {
    if ((pattern1.test(label) && pattern2.test(opp)) || 
        (pattern2.test(label) && pattern1.test(opp))) {
      return points // High score for verified antonyms
    }
  }
  
  // SEMANTIC OPPOSITES (lower score, but still valid)
  // These are conceptually opposite but not direct antonyms
  let semanticScore = 0
  
  // Check category alignment - opposites often share category
  const concept2 = allConcepts.find(c => 
    c.label.toLowerCase() === opp || c.id.toLowerCase() === opp
  )
  if (concept2) {
    // Same category = potential semantic opposite (design concepts often have opposites in same category)
    if (concept2.category && concept.category && concept2.category === concept.category) {
      semanticScore += 3
    }
    
    // Check for semantic axis patterns (weaker than strict antonyms)
    const semanticAxes: Array<[RegExp, RegExp, number]> = [
      // Style variations
      [/^clean|simple|minimal/i, /^(complex|intricate|detailed|ornate)/i, 5],
      [/^complex|intricate|detailed/i, /^(clean|simple|minimal|sparse)/i, 5],
      [/^sparse|empty/i, /^(dense|full|rich|abundant)/i, 5],
      [/^dense|full|rich/i, /^(sparse|empty|minimal)/i, 5],
      
      // Visual weight
      [/^heavy|thick|bold/i, /^(light|thin|delicate|fine)/i, 5],
      [/^light|thin|delicate/i, /^(heavy|thick|bold|strong)/i, 5],
      
      // Movement
      [/^still|static|frozen/i, /^(flowing|moving|dynamic|active)/i, 5],
      [/^flowing|moving|active/i, /^(still|static|frozen|inert)/i, 5],
      
      // Clarity
      [/^clear|obvious|direct/i, /^(obscured|hidden|subtle|indirect)/i, 5],
      [/^obscured|hidden|subtle/i, /^(clear|obvious|direct|explicit)/i, 5],
      
      // Structure
      [/^structured|organized|ordered/i, /^(chaotic|random|disordered|freeform)/i, 5],
      [/^chaotic|random|freeform/i, /^(structured|organized|ordered|systematic)/i, 5],
      
      // Scale
      [/^large|big|massive/i, /^(small|tiny|minute|micro)/i, 5],
      [/^small|tiny|minute/i, /^(large|big|massive|huge)/i, 5],
      
      // Intensity
      [/^intense|strong|powerful/i, /^(mild|weak|gentle|soft)/i, 5],
      [/^mild|weak|gentle/i, /^(intense|strong|powerful|forceful)/i, 5],
      
      // Time
      [/^temporal|time|temporal/i, /^(timeless|eternal|permanent)/i, 5],
      [/^timeless|eternal/i, /^(temporal|temporary|ephemeral)/i, 5],
      
      // Space
      [/^open|spacious|expansive/i, /^(closed|confined|compact|tight)/i, 5],
      [/^closed|confined|compact/i, /^(open|spacious|expansive|wide)/i, 5],
    ]
    
    for (const [pattern1, pattern2, points] of semanticAxes) {
      if ((pattern1.test(label) && pattern2.test(opp)) || 
          (pattern2.test(label) && pattern1.test(opp))) {
        semanticScore += points
        break
      }
    }
    
    // Bonus: Check if concepts are in different semantic clusters
    // (e.g., "academia" vs "commercial" - different contexts)
    const contextPairs: Array<[RegExp, RegExp, number]> = [
      [/^academic|scholarly|educational/i, /^(commercial|business|corporate)/i, 4],
      [/^artistic|creative|aesthetic/i, /^(utilitarian|functional|practical)/i, 4],
      [/^luxury|premium|exclusive/i, /^(accessible|democratic|inclusive)/i, 4],
      [/^professional|corporate|formal/i, /^(casual|relaxed|informal)/i, 4],
      [/^urban|city|metropolitan/i, /^(rural|natural|organic)/i, 4],
      [/^digital|virtual|screen/i, /^(physical|tactile|material)/i, 4],
    ]
    
    for (const [pattern1, pattern2, points] of contextPairs) {
      if ((pattern1.test(label) && pattern2.test(opp)) || 
          (pattern2.test(label) && pattern1.test(opp))) {
        semanticScore += points
        break
      }
    }
  }
  
  // Return semantic score if > 0, otherwise -1 (filtered out)
  return semanticScore > 0 ? semanticScore : -1
}

async function main() {
  console.log('🧹 Cleaning opposites in seed_concepts.json...\n')
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(seedContent)
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`)
  
  // Build lookup maps
  const labelToConcept = new Map<string, Concept>()
  const idToConcept = new Map<string, Concept>()
  for (const c of concepts) {
    labelToConcept.set(c.label.toLowerCase(), c)
    idToConcept.set(c.id.toLowerCase(), c)
  }
  
  // Clean opposites for each concept
  const cleaned: Concept[] = []
  const stats = {
    contradictionsRemoved: 0,
    oppositesRemoved: 0,
    oppositesKept: 0,
    conceptsWithOpposites: 0,
    totalOppositesBefore: 0,
    totalOppositesAfter: 0
  }
  
  for (const concept of concepts) {
    const related = new Set((concept.related || []).map(r => String(r).toLowerCase()))
    const synonyms = new Set((concept.synonyms || []).map(s => String(s).toLowerCase()))
    const opposites = (concept.opposites || []).map(o => String(o))
    
    stats.totalOppositesBefore += opposites.length
    
    // Step 1: Remove contradictions (opposites that are in related or synonyms)
    const validOpposites = opposites.filter(opp => {
      const oppLower = opp.toLowerCase()
      
      // Remove if it's in related
      if (related.has(oppLower)) {
        stats.contradictionsRemoved++
        return false
      }
      
      // Remove if it's a synonym
      if (synonyms.has(oppLower)) {
        stats.contradictionsRemoved++
        return false
      }
      
      // Remove if it's too similar
      if (areTooSimilar(concept, opp, concepts)) {
        stats.oppositesRemoved++
        return false
      }
      
      return true
    })
    
    // Step 2: Score and rank opposites (hybrid: strict antonyms + semantic opposites)
    const scored = validOpposites.map(opp => ({
      label: opp,
      score: scoreOpposite(concept, opp, concepts)
    }))
    .filter(item => item.score > 0) // Keep positive scores (strict antonyms + semantic opposites)
    .sort((a, b) => b.score - a.score) // Sort by score descending (strict antonyms first)
    
    // Prioritize strict antonyms (score >= 20), then add semantic opposites (score 3-10)
    const strictAntonyms = scored.filter(item => item.score >= 20).slice(0, 3) // Top 3 strict
    const semanticOpposites = scored.filter(item => item.score < 20).slice(0, 2) // Top 2 semantic
    const finalOpposites = [...strictAntonyms, ...semanticOpposites]
      .slice(0, 5) // Max 5 total
      .map(item => item.label)
    
    stats.totalOppositesAfter += finalOpposites.length
    stats.oppositesKept += finalOpposites.length
    if (finalOpposites.length > 0) {
      stats.conceptsWithOpposites++
    }
    
    // Create cleaned concept
    const cleanedConcept: Concept = {
      ...concept,
      opposites: finalOpposites.length > 0 ? finalOpposites : undefined
    }
    
    cleaned.push(cleanedConcept)
  }
  
  // Save cleaned version
  const cleanedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts_cleaned.json')
  await fs.writeFile(cleanedPath, JSON.stringify(cleaned, null, 2))
  
  console.log('📊 Cleaning Statistics:')
  console.log(`   Contradictions removed: ${stats.contradictionsRemoved}`)
  console.log(`   Opposites removed (too similar): ${stats.oppositesRemoved}`)
  console.log(`   Opposites kept: ${stats.oppositesKept}`)
  console.log(`   Concepts with opposites: ${stats.conceptsWithOpposites}/${concepts.length}`)
  console.log(`   Total opposites before: ${stats.totalOppositesBefore}`)
  console.log(`   Total opposites after: ${stats.totalOppositesAfter}`)
  console.log(`   Reduction: ${((1 - stats.totalOppositesAfter / stats.totalOppositesBefore) * 100).toFixed(1)}%\n`)
  
  console.log(`💾 Cleaned file saved to: ${cleanedPath}`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. Review the cleaned file`)
  console.log(`   2. If satisfied, replace seed_concepts.json with the cleaned version`)
  console.log(`   3. Re-run generate_semantic_opposites.mjs to update concept-opposites.ts\n`)
}

main().catch(err => {
  console.error('Script failed:', err)
  process.exit(1)
})

