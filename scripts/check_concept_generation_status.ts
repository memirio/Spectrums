// scripts/check_concept_generation_status.ts
// Check status of concept generation process

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

async function main() {
  console.log('🔍 Checking concept generation status...\n');

  // Count concepts in database
  const dbConcepts = await prisma.concept.count();
  console.log(`📚 Concepts in database: ${dbConcepts}`);

  // Count concepts in seed file
  try {
    const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json');
    const seedContent = await fs.readFile(seedPath, 'utf-8');
    const seedConcepts = JSON.parse(seedContent);
    console.log(`📄 Concepts in seed file: ${seedConcepts.length}`);
    
    // Find recently added concepts (those without embeddings in DB yet, or check creation)
    const recentConcepts = seedConcepts.slice(-50); // Last 50 concepts
    console.log(`\n🆕 Last 50 concepts added:`);
    for (const concept of recentConcepts.slice(-10)) {
      const exists = await prisma.concept.findUnique({
        where: { id: concept.id },
        select: { id: true, label: true },
      });
      const status = exists ? '✅ In DB' : '⚠️  Not in DB';
      console.log(`  • ${concept.label} (${concept.category}) - ${status}`);
    }
  } catch (e: any) {
    console.log(`❌ Error reading seed file: ${e.message}`);
  }

  // Check images in use
  const activeSites = await prisma.site.findMany({
    where: {
      imageUrl: {
        not: null,
      },
    },
    select: {
      id: true,
      imageUrl: true,
    },
  });

  console.log(`\n🖼️  Images in use: ${activeSites.length} sites`);

  // Count images with concepts applied vs without
  const imagesWithTags = await prisma.image.count({
    where: {
      tags: {
        some: {},
      },
    },
  });

  const totalImages = await prisma.image.count();
  console.log(`\n📊 Image Tag Status:`);
  console.log(`  Total images: ${totalImages}`);
  console.log(`  Images with tags: ${imagesWithTags} (${((imagesWithTags / totalImages) * 100).toFixed(1)}%)`);
  console.log(`  Images without tags: ${totalImages - imagesWithTags}`);

  // Check which images are in use but don't have tags
  const imageIdsInUse = new Set<string>();
  for (const site of activeSites) {
    if (site.imageUrl) {
      const image = await prisma.image.findFirst({
        where: { url: site.imageUrl },
        select: { id: true },
      });
      if (image) {
        imageIdsInUse.add(image.id);
      }
    }
  }

  const imagesInUseWithoutTags = await prisma.image.findMany({
    where: {
      id: {
        in: Array.from(imageIdsInUse),
      },
      tags: {
        none: {},
      },
    },
    select: {
      id: true,
      url: true,
    },
  });

  if (imagesInUseWithoutTags.length > 0) {
    console.log(`\n⚠️  Images in use without tags: ${imagesInUseWithoutTags.length}`);
    for (const img of imagesInUseWithoutTags.slice(0, 5)) {
      console.log(`  • ${img.id}: ${img.url}`);
    }
    if (imagesInUseWithoutTags.length > 5) {
      console.log(`  ... and ${imagesInUseWithoutTags.length - 5} more`);
    }
  } else {
    console.log(`\n✅ All images in use have tags!`);
  }

  // Show concept growth
  const allConcepts = await prisma.concept.findMany({
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      label: true,
    },
  });

  // Try to estimate new concepts (those with recent-looking IDs)
  // CUIDs encode timestamp, so newer IDs come later
  const recentConceptIds = allConcepts.slice(-20).map(c => c.id);
  console.log(`\n🆕 Recent concepts (last 20):`);
  for (const conceptId of recentConceptIds.slice(-10)) {
    const concept = await prisma.concept.findUnique({
      where: { id: conceptId },
      select: { label: true },
    });
    if (concept) {
      console.log(`  • ${concept.label}`);
    }
  }
}

main()
  .then(() => {
    console.log('\n✅ Status check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

