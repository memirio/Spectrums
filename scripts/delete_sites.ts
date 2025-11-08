#!/usr/bin/env tsx
/**
 * Permanently Delete Sites
 * 
 * Deletes sites and all related data (images, embeddings, tags) from the database.
 * 
 * Usage:
 *   tsx scripts/delete_sites.ts <url1> [url2] ...
 * 
 * Example:
 *   tsx scripts/delete_sites.ts "https://zipvoyager.com/" "https://summitsystems.co.uk/"
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const SITES_TO_DELETE = [
  'https://zipvoyager.com/',
  'https://summitsystems.co.uk/',
  'https://esarj.com/en',
  'https://odysseycontracting.com/',
]

async function deleteSite(url: string): Promise<boolean> {
  try {
    // Normalize URL (remove trailing slash, lowercase)
    const normalizedUrl = url.toLowerCase().replace(/\/$/, '')
    
    // Find site by URL (try multiple variations)
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: url },
          { url: normalizedUrl },
          { url: url.replace(/\/$/, '') },
          { url: { contains: url.replace(/^https?:\/\//i, '').replace(/\/$/, '') } }
        ]
      },
      include: {
        images: {
          include: {
            embedding: true,
            tags: true,
          }
        }
      }
    })
    
    if (!site) {
      console.log(`   ⚠️  Site not found: ${url}`)
      return false
    }
    
    console.log(`   📋 Found: ${site.title}`)
    console.log(`      URL: ${site.url}`)
    console.log(`      Images: ${site.images.length}`)
    
    // Count related data
    const imageCount = site.images.length
    let embeddingCount = 0
    let tagCount = 0
    
    for (const image of site.images) {
      if (image.embedding) embeddingCount++
      tagCount += image.tags.length
    }
    
    if (embeddingCount > 0) console.log(`      Embeddings: ${embeddingCount}`)
    if (tagCount > 0) console.log(`      Tags: ${tagCount}`)
    
    // Delete the site (cascades will handle images, embeddings, and tags)
    await prisma.site.delete({
      where: { id: site.id }
    })
    
    console.log(`   ✅ Deleted site and all related data`)
    return true
    
  } catch (error: any) {
    console.error(`   ❌ Error deleting ${url}:`, error.message)
    return false
  }
}

async function main() {
  const urls = process.argv.slice(2).length > 0 
    ? process.argv.slice(2) 
    : SITES_TO_DELETE
  
  console.log(`🗑️  Deleting ${urls.length} site(s) permanently...`)
  console.log('')
  
  const results = {
    deleted: 0,
    notFound: 0,
    errors: 0,
  }
  
  for (const url of urls) {
    console.log(`\nProcessing: ${url}`)
    const deleted = await deleteSite(url)
    
    if (deleted) {
      results.deleted++
    } else {
      // Check if it was an error or just not found
      const site = await prisma.site.findFirst({
        where: {
          OR: [
            { url: url },
            { url: url.toLowerCase().replace(/\/$/, '') },
            { url: url.replace(/\/$/, '') },
          ]
        }
      })
      if (site) {
        results.errors++
      } else {
        results.notFound++
      }
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 Deletion Summary:')
  console.log(`   ✅ Successfully deleted: ${results.deleted}`)
  console.log(`   ⚠️  Not found: ${results.notFound}`)
  console.log(`   ❌ Errors: ${results.errors}`)
  console.log('='.repeat(60))
  
  if (results.deleted > 0) {
    console.log('\n⚠️  WARNING: Deletions are permanent and cannot be undone!')
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

