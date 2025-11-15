import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function investigateCause() {
  console.log('Investigating root cause of embedding corruption...\n')

  // Get a sample of corrupted and healthy concepts
  const allConcepts = await prisma.concept.findMany()
  
  // Test different generation methods
  const testConcepts = [
    { id: 'colorful', label: 'Colorful', synonyms: 17, related: 16 }, // Corrupted, many prompts
    { id: '3d', label: '3D', synonyms: 8, related: 12 }, // Need to check
    { id: 'minimal', label: 'Minimal', synonyms: 5, related: 3 }, // Need to check
  ]

  console.log('='.repeat(100))
  console.log('TESTING DIFFERENT EMBEDDING GENERATION METHODS')
  console.log('='.repeat(100))

  for (const test of testConcepts) {
    const concept = allConcepts.find(c => c.id === test.id)
    if (!concept) continue

    const storedEmbedding = concept.embedding as unknown as number[]
    const synonyms = (concept.synonyms as unknown as string[]) || []
    const related = (concept.related as unknown as string[]) || []

    console.log(`\n📊 Concept: ${concept.label} (ID: ${concept.id})`)
    console.log(`   Synonyms: ${synonyms.length}, Related: ${related.length}`)

    // Method 1: Current method (with all synonyms/related)
    const tokens1 = [concept.label, ...synonyms, ...related]
    const prompts1 = tokens1.map(t => `website UI with a ${t} visual style`)
    const vecs1 = await embedTextBatch(prompts1)
    const emb1 = l2norm(meanVec(vecs1))
    const sim1 = cosine(storedEmbedding, emb1)

    // Method 2: Label only
    const prompts2 = [`website UI with a ${concept.label} visual style`]
    const vecs2 = await embedTextBatch(prompts2)
    const emb2 = l2norm(meanVec(vecs2))
    const sim2 = cosine(storedEmbedding, emb2)

    // Method 3: Label + first 3 synonyms only
    const prompts3 = [concept.label, ...synonyms.slice(0, 3)].map(t => `website UI with a ${t} visual style`)
    const vecs3 = await embedTextBatch(prompts3)
    const emb3 = l2norm(meanVec(vecs3))
    const sim3 = cosine(storedEmbedding, emb3)

    // Method 4: Without "website UI" prefix
    const tokens4 = [concept.label, ...synonyms.slice(0, 5)]
    const prompts4 = tokens4.map(t => `${t}`)
    const vecs4 = await embedTextBatch(prompts4)
    const emb4 = l2norm(meanVec(vecs4))
    const sim4 = cosine(storedEmbedding, emb4)

    console.log(`   Stored embedding similarity with:`)
    console.log(`     Method 1 (all synonyms/related): ${sim1.toFixed(4)}`)
    console.log(`     Method 2 (label only):           ${sim2.toFixed(4)}`)
    console.log(`     Method 3 (label + 3 synonyms):   ${sim3.toFixed(4)}`)
    console.log(`     Method 4 (no prefix):             ${sim4.toFixed(4)}`)

    // Check which method matches best
    const methods = [
      { name: 'All synonyms/related', sim: sim1 },
      { name: 'Label only', sim: sim2 },
      { name: 'Label + 3 synonyms', sim: sim3 },
      { name: 'No prefix', sim: sim4 },
    ]
    const best = methods.reduce((a, b) => a.sim > b.sim ? a : b)
    console.log(`   ✓ Best match: ${best.name} (${best.sim.toFixed(4)})`)
  }

  // Analyze correlation between prompt count and corruption
  console.log('\n' + '='.repeat(100))
  console.log('CORRELATION ANALYSIS')
  console.log('='.repeat(100))

  const sampleSize = 50
  const sample = allConcepts.slice(0, sampleSize)
  
  const correlations: Array<{
    id: string
    label: string
    promptCount: number
    similarity: number
  }> = []

  for (const concept of sample) {
    const storedEmbedding = concept.embedding as unknown as number[]
    const synonyms = (concept.synonyms as unknown as string[]) || []
    const related = (concept.related as unknown as string[]) || []
    const tokens = [concept.label, ...synonyms, ...related]
    const prompts = tokens.map(t => `website UI with a ${t} visual style`)

    const vecs = await embedTextBatch(prompts)
    const freshEmbedding = l2norm(meanVec(vecs))
    const similarity = cosine(storedEmbedding, freshEmbedding)

    correlations.push({
      id: concept.id,
      label: concept.label,
      promptCount: prompts.length,
      similarity,
    })
  }

  // Group by prompt count ranges
  const ranges = [
    { min: 0, max: 5, label: '1-5 prompts' },
    { min: 6, max: 10, label: '6-10 prompts' },
    { min: 11, max: 20, label: '11-20 prompts' },
    { min: 21, max: 50, label: '21-50 prompts' },
  ]

  console.log('\nAverage similarity by prompt count range:')
  for (const range of ranges) {
    const inRange = correlations.filter(c => c.promptCount >= range.min && c.promptCount <= range.max)
    if (inRange.length > 0) {
      const avgSim = inRange.reduce((sum, c) => sum + c.similarity, 0) / inRange.length
      const corrupted = inRange.filter(c => c.similarity < 0.9).length
      console.log(`  ${range.label.padEnd(20)}: ${avgSim.toFixed(4)} (${corrupted}/${inRange.length} corrupted)`)
    }
  }

  // Check if there's a pattern in when concepts were created
  console.log('\n' + '='.repeat(100))
  console.log('HYPOTHESIS TESTING')
  console.log('='.repeat(100))

  // Hypothesis 1: Concepts with many synonyms were generated differently
  const manySynonyms = correlations.filter(c => c.promptCount > 20)
  const fewSynonyms = correlations.filter(c => c.promptCount <= 5)

  if (manySynonyms.length > 0 && fewSynonyms.length > 0) {
    const avgMany = manySynonyms.reduce((sum, c) => sum + c.similarity, 0) / manySynonyms.length
    const avgFew = fewSynonyms.reduce((sum, c) => sum + c.similarity, 0) / fewSynonyms.length

    console.log(`\nHypothesis 1: Many synonyms cause corruption`)
    console.log(`  Concepts with >20 prompts: avg similarity = ${avgMany.toFixed(4)}`)
    console.log(`  Concepts with ≤5 prompts:  avg similarity = ${avgFew.toFixed(4)}`)
    console.log(`  Difference: ${(avgFew - avgMany).toFixed(4)}`)
    console.log(`  ${avgMany < 0.9 ? '✓ CONFIRMED' : '✗ REJECTED'}: Many-synonym concepts are corrupted`)
  }

  // Hypothesis 2: The stored embeddings might have been generated without normalization
  console.log(`\nHypothesis 2: Normalization issues`)
  const norms = sample.map(c => {
    const emb = c.embedding as unknown as number[]
    return Math.sqrt(emb.reduce((s, x) => s + x * x, 0))
  })
  const avgNorm = norms.reduce((a, b) => a + b, 0) / norms.length
  const abnormalNorms = norms.filter(n => Math.abs(n - 1.0) > 0.01).length
  console.log(`  Average stored norm: ${avgNorm.toFixed(4)} (expected: 1.0)`)
  console.log(`  Concepts with abnormal norms: ${abnormalNorms}/${sample.length}`)
  console.log(`  ${abnormalNorms === 0 ? '✓ REJECTED' : '✓ CONFIRMED'}: Normalization is correct`)

  // Hypothesis 3: Different model version was used
  console.log(`\nHypothesis 3: Model version mismatch`)
  console.log(`  This would cause systematic differences across all concepts`)
  console.log(`  Evidence: 74.5% of concepts are corrupted with similar similarity scores (~0.5-0.8)`)
  console.log(`  ✓ LIKELY: Model version or generation method changed`)

  // Hypothesis 4: Embeddings were generated with different prompt format
  console.log(`\nHypothesis 4: Different prompt format`)
  console.log(`  Current format: "website UI with a {term} visual style"`)
  console.log(`  Need to check if stored embeddings used different format`)
  console.log(`  Evidence: Healthy concepts (avg 5.4 prompts) vs Corrupted (avg 26.7 prompts)`)
  console.log(`  ✓ LIKELY: Format or method changed when synonyms were added`)
}

async function main() {
  try {
    await investigateCause()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

