import { prisma } from '../src/lib/prisma';
import { tagImage } from '../src/jobs/tagging';
import 'dotenv/config';

(async () => {
  const images = await prisma.image.findMany();
  console.log(`Found ${images.length} images to retag`);
  console.log('Retagging all images with TOP_K=20...\n');
  
  let processed = 0;
  let errors = 0;
  
  for (const img of images) {
    try {
      await tagImage(img.id);
      processed++;
      if (processed % 5 === 0) {
        console.log(`  Processed: ${processed}/${images.length}`);
      }
    } catch (e: any) {
      errors++;
      console.error(`  Error tagging image ${img.id}:`, e.message);
    }
  }
  
  console.log('\nRetagging complete!');
  console.log(`  Processed: ${processed}`);
  console.log(`  Errors: ${errors}`);
  
  await prisma.$disconnect();
})().catch(console.error);
