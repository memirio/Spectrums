import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

type ShotResult = { imageUrl?: string; width?: number; height?: number; bytes?: number; statusUrl?: string }

const SVC = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function enqueueShot(url: string): Promise<ShotResult> {
  const idem = `one-${Buffer.from(url).toString('base64').slice(0, 24)}`
  const res = await fetch(`${SVC}/api/screenshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idem },
    body: JSON.stringify({ url, viewport: { width: 1200, height: 900 }, fresh: true, noOgFallback: true })
  })
  if (!res.ok) throw new Error(`enqueue ${url} → HTTP ${res.status}`)
  return (await res.json()) as ShotResult
}

async function waitForStatus(statusUrl: string, timeoutMs = 45000): Promise<ShotResult> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 1500))
    const r = await fetch(`${SVC}${statusUrl}`)
    if (!r.ok) break
    const s = (await r.json()) as any
    if (s.status === 'done' && s.imageUrl) return s
    if (s.status === 'error') throw new Error(`status error: ${s.error || 'unknown'}`)
  }
  throw new Error('status timeout')
}

async function main() {
  const url = process.argv[2] || 'https://memir.io/product'
  const site = await prisma.site.findFirst({ where: { url } })
  if (!site) throw new Error('site not found for ' + url)

  const job = await enqueueShot(url)
  const done = job.imageUrl ? job : job.statusUrl ? await waitForStatus(job.statusUrl) : job
  if (!done.imageUrl) throw new Error('no imageUrl returned')

  const image = await prisma.image.upsert({
    where: { siteId_url: { siteId: site.id, url: done.imageUrl } },
    update: { width: done.width ?? undefined, height: done.height ?? undefined, bytes: done.bytes ?? undefined },
    create: { siteId: site.id, url: done.imageUrl, width: done.width ?? undefined, height: done.height ?? undefined, bytes: done.bytes ?? undefined },
  })

  console.log('Updated:', image.url)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())


