import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

async function main() {
  try {
    console.log('📸 Triggering screenshots for sites without images via API...\n')
    
    // Get all sites that don't have an Image record
    const sites = await prisma.site.findMany({
      include: {
        images: true
      }
    })
    
    const sitesWithoutImages = sites.filter(site => site.images.length === 0)
    
    console.log(`Found ${sitesWithoutImages.length} sites without images (out of ${sites.length} total)\n`)
    
    if (sitesWithoutImages.length === 0) {
      console.log('✅ All sites already have images!')
      return
    }
    
    let successCount = 0
    let errorCount = 0
    
    for (const site of sitesWithoutImages) {
      console.log(`\n🔄 Triggering screenshot for: ${site.title}`)
      console.log(`   URL: ${site.url}`)
      
      try {
        // Call the API endpoint which will automatically:
        // 1. Generate screenshot
        // 2. Create Image record
        // 3. Generate embedding
        // 4. Create tags
        
        const response = await fetch(`${API_URL}/api/sites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: site.title,
            description: site.description || '',
            url: site.url,
            imageUrl: '', // Empty to trigger screenshot generation
            author: site.author || '',
            tags: []
          }),
        })
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.log(`   ❌ Failed: ${error.error || response.statusText}`)
          errorCount++
          continue
        }
        
        const data = await response.json()
        console.log(`   ✅ Screenshot generated and tagged: ${data.site?.imageUrl ? 'Yes' : 'No'}`)
        successCount++
        
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message || error}`)
        errorCount++
      }
    }
    
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`📊 Summary:`)
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📊 Total: ${sitesWithoutImages.length}`)
    console.log('═'.repeat(60))
    console.log(`\n💡 Note: Sites with duplicate URLs will be skipped.`)
    console.log(`   The API will automatically generate screenshots, create Image records,`)
    console.log(`   generate embeddings, and tag them!`)
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()

