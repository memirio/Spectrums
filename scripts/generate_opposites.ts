/**
 * Generate comprehensive opposites mapping for labels and synonyms
 * 
 * This script reads seed_concepts.json and generates a conservative opposites mapping
 * that includes opposites for both labels and their synonyms.
 */

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';

// Conservative opposite pairs - direct opposites only
// These are term-level opposites (labels + synonyms), not just concept IDs
const OPPOSITE_PAIRS: Array<[string, string]> = [
  // Dimensional
  ['3d', '2d'],
  ['3d', 'flat'],
  ['flat', '3d'],
  ['2d', '3d'],
  ['three-dimensional', '2d'],
  ['flat-design', '3d'],
  
  // Color/Tone
  ['colorful', 'colorless'],
  ['colorless', 'colorful'],
  ['vibrant', 'muted'],
  ['muted', 'vibrant'],
  ['bright', 'dark'],
  ['dark', 'bright'],
  ['light', 'dark'],
  ['high-saturation', 'low-saturation'],
  ['low-saturation', 'high-saturation'],
  ['warm', 'cool'],
  ['cool', 'warm'],
  
  // Style/Aesthetic
  ['minimalistic', 'maximalist'],
  ['maximalist', 'minimalistic'],
  ['modern', 'retro'],
  ['retro', 'modern'],
  ['futuristic', 'retro'],
  ['vintage', 'modern'],
  ['traditional', 'modern'],
  ['new', 'old'],
  ['old', 'new'],
  ['geometric', 'organic'],
  ['organic', 'geometric'],
  ['illustration-led', 'photography-led'],
  ['photography-led', 'illustration-led'],
  
  // Mood/Personality
  ['playful', 'strict'],
  ['strict', 'playful'],
  ['happy', 'sad'],
  ['sad', 'happy'],
  ['fun', 'boring'],
  ['boring', 'fun'],
  ['cheerful', 'sad'],
  ['sad', 'cheerful'],
  ['joyful', 'sad'],
  ['sad', 'joyful'],
  ['merry', 'sad'],
  ['sad', 'merry'],
  ['upbeat', 'downbeat'],
  ['downbeat', 'upbeat'],
  ['lighthearted', 'serious'],
  ['serious', 'lighthearted'],
  ['bubbly', 'somber'],
  ['somber', 'bubbly'],
  ['bold', 'understated'],
  ['understated', 'bold'],
  ['calm', 'energetic'],
  ['energetic', 'calm'],
  ['serene', 'energetic'],
  ['gentle', 'powerful'],
  ['powerful', 'gentle'],
  
  // Layout
  ['spacious', 'dense'],
  ['dense', 'spacious'],
  ['centered', 'asymmetrical'],
  ['asymmetrical', 'centered'],
  
  // Typography
  ['serif', 'sans-serif'],
  ['sans-serif', 'serif'],
  ['large-type', 'condensed'],
  ['condensed', 'large-type'],
  ['display', 'body-text'],
  ['body-text', 'display'],
  
  // Interaction
  ['static', 'animated'],
  ['animated', 'static'],
  ['static', 'dynamic'],
  ['dynamic', 'static'],
  ['responsive', 'fixed-width'],
  ['fixed-width', 'responsive'],
];

