import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

// Extract title from URL
function extractTitleFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const hostname = u.hostname.replace(/^www\./, '')
    const pathParts = u.pathname.split('/').filter(Boolean)
    
    if (pathParts.length > 0 && pathParts[pathParts.length - 1] !== 'en' && pathParts[pathParts.length - 1] !== 'index.html') {
      const lastPart = pathParts[pathParts.length - 1]
      // Capitalize first letter of each word
      const title = lastPart
        .split(/[-_]/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      return title
    }
    
    // Use hostname as title
    const domainParts = hostname.split('.')
    const mainPart = domainParts.length >= 2 ? domainParts[0] : hostname.split('.')[0]
    return mainPart.charAt(0).toUpperCase() + mainPart.slice(1)
  } catch {
    return 'Untitled'
  }
}

// Extract author/brand from URL
function extractAuthorFromUrl(url: string): string | null {
  try {
    const u = new URL(url)
    const hostname = u.hostname.replace(/^www\./, '')
    const domainParts = hostname.split('.')
    
    // Take the main domain part as author
    if (domainParts.length >= 2) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
    }
    
    return null
  } catch {
    return null
  }
}

const urls = [
  'https://disantinowater.com/',
  'https://15th.plus-ex.com/',
  'https://esarj.com/en',
  'https://hertzwerk.ch/',
  'https://www.orthofx.com/',
  'https://techunt.fr/',
  'https://summitsystems.co.uk/',
  'https://minitap.ai/',
  'https://www.scorecard.io/',
  'https://innerworldsinc.com/home.html',
  'http://tobikodata.com/',
  'https://orage.studio/',
  'https://www.quantamagazine.org/how-we-came-to-know-earth-20250915/',
  'https://portfolio-25-phi.vercel.app/',
  'https://mainlabs.ai/',
  'https://www.hut8.com/',
  'https://zipvoyager.com/',
  'https://mygom.tech/',
  'https://www.jerimybrown.com/index.html',
  'https://www.sofiatnafiu.com/',
  'https://lnb.fr/en',
  'https://untold.site/en',
  'https://mojostudio.co/',
  'https://odysseycontracting.com/',
  'https://www.anuchome.com/',
  'https://designmonks.co/',
  'https://www.oroya.fr/',
  'https://wonjyou.studio/',
  'https://landonorris.com/',
  'https://www.oversour.studio/',
  'https://25.hgcapital.com/',
  'https://ponpon-mania.com/',
  'https://www.drinkzoi.co/',
  'https://unstructured.io/',
  'https://www.barntilbords.no/',
  'https://toptier.relats.com/',
  'https://www.pixelmatters.com/',
  'https://www.tolkienstory.ca/',
  'https://www.omaya-yachts.com/',
  'https://www.lacrapulestudio.com/',
  'https://www.builtkindly.com/',
  'https://readymag.com/websites-of-the-year?utm_source=awwwards&utm_medium=partnership_submission&utm_campaign=woty25',
  'https://www.arbordentalnyc.com/',
  'https://fableco.uk/',
  'https://basis.work/',
  'https://neuracore.uprock.pro/',
  'https://mitchivin.com/',
  'https://www.poison.studio/',
  'https://uglyuiclub.figma.site/',
  'https://www.folllit.com/',
]

async function main() {
  console.log(`📝 Adding ${urls.length} sites to database...\n`)
  
  let added = 0
  let skipped = 0
  let errors = 0
  
  for (const url of urls) {
    try {
      const normalizedUrl = url.replace(/\/$/, '').split('?')[0] // Remove trailing slash and query params for comparison
      
      // Check if site already exists
      const existing = await prisma.site.findFirst({
        where: { url: { contains: normalizedUrl } }
      })
      
      if (existing) {
        console.log(`⏭️  Skipping ${url} (already exists)`)
        skipped++
        continue
      }
      
      const title = extractTitleFromUrl(url)
      const author = extractAuthorFromUrl(url)
      
      console.log(`➕ Adding: ${title}`)
      console.log(`   URL: ${normalizedUrl}`)
      
      // Create site directly in database
      // Screenshots will be generated when API is called later or via separate script
      const site = await prisma.site.create({
        data: {
          title,
          description: '',
          url: normalizedUrl,
          imageUrl: null, // Will be generated via screenshot service or API
          author: author || null,
          tags: {
            create: []
          }
        }
      })
      
      console.log(`   ✅ Created: ${site.id}`)
      console.log(`   📸 Screenshot: Will be generated when API is called`)
      console.log()
      
      added++
      
    } catch (e: any) {
      console.error(`❌ Error adding ${url}:`, e.message || e)
      console.log()
      errors++
    }
  }
  
  console.log('═'.repeat(60))
  console.log(`📊 Summary:`)
  console.log(`   ✅ Added:   ${added}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors:  ${errors}`)
  console.log(`   📊 Total:    ${urls.length}`)
  console.log('═'.repeat(60))
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Ensure dev server is running: npm run dev`)
  console.log(`   2. Generate screenshots: npx tsx scripts/generate-screenshots-for-existing-sites.ts`)
  console.log(`   3. Screenshots will be auto-tagged when images are created`)
}

main()
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

