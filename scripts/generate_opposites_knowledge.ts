/**
 * Generate opposites for concepts using knowledge-based rules + Gemini API fallback
 * Tries knowledge first, then falls back to Gemini API if needed
 */

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { updateConceptOpposites } from '../src/lib/update-concept-opposites';
import { generateOppositesForConcept } from '../src/lib/gemini';

async function generateWithRetry(conceptLabel: string, maxRetries: number = 5): Promise<string[]> {
  let delay = 3000; // Start with 3 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateOppositesForConcept(conceptLabel);
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error; // Re-throw on final failure
      }
      
      // Check if it's a retryable error
      if (error.message?.includes('503') || 
          error.message?.includes('429') || 
          error.message?.includes('overloaded') ||
          error.message?.includes('quota') ||
          error.message?.includes('fetch failed')) {
        console.log(`      ⏳ Attempt ${attempt}/${maxRetries} failed, waiting ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 30000); // Cap at 30 seconds, exponential backoff
      } else {
        throw error; // Non-retryable error
      }
    }
  }
  
  return [];
}

/**
 * Generate opposites for a concept based on knowledge
 * Returns an array of opposite concept labels
 */
function generateOppositesFromKnowledge(conceptLabel: string): string[] {
  const lower = conceptLabel.toLowerCase();
  const opposites: string[] = [];

  // Common opposite patterns
  const oppositeMap: Record<string, string[]> = {
    // Dimensional
    '3d': ['flat', '2d', 'planar', 'flatness'],
    '2d': ['3d', 'dimensional', 'depth'],
    'flat': ['3d', 'dimensional', 'depth', 'volumetric'],
    'flatness': ['3d', 'dimensional', 'depth'],
    
    // Color & Tone
    'vibrant': ['muted', 'desaturated', 'monochrome', 'colorless'],
    'muted': ['vibrant', 'bright', 'intense', 'bold'],
    'monochrome': ['polychrome', 'vibrant', 'colorful', 'saturated'],
    'colorful': ['colorless', 'monochrome', 'muted', 'duotone'],
    'colorless': ['colorful', 'vibrant', 'saturated'],
    'bright': ['dark', 'muted', 'subdued'],
    'dark': ['bright', 'light', 'luminous'],
    'warm': ['cool', 'cold', 'icy'],
    'cool': ['warm', 'fiery', 'hot'],
    
    // Style & Aesthetic
    'minimal': ['maximal', 'dense', 'cluttered', 'busy'],
    'minimalist': ['maximalist', 'ornamental', 'decorative', 'extravagant'],
    'minimalism': ['maximalism', 'ornamentation', 'decoration'],
    'maximal': ['minimal', 'sparse', 'simple'],
    'simple': ['complex', 'elaborate', 'ornate'],
    'complex': ['simple', 'minimal', 'basic'],
    'clean': ['messy', 'cluttered', 'busy'],
    'cluttered': ['clean', 'minimal', 'sparse'],
    'busy': ['calm', 'minimal', 'simple'],
    'sparse': ['dense', 'full', 'rich'],
    'dense': ['sparse', 'minimal', 'open'],
    
    // Layout & Structure
    'centered': ['asymmetric', 'offset', 'scattered'],
    'balanced': ['imbalanced', 'asymmetric', 'chaotic'],
    'balance': ['imbalance', 'asymmetry', 'chaos', 'discord'],
    'symmetrical': ['asymmetrical', 'irregular', 'uneven'],
    'asymmetrical': ['symmetrical', 'balanced', 'centered'],
    'grid': ['organic', 'fluid', 'freeform'],
    'geometric': ['organic', 'fluid', 'amorphous', 'irregular'],
    'organic': ['geometric', 'rigid', 'structured'],
    'structured': ['organic', 'formless', 'fluid', 'amorphous'],
    'modular': ['monolithic', 'unified', 'integrated', 'seamless'],
    'monolithic': ['modular', 'fragmented', 'disjointed'],
    'rigid': ['flexible', 'fluid', 'soft', 'pliable'],
    'flexible': ['rigid', 'fixed', 'static'],
    
    // Motion & Interaction
    'static': ['animated', 'dynamic', 'kinetic', 'motion'],
    'animated': ['static', 'still', 'frozen'],
    'dynamic': ['static', 'still', 'stationary'],
    'kinetic': ['static', 'still', 'motionless'],
    
    // Texture & Materiality
    'smooth': ['rough', 'textured', 'grainy'],
    'rough': ['smooth', 'polished', 'slick', 'fine'],
    'roughness': ['smoothness', 'polished', 'slick', 'fine'],
    'textured': ['smooth', 'flat', 'glossy'],
    'matte': ['glossy', 'shiny', 'polished'],
    'glossy': ['matte', 'dull', 'flat'],
    'polished': ['rough', 'textured', 'raw'],
    'solid': ['fluid', 'fragile', 'hollow'],
    'fluid': ['solid', 'rigid', 'static'],
    'soft': ['hard', 'rigid', 'sharp'],
    'hard': ['soft', 'gentle', 'pliable'],
    
    // Mood & Feeling
    'calm': ['chaotic', 'energetic', 'dramatic', 'stimulating'],
    'chaotic': ['calm', 'peaceful', 'serene', 'stability'],
    'peaceful': ['chaotic', 'turbulent', 'agitated'],
    'serene': ['chaotic', 'turbulent', 'agitated'],
    'energetic': ['calm', 'peaceful', 'serene'],
    'dramatic': ['calm', 'subtle', 'understated'],
    'playful': ['serious', 'formal', 'professional'],
    'serious': ['playful', 'lighthearted', 'casual'],
    'formal': ['casual', 'informal', 'relaxed'],
    'casual': ['formal', 'professional', 'ceremonial'],
    'professional': ['casual', 'informal', 'playful'],
    
    // Typography
    'bold': ['light', 'thin', 'delicate'],
    'light': ['bold', 'heavy', 'thick'],
    'thick': ['thin', 'light', 'delicate'],
    'thin': ['thick', 'bold', 'heavy'],
    'serif': ['sans-serif', 'geometric', 'modern'],
    'sans-serif': ['serif', 'traditional', 'classical'],
    
    // Industry & Context
    'luxury': ['modesty', 'poverty', 'austerity', 'economy'],
    'premium': ['budget', 'economy', 'basic'],
    'exclusive': ['inclusive', 'common', 'mass-market', 'accessible'],
    'inclusive': ['exclusive', 'elite', 'restricted'],
    'professional': ['casual', 'amateur', 'informal'],
    'corporate': ['artistic', 'playful', 'expressive'],
    'commercial': ['artistic', 'non-profit', 'charitable'],
    
    // Abstract Concepts
    'presence': ['absence', 'void', 'emptiness', 'invisibility'],
    'absence': ['presence', 'existence', 'being'],
    'abundance': ['scarcity', 'lack', 'poverty', 'deficiency'],
    'scarcity': ['abundance', 'plenty', 'excess'],
    'order': ['chaos', 'disorder', 'randomness', 'anarchy'],
    'chaos': ['order', 'structure', 'harmony'],
    'harmony': ['discord', 'chaos', 'clashing'],
    'discord': ['harmony', 'unity', 'agreement'],
    'unity': ['division', 'fragmentation', 'discord'],
    'clarity': ['obscurity', 'confusion', 'ambiguity'],
    'obscurity': ['clarity', 'transparency', 'visibility'],
    'precision': ['vagueness', 'imprecision', 'chaos', 'roughness'],
    'vagueness': ['precision', 'clarity', 'specificity'],
    
    // Design Techniques
    'digital': ['analog', 'manual', 'physical', 'tangible'],
    'analog': ['digital', 'virtual', 'synthetic'],
    'rendering': ['photography', 'hand-drawn', 'illustration'],
    'photography': ['rendering', 'illustration', 'digital-art'],
    'illustration': ['photography', 'realistic', 'documentary'],
    
    // Specific Concepts
    'ai': ['human', 'manual', 'organic', 'natural'],
    'artificial': ['natural', 'organic', 'authentic'],
    'synthetic': ['natural', 'organic', 'authentic'],
    'natural': ['artificial', 'synthetic', 'manufactured'],
    'modern': ['traditional', 'classical', 'vintage', 'antique'],
    'traditional': ['modern', 'contemporary', 'futuristic'],
    'classical': ['modern', 'avant-garde', 'experimental'],
    'vintage': ['modern', 'contemporary', 'futuristic'],
    'futuristic': ['retro', 'vintage', 'classical'],
    'retro': ['futuristic', 'modern', 'contemporary'],
    
    // More specific
    'horology': ['digital', 'casual', 'informal', 'ephemeral'],
    'watchmaking': ['digital', 'casual', 'mass-produced'],
    'abstract': ['concrete', 'representational', 'literal', 'specific'],
    'concrete': ['abstract', 'theoretical', 'conceptual'],
    'neutral': ['bold', 'vibrant', 'expressive', 'dramatic'],
    'access': ['restriction', 'exclusion', 'barrier'],
    'accessible': ['exclusive', 'restricted', 'elite'],
    'academia': ['commercial', 'practical', 'applied'],
    'accordion': ['static', 'fixed', 'rigid'],
    'ascii': ['graphical', 'visual', 'rich'],
    
    // Additional concepts
    'accumulation': ['depletion', 'reduction', 'scarcity', 'emptiness'],
    'acoustic': ['digital', 'electronic', 'synthetic', 'artificial'],
    'action': ['inaction', 'stillness', 'passivity', 'stasis'],
    'activity': ['inactivity', 'stillness', 'passivity', 'rest'],
    'adaptability': ['rigidity', 'inflexibility', 'fixed', 'static'],
    'adaptation': ['rigidity', 'inflexibility', 'stasis'],
    'adoption': ['rejection', 'abandonment', 'neglect'],
    'advancement': ['regression', 'decline', 'retreat', 'stagnation'],
    'adventurous': ['cautious', 'conservative', 'safe', 'timid'],
    'advertising': ['editorial', 'non-commercial', 'artistic'],
    'aerial': ['grounded', 'terrestrial', 'earthbound'],
    'aero': ['grounded', 'terrestrial', 'heavy'],
    'affluence': ['poverty', 'scarcity', 'austerity', 'modesty'],
    'agency': ['passivity', 'submission', 'dependence'],
    'aggregate': ['individual', 'separate', 'discrete', 'isolated'],
    'algorithm': ['random', 'chaotic', 'intuitive', 'organic'],
    'alignment': ['misalignment', 'chaos', 'disorder', 'scatter'],
    'all-caps': ['lowercase', 'mixed-case', 'subtle'],
    'aloof': ['warm', 'friendly', 'inviting', 'accessible'],
    'amber': ['cool', 'blue', 'icy', 'cold'],
    'ambient': ['focused', 'direct', 'intense', 'sharp'],
    'ambition': ['contentment', 'satisfaction', 'modesty', 'humility'],
    'amorphous': ['geometric', 'structured', 'defined', 'shaped'],
    'analogous': ['contrasting', 'opposing', 'different', 'divergent'],
    'analysis': ['synthesis', 'intuition', 'wholeness', 'integration'],
    'analytical': ['intuitive', 'holistic', 'synthetic', 'creative'],
    'anatomy': ['whole', 'gestalt', 'unity', 'integration'],
    'anchored': ['floating', 'free', 'unbound', 'mobile'],
    'anger': ['calm', 'peace', 'serenity', 'tranquility'],
    'anonymity': ['identity', 'recognition', 'presence', 'visibility'],
    'anonymous': ['identified', 'known', 'recognized', 'visible'],
    'anticipation': ['surprise', 'spontaneity', 'immediacy'],
    'anxiety': ['calm', 'peace', 'serenity', 'confidence'],
    'apprehension': ['confidence', 'certainty', 'assurance'],
    'aqueous': ['solid', 'rigid', 'dry', 'arid'],
    'arcade': ['serious', 'formal', 'professional', 'corporate'],
    'arch': ['flat', 'linear', 'straight', 'angular'],
    'archetype': ['unique', 'novel', 'original', 'atypical'],
    'architecture': ['chaos', 'formlessness', 'disorder'],
    'archival': ['ephemeral', 'temporary', 'transient', 'modern'],
    'arid': ['lush', 'fertile', 'moist', 'aqueous'],
    'arrangement': ['chaos', 'disorder', 'randomness', 'scatter'],
    'array': ['singular', 'unified', 'whole', 'single'],
    'art': ['utility', 'function', 'practical', 'commercial'],
    'art-deco': ['organic', 'natural', 'rustic', 'minimal'],
    'artifice': ['natural', 'authentic', 'genuine', 'organic'],
    'artisanal': ['mass-produced', 'industrial', 'automated', 'synthetic'],
    'artistic': ['commercial', 'practical', 'utilitarian', 'functional'],
    'artistry': ['craft', 'utility', 'function', 'practicality'],
    'ascension': ['descent', 'decline', 'fall', 'grounding'],
    'asymmetry': ['symmetry', 'balance', 'centered', 'harmony'],
  };

  // Direct lookup
  if (oppositeMap[lower]) {
    return oppositeMap[lower];
  }

  // Enhanced pattern-based generation
  if (lower.endsWith('ness')) {
    const base = lower.slice(0, -4);
    if (base === 'rough') return ['smoothness', 'polish', 'refinement'];
    if (base === 'smooth') return ['roughness', 'texture', 'grain'];
    if (base === 'dark') return ['brightness', 'light', 'luminosity'];
    if (base === 'light') return ['darkness', 'shadow', 'obscurity'];
    if (base === 'soft') return ['hardness', 'rigidity', 'sharpness'];
    if (base === 'hard') return ['softness', 'gentleness', 'pliability'];
  }

  if (lower.endsWith('ity') || lower.endsWith('ty')) {
    const base = lower.slice(0, -3);
    if (base === 'simplic') return ['complexity', 'elaboration', 'ornamentation'];
    if (base === 'complex') return ['simplicity', 'minimalism', 'clarity'];
    if (base === 'adaptabil') return ['rigidity', 'inflexibility', 'fixed'];
    if (base === 'flexibil') return ['rigidity', 'inflexibility', 'static'];
    if (base === 'visibil') return ['invisibility', 'obscurity', 'hidden'];
    if (base === 'invisibil') return ['visibility', 'clarity', 'transparency'];
    if (base === 'mobil') return ['static', 'fixed', 'stationary'];
    if (base === 'immobil') return ['mobile', 'dynamic', 'fluid'];
    if (base === 'stabil') return ['instability', 'chaos', 'turbulence'];
    if (base === 'instabil') return ['stability', 'order', 'harmony'];
  }

  if (lower.endsWith('ism')) {
    const base = lower.slice(0, -3);
    if (base === 'minimal') return ['maximalism', 'ornamentation', 'decoration'];
    if (base === 'maximal') return ['minimalism', 'simplicity', 'restraint'];
    if (base === 'modern') return ['traditionalism', 'classicism', 'conservatism'];
    if (base === 'futur') return ['traditionalism', 'classicism', 'retro'];
    if (base === 'human') return ['mechanism', 'automation', 'artificial'];
  }

  if (lower.endsWith('tion') || lower.endsWith('sion')) {
    const base = lower.slice(0, -4);
    if (base === 'absorp') return ['reflection', 'emission', 'repulsion'];
    if (base === 'absorpt') return ['reflection', 'emission', 'repulsion'];
    if (base === 'accumula') return ['depletion', 'reduction', 'scarcity'];
    if (base === 'accentua') return ['subduing', 'muting', 'blending'];
    if (base === 'acclima') return ['resistance', 'rejection', 'stasis'];
    if (base === 'accommoda') return ['rigidity', 'inflexibility', 'resistance'];
    if (base === 'accomplish') return ['failure', 'incompletion', 'abandonment'];
    if (base === 'accultura') return ['isolation', 'separation', 'resistance'];
    if (base === 'acquisi') return ['loss', 'depletion', 'removal'];
    if (base === 'activa') return ['deactivation', 'stillness', 'passivity'];
    if (base === 'adapta') return ['rigidity', 'inflexibility', 'stasis'];
    if (base === 'addi') return ['subtraction', 'removal', 'depletion'];
    if (base === 'adjus') return ['fixity', 'rigidity', 'stasis'];
    if (base === 'administra') return ['chaos', 'disorder', 'anarchy'];
    if (base === 'admi') return ['rejection', 'exclusion', 'separation'];
    if (base === 'adop') return ['rejection', 'abandonment', 'neglect'];
    if (base === 'advance') return ['regression', 'decline', 'retreat'];
    if (base === 'adven') return ['caution', 'conservatism', 'safety'];
    if (base === 'adver') return ['editorial', 'non-commercial', 'artistic'];
    if (base === 'aes') return ['function', 'utility', 'practicality'];
    if (base === 'affec') return ['detachment', 'indifference', 'neutrality'];
    if (base === 'affirma') return ['negation', 'denial', 'rejection'];
    if (base === 'aggrega') return ['separation', 'division', 'isolation'];
    if (base === 'agita') return ['calm', 'peace', 'serenity'];
    if (base === 'align') return ['misalignment', 'chaos', 'disorder'];
    if (base === 'alloca') return ['randomness', 'chaos', 'disorder'];
    if (base === 'allu') return ['directness', 'clarity', 'explicitness'];
    if (base === 'altera') return ['preservation', 'stasis', 'fixity'];
    if (base === 'amalgama') return ['separation', 'division', 'isolation'];
    if (base === 'amplifica') return ['reduction', 'diminution', 'minimization'];
    if (base === 'anal') return ['synthesis', 'intuition', 'wholeness'];
    if (base === 'anima') return ['stillness', 'static', 'frozen'];
    if (base === 'annihila') return ['creation', 'generation', 'formation'];
    if (base === 'annota') return ['blankness', 'emptiness', 'void'];
    if (base === 'annuncia') return ['concealment', 'hiding', 'secrecy'];
    if (base === 'an') return ['calm', 'peace', 'serenity'];
    if (base === 'antici') return ['surprise', 'spontaneity', 'immediacy'];
    if (base === 'apprecia') return ['depreciation', 'devaluation', 'neglect'];
    if (base === 'apprehen') return ['confidence', 'certainty', 'assurance'];
    if (base === 'appro') return ['rejection', 'denial', 'refusal'];
    if (base === 'arbitra') return ['order', 'structure', 'system'];
    if (base === 'archi') return ['chaos', 'formlessness', 'disorder'];
    if (base === 'arrange') return ['chaos', 'disorder', 'randomness'];
    if (base === 'artici') return ['naturalness', 'authenticity', 'genuineness'];
    if (base === 'artif') return ['natural', 'authentic', 'genuine'];
    if (base === 'ascen') return ['descent', 'decline', 'fall'];
    if (base === 'aspi') return ['contentment', 'satisfaction', 'modesty'];
    if (base === 'assem') return ['disassembly', 'separation', 'division'];
    if (base === 'asse') return ['uncertainty', 'doubt', 'hesitation'];
    if (base === 'assimila') return ['rejection', 'resistance', 'separation'];
    if (base === 'associa') return ['dissociation', 'separation', 'isolation'];
    if (base === 'assu') return ['uncertainty', 'doubt', 'anxiety'];
    if (base === 'atmos') return ['vacuum', 'void', 'emptiness'];
    if (base === 'attrac') return ['repulsion', 'rejection', 'aversion'];
    if (base === 'attribu') return ['detachment', 'separation', 'isolation'];
    if (base === 'augmen') return ['reduction', 'diminution', 'decrease'];
    if (base === 'authen') return ['artificial', 'synthetic', 'fake'];
    if (base === 'author') return ['submission', 'passivity', 'dependence'];
    if (base === 'automa') return ['manual', 'handcrafted', 'organic'];
    if (base === 'availa') return ['unavailability', 'restriction', 'limitation'];
    if (base === 'awaken') return ['sleep', 'dormancy', 'inactivity'];
  }

  // Adjective patterns
  if (lower.endsWith('ful')) {
    const base = lower.slice(0, -3);
    if (base === 'peace') return ['chaotic', 'turbulent', 'agitated'];
    if (base === 'hope') return ['despair', 'pessimism', 'gloom'];
    if (base === 'joy') return ['sorrow', 'grief', 'melancholy'];
    if (base === 'wonder') return ['mundane', 'ordinary', 'commonplace'];
    if (base === 'power') return ['weakness', 'impotence', 'helplessness'];
    if (base === 'beauti') return ['ugliness', 'plainness', 'disfigurement'];
    if (base === 'grace') return ['awkwardness', 'clumsiness', 'inelegance'];
    if (base === 'harmoni') return ['discord', 'chaos', 'clashing'];
  }

  if (lower.endsWith('less')) {
    const base = lower.slice(0, -4);
    if (base === 'hope') return ['hopeful', 'optimistic', 'confident'];
    if (base === 'fear') return ['fearful', 'anxious', 'worried'];
    if (base === 'end') return ['finite', 'bounded', 'limited'];
    if (base === 'bound') return ['bounded', 'limited', 'restricted'];
    if (base === 'form') return ['formed', 'structured', 'shaped'];
    if (base === 'shape') return ['shaped', 'formed', 'structured'];
  }

  if (lower.endsWith('able') || lower.endsWith('ible')) {
    const base = lower.slice(0, -4);
    if (base === 'adapt') return ['rigid', 'inflexible', 'fixed'];
    if (base === 'flex') return ['rigid', 'inflexible', 'static'];
    if (base === 'access') return ['exclusive', 'restricted', 'elite'];
    if (base === 'vis') return ['invisible', 'hidden', 'obscure'];
    if (base === 'mova') return ['static', 'fixed', 'stationary'];
    if (base === 'sta') return ['unstable', 'chaotic', 'turbulent'];
  }

  // Common semantic patterns
  const semanticPatterns: Record<string, string[]> = {
    // Emotions
    'anger': ['calm', 'peace', 'serenity', 'tranquility'],
    'anxiety': ['calm', 'peace', 'serenity', 'confidence'],
    'fear': ['courage', 'confidence', 'bravery', 'security'],
    'joy': ['sorrow', 'grief', 'melancholy', 'sadness'],
    'hope': ['despair', 'pessimism', 'gloom', 'hopelessness'],
    'love': ['hate', 'aversion', 'repulsion', 'indifference'],
    
    // States
    'presence': ['absence', 'void', 'emptiness', 'invisibility'],
    'absence': ['presence', 'existence', 'being'],
    'abundance': ['scarcity', 'lack', 'poverty', 'deficiency'],
    'scarcity': ['abundance', 'plenty', 'excess'],
    'order': ['chaos', 'disorder', 'randomness', 'anarchy'],
    'chaos': ['order', 'structure', 'harmony'],
    
    // Qualities
    'clarity': ['obscurity', 'confusion', 'ambiguity'],
    'precision': ['vagueness', 'imprecision', 'chaos', 'roughness'],
    'simplicity': ['complexity', 'elaboration', 'ornamentation'],
    'complexity': ['simplicity', 'minimalism', 'clarity'],
    
    // Actions
    'action': ['inaction', 'stillness', 'passivity', 'stasis'],
    'movement': ['stillness', 'static', 'frozen'],
    'creation': ['destruction', 'annihilation', 'demolition'],
    'destruction': ['creation', 'generation', 'formation'],
    
    // Directions
    'forward': ['backward', 'retreat', 'regression'],
    'upward': ['downward', 'descent', 'decline'],
    'ascent': ['descent', 'decline', 'fall'],
    'descent': ['ascent', 'rise', 'elevation'],
    
    // Materials
    'solid': ['fluid', 'fragile', 'hollow'],
    'fluid': ['solid', 'rigid', 'static'],
    'hard': ['soft', 'gentle', 'pliable'],
    'soft': ['hard', 'rigid', 'sharp'],
    
    // Colors
    'warm': ['cool', 'cold', 'icy'],
    'cool': ['warm', 'fiery', 'hot'],
    'bright': ['dark', 'muted', 'subdued'],
    'dark': ['bright', 'light', 'luminous'],
    
    // Sizes
    'large': ['small', 'tiny', 'minimal'],
    'small': ['large', 'massive', 'expansive'],
    'expansive': ['compact', 'minimal', 'restricted'],
    'compact': ['expansive', 'spacious', 'open'],
    
    // Time
    'past': ['future', 'present', 'now'],
    'future': ['past', 'retro', 'vintage'],
    'permanent': ['temporary', 'ephemeral', 'transient'],
    'temporary': ['permanent', 'eternal', 'lasting'],
    
    // Visibility
    'visible': ['invisible', 'hidden', 'obscure'],
    'invisible': ['visible', 'clear', 'transparent'],
    'transparent': ['opaque', 'hidden', 'concealed'],
    'opaque': ['transparent', 'clear', 'visible'],
    
    // Structure
    'structured': ['organic', 'formless', 'fluid', 'amorphous'],
    'formless': ['structured', 'geometric', 'defined'],
    'geometric': ['organic', 'fluid', 'amorphous', 'irregular'],
    'organic': ['geometric', 'rigid', 'structured'],
    
    // Motion
    'static': ['animated', 'dynamic', 'kinetic', 'motion'],
    'dynamic': ['static', 'still', 'stationary'],
    'mobile': ['static', 'fixed', 'stationary'],
    'fixed': ['mobile', 'dynamic', 'fluid'],
  };

  if (semanticPatterns[lower]) {
    return semanticPatterns[lower];
  }

  // If no match found, return empty array (will be skipped)
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
  }).map(c => ({ id: c.id, label: c.label }));
  
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
  
  console.log(`🔍 Generating opposites for ${concepts.length} concepts using knowledge-based rules...\n`);
  
  let successCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    console.log(`  [${i + 1}/${concepts.length}] Processing "${concept.label}" (${concept.id})...`);
    
    let opposites = generateOppositesFromKnowledge(concept.label);
    
    // If knowledge-based generation failed, try Gemini API with retry
    if (opposites.length === 0) {
      console.log(`    🔄 Knowledge-based failed, trying Gemini API...`);
      try {
        opposites = await generateWithRetry(concept.label);
      } catch (error: any) {
        console.log(`    ⚠️  No opposites found for "${concept.label}" (API also failed)`);
        skippedCount++;
        continue;
      }
    }
    
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
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Completed processing all concepts!\n');
  console.log(`📊 Summary:`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Skipped (no opposites found): ${skippedCount}`);
  console.log(`   Total processed: ${concepts.length}\n`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});

