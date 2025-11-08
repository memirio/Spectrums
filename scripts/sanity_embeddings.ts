import { PrismaClient } from '@prisma/client'
import { embedTextBatch, embedImageFromBuffer, loadClip } from '../src/lib/embeddings'

const prisma = new PrismaClient()

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom ? dot / denom : 0
}

async function testTextSimilarity() {
  await loadClip()
  const tokens = ['playful', 'happy', 'austere']
  const [vPlayful, vHappy, vAustere] = await embedTextBatch(tokens)
  const c1 = cosine(vPlayful, vHappy)
  const c2 = cosine(vPlayful, vAustere)
  const pass = c1 > c2
  console.log(`Text sim: cos(playful,happy)=${c1.toFixed(4)} vs cos(playful,austere)=${c2.toFixed(4)} -> ${pass ? 'PASS' : 'FAIL'}`)
  return pass
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed ${res.status}`)
  const arr = await res.arrayBuffer()
  return Buffer.from(arr)
}

async function pickKnownImages() {
  // Try to pick by domain hints first
  const spotify = await prisma.site.findFirst({ where: { url: { contains: 'spotify' } }, select: { imageUrl: true } })
  const stripe = await prisma.site.findFirst({ where: { url: { contains: 'stripe' } }, select: { imageUrl: true } })
  if (spotify?.imageUrl && stripe?.imageUrl) return { playfulUrl: spotify.imageUrl, strictUrl: stripe.imageUrl }
  // Fallback: pick any two with images
  const any = await prisma.site.findMany({ where: { imageUrl: { not: null } }, take: 2, select: { imageUrl: true } })
  if (any.length === 2) return { playfulUrl: any[0].imageUrl!, strictUrl: any[1].imageUrl! }
  throw new Error('Could not find two sites with images')
}

async function testCrossModal() {
  await loadClip()
  const { playfulUrl, strictUrl } = await pickKnownImages()
  const [buf1, buf2] = await Promise.all([fetchBuffer(playfulUrl), fetchBuffer(strictUrl)])
  const [e1, e2] = await Promise.all([embedImageFromBuffer(buf1), embedImageFromBuffer(buf2)])
  const [tPlayful, tStrict] = await embedTextBatch(['playful', 'strict'])
  const e1p = cosine(e1, tPlayful), e1s = cosine(e1, tStrict)
  const e2p = cosine(e2, tPlayful), e2s = cosine(e2, tStrict)
  const pass1 = e1p > e1s
  const pass2 = e2s > e2p
  console.log(`Cross-modal e1 (playful?) cos(playful)=${e1p.toFixed(4)} vs cos(strict)=${e1s.toFixed(4)} -> ${pass1 ? 'PASS' : 'FAIL'}`)
  console.log(`Cross-modal e2 (strict?)  cos(strict)=${e2s.toFixed(4)} vs cos(playful)=${e2p.toFixed(4)} -> ${pass2 ? 'PASS' : 'FAIL'}`)
  return pass1 && pass2
}

async function main() {
  const okText = await testTextSimilarity()
  let okX = false
  try { okX = await testCrossModal() } catch (e) { console.warn('Cross-modal test skipped:', (e as Error).message) }
  console.log(`\nSummary: text=${okText ? 'PASS' : 'FAIL'} cross-modal=${okX ? 'PASS' : 'SKIP/FAIL'}`)
}

main().catch(err => { console.error(err); process.exit(1) }).finally(async () => { await prisma.$disconnect() })


