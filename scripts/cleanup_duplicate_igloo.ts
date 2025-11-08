/**
 * Clean up duplicate igloo.inc entries
 * Keep the one with the most complete data (has image and tags)
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🧹 Cleaning up duplicate igloo.inc entries...\n')
  
  const sites = await prisma.site.findMany({
    where: { url: { contains: 'igloo.inc' } },
    include: { 
      images: true,
      tags: true,
    },
    orderBy: { createdAt: 'desc' }, // Most recent first
  })
  
  console.log(`Found ${sites.length} sites with igloo.inc\n`)
  
  // Find the best site (has image and tags)
  let bestSite = sites.find(s => s.images.length > 0 && s.tags.length > 0)
  if (!bestSite) {
    // Fallback: find one with image
    bestSite = sites.find(s => s.images.length > 0)
  }
  if (!bestSite) {
    // Fallback: find one with tags
    bestSite = sites.find(s => s.tags.length > 0)
  }
  if (!bestSite) {
    // Last resort: keep the most recent
    bestSite = sites[0]
  }
  
  if (!bestSite) {
    console.log('❌ No sites found to keep')
    return
  }
  
  console.log(`✅ Keeping site: ${bestSite.id}`)
  console.log(`   URL: ${bestSite.url}`)
  console.log(`   Images: ${bestSite.images.length}`)
  console.log(`   Tags: ${bestSite.tags.length}`)
  console.log(`   Created: ${bestSite.createdAt.toISOString()}\n`)
  
  // Delete all other sites
  const sitesToDelete = sites.filter(s => s.id !== bestSite!.id)
  console.log(`🗑️  Deleting ${sitesToDelete.length} duplicate sites...\n`)
  
  for (const site of sitesToDelete) {
    console.log(`   Deleting: ${site.id} (${site.images.length} images, ${site.tags.length} tags)`)
    await prisma.site.delete({
      where: { id: site.id },
    })
  }
  
  console.log(`\n✅ Cleanup complete! Kept 1 site, deleted ${sitesToDelete.length} duplicates`)
}

main()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

