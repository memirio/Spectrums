#!/usr/bin/env tsx
// scripts/categorize_existing_concepts.ts
import fs from 'fs/promises'
import path from 'path'

type ConceptSeed = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  category?: string
}

// Category mapping: map existing concept labels to new categories
const CATEGORY_MAPPING: Record<string, string> = {
  // Feeling / Emotion
  'joyful': 'Feeling / Emotion',
  'joy': 'Feeling / Emotion',
  'playful': 'Feeling / Emotion',
  'happy': 'Feeling / Emotion',
  'cheerful': 'Feeling / Emotion',
  'melancholy': 'Feeling / Emotion',
  'sad': 'Feeling / Emotion',
  'anxious': 'Feeling / Emotion',
  'hopeful': 'Feeling / Emotion',
  'peaceful': 'Feeling / Emotion',
  'serene': 'Feeling / Emotion',
  'nostalgic': 'Feeling / Emotion',
  'isolated': 'Feeling / Emotion',
  'calm': 'Feeling / Emotion',
  
  // Vibe / Mood
  'dreamlike': 'Vibe / Mood',
  'dreamy': 'Vibe / Mood',
  'futuristic': 'Vibe / Mood',
  'cinematic': 'Vibe / Mood',
  'intimate': 'Vibe / Mood',
  'chaotic': 'Vibe / Mood',
  'ethereal': 'Vibe / Mood',
  'industrial': 'Vibe / Mood',
  'somber': 'Vibe / Mood',
  'mysterious': 'Vibe / Mood',
  'urban': 'Vibe / Mood',
  
  // Philosophical / Existential Concepts
  'identity': 'Philosophical / Existential Concepts',
  'duality': 'Philosophical / Existential Concepts',
  'impermanence': 'Philosophical / Existential Concepts',
  'chaos': 'Philosophical / Existential Concepts',
  'order': 'Philosophical / Existential Concepts',
  'rebirth': 'Philosophical / Existential Concepts',
  'truth': 'Philosophical / Existential Concepts',
  'memory': 'Philosophical / Existential Concepts',
  'infinity': 'Philosophical / Existential Concepts',
  'transformation': 'Philosophical / Existential Concepts',
  
  // Aesthetic / Formal
  'symmetry': 'Aesthetic / Formal',
  'asymmetry': 'Aesthetic / Formal',
  'balance': 'Aesthetic / Formal',
  'rhythm': 'Aesthetic / Formal',
  'contrast': 'Aesthetic / Formal',
  'unity': 'Aesthetic / Formal',
  'composition': 'Aesthetic / Formal',
  'harmony': 'Aesthetic / Formal',
  'flow': 'Aesthetic / Formal',
  'minimalism': 'Aesthetic / Formal',
  'minimalistic': 'Aesthetic / Formal',
  'minimal': 'Aesthetic / Formal',
  
  // Natural / Metaphysical Concepts
  'growth': 'Natural / Metaphysical Concepts',
  'decay': 'Natural / Metaphysical Concepts',
  'evolution': 'Natural / Metaphysical Concepts',
  'stillness': 'Natural / Metaphysical Concepts',
  'energy': 'Natural / Metaphysical Concepts',
  'renewal': 'Natural / Metaphysical Concepts',
  'interconnection': 'Natural / Metaphysical Concepts',
  'transcendence': 'Natural / Metaphysical Concepts',
  'organic': 'Natural / Metaphysical Concepts',
  
  // Social / Cultural Concepts
  'consumerism': 'Social / Cultural Concepts',
  'diversity': 'Social / Cultural Concepts',
  'power': 'Social / Cultural Concepts',
  'isolation': 'Social / Cultural Concepts',
  'globalization': 'Social / Cultural Concepts',
  'sustainability': 'Social / Cultural Concepts',
  'technology': 'Social / Cultural Concepts',
  'authenticity': 'Social / Cultural Concepts',
  'modernity': 'Social / Cultural Concepts',
  'corporate': 'Social / Cultural Concepts',
  'professional': 'Social / Cultural Concepts',
  
  // Design Style
  'brutalism': 'Design Style',
  'brutalist': 'Design Style',
  'bauhaus': 'Design Style',
  'surrealism': 'Design Style',
  'surreal': 'Design Style',
  'postmodernism': 'Design Style',
  'postmodern': 'Design Style',
  'futurism': 'Design Style',
  'art deco': 'Design Style',
  'maximalism': 'Design Style',
  'maximalist': 'Design Style',
  'retro-futurism': 'Design Style',
  'skeuomorphic': 'Design Style',
  'glassmorphism': 'Design Style',
  'neomorphism': 'Design Style',
  'neumorphism': 'Design Style',
  
  // Color & Tone
  'warm': 'Color & Tone',
  'cool': 'Color & Tone',
  'monochrome': 'Color & Tone',
  'monochromatic': 'Color & Tone',
  'pastel': 'Color & Tone',
  'vibrant': 'Color & Tone',
  'muted': 'Color & Tone',
  'neon': 'Color & Tone',
  'high-contrast': 'Color & Tone',
  'high contrast': 'Color & Tone',
  'gradient': 'Color & Tone',
  'tonal harmony': 'Color & Tone',
  'shadow play': 'Color & Tone',
  'colorful': 'Color & Tone',
  'colorless': 'Color & Tone',
  'black and white': 'Color & Tone',
  
  // Texture & Materiality
  'matte': 'Texture & Materiality',
  'glossy': 'Texture & Materiality',
  'grainy': 'Texture & Materiality',
  'layered': 'Texture & Materiality',
  'soft': 'Texture & Materiality',
  'dense': 'Texture & Materiality',
  'transparent': 'Texture & Materiality',
  'metallic': 'Texture & Materiality',
  'synthetic': 'Texture & Materiality',
  'fibrous': 'Texture & Materiality',
  'fluid': 'Texture & Materiality',
  'textured': 'Texture & Materiality',
  'smooth': 'Texture & Materiality',
  'rough': 'Texture & Materiality',
  
  // Form & Structure
  'grid': 'Form & Structure',
  'line': 'Form & Structure',
  'shape': 'Form & Structure',
  'scale': 'Form & Structure',
  'proportion': 'Form & Structure',
  'repetition': 'Form & Structure',
  'modularity': 'Form & Structure',
  'modular': 'Form & Structure',
  'hierarchy': 'Form & Structure',
  'fragmentation': 'Form & Structure',
  'geometric': 'Form & Structure',
  'rounded': 'Form & Structure',
  'angular': 'Form & Structure',
  'straight': 'Form & Structure',
  'curved': 'Form & Structure',
  
  // Design Technique
  'photography': 'Design Technique',
  'photo': 'Design Technique',
  'photographic': 'Design Technique',
  'collage': 'Design Technique',
  '3d': 'Design Technique',
  '3d rendering': 'Design Technique',
  '3d-rendering': 'Design Technique',
  'illustration': 'Design Technique',
  'illustrated': 'Design Technique',
  'vector graphics': 'Design Technique',
  'generative art': 'Design Technique',
  'painting': 'Design Technique',
  'ai synthesis': 'Design Technique',
  'glitch art': 'Design Technique',
  'mixed media': 'Design Technique',
  'typography': 'Design Technique',
  'motion design': 'Design Technique',
  'animation': 'Design Technique',
}

