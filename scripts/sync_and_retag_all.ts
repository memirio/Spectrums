/**
 * Script to:
 * 1. Sync opposites from seed_concepts.json to concept-opposites.ts
 * 2. Re-tag all images using the standard tagging logic
 */

import { prisma } from '../src/lib/prisma';
import { syncOppositesFromSeed } from '../src/lib/update-concept-opposites';
import { TAG_CONFIG } from '../src/lib/tagging-config';
import * as fs from 'fs/promises';
import * as path from 'path';

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

interface Concept {
  id: string;
  label: string;
  embedding: any;
  synonyms?: string[];
  related?: string[];
  opposites?: string[];
}

async function loadAllConcepts(): Promise<Concept[]> {
  console.log('📚 Loading all concepts from database...');
  const dbConcepts = await prisma.concept.findMany({
    select: {
      id: true,
      label: true,
      embedding: true,
      synonyms: true,
      related: true,
      opposites: true,
    },
  });

  // Also load from seed file to get any concepts not yet in DB
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  let seedConcepts: any[] = [];
  try {
    const seedContent = await fs.readFile(seedPath, 'utf-8');
    seedConcepts = JSON.parse(seedContent);
  } catch (e) {
    console.warn('⚠️  Could not load seed_concepts.json, using DB only');
  }

  // Create a map of concepts by ID
  const conceptMap = new Map<string, Concept>();
  
  // Add DB concepts first
  for (const c of dbConcepts) {
    conceptMap.set(c.id.toLowerCase(), {
      id: c.id,
      label: c.label,
      embedding: c.embedding,
      synonyms: (c.synonyms as unknown as string[]) || [],
      related: (c.related as unknown as string[]) || [],
      opposites: (c.opposites as unknown as string[]) || [],
    });
  }

  // Add seed concepts that aren't in DB (they might not have embeddings yet)
  for (const sc of seedConcepts) {
    const id = sc.id?.toLowerCase();
    if (id && !conceptMap.has(id)) {
      // Try to find embedding from DB
      const dbConcept = dbConcepts.find(c => c.id.toLowerCase() === id);
      conceptMap.set(id, {
        id: sc.id,
        label: sc.label || sc.id,
        embedding: dbConcept?.embedding || null,
        synonyms: (sc.synonyms || []) as string[],
        related: (sc.related || []) as string[],
        opposites: (sc.opposites || []) as string[],
      });
    } else if (id && conceptMap.has(id)) {
      // Update with seed data (synonyms, related, opposites) if DB doesn't have them
      const existing = conceptMap.get(id)!;
      if (!existing.synonyms?.length && sc.synonyms?.length) {
        existing.synonyms = sc.synonyms as string[];
      }
      if (!existing.related?.length && sc.related?.length) {
        existing.related = sc.related as string[];
      }
      if (!existing.opposites?.length && sc.opposites?.length) {
        existing.opposites = sc.opposites as string[];
      }
    }
  }

  const allConcepts = Array.from(conceptMap.values());
  console.log(`✅ Loaded ${allConcepts.length} concepts (${dbConcepts.length} from DB)`);
  return allConcepts;
}

