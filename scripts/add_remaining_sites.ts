#!/usr/bin/env tsx
import 'dotenv/config'
import { execSync } from 'child_process'

const sites = [
  { url: 'https://radaville.studio/', title: 'Radaville Studio', image: 'radaville.studio.png' },
  { url: 'https://cappen.com/', title: 'Cappen', image: 'cappen.com.png' },
  { url: 'https://messenger.abeto.co/', title: 'Messenger Abeto', image: 'messenger.abeto.co.png' },
  { url: 'https://www.wearekaleida.com/', title: 'Kaleida', image: 'www.wearekaleida.com.png' },
  { url: 'https://iventions.com/', title: 'Iventions', image: 'iventions.com.png' },
  { url: 'https://soil-net.jp/', title: 'Soil Net', image: 'soil-net.jp.png' },
  { url: 'https://www.marie-antoinette.fr/', title: 'Marie Antoinette', image: 'www.marie-antoinette.fr.png' },
  { url: 'https://amritpalace.com/', title: 'Amrit Palace', image: 'amritpalace.com.png' },
  { url: 'https://designbeyondbarriers.com/', title: 'Design Beyond Barriers', image: 'designbeyondbarriers.com.png' },
  { url: 'https://play2.studiogusto.com/', title: 'Studio Gusto', image: 'play2.studiogusto.com.png' },
  { url: 'https://www.inno-centre.com/en', title: 'Inno Centre', image: 'www.inno-centre.com.png' },
  { url: 'https://www.minimalsteel.com/nl', title: 'Minimal Steel', image: 'www.minimalsteel.com.png' },
  { url: 'https://julieguzal.fr/', title: 'Julie Guzal', image: 'julieguzal.fr.png' },
  { url: 'http://www.4milesproject.com/#/album/birth-of-the-cool', title: '4 Miles Project', image: 'www.4milesproject.com.png' },
  { url: 'https://letter.co/', title: 'Letter', image: 'letter.co.png' },
  { url: 'https://experiments.p5aholic.me/', title: 'P5aholic Experiments', image: 'experiments.p5aholic.me.png' },
]

const imageDir = '/Users/victor/Downloads/FireShot'
const scriptPath = 'scripts/add_site_with_local_image.ts'

async function main() {
  console.log(`Adding ${sites.length} sites...\n`)
  
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    const imagePath = `${imageDir}/${site.image}`
    
    console.log(`[${i + 1}/${sites.length}] ${site.title}`)
    
    try {
      execSync(`npx tsx "${scriptPath}" "${site.url}" "${site.title}" "${imagePath}"`, {
        stdio: 'inherit',
        maxBuffer: 10 * 1024 * 1024
      })
      console.log(`✅ ${site.title} completed\n`)
    } catch (error) {
      console.error(`❌ ${site.title} failed\n`)
    }
    
    if (i < sites.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('✅ All sites processed!')
}

main().catch(console.error)

