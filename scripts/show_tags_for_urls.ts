import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function show(url: string) {
  const site = await prisma.site.findFirst({ where: { url } })
  if (!site) {
    console.log(`- ${url}: site not found`)
    return
  }
  const image = await prisma.image.findFirst({ where: { siteId: site.id, url: site.imageUrl || undefined }, include: { tags: { include: { concept: true }, orderBy: { score: 'desc' } } } })
  if (!image) {
    console.log(`- ${url}: no image for current imageUrl`)
    return
  }
  const tagCount = image.tags.length
  console.log(`- ${url}: tags=${tagCount}`)
  for (const t of image.tags.slice(0, 15)) {
    console.log(`    ${t.concept.label} (${t.concept.id}) = ${t.score.toFixed(3)}`)
  }
}

async function main() {
  const urls = process.argv.slice(2)
  if (urls.length === 0) {
    console.log('Usage: npx tsx scripts/show_tags_for_urls.ts <url1> <url2> ...')
    process.exit(1)
  }
  for (const u of urls) {
    await show(u)
  }
}

main().catch(e => { console.error('Script failed:', e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })


