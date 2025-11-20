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
  { url: 'https://www.dashline.tech/', title: 'Dashline', image: 'www.dashline.tech.png' },
  { url: 'https://www.aurelienduny.com/', title: 'Aurélien Duny', image: 'www.aurelienduny.com.png' },
  { url: 'https://retailpath.xyz/', title: 'RetailPath', image: 'retailpath.xyz.png' },
  { url: 'https://www.affinity.studio/', title: 'Affinity Studio', image: 'www.affinity.studio.png' },
  { url: 'https://www.lightspark.com/', title: 'Lightspark', image: 'www.lightspark.com.png' },
  { url: 'https://www.pedestal.com/', title: 'Pedestal', image: 'www.pedestal.com.png' },
  { url: 'https://www.transform9.com/', title: 'Transform9', image: 'www.transform9.com.png' },
  { url: 'https://headroom.com/', title: 'Headroom', image: 'headroom.com.png' },
  { url: 'https://payy.link/', title: 'Payy', image: 'payy.link.png' },
  { url: 'https://t3.tech/', title: 'T3', image: 't3.tech.png' },
  { url: 'https://bejamas.com/', title: 'Bejamas', image: 'bejamas.com.png' },
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

