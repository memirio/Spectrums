#!/usr/bin/env tsx
/**
 * Expand Concepts
 * 
 * Expands synonyms for existing concepts and adds ~94 new concepts
 * to double the concept library.
 */

import fs from 'fs/promises'
import path from 'path'

type Concept = {
  id: string
  label: string
  synonyms: string[]
  related: string[]
  category?: string
}

// Synonym expansions for existing concepts
const synonymExpansions: Record<string, string[]> = {
  'modern': ['trendy', 'latest', 'current-design', 'up-to-date', 'fresh', 'new'],
  'minimalistic': ['minimalism', 'simplified', 'bare', 'uncluttered', 'essential', 'stripped'],
  'brutalist': ['brutalism', 'brutal', 'raw-design', 'concrete-style', 'unpolished', 'harsh'],
  'geometric': ['geometrical', 'angular', 'geometric-shapes', 'structured-shapes', 'mathematical', 'precise'],
  'grid-based': ['gridded', 'grid-layout', 'aligned-grid', 'structured-layout', 'systematic', 'organized'],
  'colorful': ['color', 'colors', 'colored', 'colour', 'colourful', 'multicolor', 'polychromatic', 'hue', 'tone'],
  'playful': ['playfulness', 'fun', 'lighthearted', 'cheerful', 'joyful', 'merry', 'upbeat'],
  'strict': ['strictness', 'rigid', 'formal', 'disciplined', 'austere', 'severe', 'rigorous'],
  'monochrome': ['monochromatic', 'grayscale', 'black-white', 'single-tone', 'bw', 'black-and-white'],
  'dark': ['dark-mode', 'dark-theme', 'dark', 'dim', 'shadowy', 'gloomy', 'nocturnal'],
  'light': ['light-theme', 'light-mode', 'bright', 'illuminated', 'luminous', 'radiant', 'sunny'],
  'animated': ['animation', 'animated', 'motion', 'moving', 'dynamic', 'lively', 'motion-design'],
  'interactive': ['interactivity', 'interactive', 'clickable', 'responsive', 'engaging', 'participatory'],
  'typographic': ['typography', 'type-design', 'text-design', 'font-design', 'typeface', 'lettering'],
  'professional': ['professionalism', 'business', 'corporate', 'formal', 'polished', 'credible', 'trustworthy'],
  'elegant': ['elegance', 'sophisticated', 'refined', 'graceful', 'polished', 'classy', 'luxurious'],
  'bold': ['boldness', 'strong', 'striking', 'powerful', 'assertive', 'confident', 'dramatic'],
  'spacious': ['space', 'spaciousness', 'airy', 'open', 'roomy', 'whitespace', 'breathing-room'],
  'dense': ['density', 'compact', 'packed', 'crammed', 'tight', 'information-dense', 'content-rich'],
  'retro': ['retro-style', 'retro', 'nostalgic', 'vintage', 'throwback', 'classic', 'old-school'],
  'vintage': ['vintage-style', 'antique', 'retro', 'aged', 'classic', 'old-fashioned', 'timeworn'],
  'futuristic': ['futuristic-style', 'sci-fi', 'forward-looking', 'advanced', 'tech-forward', 'innovative'],
  'corporate': ['corporate-style', 'business', 'enterprise', 'institutional', 'formal', 'professional'],
  'artistic': ['artistic-style', 'creative', 'expressive', 'aesthetic', 'design-forward', 'stylized'],
  'experimental': ['experimental-design', 'innovative', 'unconventional', 'avant-garde', 'daring', 'risky'],
}

