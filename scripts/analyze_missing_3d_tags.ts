import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}

async function analyzeImage(siteUrl: string) {
  const site = await prisma.site.findFirst({
    where: { url: { contains: siteUrl } },
  });
  if (!site) {
    console.log(`Site not found: ${siteUrl}`);
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
    console.log(`Image not found for: ${siteUrl}`);
    return;
  }

  const concept3d = await prisma.concept.findFirst({ where: { id: '3d' } });
  if (!concept3d) {
    console.log('No 3d concept found');
    return;
  }

  const ivec = (image.embedding.vector as unknown as number[]) || [];
  const concept3dVec = (concept3d.embedding as unknown as number[]) || [];
  const score3d = cosine(ivec, concept3dVec);

  const allConcepts = await prisma.concept.findMany();
  const allScores = allConcepts.map((c) => ({
    id: c.id,
    label: c.label,
    score: cosine(ivec, (c.embedding as unknown as number[]) || []),
  }));
  allScores.sort((a, b) => b.score - a.score);

  const rank3d = allScores.findIndex((s) => s.id === '3d') + 1;
  const aboveThreshold = allScores.filter((s) => s.score >= 0.15);

  console.log(`\n${siteUrl}:`);
  console.log(`  3d concept score: ${score3d.toFixed(4)} (rank #${rank3d})`);
  console.log(`  MIN_SCORE threshold: 0.15`);
  console.log(`  Current tags (${image.tags.length}): ${image.tags.map((t) => `${t.concept.label} (${t.score.toFixed(3)})`).join(', ')}`);
  console.log(`  Concepts above MIN_SCORE (0.15): ${aboveThreshold.length}`);
  
  if (score3d < 0.15) {
    console.log(`  ❌ 3d score ${score3d.toFixed(4)} is BELOW MIN_SCORE (0.15)`);
  } else {
    console.log(`  ✅ 3d score ${score3d.toFixed(4)} is ABOVE MIN_SCORE (0.15)`);
    const lastTagged = image.tags[image.tags.length - 1];
    if (lastTagged) {
      const dropPct = (lastTagged.score - score3d) / lastTagged.score;
      console.log(`  Last tagged score: ${lastTagged.score.toFixed(4)}`);
      console.log(`  3d score: ${score3d.toFixed(4)}`);
      console.log(`  Drop from last: ${(dropPct * 100).toFixed(1)}%`);
      console.log(`  MIN_SCORE_DROP_PCT: 0.10 (10%)`);
      if (dropPct > 0.10) {
        console.log(`  ❌ Drop ${(dropPct * 100).toFixed(1)}% exceeds MIN_SCORE_DROP_PCT (10%)`);
      } else {
        console.log(`  ✅ Drop ${(dropPct * 100).toFixed(1)}% is within MIN_SCORE_DROP_PCT (10%)`);
      }
    }
  }

  console.log(`\n  Top 30 concepts by score:`);
  for (let i = 0; i < 30 && i < allScores.length; i++) {
    const s = allScores[i];
    const isTagged = image.tags.some((t) => t.conceptId === s.id);
    const is3d = s.id === '3d';
    console.log(`    ${i + 1}. ${s.score.toFixed(4)} - ${s.label} ${isTagged ? '[TAGGED]' : ''} ${is3d ? '<<< 3D' : ''}`);
  }
}

async function main() {
  const sites = ['toptier.relats.com', 'mainlabs.ai'];
  for (const siteUrl of sites) {
    await analyzeImage(siteUrl);
  }

  await prisma.$disconnect();
}

main().catch(console.error);

