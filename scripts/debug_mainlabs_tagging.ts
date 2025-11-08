import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { TAG_CONFIG } from '../src/lib/tagging-config';

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

async function main() {
  const site = await prisma.site.findFirst({
    where: { url: { contains: 'mainlabs.ai' } },
  });
  if (!site) {
    console.log('Site not found');
    return;
  }

  const image = await prisma.image.findFirst({
    where: { siteId: site.id, url: site.imageUrl || undefined },
    include: {
      embedding: true,
      tags: {
        include: { concept: true },
        orderBy: { score: 'desc' },
      },
    },
  });

  if (!image || !image.embedding) {
    console.log('Image not found');
    return;
  }

  const ivec = (image.embedding.vector as unknown as number[]) || [];
  const allConcepts = await prisma.concept.findMany();

  // Load categories from seed file
  const fs = await import('fs/promises');
  const path = await import('path');
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
  const seedContent = await fs.readFile(seedPath, 'utf-8');
  const seedConcepts = JSON.parse(seedContent);
  const categoryMap = new Map<string, string>();
  for (const sc of seedConcepts) {
    if (sc.category) {
      categoryMap.set(sc.id, sc.category);
    }
  }

  const scores = allConcepts.map((c) => ({
    conceptId: c.id,
    label: c.label,
    score: cosine(ivec, (c.embedding as unknown as number[]) || []),
    category: categoryMap.get(c.id) || 'Uncategorized',
  }));
  scores.sort((a, b) => b.score - a.score);

  // Group by category
  const byCategory = new Map<string, typeof scores>();
  for (const score of scores) {
    const cat = score.category;
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat)!.push(score);
  }

  // Category guarantees
  const categoryGuarantees: typeof scores = [];
  for (const [category, categoryScores] of byCategory.entries()) {
    if (categoryScores.length > 0) {
      categoryGuarantees.push(categoryScores[0]);
    }
  }

  console.log(`Category guarantees (${categoryGuarantees.length}):`);
  for (const g of categoryGuarantees) {
    const isTagged = image.tags.some((t) => t.conceptId === g.conceptId);
    console.log(`  ${g.category}: ${g.label} (${g.score.toFixed(4)}) ${isTagged ? '[TAGGED]' : ''}`);
  }

  const guaranteeIds = new Set(categoryGuarantees.map((s) => s.conceptId));
  const remainingScores = scores.filter((s) => !guaranteeIds.has(s.conceptId));
  
  console.log(`\nRemaining slots: ${TAG_CONFIG.MAX_K - categoryGuarantees.length}`);
  console.log(`Remaining scores above MIN_SCORE (${TAG_CONFIG.MIN_SCORE}): ${remainingScores.filter((s) => s.score >= TAG_CONFIG.MIN_SCORE).length}`);

  const aboveThreshold = remainingScores.filter((s) => s.score >= TAG_CONFIG.MIN_SCORE);
  const chosen: typeof scores = [];
  const remainingSlots = TAG_CONFIG.MAX_K - categoryGuarantees.length;

  console.log(`\nPragmatic selection process:`);
  for (let i = 0; i < aboveThreshold.length && chosen.length < remainingSlots; i++) {
    const current = aboveThreshold[i];
    const prev = chosen[chosen.length - 1];

    if (chosen.length === 0) {
      chosen.push(current);
      console.log(`  ${i + 1}. ${current.label} (${current.score.toFixed(4)}) - first`);
      continue;
    }

    if (prev && prev.score > 0) {
      const dropPct = (prev.score - current.score) / prev.score;
      if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
        console.log(`  ${i + 1}. ${current.label} (${current.score.toFixed(4)}) - STOP: drop ${(dropPct * 100).toFixed(1)}% > ${(TAG_CONFIG.MIN_SCORE_DROP_PCT * 100).toFixed(0)}%`);
        break;
      }
    }

    chosen.push(current);
    const is3d = current.conceptId === '3d';
    console.log(`  ${i + 1}. ${current.label} (${current.score.toFixed(4)}) ${is3d ? '<<< 3D' : ''}`);
  }

  console.log(`\nFinal chosen: ${chosen.length}`);
  const final = [...categoryGuarantees, ...chosen].sort((a, b) => b.score - a.score);
  
  const concept3d = final.find((t) => t.conceptId === '3d');
  if (concept3d) {
    console.log(`✅ 3d is in final tags: ${concept3d.score.toFixed(4)}`);
  } else {
    console.log(`❌ 3d is NOT in final tags`);
    const rank3d = remainingScores.findIndex((s) => s.conceptId === '3d');
    const score3d = remainingScores[rank3d]?.score || 0;
    console.log(`   3d rank in remaining: #${rank3d + 1}, score: ${score3d.toFixed(4)}`);
    if (rank3d < chosen.length) {
      console.log(`   But it should have been chosen!`);
    } else {
      console.log(`   It's after the chosen ones (rank ${rank3d + 1} vs ${chosen.length} chosen)`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);

