import fs from 'fs';
import path from 'path';

type Concept = {
  id: string;
  label: string;
  synonyms: string[];
  related: string[];
  category?: string;
};

// Comprehensive synonym expansions for ALL concepts
// Similar depth to 3d concept (10+ synonyms per concept)
const comprehensiveExpansions: Record<string, string[]> = {
  // 3D related (already done)
  '3d': ['cgi', '3d-rendering', '3d-model', 'volumetric', 'three-dimensional-modeling', '3d-graphics', 'rendered-3d', '3d-visualization', 'three-d', '3d-design', '3d-artwork', 'dimensional-design'],
  
  // Color/Tone concepts - comprehensive expansions
  'colorful': ['color', 'colors', 'colored', 'colour', 'colourful', 'multicolor', 'polychrome', 'rainbow', 'vivid', 'saturated', 'color-rich', 'colorful-design', 'bright-colors', 'vibrant-colors'],
  'colorless': ['no-color', 'achromatic', 'grayscale', 'monochrome', 'bw', 'black-white', 'grey', 'gray', 'neutral', 'colorless-design', 'monotone'],
  'vibrant': ['vivid', 'bright-colors', 'saturated', 'intense-colors', 'electric', 'luminous', 'glowing', 'energetic', 'dynamic-colors', 'colorful', 'rich-colors'],
  'muted': ['subdued', 'soft-colors', 'desaturated', 'toned-down', 'pastel', 'pale', 'gentle', 'light-toned', 'understated', 'quiet-colors', 'soft-palette'],
  'bright': ['light', 'luminous', 'illuminated', 'radiant', 'shining', 'brilliant', 'vivid', 'light-toned', 'clear', 'glowing', 'illuminated-design'],
  'dark': ['dim', 'shadowy', 'gloomy', 'black', 'deep', 'somber', 'dark-toned', 'shadowed', 'moody', 'dark-palette', 'low-light'],
  'monochrome': ['monochromatic', 'single-color', 'grayscale', 'bw', 'black-white', 'one-color', 'single-tone', 'colorless'],
  'neon': ['fluorescent', 'electric', 'glowing', 'bright-colors', 'saturated', 'neon-lights', 'electric-colors', 'luminous', 'highlighter', 'neon-design'],
  'gradient': ['color-gradient', 'color-transition', 'fade', 'blend', 'color-blend', 'gradient-design', 'color-shift', 'smooth-transition', 'color-flow'],
  'rainbow': ['multicolor', 'spectrum', 'prism', 'colorful', 'polychrome', 'color-spectrum', 'rainbow-design', 'full-spectrum'],
  'warm': ['warm-toned', 'warm-colors', 'sunset', 'cozy', 'inviting', 'earth-tones', 'warm-palette'],
  'cool': ['cool-toned', 'cool-colors', 'icy', 'fresh', 'cool-palette', 'blue-toned', 'chill'],
  'high-saturation': ['saturated', 'intense-colors', 'vivid', 'rich-colors', 'vibrant', 'colorful', 'saturated-design'],
  'low-saturation': ['desaturated', 'muted-colors', 'soft-colors', 'toned-down', 'pastel', 'subtle-colors'],
  'pastel': ['soft-colors', 'pale', 'gentle', 'muted', 'light-toned', 'delicate', 'pastel-palette'],
  'earth-tones': ['natural-colors', 'brown', 'beige', 'tan', 'warm', 'earth-colors', 'natural-palette'],
  'sepia': ['vintage-tone', 'brown-tone', 'aged', 'retro-color', 'warm-toned', 'sepia-effect'],
  'duotone': ['two-color', 'color-split', 'color-combination', 'dual-tone', 'two-tone'],
  'triadic': ['three-color', 'color-triangle', 'balanced-colors', 'three-way'],
  'complementary': ['opposite-colors', 'contrast-colors', 'color-pairs', 'complementary-palette'],
  'analogous': ['harmonious-colors', 'related-colors', 'adjacent-colors', 'color-harmony'],
  'high-contrast': ['strong-contrast', 'bold-contrast', 'striking', 'dramatic', 'contrast-design'],
  'ocean-tones': ['ocean-colors', 'blue-toned', 'aqua', 'sea-colors', 'water-colors'],
  
  // Style/Aesthetic - comprehensive expansions
  'minimalistic': ['minimal', 'clean', 'simple', 'sparse', 'bare', 'uncluttered', 'minimalism', 'simplified', 'essential', 'stripped-down', 'clean-design', 'simple-design'],
  'brutalist': ['brutalism', 'raw', 'unpolished', 'concrete', 'bold-forms', 'raw-design', 'concrete-style', 'harsh', 'unrefined', 'architectural'],
  'modern': ['contemporary', 'current', 'trendy', 'up-to-date', 'fresh', 'latest', 'sleek', 'cutting-edge', 'new', 'current-design'],
  'retro': ['vintage', 'nostalgic', 'classic', 'old-school', 'throwback', 'retro-design', 'nostalgia', 'retro-style', 'old-fashioned'],
  'futuristic': ['sci-fi', 'space-age', 'cutting-edge', 'advanced', 'high-tech', 'futuristic-design', 'future-tech', 'sci-fi-style'],
  'vintage': ['retro', 'antique', 'classic', 'old-fashioned', 'nostalgic', 'vintage-style', 'classic-design', 'antique-look'],
  'corporate': ['business', 'professional', 'formal', 'official', 'enterprise', 'corporate-design', 'business-style', 'professional-look'],
  'playful': ['fun', 'whimsical', 'friendly', 'lighthearted', 'cheerful', 'happy', 'playful-design', 'fun-design', 'whimsical-style'],
  'strict': ['rigid', 'formal', 'authoritative', 'austere', 'disciplined', 'strict-design', 'formal-style', 'authoritative-look'],
  'elegant': ['sophisticated', 'refined', 'polished', 'graceful', 'classy', 'elegant-design', 'sophisticated-style', 'refined-look'],
  'bold': ['strong', 'striking', 'daring', 'confident', 'assertive', 'bold-design', 'striking-style', 'powerful-look'],
  'calm': ['peaceful', 'serene', 'tranquil', 'relaxed', 'gentle', 'calm-design', 'peaceful-style', 'serene-look'],
  'luxurious': ['premium', 'high-end', 'exclusive', 'upscale', 'deluxe', 'luxury-design', 'premium-style', 'high-end-look'],
  'artistic': ['creative', 'expressive', 'imaginative', 'visual', 'aesthetic', 'artistic-design', 'creative-style', 'expressive-look'],
  'experimental': ['innovative', 'avant-garde', 'unconventional', 'pioneering', 'experimental-design', 'innovative-style', 'unconventional-look'],
  'geometric': ['geometric-shapes', 'geometric-design', 'angular', 'structured-forms', 'geometric-patterns', 'geometric-style'],
  'organic': ['organic-shapes', 'natural-forms', 'flowing', 'curved', 'natural-design', 'organic-style'],
  'surreal': ['surrealist', 'dreamlike', 'fantastical', 'unreal', 'surreal-design', 'dreamlike-style'],
  'editorial': ['editorial-design', 'magazine-style', 'publication', 'editorial-look', 'magazine-layout'],
  'skeuomorphic': ['realistic', 'physical', 'textured', '3d-like', 'dimensional', 'realistic-design', 'textured-style'],
  'flat-design': ['flat', 'minimal', 'simple', 'flat-ui', 'flat-design-style', 'minimal-design'],
  'glassmorphism': ['glass-effect', 'frosted-glass', 'glass-design', 'transparent', 'glassmorphism-style'],
  'neumorphism': ['soft-shadows', 'soft-ui', 'neumorphism-design', 'soft-design-style'],
  'material-design': ['material', 'google-material', 'material-ui', 'material-design-style'],
  'illustration-led': ['illustrated', 'illustration-design', 'illustrative', 'illustration-style'],
  'photography-led': ['photo-based', 'photography-design', 'photographic', 'photo-style'],
  'line-art': ['line-drawing', 'line-design', 'line-art-style', 'line-illustration'],
  'collage': ['collage-design', 'mixed-media', 'collage-style', 'layered-design'],
  'maximalist': ['maximalism', 'busy', 'crowded', 'rich', 'maximalist-design', 'busy-design'],
  'cyberpunk': ['cyberpunk-style', 'neon-futuristic', 'dystopian', 'cyber-design', 'neon-tech'],
  'y2k': ['y2k-style', '2000s', 'millennial', 'y2k-design', 'early-2000s'],
  'dark-academia': ['dark-academic', 'scholarly-dark', 'gothic-academic', 'dark-academia-style'],
  'light-academia': ['light-academic', 'scholarly-light', 'bright-academic', 'light-academia-style'],
  'cottagecore': ['cottage-core', 'rustic', 'countryside', 'cottage-style', 'rustic-design'],
  'traditional': ['classic', 'conventional', 'traditional-style', 'classic-design', 'conventional-look'],
  'new': ['fresh', 'latest', 'current', 'modern', 'new-design', 'fresh-style'],
  'old': ['antique', 'vintage', 'classic', 'old-design', 'antique-style'],
  'friendly': ['welcoming', 'approachable', 'warm', 'inviting', 'friendly-design', 'welcoming-style'],
  'gritty': ['rough', 'raw', 'edgy', 'gritty-design', 'rough-style'],
  'serene': ['peaceful', 'calm', 'tranquil', 'serene-design', 'peaceful-style'],
  'authoritative': ['powerful', 'commanding', 'dominant', 'authoritative-design', 'powerful-style'],
  'inviting': ['welcoming', 'friendly', 'warm', 'inviting-design', 'welcoming-style'],
  'expressive': ['emotive', 'dynamic', 'passionate', 'expressive-design', 'emotive-style'],
  'understated': ['subtle', 'quiet', 'modest', 'understated-design', 'subtle-style'],
  'energetic': ['dynamic', 'vibrant', 'lively', 'energetic-design', 'dynamic-style'],
  'cinematic': ['movie-like', 'film-style', 'cinematic-design', 'film-look'],
  'premium': ['luxury', 'high-end', 'exclusive', 'premium-design', 'luxury-style'],
  'powerful': ['strong', 'dominant', 'commanding', 'powerful-design', 'strong-style'],
  'gentle': ['soft', 'mild', 'tender', 'gentle-design', 'soft-style'],
  'cozy': ['comfortable', 'warm', 'inviting', 'cozy-design', 'comfortable-style'],
  'peaceful': ['calm', 'serene', 'tranquil', 'peaceful-design', 'calm-style'],
  'dramatic': ['theatrical', 'striking', 'powerful', 'dramatic-design', 'theatrical-style'],
  'sophisticated': ['refined', 'elegant', 'polished', 'sophisticated-design', 'refined-style'],
  'confident': ['assured', 'bold', 'strong', 'confident-design', 'assured-style'],
  'innovative': ['creative', 'original', 'pioneering', 'innovative-design', 'original-style'],
  'cutting-edge': ['advanced', 'forward-thinking', 'leading', 'cutting-edge-design', 'advanced-style'],
  'reliable': ['dependable', 'trustworthy', 'steady', 'reliable-design', 'dependable-style'],
  'trustworthy': ['credible', 'reliable', 'dependable', 'trustworthy-design', 'credible-style'],
  'welcoming': ['inviting', 'friendly', 'warm', 'welcoming-design', 'inviting-style'],
  'accessible': ['easy-to-use', 'user-friendly', 'inclusive', 'accessible-design', 'user-friendly-style'],
  
  // Layout/Composition - comprehensive expansions
  'grid-based': ['grid', 'gridded', 'grid-layout', 'systematic', 'structured', 'grid-design', 'grid-system', 'structured-layout'],
  'spacious': ['open', 'airy', 'roomy', 'generous', 'wide', 'expansive', 'spacious-design', 'open-layout'],
  'dense': ['compact', 'crowded', 'packed', 'tight', 'condensed', 'dense-layout', 'compact-design'],
  'centered': ['centered-layout', 'symmetrical', 'balanced', 'aligned', 'center-aligned', 'symmetrical-layout'],
  'asymmetrical': ['unbalanced', 'offset', 'irregular', 'dynamic', 'unconventional', 'asymmetrical-layout', 'dynamic-layout'],
  'full-bleed': ['edge-to-edge', 'full-width', 'no-margins', 'immersive', 'full-bleed-design', 'edge-to-edge-layout'],
  'card-based': ['cards', 'card-layout', 'tiles', 'blocks', 'card-design', 'tile-layout'],
  'modular': ['modular-layout', 'component-based', 'sectioned', 'structured', 'modular-design', 'component-layout'],
  'full-bleed': ['edge-to-edge', 'full-width', 'no-margins', 'immersive', 'full-bleed-layout'],
  'magazine-layout': ['magazine-style', 'editorial-layout', 'publication-design', 'magazine-design'],
  'masonry': ['masonry-layout', 'pinterest-style', 'staggered', 'masonry-design'],
  'hero-led': ['hero-section', 'large-hero', 'hero-image', 'hero-design'],
  'long-scroll': ['infinite-scroll', 'long-page', 'scrolling-design', 'long-scroll-layout'],
  'split-screen': ['split-layout', 'divided-screen', 'split-design', 'two-panel'],
  'dashboard': ['dashboard-layout', 'control-panel', 'dashboard-design', 'panel-layout'],
  'poster-like': ['poster-design', 'large-format', 'poster-layout', 'billboard-style'],
  'accordion': ['accordion-menu', 'expandable', 'accordion-design', 'collapsible'],
  'carousel': ['carousel-slider', 'image-carousel', 'carousel-design', 'slider'],
  'tabs': ['tabbed-interface', 'tab-design', 'tabs-layout', 'tabbed-navigation'],
  'modal': ['modal-popup', 'dialog-box', 'modal-design', 'popup-window'],
  'sidebar': ['sidebar-navigation', 'side-menu', 'sidebar-design', 'side-panel'],
  'sidebar-drawer': ['drawer-menu', 'slide-out-menu', 'drawer-design', 'side-drawer'],
  'navbar-top': ['top-navigation', 'top-bar', 'navbar-design', 'top-menu'],
  'hamburger-menu': ['hamburger-icon', 'mobile-menu', 'burger-menu', 'hamburger-nav'],
  'sticky-header': ['sticky-nav', 'fixed-header', 'sticky-header-design', 'fixed-nav'],
  'floating-elements': ['floating-design', 'overlay-elements', 'floating-ui', 'floating-components'],
  'overlapping': ['layered', 'overlap-design', 'stacked-elements', 'layered-layout'],
  'f-layout': ['f-pattern', 'f-layout-design', 'f-pattern-layout'],
  'z-layout': ['z-pattern', 'z-layout-design', 'z-pattern-layout'],
  'flowchart': ['flow-diagram', 'flow-design', 'flowchart-layout', 'diagram-design'],
  'timeline': ['timeline-design', 'chronological', 'timeline-layout', 'chronological-design'],
  
  // Typography - comprehensive expansions
  'serif': ['serif-font', 'traditional-font', 'classic-type', 'elegant-type', 'serif-design', 'traditional-typography'],
  'sans-serif': ['sans-serif-font', 'modern-font', 'clean-type', 'geometric-type', 'sans-serif-design', 'modern-typography'],
  'handwritten': ['script', 'cursive', 'hand-lettering', 'calligraphy', 'handwritten-design', 'script-font'],
  'monospace': ['code-font', 'fixed-width', 'terminal', 'programmer-font', 'monospace-design', 'code-typography'],
  'large-type': ['big-text', 'display-font', 'headline', 'large-font', 'large-type-design', 'display-typography'],
  'condensed': ['narrow-font', 'compressed', 'tight-type', 'condensed-design', 'narrow-typography'],
  'display': ['display-font', 'headline-font', 'display-type', 'display-typography'],
  'body-text': ['body-font', 'paragraph-text', 'body-type', 'body-typography'],
  'typographic': ['typography-led', 'type-focused', 'typographic-design', 'type-centric'],
  'editorial-type': ['editorial-typography', 'magazine-type', 'publication-typography'],
  'geometric-type': ['geometric-font', 'geometric-typography', 'angular-type'],
  'variable-font': ['variable-typography', 'dynamic-font', 'variable-type'],
  'all-caps': ['uppercase', 'caps', 'capital-letters', 'uppercase-design', 'caps-lock-style'],
  'small-caps': ['small-caps-design', 'small-capitals', 'small-caps-typography'],
  'script': ['script-font', 'cursive', 'handwriting', 'script-design'],
  'mixed-fonts': ['varied-type', 'type-hierarchy', 'font-combination', 'mixed-typography'],
  'text-as-image': ['text-image', 'typography-as-image', 'text-graphic', 'word-art'],
  'text-underline': ['underlined-text', 'underline-design', 'text-decoration'],
  
  // Interaction/Tech - comprehensive expansions
  'animated': ['animation', 'motion', 'moving', 'dynamic', 'animated-elements', 'motion-design', 'animation-rich', 'animated-ui'],
  'static': ['still', 'stationary', 'fixed', 'unmoving', 'no-animation', 'static-design', 'still-layout'],
  'interactive': ['clickable', 'engaging', 'responsive', 'interactive-elements', 'interactive-design', 'interactive-ui'],
  'motion-heavy': ['motion-rich', 'animated-heavy', 'motion-design-heavy', 'animation-heavy'],
  'parallax': ['parallax-scrolling', 'depth-effect', 'layered-scroll', 'parallax-design', 'parallax-effect'],
  'scroll-driven': ['scroll-animation', 'scroll-triggered', 'scroll-design', 'scroll-effects'],
  'immersive': ['immersive-design', 'full-screen', 'immersive-experience', 'immersive-ui'],
  'responsive': ['mobile-friendly', 'adaptive', 'flexible', 'multi-device', 'responsive-design', 'responsive-layout'],
  'ar-vr': ['ar-design', 'vr-design', 'augmented-reality', 'virtual-reality', 'ar-vr-design'],
  'drag-drop': ['drag-and-drop', 'draggable', 'drag-drop-design', 'interactive-drag'],
  'gesture-based': ['gesture-control', 'touch-gestures', 'gesture-design', 'gesture-ui'],
  'hover-effects': ['hover', 'hover-state', 'mouse-over', 'interaction', 'hover-design', 'hover-animations'],
  'infinite-scroll': ['endless-scroll', 'continuous-scroll', 'scroll-loading', 'infinite-scroll-design'],
  'lazy-loading': ['lazy-load', 'on-demand-loading', 'lazy-loading-design', 'progressive-loading'],
  'loading-states': ['loading-animation', 'loading-indicator', 'loading-design', 'loading-ui'],
  'search-focused': ['search-centric', 'search-driven', 'search-focused-design', 'search-interface'],
  'smooth-scrolling': ['smooth-scroll', 'eased-scrolling', 'smooth-scroll-design'],
  'transition-effects': ['transitions', 'animation-transitions', 'transition-design', 'smooth-transitions'],
  'voice-ui': ['voice-interface', 'voice-control', 'voice-ui-design', 'speech-interface'],
  'micro-interactions': ['micro-animations', 'small-animations', 'micro-interaction-design'],
  
  // Industry/Purpose - comprehensive expansions
  'portfolio': ['showcase', 'work', 'projects', 'gallery', 'collection', 'portfolio-design', 'showcase-site'],
  'ecommerce': ['online-store', 'shop', 'shopping', 'retail', 'marketplace', 'ecommerce-design', 'online-shop'],
  'saas': ['software', 'web-app', 'application', 'platform', 'service', 'saas-design', 'web-application'],
  'magazine': ['magazine-site', 'publication', 'editorial-site', 'magazine-design'],
  'landing-page': ['homepage', 'welcome-page', 'entry-page', 'promotional', 'landing-page-design'],
  'developer-docs': ['documentation', 'docs-site', 'technical-docs', 'developer-documentation'],
  'agency': ['agency-site', 'creative-agency', 'agency-design', 'agency-website'],
  'startup': ['startup-site', 'new-business', 'startup-design', 'startup-website'],
  'fashion': ['fashion-site', 'fashion-design', 'fashion-brand', 'fashion-website'],
  'architecture': ['architecture-site', 'architectural-design', 'architecture-website'],
  'art': ['art-site', 'artistic-design', 'art-gallery', 'art-website'],
  'product': ['product-site', 'product-design', 'product-website'],
  'music': ['music-site', 'music-design', 'music-website', 'musician-site'],
  'education': ['education-site', 'educational-design', 'education-website'],
  'finance': ['finance-site', 'financial-design', 'finance-website', 'banking-site'],
  'healthcare': ['healthcare-site', 'medical-design', 'healthcare-website'],
  'government': ['government-site', 'gov-design', 'government-website'],
  'nonprofit': ['nonprofit-site', 'nonprofit-design', 'nonprofit-website'],
  'real-estate': ['real-estate-site', 'property-design', 'real-estate-website'],
  'sports': ['sports-site', 'sports-design', 'sports-website'],
  'travel': ['travel-site', 'travel-design', 'travel-website', 'tourism-site'],
  'food': ['food-site', 'food-design', 'food-website', 'restaurant-site'],
};

