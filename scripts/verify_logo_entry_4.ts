import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Verifying Logo Entry #4\n')
  
  const site = await prisma.site.findFirst({
    where: {
      title: 'LOGOS & MARKS C02 - 4'
    },
    include: {
      images: {
        include: {
          embedding: true
        }
      }
    }
  })
  
  if (!site) {
    console.error('❌ Entry #4 not found')
    process.exit(1)
  }
  
  console.log(`Site:`)
  console.log(`  ID: ${site.id}`)
  console.log(`  Title: ${site.title}`)
  console.log(`  URL: ${site.url}`)
  console.log(`  Images: ${site.images.length}\n`)
  
  site.images.forEach((img, idx) => {
    console.log(`Image ${idx + 1}:`)
    console.log(`  ID: ${img.id}`)
    console.log(`  URL: ${img.url}`)
    console.log(`  Category: ${img.category || 'null'}`)
    console.log(`  Has Embedding: ${img.embedding ? 'Yes' : 'No'}`)
    console.log('')
  })
  
  // Check if it would appear in logo category query
  const logoImages = site.images.filter(img => img.category === 'logo')
  console.log(`Images with category='logo': ${logoImages.length}`)
  
  if (logoImages.length === 0) {
    console.log(`\n⚠️  WARNING: Entry #4 has images but none have category='logo'`)
    console.log(`   This is why it's not showing in the logo category!`)
  } else {
    console.log(`\n✅ Entry #4 should appear in the logo category`)
  }
}

main().catch(console.error)

