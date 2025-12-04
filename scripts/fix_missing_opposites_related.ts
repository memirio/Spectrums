#!/usr/bin/env tsx
/**
 * Fix Missing Opposites and Related Concepts
 * 
 * Finds concepts missing opposites or related concepts and fills them using:
 * - Gemini API for generating opposites
 * - Semantic similarity (embeddings) for finding related concepts
 * - Existing concepts in the database
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { generateOppositesForConcept } from '../src/lib/gemini'
import { updateConceptOpposites } from '../src/lib/update-concept-opposites'
import { generateOppositesForConcept as generateOppositesDirect } from './generate_opposites_direct'

interface Concept {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  opposites: string[] | null
  embedding: number[]
}

// Normalize concept label to ID format
function normalizeToId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Find opposites by looking at existing opposite relationships (reverse lookup)
function findOppositesFromExistingRelationships(
  concept: Concept,
  allConcepts: Concept[]
): string[] {
  const opposites: string[] = []
  
  // Find concepts that already list this concept as an opposite
  for (const other of allConcepts) {
    if (other.id === concept.id) continue
    if (other.opposites && Array.isArray(other.opposites)) {
      if (other.opposites.includes(concept.id)) {
        opposites.push(other.id)
      }
    }
  }
  
  return opposites
}

// Find related concepts using semantic similarity (high similarity)
function findRelatedConcepts(
  concept: Concept,
  allConcepts: Concept[],
  minSimilarity: number = 0.3,
  maxResults: number = 5
): string[] {
  if (!concept.embedding || concept.embedding.length === 0) {
    return []
  }

  const similarities = allConcepts
    .filter(c => c.id !== concept.id && c.embedding && c.embedding.length > 0)
    .map(c => ({
      id: c.id,
      label: c.label,
      similarity: cosineSimilarity(concept.embedding, c.embedding)
    }))
    .filter(s => s.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)

  return similarities.map(s => s.id)
}

// Find opposite concepts using semantic similarity (low/negative similarity)
function findOppositeConcepts(
  concept: Concept,
  allConcepts: Concept[],
  maxSimilarity: number = 0.1, // Low similarity = potential opposites
  minResults: number = 2,
  maxResults: number = 5
): string[] {
  if (!concept.embedding || concept.embedding.length === 0) {
    return []
  }

  const similarities = allConcepts
    .filter(c => c.id !== concept.id && c.embedding && c.embedding.length > 0)
    .map(c => ({
      id: c.id,
      label: c.label,
      similarity: cosineSimilarity(concept.embedding, c.embedding)
    }))
    .filter(s => s.similarity <= maxSimilarity) // Low similarity = potential opposites
    .sort((a, b) => a.similarity - b.similarity) // Sort by lowest similarity first
    .slice(0, maxResults)

  // If we don't have enough low-similarity concepts, try slightly higher threshold
  if (similarities.length < minResults) {
    const expanded = allConcepts
      .filter(c => c.id !== concept.id && c.embedding && c.embedding.length > 0)
      .map(c => ({
        id: c.id,
        label: c.label,
        similarity: cosineSimilarity(concept.embedding, c.embedding)
      }))
      .filter(s => s.similarity <= 0.2) // Slightly higher threshold
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, maxResults)
    
    return expanded.map(s => s.id)
  }

  return similarities.map(s => s.id)
}

// Find existing concept IDs from labels
async function findConceptIds(labels: string[]): Promise<string[]> {
  const conceptIds: string[] = []
  
  for (const label of labels) {
    // Try exact match first
    const exactMatch = await prisma.concept.findFirst({
      where: { label: { equals: label, mode: 'insensitive' } },
      select: { id: true }
    })
    
    if (exactMatch) {
      conceptIds.push(exactMatch.id)
      continue
    }
    
    // Try normalized ID match
    const normalizedId = normalizeToId(label)
    const idMatch = await prisma.concept.findUnique({
      where: { id: normalizedId },
      select: { id: true }
    })
    
    if (idMatch) {
      conceptIds.push(idMatch.id)
      continue
    }
    
    // Skip synonym search for now - just use normalized IDs if no exact match found
    // This is acceptable since we're generating opposites, not looking up existing ones
  }
  
  return conceptIds
}

async function main() {
  console.log('🔍 Finding concepts missing opposites or related concepts...\n')
  
  // Fetch all concepts
  const allConceptsRaw = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      synonyms: true,
      related: true,
      opposites: true,
      embedding: true,
    }
  })
  
  // Parse concepts
  const allConcepts: Concept[] = allConceptsRaw.map(c => ({
    id: c.id,
    label: c.label,
    synonyms: Array.isArray(c.synonyms) ? c.synonyms : [],
    related: Array.isArray(c.related) ? c.related : [],
    opposites: Array.isArray(c.opposites) ? c.opposites : null,
    embedding: Array.isArray(c.embedding) ? c.embedding as number[] : [],
  }))
  
  console.log(`📊 Total concepts: ${allConcepts.length}`)
  
  // Find concepts missing opposites
  const missingOpposites = allConcepts.filter(c => 
    !c.opposites || c.opposites.length === 0
  )
  
  // Find concepts missing related
  const missingRelated = allConcepts.filter(c => 
    !c.related || c.related.length === 0
  )
  
  console.log(`❌ Missing opposites: ${missingOpposites.length}`)
  console.log(`❌ Missing related: ${missingRelated.length}\n`)
  
  // Process concepts missing opposites
  if (missingOpposites.length > 0) {
    console.log('🔄 Finding opposites for concepts missing them...\n')
    
    let successCount = 0
    let failCount = 0
    let skippedCount = 0
    
    for (let i = 0; i < missingOpposites.length; i++) {
      const concept = missingOpposites[i]
      console.log(`[${i + 1}/${missingOpposites.length}] Processing: "${concept.label}" (${concept.id})`)
      
      try {
        let oppositeIds: string[] = []
        
        // Strategy 0: Check if other concepts already list this as opposite (reverse lookup)
        const reverseOpposites = findOppositesFromExistingRelationships(concept, allConcepts)
        if (reverseOpposites.length > 0) {
          oppositeIds = reverseOpposites
          const oppositeLabels = reverseOpposites.map(id => {
            const found = allConcepts.find(c => c.id === id)
            return found ? found.label : id
          })
          console.log(`  ✅ Found ${oppositeIds.length} opposites from reverse relationships: ${oppositeLabels.join(', ')}`)
        }
        
        // Strategy 1: Try to find opposites using semantic similarity (low similarity = opposites)
        if (oppositeIds.length < 2 && concept.embedding && concept.embedding.length > 0) {
          console.log(`  🔍 Searching for opposites using semantic similarity...`)
          const semanticOpposites = findOppositeConcepts(concept, allConcepts, 0.2, 2, 5)
          if (semanticOpposites.length >= 2) {
            oppositeIds = Array.from(new Set([...oppositeIds, ...semanticOpposites]))
            const oppositeLabels = semanticOpposites.map(id => {
              const found = allConcepts.find(c => c.id === id)
              return found ? found.label : id
            })
            console.log(`  ✅ Found ${semanticOpposites.length} opposites using semantic similarity: ${oppositeLabels.join(', ')}`)
          } else if (semanticOpposites.length > 0) {
            oppositeIds = Array.from(new Set([...oppositeIds, ...semanticOpposites]))
            console.log(`  ⚠️  Semantic similarity found ${semanticOpposites.length} opposites (less than ideal but using them)`)
          } else {
            console.log(`  ⚠️  Semantic similarity found 0 opposites`)
          }
        } else if (oppositeIds.length < 2) {
          console.log(`  ⚠️  No embedding available for semantic search`)
        }
        
        // Strategy 2: Try knowledge-based opposites (no API calls)
        if (oppositeIds.length < 2) {
          try {
            console.log(`  🔄 Trying knowledge-based opposites...`)
            // Use the knowledge-based opposites generator - import from generate_opposites_direct.ts
            const generateDirect = (label: string): string[] => {
              const lower = label.toLowerCase()
              
              // Comprehensive knowledge-based mappings
              const map: Record<string, string[]> = {
                // Abstract concepts
                'soundness': ['unsoundness', 'instability', 'weakness'],
                'naturalness': ['artificiality', 'synthetic', 'unnatural'],
                'aggression': ['peace', 'calm', 'gentleness', 'passivity'],
                'aggressive': ['gentle', 'peaceful', 'passive', 'calm'],
                'activeness': ['passivity', 'inactivity', 'stillness'],
                'biodegradable': ['non-biodegradable', 'synthetic', 'permanent'],
                'biodegradability': ['permanence', 'synthetic', 'non-biodegradable'],
                'recyclable': ['non-recyclable', 'disposable', 'waste'],
                'swiftness': ['slowness', 'delay', 'stagnation'],
                'fastness': ['slowness', 'delay', 'stagnation'],
                'quickening': ['slowing', 'delay', 'stagnation'],
                'speedup': ['slowdown', 'delay', 'stagnation'],
                'speeding': ['slowing', 'delay', 'stagnation'],
                'dynamics': ['static', 'still', 'motionless'],
                
                // Colors
                'red': ['green', 'blue', 'cyan'],
                'reddish': ['greenish', 'bluish', 'cyan'],
                'ruddy': ['pale', 'wan', 'colorless'],
                'cerise': ['cyan', 'green', 'blue'],
                'cherry': ['cyan', 'green', 'blue'],
                'crimson': ['cyan', 'green', 'blue'],
                'burgundy': ['cyan', 'green', 'blue'],
                'chocolate': ['cyan', 'green', 'blue'],
                'scarlet': ['cyan', 'green', 'blue'],
                'ruby': ['cyan', 'green', 'blue'],
                'sangria': ['cyan', 'green', 'blue'],
                
                // Shapes/Forms
                'cubelike': ['spherical', 'round', 'organic'],
                'cubic': ['spherical', 'round', 'organic'],
                'cubiform': ['spherical', 'round', 'organic'],
                'cuboid': ['spherical', 'round', 'organic'],
                'cuboidal': ['spherical', 'round', 'organic'],
                'tessellation': ['organic', 'irregular', 'chaotic'],
                'stencil': ['freehand', 'organic', 'irregular'],
                'perforation': ['solid', 'unbroken', 'continuous'],
                
                // Actions/States
                'crush': ['expand', 'release', 'free'],
                'compaction': ['expansion', 'looseness', 'spread'],
                'compression': ['expansion', 'release', 'looseness'],
                'cutting': ['joining', 'connecting', 'unifying'],
                
                // Qualities
                'creative': ['uncreative', 'imitative', 'derivative'],
                'brio': ['lethargy', 'sluggishness', 'dullness'],
                'capital': ['lowercase', 'small', 'minimal'],
                'commerce': ['non-profit', 'charity', 'altruism'],
                'course': ['stillness', 'stasis', 'immobility'],
                
                // Suffix-based patterns
                'ness': [], // Will be handled by suffix removal
                'ity': [], // Will be handled by suffix removal
                'ability': ['inability', 'incapacity', 'incompetence'],
                'ableness': ['inability', 'incapacity', 'incompetence'],
                'ingness': ['stillness', 'inactivity', 'passivity'],
                
                // Food/Drink
                'afters': ['mains', 'entree', 'primary'],
                'appetisingness': ['unappetizing', 'repulsive', 'unappealing'],
                'appetizingness': ['unappetizing', 'repulsive', 'unappealing'],
                'drink': ['food', 'solid', 'substance'],
                'drinkable': ['inedible', 'undrinkable', 'toxic'],
                'potable': ['inedible', 'undrinkable', 'toxic'],
                'cyder': ['food', 'solid', 'substance'],
                'dietary': ['non-dietary', 'indulgent', 'unrestricted'],
                'succulence': ['dryness', 'arid', 'parched'],
                'pastry': ['savory', 'salty', 'main'],
                'nourishing': ['harmful', 'toxic', 'depleting'],
                'nutritious': ['harmful', 'toxic', 'depleting'],
                'preventive': ['reactive', 'curative', 'remedial'],
                'vitamin': ['toxin', 'poison', 'harmful'],
                'supplement': ['depletion', 'deficiency', 'lack'],
                'refreshment': ['exhaustion', 'fatigue', 'drain'],
                
                // Nature
                'birdlike': ['mammalian', 'reptilian', 'aquatic'],
                'chartaceous': ['leathery', 'woody', 'fibrous'],
                'papery': ['thick', 'solid', 'dense'],
                'stuff': ['emptiness', 'void', 'space'],
                'flimsy': ['sturdy', 'solid', 'robust'],
                'kraft': ['synthetic', 'plastic', 'artificial'],
                
                // Structures
                'columnation': ['horizontal', 'flat', 'spread'],
                'aggregation': ['separation', 'dispersion', 'scatter'],
                'stackability': ['unstackable', 'irregular', 'chaotic'],
                'stacking': ['scattering', 'dispersion', 'chaos'],
                'tiering': ['flat', 'single-level', 'uniform'],
                'storage': ['display', 'exposure', 'openness'],
                
                // Abstract qualities
                'answerability': ['unaccountability', 'irresponsibility', 'immunity'],
                'answerableness': ['unaccountability', 'irresponsibility', 'immunity'],
                'indirectness': ['directness', 'straightforwardness', 'clarity'],
                'inattention': ['attention', 'focus', 'awareness'],
                'eco-friendliness': ['harmful', 'polluting', 'destructive'],
                'impromptu-display': ['planned', 'structured', 'formal'],
                'responsibleness': ['irresponsibility', 'negligence', 'carelessness'],
                
                // Characteristics
                'revolutionary': ['conservative', 'traditional', 'conventional'],
                'revolutionist': ['conservative', 'traditional', 'conventional'],
                'radical': ['moderate', 'conservative', 'traditional'],
                'subversive': ['supportive', 'conformist', 'orthodox'],
                'subverter': ['supporter', 'conformist', 'orthodox'],
                'decadent': ['virtuous', 'modest', 'restrained'],
                'ornithological': ['mammalian', 'reptilian', 'aquatic'],
                
                // Food categories
                'dairy': ['non-dairy', 'vegan', 'plant-based'],
                'dairy-alternative': ['dairy', 'animal', 'traditional'],
                'plantbased': ['animal-based', 'meat', 'dairy'],
                'nondairy': ['dairy', 'animal', 'traditional'],
                'vegan': ['carnivorous', 'animal-based', 'meat'],
                
                // Packaging
                'bundle': ['individual', 'separate', 'discrete'],
                'package': ['unpackaged', 'loose', 'scattered'],
                'packet': ['bulk', 'loose', 'unpackaged'],
                'parcel': ['bulk', 'loose', 'unpackaged'],
                'vinyl': ['natural', 'organic', 'biodegradable'],
                'layers': ['single', 'monolithic', 'unified'],
                'imperfection': ['perfection', 'flawlessness', 'excellence'],
                'inclusivity': ['exclusivity', 'elitism', 'discrimination'],
                
                // Additional concepts
                'reusability': ['disposable', 'single-use', 'waste'],
                'upcycling': ['downcycling', 'waste', 'disposal'],
                'renewability': ['non-renewable', 'finite', 'depleting'],
                'repurposability': ['single-purpose', 'fixed', 'rigid'],
                'situation': ['stasis', 'permanence', 'fixed'],
                'unlifelike': ['lifelike', 'realistic', 'natural'],
                'juvenile': ['mature', 'adult', 'sophisticated'],
                'kid': ['adult', 'mature', 'sophisticated'],
                'vivification': ['stagnation', 'stillness', 'death'],
                'spiritedness': ['lethargy', 'dullness', 'apathy'],
                'occasion': ['routine', 'ordinary', 'commonplace'],
                'feathered': ['scaled', 'smooth', 'bare'],
                'winged': ['wingless', 'grounded', 'earthbound'],
              }
              
              // Try direct match
              if (map[lower]) return map[lower]
              
              // Try removing common suffixes
              if (lower.endsWith('ness')) {
                const base = lower.slice(0, -4)
                if (map[base]) return map[base]
                // Try common opposites for -ness words
                return ['absence', 'lack', 'void']
              }
              
              if (lower.endsWith('ity') || lower.endsWith('ability') || lower.endsWith('ableness')) {
                const base = lower.replace(/ity$|ability$|ableness$/, '')
                if (map[base]) return map[base]
                // Try common opposites for -ity words
                return ['absence', 'lack', 'void']
              }
              
              if (lower.endsWith('ing')) {
                const base = lower.slice(0, -3)
                if (map[base]) return map[base]
              }
              
              if (lower.endsWith('like')) {
                return ['unlike', 'different', 'opposite']
              }
              
              // Pattern matching for common word roots
              if (lower.includes('aggress')) return ['peace', 'calm', 'gentleness', 'passivity']
              if (lower.includes('creat')) return ['uncreative', 'imitative', 'derivative']
              if (lower.includes('fast') || lower.includes('quick') || lower.includes('swift')) {
                return ['slow', 'sluggish', 'delayed', 'stagnant']
              }
              if (lower.includes('compress') || lower.includes('compact') || lower.includes('crush')) {
                return ['expand', 'loosen', 'release', 'spread']
              }
              if (lower.includes('reus') || lower.includes('recycl')) {
                return ['disposable', 'single-use', 'waste']
              }
              if (lower.includes('biodegrad') || lower.includes('eco')) {
                return ['synthetic', 'permanent', 'harmful']
              }
              if (lower.includes('nourish') || lower.includes('nutrit')) {
                return ['harmful', 'toxic', 'depleting']
              }
              if (lower.includes('prevent')) {
                return ['reactive', 'curative', 'remedial']
              }
              if (lower.includes('vitamin') || lower.includes('supplement')) {
                return ['toxin', 'deficiency', 'depletion']
              }
              if (lower.includes('refresh') || lower.includes('vivif')) {
                return ['exhaustion', 'fatigue', 'stagnation']
              }
              if (lower.includes('spirit') || lower.includes('brio')) {
                return ['lethargy', 'dullness', 'apathy']
              }
              if (lower.includes('feather') || lower.includes('wing') || lower.includes('bird')) {
                return ['mammalian', 'reptilian', 'aquatic']
              }
              if (lower.includes('plant') || lower.includes('vegan') || lower.includes('nondairy')) {
                return ['animal', 'meat', 'dairy']
              }
              if (lower.includes('cub') || lower.includes('tessellat')) {
                return ['spherical', 'round', 'organic']
              }
              if (lower.includes('stack') || lower.includes('tier') || lower.includes('column')) {
                return ['scatter', 'flat', 'horizontal']
              }
              if (lower.includes('pack') || lower.includes('bundle') || lower.includes('aggregat')) {
                return ['separate', 'individual', 'scatter']
              }
              if (lower.includes('paper') || lower.includes('chart') || lower.includes('kraft')) {
                return ['synthetic', 'plastic', 'durable']
              }
              if (lower.includes('flimsy') || lower.includes('stuff')) {
                return ['sturdy', 'solid', 'robust']
              }
              if (lower.includes('juvenile') || lower.includes('kid')) {
                return ['mature', 'adult', 'sophisticated']
              }
              if (lower.includes('unlifelike')) {
                return ['lifelike', 'realistic', 'natural']
              }
              if (lower.includes('occasion')) {
                return ['routine', 'ordinary', 'commonplace']
              }
              if (lower.includes('storage')) {
                return ['display', 'exposure', 'openness']
              }
              
              return []
            }
            const oppositeLabels = generateDirect(concept.label)
            
            if (oppositeLabels.length > 0) {
              console.log(`  ✅ Generated ${oppositeLabels.length} opposites from knowledge base: ${oppositeLabels.join(', ')}`)
              
              // Find existing concept IDs for these opposites
              const knowledgeOppositeIds = await findConceptIds(oppositeLabels)
              
              if (knowledgeOppositeIds.length > 0) {
                oppositeIds = Array.from(new Set([...oppositeIds, ...knowledgeOppositeIds]))
                console.log(`  ✅ Found ${knowledgeOppositeIds.length} matching concepts from knowledge base`)
              } else {
                // Use normalized labels as IDs (they might be new concepts)
                const normalizedIds = oppositeLabels.map(normalizeToId)
                oppositeIds = Array.from(new Set([...oppositeIds, ...normalizedIds]))
                console.log(`  ✅ Using normalized labels as IDs: ${normalizedIds.join(', ')}`)
              }
              
              // Update concept-opposites.ts file
              if (oppositeIds.length > 0) {
                await updateConceptOpposites(concept.id, oppositeIds)
              }
            }
          } catch (error: any) {
            console.log(`  ⚠️  Knowledge-based generation error: ${error.message}`)
          }
        }
        
        // Strategy 3: If still not enough, try Gemini API (with rate limiting) - skip if rate limited
        if (oppositeIds.length < 2) {
          try {
            console.log(`  🔄 Trying Gemini API for more opposites...`)
            const oppositeLabels = await generateOppositesForConcept(concept.label)
            
            if (oppositeLabels.length > 0) {
              console.log(`  ✅ Generated ${oppositeLabels.length} opposites from Gemini: ${oppositeLabels.join(', ')}`)
              
              // Find existing concept IDs for these opposites
              const geminiOppositeIds = await findConceptIds(oppositeLabels)
              
              if (geminiOppositeIds.length > 0) {
                oppositeIds = Array.from(new Set([...oppositeIds, ...geminiOppositeIds]))
                console.log(`  ✅ Found ${geminiOppositeIds.length} matching concepts from Gemini`)
              } else {
                // Use normalized labels as IDs (they might be new concepts)
                const normalizedIds = oppositeLabels.map(normalizeToId)
                oppositeIds = Array.from(new Set([...oppositeIds, ...normalizedIds]))
                console.log(`  ✅ Using normalized labels as IDs: ${normalizedIds.join(', ')}`)
              }
              
              // Update concept-opposites.ts file
              if (oppositeIds.length > 0) {
                await updateConceptOpposites(concept.id, oppositeIds)
              }
              
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          } catch (error: any) {
            if (error.message?.includes('429') || error.message?.includes('quota')) {
              console.log(`  ⚠️  Rate limited, skipping Gemini API`)
              skippedCount++
            } else {
              console.log(`  ⚠️  Gemini API error: ${error.message}`)
            }
          }
        }
        
        if (oppositeIds.length === 0) {
          console.log(`  ⚠️  No opposites found, skipping`)
          failCount++
          continue
        }
        
        // Update database
        const currentOpposites = Array.isArray(concept.opposites) ? concept.opposites : []
        const mergedOpposites = Array.from(new Set([...currentOpposites, ...oppositeIds]))
        
        await prisma.concept.update({
          where: { id: concept.id },
          data: { opposites: mergedOpposites }
        })
        
        console.log(`  ✅ Updated database with ${mergedOpposites.length} opposites`)
        successCount++
      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
        failCount++
      }
      
      console.log('')
    }
    
    console.log(`\n📊 Opposites Summary:`)
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Failed: ${failCount}`)
    console.log(`  ⏭️  Skipped (rate limited): ${skippedCount}`)
  }
  
  // Process concepts missing related
  if (missingRelated.length > 0) {
    console.log('\n🔄 Finding related concepts using semantic similarity...\n')
    
    let successCount = 0
    let failCount = 0
    
    for (let i = 0; i < missingRelated.length; i++) {
      const concept = missingRelated[i]
      console.log(`[${i + 1}/${missingRelated.length}] Processing: "${concept.label}" (${concept.id})`)
      
      try {
        if (!concept.embedding || concept.embedding.length === 0) {
          console.log(`  ⚠️  No embedding available, skipping`)
          failCount++
          continue
        }
        
        // Find related concepts using semantic similarity
        const relatedIds = findRelatedConcepts(concept, allConcepts, 0.3, 5)
        
        if (relatedIds.length === 0) {
          console.log(`  ⚠️  No related concepts found (similarity threshold: 0.3)`)
          failCount++
          continue
        }
        
        console.log(`  ✅ Found ${relatedIds.length} related concepts`)
        
        // Update database
        const currentRelated = Array.isArray(concept.related) ? concept.related : []
        const mergedRelated = Array.from(new Set([...currentRelated, ...relatedIds]))
        
        await prisma.concept.update({
          where: { id: concept.id },
          data: { related: mergedRelated }
        })
        
        successCount++
      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
        failCount++
      }
      
      console.log('')
    }
    
    console.log(`\n📊 Related Summary:`)
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Failed: ${failCount}`)
  }
  
  console.log('\n✅ Done!')
}

main().catch(console.error)

