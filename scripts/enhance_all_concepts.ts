import fs from 'fs';
import path from 'path';

type Concept = {
  id: string;
  label: string;
  synonyms: string[];
  related: string[];
  category?: string;
};

// Enhanced synonym mappings for common concepts
const synonymExpansions: Record<string, string[]> = {
  // 3D related
  '3d': ['cgi', '3d-rendering', '3d-model', 'volumetric', 'three-dimensional-modeling', '3d-graphics', 'rendered-3d', '3d-visualization', 'three-d', '3d-design'],
  
  // Color related
  'colorful': ['color', 'colors', 'colored', 'colour', 'colourful', 'multicolor', 'polychrome', 'rainbow', 'vivid', 'saturated'],
  'colorless': ['no-color', 'achromatic', 'grayscale', 'monochrome', 'bw', 'black-white', 'grey', 'gray'],
  'vibrant': ['vivid', 'bright-colors', 'saturated', 'intense-colors', 'electric', 'luminous', 'glowing'],
  'muted': ['subdued', 'soft-colors', 'desaturated', 'toned-down', 'pastel', 'pale', 'gentle', 'light-toned'],
  'bright': ['light', 'luminous', 'illuminated', 'radiant', 'shining'],
  'dark': ['dim', 'shadowy', 'gloomy', 'black', 'deep', 'somber'],
  'monochrome': ['monochromatic', 'single-color', 'grayscale', 'bw', 'black-white'],
  'neon': ['fluorescent', 'electric', 'glowing', 'bright-colors', 'saturated'],
  'gradient': ['color-gradient', 'color-transition', 'fade', 'blend', 'color-blend'],
  'rainbow': ['multicolor', 'spectrum', 'prism', 'colorful', 'polychrome'],
  
  // Style/Aesthetic
  'minimalistic': ['minimal', 'clean', 'simple', 'sparse', 'bare', 'uncluttered'],
  'brutalist': ['brutalism', 'raw', 'unpolished', 'concrete', 'bold-forms'],
  'modern': ['contemporary', 'current', 'trendy', 'up-to-date', 'fresh', 'latest'],
  'retro': ['vintage', 'nostalgic', 'classic', 'old-school', 'throwback'],
  'futuristic': ['sci-fi', 'space-age', 'cutting-edge', 'advanced', 'high-tech'],
  'vintage': ['retro', 'antique', 'classic', 'old-fashioned', 'nostalgic'],
  'corporate': ['business', 'professional', 'formal', 'official', 'enterprise'],
  'playful': ['fun', 'whimsical', 'friendly', 'lighthearted', 'cheerful', 'happy'],
  'strict': ['rigid', 'formal', 'authoritative', 'austere', 'disciplined'],
  'elegant': ['sophisticated', 'refined', 'polished', 'graceful', 'classy'],
  'bold': ['strong', 'striking', 'daring', 'confident', 'assertive'],
  'calm': ['peaceful', 'serene', 'tranquil', 'relaxed', 'gentle'],
  'luxurious': ['premium', 'high-end', 'exclusive', 'upscale', 'deluxe'],
  'artistic': ['creative', 'expressive', 'imaginative', 'visual', 'aesthetic'],
  'experimental': ['innovative', 'avant-garde', 'unconventional', 'pioneering'],
  
  // Layout/Composition
  'grid-based': ['grid', 'gridded', 'grid-layout', 'systematic', 'structured'],
  'spacious': ['open', 'airy', 'roomy', 'generous', 'wide', 'expansive'],
  'dense': ['compact', 'crowded', 'packed', 'tight', 'condensed'],
  'centered': ['centered-layout', 'symmetrical', 'balanced', 'aligned'],
  'asymmetrical': ['unbalanced', 'offset', 'irregular', 'dynamic', 'unconventional'],
  'full-bleed': ['edge-to-edge', 'full-width', 'no-margins', 'immersive'],
  'card-based': ['cards', 'card-layout', 'tiles', 'blocks'],
  'modular': ['modular-layout', 'component-based', 'sectioned', 'structured'],
  
  // Typography
  'serif': ['serif-font', 'traditional-font', 'classic-type', 'elegant-type'],
  'sans-serif': ['sans-serif-font', 'modern-font', 'clean-type', 'geometric-type'],
  'handwritten': ['script', 'cursive', 'hand-lettering', 'calligraphy'],
  'monospace': ['code-font', 'fixed-width', 'terminal', 'programmer-font'],
  'large-type': ['big-text', 'display-font', 'headline', 'large-font'],
  'small-type': ['tiny-text', 'fine-print', 'small-font'],
  'all-caps': ['uppercase', 'caps', 'capital-letters'],
  'mixed-fonts': ['varied-type', 'type-hierarchy', 'font-combination'],
  
  // Interaction/Tech
  'animated': ['animation', 'motion', 'moving', 'dynamic', 'animated-elements'],
  'static': ['still', 'stationary', 'fixed', 'unmoving', 'no-animation'],
  'interactive': ['clickable', 'engaging', 'responsive', 'interactive-elements'],
  'parallax': ['parallax-scrolling', 'depth-effect', 'layered-scroll'],
  'hover-effects': ['hover', 'hover-state', 'mouse-over', 'interaction'],
  'infinite-scroll': ['endless-scroll', 'continuous-scroll', 'scroll-loading'],
  'responsive': ['mobile-friendly', 'adaptive', 'flexible', 'multi-device'],
  
  // Industry/Purpose
  'ecommerce': ['online-store', 'shop', 'shopping', 'retail', 'marketplace'],
  'saas': ['software', 'web-app', 'application', 'platform', 'service'],
  'portfolio': ['showcase', 'work', 'projects', 'gallery', 'collection'],
  'landing-page': ['homepage', 'welcome-page', 'entry-page', 'promotional'],
};

