import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking Logo category entries...\n')
  
  const sites = await prisma.site.findMany({
    where: {
      url: {
        contains: 'behance.net/gallery/239564835/LOGOS-MARKS-C02'
      }
    },
    include: {
      images: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log(`Found ${sites.length} entries\n`)
  
  // Extract numbers from titles
  const entries = sites.map(site => {
    const match = site.title.match(/- (\d+)$/)
    const number = match ? parseInt(match[1]) : null
    return {
      number,
      title: site.title,
      url: site.url,
      id: site.id,
      imageCount: site.images.length,
      createdAt: site.createdAt
    }
  })
  
  // Sort by number
  entries.sort((a, b) => {
    if (a.number === null) return 1
    if (b.number === null) return -1
    return a.number - b.number
  })
  
  console.log('Entries found:')
  entries.forEach(entry => {
    console.log(`  ${entry.number !== null ? `#${entry.number}` : '?'}: ${entry.title}`)
    console.log(`    URL: ${entry.url}`)
    console.log(`    Images: ${entry.imageCount}`)
    console.log(`    ID: ${entry.id}`)
    console.log('')
  })
  
  // Check for missing numbers
  const numbers = entries.filter(e => e.number !== null).map(e => e.number!)
  const expected = Array.from({ length: 13 }, (_, i) => i + 1)
  const missing = expected.filter(n => !numbers.includes(n))
  
  if (missing.length > 0) {
    console.log(`⚠️  Missing entries: ${missing.join(', ')}`)
  } else {
    console.log('✅ All entries 1-13 are present')
  }
}

main().catch(console.error)

