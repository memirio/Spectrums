import 'dotenv/config'
import { expandAbstractQuery } from '../src/lib/query-expansion'

async function testLogoExpansions() {
  console.log('🧪 Testing Logo Category Semantic Extensions\n')
  console.log('='.repeat(60))
  
  const testQueries = [
    'direction'
  ]
  
  for (const query of testQueries) {
    console.log(`\n📝 Query: "${query}"`)
    console.log('-'.repeat(60))
    
    try {
      const expansions = await expandAbstractQuery(query, 'logo')
      console.log(`✅ Generated ${expansions.length} expansions:`)
      expansions.forEach((exp, idx) => {
        console.log(`   ${idx + 1}. ${exp}`)
      })
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`)
    }
    
    // Small delay between queries
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Testing complete!')
}

testLogoExpansions().catch(console.error)

