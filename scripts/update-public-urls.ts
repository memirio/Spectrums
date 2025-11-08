import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const replacements: Record<string, string> = {
  'Framer Motion Examples': 'https://www.framer.com',
  'Framer': 'https://www.framer.com',
  'Stripe Dashboard': 'https://stripe.com',
  'GitHub Homepage': 'https://github.com',
  'Linear App': 'https://linear.app',
  'Figma Design Tool': 'https://www.figma.com',
  'Medium Blog Platform': 'https://medium.com',
  'Netflix Interface': 'https://about.netflix.com',
  'Spotify Web Player': 'https://spotify.design',
  'Notion Homepage': 'https://www.notion.so/product',
  'Apple AirPods Pro': 'https://www.apple.com/airpods-pro',
  'Behance Portfolio': 'https://www.behance.net',
  'Dribbble Design Community': 'https://dribbble.com',
  'Vercel Design System': 'https://vercel.com/design',
  'Airbnb Experience': 'https://news.airbnb.com'
}

async function run() {
  try {
    const sites = await prisma.site.findMany()
    for (const site of sites) {
      const newUrl = replacements[site.title]
      if (newUrl && site.url !== newUrl) {
        await prisma.site.update({ where: { id: site.id }, data: { url: newUrl } })
        console.log(`Updated URL: ${site.title} -> ${newUrl}`)
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
