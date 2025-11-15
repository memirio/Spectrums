import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

interface ConceptAnalysis {
  id: string
  label: string
  storedEmbedding: number[]
  freshEmbedding: number[]
  similarity: number
  synonymCount: number
  relatedCount: number
  totalPrompts: number
  isCorrupted: boolean
  storedNorm: number
  freshNorm: number
}

async function analyzeAllConcepts() {
  console.log('Analyzing all concepts for embedding corruption...\n')

  // Get all concepts
  const concepts = await prisma.concept.findMany({
    orderBy: { id: 'asc' }
  })

  console.log(`Total concepts: ${concepts.length}\n`)
  console.log('Processing concepts (this may take a while)...\n')

  const results: ConceptAnalysis[] = []
  const BATCH_SIZE = 10 // Process in batches to avoid memory issues

  for (let i = 0; i < concepts.length; i += BATCH_SIZE) {
    const batch = concepts.slice(i, i + BATCH_SIZE)
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(concepts.length / BATCH_SIZE)} (${batch.length} concepts)...`)

    for (const concept of batch) {
      try {
        const storedEmbedding = concept.embedding as unknown as number[]
        if (!storedEmbedding || storedEmbedding.length === 0) {
          console.log(`  ⚠️  ${concept.id}: No embedding stored`)
          continue
        }

        const synonyms = (concept.synonyms as unknown as string[]) || []
        const related = (concept.related as unknown as string[]) || []
        const tokens = [concept.label, ...synonyms, ...related]
        const prompts = tokens.map(t => `website UI with a ${t} visual style`)

        // Generate fresh embedding
        const vecs = await embedTextBatch(prompts)
        if (vecs.length === 0) {
          console.log(`  ⚠️  ${concept.id}: Failed to generate embedding`)
          continue
        }

        const avg = meanVec(vecs)
        const freshEmbedding = l2norm(avg)

        // Calculate similarity
        const similarity = cosine(storedEmbedding, freshEmbedding)
        
        // Check norms
        const storedNorm = Math.sqrt(storedEmbedding.reduce((s, x) => s + x * x, 0))
        const freshNorm = Math.sqrt(freshEmbedding.reduce((s, x) => s + x * x, 0))

        // Consider corrupted if similarity < 0.9 (should be ~1.0 for identical embeddings)
        const isCorrupted = similarity < 0.9

        results.push({
          id: concept.id,
          label: concept.label,
          storedEmbedding,
          freshEmbedding,
          similarity,
          synonymCount: synonyms.length,
          relatedCount: related.length,
          totalPrompts: prompts.length,
          isCorrupted,
          storedNorm,
          freshNorm,
        })
      } catch (error) {
        console.log(`  ❌ ${concept.id}: Error - ${error}`)
      }
    }
  }

  console.log(`\n✓ Analyzed ${results.length} concepts\n`)

  // Analyze results
  const corrupted = results.filter(r => r.isCorrupted)
  const healthy = results.filter(r => !r.isCorrupted)

  console.log('='.repeat(100))
  console.log('SUMMARY')
  console.log('='.repeat(100))
  console.log(`Total concepts analyzed: ${results.length}`)
  console.log(`Healthy concepts: ${healthy.length} (${((healthy.length / results.length) * 100).toFixed(1)}%)`)
  console.log(`Corrupted concepts: ${corrupted.length} (${((corrupted.length / results.length) * 100).toFixed(1)}%)\n`)

  if (corrupted.length > 0) {
    console.log('='.repeat(100))
    console.log('CORRUPTED CONCEPTS (similarity < 0.9)')
    console.log('='.repeat(100))
    console.log('Rank | Concept ID | Label | Similarity | Stored Norm | Fresh Norm | Prompts')
    console.log('-'.repeat(100))

    corrupted.sort((a, b) => a.similarity - b.similarity) // Sort by worst similarity first

    corrupted.slice(0, 50).forEach((r, idx) => {
      const rank = (idx + 1).toString().padStart(4)
      const id = r.id.padEnd(20)
      const label = (r.label.substring(0, 25)).padEnd(25)
      const sim = r.similarity.toFixed(4).padStart(10)
      const storedN = r.storedNorm.toFixed(4).padStart(11)
      const freshN = r.freshNorm.toFixed(4).padStart(10)
      const prompts = r.totalPrompts.toString().padStart(7)
      console.log(`${rank} | ${id} | ${label} | ${sim} | ${storedN} | ${freshN} | ${prompts}`)
    })

    if (corrupted.length > 50) {
      console.log(`... and ${corrupted.length - 50} more corrupted concepts`)
    }
  }

  // Statistics
  console.log('\n' + '='.repeat(100))
  console.log('STATISTICS')
  console.log('='.repeat(100))

  const similarities = results.map(r => r.similarity)
  const corruptedSimilarities = corrupted.map(r => r.similarity)
  const healthySimilarities = healthy.map(r => r.similarity)

  console.log(`\nSimilarity distribution (all concepts):`)
  console.log(`  Min:     ${Math.min(...similarities).toFixed(4)}`)
  console.log(`  Max:     ${Math.max(...similarities).toFixed(4)}`)
  console.log(`  Average: ${(similarities.reduce((a, b) => a + b, 0) / similarities.length).toFixed(4)}`)
  console.log(`  Median:  ${similarities.sort((a, b) => a - b)[Math.floor(similarities.length / 2)].toFixed(4)}`)

  if (corrupted.length > 0) {
    console.log(`\nCorrupted concepts (similarity < 0.9):`)
    console.log(`  Min:     ${Math.min(...corruptedSimilarities).toFixed(4)}`)
    console.log(`  Max:     ${Math.max(...corruptedSimilarities).toFixed(4)}`)
    console.log(`  Average: ${(corruptedSimilarities.reduce((a, b) => a + b, 0) / corruptedSimilarities.length).toFixed(4)}`)
  }

  if (healthy.length > 0) {
    console.log(`\nHealthy concepts (similarity >= 0.9):`)
    console.log(`  Min:     ${Math.min(...healthySimilarities).toFixed(4)}`)
    console.log(`  Max:     ${Math.max(...healthySimilarities).toFixed(4)}`)
    console.log(`  Average: ${(healthySimilarities.reduce((a, b) => a + b, 0) / healthySimilarities.length).toFixed(4)}`)
  }

  // Analyze patterns
  console.log('\n' + '='.repeat(100))
  console.log('PATTERN ANALYSIS')
  console.log('='.repeat(100))

  // Check if corrupted concepts have different norms
  const corruptedNorms = corrupted.map(r => r.storedNorm)
  const healthyNorms = healthy.map(r => r.storedNorm)

  if (corrupted.length > 0 && healthy.length > 0) {
    const avgCorruptedNorm = corruptedNorms.reduce((a, b) => a + b, 0) / corruptedNorms.length
    const avgHealthyNorm = healthyNorms.reduce((a, b) => a + b, 0) / healthyNorms.length

    console.log(`\nNorm analysis:`)
    console.log(`  Corrupted avg norm: ${avgCorruptedNorm.toFixed(4)}`)
    console.log(`  Healthy avg norm:   ${avgHealthyNorm.toFixed(4)}`)
    console.log(`  Difference:         ${Math.abs(avgCorruptedNorm - avgHealthyNorm).toFixed(4)}`)
    console.log(`  (Expected norm: ~1.0 for L2-normalized embeddings)`)
  }

  // Check prompt counts
  const corruptedPrompts = corrupted.map(r => r.totalPrompts)
  const healthyPrompts = healthy.map(r => r.totalPrompts)

  if (corrupted.length > 0 && healthy.length > 0) {
    const avgCorruptedPrompts = corruptedPrompts.reduce((a, b) => a + b, 0) / corruptedPrompts.length
    const avgHealthyPrompts = healthyPrompts.reduce((a, b) => a + b, 0) / healthyPrompts.length

    console.log(`\nPrompt count analysis:`)
    console.log(`  Corrupted avg prompts: ${avgCorruptedPrompts.toFixed(1)}`)
    console.log(`  Healthy avg prompts:   ${avgHealthyPrompts.toFixed(1)}`)
  }

  // Check for concepts with abnormal norms
  const abnormalNorms = results.filter(r => Math.abs(r.storedNorm - 1.0) > 0.1)
  if (abnormalNorms.length > 0) {
    console.log(`\n⚠️  Concepts with abnormal stored norms (expected ~1.0): ${abnormalNorms.length}`)
    abnormalNorms.slice(0, 10).forEach(r => {
      console.log(`  - ${r.id}: norm=${r.storedNorm.toFixed(4)}`)
    })
  }

  // Save results to file
  const fs = await import('fs/promises')
  const outputPath = 'scripts/corruption_analysis.json'
  await fs.writeFile(
    outputPath,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      total: results.length,
      healthy: healthy.length,
      corrupted: corrupted.length,
      corruptedConcepts: corrupted.map(r => ({
        id: r.id,
        label: r.label,
        similarity: r.similarity,
        storedNorm: r.storedNorm,
        freshNorm: r.freshNorm,
        totalPrompts: r.totalPrompts,
      })),
      statistics: {
        allSimilarities: {
          min: Math.min(...similarities),
          max: Math.max(...similarities),
          avg: similarities.reduce((a, b) => a + b, 0) / similarities.length,
        },
        corruptedSimilarities: corrupted.length > 0 ? {
          min: Math.min(...corruptedSimilarities),
          max: Math.max(...corruptedSimilarities),
          avg: corruptedSimilarities.reduce((a, b) => a + b, 0) / corruptedSimilarities.length,
        } : null,
      },
    }, null, 2)
  )

  console.log(`\n✓ Results saved to ${outputPath}`)
  console.log(`\nRecommendation: Regenerate embeddings for ${corrupted.length} corrupted concepts`)
}

async function main() {
  try {
    await analyzeAllConcepts()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

