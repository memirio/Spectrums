// scripts/retag_all_with_gemini.ts
// Retag all images using the new Gemini concept generation

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { tagImage } from '../src/jobs/tagging';

async function main() {
  console.log('🔄 Retagging all images with Gemini concept generation...\n');

  // Get all images that are linked to sites
  const images = await prisma.image.findMany({
    include: {
      site: {
        select: {
          title: true,
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`📊 Found ${images.length} images to process\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ imageId: string; error: string }> = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const siteInfo = image.site ? `${image.site.title} (${image.site.url})` : 'No site';
    
    console.log(`\n[${i + 1}/${images.length}] Processing image: ${image.id}`);
    console.log(`   Site: ${siteInfo}`);
    console.log(`   URL: ${image.url}`);

    try {
      await tagImage(image.id);
      successCount++;
      console.log(`   ✅ Success`);
    } catch (error: any) {
      errorCount++;
      const errorMsg = error.message || String(error);
      errors.push({ imageId: image.id, error: errorMsg });
      console.error(`   ❌ Error: ${errorMsg}`);
    }

    // Small delay to avoid rate limiting
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n\n✨ Processing complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors encountered:`);
    for (const { imageId, error } of errors) {
      console.log(`   ${imageId}: ${error}`);
    }
  }
}

main()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

