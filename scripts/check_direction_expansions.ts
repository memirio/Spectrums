import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔍 Checking cached expansions for "direction" (category: "logo")\n')

  const cached = await prisma.$queryRawUnsafe<Array<{
    term: string
    category: string | null
    expansion: string
    source: string
    model: string
    createdAt: Date
  }>>(
    `SELECT term, category, expansion, source, model, "createdAt"
     FROM query_expansions
     WHERE term = $1 AND category = $2 AND source = $3
     ORDER BY "createdAt" DESC
     LIMIT 10`,
    'direction',
    'logo',
    'groq'
  )

  if (cached.length === 0) {
    console.log('❌ No cached expansions found for "direction" (category: "logo")')
    console.log('💡 This means new expansions will be generated with the updated logo instructions!')
  } else {
    console.log(`✅ Found ${cached.length} cached expansion(s):\n`)
    cached.forEach((exp, i) => {
      console.log(`  ${i + 1}. "${exp.expansion}"`)
      console.log(`     Model: ${exp.model}`)
      console.log(`     Created: ${exp.createdAt.toISOString()}\n`)
    })
    
    // Check if they contain logo-specific terms
    const logoTerms = ['symbol', 'icon', 'letterform', 'mark', 'typography', 'iconography']
    const hasLogoTerms = cached.some(exp => 
      logoTerms.some(term => exp.expansion.toLowerCase().includes(term))
    )
    
    if (hasLogoTerms) {
      console.log('✅ Expansions contain logo-specific terms (symbol, icon, letterform, etc.)')
    } else {
      console.log('⚠️  Expansions do NOT contain logo-specific terms')
      console.log('💡 These may be old expansions. Clear cache to regenerate with new instructions.')
    }
  }
}

main().catch(console.error)

