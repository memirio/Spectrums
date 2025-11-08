import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    console.log('📊 Fetching last 20 images...\n')
    
    const images = await prisma.image.findMany({
      take: 20,
      orderBy: { id: 'desc' },
      include: {
        embedding: true,
        site: true,
      },
    })
    
    if (images.length === 0) {
      console.log('⚠️  No images found in database.')
      console.log('   Tip: Create an image via POST /api/sites or use a seed script.')
      return
    }
    
    console.log(`Found ${images.length} images (showing latest):\n`)
    console.log('═'.repeat(100))
    console.log(
      'ID'.padEnd(12) +
      'URL'.padEnd(45) +
      'Size'.padEnd(12) +
      'Hash'.padEnd(17) +
      'Embed'
    )
    console.log('═'.repeat(100))
    
    for (const img of images) {
      const id = img.id.slice(0, 11) + (img.id.length > 11 ? '...' : '')
      const url = (img.url.length > 42 ? img.url.slice(0, 39) + '...' : img.url).padEnd(45)
      const size = img.width && img.height 
        ? `${img.width}×${img.height}`.padEnd(12)
        : '?×?'.padEnd(12)
      const hash = img.embedding?.contentHash
        ? (img.embedding.contentHash as string).slice(0, 14) + '...'
        : 'NO_HASH'
      const hasEmbedding = img.embedding ? '✓' : '✗'
      
      console.log(`${id} ${url} ${size} ${hash.padEnd(17)} ${hasEmbedding}`)
    }
    
    console.log('═'.repeat(100))
    console.log(`\nTotal images in database: ${await prisma.image.count()}`)
    
    const withEmbeddings = await prisma.image.count({
      where: { embedding: { isNot: null } },
    })
    const withoutEmbeddings = await prisma.image.count({
      where: { embedding: null },
    })
    
    console.log(`  With embeddings: ${withEmbeddings}`)
    console.log(`  Without embeddings: ${withoutEmbeddings}`)
    
    if (withoutEmbeddings > 0) {
      console.log(`\n💡 Tip: Run 'npx tsx scripts/backfill_tagging.ts' to compute missing embeddings.`)
    }
  } catch (e: any) {
    console.error('❌ Error:', e.message || e)
    if (e.code === 'P1001') {
      console.error('\n⚠️  Cannot reach database.')
      console.error('   Check that:')
      console.error('   1. DATABASE_URL in .env points to a valid SQLite file')
      console.error('   2. The database file exists (run: npx prisma migrate dev)')
    } else if (e.message?.includes('does not exist')) {
      console.error('\n⚠️  Database file does not exist.')
      console.error('   Run: npx prisma migrate dev')
    } else if (e.stack) {
      console.error('\nStack trace:')
      console.error(e.stack)
    }
    process.exit(1)
  }
}

main()
  .finally(() => prisma.$disconnect())

