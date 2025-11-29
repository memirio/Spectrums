// src/jobs/generate_abstract_concepts.ts
import { PrismaClient } from '@prisma/client'
import { embedTextBatch } from '../lib/embeddings'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Cosine similarity helper (vectors are already unit-normalized)
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
  }
  return dot
}

// Category definitions with examples
const CATEGORIES = {
  'feeling-emotion': {
    label: 'Feeling / Emotion',
    examples: ['Joy', 'Peace', 'Melancholy', 'Anxiety', 'Hope', 'Serenity', 'Anger', 'Awe', 'Nostalgia', 'Isolation', 'Wonder', 'Calm', 'Tension', 'Relaxation', 'Warmth', 'Cold', 'Pressure', 'Lightness', 'Heaviness', 'Comfort', 'Discomfort', 'Energy', 'Fatigue', 'Vitality', 'Stillness', 'Movement', 'Openness', 'Confinement'],
    description: 'The emotional and physical feelings evoked in the viewer (both emotional states and physical sensations)'
  },
  'vibe-mood': {
    label: 'Vibe / Mood',
    examples: ['Dreamlike', 'Futuristic', 'Minimal', 'Cinematic', 'Intimate', 'Chaotic', 'Ethereal', 'Industrial', 'Playful', 'Somber', 'Mysterious', 'Urban'],
    description: 'The overall atmospheric tone or emotional climate of the image'
  },
  'philosophical-existential': {
    label: 'Philosophical / Existential Concepts',
    examples: ['Identity', 'Mortality', 'Duality', 'Time', 'Impermanence', 'Chaos', 'Order', 'Rebirth', 'Truth', 'Memory', 'Infinity', 'Transformation'],
    description: 'Abstract, symbolic, or metaphysical ideas reflected through the design'
  },
  'aesthetic-formal': {
    label: 'Aesthetic / Formal',
    examples: ['Symmetry', 'Asymmetry', 'Balance', 'Rhythm', 'Contrast', 'Unity', 'Minimalism', 'Composition', 'Negative Space', 'Harmony', 'Flow'],
    description: 'The visual composition, balance, and harmony of forms'
  },
  'natural-metaphysical': {
    label: 'Natural / Metaphysical Concepts',
    examples: ['Growth', 'Decay', 'Flow', 'Evolution', 'Stillness', 'Energy', 'Renewal', 'Interconnection', 'Gravity', 'Seasons', 'Transcendence'],
    description: 'Translates organic processes or cosmic phenomena into visual metaphors'
  },
  'social-cultural': {
    label: 'Social / Cultural Concepts',
    examples: ['Consumerism', 'Diversity', 'Gender', 'Power', 'Isolation', 'Globalization', 'Sustainability', 'Technology', 'Authenticity', 'Modernity'],
    description: 'The societal, cultural, or technological context reflected in the image'
  },
  'design-style': {
    label: 'Design Style',
    examples: ['Minimalism', 'Bauhaus', 'Brutalism', 'Surrealism', 'Postmodernism', 'Futurism', 'Organic', 'Art Deco', 'Maximalism', 'Retro-Futurism'],
    description: 'The recognizable aesthetic movement or genre of the visual language'
  },
  'color-tone': {
    label: 'Color & Tone',
    examples: ['Warm', 'Cool', 'Monochrome', 'Pastel', 'Vibrant', 'Muted', 'Neon', 'High Contrast', 'Gradient', 'Tonal Harmony', 'Shadow Play'],
    description: 'The chromatic and tonal qualities that define visual temperature and emotion'
  },
  'texture-materiality': {
    label: 'Texture & Materiality',
    examples: ['Matte', 'Glossy', 'Grainy', 'Layered', 'Organic', 'Soft', 'Dense', 'Transparent', 'Metallic', 'Synthetic', 'Fibrous', 'Fluid'],
    description: 'The surface quality and tactile illusion of the image'
  },
  'form-structure': {
    label: 'Form & Structure',
    examples: ['Grid', 'Line', 'Shape', 'Scale', 'Proportion', 'Repetition', 'Rhythm', 'Modularity', 'Hierarchy', 'Fragmentation', 'Flow', 'Balance'],
    description: 'The spatial logic and geometric organization of visual elements'
  },
  'design-technique': {
    label: 'Design Technique',
    examples: ['Photography', 'Collage', '3D Rendering', 'Illustration', 'Vector Graphics', 'Generative Art', 'Painting', 'AI Synthesis', 'Glitch Art', 'Mixed Media', 'Typography', 'Motion Design'],
    description: 'The methods, tools, and processes used to create the image'
  },
  'industry': {
    label: 'Industry',
    examples: ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Fashion', 'Food', 'Travel', 'Real Estate', 'Automotive', 'Entertainment', 'Sports', 'Non-profit', 'Government', 'Manufacturing', 'Energy', 'Media', 'Consulting', 'Legal', 'Hospitality', 'Banking', 'SaaS', 'Telemedicine', 'Fintech', 'EdTech', 'Retail', 'Luxury', 'Restaurant', 'Hospitality', 'PropTech', 'Mobility', 'Gaming', 'Fitness', 'Charity', 'Public Sector', 'Industrial', 'Renewable', 'Publishing', 'Advisory', 'Law', 'Hotels'],
    description: 'The industry or business sector the design represents or targets (both overall industry and specific sector)'
  }
}

