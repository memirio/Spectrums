// scripts/delete_latest_by_host.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

function normalizeHost(input: string): string {
  return input.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

async function main() {
  const arg = (process.argv[2] || '').trim()
  if (!arg) {
    console.error('Usage: tsx scripts/delete_latest_by_host.ts <host-or-url-fragment>')
    process.exit(1)
  }
  const host = normalizeHost(arg)

  const sites = await prisma.site.findMany({
    where: { url: { contains: host } as any },
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  })

  if (sites.length === 0) {
    console.log('No matching sites for host:', host)
    process.exit(0)
  }

  // Most recently created first
  const latest = sites[0]

  console.log('Candidates:')
  for (const s of sites) {
    console.log(`- ${s.title} | ${s.url} | createdAt=${s.createdAt.toISOString()} | images=${s.images.length}`)
  }

  console.log(`\nDeleting latest: ${latest.title} (${latest.url})`)

  // Delete related
  const imageIds = latest.images.map(i => i.id)
  if (imageIds.length > 0) {
    await prisma.imageTag.deleteMany({ where: { imageId: { in: imageIds } } })
    await prisma.imageEmbedding.deleteMany({ where: { imageId: { in: imageIds } } })
    await prisma.image.deleteMany({ where: { id: { in: imageIds } } })
  }
  await prisma.siteTag.deleteMany({ where: { siteId: latest.id } })
  await prisma.site.delete({ where: { id: latest.id } })

  console.log('✓ Deleted')
}

main().catch(e => { console.error(e); process.exit(1) })
