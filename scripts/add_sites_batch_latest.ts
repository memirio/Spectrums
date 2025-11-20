#!/usr/bin/env tsx
/**
 * Add Multiple Sites Batch
 * 
 * Adds multiple sites with their local images in batch
 */

import 'dotenv/config'
import { execSync } from 'child_process'
import path from 'path'

const sites = [
  { url: 'https://vision.avatr.com/', title: 'Vision Avatr', image: 'vision.avatr.com.png' },
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
const scriptPath = path.join(process.cwd(), 'scripts', 'add_site_with_local_image.ts')

async function main() {
  console.log('═'.repeat(70))
  console.log('🚀 Batch Adding Sites')
  console.log('═'.repeat(70))
  console.log(`\nTotal sites to add: ${sites.length}\n`)

  const results: Array<{ url: string; success: boolean; error?: string }> = []

  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    const imagePath = path.join(imageDir, site.image)
    
    console.log(`\n[${i + 1}/${sites.length}] Adding: ${site.title}`)
    console.log(`   URL: ${site.url}`)
    console.log(`   Image: ${site.image}`)
    
    try {
      const command = `npx tsx "${scriptPath}" "${site.url}" "${site.title}" "${imagePath}"`
      const output = execSync(command, { 
        encoding: 'utf-8',
        stdio: 'pipe',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      })
      
      // Check if it was successful
      if (output.includes('✅ Successfully processed!') || output.includes('⚠️  Site already exists')) {
        console.log(`   ✅ Success`)
        results.push({ url: site.url, success: true })
      } else {
        console.log(`   ⚠️  Unknown status`)
        results.push({ url: site.url, success: true }) // Assume success if no error
      }
    } catch (error: any) {
      const errorMsg = error.message || String(error)
      console.error(`   ❌ Failed: ${errorMsg.substring(0, 100)}`)
      results.push({ url: site.url, success: false, error: errorMsg })
    }
    
    // Small delay between sites to avoid overwhelming the system
    if (i < sites.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '═'.repeat(70))
  console.log('📊 Batch Results Summary')
  console.log('═'.repeat(70))
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`\n✅ Successful: ${successful}/${sites.length}`)
  console.log(`❌ Failed: ${failed}/${sites.length}`)
  
  if (failed > 0) {
    console.log('\nFailed sites:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.url}: ${r.error?.substring(0, 80)}`)
    })
  }
  
  console.log('\n✅ Batch processing complete!')
}

main().catch(console.error)

