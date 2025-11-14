import { prisma } from '../src/lib/prisma';

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < len; i++) sum += a[i] * b[i];
  return sum;
}

async function getFullAnalysis(url: string) {
  const domain = url.replace('https://', '').replace('http://', '').split('/')[0];
  const site = await prisma.site.findFirst({
    where: { url: { contains: domain } },
    include: {
      images: {
        include: {
          embedding: true,
          tags: {
            include: { concept: true },
            orderBy: { score: 'desc' }
          }
        }
      }
    }
  });

  if (!site || !site.images[0] || !site.images[0].embedding) {
    return null;
  }

  const image = site.images[0];
  const imageVec = image.embedding.vector as unknown as number[];
  const concept3d = await prisma.concept.findUnique({ where: { id: '3d' } });
  if (!concept3d) return null;
  
  const conceptVec = concept3d.embedding as unknown as number[];
  const score3d = cosineSimilarity(imageVec, conceptVec);
  
  const tag3d = image.tags.find(t => t.conceptId === '3d');
  const tagDesign = image.tags.find(t => t.conceptId === 'design');
  
  const related3d = ['volumetrics', 'lens', 'process', 'ar-vr', 'vr', 'extrusion', 'perspective', 'cgi', 'render', 'shading'];
  const relatedTags = image.tags.filter(t => related3d.includes(t.conceptId));
  
  return {
    url: site.url,
    score3d,
    hasTag3d: !!tag3d,
    tag3dScore: tag3d?.score || 0,
    hasTagDesign: !!tagDesign,
    tagDesignScore: tagDesign?.score || 0,
    relatedCount: relatedTags.length,
    relatedAvg: relatedTags.length > 0 ? relatedTags.reduce((s, t) => s + t.score, 0) / relatedTags.length : 0,
    relatedTags: relatedTags.map(t => ({ id: t.conceptId, score: t.score }))
  };
}

async function main() {
  console.log('\n📊 COMPREHENSIVE 3D TAG ANALYSIS\n');
  console.log('Analyzing false positives vs legitimate 3D sites...\n');

  const sites = [
    { url: 'https://play.garance.com/', name: 'play.garance.com', type: 'FALSE POSITIVE' },
    { url: 'https://www.romanjeanelie.com/', name: 'romanjeanelie.com', type: 'FALSE POSITIVE' },
    { url: 'https://www.darkstarfury.com/', name: 'darkstarfury.com', type: 'FALSE POSITIVE' },
    { url: 'https://internalities.eu/', name: 'internalities.eu', type: 'FALSE POSITIVE' },
    { url: 'https://daydreamplayer.com/', name: 'daydreamplayer.com', type: 'LEGITIMATE' },
    { url: 'https://www.mastercard.com/businessoutcomes/', name: 'mastercard.com', type: 'LEGITIMATE' },
  ];

  for (const { url, name, type } of sites) {
    const result = await getFullAnalysis(url);
    if (result) {
      console.log(`${name} [${type}]:`);
      console.log(`  3D Score (raw CLIP): ${result.score3d.toFixed(6)}`);
      console.log(`  3D Tagged: ${result.hasTag3d ? 'YES (' + result.tag3dScore.toFixed(4) + ')' : 'NO'}`);
      console.log(`  Design Tagged: ${result.hasTagDesign ? 'YES (' + result.tagDesignScore.toFixed(4) + ')' : 'NO'}`);
      console.log(`  3D-Related Tags: ${result.relatedCount} (avg: ${result.relatedAvg.toFixed(4)})`);
      if (result.relatedTags.length > 0) {
        console.log(`    ${result.relatedTags.map(t => `${t.id}:${t.score.toFixed(3)}`).join(', ')}`);
      }
      console.log('');
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);

