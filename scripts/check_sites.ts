import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const siteCount = await prisma.site.count()
    console.log(`Total sites in database: ${siteCount}`)
    
    if (siteCount === 0) {
      console.log('\n⚠️  No sites found in database.')
      console.log('\nTo add sites, you can:')
      console.log('  1. Use the submission form in the UI')
      console.log('  2. POST to /api/sites endpoint')
      console.log('  3. Run seed scripts if available')
      return
    }
    
    const sites = await prisma.site.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        tags: {
          include: { tag: true }
        }
      }
    })
    
    console.log(`\nLast ${sites.length} sites:\n`)
    console.log('═'.repeat(100))
    console.log(
      'ID'.padEnd(12) +
      'Title'.padEnd(30) +
      'URL'.padEnd(40) +
      'Images'.padEnd(10) +
      'Tags'
    )
    console.log('═'.repeat(100))
    
    for (const site of sites) {
      const id = site.id.slice(0, 11) + (site.id.length > 11 ? '...' : '')
      const title = (site.title.length > 28 ? site.title.slice(0, 25) + '...' : site.title).padEnd(30)
      const url = (site.url.length > 38 ? site.url.slice(0, 35) + '...' : site.url).padEnd(40)
      const imageCount = site.images.length.toString().padEnd(10)
      const tagNames = site.tags.map(st => st.tag.name).join(', ') || '(none)'
      
      console.log(`${id} ${title} ${url} ${imageCount} ${tagNames}`)
    }
    
    console.log('═'.repeat(100))
    
    const sitesWithImages = await prisma.site.count({
      where: { images: { some: {} } }
    })
    
    console.log(`\nSites with images: ${sitesWithImages}/${siteCount}`)
  } catch (e: any) {
    console.error('❌ Error:', e.message || e)
    if (e.code === 'P1001') {
      console.error('\n⚠️  Cannot reach database.')
      console.error('   Check that DATABASE_URL in .env points to a valid SQLite file')
    }
    process.exit(1)
  }
}

main().finally(() => prisma.$disconnect())

