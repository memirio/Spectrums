import { PrismaClient } from '@prisma/client'
import { embedImageFromBuffer, embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]) {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}

const prisma = new PrismaClient()

;(async () => {
  const imageId = process.argv[2]
  if (!imageId) {
    console.error('Usage: tsx scripts/test_rank.ts <imageId>')
    process.exit(1)
  }
  const img = await prisma.image.findUnique({ where: { id: imageId } })
  if (!img) throw new Error('Image not found')
  const res = await fetch(img.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ab = await res.arrayBuffer()
  const ivec = await embedImageFromBuffer(Buffer.from(ab))

  const concepts = await prisma.concept.findMany()
  const scores = concepts.map(c => ({ id: c.id, score: cosine(ivec, c.embedding as unknown as number[]) }))
  scores.sort((a, b) => b.score - a.score)
  console.log(scores.slice(0, 10))
})().catch(e => { console.error(e); process.exit(1) })


