// scripts/view_tags.ts
// View tags/concepts for images

import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage:
  npx tsx scripts/view_tags.ts [option]

Options:
  --concepts              Show all concepts/tags available
  --images                Show tags for all images
  --image <imageId>       Show tags for a specific image
  --site <siteId>         Show tags for images in a specific site
  --stats                 Show tag statistics
    `);
    process.exit(0);
  }

  if (args[0] === '--concepts') {
    console.log('📋 All Concepts/Tags:\n');
    
    const concepts = await prisma.concept.findMany({
      orderBy: {
        label: 'asc',
      },
      take: 100, // Limit for readability
    });

    console.log(`Total concepts: ${concepts.length}\n`);
    
    for (const concept of concepts) {
      const synonyms = (concept.synonyms as unknown as string[]) || [];
      const related = (concept.related as unknown as string[]) || [];
      
      console.log(`• ${concept.label} (id: ${concept.id})`);
      if (synonyms.length > 0) {
        console.log(`  Synonyms: ${synonyms.join(', ')}`);
      }
      if (related.length > 0) {
        console.log(`  Related: ${related.join(', ')}`);
      }
      console.log();
    }
    
    const total = await prisma.concept.count();
    if (total > 100) {
      console.log(`\n... and ${total - 100} more concepts\n`);
    }
  }

  if (args[0] === '--images') {
    console.log('🖼️  Tags for all images:\n');
    
    const images = await prisma.image.findMany({
      include: {
        site: {
          select: {
            title: true,
            url: true,
          },
        },
        tags: {
          include: {
            concept: true,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    for (const image of images) {
      console.log(`Image: ${image.id}`);
      console.log(`  Site: ${image.site.title} (${image.site.url})`);
      console.log(`  URL: ${image.url}`);
      
      if (image.tags.length === 0) {
        console.log(`  Tags: None\n`);
        continue;
      }
      
      console.log(`  Tags (${image.tags.length}):`);
      for (const tag of image.tags) {
        console.log(`    • ${tag.concept.label} (score: ${tag.score.toFixed(3)})`);
      }
      console.log();
    }
  }

  if (args[0] === '--image' && args[1]) {
    const imageId = args[1];
    
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        site: {
          select: {
            title: true,
            url: true,
          },
        },
        tags: {
          include: {
            concept: true,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
    });

    if (!image) {
      console.error(`Image not found: ${imageId}`);
      process.exit(1);
    }

    console.log(`Image: ${image.id}`);
    console.log(`  Site: ${image.site.title} (${image.site.url})`);
    console.log(`  URL: ${image.url}`);
    
    if (image.tags.length === 0) {
      console.log(`  Tags: None`);
    } else {
      console.log(`  Tags (${image.tags.length}):`);
      for (const tag of image.tags) {
        const synonyms = (tag.concept.synonyms as unknown as string[]) || [];
        const related = (tag.concept.related as unknown as string[]) || [];
        
        console.log(`    • ${tag.concept.label} (score: ${tag.score.toFixed(3)})`);
        if (synonyms.length > 0) {
          console.log(`      Synonyms: ${synonyms.join(', ')}`);
        }
        if (related.length > 0) {
          console.log(`      Related: ${related.join(', ')}`);
        }
      }
    }
  }

  if (args[0] === '--site' && args[1]) {
    const siteId = args[1];
    
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: {
        images: {
          include: {
            tags: {
              include: {
                concept: true,
              },
              orderBy: {
                score: 'desc',
              },
            },
          },
        },
      },
    });

    if (!site) {
      console.error(`Site not found: ${siteId}`);
      process.exit(1);
    }

    console.log(`Site: ${site.title} (${site.url})`);
    console.log(`  Images: ${site.images.length}\n`);
    
    for (const image of site.images) {
      console.log(`  Image: ${image.url}`);
      if (image.tags.length === 0) {
        console.log(`    Tags: None`);
      } else {
        console.log(`    Tags (${image.tags.length}):`);
        for (const tag of image.tags) {
          console.log(`      • ${tag.concept.label} (score: ${tag.score.toFixed(3)})`);
        }
      }
      console.log();
    }
  }

  if (args[0] === '--stats') {
    const totalConcepts = await prisma.concept.count();
    const totalImages = await prisma.image.count();
    const totalImageTags = await prisma.imageTag.count();
    
    const imagesWithTags = await prisma.image.count({
      where: {
        tags: {
          some: {},
        },
      },
    });

    const topConcepts = await prisma.imageTag.groupBy({
      by: ['conceptId'],
      _count: {
        conceptId: true,
      },
      orderBy: {
        _count: {
          conceptId: 'desc',
        },
      },
      take: 10,
    });

    const topConceptDetails = await Promise.all(
      topConcepts.map(async (tc) => {
        const concept = await prisma.concept.findUnique({
          where: { id: tc.conceptId },
        });
        return {
          concept: concept?.label || tc.conceptId,
          count: tc._count.conceptId,
        };
      })
    );

    console.log('📊 Tag Statistics:\n');
    console.log(`Total Concepts: ${totalConcepts}`);
    console.log(`Total Images: ${totalImages}`);
    console.log(`Images with Tags: ${imagesWithTags} (${((imagesWithTags / totalImages) * 100).toFixed(1)}%)`);
    console.log(`Total Image Tags: ${totalImageTags}`);
    console.log(`Average Tags per Image: ${(totalImageTags / totalImages).toFixed(1)}`);
    
    console.log(`\nTop 10 Most Used Tags:`);
    for (const { concept, count } of topConceptDetails) {
      console.log(`  • ${concept}: ${count} images`);
    }
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

