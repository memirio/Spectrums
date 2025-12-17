#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const BATCH3_URLS = [
  'https://bfcm.stripe.com/',
  'https://www.osmo.supply/',
  'https://vwlab.io/pages/showcase',
  'https://www.rejouice.com/',
  'https://emmpo.com/',
  'https://sonsanddaughters.xyz/',
  'https://bynikistudio.com/',
  'https://brunoarizio.com/',
  'https://www.byooooob.com/',
  'https://matvoyce.tv/',
  'https://www.moooor.com/',
  'https://thefirstthelast.agency/',
  'https://dream-machine.lumalabs.ai/',
  'https://www.sofihealth.com/',
  'https://gianlucagradogna.com/',
  'https://www.qudrix.com/',
  'https://ahadi-foundation.org/en/',
  'https://www.osklen.com.br/',
  'https://brighteststars.org/en/explore/',
  'https://www.polecat.agency/',
  'https://era.estate/',
  'https://radga.com/',
  'https://destigmatize.ca/',
  'https://www.thomasmonavon.com/',
  'https://monolith.nyc/',
  'https://wodniack.dev/',
  'https://keikku.madebyburo.com/',
  'https://www.nudolsbanzai.it/',
  'https://ai.google/our-ai-journey/?section=intro',
  'https://insidekristallnacht.org/',
  'https://studio-onto.com/',
  'https://www.rhythminfluence.com/',
  'https://www.maxandtiber.com/ch_fr/',
  'https://sundaecreative.com/en/home',
  'https://chapter.millanova.com/',
  'https://lipstylo.dolcegabbana.com/en/master/dg/online',
  'https://www.gentlerain.ai/',
  'https://by-kin.com/',
  'https://travelnextlvl.de/en',
  'https://spotstudio.es/',
  'https://shopify.sunnysideup.work/',
  'https://vantage.ava-case.com/',
  'https://davidwhyte.com/experience/',
  'https://christmas-2024.riven.ch/',
  'https://www.utsubo.com/',
  'https://elementis.co/',
  'https://www.shopify.com/editions/summer2024',
  'https://madebyanalogue.co.uk/',
  'https://www.wix.com/studio/pantone-color-of-the-year-2025',
  'https://immersive-g.com/',
  'https://radiance.family/',
  'https://basehabitation.com/en/',
  'https://www.leeroy.ca/',
  'https://www.clearstreet.io/',
  'https://mew.xyz/',
  'https://ayocin.com/',
  'https://dothingsnyc.com/',
  'https://bruut.media/',
  'https://labs.chaingpt.org/',
  'https://60.belangersalach.ca/',
  'https://thibaud.film/',
  'https://beat.noomoagency.com/',
  'https://www.isabelmoranta.com/',
  'https://lifeworld.wetransfer.com/',
  'https://social-impact-capital.com/',
  'https://shop.abbathemuseum.com/',
  'https://www.akercompanies.com/',
  'https://www.davidebaratta.com/',
  'https://ai-in-banking-ux-design.videinfra.com/',
  'https://alectear.com/',
  'https://www.teletech.events/',
  'https://amaterasu.ai/',
  'https://www.otherlife.xyz/',
  'https://vazzi.fun/',
  'https://saisei-sbj.webflow.io/',
  'https://www.houseofdreamers.fr/fr',
  'https://loveandmoney.com/work',
  'https://www.rspca.org.uk/webContent/animalfutures/?utm_source=Unseen&utm_medium=Referral&utm_campaign=AnimalFutures&utm_content=Game',
  'https://thelinestudio.com/',
  'https://www.hatom.com/',
  'https://www.duten.com/en/',
  'https://gelatolaboca.com/',
  'https://www.oakame.com/en/',
  'https://montopnetflix.fr/',
  'https://gregorylalle.com/',
  'https://dorstenlesser.com/',
  'https://p448.com/',
  'https://www.sonder-mr.com/',
  'https://www.cosmos.studio/',
  'https://kriss.ai/',
  'https://cocotastudio.com/',
  'https://funkhaus.io/en',
  'https://guillaumecolombel.fr/',
  'https://broedutrecht.nl/',
  'https://sites.research.google/languages/',
  'https://www.vivalalabia.com/',
  'https://orkenworld.com/',
  'https://nodcoding.com/',
  'https://htarchitecte.com/en/',
  'https://harryjatkins.com/',
  'https://www.hartmanncapital.com/',
  'https://www.umault.com/',
  'https://reown.com/',
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
  console.log('🔍 Checking batch 3 uploads...\n')
  
  const missing: string[] = []
  const uploaded: string[] = []
  
  for (const url of BATCH3_URLS) {
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
    } else {
      missing.push(url)
      console.log(`❌ ${url}`)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`✅ Uploaded: ${uploaded.length}/${BATCH3_URLS.length}`)
  console.log(`❌ Missing: ${missing.length}/${BATCH3_URLS.length}`)
  
  await prisma.$disconnect()
}

main().catch(console.error)

