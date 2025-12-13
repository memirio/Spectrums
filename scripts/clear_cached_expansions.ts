import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function clearCachedExpansions(term: string, category: string) {
  try {
    console.log(`🗑️  Clearing cached expansions for "${term}" (category: "${category}")...`)
    
    const result = await prisma.$executeRawUnsafe(
      `DELETE FROM "query_expansions" WHERE "term" = $1 AND "category" = $2 AND "source" = $3`,
      term.toLowerCase(),
      category,
      'groq'
    )
    
    console.log(`✅ Cleared ${result} cached expansion(s)`)
    console.log(`\n💡 Next time you search for "${term}" in the "${category}" category, it will regenerate with the new instructions!`)
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('Usage: tsx scripts/clear_cached_expansions.ts <term> <category>')
    console.log('Example: tsx scripts/clear_cached_expansions.ts direction logo')
    process.exit(1)
  }
  
  const [term, category] = args
  await clearCachedExpansions(term, category)
}

main().catch(console.error)

