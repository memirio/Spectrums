/**
 * Tagging Quality Checker
 * 
 * Identifies images that should have specific tags but don't.
 * This helps catch cases where images have high zero-shot similarity
 * to a concept but weren't tagged with it (e.g., ranked outside top 20).
 * 
 * Usage:
 *   npx tsx scripts/check_tagging_quality.ts [concept-id]
 * 
 * Examples:
 *   npx tsx scripts/check_tagging_quality.ts 3d
 *   npx tsx scripts/check_tagging_quality.ts illustration-led
 */

import { prisma } from '../src/lib/prisma';
import { embedImageFromBuffer, embedTextBatch } from '../src/lib/embeddings';
import { TAG_CONFIG } from '../src/lib/tagging-config';
import 'dotenv/config';

async function checkTaggingQuality(conceptId: string | null) {
  const concepts = conceptId
    ? await prisma.concept.findMany({ where: { id: conceptId } })
    : await prisma.concept.findMany();

  if (concepts.length === 0) {
    console.log(`❌ Concept "${conceptId}" not found`);
    await prisma.$disconnect();
    return;
  }

  console.log('🔍 Tagging Quality Check\n');
  console.log('=' .repeat(60));

  const allImages = await prisma.image.findMany({
    include: {
      embedding: true,
      tags: { include: { concept: true } },
      site: true,
    },
    where: {
      embedding: { isNot: null },
    },
  });

  console.log(`Checking ${allImages.length} images against ${concepts.length} concept(s)...\n`);

  for (const concept of concepts) {
    console.log(`\n📊 Concept: ${concept.id} (${concept.label})`);
    console.log('-'.repeat(60));

    const conceptEmbedding = concept.embedding as unknown as number[];
    if (!conceptEmbedding || conceptEmbedding.length === 0) {
      console.log('  ⚠️  Concept has no embedding - skipping\n');
      continue;
    }

    const imagesToCheck: Array<{
      imageId: string;
      siteUrl: string;
      zeroShotScore: number;
      hasTag: boolean;
      tagScore?: number;
      rank: number;
    }> = [];

    // Check all images for zero-shot similarity
    for (const img of allImages) {
      const imageEmbedding = (img.embedding?.vector as unknown as number[]) || [];
      if (imageEmbedding.length !== conceptEmbedding.length) continue;

      const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
      const zeroShotScore = cos(imageEmbedding, conceptEmbedding);

      const hasTag = img.tags.some(t => t.concept.id === concept.id);
      const tagScore = img.tags.find(t => t.concept.id === concept.id)?.score;

      imagesToCheck.push({
        imageId: img.id,
        siteUrl: img.site?.url || '',
        zeroShotScore,
        hasTag,
        tagScore,
        rank: 0, // Will be set after sorting
      });
    }

    // Sort by zero-shot score (descending)
    imagesToCheck.sort((a, b) => b.zeroShotScore - a.zeroShotScore);

    // Assign ranks
    imagesToCheck.forEach((img, idx) => {
      img.rank = idx + 1;
    });

    // Find images that should be tagged but aren't
    const shouldBeTagged = imagesToCheck.filter(img => {
      // Criteria for "should be tagged":
      // 1. Zero-shot score >= MIN_SCORE (would be eligible for tagging)
      // 2. Rank <= MAX_K * 1.5 (within top 30, slightly above threshold)
      // 3. Currently doesn't have the tag
      return (
        img.zeroShotScore >= TAG_CONFIG.MIN_SCORE &&
        img.rank <= TAG_CONFIG.MAX_K * 1.5 &&
        !img.hasTag
      );
    });

    // Find images with very high zero-shot but no tag (potential false negatives)
    const highScoreNoTag = imagesToCheck.filter(
      img => img.zeroShotScore >= 0.20 && !img.hasTag && img.rank <= 50
    );

    console.log(`\n  Zero-shot scores:`);
    console.log(`    Highest: ${imagesToCheck[0]?.zeroShotScore.toFixed(4)} (${imagesToCheck[0]?.siteUrl})`);
    console.log(`    ${imagesToCheck.filter(img => img.hasTag).length} images currently tagged`);
    console.log(`    ${shouldBeTagged.length} images should be tagged but aren't`);
    console.log(`    ${highScoreNoTag.length} images with high scores (>0.20) but no tag`);

    if (shouldBeTagged.length > 0) {
      console.log(`\n  ⚠️  Images that should be tagged:`);
      for (const img of shouldBeTagged.slice(0, 10)) {
        console.log(`    - Rank #${img.rank}: ${img.siteUrl}`);
        console.log(`      Zero-shot: ${img.zeroShotScore.toFixed(4)} (should be tagged!)`);
      }
      if (shouldBeTagged.length > 10) {
        console.log(`    ... and ${shouldBeTagged.length - 10} more`);
      }
    }

    if (highScoreNoTag.length > 0 && highScoreNoTag.length !== shouldBeTagged.length) {
      console.log(`\n  🔍 High-score false negatives:`);
      for (const img of highScoreNoTag.slice(0, 5)) {
        console.log(`    - Rank #${img.rank}: ${img.siteUrl}`);
        console.log(`      Zero-shot: ${img.zeroShotScore.toFixed(4)} (very high, should investigate)`);
      }
    }

    // Show current tag distribution
    const taggedImages = imagesToCheck.filter(img => img.hasTag);
    if (taggedImages.length > 0) {
      console.log(`\n  ✅ Currently tagged images (top 5):`);
      for (const img of taggedImages.slice(0, 5)) {
        console.log(`    - ${img.siteUrl}`);
        console.log(`      Tag score: ${img.tagScore?.toFixed(4)}, Zero-shot: ${img.zeroShotScore.toFixed(4)}, Rank: #${img.rank}`);
      }
    }
  }

  await prisma.$disconnect();
}

const conceptId = process.argv[2] || null;
if (!conceptId) {
  console.log('Usage: npx tsx scripts/check_tagging_quality.ts <concept-id>');
  console.log('Example: npx tsx scripts/check_tagging_quality.ts 3d');
  process.exit(1);
}

checkTaggingQuality(conceptId).catch(console.error);

