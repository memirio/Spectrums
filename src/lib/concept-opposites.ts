/**
 * Comprehensive Concept Opposites Mapping
 * 
 * Generated from:
 * - Manual opposite pairs (from generate_opposites.ts)
 * - Semantic opposites (from embeddings with similarity < -0.1)
 * - Gemini-generated opposites (from concept generation pipeline)
 * 
 * This mapping is used in:
 * - Search ranking: Penalizes images with opposite tags
 * - Tag validation: Filters false positives
 */

export const CONCEPT_OPPOSITES: Record<string, string[]> = {
  '3d': ['design'], // 3D
  'accidental': ['deliberate'], // accidental
  'agency': ['playful', 'whimsical'], // Agency
  'ai': ['old', 'retro', 'vintage'], // AI
  'animated': ['static'], // Animated
  'art': ['corporate', 'professional'], // Art
  'artistic': ['corporate', 'professional'], // Artistic
  'asymmetrical': ['centered', 'static'], // Asymmetrical
  'asymmetry': ['balance', 'centered', 'symmetry'], // Asymmetry
  'authoritative': ['calm', 'gentle', 'muted', 'pastel', 'playful'], // Authoritative
  'balance': ['asymmetry'], // Balance
  'based': ['fluid', 'handwritten', 'masonry', 'organic'], // Based
  'bleed': ['based'], // Bleed
  'bold': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Bold
  'brutalist': ['elegant', 'full-bleed', 'grid-based', 'high-contrast', 'serif'], // Brutalist
  'calm': ['authoritative', 'bold', 'chaotic', 'dramatic', 'energetic', 'stimulation'], // Calm
  'centered': ['asymmetrical', 'asymmetry'], // Centered
  'chaotic': ['calm', 'concentricity', 'peace', 'peaceful', 'serene', 'stability'], // Chaotic
  'cinematic': ['static'], // Cinematic
  'coarse': ['watchmaking'], // Coarse
  'collage': ['led', 'photography'], // Collage
  'colorful': ['colorless', 'dark', 'duotone', 'monochrome', 'muted'], // Colorful
  'colorless': ['colorful'], // Colorless
  'commodity': ['deeptech', 'watchmaking'], // Commodity
  'condensed': ['type'], // Condensed
  'confident': ['muted', 'understated'], // Confident
  'contrast': ['muted', 'understated'], // Contrast
  'cool': ['cozy', 'energetic', 'friendly', 'heavy', 'inviting'], // Cool
  'corporate': ['art', 'artistic', 'expressive', 'handwritten', 'playful'], // Corporate
  'cottagecore': ['synthetic'], // Cottagecore
  'cozy': ['cool'], // Cozy
  'dark': ['colorful', 'joy', 'light', 'neon', 'playful'], // Dark
  'deliberate': ['accidental', 'haphazard', 'impulsive', 'spontaneous'], // deliberate
  'dense': ['spacious', 'type'], // Dense
  'design': ['3d', 'elegant', 'hierarchy', 'layered', 'lens'], // Design
  'display': ['type'], // Display
  'disposable': ['watchmaking'], // disposable
  'docs': ['page'], // Docs
  'dramatic': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Dramatic
  'dreamlike': ['skeuomorphic'], // Dreamlike
  'driven': ['static'], // Driven
  'duotone': ['colorful'], // Duotone
  'ecommerce': ['portfolio'], // Ecommerce
  'elegant': ['brutalist', 'design', 'gritty', 'grotesque', 'minimal', 'minimalistic'], // Elegant
  'energetic': ['calm', 'cool', 'muted', 'pastel', 'peace'], // Energetic
  'experimental': ['traditional'], // Experimental
  'expressive': ['corporate', 'muted', 'pastel', 'professional', 'saturation'], // Expressive
  'fibrous': ['gradient'], // Fibrous
  'flow': ['modularity'], // Flow
  'fluid': ['based', 'grid', 'modular', 'strict'], // Fluid
  'font': ['static'], // Font
  'fragmentation': ['unity'], // Fragmentation
  'friendly': ['cool'], // Friendly
  'futurist': ['old', 'retro', 'vintage'], // futurist
  'futuristic': ['old', 'retro', 'vintage'], // Futuristic
  'gentle': ['authoritative', 'bold', 'dramatic', 'hard', 'powerful'], // Gentle
  'geometric': ['handwritten', 'organic'], // Geometric
  'glossy': ['matte'], // Glossy
  'gradient': ['fibrous', 'grainy', 'solid'], // Gradient
  'grainy': ['gradient'], // Grainy
  'grid': ['fluid', 'handwritten', 'masonry', 'organic'], // Grid
  'gritty': ['elegant', 'interactions', 'polish', 'professional', 'sophisticated', 'sterile'], // Gritty
  'handwritten': ['based', 'corporate', 'geometric', 'grid', 'metallic'], // Handwritten
  'haphazard': ['deliberate'], // haphazard
  'hard': ['gentle', 'muted', 'pastel', 'soft'], // Hard
  'heavy': ['calm', 'cool', 'cosmetics', 'peace', 'peaceful', 'serene', 'watches'], // Heavy
  'hierarchy': ['design'], // Hierarchy
  'illustration': ['led', 'photography'], // Illustration
  'impulsive': ['deliberate'], // impulsive
  'interactions': ['gritty', 'static'], // Interactions
  'interactive': ['monospace', 'static'], // Interactive
  'inviting': ['cool'], // Inviting
  'joy': ['dark', 'melancholy', 'somber'], // Joy
  'layered': ['design'], // Layered
  'led': ['collage', 'illustration', 'led'], // Led
  'lens': ['design'], // Lens
  'light': ['dark', 'weighty'], // Light
  'luxurious': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Luxurious
  'magazine': ['saas'], // Magazine
  'masonry': ['based', 'grid'], // Masonry
  'mass': ['watchmaking', 'yachting'], // Mass
  'matte': ['glossy'], // Matte
  'maximalist': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Maximalist
  'melancholy': ['joy', 'playful'], // Melancholy
  'metallic': ['handwritten', 'organic'], // Metallic
  'minimal': ['elegant', 'luxurious', 'maximalist', 'premium'], // Minimal
  'minimalistic': ['elegant', 'luxurious', 'maximalist', 'premium'], // Minimalistic
  'modern': ['old', 'retro', 'serif', 'static', 'traditional'], // Modern
  'modular': ['fluid', 'organic'], // Modular
  'modularity': ['flow'], // Modularity
  'monochrome': ['colorful'], // Monochrome
  'monospace': ['interactive', 'responsive'], // Monospace
  'muted': ['authoritative', 'bold', 'brutalist', 'colorful', 'confident', 'glare'], // Muted
  'neon': ['dark', 'muted', 'pastel', 'understated'], // Neon
  'new': ['old', 'retro', 'serif', 'static', 'traditional'], // New
  'old': ['ai', 'futurist', 'futuristic', 'modern', 'new'], // Old
  'organic': ['based', 'geometric', 'grid', 'metallic', 'modular', 'sterile'], // Organic
  'overlapping': ['design'], // Overlapping
  'page': ['docs'], // Page
  'parallax': ['static'], // Parallax
  'pastel': ['authoritative', 'bold', 'colorful', 'dramatic', 'energetic'], // Pastel
  'peace': ['chaotic', 'energetic', 'heavy', 'vibrant'], // Peace
  'peaceful': ['chaotic', 'energetic', 'heavy', 'vibrant'], // Peaceful
  'photography': ['collage', 'illustration', 'led'], // Photography
  'playful': ['agency', 'authoritative', 'corporate', 'dark', 'melancholy'], // Playful
  'polish': ['gritty'], // Polish
  'portfolio': ['ecommerce'], // Portfolio
  'powerful': ['calm', 'gentle', 'muted', 'pastel'], // Powerful
  'premium': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Premium
  'process': ['design'], // Process
  'professional': ['art', 'artistic', 'expressive', 'gritty', 'handwritten'], // Professional
  'responsive': ['monospace'], // Responsive
  'retro': ['ai', 'futurist', 'futuristic', 'modern', 'new'], // Retro
  'rhythm': ['static'], // Rhythm
  'saas': ['magazine', 'text'], // SaaS
  'saturation': ['colorful', 'energetic', 'expressive', 'saturation', 'vibrant'], // Saturation
  'seamless': ['based', 'segmented'], // Seamless
  'serene': ['chaotic', 'energetic', 'heavy', 'vibrant'], // Serene
  'serif': ['brutalist', 'modern', 'new', 'serif', 'startup'], // Serif
  'shadow': ['editorial', 'experimental', 'friendly', 'glare', 'monochrome', 'surreal'], // Shadow
  'skeuomorphic': ['design', 'dreamlike', 'surreal'], // Skeuomorphic
  'soft': ['glare', 'hard'], // Soft
  'solid': ['beverage', 'gradient'], // Solid
  'somber': ['joy', 'playful'], // Somber
  'sophisticated': ['gritty'], // Sophisticated
  'spacious': ['dense'], // Spacious
  'spontaneous': ['deliberate'], // spontaneous
  'startup': ['old', 'retro', 'serif', 'static', 'traditional'], // Startup
  'static': ['animated', 'asymmetrical', 'cinematic', 'driven', 'energetic', 'propulsive'], // Static
  'strict': ['fluid', 'organic', 'playful', 'whimsical'], // Strict
  'surreal': ['skeuomorphic'], // Surreal
  'symmetry': ['asymmetry'], // Symmetry
  'synthetic': ['cottagecore', 'organic'], // Synthetic
  'text': ['saas'], // Text
  'traditional': ['deeptech', 'experimental', 'fintech', 'modern', 'new', 'serif', 'startup'], // Traditional
  'type': ['display', 'type'], // Type
  'understated': ['bold', 'brutalist', 'colorful', 'confident', 'contrast'], // Understated
  'unity': ['fragmentation'], // Unity
  'vibrant': ['calm', 'cool', 'muted', 'neumorphic', 'pastel', 'peace'], // Vibrant
  'vintage': ['ai', 'futurist', 'futuristic', 'modern', 'new'], // Vintage
  'volumetrics': ['design'], // Volumetrics
  'warm': ['cool'], // Warm
  'watchmaking': ['coarse', 'commodity', 'disposable', 'mass'], // Watchmaking
  'whimsical': ['agency', 'authoritative', 'corporate', 'professional', 'strict'], // Whimsical
  'y2k': ['handwritten', 'organic'], // Y2K
} as const

/**
 * Check if two concepts are opposites
 */
export function areOpposites(conceptId1: string, conceptId2: string): boolean {
  const opposites1 = CONCEPT_OPPOSITES[conceptId1.toLowerCase()] || []
  const opposites2 = CONCEPT_OPPOSITES[conceptId2.toLowerCase()] || []
  
  return opposites1.includes(conceptId2.toLowerCase()) || 
         opposites2.includes(conceptId1.toLowerCase())
}

/**
 * Check if any of the image's tags are opposites of the query concept
 */
export function hasOppositeTags(queryConceptId: string, imageTagIds: string[]): boolean {
  const queryId = queryConceptId.toLowerCase()
  for (const tagId of imageTagIds) {
    if (areOpposites(queryId, tagId.toLowerCase())) {
      return true
    }
  }
  return false
}