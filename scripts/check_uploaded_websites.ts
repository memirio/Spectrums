#!/usr/bin/env tsx
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

// All website entries from the upload script
const WEBSITE_ENTRIES = [
  { url: 'https://www.flim.ai/', title: 'Flim' },
  { url: 'https://www.seventeenagency.com/', title: 'Seventeen Agency' },
  { url: 'https://paya.ar/', title: 'PAYÁ - Film Haus' },
  { url: 'https://jacques-cie.com/', title: 'Jacques + Cie' },
  { url: 'https://titangatequity.com/', title: 'TitanGate Equity' },
  { url: 'https://davincii.com/', title: 'DaVincii' },
  { url: 'https://www.paolovendramini.com/', title: 'Paolo Vendramini' },
  { url: 'https://newgenre.studio/', title: 'New Genre' },
  { url: 'https://www.creativegiants.art/', title: 'Creative Giants' },
  { url: 'https://ribbit.dk/', title: 'Ribbit' },
  { url: 'https://themonolithproject.net/', title: 'The Monolith Project' },
  { url: 'https://www.glyphic.bio/', title: 'Glyphic Biotechnologies' },
  { url: 'https://sofaknows.com/', title: 'SofaKnows' },
  { url: 'https://oceanfilms.com.br/', title: 'Ocean Films' },
  { url: 'https://wearecollins.com/', title: 'COLLINS' },
  { url: 'https://mobbin.com/', title: 'Mobbin' },
  { url: 'https://www.madhstore.com/', title: 'MADH' },
  { url: 'https://bassbcn.com/', title: 'BASS Barcelona' },
  { url: 'https://www.sandbar.com/', title: 'Sandbar' },
  { url: 'https://s-o.io/', title: 'SPECIAL OFFER, Inc.' },
  { url: 'https://www.groth.studio/', title: 'Groth Studio' },
  { url: 'https://www.early.works/', title: 'Early Works' },
  { url: 'https://roma-template.framer.website/', title: 'Roma Template' },
  { url: 'https://www.wist.chat/', title: 'Wist Chat' },
  { url: 'https://reevo.ai/', title: 'Reevo' },
  { url: 'https://www.getrally.com/', title: 'Rally' },
  { url: 'https://www.brandium.nl/', title: 'Brandium' },
  { url: 'https://www.everbloom.bio/', title: 'Everbloom' },
  { url: 'https://www.massivemusic.com/', title: 'MassiveMusic' },
  { url: 'https://proto.xyz/', title: 'Proto' },
  { url: 'https://byebyebad.com/', title: 'byebyebad' },
  { url: 'https://mikevandersanden.com/', title: 'Mike van der Sanden' },
  { url: 'https://www.sananes.co/', title: 'Aaron Sananes' },
  { url: 'https://picmal.app/', title: 'Picmal' },
  { url: 'https://assassins-creed-mirage-one.webflow.io/', title: 'Assassins Creed Mirage' },
  { url: 'https://maikasui.com/', title: 'maikasui' },
  { url: 'https://heavn-one.webflow.io/', title: 'HEAVN One' },
  { url: 'https://www.fizzy.do/', title: 'Fizzy' },
  { url: 'https://alcove.news/', title: 'Alcove' },
  { url: 'https://sleep-well-creatives.com/', title: 'Sleep Well Creatives' },
  { url: 'https://telescope.fyi/', title: 'Telescope' },
  { url: 'https://www.transform9.com/', title: 'Transform9' },
  { url: 'https://www.overpass.com/', title: 'Overpass' },
  { url: 'https://vivienscreative.com.au/', title: "Vivien's Creative" },
  { url: 'https://middlename.co.uk/', title: 'Middle Name' },
  { url: 'https://markus.se/', title: 'Markus Reklambyrå' },
  { url: 'https://redneck.media/', title: 'REDNECK - Web Studio' },
  { url: 'https://theremin.app/', title: 'Theremix - Virtual Theremin' },
  { url: 'https://www.m-trust.co.jp/', title: 'エムトラスト株式会社' },
  { url: 'https://www.atrio.it/', title: 'àtrio - Agenzia di Comunicazione' },
  { url: 'https://mark-appleby.com/', title: 'Mark Appleby - Web Developer' },
  { url: 'https://rinnai.jp/microbubble/', title: 'Rinnai Micro Bubble Bath Unit' },
  { url: 'https://freshman.tv/', title: 'Freshman' },
  { url: 'https://shopify.supply/', title: 'Shopify Supply' },
  { url: 'https://www.maxmilkin.com/', title: 'Max Milkin' },
  { url: 'https://www.kokuyo.com/en/special/curiosity-is-life/', title: 'Kokuyo – Curiosity is Life' },
  { url: 'https://integratedbiosciences.com/', title: 'Integrated Biosciences' },
  { url: 'https://acron.no/energyupgrades', title: 'Acron Energy Upgrades' },
  { url: 'https://www.ousmaneballondor.fr/', title: 'Ousmane Ballon dOr' },
  { url: 'https://www.snamitravel.com/', title: 'Snami Travel' },
  { url: 'https://73-strings.mdxpreview.xyz/', title: '73 Strings' },
  { url: 'https://www.nordlysdesign.it/', title: 'Nordlys Design' },
  { url: 'https://packet-panic.nl/', title: 'Packet Panic' },
  { url: 'https://sophon.xyz/', title: 'Sophon' },
  { url: 'https://scope-creep.xyz/', title: 'Scope Creep' },
  { url: 'https://www.evmdsgn.com/', title: 'EVM Design' },
  { url: 'https://www.basecamp.agency/', title: 'Basecamp Agency' },
  { url: 'https://readymag.com/companies/?utm_source=awwwards&utm_medium=submission&utm_campaign=companies', title: 'Readymag – Companies' },
  { url: 'https://www.sebg.ch/', title: 'SEBG' },
  { url: 'https://nature-beyond.tech/', title: 'Nature Beyond' },
  { url: 'https://www.1910.ai/', title: '1910 AI' },
  { url: 'https://lisk.com/', title: 'Lisk' },
  { url: 'https://www.kasiasiwosz.com/', title: 'Kasia Siwosz' },
  { url: 'https://www.pulsohotel.com/en', title: 'Pulso Hotel' },
  { url: 'https://www.meetdandy.com/technology/intraoral-scanner/', title: 'Meet Dandy – Intraoral Scanner' },
  { url: 'https://www.iwcglobal.net/', title: 'IWC Global' },
  { url: 'https://telemetry.io/', title: 'Telemetry' },
  { url: 'https://blaedagency.com/', title: 'BLAED Agency' },
  { url: 'https://trymeridian.com/', title: 'Meridian' },
  { url: 'https://www.tensorstax.com/', title: 'Tensors Tax' },
  { url: 'https://readymag.com/readymag/paris-meetup/?utm_source=awwwards&utm_medium=submission&utm_campaign=paris-meetup', title: 'Readymag – Paris Meetup' },
  { url: 'https://www.themusicproject.org/', title: 'The Music Project' },
  { url: 'https://www.themossstudio.ca/', title: 'The Moss Studio' },
  { url: 'https://www.howexposedami.co.nz/', title: 'How Exposed Am I' },
  { url: 'https://www.limeiq.com/', title: 'LimeIQ' },
  { url: 'https://www.shoprooof.com/', title: 'Rooof' },
  { url: 'https://www.wearekaleida.com/', title: 'Kaleida' },
  { url: 'https://www.so-concrete.com/', title: 'SO Concrete' },
  { url: 'https://tacosmyguey.com/', title: 'Tacos My Guey' },
  { url: 'https://size-assets.com/', title: 'Size Assets' },
  { url: 'https://www.bodyofwateranthology.com/', title: 'Body of Water Anthology' },
  { url: 'https://mockupper.ai/', title: 'Mockupper' },
  { url: 'https://www.kudanil.com/', title: 'Kudanil' },
  { url: 'https://cosmic-sans.blast-foundry.com/', title: 'Cosmic Sans – Blast Foundry' },
  { url: 'https://www.getnauta.com/', title: 'Nauta' },
  { url: 'https://www.marquet.nyc/', title: 'Marquet NYC' },
  { url: 'https://www.oakley.com/en-us/l/axiom-space', title: 'Oakley – Axiom Space' },
  { url: 'https://lucesposa.com/en', title: 'Luce Sposa' },
  { url: 'https://watchgorillascience.com/', title: 'Gorilla Science' },
  { url: 'https://bigstudio-tw.com/', title: 'Big Studio TW' },
  { url: 'https://www.paul-factory.com/en', title: 'Paul Factory' },
  { url: 'https://9870089044.com/', title: '9870089044' },
  { url: 'https://www.joelefrank.com/', title: 'Joele Frank' },
  { url: 'https://www.smalltownwitches.com/', title: 'Small Town Witches' },
  { url: 'https://www.appliedarts.com/', title: 'Applied Arts' },
  { url: 'https://branding.imaga.ai/', title: 'Imaga Branding' },
  { url: 'https://edpcollection.drvranjes.com/en', title: 'Dr. Vranjes – EDP Collection' },
  { url: 'https://nestandfield.framer.website/', title: 'Nest and Field' },
  { url: 'https://beautytools.dolcegabbana.com/en-se/fresh-skin', title: 'Dolce & Gabbana – Fresh Skin' },
  { url: 'https://www.stack.vc/', title: 'Stack VC' },
  { url: 'https://replit.com/agent3', title: 'Replit Agent 3' },
  { url: 'https://www.coffeefoundation.com/', title: 'Coffee Foundation' },
  { url: 'https://www.serienreif.com/', title: 'Serienreif' },
  { url: 'https://spenceltd.co.uk/', title: 'Spence Ltd' },
  { url: 'https://www.elevatehomescriptions.com/', title: 'Elevate Homescriptions' },
  { url: 'https://www.arcprojects.build/', title: 'Arc Projects' },
  { url: 'https://kau.studio/', title: 'Kau Studio' },
  { url: 'https://loandbehold.studio/', title: 'Lo and Behold Studio' },
  { url: 'https://www.quantumbody.io/', title: 'Quantum Body' },
  { url: 'https://www.olhalazarieva.com/', title: 'Olha Lazarieva' },
  { url: 'https://modernhuntsman.com/', title: 'Modern Huntsman' },
  { url: 'https://www.est-est.co.jp/', title: 'EST Co. Ltd.' },
  { url: 'https://iconsax.io/', title: 'Iconsax' },
  { url: 'https://www.fokuscubes.nl/', title: 'Fokus Cubes' },
  { url: 'https://www.callers.ai/', title: 'Callers AI' },
  { url: 'https://bartbeyond.art/', title: 'Bart Beyond' },
  { url: 'https://uxmachina.co/en', title: 'UX Machina' },
  { url: 'https://www.studionuts.com.br/', title: 'Studio Nuts' },
  { url: 'https://oflyn.fr/', title: 'OFLYN' },
  { url: 'https://www.arqui9.com/', title: 'Arqui9' },
  { url: 'https://function10.ca/', title: 'Function10' },
  { url: 'https://balance.michael-aust.com/', title: 'Balance – Michael Aust' },
  { url: 'https://www.reformcollective.com/', title: 'Reform Collective' },
  { url: 'https://www.faint-film.com/', title: 'Faint Film' },
  { url: 'https://www.dhk.co.za/', title: 'dhk Architects' },
  { url: 'https://dich-fashion.webflow.io/', title: 'Dich Fashion' },
  { url: 'https://www.trawelt.com/', title: 'Trawelt' },
  { url: 'https://www.turn.io/', title: 'Turn.io' },
  { url: 'https://jordan-delcros.com/', title: 'Jordan Delcros' },
  { url: 'https://sami.marketing/', title: 'Sami Marketing' },
  { url: 'https://www.micro.so/', title: 'Micro' },
  { url: 'https://www.phantom.land/', title: 'Phantom Land' },
  { url: 'https://neverhack.com/en', title: 'Neverhack' },
  { url: 'https://mallardandclaret.com/', title: 'Mallard and Claret' },
  { url: 'https://history.jailhouselawyers.org/', title: 'Jailhouse Lawyers – History' },
  { url: 'https://www.mathical.com/', title: 'Mathical' },
  { url: 'https://www.breachbunny.com/de', title: 'Breach Bunny' },
  { url: 'https://www.cartier.com/en-us/loveconfigurator.html#love=%22%7B%5C%22state%5C%22%3A%7B%5C%22result%5C%22%3Anull%2C%5C%22currentStep%5C%22%3A%5C%22model%5C%22%2C%5C%22currentSelection%5C%22%3A%7B%5C%22model%5C%22%3A%5C%22classic%5C%22%7D%7D%2C%5C%22version%5C%22%3A0%7D%22', title: 'Cartier Love Configurator' },
  { url: 'https://apartamentosguayadeque.com/es', title: 'Apartamentos Guayadeque' },
  { url: 'https://www.jokula.com/', title: 'Jokula' },
  { url: 'https://www.beteropenbaarbestuur.nl/', title: 'Beter Openbaar Bestuur' },
  { url: 'https://okapa.com/', title: 'Okapa' },
  { url: 'https://docshield.com/', title: 'DocShield' },
  { url: 'https://www.anima-cc.com/', title: 'Anima CC' },
  { url: 'https://www.voltpile.com/', title: 'Voltpile' },
  { url: 'https://feather.computer/', title: 'Feather Computer' },
  { url: 'https://firmus.co/', title: 'Firmus' },
]

