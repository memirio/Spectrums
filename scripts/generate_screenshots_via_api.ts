import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

async function generateViaAPI() {
  console.log('Generating screenshots via API endpoint...\n')
  
  const sites = await prisma.site.findMany({
    where: { images: { none: {} } },
    include: { images: true }
  })
  
  // Skip disantinowater.com
  const sitesToProcess = sites.filter(s => !s.url?.includes('disantinowater'))
  
  console.log(`Found ${sitesToProcess.length} sites to process\n`)
  
  if (sitesToProcess.length === 0) {
    console.log('All sites already have screenshots!')
    return
  }
  
  let successCount = 0
  let errorCount = 0
  
  for (const site of sitesToProcess) {
    console.log(`Processing: ${site.title} (${site.url})`)
    
    try {
      // Use the existing API route which handles screenshot generation
      const response = await fetch(`${API_URL}/api/sites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: site.title,
          url: site.url,
          author: site.author || '',
          description: '',
          imageUrl: '',
          tags: []
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`  ✅ Success - screenshot will be generated\n`)
        successCount++
        // Wait a bit between requests
        await new Promise(r => setTimeout(r, 2000))
      } else {
        const error = await response.text().catch(() => 'Unknown error')
        console.log(`  ❌ Failed: ${response.status} - ${error}\n`)
        errorCount++
      }
    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}\n`)
      errorCount++
    }
  }
  
  console.log(`\n✅ Done!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Total: ${sitesToProcess.length}`)
}

generateViaAPI()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