async function retagImage(imageId: string, concepts: Concept[]): Promise<void> {
  // Get image embedding
  const imageEmbedding = await prisma.imageEmbedding.findUnique({
    where: { imageId },
  });

  if (!imageEmbedding || !imageEmbedding.vector) {
    console.warn(`  ⚠️  No embedding for image ${imageId}, skipping`);
    return;
  }

  const ivec = imageEmbedding.vector as unknown as number[];
  if (ivec.length === 0) {
    console.warn(`  ⚠️  Empty embedding for image ${imageId}, skipping`);
    return;
  }

  // Only use concepts that exist in the database and have embeddings
  // Filter to only concepts that are actually in the DB (not just in seed file)
  const dbConceptIds = new Set(
    (await prisma.concept.findMany({ select: { id: true } })).map(c => c.id.toLowerCase())
  );
  
  // Score all concepts (only those in DB with embeddings)
  const scores = concepts
    .filter(c => {
      const idLower = c.id.toLowerCase();
      return dbConceptIds.has(idLower) && c.embedding && Array.isArray(c.embedding) && c.embedding.length > 0;
    })
    .map(c => ({
      conceptId: c.id,
      score: cosineSimilarity(ivec, c.embedding as unknown as number[]),
      concept: c,
    }))
    .filter(s => s.score > 0) // Only keep positive scores
    .sort((a, b) => b.score - a.score);

  if (scores.length === 0) {
    console.warn(`  ⚠️  No valid scores for image ${imageId}, skipping`);
    return;
  }

  // Apply pragmatic tagging logic
  const aboveThreshold = scores.filter(s => s.score >= TAG_CONFIG.MIN_SCORE);
  const chosen: typeof scores = [];
  let prevScore = aboveThreshold.length > 0 ? aboveThreshold[0].score : 0;

  for (let i = 0; i < aboveThreshold.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
    const current = aboveThreshold[i];
    
    if (chosen.length === 0) {
      chosen.push(current);
      prevScore = current.score;
      continue;
    }
    
    const dropPct = (prevScore - current.score) / prevScore;
    if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
      if (chosen.length < MIN_TAGS_PER_IMAGE) {
        chosen.push(current);
        prevScore = current.score;
      } else {
        break;
      }
    } else {
      chosen.push(current);
      prevScore = current.score;
    }
  }

  // Fallback: ensure minimum tags
  const MIN_TAGS_PER_IMAGE = 8;
  if (chosen.length < MIN_TAGS_PER_IMAGE) {
    const fallback = scores.slice(0, MIN_TAGS_PER_IMAGE);
    const keep = new Set(chosen.map(c => c.conceptId));
    for (const f of fallback) {
      if (!keep.has(f.conceptId)) {
        chosen.push(f);
        keep.add(f.conceptId);
      }
    }
  }

  // Create a set of valid concept IDs (those that exist in the database)
  const validConceptIds = dbConceptIds;
  
  // Use the chosen concepts directly (no synonym expansion)
  const chosenConceptIds = new Set<string>();
  for (const chosenScore of chosen) {
    const conceptId = chosenScore.conceptId.toLowerCase();
    
    // Only proceed if this concept exists in the database
    if (!validConceptIds.has(conceptId)) {
      console.warn(`  ⚠️  Skipping concept ${conceptId} - not in database`);
      continue;
    }
    
    chosenConceptIds.add(conceptId);
    await prisma.imageTag.upsert({
      where: { imageId_conceptId: { imageId, conceptId } },
      update: { score: chosenScore.score },
      create: { imageId, conceptId, score: chosenScore.score },
    });
  }

  // Delete tags that are no longer in the final set
  const existingTags = await prisma.imageTag.findMany({
    where: { imageId },
  });

  for (const existingTag of existingTags) {
    if (!chosenConceptIds.has(existingTag.conceptId)) {
      await prisma.imageTag.delete({
        where: { imageId_conceptId: { imageId, conceptId: existingTag.conceptId } },
      });
    }
  }
}

async function main() {
  console.log('🚀 Starting sync and re-tagging process...\n');

  try {
    // Step 1: Sync opposites
    console.log('📋 Step 1: Syncing opposites from seed_concepts.json to concept-opposites.ts...');
    await syncOppositesFromSeed();
    console.log('✅ Opposites synced!\n');

    // Step 2: Load all concepts
    const concepts = await loadAllConcepts();
    console.log(`   Found ${concepts.filter(c => c.synonyms && c.synonyms.length > 0).length} concepts with synonyms\n`);

    // Step 3: Get all images
    console.log('🖼️  Loading all images...');
    const images = await prisma.image.findMany({
      select: { id: true },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`✅ Found ${images.length} images to re-tag\n`);

    // Step 4: Re-tag all images
    console.log('🏷️  Re-tagging all images...');
    let processed = 0;
    let errors = 0;

    for (const image of images) {
      try {
        await retagImage(image.id, concepts);
        processed++;
        
        if (processed % 50 === 0) {
          console.log(`   Progress: ${processed}/${images.length} (${((processed / images.length) * 100).toFixed(1)}%)`);
        }
      } catch (error: any) {
        errors++;
        console.error(`   ❌ Error tagging image ${image.id}: ${error.message}`);
      }
    }

    console.log(`\n✅ Re-tagging complete!`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Success rate: ${((processed / images.length) * 100).toFixed(1)}%`);
  } catch (error: any) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

