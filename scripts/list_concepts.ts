import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const concepts = await prisma.concept.findMany({
    orderBy: { id: 'asc' },
  })
  
  if (concepts.length === 0) {
    console.log('No concepts found. Run: npx tsx scripts/seed_concepts.ts')
    process.exit(1)
  }
  
  console.log(`Total concepts: ${concepts.length}\n`)
  console.log('Sample concepts (first 10):')
  console.log('─'.repeat(80))
  
  for (const c of concepts.slice(0, 10)) {
    const synonyms = (c.synonyms as unknown as string[]) || []
    const related = (c.related as unknown as string[]) || []
    const emb = (c.embedding as unknown as number[]) || []
    
    console.log(`${c.id.padEnd(25)} ${c.label.padEnd(20)}`)
    console.log(`  Synonyms (${synonyms.length}): ${synonyms.slice(0, 5).join(', ')}${synonyms.length > 5 ? '...' : ''}`)
    console.log(`  Related (${related.length}): ${related.slice(0, 5).join(', ')}${related.length > 5 ? '...' : ''}`)
    console.log(`  Embedding: dim=${emb.length} norm=${Math.sqrt(emb.reduce((s, x) => s + x * x, 0)).toFixed(3)}`)
    console.log()
  }
  
  if (concepts.length > 10) {
    console.log(`... and ${concepts.length - 10} more`)
  }
  
  // Statistics
  const avgSynonyms = concepts.reduce((sum, c) => {
    const syn = (c.synonyms as unknown as string[]) || []
    return sum + syn.length
  }, 0) / concepts.length
  
  const avgRelated = concepts.reduce((sum, c) => {
    const rel = (c.related as unknown as string[]) || []
    return sum + rel.length
  }, 0) / concepts.length
  
  console.log('\nStatistics:')
  console.log(`  Average synonyms per concept: ${avgSynonyms.toFixed(1)}`)
  console.log(`  Average related terms per concept: ${avgRelated.toFixed(1)}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