function enhanceConcept(concept: Concept): Concept {
  const enhanced: Concept = {
    ...concept,
    synonyms: [...(concept.synonyms || [])],
    related: [...(concept.related || [])],
  };
  
  // If we have comprehensive expansions, use them
  if (comprehensiveExpansions[concept.id]) {
    const expansions = comprehensiveExpansions[concept.id];
    const existingSet = new Set([
      ...enhanced.synonyms.map(s => String(s).toLowerCase()),
      ...enhanced.related.map(r => String(r).toLowerCase())
    ]);
    for (const expansion of expansions) {
      if (!existingSet.has(expansion.toLowerCase())) {
        enhanced.synonyms.push(expansion);
      }
    }
  } else {
    // Generic expansions based on patterns for concepts not in comprehensive list
    if (concept.label) {
      const labelLower = concept.label.toLowerCase();
      const synonymsSet = new Set(enhanced.synonyms.map(s => String(s).toLowerCase()));
      
      // Add hyphenated versions
      const hyphenated = labelLower.replace(/\s+/g, '-');
      if (!synonymsSet.has(hyphenated) && hyphenated !== labelLower) {
        enhanced.synonyms.push(hyphenated);
      }
      
      // Add spaced version
      if (labelLower.includes('-')) {
        const spaced = labelLower.replace(/-/g, ' ');
        if (!synonymsSet.has(spaced)) {
          enhanced.synonyms.push(spaced);
        }
      }
      
      // Add plural if applicable
      if (!labelLower.endsWith('s') && !labelLower.endsWith('y') && !labelLower.endsWith('x')) {
        const plural = concept.label + 's';
        if (!synonymsSet.has(plural.toLowerCase())) {
          enhanced.synonyms.push(plural);
        }
      }
      
      // Add "-design" suffix if not present
      if (!synonymsSet.has(labelLower + '-design')) {
        enhanced.synonyms.push(concept.label + '-design');
      }
      
      // Add "-style" suffix if not present
      if (!synonymsSet.has(labelLower + '-style')) {
        enhanced.synonyms.push(concept.label + '-style');
      }
    }
  }
  
  // Ensure minimum 10 synonyms (similar to 3d)
  const targetSynonyms = 10;
  if (enhanced.synonyms.length < targetSynonyms) {
    // Generate more variations
    const label = concept.label || concept.id;
    const variations = [
      label.toLowerCase(),
      label.toLowerCase().replace(/\s+/g, '-'),
      label.toLowerCase().replace(/\s+/g, ''),
      label + '-design',
      label + '-style',
      label + '-layout',
      label + '-ui',
      label + '-visual',
      label.toLowerCase() + 's',
    ];
    
    const existingSet = new Set(enhanced.synonyms.map(s => String(s).toLowerCase()));
    for (const variation of variations) {
      if (enhanced.synonyms.length >= targetSynonyms) break;
      if (!existingSet.has(variation.toLowerCase())) {
        enhanced.synonyms.push(variation);
        existingSet.add(variation.toLowerCase());
      }
    }
  }
  
  // Deduplicate
  enhanced.synonyms = [...new Set(enhanced.synonyms)];
  enhanced.related = [...new Set(enhanced.related)];
  
  return enhanced;
}