/**
 * Determine category for a concept based on its label and synonyms
 */
function determineCategory(concept: ConceptSeed): string {
  // Check label first
  const labelLower = concept.label.toLowerCase()
  if (CATEGORY_MAPPING[labelLower]) {
    return CATEGORY_MAPPING[labelLower]
  }
  
  // Check synonyms
  for (const synonym of concept.synonyms || []) {
    const synLower = synonym.toLowerCase()
    if (CATEGORY_MAPPING[synLower]) {
      return CATEGORY_MAPPING[synLower]
    }
  }
  
  // Check related terms
  for (const related of concept.related || []) {
    const relLower = related.toLowerCase()
    if (CATEGORY_MAPPING[relLower]) {
      return CATEGORY_MAPPING[relLower]
    }
  }
  
  // Pattern-based categorizations (more specific checks)
  
  // Color/Tone patterns
  if (labelLower.includes('color') || labelLower.includes('hue') || 
      labelLower.includes('analogous') || labelLower.includes('complementary') ||
      labelLower.includes('palette') || labelLower.includes('saturation')) {
    return 'Color & Tone'
  }
  
  // Form/Structure patterns
  if (labelLower.includes('asymmetrical') || labelLower.includes('symmetrical') ||
      labelLower.includes('layout') || labelLower.includes('grid') ||
      labelLower.includes('card') || labelLower.includes('accordion') ||
      labelLower.includes('architecture') || labelLower.includes('structure')) {
    return 'Form & Structure'
  }
  
  // Aesthetic/Formal patterns
  if (labelLower.includes('minimal') || labelLower.includes('simple') || 
      labelLower.includes('clean') || labelLower.includes('balance') ||
      labelLower.includes('harmony') || labelLower.includes('composition') ||
      labelLower.includes('contrast') || labelLower.includes('unity') ||
      labelLower.includes('rhythm')) {
    return 'Aesthetic / Formal'
  }
  
  // Design Technique patterns
  if (labelLower.includes('handwritten') || labelLower.includes('hand-drawn') ||
      labelLower.includes('hand drawn') || labelLower.includes('lettering') ||
      labelLower.includes('calligraphy') || labelLower.includes('brush')) {
    return 'Design Technique'
  }
  
  // Vibe/Mood patterns
  if (labelLower.includes('modern') || labelLower.includes('contemporary') || 
      labelLower.includes('current') || labelLower.includes('cutting-edge') ||
      labelLower.includes('futuristic') || labelLower.includes('cinematic')) {
    return 'Vibe / Mood'
  }
  
  // Social/Cultural patterns
  if (labelLower.includes('premium') || labelLower.includes('luxury') || 
      labelLower.includes('high-end') || labelLower.includes('corporate') ||
      labelLower.includes('professional') || labelLower.includes('agency') ||
      labelLower.includes('authoritative')) {
    return 'Social / Cultural Concepts'
  }
  
  // Feeling/Emotion patterns
  if (labelLower.includes('whimsical') || labelLower.includes('fun') || 
      labelLower.includes('bubbly') || labelLower.includes('joy') ||
      labelLower.includes('happy') || labelLower.includes('cheerful')) {
    return 'Feeling / Emotion'
  }
  
  // Design Style patterns
  if (labelLower.includes('traditional') || labelLower.includes('classic') || 
      labelLower.includes('vintage') || labelLower.includes('retro') ||
      labelLower.includes('cottagecore') || labelLower.includes('aesthetic')) {
    return 'Design Style'
  }
  
  // Texture/Materiality patterns
  if (labelLower.includes('dense') || labelLower.includes('gentle') ||
      labelLower.includes('soft') || labelLower.includes('rough') ||
      labelLower.includes('smooth') || labelLower.includes('grainy')) {
    return 'Texture & Materiality'
  }
  
  // Default fallback
  return 'Aesthetic / Formal'
}

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const content = await fs.readFile(seedPath, 'utf-8')
  const concepts: ConceptSeed[] = JSON.parse(content)
  
  console.log(`📚 Processing ${concepts.length} concepts...`)
  
  let categorized = 0
  let unchanged = 0
  
  // Categorize each concept
  for (const concept of concepts) {
    const oldCategory = concept.category
    const newCategory = determineCategory(concept)
    
    if (oldCategory !== newCategory) {
      concept.category = newCategory
      categorized++
    } else {
      unchanged++
    }
  }
  
  // Sort by category then label
  concepts.sort((a, b) => {
    const catA = a.category || ''
    const catB = b.category || ''
    if (catA !== catB) return catA.localeCompare(catB)
    return a.label.localeCompare(b.label)
  })
  
  // Write back to file
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2))
  
  console.log(`\n✅ Categorization complete!`)
  console.log(`   📝 Updated: ${categorized} concepts`)
  console.log(`   ✓ Unchanged: ${unchanged} concepts`)
  console.log(`   📊 Total: ${concepts.length} concepts`)
  
  // Show category distribution
  const categoryCounts: Record<string, number> = {}
  for (const concept of concepts) {
    const cat = concept.category || 'Uncategorized'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  }
  
  console.log(`\n📂 Category distribution:`)
  for (const [cat, count] of Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`)
  }
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})

