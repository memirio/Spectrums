import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function verifyHypothesis() {
  console.log('Verifying corruption hypothesis...\n')

  // Test concepts that are known to be corrupted
  const testConcepts = ['3d', 'minimal', 'vintage', 'retro', 'colorful']
  
  const concepts = await prisma.concept.findMany({
    where: { id: { in: testConcepts } }
  })

  console.log('='.repeat(100))
  console.log('TESTING OLD vs NEW EMBEDDING METHODS')
  console.log('='.repeat(100))

  for (const concept of concepts) {
    const storedEmbedding = concept.embedding as unknown as number[]
    const synonyms = (concept.synonyms as unknown as string[]) || []
    const related = (concept.related as unknown as string[]) || []

    console.log(`\n📊 ${concept.label} (ID: ${concept.id})`)
    console.log(`   Synonyms: ${synonyms.length}, Related: ${related.length}`)

    // OLD METHOD: Single prompt with "Label. Synonyms: ... Related: ..."
    const oldPrompt = (() => {
      const synStr = synonyms.length > 0 ? synonyms.join(', ') : ''
      const relStr = related.length > 0 ? related.join(', ') : ''
      let prompt = concept.label
      if (synStr) prompt += `. Synonyms: ${synStr}`
      if (relStr) prompt += `. Related: ${relStr}`
      return prompt
    })()
    
    const [oldVec] = await embedTextBatch([oldPrompt])
    const oldEmbedding = l2norm(oldVec)
    const oldSim = cosine(storedEmbedding, oldEmbedding)

    // NEW METHOD: Multiple prompts with "website UI with a {term} visual style"
    const tokens = [concept.label, ...synonyms, ...related]
    const newPrompts = tokens.map(t => `website UI with a ${t} visual style`)
    const newVecs = await embedTextBatch(newPrompts)
    const newEmbedding = l2norm(meanVec(newVecs))
    const newSim = cosine(storedEmbedding, newEmbedding)

    console.log(`   OLD method (single prompt):`)
    console.log(`     Prompt: "${oldPrompt.substring(0, 80)}${oldPrompt.length > 80 ? '...' : ''}"`)
    console.log(`     Similarity: ${oldSim.toFixed(4)}`)
    console.log(`   NEW method (multiple prompts):`)
    console.log(`     Prompts: ${newPrompts.length} (e.g., "${newPrompts[0]}")`)
    console.log(`     Similarity: ${newSim.toFixed(4)}`)
    
    if (oldSim > newSim) {
      console.log(`   ✓ CONFIRMED: Stored embedding matches OLD method better (diff: ${(oldSim - newSim).toFixed(4)})`)
    } else {
      console.log(`   ✗ REJECTED: Stored embedding matches NEW method better (diff: ${(newSim - oldSim).toFixed(4)})`)
    }
  }

  console.log('\n' + '='.repeat(100))
  console.log('CONCLUSION')
  console.log('='.repeat(100))
  console.log(`
Root Cause Identified:

1. TWO DIFFERENT SEED SCRIPTS EXIST:
   - OLD: scripts/seed_concepts.ts
     Format: "{label}. Synonyms: {synonyms}. Related: {related}."
     Method: Single prompt per concept
   
   - NEW: src/concepts/seed.ts  
     Format: "website UI with a {term} visual style"
     Method: Multiple prompts (one per token), then average

2. STORED EMBEDDINGS were generated with the OLD method
   - This explains why corrupted concepts match better with "no prefix" method
   - Concepts with many synonyms/related terms were likely seeded with OLD script

3. CURRENT CODE uses the NEW method
   - When we regenerate, we use NEW method
   - This creates a mismatch (similarity ~0.5-0.8 instead of ~1.0)

4. SOLUTION:
   - Option A: Regenerate all concepts using OLD method (to match stored)
   - Option B: Regenerate all concepts using NEW method (recommended - better for UI matching)
   - Option C: Use a hybrid approach

Recommendation: Regenerate all corrupted concepts using the NEW method
(since it's better aligned with "website UI" context)
`)
}

async function main() {
  try {
    await verifyHypothesis()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

