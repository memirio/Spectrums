// scripts/generate_concepts_for_all_images.ts
// Generate new abstract concepts for all images using Gemini (without applying tags)

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { createNewConceptsFromImage } from '../src/jobs/tagging';
import { canonicalizeImage } from '../src/lib/embeddings';

async function main() {
  console.log('🎨 Generating concepts for images currently in use on the site...\n');

  // Get all sites that have active images
  const activeSites = await prisma.site.findMany({
    where: {
      imageUrl: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      url: true,
      imageUrl: true,
    },
  });

  console.log(`📊 Found ${activeSites.length} sites with images in use\n`);

  // Find images that match the site imageUrl
  const imageIds = new Set<string>();
  const imagesToProcess: Array<{ id: string; url: string; site: { title: string; url: string } }> = [];

  for (const site of activeSites) {
    if (!site.imageUrl) continue;
    
    // Find the image that matches this site's imageUrl
    const image = await prisma.image.findFirst({
      where: {
        url: site.imageUrl,
      },
      include: {
        site: {
          select: {
            title: true,
            url: true,
          },
        },
      },
    });

    if (image && !imageIds.has(image.id)) {
      imageIds.add(image.id);
      imagesToProcess.push({
        id: image.id,
        url: image.url,
        site: {
          title: site.title,
          url: site.url,
        },
      });
    }
  }

  const images = imagesToProcess;
  console.log(`📊 Found ${images.length} unique images currently in use on the site\n`);

  let successCount = 0;
  let errorCount = 0;
  let totalConceptsCreated = 0;
  const errors: Array<{ imageId: string; error: string }> = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const siteInfo = `${image.site.title} (${image.site.url})`;
    
    console.log(`\n[${i + 1}/${images.length}] Processing image: ${image.id}`);
    console.log(`   Site: ${siteInfo}`);
    console.log(`   URL: ${image.url}`);

    try {
      // Fetch image buffer
      const res = await fetch(image.url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${image.url}`);
      }
      const ab = await res.arrayBuffer();
      const buf = Buffer.from(ab);

      // Generate concepts (without applying tags)
      const conceptIds = await createNewConceptsFromImage(image.id, buf);
      
      if (conceptIds && conceptIds.length > 0) {
        totalConceptsCreated += conceptIds.length;
        console.log(`   ✅ Created ${conceptIds.length} new concepts`);
      } else {
        console.log(`   ⚠️  No new concepts created (may have been merged into existing ones)`);
      }
      
      successCount++;
    } catch (error: any) {
      errorCount++;
      const errorMsg = error.message || String(error);
      errors.push({ imageId: image.id, error: errorMsg });
      console.error(`   ❌ Error: ${errorMsg}`);
    }

    // Small delay to avoid rate limiting with Gemini API
    if (i < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
  }

  console.log(`\n\n✨ Concept generation complete!`);
  console.log(`   ✅ Images processed: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   🎨 Total new concepts created: ${totalConceptsCreated}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors encountered:`);
    for (const { imageId, error } of errors) {
      console.log(`   ${imageId}: ${error}`);
    }
  }

  console.log(`\n📝 Next step: Run scripts/apply_tags_to_all_images.ts to apply the new concepts as tags`);
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

