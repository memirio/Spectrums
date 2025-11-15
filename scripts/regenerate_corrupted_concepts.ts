import { prisma } from '../src/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '../src/lib/embeddings'
import * as fs from 'fs/promises'
import * as path from 'path'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

interface Progress {
  total: number
  processed: number
  regenerated: number
  skipped: number
  errors: number
  lastProcessedId: string | null
}

async function regenerateCorruptedConcepts(resume: boolean = false) {
  console.log('Regenerating corrupted concept embeddings using NEW method...\n')

  // Load or create progress file
  const progressPath = path.join(process.cwd(), 'scripts', 'regeneration_progress.json')
  let progress: Progress = {
    total: 0,
    processed: 0,
    regenerated: 0,
    skipped: 0,
    errors: 0,
    lastProcessedId: null,
  }

  if (resume) {
    try {
      const progressData = await fs.readFile(progressPath, 'utf-8')
      progress = JSON.parse(progressData)
      console.log(`Resuming from previous run: ${progress.processed}/${progress.total} processed\n`)
    } catch (error) {
      console.log('No previous progress found, starting fresh\n')
    }
  }

  // Get all concepts
  const allConcepts = await prisma.concept.findMany({
    orderBy: { id: 'asc' }
  })

  if (progress.total === 0) {
    progress.total = allConcepts.length
  }

  console.log(`Total concepts: ${allConcepts.length}`)
  console.log(`Using NEW method: "website UI with a {term} visual style" (multiple prompts, averaged)\n`)

  const BATCH_SIZE = 10
  const SAVE_INTERVAL = 50 // Save progress every 50 concepts
  let processedSinceLastSave = 0

  // Find starting point if resuming
  let startIndex = 0
  if (resume && progress.lastProcessedId) {
    startIndex = allConcepts.findIndex(c => c.id === progress.lastProcessedId) + 1
    if (startIndex === 0) startIndex = progress.processed
  }

  console.log(`Starting from index: ${startIndex}\n`)

  for (let i = startIndex; i < allConcepts.length; i += BATCH_SIZE) {
    const batch = allConcepts.slice(i, Math.min(i + BATCH_SIZE, allConcepts.length))
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(allConcepts.length / BATCH_SIZE)

    console.log(`[${batchNum}/${totalBatches}] Processing batch (${batch.length} concepts)...`)

    for (const concept of batch) {
      try {
        const storedEmbedding = concept.embedding as unknown as number[]
        if (!storedEmbedding || storedEmbedding.length === 0) {
          console.log(`  ⚠️  ${concept.id}: No embedding, skipping`)
          progress.skipped++
          progress.processed++
          continue
        }

        const synonyms = (concept.synonyms as unknown as string[]) || []
        const related = (concept.related as unknown as string[]) || []
        const tokens = [concept.label, ...synonyms, ...related]
        const prompts = tokens.map(t => `website UI with a ${t} visual style`)

        // Generate fresh embedding using NEW method
        const vecs = await embedTextBatch(prompts)
        if (vecs.length === 0) {
          console.log(`  ⚠️  ${concept.id}: Failed to generate embedding`)
          progress.errors++
          progress.processed++
          continue
        }

        const avg = meanVec(vecs)
        const freshEmbedding = l2norm(avg)

        // Check if corrupted (similarity < 0.9)
        const similarity = cosine(storedEmbedding, freshEmbedding)
        const isCorrupted = similarity < 0.9

        if (isCorrupted) {
          // Update in database
          await prisma.concept.update({
            where: { id: concept.id },
            data: {
              embedding: freshEmbedding as any
            }
          })

          console.log(`  ✓ ${concept.id.padEnd(25)} ${concept.label.padEnd(30)} similarity: ${similarity.toFixed(4)} → regenerated`)
          progress.regenerated++
        } else {
          console.log(`  - ${concept.id.padEnd(25)} ${concept.label.padEnd(30)} similarity: ${similarity.toFixed(4)} (healthy, skipped)`)
          progress.skipped++
        }

        progress.processed++
        progress.lastProcessedId = concept.id
        processedSinceLastSave++

        // Save progress periodically
        if (processedSinceLastSave >= SAVE_INTERVAL) {
          await fs.writeFile(progressPath, JSON.stringify(progress, null, 2))
          processedSinceLastSave = 0
          console.log(`  💾 Progress saved: ${progress.processed}/${progress.total} (${progress.regenerated} regenerated)`)
        }
      } catch (error) {
        console.log(`  ❌ ${concept.id}: Error - ${error}`)
        progress.errors++
        progress.processed++
      }
    }

    // Show batch summary
    const pct = ((progress.processed / progress.total) * 100).toFixed(1)
    console.log(`  Batch complete: ${progress.processed}/${progress.total} (${pct}%) - ${progress.regenerated} regenerated, ${progress.skipped} skipped, ${progress.errors} errors\n`)
  }

  // Final save
  await fs.writeFile(progressPath, JSON.stringify(progress, null, 2))

  console.log('='.repeat(100))
  console.log('REGENERATION COMPLETE')
  console.log('='.repeat(100))
  console.log(`Total concepts processed: ${progress.processed}`)
  console.log(`Concepts regenerated:     ${progress.regenerated}`)
  console.log(`Concepts skipped (healthy): ${progress.skipped}`)
  console.log(`Errors:                   ${progress.errors}`)
  console.log(`\n✓ All corrupted concepts have been regenerated using the NEW method`)
  console.log(`\nNext steps:`)
  console.log(`  1. Re-tag all images to see improved scores`)
  console.log(`  2. Or wait for new images to be tagged with updated embeddings`)
}

async function main() {
  const args = process.argv.slice(2)
  const resume = args.includes('--resume')

  try {
    await regenerateCorruptedConcepts(resume)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

