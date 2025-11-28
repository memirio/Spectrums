#!/usr/bin/env tsx
/**
 * Bulk Add Website Items
 * 
 * Uses the regular pipeline (add_site_with_local_image.ts) for each site.
 */

import 'dotenv/config'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

const IMAGE_DIR = '/Users/victor/Downloads/FireShot'
const CATEGORY = 'website'

interface WebsiteItem {
  url: string
  title: string
  imageFile: string
}

const websites: WebsiteItem[] = [
  { url: 'https://saraheismanstudio.com/', title: 'Sarah Eisman Studio', imageFile: 'saraheismanstudio.com.png' },
  { url: 'https://aneshk.design/', title: 'Anesh Kangutkar', imageFile: 'aneshk.design.png' },
  { url: 'https://www.shapes.gallery/', title: 'Shapes Gallery', imageFile: 'www.shapes.gallery.png' },
  { url: 'https://www.davehawkins.co/', title: 'Dave Hawkins', imageFile: 'www.davehawkins.co.png' },
  { url: 'https://balajmarius.com/', title: 'Balaj Marius', imageFile: 'balajmarius.com.png' },
  { url: 'https://www.manifold.bio/', title: 'Manifold', imageFile: 'www.manifold.bio.png' },
  { url: 'https://kereliott.com/', title: 'Ker Elliott', imageFile: 'kereliott.com.png' },
  { url: 'https://dreamrecorder.ai/', title: 'Dream Recorder', imageFile: 'dreamrecorder.ai.png' },
  { url: 'https://www.creativesouth.com/', title: 'Creative South', imageFile: 'www.creativesouth.com.png' },
  { url: 'https://zigzaglife.in/', title: 'Zigzag Life', imageFile: 'zigzaglife.in.png' },
  { url: 'https://www.re-do.studio/', title: 'Re-do Studio', imageFile: 'www.re-do.studio.png' },
  { url: 'https://elliott.mangham.dev/', title: 'Elliott Mangham', imageFile: 'elliott.mangham.dev.png' },
  { url: 'https://deadsimplejobs.com/', title: 'Dead Simple Jobs', imageFile: 'deadsimplejobs.com.png' },
  { url: 'https://banch.bausola.com/en', title: 'Banch', imageFile: 'banch.bausola.com.png' },
  { url: 'https://do-undo.com/', title: 'Do Undo', imageFile: 'do-undo.com.png' },
  { url: 'https://bridgingtables.com/', title: 'Bridging Tables', imageFile: 'bridgingtables.com.png' },
  { url: 'https://noir.global/', title: 'Noir', imageFile: 'noir.global.png' },
  { url: 'https://www.tabs.com/', title: 'Tabs', imageFile: 'www.tabs.com.png' },
  { url: 'https://legora.com/', title: 'Legora', imageFile: 'legora.com.png' },
]

async function addWebsite(item: WebsiteItem): Promise<void> {
  const imagePath = path.join(IMAGE_DIR, item.imageFile)
  const scriptPath = path.join(process.cwd(), 'scripts', 'add_site_with_local_image.ts')
  
  console.log(`\n📝 Adding: ${item.title}`)
  console.log(`   🔗 URL: ${item.url}`)
  console.log(`   🖼️  Image: ${item.imageFile}`)
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx tsx "${scriptPath}" "${item.url}" "${item.title}" "${imagePath}" "${CATEGORY}"`,
      { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    )
    
    // Show key output lines
    if (stdout) {
      const lines = stdout.split('\n').filter(l => 
        l.trim() && (l.includes('✅') || l.includes('📝') || l.includes('⚠️') || l.includes('❌') || l.includes('🏷️') || l.includes('🤖'))
      )
      lines.forEach(line => {
        if (line.trim()) console.log(`   ${line.trim()}`)
      })
    }
    if (stderr && !stderr.includes('Warning') && !stderr.includes('ExperimentalWarning')) {
      console.log(`   ⚠️  ${stderr.trim()}`)
    }
  } catch (error: any) {
    // Check if it's a duplicate (that's okay)
    if (error.message?.includes('already exists') || 
        error.stdout?.includes('already exists') || 
        error.stderr?.includes('already exists')) {
      console.log(`   ℹ️  Site already exists, skipping...`)
    } else {
      console.error(`   ❌ Error: ${error.message}`)
      if (error.stdout) {
        const lines = error.stdout.split('\n').filter(l => l.trim())
        lines.slice(-5).forEach(line => console.error(`   📄 ${line}`))
      }
    }
  }
}

async function main() {
  console.log(`\n🚀 Starting bulk upload of ${websites.length} websites...`)
  console.log(`   📁 Image directory: ${IMAGE_DIR}`)
  console.log(`   📦 Category: ${CATEGORY}`)
  console.log(`   ⚡ Using regular pipeline (tagging runs in background for new concepts)\n`)
  
  let successCount = 0
  let skipCount = 0
  let errorCount = 0
  
  for (const item of websites) {
    try {
      await addWebsite(item)
      successCount++
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++
      } else {
        errorCount++
      }
    }
  }
  
  console.log(`\n✅ Upload complete!`)
  console.log(`   ✅ Processed: ${successCount}`)
  console.log(`   ℹ️  Skipped (already exists): ${skipCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`\n💡 Tagging of new concepts on all images runs in background.\n`)
}

main().catch(console.error)

