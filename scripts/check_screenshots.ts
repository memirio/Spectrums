import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  for (const url of URLS) {
    const site = await prisma.site.findFirst({ where: { url } })
    if (!site) {
      console.log(`- ${url}: site not found`)
      continue
    }
    const images = await prisma.image.findMany({ where: { siteId: site.id }, orderBy: { id: 'desc' } })
    if (images.length === 0) {
      console.log(`- ${url}: NO screenshots`)
    } else {
      console.log(`- ${url}: ${images.length} screenshot(s), latest=${images[0].url}`)
    }
  }
}

main().finally(() => prisma.$disconnect())


