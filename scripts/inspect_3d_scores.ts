// scripts/inspect_3d_scores.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const URLS = [
  'https://www.jamarea.com/en',
  'https://play.garance.com/',
  'http://martinbriceno.xyz/',
  'https://www.cyphr.studio/',
  'https://www.hut8.com/',
  'https://lo2s.com/'
]

async function getSiteImageId(url: string): Promise<{ siteId: string; imageId: string } | null> {
  const site = await prisma.site.findFirst({ where: { url: { contains: url.replace(/^https?:\/\//,'').replace(/^www\./,'') } as any }, select: { id: true, imageUrl: true, url: true } }) as any
  if (!site) return null
  const img = await prisma.image.findFirst({ where: { siteId: site.id, url: site.imageUrl || undefined }, select: { id: true } })
  if (!img) return null
  return { siteId: site.id, imageId: img.id }
}

async function find3dConceptIds(): Promise<string[]> {
  const byExact = await prisma.concept.findMany({ where: { OR: [ { id: '3d' }, { label: { equals: '3D' } as any }, { label: { equals: '3d' } as any } ] }, select: { id: true } })
  if (byExact.length > 0) return byExact.map(c => c.id)
  const byContains = await prisma.concept.findMany({ where: { OR: [ { label: { contains: '3d' } as any }, { id: { contains: '3d' } as any } ] }, select: { id: true, label: true } })
  return byContains.map(c => c.id)
}

async function main() {
  const threeDIds = await find3dConceptIds()
  if (threeDIds.length === 0) {
    console.log('No 3d concept ids found')
    process.exit(0)
  }
  console.log('3d concept ids:', threeDIds.join(', '))

  for (const url of URLS) {
    const ids = await getSiteImageId(url)
    if (!ids) {
      console.log(`- ${url}: site/image not found`)
      continue
    }
    const tags = await prisma.imageTag.findMany({ where: { imageId: ids.imageId, conceptId: { in: threeDIds } }, select: { conceptId: true, score: true } })
    const maxScore = tags.length ? Math.max(...tags.map(t => t.score)) : 0
    const present = tags.length > 0
    console.log(`- ${url}: present=${present} max3d=${maxScore.toFixed(3)} tags=${tags.length}`)
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
