import { prisma } from '../src/lib/prisma';
import 'dotenv/config';

(async () => {
  const sites = [
    'ponpon-mania.com',
    'hertzwerk.ch',
    'quantamagazine.org',
    'poison.studio',
    'techunt.fr',
    'toptier.relats.com'
  ];
  
  for (const domain of sites) {
    const site = await prisma.site.findFirst({
      where: { url: { contains: domain } },
      include: {
        images: {
          include: {
            tags: {
              include: { concept: true },
              orderBy: { score: 'desc' }
            }
          }
        }
      }
    });
    
    if (!site || !site.images[0]) {
      console.log(`${domain}: Site not found\n`);
      continue;
    }
    
    const img = site.images[0];
    const hasIllustration = img.tags.some(t => t.concept.id === 'illustration-led');
    const has3d = img.tags.some(t => t.concept.id === '3d');
    const illustrationTag = img.tags.find(t => t.concept.id === 'illustration-led');
    const threeDTag = img.tags.find(t => t.concept.id === '3d');
    
    console.log(`${domain}:`);
    console.log(`  Has illustration-led tag: ${hasIllustration ? 'YES ✅' : 'NO ❌'}`);
    if (illustrationTag) {
      const rank = img.tags.findIndex(t => t.concept.id === 'illustration-led') + 1;
      console.log(`    Score: ${illustrationTag.score.toFixed(4)}, Rank: ${rank}/${img.tags.length}`);
    }
    console.log(`  Has 3d tag: ${has3d ? 'YES ✅' : 'NO ❌'}`);
    if (threeDTag) {
      const rank = img.tags.findIndex(t => t.concept.id === '3d') + 1;
      console.log(`    Score: ${threeDTag.score.toFixed(4)}, Rank: ${rank}/${img.tags.length}`);
    }
    console.log('');
  }
  
  await prisma.$disconnect();
})().catch(console.error);
