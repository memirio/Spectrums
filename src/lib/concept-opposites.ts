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
  '3d': ['design', 'flatness'], // 3D
  'accent': ['background', 'blended', 'subtle', 'uniform'], // Accent
  'accidental': ['deliberate'], // accidental
  'accordion': ['fixed', 'rigid', 'static'], // Accordion
  'agency': ['playful', 'whimsical'], // Agency
  'ai': ['old', 'retro', 'vintage'], // AI
  'animated': ['static'], // Animated
  'art': ['corporate', 'professional'], // Art
  'artistic': ['advertising', 'commercial', 'corporate', 'professional'], // Artistic
  'astral': ['concrete', 'material', 'mundane', 'terrestrial'], // Astral
  'asymmetrical': ['balance', 'centered', 'static', 'symmetrical'], // Asymmetrical
  'asymmetry': ['balance', 'centered', 'symmetry'], // Asymmetry
  'authoritative': ['calm', 'gentle', 'muted', 'pastel', 'playful'], // Authoritative
  'background': ['accent'], // background
  'balance': ['asymmetrical', 'asymmetry'], // Balance
  'barter': ['payments'], // barter
  'based': ['fluid', 'handwritten', 'masonry', 'organic'], // Based
  'bleed': ['based'], // Bleed
  'blended': ['accent'], // blended
  'bold': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Bold
  'brutalist': ['elegant', 'full-bleed', 'grid-based', 'high-contrast', 'organic', 'serif'], // Brutalist
  'calm': ['anger', 'anxiety', 'authoritative', 'bold', 'chaotic', 'dramatic', 'energetic', 'stimulation'], // Calm
  'casual': ['horology', 'professional'], // Casual
  'centered': ['asymmetrical', 'asymmetry'], // Centered
  'chaotic': ['algorithm', 'calm', 'concentricity', 'peace', 'peaceful', 'serene', 'stability'], // Chaotic
  'cinematic': ['static'], // Cinematic
  'classicism': ['futurism'], // Classicism
  'coarse': ['watchmaking'], // Coarse
  'collage': ['led', 'photography'], // Collage
  'colorful': ['colorless', 'dark', 'duotone', 'monochrome', 'muted'], // Colorful
  'colorless': ['colorful', 'vibrant'], // Colorless
  'commodity': ['deeptech', 'watchmaking'], // Commodity
  'complex': ['welcoming'], // complex
  'concrete': ['astral'], // concrete
  'condensed': ['type'], // Condensed
  'confident': ['muted', 'understated'], // Confident
  'contemporary': ['vintage'], // contemporary
  'contrast': ['muted', 'understated'], // Contrast
  'cool': ['amber', 'cozy', 'energetic', 'friendly', 'heavy', 'inviting', 'warm'], // Cool
  'corporate': ['arcade', 'art', 'artistic', 'childcare', 'expressive', 'handwritten', 'non-profit', 'playful'], // Corporate
  'cottagecore': ['synthetic'], // Cottagecore
  'cozy': ['cool', 'coolness'], // Cozy
  'dark': ['colorful', 'joy', 'light', 'lightness', 'neon', 'playful'], // Dark
  'deliberate': ['accidental', 'haphazard', 'impulsive', 'spontaneous'], // Deliberate
  'dense': ['becoming', 'dominance', 'empty', 'feminine', 'framing', 'gaming', 'germination', 'hollow', 'illumination', 'light', 'lightness', 'liminality', 'luminance', 'luminescence', 'luminescent', 'luminosity', 'mineral', 'minimal', 'minimalism', 'minimalistic', 'ominous', 'porous', 'spacious', 'type', 'welcoming'], // Dense
  'design': ['3d', 'elegant', 'hierarchy', 'layered', 'lens'], // Design
  'digital': ['acoustic', 'brushstroke', 'horology', 'photography'], // Digital
  'display': ['type'], // Display
  'disposable': ['watchmaking'], // disposable
  'docs': ['page'], // Docs
  'donation': ['payments'], // donation
  'dramatic': ['calm', 'gentle', 'muted', 'pastel', 'understated'], // Dramatic
  'dreamlike': ['skeuomorphic'], // Dreamlike
  'driven': ['static'], // Driven
  'duotone': ['colorful'], // Duotone
  'ecommerce': ['portfolio'], // Ecommerce
  'elegant': ['brutalist', 'design', 'gritty', 'grotesque', 'minimal', 'minimalistic'], // Elegant
  'energetic': ['calm', 'cool', 'coolness', 'muted', 'pastel', 'peace'], // Energetic
  'ephemera': ['horology'], // ephemera
  'experimental': ['commercial', 'traditional'], // Experimental
  'expressive': ['corporate', 'muted', 'pastel', 'professional', 'saturation'], // Expressive
  'fibrous': ['gradient'], // Fibrous
  'fixed': ['accordion', 'adaptability'], // fixed
  'flow': ['interference', 'modularity'], // Flow
  'fluid': ['based', 'geometric', 'grid', 'modular', 'solid', 'strict'], // Fluid
  'font': ['static'], // Font
  'fragmentation': ['unity'], // Fragmentation
  'free': ['anchored', 'payments'], // free
  'friendly': ['aloof', 'cool'], // Friendly
  'futurism': ['classicism', 'retro', 'traditionalism'], // futurism
  'futurist': ['old', 'retro', 'vintage'], // futurist
  'futuristic': ['old', 'retro', 'traditional', 'vintage'], // Futuristic
  'gentle': ['authoritative', 'bold', 'dramatic', 'hard', 'powerful'], // Gentle
  'geometric': ['amorphous', 'biomorphic', 'figurative', 'handwritten', 'organic', 'serif'], // Geometric
  'glossy': ['matte'], // Glossy
  'gradient': ['fibrous', 'grainy', 'solid'], // Gradient
  'grainy': ['gradient', 'smoothness'], // Grainy
  'grid': ['fluid', 'freeform', 'handwritten', 'masonry', 'organic'], // Grid
  'gritty': ['aesthetics', 'elegant', 'interactions', 'polish', 'professional', 'sophisticated', 'sterile'], // Gritty
  'handwritten': ['based', 'corporate', 'geometric', 'grid', 'metallic'], // Handwritten
  'haphazard': ['deliberate'], // haphazard
  'hard': ['gentle', 'muted', 'pastel', 'soft', 'softness'], // Hard
  'heavy': ['aero', 'calm', 'cool', 'cosmetics', 'light', 'lightness', 'peace', 'peaceful', 'serene', 'watches'], // Heavy
  'hierarchy': ['design'], // Hierarchy
  'horology': ['casual', 'digital', 'ephemera', 'informal'], // Horology
  'illustration': ['led', 'photography', 'rendering'], // Illustration
  'impulsive': ['deliberate'], // impulsive
  'informal': ['horology', 'professional'], // Informal
  'interactions': ['gritty', 'static'], // Interactions
  'interactive': ['monospace', 'static'], // Interactive
  'inviting': ['aloof', 'cool'], // Inviting
  'joy': ['dark', 'melancholy', 'somber'], // Joy
  'layered': ['design'], // Layered
  'led': ['collage', 'illustration', 'led'], // Led
  'lens': ['design'], // Lens
  'light': ['abyss', 'dark', 'weighty'], // Light
  'luxurious': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Luxurious
  'magazine': ['saas'], // Magazine
  'masonry': ['based', 'grid'], // Masonry
  'mass': ['watchmaking', 'yachting'], // Mass
  'material': ['astral'], // material
  'matte': ['glossy', 'reflectivity'], // Matte
  'maximal': ['welcoming'], // maximal
  'maximalist': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Maximalist
  'melancholy': ['exuberance', 'joy', 'playful'], // Melancholy
  'metallic': ['handwritten', 'organic'], // Metallic
  'minimal': ['complexity', 'elegant', 'full-bleed', 'high-contrast', 'high-key', 'high-saturation', 'luxurious', 'maximalism', 'maximalist', 'premium'], // Minimal
  'minimalistic': ['elegant', 'luxurious', 'maximalist', 'premium'], // Minimalistic
  'modern': ['archival', 'artifact', 'old', 'retro', 'serif', 'static', 'traditional', 'vintage'], // Modern
  'modular': ['fluid', 'integrated', 'monolithic', 'organic'], // Modular
  'modularity': ['flow'], // Modularity
  'monochrome': ['colorful', 'vibrant'], // Monochrome
  'monospace': ['interactive', 'responsive'], // Monospace
  'mundane': ['astral'], // mundane
  'muted': ['authoritative', 'bold', 'brutalist', 'colorful', 'confident', 'glare', 'vibrant'], // Muted
  'neon': ['dark', 'muted', 'pastel', 'understated'], // Neon
  'new': ['old', 'retro', 'serif', 'static', 'traditional'], // New
  'non-monetary': ['payments'], // non-monetary
  'old': ['ai', 'futurist', 'futuristic', 'modern', 'new'], // Old
  'organic': ['ai', 'algorithm', 'artifact', 'artifice', 'automation', 'based', 'brutalist', 'geometric', 'grid', 'metallic', 'modular', 'sterile', 'synthetic', 'technographic'], // Organic
  'overlapping': ['design'], // Overlapping
  'page': ['docs'], // Page
  'parallax': ['static'], // Parallax
  'pastel': ['authoritative', 'bold', 'colorful', 'dramatic', 'energetic'], // Pastel
  'payments': ['barter', 'donation', 'free', 'non-monetary'], // Payments
  'peace': ['anger', 'anxiety', 'chaotic', 'energetic', 'heavy', 'vibrant'], // Peace
  'peaceful': ['chaotic', 'energetic', 'heavy', 'vibrant'], // Peaceful
  'photography': ['collage', 'illustration', 'led', 'rendering'], // Photography
  'playful': ['agency', 'authoritative', 'corporate', 'dark', 'melancholy', 'professional'], // Playful
  'polish': ['gritty'], // Polish
  'portfolio': ['ecommerce'], // Portfolio
  'powerful': ['calm', 'gentle', 'muted', 'pastel'], // Powerful
  'premium': ['design', 'minimal', 'minimalistic', 'serif', 'understated'], // Premium
  'process': ['design'], // Process
  'professional': ['arcade', 'art', 'artistic', 'edutainment', 'expressive', 'gritty', 'handwritten'], // Professional
  'responsive': ['monospace'], // Responsive
  'retro': ['ai', 'future', 'futurism', 'futurist', 'futuristic', 'modern', 'new', 'techno-futurism'], // Retro
  'rhythm': ['static'], // Rhythm
  'rigid': ['accordion', 'aqueous'], // rigid
  'saas': ['magazine', 'text'], // SaaS
  'saturation': ['colorful', 'energetic', 'expressive', 'saturation', 'vibrant'], // Saturation
  'seamless': ['based', 'modular', 'segmented'], // Seamless
  'serene': ['chaotic', 'energetic', 'heavy', 'vibrant'], // Serene
  'serif': ['brutalist', 'modern', 'new', 'sans-serif', 'serif', 'startup'], // Serif
  'shadow': ['editorial', 'experimental', 'friendly', 'glare', 'monochrome', 'surreal'], // Shadow
  'skeuomorphic': ['design', 'dreamlike', 'surreal'], // Skeuomorphic
  'soft': ['angularity', 'brutalist', 'glare', 'hard'], // Soft
  'solid': ['abyss', 'aqueous', 'beverage', 'fluid', 'gradient', 'hollow', 'intangible', 'porous', 'viscous', 'wire'], // Solid
  'somber': ['joy', 'playful'], // Somber
  'sophisticated': ['gritty'], // Sophisticated
  'spacious': ['dense'], // Spacious
  'spontaneous': ['deliberate'], // spontaneous
  'startup': ['old', 'retro', 'serif', 'static', 'traditional'], // Startup
  'static': ['accordion', 'adaptability', 'animated', 'asymmetrical', 'cinematic', 'driven', 'energetic', 'fluid', 'kinetic', 'loop', 'mobile', 'motorsport', 'movement', 'propulsive'], // Static
  'strict': ['fluid', 'organic', 'playful', 'whimsical'], // Strict
  'subtle': ['accent', 'all-caps', 'dramatic', 'high-contrast', 'high-key', 'high-saturation'], // subtle
  'surreal': ['skeuomorphic'], // Surreal
  'symmetrical': ['asymmetrical'], // symmetrical
  'symmetry': ['asymmetry'], // Symmetry
  'synthetic': ['acoustic', 'analytical', 'artifact', 'artisanal', 'biomorphic', 'cottagecore', 'earthiness', 'organic'], // Synthetic
  'terrestrial': ['astral'], // Terrestrial
  'text': ['saas'], // Text
  'traditional': ['deeptech', 'experimental', 'fintech', 'modern', 'modernity', 'new', 'sans-serif', 'serif', 'startup', 'technology', 'techwear'], // Traditional
  'traditionalism': ['futurism'], // traditionalism
  'type': ['display', 'type'], // Type
  'understated': ['bold', 'brutalist', 'colorful', 'confident', 'contrast', 'dramatic'], // Understated
  'uniform': ['accent'], // Uniform
  'unity': ['anatomy', 'contradiction', 'fragmentation'], // Unity
  'vibrant': ['calm', 'colorless', 'cool', 'monochrome', 'muted', 'neumorphic', 'pastel', 'peace'], // Vibrant
  'vintage': ['ai', 'contemporary', 'future', 'futurist', 'futuristic', 'modern', 'modernity', 'new'], // Vintage
  'volumetrics': ['design'], // Volumetrics
  'warm': ['aloof', 'cool', 'coolness'], // Warm
  'watchmaking': ['coarse', 'commodity', 'disposable', 'mass'], // Watchmaking
  'welcoming': ['complex', 'dense', 'maximal'], // Welcoming
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