// New concepts to add (~94 new ones)
const newConcepts: Concept[] = [
  // Style/Aesthetic extensions
  { id: 'maximalist', label: 'Maximalist', synonyms: ['maximal', 'busy', 'layered', 'rich', 'ornate', 'abundant'], related: ['colorful', 'dense', 'expressive', 'artistic'], category: 'Style/Aesthetic' },
  { id: 'neo-brutalist', label: 'Neo-Brutalist', synonyms: ['neo-brutalism', 'modern-brutalist', 'updated-brutalist'], related: ['brutalist', 'geometric', 'bold', 'modern'], category: 'Style/Aesthetic' },
  { id: 'glassmorphism', label: 'Glassmorphism', synonyms: ['glass-effect', 'frosted', 'blurred', 'transparent', 'glass-ui'], related: ['modern', 'futuristic', 'minimalistic', 'light'], category: 'Style/Aesthetic' },
  { id: 'neumorphism', label: 'Neumorphism', synonyms: ['neo-morphism', 'soft-ui', 'soft-shadows', 'embossed'], related: ['minimalistic', 'modern', 'soft', 'subtle'], category: 'Style/Aesthetic' },
  { id: 'cyberpunk', label: 'Cyberpunk', synonyms: ['cyber', 'punk', 'dystopian', 'tech-noir'], related: ['dark', 'neon', 'futuristic', 'gritty'], category: 'Style/Aesthetic' },
  { id: 'y2k', label: 'Y2K', synonyms: ['y2k-aesthetic', 'millennial', 'chrome', 'metallic'], related: ['futuristic', 'gradient', 'bold', 'techy'], category: 'Style/Aesthetic' },
  { id: 'cottagecore', label: 'Cottagecore', synonyms: ['cottage', 'rustic', 'countryside', 'natural'], related: ['organic', 'warm', 'inviting', 'handwritten'], category: 'Style/Aesthetic' },
  { id: 'dark-academia', label: 'Dark-Academia', synonyms: ['academic', 'scholarly', 'library', 'study'], related: ['dark', 'serif', 'editorial', 'premium'], category: 'Style/Aesthetic' },
  { id: 'light-academia', label: 'Light-Academia', synonyms: ['bright-academic', 'scholarly-light', 'library-light'], related: ['light', 'serif', 'editorial', 'calm'], category: 'Style/Aesthetic' },
  { id: 'cottagecore', label: 'Cottagecore', synonyms: ['cottage', 'rustic', 'natural', 'countryside'], related: ['organic', 'warm', 'inviting'], category: 'Style/Aesthetic' },
  
  // Color/Tone extensions
  { id: 'colorless', label: 'Colorless', synonyms: ['no-color', 'achromatic', 'grayscale', 'monochrome', 'bw'], related: ['monochrome', 'minimalistic', 'strict', 'austere'], category: 'Color/Tone' },
  { id: 'rainbow', label: 'Rainbow', synonyms: ['multicolor', 'prismatic', 'spectrum', 'vivid-colors'], related: ['colorful', 'vibrant', 'playful', 'energetic'], category: 'Color/Tone' },
  { id: 'sepia', label: 'Sepia', synonyms: ['sepia-tone', 'brown-tone', 'vintage-color', 'aged-color'], related: ['vintage', 'retro', 'warm', 'muted'], category: 'Color/Tone' },
  { id: 'high-saturation', label: 'High-Saturation', synonyms: ['saturated', 'intense-colors', 'vivid', 'rich-colors'], related: ['colorful', 'vibrant', 'bold', 'energetic'], category: 'Color/Tone' },
  { id: 'low-saturation', label: 'Low-Saturation', synonyms: ['desaturated', 'muted-colors', 'soft-colors', 'pastel'], related: ['muted', 'pastel', 'calm', 'understated'], category: 'Color/Tone' },
  { id: 'earth-tones', label: 'Earth-Tones', synonyms: ['earth-colors', 'natural-colors', 'brown', 'beige', 'tan'], related: ['warm', 'organic', 'natural', 'muted'], category: 'Color/Tone' },
  { id: 'ocean-tones', label: 'Ocean-Tones', synonyms: ['ocean-colors', 'aqua', 'teal', 'turquoise', 'blue-green'], related: ['cool', 'calm', 'serene', 'nature-inspired'], category: 'Color/Tone' },
  
  // Layout/Composition extensions
  { id: 'z-layout', label: 'Z-Layout', synonyms: ['z-pattern', 'z-shaped', 'eye-tracking'], related: ['centered', 'professional', 'structured'], category: 'Layout/Composition' },
  { id: 'f-layout', label: 'F-Layout', synonyms: ['f-pattern', 'f-shaped', 'reading-pattern'], related: ['editorial', 'content-heavy', 'dense'], category: 'Layout/Composition' },
  { id: 'sidebar', label: 'Sidebar', synonyms: ['side-navigation', 'sidebar-layout', 'vertical-nav'], related: ['modular', 'structured', 'professional'], category: 'Layout/Composition' },
  { id: 'navbar-top', label: 'Navbar-Top', synonyms: ['top-navigation', 'header-nav', 'horizontal-nav'], related: ['modern', 'clean', 'professional'], category: 'Layout/Composition' },
  { id: 'hamburger-menu', label: 'Hamburger-Menu', synonyms: ['mobile-menu', 'burger-menu', 'hidden-nav'], related: ['modern', 'minimalistic', 'responsive'], category: 'Layout/Composition' },
  { id: 'sticky-header', label: 'Sticky-Header', synonyms: ['fixed-header', 'floating-header', 'persistent-nav'], related: ['modern', 'interactive', 'responsive'], category: 'Layout/Composition' },
  { id: 'floating-elements', label: 'Floating-Elements', synonyms: ['floating', 'overlay', 'positioned', 'absolutely-positioned'], related: ['modern', 'interactive', 'animated'], category: 'Layout/Composition' },
  { id: 'overlapping', label: 'Overlapping', synonyms: ['layered', 'stacked', 'overlap', 'depth'], related: ['modern', 'dynamic', 'dimensional'], category: 'Layout/Composition' },
  
  // Mood/Brand extensions
  { id: 'confident', label: 'Confident', synonyms: ['assured', 'self-assured', 'bold', 'strong'], related: ['authoritative', 'bold', 'professional', 'assertive'], category: 'Mood/Brand Personality' },
  { id: 'trustworthy', label: 'Trustworthy', synonyms: ['trust', 'reliable', 'credible', 'dependable'], related: ['corporate', 'professional', 'authoritative', 'blue'], category: 'Mood/Brand Personality' },
  { id: 'innovative', label: 'Innovative', synonyms: ['innovation', 'cutting-edge', 'pioneering', 'advanced'], related: ['modern', 'techy', 'experimental', 'futuristic'], category: 'Mood/Brand Personality' },
  { id: 'accessible', label: 'Accessible', synonyms: ['inclusive', 'universal', 'user-friendly', 'welcoming'], related: ['friendly', 'clean', 'simple', 'readable'], category: 'Mood/Brand Personality' },
  { id: 'sophisticated', label: 'Sophisticated', synonyms: ['sophistication', 'refined', 'cultured', 'polished'], related: ['elegant', 'premium', 'luxurious', 'serif'], category: 'Mood/Brand Personality' },
  { id: 'energetic', label: 'Energetic', synonyms: ['energy', 'dynamic', 'lively', 'vibrant', 'exciting'], related: ['colorful', 'animated', 'playful', 'gradient'], category: 'Mood/Brand Personality' },
  { id: 'peaceful', label: 'Peaceful', synonyms: ['peace', 'tranquil', 'calm', 'serene', 'relaxed'], related: ['calm', 'muted', 'spacious', 'pastel'], category: 'Mood/Brand Personality' },
  { id: 'dramatic', label: 'Dramatic', synonyms: ['drama', 'striking', 'bold', 'powerful', 'intense'], related: ['bold', 'high-contrast', 'cinematic', 'dark'], category: 'Mood/Brand Personality' },
  
  // Typography extensions
  { id: 'script', label: 'Script', synonyms: ['cursive', 'handwriting', 'calligraphy', 'flowing'], related: ['handwritten', 'elegant', 'artistic', 'organic'], category: 'Typography' },
  { id: 'display', label: 'Display', synonyms: ['headline', 'showcase', 'decorative', 'large'], related: ['large-type', 'bold', 'poster-like', 'hero-led'], category: 'Typography' },
  { id: 'body-text', label: 'Body-Text', synonyms: ['paragraph', 'readable', 'copy', 'content'], related: ['readable', 'serif', 'sans-serif', 'professional'], category: 'Typography' },
  { id: 'mixed-fonts', label: 'Mixed-Fonts', synonyms: ['font-pairing', 'typography-mix', 'multiple-fonts'], related: ['editorial', 'artistic', 'dynamic', 'expressive'], category: 'Typography' },
  { id: 'text-as-image', label: 'Text-As-Image', synonyms: ['typography-art', 'text-art', 'lettering-art'], related: ['artistic', 'experimental', 'bold', 'display-type'], category: 'Typography' },
  
  // Interaction/Tech extensions
  { id: 'hover-effects', label: 'Hover-Effects', synonyms: ['hover', 'interaction-effects', 'hover-animation'], related: ['interactive', 'micro-interactions', 'modern', 'responsive'], category: 'Interaction/Tech' },
  { id: 'loading-states', label: 'Loading-States', synonyms: ['loading', 'spinner', 'skeleton', 'placeholder'], related: ['modern', 'interactive', 'responsive', 'micro-interactions'], category: 'Interaction/Tech' },
  { id: 'smooth-scrolling', label: 'Smooth-Scrolling', synonyms: ['smooth-scroll', 'animated-scroll', 'fluid-scroll'], related: ['animated', 'modern', 'interactive', 'premium'], category: 'Interaction/Tech' },
  { id: 'transition-effects', label: 'Transition-Effects', synonyms: ['transitions', 'fade', 'slide', 'animation-transitions'], related: ['animated', 'modern', 'premium', 'micro-interactions'], category: 'Interaction/Tech' },
  { id: 'gesture-based', label: 'Gesture-Based', synonyms: ['gestures', 'touch', 'swipe', 'pinch'], related: ['interactive', 'modern', 'responsive', 'mobile-friendly'], category: 'Interaction/Tech' },
  { id: 'voice-ui', label: 'Voice-UI', synonyms: ['voice', 'vui', 'speech', 'audio-interface'], related: ['modern', 'techy', 'innovative', 'accessible'], category: 'Interaction/Tech' },
  { id: 'ar-vr', label: 'AR-VR', synonyms: ['augmented-reality', 'virtual-reality', '3d-space', 'immersive-tech'], related: ['3d', 'immersive', 'futuristic', 'techy'], category: 'Interaction/Tech' },
  
  // Industry/Purpose extensions
  { id: 'education', label: 'Education', synonyms: ['educational', 'learning', 'academic', 'school'], related: ['clean', 'readable', 'professional', 'accessible'], category: 'Industry/Purpose' },
  { id: 'healthcare', label: 'Healthcare', synonyms: ['medical', 'health', 'hospital', 'wellness'], related: ['clean', 'trustworthy', 'professional', 'calm'], category: 'Industry/Purpose' },
  { id: 'finance', label: 'Finance', synonyms: ['financial', 'banking', 'money', 'investment'], related: ['professional', 'trustworthy', 'corporate', 'authoritative'], category: 'Industry/Purpose' },
  { id: 'food', label: 'Food', synonyms: ['restaurant', 'culinary', 'dining', 'food-service'], related: ['warm', 'inviting', 'colorful', 'appetizing'], category: 'Industry/Purpose' },
  { id: 'travel', label: 'Travel', synonyms: ['tourism', 'vacation', 'adventure', 'exploration'], related: ['vibrant', 'energetic', 'colorful', 'cinematic'], category: 'Industry/Purpose' },
  { id: 'music', label: 'Music', synonyms: ['musical', 'audio', 'sound', 'entertainment'], related: ['expressive', 'artistic', 'dynamic', 'energetic'], category: 'Industry/Purpose' },
  { id: 'sports', label: 'Sports', synonyms: ['athletic', 'fitness', 'sporting', 'competition'], related: ['energetic', 'bold', 'dynamic', 'vibrant'], category: 'Industry/Purpose' },
  { id: 'nonprofit', label: 'Nonprofit', synonyms: ['charity', 'ngo', 'cause', 'social-good'], related: ['friendly', 'accessible', 'trustworthy', 'warm'], category: 'Industry/Purpose' },
  { id: 'government', label: 'Government', synonyms: ['public-sector', 'official', 'civic', 'municipal'], related: ['professional', 'authoritative', 'corporate', 'accessible'], category: 'Industry/Purpose' },
  { id: 'real-estate', label: 'Real-Estate', synonyms: ['property', 'housing', 'realty', 'construction'], related: ['professional', 'trustworthy', 'spacious', 'premium'], category: 'Industry/Purpose' },
  
  // Additional visual styles
  { id: 'isometric', label: 'Isometric', synonyms: ['iso', '3d-flat', 'isometric-design', 'dimensional-flat'], related: ['3d', 'geometric', 'modern', 'techy'], category: 'Style/Aesthetic' },
  { id: 'flat-design', label: 'Flat-Design', synonyms: ['flat', 'flat-ui', 'minimal-flat', 'two-dimensional'], related: ['minimalistic', 'modern', 'clean', 'colorful'], category: 'Style/Aesthetic' },
  { id: 'material-design', label: 'Material-Design', synonyms: ['material', 'google-material', 'material-ui'], related: ['modern', 'clean', 'structured', 'colorful'], category: 'Style/Aesthetic' },
  { id: 'gradient-mesh', label: 'Gradient-Mesh', synonyms: ['mesh-gradient', 'complex-gradient', 'blended-gradient'], related: ['gradient', 'modern', 'futuristic', 'colorful'], category: 'Style/Aesthetic' },
  { id: 'line-art', label: 'Line-Art', synonyms: ['linework', 'outline', 'wireframe', 'sketchy'], related: ['minimalistic', 'artistic', 'clean', 'hand-drawn'], category: 'Style/Aesthetic' },
  { id: 'collage', label: 'Collage', synonyms: ['mixed-media', 'layered-art', 'composite', 'assembled'], related: ['artistic', 'experimental', 'expressive', 'creative'], category: 'Style/Aesthetic' },
  { id: 'photography-led', label: 'Photography-Led', synonyms: ['photo-driven', 'image-heavy', 'photography', 'visual-storytelling'], related: ['cinematic', 'full-bleed', 'immersive', 'premium'], category: 'Style/Aesthetic' },
  { id: 'illustration-led', label: 'Illustration-Led', synonyms: ['illustration-driven', 'illustrated', 'drawings', 'artwork'], related: ['artistic', 'hand-drawn', 'playful', 'creative'], category: 'Style/Aesthetic' },
  
  // Additional layout patterns
  { id: 'dashboard', label: 'Dashboard', synonyms: ['admin', 'control-panel', 'metrics', 'data-visualization'], related: ['grid-based', 'modular', 'professional', 'data-rich'], category: 'Layout/Composition' },
  { id: 'timeline', label: 'Timeline', synonyms: ['chronological', 'history', 'sequence', 'progression'], related: ['linear', 'narrative', 'editorial', 'structured'], category: 'Layout/Composition' },
  { id: 'flowchart', label: 'Flowchart', synonyms: ['diagram', 'process-flow', 'decision-tree', 'navigation-flow'], related: ['structured', 'geometric', 'professional', 'systematic'], category: 'Layout/Composition' },
  { id: 'accordion', label: 'Accordion', synonyms: ['collapsible', 'expandable', 'foldable', 'tabs'], related: ['modular', 'organized', 'interactive', 'clean'], category: 'Layout/Composition' },
  { id: 'tabs', label: 'Tabs', synonyms: ['tabbed-interface', 'tab-navigation', 'segmented-control'], related: ['modular', 'organized', 'interactive', 'clean'], category: 'Layout/Composition' },
  { id: 'carousel', label: 'Carousel', synonyms: ['slider', 'slideshow', 'rotating', 'gallery'], related: ['interactive', 'modern', 'image-rich', 'animated'], category: 'Layout/Composition' },
  { id: 'modal', label: 'Modal', synonyms: ['dialog', 'popup', 'overlay', 'lightbox'], related: ['interactive', 'modern', 'focused', 'centered'], category: 'Layout/Composition' },
  { id: 'sidebar-drawer', label: 'Sidebar-Drawer', synonyms: ['drawer', 'side-menu', 'slide-out', 'off-canvas'], related: ['modern', 'responsive', 'mobile-friendly', 'clean'], category: 'Layout/Composition' },
  
  // Additional mood/brand
  { id: 'welcoming', label: 'Welcoming', synonyms: ['inviting', 'open', 'hospitable', 'friendly'], related: ['warm', 'inviting', 'friendly', 'accessible'], category: 'Mood/Brand Personality' },
  { id: 'reliable', label: 'Reliable', synonyms: ['dependable', 'consistent', 'trustworthy', 'stable'], related: ['corporate', 'professional', 'structured', 'blue'], category: 'Mood/Brand Personality' },
  { id: 'cutting-edge', label: 'Cutting-Edge', synonyms: ['innovative', 'advanced', 'pioneering', 'leading'], related: ['modern', 'techy', 'futuristic', 'experimental'], category: 'Mood/Brand Personality' },
  { id: 'cozy', label: 'Cozy', synonyms: ['comfortable', 'warm', 'intimate', 'homey'], related: ['warm', 'inviting', 'organic', 'muted'], category: 'Mood/Brand Personality' },
  { id: 'powerful', label: 'Powerful', synonyms: ['strong', 'forceful', 'influential', 'commanding'], related: ['bold', 'authoritative', 'high-contrast', 'dark'], category: 'Mood/Brand Personality' },
  { id: 'gentle', label: 'Gentle', synonyms: ['soft', 'tender', 'mild', 'subtle'], related: ['calm', 'muted', 'pastel', 'understated'], category: 'Mood/Brand Personality' },
  
  // Additional color concepts
  { id: 'monochromatic', label: 'Monochromatic', synonyms: ['single-color', 'one-color', 'tonal', 'shades'], related: ['monochrome', 'minimalistic', 'cohesive', 'simple'], category: 'Color/Tone' },
  { id: 'complementary', label: 'Complementary', synonyms: ['opposite-colors', 'contrast-colors', 'color-pairs'], related: ['high-contrast', 'bold', 'striking', 'vibrant'], category: 'Color/Tone' },
  { id: 'analogous', label: 'Analogous', synonyms: ['harmonious-colors', 'related-colors', 'adjacent-colors'], related: ['calm', 'cohesive', 'harmonious', 'soft'], category: 'Color/Tone' },
  { id: 'triadic', label: 'Triadic', synonyms: ['three-colors', 'balanced-palette', 'tri-color'], related: ['colorful', 'balanced', 'vibrant', 'structured'], category: 'Color/Tone' },
  
  // Additional typography
  { id: 'all-caps', label: 'All-Caps', synonyms: ['uppercase', 'caps', 'capitalized', 'strong-text'], related: ['bold', 'authoritative', 'striking', 'display-type'], category: 'Typography' },
  { id: 'small-caps', label: 'Small-Caps', synonyms: ['small-caps', 'sc', 'elegant-caps'], related: ['elegant', 'refined', 'serif', 'premium'], category: 'Typography' },
  { id: 'text-underline', label: 'Text-Underline', synonyms: ['underlined', 'decorative-underline', 'text-decoration'], related: ['editorial', 'traditional', 'readable', 'formal'], category: 'Typography' },
  
  // Additional interaction
  { id: 'drag-drop', label: 'Drag-Drop', synonyms: ['draggable', 'reorderable', 'sortable', 'interactive-items'], related: ['interactive', 'modern', 'responsive', 'intuitive'], category: 'Interaction/Tech' },
  { id: 'infinite-scroll', label: 'Infinite-Scroll', synonyms: ['endless-scroll', 'auto-load', 'continuous-loading'], related: ['long-scroll', 'modern', 'content-heavy', 'dynamic'], category: 'Interaction/Tech' },
  { id: 'lazy-loading', label: 'Lazy-Loading', synonyms: ['progressive-loading', 'on-demand', 'deferred-loading'], related: ['modern', 'responsive', 'performance', 'efficient'], category: 'Interaction/Tech' },
  { id: 'search-focused', label: 'Search-Focused', synonyms: ['search-driven', 'searchable', 'filterable', 'query-based'], related: ['functional', 'professional', 'data-rich', 'structured'], category: 'Interaction/Tech' },
]

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const concepts: Concept[] = JSON.parse(await fs.readFile(seedPath, 'utf-8'))
  
  console.log(`📚 Starting with ${concepts.length} concepts`)
  
  // Expand synonyms for existing concepts
  let expanded = 0
  for (const concept of concepts) {
    const expansion = synonymExpansions[concept.id]
    if (expansion) {
      const newSynonyms = [...concept.synonyms]
      for (const synonym of expansion) {
        if (!newSynonyms.includes(synonym) && synonym !== concept.label.toLowerCase()) {
          newSynonyms.push(synonym)
        }
      }
      concept.synonyms = newSynonyms
      expanded++
    }
  }
  console.log(`✅ Expanded synonyms for ${expanded} concepts`)
  
  // Add new concepts
  const existingIds = new Set(concepts.map(c => c.id))
  const toAdd = newConcepts.filter(c => !existingIds.has(c.id))
  concepts.push(...toAdd)
  console.log(`✅ Added ${toAdd.length} new concepts`)
  
  // Sort by category and then by label
  concepts.sort((a, b) => {
    const catA = a.category || 'Z'
    const catB = b.category || 'Z'
    if (catA !== catB) return catA.localeCompare(catB)
    return a.label.localeCompare(b.label)
  })
  
  // Write back
  await fs.writeFile(seedPath, JSON.stringify(concepts, null, 2) + '\n', 'utf-8')
  
  console.log(`\n🎉 Complete!`)
  console.log(`   Total concepts: ${concepts.length}`)
  console.log(`   Average synonyms: ${(concepts.reduce((sum, c) => sum + c.synonyms.length, 0) / concepts.length).toFixed(1)}`)
  console.log(`   Total synonyms: ${concepts.reduce((sum, c) => sum + c.synonyms.length, 0)}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