async function main() {
  console.log('📚 Loading concepts from seed_concepts.json...\n');
  
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  const seedContent = await fs.readFile(seedPath, 'utf-8');
  const concepts: Array<{ id: string; label: string; synonyms: string[] }> = JSON.parse(seedContent);
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`);
  
  // Build a map of concept ID -> concept
  const conceptMap = new Map<string, typeof concepts[0]>();
  for (const c of concepts) {
    conceptMap.set(c.id.toLowerCase(), c);
  }
  
  // Build a map of all terms (labels + synonyms) to their concept IDs
  const termToConceptIds = new Map<string, Set<string>>();
  for (const c of concepts) {
    const conceptId = c.id.toLowerCase();
    const label = c.label.toLowerCase();
    const synonyms = (c.synonyms || []).map(s => String(s).toLowerCase());
    
    // Add label
    if (!termToConceptIds.has(label)) {
      termToConceptIds.set(label, new Set());
    }
    termToConceptIds.get(label)!.add(conceptId);
    
    // Add synonyms
    for (const syn of synonyms) {
      if (!termToConceptIds.has(syn)) {
        termToConceptIds.set(syn, new Set());
      }
      termToConceptIds.get(syn)!.add(conceptId);
    }
  }
  
  // Build opposites mapping
  // This maps concept IDs to arrays of opposite concept IDs
  const opposites: Record<string, string[]> = {};
  
  // Also build a term-level opposites map (for checking synonyms)
  const termOpposites = new Map<string, Set<string>>();
  for (const [term1, term2] of OPPOSITE_PAIRS) {
    const term1Lower = term1.toLowerCase();
    const term2Lower = term2.toLowerCase();
    
    if (!termOpposites.has(term1Lower)) {
      termOpposites.set(term1Lower, new Set());
    }
    termOpposites.get(term1Lower)!.add(term2Lower);
    
    if (!termOpposites.has(term2Lower)) {
      termOpposites.set(term2Lower, new Set());
    }
    termOpposites.get(term2Lower)!.add(term1Lower);
  }
  
  console.log('🔍 Building opposites mapping...\n');
  
  // For each concept, find opposites based on its label and synonyms
  for (const c of concepts) {
    const conceptId = c.id.toLowerCase();
    const label = c.label.toLowerCase();
    const synonyms = (c.synonyms || []).map(s => String(s).toLowerCase());
    
    // Find opposites for this concept's label and synonyms
    const oppositeConceptIds = new Set<string>();
    
    // Check label
    const labelOpposites = termOpposites.get(label) || new Set();
    for (const oppTerm of labelOpposites) {
      // Find all concept IDs that match this opposite term
      const oppConceptIds = termToConceptIds.get(oppTerm) || new Set();
      for (const oppId of oppConceptIds) {
        oppositeConceptIds.add(oppId);
      }
    }
    
    // Check synonyms
    for (const syn of synonyms) {
      const synOpposites = termOpposites.get(syn) || new Set();
      for (const oppTerm of synOpposites) {
        // Find all concept IDs that match this opposite term
        const oppConceptIds = termToConceptIds.get(oppTerm) || new Set();
        for (const oppId of oppConceptIds) {
          oppositeConceptIds.add(oppId);
        }
      }
    }
    
    if (oppositeConceptIds.size > 0) {
      opposites[conceptId] = Array.from(oppositeConceptIds).sort();
    }
  }
  
  // Sort opposites for each concept
  for (const conceptId in opposites) {
    opposites[conceptId].sort();
  }
  
  // Generate the output file
  const outputLines: string[] = [
    '/**',
    ' * Conservative Concept Opposites Mapping',
    ' * ',
    ' * Defines opposites for concept labels AND their synonyms.',
    ' * When a query matches a concept, we check if any of its synonyms\' opposites',
    ' * are in the image tags, and apply a penalty.',
    ' * ',
    ' * CONSERVATIVE APPROACH: Only direct, literal opposites.',
    ' * For example: "playful" → "strict", "happy" → "sad", "fun" → "boring"',
    ' * ',
    ' * This mapping is used in:',
    ' * - Search ranking: Penalizes images with opposite tags',
    ' * - Site addition pipeline: Opposites are automatically detected during search',
    ' */',
    '',
    'export const CONCEPT_OPPOSITES: Record<string, string[]> = {',
  ];
  
  // Group by category for readability
  const conceptCategories = new Map<string, string[]>();
  for (const c of concepts) {
    const category = (c as any).category || 'Uncategorized';
    if (!conceptCategories.has(category)) {
      conceptCategories.set(category, []);
    }
    conceptCategories.get(category)!.push(c.id);
  }
  
  // Output opposites, grouped by concept
  const sortedConceptIds = Object.keys(opposites).sort();
  for (const conceptId of sortedConceptIds) {
    const opps = opposites[conceptId];
    if (opps.length === 0) continue;
    
    const concept = conceptMap.get(conceptId);
    const label = concept?.label || conceptId;
    
    outputLines.push(`  '${conceptId}': [${opps.map(o => `'${o}'`).join(', ')}], // ${label}`);
  }
  
  outputLines.push('} as const');
  outputLines.push('');
  outputLines.push('/**');
  outputLines.push(' * Check if two concepts are opposites');
  outputLines.push(' */');
  outputLines.push('export function areOpposites(conceptId1: string, conceptId2: string): boolean {');
  outputLines.push('  const opposites1 = CONCEPT_OPPOSITES[conceptId1.toLowerCase()] || []');
  outputLines.push('  const opposites2 = CONCEPT_OPPOSITES[conceptId2.toLowerCase()] || []');
  outputLines.push('  ');
  outputLines.push('  return opposites1.includes(conceptId2.toLowerCase()) || ');
  outputLines.push('         opposites2.includes(conceptId1.toLowerCase())');
  outputLines.push('}');
  outputLines.push('');
  outputLines.push('/**');
  outputLines.push(' * Check if any of the image\'s tags are opposites of the query concept');
  outputLines.push(' * This includes checking opposites of the concept\'s synonyms');
  outputLines.push(' */');
  outputLines.push('export function hasOppositeTags(queryConceptId: string, imageTagIds: string[]): boolean {');
  outputLines.push('  const queryId = queryConceptId.toLowerCase()');
  outputLines.push('  for (const tagId of imageTagIds) {');
  outputLines.push('    if (areOpposites(queryId, tagId.toLowerCase())) {');
  outputLines.push('      return true');
  outputLines.push('    }');
  outputLines.push('  }');
  outputLines.push('  return false');
  outputLines.push('}');
  
  const outputPath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts');
  await fs.writeFile(outputPath, outputLines.join('\n'), 'utf-8');
  
  console.log(`✅ Generated opposites mapping:`);
  console.log(`   ${sortedConceptIds.length} concepts with opposites`);
  console.log(`   Total opposite relationships: ${Object.values(opposites).reduce((sum, opps) => sum + opps.length, 0)}`);
  console.log(`\n📝 Output written to: ${outputPath}\n`);
  
  // Show some examples
  console.log('📋 Examples:');
  const examples = ['playful', 'happy', 'fun', '3d', 'colorful', 'bright'];
  for (const ex of examples) {
    const conceptId = ex.toLowerCase();
    const concept = conceptMap.get(conceptId);
    if (concept) {
      const opps = opposites[conceptId] || [];
      if (opps.length > 0) {
        const oppLabels = opps.map(oid => {
          const oppConcept = conceptMap.get(oid);
          return oppConcept?.label || oid;
        }).join(', ');
        console.log(`   ${concept.label}: ${oppLabels}`);
      }
    }
  }
  console.log('');
}

main().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});

