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
 */
async function getAllConcepts(): Promise<Array<{ id: string; label: string }>> {
  if (!allConceptsCache) {
    allConceptsCache = await prisma.concept.findMany({
      select: { id: true, label: true }
    });
  }
  return allConceptsCache;
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
 */
export async function updateConceptOpposites(
  conceptId: string,
  oppositeLabels: string[]
): Promise<void> {
  if (oppositeLabels.length === 0) {
    return;
  }
  
  // Load existing opposites
  const oppositesPath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts');
  let existingOpposites: Record<string, string[]> = {};
  
  try {
    const { CONCEPT_OPPOSITES } = await import('./concept-opposites');
    existingOpposites = { ...CONCEPT_OPPOSITES };
  } catch (e) {
    // File doesn't exist or can't be imported, start fresh
    console.log('[updateConceptOpposites] Starting with empty opposites mapping');
  }
  
  // Convert opposite labels to concept IDs
  const oppositeIds: string[] = [];
  for (const label of oppositeLabels) {
    const oppId = await findConceptIdForLabel(label);
    if (oppId && oppId !== conceptId) {
      // Avoid self-references
      oppositeIds.push(oppId);
    } else if (!oppId) {
      // If concept doesn't exist, use the label as-is (normalized to ID format)
      // This allows opposites to reference concepts that might be created later
      const normalizedId = labelToConceptId(label);
      if (normalizedId !== conceptId) {
        oppositeIds.push(normalizedId);
      }
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

