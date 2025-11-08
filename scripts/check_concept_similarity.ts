import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const queryPhrase = process.argv[2]
  
  if (!queryPhrase) {
    console.error('Usage: npx tsx scripts/check_concept_similarity.ts "your query phrase"')
    console.error('Example: npx tsx scripts/check_concept_similarity.ts "playful gradient 3d"')
    process.exit(1)
  }
  
  // Embed the query phrase
  console.log(`Query: "${queryPhrase}"`)
  console.log('Embedding query...')
  const [queryVec] = await embedTextBatch([queryPhrase])
  
  // Load all concepts
  const concepts = await prisma.concept.findMany({
    orderBy: { id: 'asc' },
  })
  
  if (concepts.length === 0) {
    console.error('No concepts found. Run: npx tsx scripts/seed_concepts.ts')
    process.exit(1)
  }
  
  // Score against all concepts
  const scored = concepts.map(c => ({
    id: c.id,
    label: c.label,
    score: cosine(queryVec, (c.embedding as unknown as number[]) || []),
  }))
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)
  
  // Print top 10
  console.log(`\nTop 10 nearest concepts (by cosine similarity):`)
  console.log('─'.repeat(80))
  
  for (const item of scored.slice(0, 10)) {
    const barLength = Math.floor(item.score * 50)
    const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength)
    console.log(`${item.score.toFixed(3)} ${bar} ${item.id} (${item.label})`)
  }
  
  console.log(`\nTotal concepts checked: ${concepts.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

