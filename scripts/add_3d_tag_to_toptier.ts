import { prisma } from '../src/lib/prisma';
import { embedImageFromBuffer, canonicalizeImage } from '../src/lib/embeddings';
import 'dotenv/config';

(async () => {
  const toptier = await prisma.site.findFirst({
    where: { url: { contains: 'toptier.relats.com' } },
    include: { images: true }
  });

  if (!toptier || !toptier.images[0]) {
    console.log('Site not found');
    return;
  }

  const img = toptier.images[0];
  const threeD = await prisma.concept.findFirst({ where: { id: '3d' } });

  if (!threeD) {
    console.log('3d concept not found');
    return;
  }

  // Recompute the 3D score to be accurate
  const res = await fetch(img.url);
  const buf = Buffer.from(await res.arrayBuffer());
  const { vector } = await embedImageFromBuffer(buf);
  const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);
  const score = cos(vector, threeD.embedding as unknown as number[]);

  console.log(`Adding 3D tag to toptier.relats.com:`);
  console.log(`  3D score: ${score.toFixed(4)}`);

  // Upsert the 3D tag
  await prisma.imageTag.upsert({
    where: {
      imageId_conceptId: {
        imageId: img.id,
        conceptId: '3d'
      }
    },
    update: { score },
    create: {
      imageId: img.id,
      conceptId: '3d',
      score
    }
  });

  console.log('✅ 3D tag added successfully!');

  await prisma.$disconnect();
})().catch(console.error);
