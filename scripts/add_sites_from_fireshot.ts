#!/usr/bin/env tsx
/**
 * Add sites from FireShot screenshots directory
 * 
 * This script adds multiple sites and matches them with existing screenshots
 * from the FireShot directory.
 * 
 * Usage:
 *   npx tsx scripts/add_sites_from_fireshot.ts
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// URLs to add
const urls = [
  'https://dontboardme.com/',
  'https://en.manayerbamate.com/',
  'https://opalcamera.com/opal-tadpole',
  'https://kprverse.com/',
  'https://persepolis.getty.edu/',
  'https://www.chungiyoo.com/',
  'https://www.kodeclubs.com/',
  'https://synchronized.studio/',
  'https://2019.makemepulse.com/',
  'https://www.orano.group/experience/innovation/en/slider',
  'https://activetheory.net/',
  'https://insidethehead.co/chapters',
  'https://mendo.nl/',
  'https://paperplanes.world/',
  'https://www.kikk.be/2016/',
  'http://falter.wild.plus/#en',
  'http://www.because-recollection.com/metronomy',
  'http://species-in-pieces.com/',
  'http://nixon.com/',
  'https://www.aquest.it/',
  'https://24hoursofhappy.com/',
  'https://blacknegative.com/#!/whoweare/',
  'https://franshalsmuseum.nl/en',
]

// Map URLs to screenshot filenames
function findScreenshotForUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')
    const pathname = urlObj.pathname
    
    // Read all files in FireShot directory
    const files = fs.readdirSync(FIRESHOT_DIR)
    
    // Try to find matching screenshot
    for (const file of files) {
      if (!file.endsWith('.png')) continue
      
      const fileLower = file.toLowerCase()
      const urlLower = url.toLowerCase()
      
      // Check if filename contains the hostname
      if (fileLower.includes(hostname.toLowerCase())) {
        return path.join(FIRESHOT_DIR, file)
      }
      
      // Check if filename contains URL in brackets (FireShot format)
      const bracketMatch = file.match(/\[([^\]]+)\]/)
      if (bracketMatch) {
        const bracketUrl = bracketMatch[1].toLowerCase()
        if (bracketUrl.includes(hostname.toLowerCase())) {
          return path.join(FIRESHOT_DIR, file)
        }
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error finding screenshot for ${url}:`, error)
    return null
  }
}

async function addSiteWithScreenshot(url: string, screenshotPath: string | null) {
  try {
    // Normalize URL
    const normalizedUrl = url.trim().replace(/\/$/, '')
    
    // Extract title from URL
    const siteTitle = new URL(normalizedUrl).hostname.replace('www.', '')
    
    console.log(`\n🚀 Adding site: ${normalizedUrl}`)
    console.log(`   Title: ${siteTitle}`)
    
    // Check if site already exists
    const existing = await prisma.site.findFirst({
      where: { url: normalizedUrl },
    })
    
    if (existing) {
      console.log(`   ⏭️  Site already exists, skipping`)
      return { success: true, skipped: true }
    }
    
    // If we have a screenshot, we need to upload it first
    // For now, let's use the API which will generate screenshots
    // We can enhance this later to use the local screenshots
    
    const response = await fetch(`${API_URL}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: siteTitle,
        description: '',
        url: normalizedUrl,
        imageUrl: '', // Empty to trigger screenshot generation
        author: '',
        tags: [],
      }),
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error(`   ❌ Failed to add site: ${error.error || response.statusText}`)
      return { success: false, error: error.error || response.statusText }
    }
    
    const data = await response.json()
    const siteId = data.site?.id
    
    if (!siteId) {
      console.error('   ❌ No site ID returned')
      return { success: false, error: 'No site ID returned' }
    }
    
    console.log(`   ✅ Site created: ${siteId}`)
    if (screenshotPath) {
      console.log(`   📸 Screenshot available: ${path.basename(screenshotPath)}`)
      console.log(`   ℹ️  Note: Using screenshot service for now. Local screenshot can be uploaded later.`)
    }
    
    return { success: true, siteId }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('📝 Adding sites from FireShot directory')
  console.log('═'.repeat(60))
  console.log(`Total URLs: ${urls.length}\n`)
  
  let added = 0
  let skipped = 0
  let failed = 0
  
  for (const url of urls) {
    const screenshotPath = findScreenshotForUrl(url)
    const result = await addSiteWithScreenshot(url, screenshotPath)
    
    if (result.skipped) {
      skipped++
    } else if (result.success) {
      added++
    } else {
      failed++
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 SUMMARY:')
  console.log('═'.repeat(60))
  console.log(`   ✅ Added: ${added}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📊 Total: ${urls.length}`)
  console.log('═'.repeat(60))
  console.log('\n💡 Note: Screenshots will be generated by the screenshot service.')
  console.log('   Processing (embedding + tagging) will happen automatically.\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

