import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer } from '../src/lib/embeddings'

const cos = (a:number[], b:number[]) => a.reduce((s,x,i)=>s + x*b[i], 0)

async function fetchBuf(url: string) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`)
  return Buffer.from(await r.arrayBuffer())
}

async function main() {
  // newest image
  const image = (await prisma.image.findFirst({ orderBy: { id: 'desc' } })) as any
  if (!image) throw new Error('No Image rows found.')

  // ensure embedding exists
  let emb = await prisma.imageEmbedding.findUnique({ where: { imageId: image.id } })
  if (!emb) {
    if (!image.url) throw new Error(`Image ${image.id} has no url`)
    const buf = await fetchBuf(image.url as string)
    const vec = await embedImageFromBuffer(buf)
    emb = await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
      update: { vector: vec, model: 'clip-ViT-L/14' },
      create: { imageId: image.id, vector: vec, model: 'clip-ViT-L/14' },
    })
  }

  // concepts
  const concepts = await prisma.concept.findMany()
  if (concepts.length === 0) throw new Error('No concepts found. Run seed_concepts.ts')

  // score + pick
  const scores = concepts
    .map(c => ({ c, score: cos(emb!.vector as number[], c.embedding as number[]) }))
    .sort((a,b) => b.score - a.score)

  const top = scores.filter(s => s.score >= 0.12).slice(0, 5)
  const chosen = top.length ? top : scores.slice(0, 3)

  // upsert tags
  for (const { c, score } of chosen) {
    await prisma.imageTag.upsert({
      where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
      update: { score },
      create: { imageId: image.id, conceptId: c.id, score },
    })
  }

  console.log('Tagged image:', image.id)
  console.table(chosen.map(t => ({ concept: t.c.id, score: +t.score.toFixed(3) })))
}

main()
  .then(() => process.exit(0))
  .catch(e => (console.error(e), process.exit(1)))
  .finally(() => prisma.$disconnect())