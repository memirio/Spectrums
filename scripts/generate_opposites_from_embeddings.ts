/**
 * Generate opposites mapping using semantic similarity
 * 
 * Uses concept embeddings to find semantic opposites by:
 * 1. Finding concepts with low cosine similarity (opposites)
 * 2. Combining with manual opposite pairs for validation
 * 3. Filtering to only include strong opposite relationships
 */

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { prisma } from '../src/lib/prisma';

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

async function main() {
  console.log('📚 Loading concepts from database...\n');
  
  const concepts = await prisma.concept.findMany({
    select: { id: true, label: true, embedding: true }
  });
  
  console.log(`✅ Loaded ${concepts.length} concepts\n`);
  console.log('🔍 Finding semantic opposites using embeddings...\n');
  
  // Build embedding map
  const embeddingMap = new Map<string, number[]>();
  for (const c of concepts) {
    const emb = c.embedding as unknown as number[];
    if (emb && emb.length > 0) {
      embeddingMap.set(c.id.toLowerCase(), emb);
    }
  }
  
  // Start with ONLY manual opposites from generate_opposites.ts
  // First, run generate_opposites.ts to get clean manual opposites
  console.log('📚 Loading manual opposites from generate_opposites.ts output...\n');
  
  // Run generate_opposites.ts first to ensure we have clean manual opposites
  const { execSync } = require('child_process');
  const generateOppositesScript = path.join(process.cwd(), 'scripts', 'generate_opposites.ts');
  
  console.log('  Running generate_opposites.ts to get clean manual opposites...\n');
  execSync(`npx tsx ${generateOppositesScript}`, { stdio: 'inherit' });
  
  // Clear the module cache to force reload
  delete require.cache[require.resolve('../src/lib/concept-opposites')];
  
  // Now import the clean manual opposites
  const cleanModule = await import('../src/lib/concept-opposites');
  const manualOpposites = cleanModule.CONCEPT_OPPOSITES || {};
  console.log(`  Loaded ${Object.keys(manualOpposites).length} concepts with manual opposites\n`);
  
  // Start with manual opposites only (preserve these - don't filter them)
  const opposites: Record<string, Set<string>> = {};
  const manualOppositePairs = new Set<string>(); // Track manual pairs to preserve them
  for (const [conceptId, opps] of Object.entries(manualOpposites)) {
    opposites[conceptId] = new Set(opps);
    for (const opp of opps) {
      // Store both directions of the pair
      const pair1 = `${conceptId}:${opp}`;
      const pair2 = `${opp}:${conceptId}`;
      manualOppositePairs.add(pair1);
      manualOppositePairs.add(pair2);
    }
  }
  
  // Find semantic opposites using relative similarity approach
  // For each concept, find concepts that are significantly below its average similarity
  // This ensures we only find true opposites, not just semantically distant concepts
  console.log('  Finding semantic opposites using relative similarity...\n');
  
  const conceptIds = Array.from(embeddingMap.keys());
  let foundCount = 0;
  let skippedAlreadyExists = 0;
  let skippedNoLowSim = 0;
  let processedCount = 0;
  
  // Now find opposites for all concepts
  for (let i = 0; i < conceptIds.length; i++) {
    const id1 = conceptIds[i];
    const emb1 = embeddingMap.get(id1)!;
    
    if (!opposites[id1]) {
      opposites[id1] = new Set();
    }
    
    // Find the lowest similarity concepts (potential opposites)
    const similarities: Array<{ id: string; sim: number }> = [];
    
    for (let j = 0; j < conceptIds.length; j++) {
      if (i === j) continue;
      const id2 = conceptIds[j];
      const emb2 = embeddingMap.get(id2)!;
      const similarity = cosineSimilarity(emb1, emb2);
      similarities.push({ id: id2, sim: similarity });
    }
    
    // Sort by similarity (lowest first)
    similarities.sort((a, b) => a.sim - b.sim);
    
    // Use a very strict percentile-based approach: take bottom 1% of similarities
    // Only the most truly opposite concepts should be added
    const percentile1Index = Math.floor(similarities.length * 0.01);
    const percentile1Threshold = similarities[percentile1Index]?.sim || 0.45;
    
    // Take only the single most opposite concept (bottom 1%)
    const bottomConcepts = similarities
      .filter(s => s.sim <= percentile1Threshold)
      .slice(0, 1); // Only take the single most opposite concept
    
    if (bottomConcepts.length === 0) {
      skippedNoLowSim++;
    }
    
    for (const { id: id2, sim } of bottomConcepts) {
      // Check if this pair already exists (manual or in this run)
      const existingOpps1 = manualOpposites[id1] || [];
      const existingOpps2 = manualOpposites[id2] || [];
      
      // Only add if this specific pair doesn't already exist
      if (!existingOpps1.includes(id2) && !existingOpps2.includes(id1)) {
        // Also check if we've already added this pair in this run
        if (!opposites[id1]?.has(id2) && !opposites[id2]?.has(id1)) {
          opposites[id1].add(id2);
          if (!opposites[id2]) {
            opposites[id2] = new Set();
          }
          opposites[id2].add(id1);
          foundCount++;
          processedCount++;
        } else {
          skippedAlreadyExists++;
        }
      } else {
        skippedAlreadyExists++;
      }
    }
    
    if ((i + 1) % 100 === 0) {
      console.log(`  Processed ${i + 1}/${conceptIds.length} concepts...`);
    }
  }
  
  console.log(`\n✅ Found ${foundCount} additional opposite pairs`);
  console.log(`   Skipped (already exists): ${skippedAlreadyExists}`);
  console.log(`   Skipped (no low similarity): ${skippedNoLowSim}`);
  console.log(`   Processed: ${processedCount}\n`);
  
  // Filter out concepts that appear as opposites for too many other concepts
  // These are likely just semantically distant, not true opposites
  // Apply this filter to ALL opposites (both manual and newly found)
  console.log('  Filtering out overly common opposites...\n');
  
  const oppositeCounts: Record<string, number> = {};
  for (const [id, oppSet] of Object.entries(opposites)) {
    for (const opp of oppSet) {
      oppositeCounts[opp] = (oppositeCounts[opp] || 0) + 1;
    }
  }
  
  // Find concepts that appear as opposites for more than 2 concepts
  // If a concept appears as an opposite for many others, it's probably just semantically distant
  // This is a very strict filter to ensure we only keep true opposites
  // Also limit the total number of opposites any concept can have
  const MAX_OPPOSITE_COUNT = 2; // Very strict - only allow concepts that appear as opposite for 2 or fewer concepts
  const MAX_OPPOSITES_PER_CONCEPT = 5; // No concept should have more than 5 opposites
  const overlyCommonOpposites = new Set(
    Object.entries(oppositeCounts)
      .filter(([_, count]) => count > MAX_OPPOSITE_COUNT)
      .map(([id, _]) => id)
  );
  
  console.log(`  Found ${overlyCommonOpposites.size} concepts appearing as opposites for >${MAX_OPPOSITE_COUNT} concepts`);
  if (overlyCommonOpposites.size > 0) {
    console.log(`  Examples: ${Array.from(overlyCommonOpposites).slice(0, 10).join(', ')}`);
  }
  console.log('');
  
  // Remove overly common opposites from the mapping
  // BUT preserve manual opposites even if they're common
  let removedCount = 0;
  const filteredOpposites: Record<string, Set<string>> = {};
  for (const [id, oppSet] of Object.entries(opposites)) {
    filteredOpposites[id] = new Set();
    for (const opp of oppSet) {
      const pair1 = `${id}:${opp}`;
      const pair2 = `${opp}:${id}`;
      const isManual = manualOppositePairs.has(pair1) || manualOppositePairs.has(pair2);
      
      // Keep if: not overly common OR it's a manual opposite
      if (!overlyCommonOpposites.has(opp) || isManual) {
        filteredOpposites[id].add(opp);
      } else {
        removedCount++;
      }
    }
  }
  
  console.log(`  Removed ${removedCount} opposite relationships involving overly common opposites`);
  
  // Also limit the total number of opposites per concept
  let trimmedCount = 0;
  for (const [id, oppSet] of Object.entries(filteredOpposites)) {
    if (oppSet.size > MAX_OPPOSITES_PER_CONCEPT) {
      // Keep only the first MAX_OPPOSITES_PER_CONCEPT opposites
      // (they're already sorted by similarity, so we keep the most opposite ones)
      const oppArray = Array.from(oppSet);
      filteredOpposites[id] = new Set(oppArray.slice(0, MAX_OPPOSITES_PER_CONCEPT));
      trimmedCount += oppArray.length - MAX_OPPOSITES_PER_CONCEPT;
    }
  }
  
  console.log(`  Trimmed ${trimmedCount} opposites from concepts that exceeded ${MAX_OPPOSITES_PER_CONCEPT} opposites\n`);
  
  // Convert sets to arrays and sort
  const finalOpposites: Record<string, string[]> = {};
  for (const [id, oppSet] of Object.entries(filteredOpposites)) {
    if (oppSet.size > 0) {
      finalOpposites[id] = Array.from(oppSet).sort();
    }
  }
  
  // Generate output
  const outputLines: string[] = [
    '/**',
    ' * Comprehensive Concept Opposites Mapping',
    ' * ',
    ' * Generated from:',
    ' * - Manual opposite pairs (from generate_opposites.ts)',
    ' * - Semantic opposites (from embeddings with similarity < -0.1)',
    ' * ',
    ' * This mapping is used in:',
    ' * - Search ranking: Penalizes images with opposite tags',
    ' * - Tag validation: Filters false positives',
    ' */',
    '',
    'export const CONCEPT_OPPOSITES: Record<string, string[]> = {',
  ];
  
  const sortedIds = Object.keys(finalOpposites).sort();
  for (const id of sortedIds) {
    const opps = finalOpposites[id];
    const concept = concepts.find(c => c.id.toLowerCase() === id);
    const label = concept?.label || id;
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
  
  const outputPath = path.join(process.cwd(), 'src', 'lib', 'concept-opposites.ts');
  await fs.writeFile(outputPath, outputLines.join('\n'), 'utf-8');
  
  console.log(`✅ Generated comprehensive opposites mapping:`);
  console.log(`   ${sortedIds.length} concepts with opposites`);
  console.log(`   Total opposite relationships: ${Object.values(finalOpposites).reduce((sum, opps) => sum + opps.length, 0)}`);
  console.log(`\n📝 Output written to: ${outputPath}\n`);
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Script failed:', e);
  process.exit(1);
});

