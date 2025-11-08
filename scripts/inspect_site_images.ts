import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const URLS = [
  'https://stripe.com/en-se',
  'https://memir.io/product',
  'https://www.hyperbolic.ai/',
  'https://sunriserobotics.co',
  'https://vwlab.io/pages/report',
  'https://factory.ai/'
]

async function main() {
  for (const url of URLS) {
    const site = await prisma.site.findFirst({ where: { url }, select: { id: true, imageUrl: true } })
    if (!site) {
      console.log(`- ${url}: site not found`)
      continue
    }
    const latest = await prisma.image.findFirst({ where: { siteId: site.id }, orderBy: { id: 'desc' } })
    console.log(`- ${url}`)
    console.log(`  site.imageUrl: ${site.imageUrl || 'null'}`)
    console.log(`  latest Image.url: ${latest?.url || 'none'}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())