type ConceptSeed = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  category?: string
}

/**
 * Generate abstract concepts from images
 * Analyzes all images and creates concepts based on the 12 categories
 */
export async function generateAbstractConceptsFromImages() {
  console.log('🔍 Starting abstract concept generation from images...')
  
  // Load existing concepts to avoid duplicates
  const existingConcepts = await prisma.concept.findMany({
    select: { id: true, label: true }
  })
  const existingIds = new Set(existingConcepts.map((c: any) => c.id.toLowerCase()))
  const existingLabels = new Set(existingConcepts.map((c: any) => c.label.toLowerCase()))
  
  console.log(`📚 Found ${existingConcepts.length} existing concepts`)
  
  // Get all images with embeddings
  const images = await prisma.image.findMany({
    where: {
      embedding: {
        isNot: null
      }
    },
    include: {
      embedding: true,
      site: {
        select: {
          title: true,
          url: true
        }
      }
    }
    // Process all images to get comprehensive coverage
  })
  
  console.log(`🖼️  Processing ${images.length} images...`)
  
  // Collect concept matches per category
  const categoryConceptScores: Map<string, Map<string, number>> = new Map()
  
  // Initialize score maps for each category
  for (const [categoryId] of Object.entries(CATEGORIES)) {
    categoryConceptScores.set(categoryId, new Map())
  }
  
  // For each category, find matching concepts across all images
  for (const [categoryId, category] of Object.entries(CATEGORIES)) {
    console.log(`\n📂 Processing category: ${category.label}`)
    
    // Embed all examples for this category
    const categoryPrompts = category.examples.map((example: string) => 
      `website UI with ${example.toLowerCase()} ${category.description.toLowerCase()}`
    )
    
    console.log(`   Embedding ${category.examples.length} category examples...`)
    const categoryEmbeddings = await embedTextBatch(categoryPrompts)
    
    if (categoryEmbeddings.length !== category.examples.length) {
      console.warn(`   ⚠️  Warning: Expected ${category.examples.length} embeddings, got ${categoryEmbeddings.length}`)
      continue
    }
    
    // For each image, find the best matching examples in this category
    let processedImages = 0
    for (const image of images) {
      const imageEmbedding = image.embedding?.vector as unknown as number[] | null
      if (!imageEmbedding || imageEmbedding.length === 0) continue
      
      // Calculate similarity scores for all category examples
      const scores = category.examples.map((example, idx) => {
        const categoryEmbedding = categoryEmbeddings[idx]
        if (!categoryEmbedding || categoryEmbedding.length === 0) return { example, score: 0 }
        
        const similarity = cosineSimilarity(imageEmbedding, categoryEmbedding)
        return { example, score: similarity }
      })
      
      // Sort by score and take top matches (above threshold)
      scores.sort((a, b) => b.score - a.score)
      
      // Ensure at least one match per image per category (even if below threshold)
      // Take the top match if no concept exceeds threshold
      const topMatches = scores.filter((s: any) => s.score > 0.25)
      const guaranteedMatch = scores.length > 0 ? [scores[0]] : [] // Top match regardless of threshold
      
      // Use guaranteed match if no matches above threshold
      const matchesToProcess = topMatches.length > 0 ? topMatches : guaranteedMatch
      
      // Aggregate scores for each concept across all images
      const conceptScores = categoryConceptScores.get(categoryId)!
      for (const { example, score } of matchesToProcess) {
        const conceptId = example.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        
        // Skip if already exists in database
        if (existingIds.has(conceptId) || existingLabels.has(example.toLowerCase())) {
          continue
        }
        
        // Accumulate score (higher score = more images match this concept)
        // For guaranteed matches below threshold, use a minimum score to track presence
        const effectiveScore = score > 0.25 ? score : 0.15 // Minimum tracking score for below-threshold matches
        const currentScore = conceptScores.get(conceptId) || 0
        conceptScores.set(conceptId, Math.max(currentScore, effectiveScore))
      }
      
      processedImages++
      if (processedImages % 50 === 0) {
        console.log(`   Processed ${processedImages}/${images.length} images...`)
      }
    }
    
    const conceptScores = categoryConceptScores.get(categoryId)!
    console.log(`   ✅ Found ${conceptScores.size} potential concepts in this category`)
  }
  
  // Collect all category examples as potential concepts
  const allCategoryConcepts: Map<string, ConceptSeed> = new Map()
  
  // Create concepts from aggregated scores
  // Since we guarantee at least one match per image per category, we should see concepts appear
  for (const [categoryId, category] of Object.entries(CATEGORIES)) {
    const conceptScores = categoryConceptScores.get(categoryId)!
    
    // Sort by score (descending) and take top concepts
    // If we have fewer than expected, it means concepts are being reused across images
    // This is fine - we want concepts that appear in multiple images
    const sortedConcepts = Array.from(conceptScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.max(10, Math.floor(images.length / 10))) // At least 10, or ~10% of images
    
    console.log(`   Creating ${sortedConcepts.length} concepts for ${category.label}`)
    
    for (const [conceptId, score] of sortedConcepts) {
      // Find the original example label
      const example = category.examples.find((e: string) => 
        e.toLowerCase().replace(/[^a-z0-9]+/g, '-') === conceptId
      )
      
      if (!example) continue
      
      // Skip if already exists
      if (existingIds.has(conceptId) || existingLabels.has(example.toLowerCase())) {
        continue
      }
      
      // Generate synonyms and related terms based on category
      const synonyms = generateSynonyms(example, category)
      const related = generateRelated(example, category, category.examples)
      
      allCategoryConcepts.set(conceptId, {
        id: conceptId,
        label: example,
        synonyms,
        related,
        category: category.label
      })
    }
  }
  
  console.log(`\n✨ Generated ${allCategoryConcepts.size} new abstract concepts`)
  
  // Read existing concepts file
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const existingContent = await fs.readFile(seedPath, 'utf-8')
  const existingConceptsData: ConceptSeed[] = JSON.parse(existingContent)
  
  // Add new concepts
  const newConcepts = Array.from(allCategoryConcepts.values())
  const updatedConcepts = [...existingConceptsData, ...newConcepts]
  
  // Sort by category then label
  updatedConcepts.sort((a, b) => {
    const catA = a.category || ''
    const catB = b.category || ''
    if (catA !== catB) return catA.localeCompare(catB)
    return a.label.localeCompare(b.label)
  })
  
  // Write back to file
  await fs.writeFile(seedPath, JSON.stringify(updatedConcepts, null, 2))
  
  console.log(`✅ Added ${newConcepts.length} concepts to seed_concepts.json`)
  console.log(`📊 Total concepts: ${updatedConcepts.length}`)
  
  return newConcepts
}

