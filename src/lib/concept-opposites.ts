/**
 * Conservative Concept Opposites Mapping
 * 
 * Defines opposites for concept labels AND their synonyms.
 * When a query matches a concept, we check if any of its synonyms' opposites
 * are in the image tags, and apply a penalty.
 * 
 * CONSERVATIVE APPROACH: Only direct, literal opposites.
 * For example: "playful" → "strict", "happy" → "sad", "fun" → "boring"
 * 
 * This mapping is used in:
 * - Search ranking: Penalizes images with opposite tags
 * - Site addition pipeline: Opposites are automatically detected during search
 */

export const CONCEPT_OPPOSITES: Record<string, string[]> = {
  '3d': ['design'], // 3D
  'ai': ['old', 'retro', 'vintage'], // AI
  'animated': ['static'], // Animated
  'asymmetrical': ['centered', 'static'], // Asymmetrical
  'asymmetry': ['centered'], // Asymmetry
  'authoritative': ['calm', 'gentle', 'muted', 'pastel'], // Authoritative
  'bold': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Bold
  'brutalist': ['muted', 'understated'], // Brutalist
  'calm': ['authoritative', 'bold', 'dramatic', 'energetic', 'heavy', 'powerful', 'vibrant'], // Calm
  'centered': ['asymmetrical', 'asymmetry'], // Centered
  'colorful': ['colorless', 'dark', 'monochrome', 'muted', 'pastel', 'understated'], // Colorful
  'colorless': ['colorful'], // Colorless
  'condensed': ['type'], // Condensed
  'confident': ['muted', 'understated'], // Confident
  'contrast': ['muted', 'understated'], // Contrast
  'cool': ['cozy', 'energetic', 'friendly', 'heavy', 'inviting', 'vibrant', 'warm'], // Cool
  'cozy': ['cool'], // Cozy
  'dark': ['colorful', 'light', 'neon', 'playful'], // Dark
  'dense': ['spacious', 'type'], // Dense
  'design': ['3d', 'lens', 'process', 'volumetrics'], // Design
  'dramatic': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Dramatic
  'energetic': ['calm', 'cool', 'muted', 'pastel', 'peace', 'peaceful', 'serene', 'static', 'understated'], // Energetic
  'expressive': ['muted', 'pastel', 'static', 'understated'], // Expressive
  'font': ['static'], // Font
  'friendly': ['cool'], // Friendly
  'futurist': ['old', 'retro', 'vintage'], // futurist
  'futuristic': ['old', 'retro', 'vintage'], // Futuristic
  'gentle': ['authoritative', 'bold', 'dramatic', 'powerful'], // Gentle
  'geometric': ['handwritten', 'organic'], // Geometric
  'handwritten': ['geometric', 'serif'], // Handwritten
  'heavy': ['calm', 'cool', 'peace', 'peaceful', 'serene', 'static'], // Heavy
  'interactive': ['monospace', 'static'], // Interactive
  'inviting': ['cool'], // Inviting
  'joy': ['melancholy'], // Joy
  'lens': ['design'], // Lens
  'light': ['dark'], // Light
  'maximalist': ['minimalistic'], // Maximalist
  'melancholy': ['joy', 'playful'], // Melancholy
  'minimalistic': ['maximalist'], // Minimalistic
  'modern': ['old', 'retro', 'serif', 'static', 'traditional', 'vintage'], // Modern
  'monochrome': ['colorful'], // Monochrome
  'monospace': ['interactive', 'responsive'], // Monospace
  'muted': ['authoritative', 'bold', 'brutalist', 'colorful', 'confident', 'contrast', 'dramatic', 'energetic', 'expressive', 'powerful', 'vibrant'], // Muted
  'neon': ['dark'], // Neon
  'new': ['old', 'retro', 'serif', 'static', 'traditional', 'vintage'], // New
  'old': ['ai', 'futurist', 'futuristic', 'modern', 'new', 'serif', 'startup'], // Old
  'organic': ['geometric', 'serif'], // Organic
  'pastel': ['authoritative', 'bold', 'colorful', 'dramatic', 'energetic', 'expressive', 'powerful', 'vibrant'], // Pastel
  'peace': ['energetic', 'heavy', 'vibrant'], // Peace
  'peaceful': ['energetic', 'heavy', 'vibrant'], // Peaceful
  'playful': ['dark', 'melancholy', 'somber', 'strict'], // Playful
  'powerful': ['calm', 'gentle', 'muted', 'pastel'], // Powerful
  'process': ['design'], // Process
  'responsive': ['monospace'], // Responsive
  'retro': ['ai', 'futurist', 'futuristic', 'modern', 'new', 'serif', 'startup'], // Retro
  'saturation': ['saturation'], // Saturation
  'serene': ['energetic', 'heavy', 'vibrant'], // Serene
  'serif': ['modern', 'new', 'serif', 'startup'], // Serif
  'somber': ['playful'], // Somber
  'spacious': ['dense'], // Spacious
  'startup': ['old', 'retro', 'serif', 'static', 'traditional', 'vintage'], // Startup
  'static': ['animated', 'asymmetrical', 'energetic', 'expressive', 'font', 'heavy', 'interactive', 'modern', 'new', 'serif', 'startup'], // Static
  'strict': ['playful', 'whimsical'], // Strict
  'traditional': ['modern', 'new', 'serif', 'startup'], // Traditional
  'type': ['condensed', 'dense'], // Type
  'understated': ['bold', 'brutalist', 'colorful', 'confident', 'contrast', 'dramatic', 'energetic', 'expressive', 'vibrant'], // Understated
  'vibrant': ['calm', 'cool', 'muted', 'pastel', 'peace', 'peaceful', 'serene', 'understated'], // Vibrant
  'vintage': ['ai', 'futurist', 'futuristic', 'modern', 'new', 'serif', 'startup'], // Vintage
  'volumetrics': ['design'], // Volumetrics
  'warm': ['cool'], // Warm
  'whimsical': ['strict'], // Whimsical
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
 * This includes checking opposites of the concept's synonyms
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