/**
 * Generate opposites for concepts missing them using direct semantic knowledge
 * No API calls - uses semantic understanding to generate opposites
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { updateConceptOpposites } from '../src/lib/update-concept-opposites';

/**
 * Generate opposites for a concept based on semantic understanding
 */
function generateOppositesForConcept(conceptLabel: string): string[] {
  const lower = conceptLabel.toLowerCase();
  
  // Comprehensive opposite mappings based on semantic understanding
  const oppositeMap: Record<string, string[]> = {
    // Dimensional & Spatial
    '3d': ['flat', '2d', 'planar', 'dimensional'],
    '2d': ['3d', 'dimensional', 'depth'],
    'flat': ['3d', 'dimensional', 'depth', 'volumetric'],
    'dimensional': ['flat', '2d', 'planar'],
    'depth': ['flat', '2d', 'shallow'],
    'spatial': ['flat', 'linear', 'planar'],
    
    // Color & Tone
    'vibrant': ['muted', 'desaturated', 'monochrome', 'colorless'],
    'muted': ['vibrant', 'saturated', 'bright', 'intense'],
    'saturated': ['muted', 'desaturated', 'monochrome'],
    'monochrome': ['polychrome', 'vibrant', 'colorful', 'spectrum'],
    'colorful': ['colorless', 'monochrome', 'muted', 'duotone'],
    'colorless': ['colorful', 'vibrant', 'saturated'],
    'bright': ['dark', 'muted', 'dim'],
    'dark': ['bright', 'light', 'luminous'],
    'light': ['dark', 'heavy', 'dense'],
    'warm': ['cool', 'cold', 'icy'],
    'cool': ['warm', 'cozy', 'energetic'],
    
    // Texture & Materiality
    'smooth': ['rough', 'textured', 'grainy'],
    'rough': ['smooth', 'polished', 'slick'],
    'polished': ['rough', 'matte', 'textured'],
    'matte': ['glossy', 'shiny', 'polished'],
    'glossy': ['matte', 'dull', 'rough'],
    'textured': ['smooth', 'slick', 'polished'],
    'solid': ['fluid', 'fragile', 'hollow'],
    'fluid': ['solid', 'rigid', 'static'],
    'rigid': ['flexible', 'fluid', 'soft'],
    'soft': ['rigid', 'hard', 'sharp'],
    'hard': ['soft', 'gentle', 'flexible'],
    
    // Form & Structure
    'geometric': ['organic', 'fluid', 'amorphous', 'irregular'],
    'organic': ['geometric', 'angular', 'structured'],
    'angular': ['curved', 'round', 'soft'],
    'curved': ['angular', 'straight', 'linear'],
    'modular': ['monolithic', 'unified', 'integrated', 'seamless'],
    'monolithic': ['modular', 'fragmented', 'disjointed'],
    'structured': ['organic', 'formless', 'fluid'],
    'grid': ['organic', 'fluid', 'freeform'],
    'symmetrical': ['asymmetrical', 'imbalance', 'chaos'],
    'asymmetrical': ['symmetrical', 'balance', 'centered'],
    'balanced': ['imbalance', 'asymmetry', 'discord'],
    'centered': ['asymmetrical', 'offset', 'marginal'],
    
    // Style & Aesthetic
    'minimalist': ['maximalist', 'ornate', 'decorative', 'cluttered'],
    'maximalist': ['minimalist', 'simple', 'sparse'],
    'simple': ['complex', 'ornate', 'elaborate'],
    'complex': ['simple', 'minimal', 'sparse'],
    'ornate': ['minimalist', 'simple', 'plain'],
    'elegant': ['crude', 'rough', 'vulgar'],
    'refined': ['raw', 'crude', 'unpolished'],
    'sophisticated': ['naive', 'simple', 'crude'],
    'modern': ['traditional', 'classical', 'vintage'],
    'traditional': ['modern', 'contemporary', 'futuristic'],
    'classical': ['modern', 'avant-garde', 'experimental'],
    'brutalist': ['organic', 'soft', 'elegant'],
    'organic': ['brutalist', 'geometric', 'angular'],
    
    // Mood & Emotion
    'playful': ['serious', 'formal', 'strict'],
    'serious': ['playful', 'whimsical', 'lighthearted'],
    'calm': ['chaotic', 'energetic', 'dramatic'],
    'chaotic': ['calm', 'peaceful', 'serene'],
    'energetic': ['calm', 'static', 'peaceful'],
    'static': ['dynamic', 'animated', 'kinetic'],
    'dynamic': ['static', 'still', 'motionless'],
    'peaceful': ['chaotic', 'turbulent', 'agitated'],
    'serene': ['chaotic', 'turbulent', 'agitated'],
    'optimistic': ['pessimistic', 'gloomy', 'cynical'],
    'pessimistic': ['optimistic', 'hopeful', 'bright'],
    'confident': ['uncertain', 'hesitant', 'vulnerable'],
    'bold': ['timid', 'muted', 'understated'],
    'understated': ['bold', 'dramatic', 'loud'],
    
    // Size & Scale
    'large': ['small', 'tiny', 'minimal'],
    'small': ['large', 'massive', 'expansive'],
    'spacious': ['cramped', 'dense', 'compact'],
    'dense': ['spacious', 'open', 'sparse'],
    'compact': ['spacious', 'expansive', 'open'],
    'expansive': ['compact', 'confined', 'limited'],
    
    // Movement & Motion
    'animated': ['static', 'still', 'motionless'],
    'static': ['animated', 'dynamic', 'kinetic'],
    'motion': ['stillness', 'static', 'frozen'],
    'stillness': ['motion', 'dynamic', 'kinetic'],
    'flow': ['stagnation', 'stillness', 'rigid'],
    'stagnation': ['flow', 'movement', 'dynamic'],
    
    // Industry & Context
    'luxury': ['modesty', 'poverty', 'austerity', 'economy'],
    'modesty': ['luxury', 'extravagance', 'opulence'],
    'poverty': ['luxury', 'wealth', 'opulence'],
    'austerity': ['luxury', 'extravagance', 'opulence'],
    'professional': ['casual', 'informal', 'playful'],
    'casual': ['professional', 'formal', 'strict'],
    'formal': ['casual', 'informal', 'relaxed'],
    'corporate': ['artistic', 'playful', 'whimsical'],
    'commercial': ['artistic', 'non-profit', 'charity'],
    'academia': ['commercial', 'practical', 'applied'],
    'finance': ['non-profit', 'charity', 'austerity'],
    'banking': ['cashless', 'digital-only', 'informal'],
    'horology': ['digital', 'casual', 'informal', 'ephemeral'],
    'watchmaking': ['digital', 'casual', 'mass-produced'],
    'technology': ['analog', 'manual', 'traditional'],
    'digital': ['analog', 'physical', 'tangible'],
    'ai': ['human', 'manual', 'organic'],
    
    // Abstract Concepts
    'presence': ['absence', 'void', 'emptiness'],
    'absence': ['presence', 'fullness', 'abundance'],
    'abundance': ['scarcity', 'poverty', 'lack'],
    'scarcity': ['abundance', 'plenty', 'excess'],
    'order': ['chaos', 'disorder', 'randomness'],
    'chaos': ['order', 'structure', 'harmony'],
    'harmony': ['discord', 'chaos', 'clashing'],
    'discord': ['harmony', 'unity', 'balance'],
    'unity': ['division', 'fragmentation', 'discord'],
    'fragmentation': ['unity', 'integration', 'wholeness'],
    'clarity': ['ambiguity', 'confusion', 'obscurity'],
    'ambiguity': ['clarity', 'precision', 'certainty'],
    'precision': ['vagueness', 'imprecision', 'chaos'],
    'vagueness': ['precision', 'clarity', 'specificity'],
    'balance': ['imbalance', 'asymmetry', 'discord'],
    'imbalance': ['balance', 'symmetry', 'harmony'],
    'stability': ['instability', 'chaos', 'turbulence'],
    'instability': ['stability', 'order', 'calm'],
    
    // Philosophical
    'perfection': ['flaw', 'imperfection', 'defect'],
    'imperfection': ['perfection', 'flawlessness', 'excellence'],
    'excellence': ['mediocrity', 'inferiority', 'poorness'],
    'mediocrity': ['excellence', 'superiority', 'mastery'],
    'mastery': ['amateurism', 'novice', 'ineptitude'],
    'amateurism': ['mastery', 'expertise', 'professionalism'],
    'timelessness': ['ephemeral', 'transient', 'fleeting'],
    'ephemeral': ['timelessness', 'permanent', 'enduring'],
    'permanence': ['transience', 'temporary', 'fleeting'],
    'transience': ['permanence', 'enduring', 'lasting'],
    
    // Design Technique
    'rendering': ['photography', 'hand-drawn', 'illustration'],
    'photography': ['rendering', 'illustration', 'digital'],
    'illustration': ['photography', 'realistic', 'literal'],
    'digital': ['analog', 'manual', 'physical'],
    'analog': ['digital', 'automated', 'synthetic'],
    'hand-drawn': ['digital', 'automated', 'mechanical'],
    
    // Content & Context
    'abstract': ['concrete', 'literal', 'representational'],
    'concrete': ['abstract', 'theoretical', 'conceptual'],
    'literal': ['abstract', 'metaphorical', 'symbolic'],
    'representational': ['abstract', 'non-representational', 'conceptual'],
    'realistic': ['abstract', 'stylized', 'impressionistic'],
    'stylized': ['realistic', 'naturalistic', 'literal'],
    
    // Additional common concepts
    'neutral': ['biased', 'extreme', 'polarized'],
    'modularity': ['monolithic', 'unified', 'integrated'],
    'customization': ['standardization', 'uniformity', 'generic'],
    'uniqueness': ['conformity', 'homogeneity', 'standard'],
    'interpretation': ['fact', 'dogma', 'literalism'],
    'roughness': ['smoothness', 'polished', 'slick'],
    'intangible': ['tangible', 'concrete', 'physical'],
    'techno-futurism': ['retro', 'steampunk', 'vintage'],
    'payments': ['barter', 'donation', 'free'],
    'interior': ['exterior', 'landscape', 'urban'],
    'classicism': ['modernism', 'avant-garde', 'experimentation'],
    'interference': ['clarity', 'harmony', 'coherence'],
    'bokeh': ['sharpness', 'clarity', 'focus'],
  };
  
  // Direct lookup
  if (oppositeMap[lower]) {
    return oppositeMap[lower];
  }
  
  // Pattern matching for common suffixes/prefixes
  if (lower.endsWith('ness')) {
    const base = lower.slice(0, -4);
    if (oppositeMap[base]) {
      return oppositeMap[base];
    }
  }
  
  if (lower.endsWith('ity')) {
    const base = lower.slice(0, -3);
    if (oppositeMap[base]) {
      return oppositeMap[base];
    }
  }
  
  if (lower.endsWith('ism')) {
    const base = lower.slice(0, -3);
    if (oppositeMap[base]) {
      return oppositeMap[base];
    }
  }
  
  // Try to find semantic opposites based on common patterns
  const semanticOpposites: string[] = [];
  
  // Common semantic patterns
  if (lower.includes('max')) semanticOpposites.push('minimal', 'sparse', 'simple');
  if (lower.includes('min')) semanticOpposites.push('maximal', 'dense', 'complex');
  if (lower.includes('high')) semanticOpposites.push('low', 'minimal', 'subtle');
  if (lower.includes('low')) semanticOpposites.push('high', 'elevated', 'prominent');
  if (lower.includes('full')) semanticOpposites.push('empty', 'sparse', 'minimal');
  if (lower.includes('empty')) semanticOpposites.push('full', 'abundant', 'dense');
  if (lower.includes('open')) semanticOpposites.push('closed', 'confined', 'restricted');
  if (lower.includes('closed')) semanticOpposites.push('open', 'accessible', 'free');
  if (lower.includes('fast')) semanticOpposites.push('slow', 'static', 'still');
  if (lower.includes('slow')) semanticOpposites.push('fast', 'dynamic', 'rapid');
  
  if (semanticOpposites.length > 0) {
    return semanticOpposites;
  }
  
  // Default: return empty array if no opposites found
  return [];
}

