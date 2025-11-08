import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

type ShotResult = { imageUrl?: string; width?: number; height?: number; bytes?: number; statusUrl?: string }

const URLS = [
  'https://stripe.com/en-se',
  'https://memir.io/product',
  'https://www.hyperbolic.ai/',
  'https://www.makingsoftware.com/',
  'https://sunriserobotics.co',
  'https://www.jonite.com/',
  'https://vwlab.io/pages/report',
  'https://factory.ai/',
  'https://www.apple.com/airpods-pro',
]

const SVC = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function enqueueShot(url: string): Promise<ShotResult> {
  const idem = `recap-${Buffer.from(url).toString('base64').slice(0, 24)}`
  const res = await fetch(`${SVC}/api/screenshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idem },
    body: JSON.stringify({ url, viewport: { width: 1200, height: 900 }, fresh: true, noOgFallback: true })
  })
  if (!res.ok) throw new Error(`enqueue ${url} → HTTP ${res.status}`)
  return (await res.json()) as ShotResult
}

async function waitForStatus(statusUrl: string, timeoutMs = 30000): Promise<ShotResult> {
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

async function processOne(url: string) {
  const site = await prisma.site.findFirst({ where: { url } })
  if (!site) {
    console.log(`- ${url}: site not found`)
    return
  }
  try {
    const job = await enqueueShot(url)
    const done = job.imageUrl ? job : job.statusUrl ? await waitForStatus(job.statusUrl) : job
    if (!done.imageUrl) {
      console.log(`- ${url}: no imageUrl returned`)
      return
    }
    const image = await prisma.image.upsert({
      where: { siteId_url: { siteId: site.id, url: done.imageUrl } },
      update: { width: done.width ?? undefined, height: done.height ?? undefined, bytes: done.bytes ?? undefined },
      create: {
        siteId: site.id,
        url: done.imageUrl,
        width: done.width ?? undefined,
        height: done.height ?? undefined,
        bytes: done.bytes ?? undefined,
      },
    })
    console.log(`- ${url}: updated → ${image.url}`)
  } catch (e: any) {
    console.log(`- ${url}: failed → ${e?.message || e}`)
  }
}

async function main() {
  for (const url of URLS) {
    await processOne(url)
  }
}

main()
  .catch(e => (console.error(e), process.exit(1)))
  .finally(() => prisma.$disconnect())


