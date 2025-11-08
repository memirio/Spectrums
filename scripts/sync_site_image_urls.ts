import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const sites = await prisma.site.findMany({ select: { id: true } })
  let updated = 0
  for (const s of sites) {
    const img = await prisma.image.findFirst({ where: { siteId: s.id }, orderBy: { id: 'desc' } })
    if (img?.url) {
      await prisma.site.update({ where: { id: s.id }, data: { imageUrl: img.url } })
      updated++
    }
  }
  console.log(`Synced imageUrl for ${updated} sites.`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())


