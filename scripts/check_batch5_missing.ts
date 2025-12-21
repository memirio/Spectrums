#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const BATCH5_URLS = [
  'https://fitonist-app.webflow.io/',
  'https://opos.buzzworthystudio.com/',
  'https://www.jordangilroy.com/',
  'https://yourmajesty.co/',
  'https://play.makemepulse.com/',
  'https://betteroff.studio/',
  'https://theartofdocumentary.com/',
  'https://www.digitalmosaik.com/en/',
  'https://www.steviaplease.me/',
  'https://www.breaking.com/',
  'https://superpower.com/',
  'https://www.zetr.co/',
  'https://www.lowesinnovationlabs.com/',
  'https://work.outloud.co/pohoda',
  'https://www.weareuprising.com/',
  'https://freespeech.gubrica.com/',
  'https://sugar-app.webflow.io/',
  'https://non-linear.studio/',
  'https://den.cool/',
  'https://www.bethebuzz.co/',
  'https://portal.uflgame.com/',
  'https://www.planeterthos.com/',
  'https://www.paffi.it/',
  'https://www.girard-perregaux.com/casquette-collection/',
  'https://dracarys.robertborghesi.is/',
  'https://jobenetuk.dev/',
  'https://doze.studio/en',
  'https://www.defprojetos.com/',
  'https://www.hevahealth.com/',
  'https://view-source-cumulus.myshopify.com/',
]

function normalizeUrl(url: string): string {
  let normalized = url.trim().toLowerCase()
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized
  }
  normalized = normalized.replace(/\/$/, '')
  normalized = normalized.replace(/^https?:\/\/(www\.)?/, 'https://')
  return normalized
}

async function main() {
  console.log('🔍 Checking batch 5 uploads...\n')
  
  const missing: string[] = []
  const uploaded: string[] = []
  
  for (const url of BATCH5_URLS) {
    const normalizedUrl = normalizeUrl(url)
    const domain = new URL(url).hostname.replace(/^www\./, '')
    
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: { contains: domain, mode: 'insensitive' } },
        ],
      },
      include: {
        images: {
          where: {
            category: 'website',
          },
        },
      },
    })
    
    if (site && site.images.length > 0) {
      uploaded.push(url)
      console.log(`✅ ${url}`)
    } else {
      missing.push(url)
      console.log(`❌ ${url} - NOT FOUND`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`✅ Uploaded: ${uploaded.length}/${BATCH5_URLS.length}`)
  console.log(`❌ Missing: ${missing.length}/${BATCH5_URLS.length}`)
  
  if (missing.length > 0) {
    console.log('\n❌ Missing entries:')
    missing.forEach(url => {
      console.log(`  - ${url}`)
    })
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)