/**
 * Normalize URL for matching
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim()
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized
  }
  normalized = normalized.replace(/\/$/, '')
  normalized = normalized.replace(/^https?:\/\/(www\.)?/, 'https://')
  return normalized.toLowerCase()
}

async function main() {
  console.log('🔍 Checking which websites were uploaded...\n')
  console.log(`📊 Total entries to check: ${WEBSITE_ENTRIES.length}\n`)

  const uploaded: string[] = []
  const missing: Array<{ title: string; url: string }> = []

  for (const entry of WEBSITE_ENTRIES) {
    const normalizedUrl = normalizeUrl(entry.url)
    
    // Check if site exists with this URL and has website images
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: { equals: entry.url, mode: 'insensitive' } },
          { url: { contains: normalizedUrl.replace('https://', '').replace('http://', ''), mode: 'insensitive' } },
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
      uploaded.push(entry.url)
      console.log(`✅ ${entry.title}`)
    } else {
      missing.push(entry)
      console.log(`❌ ${entry.title} - NOT FOUND`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Uploaded: ${uploaded.length}/${WEBSITE_ENTRIES.length}`)
  console.log(`❌ Missing: ${missing.length}/${WEBSITE_ENTRIES.length}`)

  if (missing.length > 0) {
    console.log('\n❌ Missing entries:')
    missing.forEach(entry => {
      console.log(`  - ${entry.title}: ${entry.url}`)
    })
  }

  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error('❌ Error:', err)
  await prisma.$disconnect()
  process.exit(1)
})