function enhanceConcept(concept: Concept): Concept {
  const enhanced: Concept = {
    ...concept,
    synonyms: [...(concept.synonyms || [])],
    related: [...(concept.related || [])],
  };
  
  // If we have explicit expansions, use them
  if (synonymExpansions[concept.id]) {
    const expansions = synonymExpansions[concept.id];
    const existingSet = new Set([
      ...enhanced.synonyms.map(s => s.toLowerCase()),
      ...enhanced.related.map(r => r.toLowerCase())
    ]);
    for (const expansion of expansions) {
      if (!existingSet.has(expansion.toLowerCase())) {
        enhanced.synonyms.push(expansion);
      }
    }
  } else {
    // Generic expansions based on patterns
    const labelLower = concept.label.toLowerCase();
    const synonymsSet = new Set(enhanced.synonyms.map(s => s.toLowerCase()));
    
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
    
    // Add plural if applicable (basic heuristic)
    if (!labelLower.endsWith('s') && !labelLower.endsWith('y')) {
      const plural = concept.label + 's';
      if (!synonymsSet.has(plural.toLowerCase())) {
        enhanced.synonyms.push(plural);
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
  const txt = await fs.readFileSync(seedPath, 'utf-8');
  const concepts: Concept[] = JSON.parse(txt);
  
  console.log(`Enhancing ${concepts.length} concepts...\n`);
  
  const enhanced = concepts.map(enhanceConcept);
  
  // Write back
  await fs.writeFileSync(seedPath, JSON.stringify(enhanced, null, 2));
  
  // Stats
  const beforeAvg = concepts.reduce((sum, c) => sum + (c.synonyms?.length || 0), 0) / concepts.length;
  const afterAvg = enhanced.reduce((sum, c) => sum + (c.synonyms?.length || 0), 0) / enhanced.length;
  
  console.log('Enhancement complete!');
  console.log(`  Average synonyms before: ${beforeAvg.toFixed(1)}`);
  console.log(`  Average synonyms after: ${afterAvg.toFixed(1)}`);
  console.log(`  Increase: +${(afterAvg - beforeAvg).toFixed(1)} synonyms per concept`);
  console.log(`\nNext step: Run "npm run seed:concepts" to re-seed with enhanced synonyms`);
}

main().catch(console.error);
