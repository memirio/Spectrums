import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const urls = [
  'https://www.romanjeanelie.com/',
  'https://www.studiotyrsa.com/',
  'https://urbanjurgensen.com/',
  'https://orage.studio/',
  'https://www.hut8.com/',
  'https://untold.site/en',
  'https://www.gethyped.nl/',
  'https://ova-investment.com/',
  'https://www.100lostspecies.com/',
  'https://www.lacrapulestudio.com/',
  'https://flabbergast.agency/',
  'https://www.heimdallpower.com/',
  'http://samsy.ninja/',
  'https://stiff.madebybuzzworthy.com/',
  'http://inkgames.com/',
  'https://www.theupandupgroup.com/',
  'https://silver-pinewood.com/',
  'https://mammothmurals.com/',
  'https://layrid.tomoyaokada.com/',
  'https://eddie.eco/',
  'https://www.davidalaba.com/',
  'https://www.chanel.com/fr/maquillage/4-ombres-boutons/',
  'https://letude.group/',
  'https://www.active-hop.com/',
  'https://chipsa.design/',
  'https://play.garance.com/',
  'https://weavy.ai/',
  'https://damso.com/',
  'https://abhishekjha.me/',
  'https://house.paisana.studio/',
  'https://nitex.com/',
  'https://www.der-baukasten.com/',
  'https://www.pantheonmedia.com/',
  'https://www.caeli-energie.com/',
  'https://stefanvitasovic.dev/',
  'https://madarplatform.com/en',
  'https://www.walrus.xyz/',
  'https://18.burocratik.com/',
  'https://www.mastercard.com/businessoutcomes/',
  'https://ccus.heidelbergmaterials.com/en/',
  'https://www.purposetalent.xyz/',
  'https://www.luminaireauthentik.com/',
  'https://www.wildyriftian.com/',
  'https://www.bittercreek.studio/',
  'https://savor.it/',
  'https://truus.co/',
  'https://www.juice.agency/',
  'https://internalities.eu/',
  'https://s-2k.webflow.io/',
  'https://www.clou.ch/',
  'https://www.darkstarfury.com/',
  'https://terminal-industries.com/',
  'https://thedrake.ca/',
  'https://mola-zone.com/',
  'https://www.mirfundmerch.com/',
  'https://www.formandfun.co/',
  'http://martinbriceno.xyz/',
  'https://pictoric.com.ua/',
  'https://www.doubleplay.studio/',
  'https://compsych.konpo.co/',
  'https://lo2s.com/',
  'https://www.casa-lunara.com/',
  'https://ning-h.com/',
  'https://clayboan.com/',
  'https://smooothy.federic.ooo/',
  'https://redwoodteam.tv/',
  'https://www.cyphr.studio/',
  'https://www.cartier.com/en-fr/watchesandwonders',
  'https://www.weareinertia.com/',
  'https://ethicallifeworld.com/',
  'https://symphonyofvines.com/',
  'https://www.aether1.ai/',
  'https://metamask.io/',
  'https://testdrive.metropolis.io/',
  'https://www.somefolk.co/',
  'https://beautytools.dolcegabbana.com/en-it/velvet',
  'https://www.eathungrytiger.com/',
  'https://www.dapper.agency/',
  'https://www.jamarea.com/en',
  'https://firstframe.fr/',
  'https://phive.pt/en',
  'https://www.radicalface.com/',
  'https://www.adaline.ai/',
  'https://www.palmer-dinnerware.com/',
  'https://www.flowfest.co.uk/',
  'https://popup.larosee-cosmetiques.com/',
  'https://mikkisindhunata.com/',
  'https://www.avax.network/',
  'https://daydreamplayer.com/',
  'https://vooban.com/',
  'https://www.hardikbhansali.com/',
  'https://www.getty.edu/tracingart/',
  'https://www.8bit.ai/',
  'https://finethought.com.au/',
  'https://www.studioalphonse.com/',
  'https://www.brightbiotech.co.uk/',
  'https://www.nk.studio/',
  'https://therobot.tv/',
  'https://telescope.fyi/',
  'https://www.hhhusher.com/',
  'https://electrafilmworks.com/',
  'https://www.medusmo.com/',
  'https://www.myhealthprac.com/',
  'https://tools.dverso.io/bgremove/',
  'https://uxmachina.co/',
  'https://www.adhdexperience.com/',
  'https://homerun.today/',
  'https://duroc.ma/',
  'https://www.studionuts.com.br/',
  'https://www.easytomorrow.com/en',
  'https://oflyn.fr/',
  'https://dolsten.com/',
  'https://arqui9.com/',
  'https://www.reformcollective.com/',
  'https://palermo.ddd.live/',
  'https://www.deepbeautykikomilano.com/',
  'https://mont-fort.com/',
  'https://jfa-awards.snp.agency/',
  'https://www.leoleo.studio/',
  'https://35mm-one.vercel.app/',
  'https://www.caffe.design/',
  'https://optikka.com/',
  'https://beings.co/',
  'https://experiencethebestyou.com/',
  'https://www.eduardbodak.com/',
  'https://www.improntahome.com/it',
  'http://brand.base.org/',
  'https://www.chew.productions/',
]

