import 'dotenv/config'
import { prisma } from '../../src/lib/prisma'

async function main() {
  console.log('DATABASE_URL =', process.env.DATABASE_URL)
  try {
    const rows:any[] = await prisma.$queryRawUnsafe('PRAGMA database_list;')
    console.log('PRAGMA database_list:', rows)
  } catch (e) {
    console.warn('PRAGMA failed:', e)
  }
  const siteCount = await prisma.site.count()
  const imageCount = await prisma.image.count()
  console.log({ siteCount, imageCount })
}
main().finally(() => prisma.$disconnect())
