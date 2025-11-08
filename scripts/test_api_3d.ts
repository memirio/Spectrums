import 'dotenv/config'

async function main() {
  console.log('🧪 Testing actual API endpoint for "3d"...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/search?q=3d')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    const sites = data.sites || []
    const images = data.images || []
    
    console.log(`Total results: ${sites.length}\n`)
    console.log('Top 10 results from API:\n')
    
    for (let i = 0; i < Math.min(10, sites.length); i++) {
      const site = sites[i]
      const imageData = images.find((img: any) => img.siteUrl === site.url)
      const hasDirectHits = imageData?.directHitsCount > 0
      const status = hasDirectHits ? '✅ HAS 3D' : '❌ NO 3D TAG'
      console.log(`${i + 1}. ${site.title || site.url}`)
      console.log(`   ${site.url}`)
      console.log(`   ${status} | score=${imageData?.score?.toFixed(3) || 'N/A'} | directHits=${imageData?.directHitsCount || 0}`)
      console.log()
    }
    
    const without3d = sites.slice(0, 10).filter((site: any) => {
      const imageData = images.find((img: any) => img.siteUrl === site.url)
      return imageData?.directHitsCount === 0
    })
    
    console.log(`\n⚠️  Sites WITHOUT 3d tag in top 10: ${without3d.length}`)
    if (without3d.length > 0) {
      console.log('\nProblem sites:')
      for (const site of without3d) {
        console.log(`  - ${site.title || site.url} | ${site.url}`)
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Make sure the dev server is running: npm run dev')
  }
}

main()

