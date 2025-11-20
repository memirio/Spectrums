#!/usr/bin/env tsx
/**
 * Add Multiple Sites Batch - Round 2
 * 
 * Adds multiple sites with their local images in batch
 */

import 'dotenv/config'
import { execSync } from 'child_process'
import path from 'path'

const sites = [
  { url: 'https://www.merus1894.com/', title: 'Merus', image: 'www.merus1894.com.png' },
  { url: 'https://uncut.wtf/', title: 'Uncut', image: 'uncut.wtf.png' },
  { url: 'https://www.huddle.works/', title: 'Huddle', image: 'www.huddle.works.png' },
  { url: 'https://www.studio-office.fun/', title: 'Studio Office', image: 'www.studio-office.fun.png' },
  { url: 'https://softglossary.space/', title: 'Soft Glossary', image: 'softglossary.space.png' },
  { url: 'https://www.buffet.digital/', title: 'Buffet Digital', image: 'www.buffet.digital.png' },
  { url: 'https://www.balky.studio/', title: 'Balky Studio', image: 'www.balky.studio.png' },
  { url: 'https://www.uspsdelivers.com/2020-2021-generational-research-report/', title: 'USPS Generational Research', image: 'www.uspsdelivers.com.png' },
  { url: 'https://kokopako.fr/', title: 'Kokopako', image: 'kokopako.fr.png' },
  { url: 'https://clairouxstudio.com/', title: 'Clairoux Studio', image: 'clairouxstudio.com.png' },
  { url: 'https://www.livesurface.com/', title: 'Live Surface', image: 'www.livesurface.com.png' },
  { url: 'https://viens-la.com/en/', title: 'Viens La', image: 'viens-la.com.png' },
  { url: 'https://ossa.wine/', title: 'Ossa Wine', image: 'ossa.wine.png' },
  { url: 'https://counter-forms.com/', title: 'Counter Forms', image: 'counter-forms.com.png' },
]

const imageDir = '/Users/victor/Downloads/FireShot'
const scriptPath = path.join(process.cwd(), 'scripts', 'add_site_with_local_image.ts')

async function main() {
  console.log('═'.repeat(70))
  console.log('🚀 Batch Adding Sites - Round 2')
  console.log('═'.repeat(70))
  console.log(`\nTotal sites to add: ${sites.length}\n`)

  const results: Array<{ url: string; title: string; success: boolean; error?: string }> = []

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
        results.push({ url: site.url, title: site.title, success: true })
      } else {
        console.log(`   ⚠️  Unknown status`)
        results.push({ url: site.url, title: site.title, success: true }) // Assume success if no error
      }
    } catch (error: any) {
      const errorMsg = error.message || String(error)
      console.error(`   ❌ Failed: ${errorMsg.substring(0, 100)}`)
      results.push({ url: site.url, title: site.title, success: false, error: errorMsg })
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
      console.log(`   - ${r.title} (${r.url}): ${r.error?.substring(0, 80)}`)
    })
  }
  
  console.log('\n✅ Batch processing complete!')
}

main().catch(console.error)

