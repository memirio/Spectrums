/**
 * Utility to update concept-opposites.ts with new opposites from Gemini
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { prisma } from './prisma';

/**
 * Convert a concept label to concept ID (lowercase, hyphenated)
 */
function labelToConceptId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Cache for all concepts to avoid repeated queries
let allConceptsCache: Array<{ id: string; label: string }> | null = null;

/**
 * Get all concepts (cached)
 * Also checks seed file for concepts that might not be in DB yet
 */
async function getAllConcepts(): Promise<Array<{ id: string; label: string }>> {
  if (!allConceptsCache) {
    // Get from database
    const dbConcepts = await prisma.concept.findMany({
      select: { id: true, label: true }
    });
    
    // Also check seed file for concepts that might not be in DB yet
    const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
    try {
      const seedContent = await fs.readFile(seedPath, 'utf-8');
      const seedConcepts = JSON.parse(seedContent);
      const seedConceptMap = new Map<string, { id: string; label: string }>();
      
      // Add seed concepts that aren't in DB
      for (const sc of seedConcepts) {
        if (sc.id && sc.label) {
          seedConceptMap.set(sc.id, { id: sc.id, label: sc.label });
        }
      }
      
      // Merge: DB concepts take precedence, but add seed concepts that aren't in DB
      const allConcepts = [...dbConcepts];
      for (const [id, concept] of seedConceptMap) {
        if (!dbConcepts.find(c => c.id === id)) {
          allConcepts.push(concept);
        }
      }
      
      allConceptsCache = allConcepts;
    } catch (e) {
      // If seed file doesn't exist, just use DB concepts
      allConceptsCache = dbConcepts;
    }
  }
  return allConceptsCache;
}

/**
 * Clear the concepts cache (call after adding new concepts)
 */
export function clearConceptsCache(): void {
  allConceptsCache = null;
}

/**
 * Find concept ID for a given label (checks database and seed file)
 * Exported for use in other modules
 */
export async function findConceptIdForLabel(label: string): Promise<string | null> {
  const conceptId = labelToConceptId(label);
  
  // Check database by ID first
  const allConcepts = await getAllConcepts();
  const dbConceptById = allConcepts.find(c => c.id === conceptId);
  
  if (dbConceptById) {
    return conceptId;
  }
  
  // Check if label matches (case-insensitive)
  const dbConceptByLabel = allConcepts.find(c => 
    c.label.toLowerCase() === label.toLowerCase()
  );
  
  if (dbConceptByLabel) {
    return dbConceptByLabel.id;
  }
  
  // Check seed file
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  try {
    const seedContent = await fs.readFile(seedPath, 'utf-8');
    const seedConcepts = JSON.parse(seedContent);
    const seedConcept = seedConcepts.find((c: any) => 
      c.id === conceptId || 
      c.label.toLowerCase() === label.toLowerCase()
    );
    
    if (seedConcept) {
      return seedConcept.id;
    }
  } catch (e) {
    // Seed file doesn't exist or can't be read
  }
  
  return null;
}

/**
 * Update concept-opposites.ts with new opposites
 * Merges new opposites with existing ones
 * Accepts either concept IDs or labels (will normalize to IDs)
 */