/**
 * Generate synonyms for a concept based on its category
 */
function generateSynonyms(example: string, category: any): string[] {
  const synonyms: string[] = []
  const lower = example.toLowerCase()
  
  // Add common variations
  if (lower.endsWith('y')) {
    synonyms.push(example.slice(0, -1) + 'ic')
    synonyms.push(example.slice(0, -1) + 'ical')
  }
  
  // Add category-specific synonyms
  const synonymMap: Record<string, string[]> = {
    'Joy': ['joyful', 'happy', 'cheerful', 'elated', 'delighted'],
    'Peace': ['peaceful', 'calm', 'tranquil', 'serene', 'placid'],
    'Melancholy': ['melancholic', 'sad', 'sorrowful', 'wistful', 'pensive'],
    'Dreamlike': ['dreamy', 'surreal', 'ethereal', 'otherworldly', 'phantasmagoric'],
    'Futuristic': ['futurist', 'sci-fi', 'high-tech', 'forward-looking', 'advanced'],
    'Identity': ['self', 'character', 'persona', 'essence', 'individuality'],
    'Growth': ['developing', 'expanding', 'evolving', 'progressive', 'advancing'],
    'Symmetry': ['symmetrical', 'balanced', 'proportional', 'harmonious', 'even'],
    'Warm': ['warmth', 'warm-toned', 'cozy', 'inviting', 'comforting'],
    'Grid': ['grid-based', 'gridded', 'systematic', 'modular', 'structured'],
    'Photography': ['photo', 'photographic', 'captured', 'shot', 'image']
  }
  
  if (synonymMap[example]) {
    synonyms.push(...synonymMap[example])
  }
  
  // Add base variations
  synonyms.push(lower)
  if (lower !== example.toLowerCase()) {
    synonyms.push(example.toLowerCase())
  }
  
  return Array.from(new Set(synonyms)).slice(0, 10) // Limit to 10
}