async function main() {
  console.log('📚 Loading concepts missing opposites from database...\n');
  
  // Load all concepts
  const allConcepts = await prisma.concept.findMany({
    select: { id: true, label: true, opposites: true },
    orderBy: { label: 'asc' }
  });
  
  // Filter concepts that don't have opposites
  const concepts = allConcepts.filter(c => {
    const opp = c.opposites as any;
    return opp === null || !Array.isArray(opp) || opp.length === 0;
  });
  
  const totalConcepts = allConcepts.length;
  const withOpposites = allConcepts.filter(c => {
    const opp = c.opposites as any;
    return opp !== null && Array.isArray(opp) && opp.length > 0;
  }).length;
  
  console.log(`📊 Database status:`);
  console.log(`   Total concepts: ${totalConcepts}`);
  console.log(`   With opposites: ${withOpposites} (${((withOpposites/totalConcepts)*100).toFixed(1)}%)`);
  console.log(`   Missing opposites: ${concepts.length} (${((concepts.length/totalConcepts)*100).toFixed(1)}%)\n`);
  
  if (concepts.length === 0) {
    console.log('✅ All concepts already have opposites! Nothing to do.\n');
    await prisma.$disconnect();
    return;
  }
  
  console.log(`🔍 Generating opposites for ${concepts.length} concepts using semantic knowledge...\n`);
  
  let successCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    console.log(`  [${i + 1}/${concepts.length}] Processing "${concept.label}" (${concept.id})...`);
    
    const opposites = generateOppositesForConcept(concept.label);
    
    if (opposites.length === 0) {
      console.log(`    ⚠️  No opposites found for "${concept.label}"`);
      skippedCount++;
      continue;
    }
    
    console.log(`    ✅ Generated ${opposites.length} opposites: ${opposites.join(', ')}`);
    
    try {
      // Update concept-opposites.ts and database
      await updateConceptOpposites(concept.id, opposites);
      successCount++;
    } catch (error: any) {
      console.error(`    ❌ Error updating "${concept.label}": ${error.message}`);
      skippedCount++;
    }
  }
  
  console.log('\n✅ Completed processing all concepts!\n');
  console.log(`📊 Summary:`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Skipped (no opposites found): ${skippedCount}`);
  console.log(`   Total processed: ${concepts.length}\n`);
  
  // Final stats
  const finalConcepts = await prisma.concept.findMany({
    select: { opposites: true }
  });
  const finalWithOpposites = finalConcepts.filter(c => {
    const opp = c.opposites as any;
    return opp !== null && Array.isArray(opp) && opp.length > 0;
  }).length;
  
  console.log(`📊 Final status:`);
  console.log(`   Concepts with opposites: ${finalWithOpposites}/${totalConcepts} (${((finalWithOpposites/totalConcepts)*100).toFixed(1)}%)\n`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});

