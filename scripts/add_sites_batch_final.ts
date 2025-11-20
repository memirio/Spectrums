#!/usr/bin/env tsx
import 'dotenv/config'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const sites = [
  { url: 'https://www.matcharen.com/', title: 'Matcha REN', image: 'www.matcharen.com.png' },
  { url: 'https://posthmnlab.com/', title: 'Posthuman Lab', image: 'posthmnlab.com.png' },
  { url: 'https://www.squadeasy.com/en/', title: 'SquadEasy', image: 'www.squadeasy.com.png' },
  { url: 'https://www.coinsetters.io/', title: 'Coinsetters', image: 'www.coinsetters.io.png' },
  { url: 'https://www.clutch.security/', title: 'Clutch Security', image: 'www.clutch.security.png' },
  { url: 'https://pleasecallmechamp.com/', title: 'Please Call Me Champ', image: 'pleasecallmechamp.com.png' },
  { url: 'https://solreader.com/', title: 'Sol Reader', image: 'solreader.com.png' },
  { url: 'https://swehl.com/', title: 'Swehl', image: 'swehl.com.png' },
  { url: 'https://www.chong.studio/', title: 'Chong Studio', image: 'www.chong.studio.png' },
]

const imageDir = '/Users/victor/Downloads/FireShot'
const scriptPath = 'scripts/add_site_with_local_image.ts'
const SITE_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes per site (should be enough for tagging, but hub detection runs async)

async function runWithTimeout(command: string, timeoutMs: number): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const child = exec(command, {
      maxBuffer: 10 * 1024 * 1024,
      stdio: 'inherit'
    }, (error) => {
      if (error) {
        resolve({ success: false, error: error.message })
      } else {
        resolve({ success: true })
      }
    })

    // Set timeout
    const timeout = setTimeout(() => {
      child.kill('SIGTERM')
      resolve({ success: false, error: 'Timeout after ' + (timeoutMs / 1000) + ' seconds' })
    }, timeoutMs)

    child.on('exit', () => {
      clearTimeout(timeout)
    })
  })
}

async function main() {
  console.log(`Adding ${sites.length} sites...\n`)
  
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    const imagePath = `${imageDir}/${site.image}`
    
    console.log(`[${i + 1}/${sites.length}] ${site.title}`)
    
    try {
      const command = `npx tsx "${scriptPath}" "${site.url}" "${site.title}" "${imagePath}"`
      const result = await runWithTimeout(command, SITE_TIMEOUT_MS)
      
      if (result.success) {
        console.log(`✅ ${site.title} completed\n`)
      } else {
        console.error(`⚠️  ${site.title} ${result.error || 'failed'}\n`)
      }
    } catch (error: any) {
      console.error(`❌ ${site.title} failed: ${error.message}\n`)
    }
    
    if (i < sites.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.log('✅ All sites processed!')
}

main().catch(console.error)

