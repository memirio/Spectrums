import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

async function regenerateColorfulEmbedding() {
  console.log('Regenerating "colorful" concept embedding...\n')

  // Get current colorful concept
  const colorful = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })
  if (!colorful) {
    console.log('❌ Colorful concept not found')
    return
  }

  console.log(`Current concept: ${colorful.label} (ID: ${colorful.id})`)
  const synonyms = (colorful.synonyms as unknown as string[]) || []
  const related = (colorful.related as unknown as string[]) || []
  console.log(`Synonyms: ${synonyms.length}, Related: ${related.length}\n`)

  // Generate new embedding using the same method as seed.ts
  const tokens = [colorful.label, ...synonyms, ...related]
  const prompts = tokens.map(t => `website UI with a ${t} visual style`)
  
  console.log(`Generating embedding from ${prompts.length} prompts...`)
  const vecs = await embedTextBatch(prompts)
  
  if (vecs.length === 0) {
    console.log('❌ No embeddings generated')
    return
  }

  const avg = meanVec(vecs)
  const newEmbedding = l2norm(avg)

  console.log(`✓ Generated new embedding (${newEmbedding.length} dimensions)\n`)

  // Update the concept in database
  console.log('Updating concept in database...')
  await prisma.concept.update({
    where: { id: 'colorful' },
    data: {
      embedding: newEmbedding as any
    }
  })

  console.log('✓ Successfully updated "colorful" concept embedding\n')

  // Verify the update
  const updated = await prisma.concept.findUnique({
    where: { id: 'colorful' }
  })
  
  if (updated) {
    const updatedEmbedding = updated.embedding as unknown as number[]
    console.log('Verification:')
    console.log(`  Embedding length: ${updatedEmbedding.length}`)
    console.log(`  First 5 values: ${updatedEmbedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}`)
    console.log('\n✓ Embedding successfully regenerated and stored!')
    console.log('\nNext steps:')
    console.log('  1. Re-tag all images to see improved "colorful" scores')
    console.log('  2. Or wait for new images to be tagged with the updated embedding')
  }
}

async function main() {
  try {
    await regenerateColorfulEmbedding()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

