#!/usr/bin/env tsx
/**
 * Batch add multiple sites
 * 
 * Usage:
 *   npx tsx scripts/add_sites_batch.ts
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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

async function addSite(url: string) {
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
    
    // Try API first, fallback to direct database insert
    try {
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
      
      if (response.ok) {
        const data = await response.json()
        const siteId = data.site?.id
        
        if (siteId) {
          console.log(`   ✅ Site created via API: ${siteId}`)
          console.log(`   ℹ️  Screenshot and tagging will be processed asynchronously`)
          return { success: true, siteId }
        }
      }
    } catch (apiError) {
      console.log(`   ⚠️  API unavailable, adding directly to database...`)
    }
    
    // Fallback: Add directly to database
    const site = await prisma.site.create({
      data: {
        title: siteTitle,
        url: normalizedUrl,
        author: '',
        description: '',
        imageUrl: null,
      },
    })
    
    console.log(`   ✅ Site created directly: ${site.id}`)
    console.log(`   ℹ️  Screenshot and tagging will need to be processed separately`)
    
    return { success: true, siteId: site.id }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('📦 Batch Adding Sites')
  console.log('═'.repeat(60))
  console.log(`Total sites to add: ${urls.length}\n`)
  
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ url: string; error: string }>,
  }
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    console.log(`\n[${i + 1}/${urls.length}]`)
    
    const result = await addSite(url)
    
    if (result.success) {
      if (result.skipped) {
        results.skipped++
      } else {
        results.success++
      }
    } else {
      results.failed++
      results.errors.push({ url, error: result.error || 'Unknown error' })
    }
    
    // Small delay between requests to avoid overwhelming the API
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('\n' + '═'.repeat(60))
  console.log('📊 Summary')
  console.log('═'.repeat(60))
  console.log(`✅ Successfully added: ${results.success}`)
  console.log(`⏭️  Skipped (already exists): ${results.skipped}`)
  console.log(`❌ Failed: ${results.failed}`)
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(({ url, error }) => {
      console.log(`   - ${url}: ${error}`)
    })
  }
  
  console.log('\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

