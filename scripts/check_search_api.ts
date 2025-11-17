#!/usr/bin/env tsx
/**
 * Check what the search API actually returns
 */

async function main() {
  const query = process.argv[2] || 'dark'
  const baseUrl = process.argv[3] || 'http://localhost:3000'
  
  console.log('═'.repeat(80))
  console.log(`🔍 Search API Results for "${query}"`)
  console.log('═'.repeat(80))
  console.log(`API: ${baseUrl}/api/search?q=${encodeURIComponent(query)}\n`)
  
  try {
    const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`)
      const text = await response.text()
      console.error(`Response: ${text}`)
      process.exit(1)
    }
    
    const data = await response.json()
    
    console.log(`✅ Response received`)
    console.log(`   Sites returned: ${data.sites?.length || 0}`)
    console.log(`   Images returned: ${data.images?.length || 0}`)
    console.log(`   Query: ${data.query || query}`)
    console.log()
    
    if (!data.sites || data.sites.length === 0) {
      console.log('⚠️  No sites returned')
      return
    }
    
    console.log('═'.repeat(80))
    console.log(`🏆 Top 10 Sites (as returned by API)`)
    console.log('═'.repeat(80))
    console.log()
    
    // Show top 10 sites
    const top10 = data.sites.slice(0, 10)
    for (let i = 0; i < top10.length; i++) {
      const site = top10[i]
      // Try to find the corresponding image score
      const image = data.images?.find((img: any) => 
        img.siteId === site.id || img.site?.id === site.id
      )
      const score = image?.score || image?.baseScore || 'N/A'
      const baseScore = image?.baseScore || 'N/A'
      const boost = image?.boost || 0
      
      console.log(`${(i + 1).toString().padStart(2)}. ${site.title?.padEnd(35) || 'Unknown'}`)
      console.log(`    URL:  ${site.url}`)
      if (typeof score === 'number') {
        const boostStr = boost > 0 ? ` (+${boost.toFixed(4)})` : ''
        console.log(`    Score: ${score.toFixed(4)} (Base: ${typeof baseScore === 'number' ? baseScore.toFixed(4) : 'N/A'}${boostStr})`)
      }
      console.log()
    }
    
    // Check if firstframe is in results
    const firstframeIndex = data.sites.findIndex((s: any) => 
      s.title?.toLowerCase().includes('firstframe') || 
      s.url?.toLowerCase().includes('firstframe')
    )
    
    if (firstframeIndex >= 0) {
      console.log('═'.repeat(80))
      console.log(`📍 firstframe.fr position: ${firstframeIndex + 1}`)
      const firstframe = data.sites[firstframeIndex]
      const firstframeImage = data.images?.find((img: any) => 
        img.siteId === firstframe.id || img.site?.id === firstframe.id
      )
      if (firstframeImage) {
        console.log(`   Score: ${firstframeImage.score?.toFixed(4) || 'N/A'}`)
        console.log(`   Base Score: ${firstframeImage.baseScore?.toFixed(4) || 'N/A'}`)
        console.log(`   Boost: ${firstframeImage.boost?.toFixed(4) || 0}`)
      }
      console.log('═'.repeat(80))
    } else {
      console.log('═'.repeat(80))
      console.log(`⚠️  firstframe.fr not found in results`)
      console.log('═'.repeat(80))
    }
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
    if (error.stack) {
      console.error(`Stack: ${error.stack.split('\n').slice(0, 5).join('\n')}`)
    }
    process.exit(1)
  }
}

main()