async function main() {
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  const txt = fs.readFileSync(seedPath, 'utf-8');
  const concepts: Concept[] = JSON.parse(txt);
  
  console.log(`Comprehensively expanding ${concepts.length} concepts...\n`);
  
  const enhanced = concepts.map(enhanceConcept);
  
  // Write back
  fs.writeFileSync(seedPath, JSON.stringify(enhanced, null, 2));
  
  // Stats
  const beforeAvg = concepts.reduce((sum, c) => sum + (c.synonyms?.length || 0), 0) / concepts.length;
  const afterAvg = enhanced.reduce((sum, c) => sum + (c.synonyms?.length || 0), 0) / enhanced.length;
  const minSynonyms = Math.min(...enhanced.map(c => c.synonyms?.length || 0));
  const maxSynonyms = Math.max(...enhanced.map(c => c.synonyms?.length || 0));
  
  console.log('✅ Comprehensive expansion complete!');
  console.log(`  Average synonyms before: ${beforeAvg.toFixed(1)}`);
  console.log(`  Average synonyms after: ${afterAvg.toFixed(1)}`);
  console.log(`  Increase: +${(afterAvg - beforeAvg).toFixed(1)} synonyms per concept`);
  console.log(`  Min synonyms: ${minSynonyms}, Max synonyms: ${maxSynonyms}`);
  console.log(`  Concepts with 10+ synonyms: ${enhanced.filter(c => (c.synonyms?.length || 0) >= 10).length}`);
  console.log(`\nNext step: Run "npm run seed:concepts" to re-seed with enhanced synonyms`);
}

main().catch(console.error);