export async function updateConceptOpposites(
  conceptId: string,
  oppositeLabelsOrIds: string[]
): Promise<void> {
  if (oppositeLabelsOrIds.length === 0) {
    return;
  }
  
  // Load existing opposites
  const oppositesPath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts');
  let existingOpposites: Record<string, string[]> = {};
  
  try {
    // Clear cache to force reload
    delete require.cache[require.resolve('./concept-opposites')];
    const { CONCEPT_OPPOSITES } = await import('./concept-opposites');
    existingOpposites = { ...CONCEPT_OPPOSITES };
  } catch (e) {
    // File doesn't exist or can't be imported, start fresh
    console.log('[updateConceptOpposites] Starting with empty opposites mapping');
  }
  
  // Convert opposite labels/IDs to concept IDs
  // They might already be IDs (from OpenAI) or labels (from Gemini)
  const oppositeIds: string[] = [];
  for (const labelOrId of oppositeLabelsOrIds) {
    // First check if it's already a valid concept ID (normalized format)
    const normalizedId = labelToConceptId(labelOrId);
    
    // Try to find the concept - it might already exist as an ID
    const oppId = await findConceptIdForLabel(labelOrId);
    if (oppId && oppId !== conceptId) {
      // Found existing concept
      oppositeIds.push(oppId);
    } else if (normalizedId !== conceptId && normalizedId.length > 0) {
      // Use normalized ID (might be a new concept that will be created)
      oppositeIds.push(normalizedId);
    }
  }
  
  if (oppositeIds.length === 0) {
    console.log(`[updateConceptOpposites] No valid opposites found for "${conceptId}"`);
    return;
  }
  
  // Merge with existing opposites
  const existing = existingOpposites[conceptId] || [];
  const merged = Array.from(new Set([...existing, ...oppositeIds])).sort();
  
  existingOpposites[conceptId] = merged;
  
  // Also add bidirectional relationships
  for (const oppId of oppositeIds) {
    if (!existingOpposites[oppId]) {
      existingOpposites[oppId] = [];
    }
    if (!existingOpposites[oppId].includes(conceptId)) {
      existingOpposites[oppId].push(conceptId);
      existingOpposites[oppId].sort();
    }
  }
  
  // Write updated file
  const outputLines: string[] = [
    '/**',
    ' * Comprehensive Concept Opposites Mapping',
    ' * ',
    ' * Generated from:',
    ' * - Manual opposite pairs (from generate_opposites.ts)',
    ' * - Semantic opposites (from embeddings with similarity < -0.1)',
    ' * - Gemini-generated opposites (from concept generation pipeline)',
    ' * ',
    ' * This mapping is used in:',
    ' * - Search ranking: Penalizes images with opposite tags',
    ' * - Tag validation: Filters false positives',
    ' */',
    '',
    'export const CONCEPT_OPPOSITES: Record<string, string[]> = {',
  ];
  
  // Get concept labels for comments (use cached concepts)
  const allConcepts = await getAllConcepts();
  const conceptLabelMap = new Map(allConcepts.map(c => [c.id, c.label]));
  
  const sortedIds = Object.keys(existingOpposites).sort();
  for (const id of sortedIds) {
    const opps = existingOpposites[id];
    if (opps.length === 0) continue;
    
    const label = conceptLabelMap.get(id) || id;
    outputLines.push(`  '${id}': [${opps.map(o => `'${o}'`).join(', ')}], // ${label}`);
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
  
  await fs.writeFile(oppositesPath, outputLines.join('\n'), 'utf-8');
  console.log(`[updateConceptOpposites] Updated concept-opposites.ts with opposites for "${conceptId}"`);
  
  // Also update the database Concept record with opposites
  try {
    await prisma.concept.update({
      where: { id: conceptId },
      data: { opposites: merged }
    });
    console.log(`[updateConceptOpposites] Updated database Concept record with opposites for "${conceptId}"`);
  } catch (error: any) {
    // Concept might not exist yet, that's okay
    console.log(`[updateConceptOpposites] Could not update database for "${conceptId}": ${error.message}`);
  }
}

/**
 * Fully sync concept-opposites.ts from seed_concepts.json
 * This ensures the TypeScript file is completely aligned with the JSON file
 * after opposites have been enriched
 */
export async function syncOppositesFromSeed(): Promise<void> {
  console.log('[syncOppositesFromSeed] Syncing concept-opposites.ts from seed_concepts.json...');
  
  // Load all concepts from seed file
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  let seedConcepts: Array<{ id: string; label: string; opposites?: string[] }> = [];
  
  try {
    const seedContent = await fs.readFile(seedPath, 'utf-8');
    seedConcepts = JSON.parse(seedContent);
  } catch (error: any) {
    console.error(`[syncOppositesFromSeed] Failed to load seed_concepts.json: ${error.message}`);
    return;
  }
  
  console.log(`[syncOppositesFromSeed] Loaded ${seedConcepts.length} concepts from seed file`);
  
  // Build opposites mapping from seed file
  const oppositesMap: Record<string, string[]> = {};
  let conceptsWithOpposites = 0;
  let totalOppositePairs = 0;
  
  for (const concept of seedConcepts) {
    const conceptId = concept.id.toLowerCase();
    const opposites = concept.opposites || [];
    
    if (opposites.length > 0) {
      // Normalize opposite IDs and filter out invalid ones
      const validOpposites = opposites
        .map(opp => String(opp).toLowerCase().trim())
        .filter(opp => opp.length > 0 && opp !== conceptId);
      
      if (validOpposites.length > 0) {
        oppositesMap[conceptId] = Array.from(new Set(validOpposites)).sort();
        conceptsWithOpposites++;
        totalOppositePairs += validOpposites.length;
      }
    }
  }
  
  console.log(`[syncOppositesFromSeed] Found ${conceptsWithOpposites} concepts with opposites (${totalOppositePairs} total pairs)`);
  
  // Ensure bidirectional relationships
  let bidirectionalLinks = 0;
  for (const [conceptId, opps] of Object.entries(oppositesMap)) {
    for (const oppId of opps) {
      if (!oppositesMap[oppId]) {
        oppositesMap[oppId] = [];
      }
      if (!oppositesMap[oppId].includes(conceptId)) {
        oppositesMap[oppId].push(conceptId);
        bidirectionalLinks++;
      }
    }
  }
  
  // Sort all opposite arrays
  for (const conceptId of Object.keys(oppositesMap)) {
    oppositesMap[conceptId].sort();
  }
  
  if (bidirectionalLinks > 0) {
    console.log(`[syncOppositesFromSeed] Added ${bidirectionalLinks} bidirectional links`);
  }
  
  // Get concept labels for comments
  clearConceptsCache();
  const allConcepts = await getAllConcepts();
  const conceptLabelMap = new Map(allConcepts.map(c => [c.id.toLowerCase(), c.label]));
  
  // Also check seed file for labels not in database
  for (const concept of seedConcepts) {
    if (!conceptLabelMap.has(concept.id.toLowerCase())) {
      conceptLabelMap.set(concept.id.toLowerCase(), concept.label);
    }
  }
  
  // Write updated file
  const oppositesPath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts');
  const outputLines: string[] = [
    '/**',
    ' * Comprehensive Concept Opposites Mapping',
    ' * ',
    ' * Generated from:',
    ' * - Manual opposite pairs (from generate_opposites.ts)',
    ' * - Semantic opposites (from embeddings with similarity < -0.1)',
    ' * - Gemini-generated opposites (from concept generation pipeline)',
    ' * - OpenAI-generated opposites (from concept generation pipeline)',
    ' * - Synced from seed_concepts.json',
    ' * ',
    ' * This mapping is used in:',
    ' * - Search ranking: Penalizes images with opposite tags',
    ' * - Tag validation: Filters false positives',
    ' * ',
    ' * This file is automatically synced from seed_concepts.json',
    ' * to ensure it stays aligned with the source of truth.',
    ' */',
    '',
    'export const CONCEPT_OPPOSITES: Record<string, string[]> = {',
  ];
  
  const sortedIds = Object.keys(oppositesMap).sort();
  for (const id of sortedIds) {
    const opps = oppositesMap[id];
    if (opps.length === 0) continue;
    
    const label = conceptLabelMap.get(id) || id;
    outputLines.push(`  '${id}': [${opps.map(o => `'${o}'`).join(', ')}], // ${label}`);
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
  
  await fs.writeFile(oppositesPath, outputLines.join('\n'), 'utf-8');
  console.log(`[syncOppositesFromSeed] ✅ Synced concept-opposites.ts with ${conceptsWithOpposites} concepts and ${totalOppositePairs} opposite pairs`);
}