async function addSite(url: string) {
  try {
    // Check if site already exists
    const existing = await prisma.site.findFirst({
      where: { url },
    })

    if (existing) {
      return { success: true, url, skipped: true, message: 'Site already exists' }
    }

    const title = new URL(url).hostname.replace('www.', '')

    // Create site without image first (screenshot will be generated async)
    const site = await prisma.site.create({
      data: {
        title,
        url,
        author: '',
        description: '',
        imageUrl: null,
      },
    })

    // Enqueue screenshot generation via the screenshot service
    const svcBase = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'
    const idemKey = `looma-${Buffer.from(url).toString('base64').slice(0, 24)}`
    
    try {
      const enqueue = await fetch(`${svcBase}/api/screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idemKey,
        },
        body: JSON.stringify({ url, viewport: { width: 1200, height: 900 } }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (enqueue.ok) {
        const data = await enqueue.json()
        if (data.imageUrl) {
          // Immediate result
          await prisma.site.update({
            where: { id: site.id },
            data: { imageUrl: data.imageUrl },
          })
        }
        // If statusUrl, the job will complete async - we don't wait here
      }
    } catch (screenshotError) {
      // Non-fatal - screenshot will be generated later
      console.warn(`Screenshot service unavailable for ${url}, will retry later`)
    }

    return { success: true, url, siteId: site.id }
  } catch (error) {
    console.error(`Error adding ${url}:`, error)
    return { 
      success: false, 
      url, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

async function main() {
  console.log(`Adding ${urls.length} sites...\n`)

  const results = []
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`[${i + 1}/${urls.length}] Adding ${url}...`)
    const result = await addSite(url)
    results.push(result)
    
    if (result.success) {
      if (result.skipped) {
        console.log(`⊘ Skipped (exists): ${url}`)
      } else {
        console.log(`✓ Success: ${url}`)
      }
    } else {
      console.log(`✗ Failed: ${url} - ${result.error}`)
    }
    
    // Small delay to avoid overwhelming services
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n=== Summary ===')
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  const skipped = results.filter(r => r.skipped)
  
  console.log(`Success: ${successful.length - skipped.length}/${urls.length}`)
  console.log(`Skipped (exists): ${skipped.length}/${urls.length}`)
  console.log(`Failed: ${failed.length}/${urls.length}`)
  
  if (failed.length > 0) {
    console.log('\nFailed URLs:')
    failed.forEach(r => console.log(`  - ${r.url}: ${r.error}`))
  }

  await prisma.$disconnect()
}

main().catch(console.error)

