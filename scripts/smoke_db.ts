import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedImageFromBuffer, embedTextBatch } from '../src/lib/embeddings'

const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0)

async function fetchBuf(url: string) {
  if (/^https?:\/\//i.test(url)) {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`)
    return Buffer.from(await r.arrayBuffer())
  }
  // Handle /fallback.webp -> public/fallback.webp
  const { readFileSync } = await import('node:fs')
  const { resolve } = await import('node:path')
  if (url.startsWith('/')) {
    return readFileSync(resolve(process.cwd(), 'public', url.slice(1)))
  }
  return readFileSync(resolve(url))
}

async function main() {
  const imageUrl = process.argv[2] || '/fallback.webp'

  // 1) Create a site (always new title so unique constraints won't clash)
  const site = await prisma.site.create({
    data: { title: `Smoke DB ${Date.now()}`, url: 'https://example.com', imageUrl }
  })

  // 2) Create an image (no composite unique required)
  const image = await prisma.image.create({
    data: ({ siteId: site.id, url: imageUrl, width: 1200, height: 900 } as any)
  })

  // 3) Compute embeddings
  const buf = await fetchBuf(imageUrl)
  const { vector: ivec } = await embedImageFromBuffer(buf)

  // 4) Compare to text prompts
  const prompts = [
    ['playful', 'playful, colorful, rounded, bubbly'],
    ['austere', 'austere, minimalist, rigid grid, monochrome'],
    ['measurement', 'measurement, precise, metrics, gridlines']
  ] as const

  const tvecs = await embedTextBatch(prompts.map(([, d]) => d))
  const scores = prompts
    .map(([name], i) => ({ concept: name, score: cos(ivec, tvecs[i]) }))
    .sort((a, b) => b.score - a.score)

  console.log('\n✅ DB smoke test results:')
  console.log({ siteId: site.id, imageId: image.id })
  console.table(scores.map(s => ({ concept: s.concept, score: +s.score.toFixed(3) })))
}

main()
  .catch(e => (console.error(e), process.exit(1)))
  .finally(() => prisma.$disconnect())