/**
 * Generate related terms for a concept
 * IMPORTANT: Related terms can span across categories
 */
function generateRelated(example: string, category: any, categoryExamples: string[]): string[] {
  const related: string[] = []
  
  // Add other examples from the same category
  const otherExamples = categoryExamples.filter((e: any) => e !== example).slice(0, 3)
  related.push(...otherExamples)
  
  // Add cross-category related terms (can come from any category)
  const crossCategoryRelated: Record<string, string[]> = {
    // Feeling/Emotion can relate to Vibe/Mood, Color/Tone
    'Joy': ['Playful', 'Vibrant', 'Warm', 'Cheerful'],
    'Peace': ['Calm', 'Serenity', 'Cool', 'Minimalism'],
    'Melancholy': ['Somber', 'Muted', 'Monochrome'],
    'Hope': ['Light', 'Warm', 'Renewal'],
    
    // Vibe/Mood can relate to Design Style, Color/Tone
    'Dreamlike': ['Ethereal', 'Surreal', 'Soft', 'Pastel'],
    'Futuristic': ['Modern', 'Technological', 'Neon', 'High Contrast'],
    'Cinematic': ['Dramatic', 'High Contrast', 'Photography'],
    'Playful': ['Joy', 'Rounded', 'Bright Colors'],
    
    // Aesthetic/Formal can relate to Form/Structure
    'Symmetry': ['Balance', 'Grid', 'Harmony'],
    'Balance': ['Symmetry', 'Harmony', 'Composition'],
    'Contrast': ['High Contrast', 'Dramatic', 'Bold'],
    
    // Color/Tone can relate to Feeling/Emotion, Vibe/Mood
    'Warm': ['Inviting', 'Comfortable', 'Joy', 'Welcoming'],
    'Cool': ['Calm', 'Peace', 'Serenity', 'Modern'],
    'Monochrome': ['Minimalism', 'Strict', 'Formal'],
    'Vibrant': ['Playful', 'Energetic', 'Joy'],
    
    // Form/Structure can relate to Aesthetic/Formal
    'Grid': ['Structure', 'Organization', 'Modularity', 'Balance'],
    'Line': ['Structure', 'Minimalism', 'Precision'],
    'Shape': ['Form', 'Composition', 'Structure'],
    
    // Design Technique can relate to Texture/Materiality
    'Photography': ['Realistic', 'Matte', 'Documentary'],
    'Illustration': ['Artistic', 'Organic', 'Hand-drawn'],
    '3D Rendering': ['Synthetic', 'Metallic', 'Glossy'],
    
    // Texture/Materiality can relate to Color/Tone
    'Matte': ['Muted', 'Soft', 'Minimalism'],
    'Glossy': ['Vibrant', 'Modern', 'Premium'],
    'Grainy': ['Vintage', 'Retro', 'Organic']
  }
  
  if (crossCategoryRelated[example]) {
    related.push(...crossCategoryRelated[example])
  }
  
  // Also add semantically related terms from other categories based on the concept
  // For example, "Minimalism" should relate to concepts like "Simple", "Clean" (Aesthetic)
  // but also "Calm" (Feeling), "Cool" (Color/Tone), etc.
  
  return Array.from(new Set(related)).slice(0, 15) // Increased limit to allow cross-category
}

// Run if called directly
if (require.main === module) {
  generateAbstractConceptsFromImages()
    .then(() => {
      console.log('✅ Concept generation complete')
      process.exit(0)
    })
    .catch((err) => {
      console.error('❌ Error:', err)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
