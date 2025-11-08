#!/usr/bin/env tsx
/**
 * Process FireShot Screenshots
 * 
 * Processes all screenshots from /Users/victor/Downloads/FireShot,
 * matches them to sites by filename, and uploads them with full
 * embedding and tagging.
 * 
 * Usage:
 *   tsx scripts/process_fireshot_screenshots.ts
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { TAG_CONFIG } from '../src/lib/tagging-config'
import { uploadImageToMinIO } from './upload_to_minio'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const FIRESHOT_DIR = '/Users/victor/Downloads/FireShot'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

/**
 * Extract URL from FireShot filename
 * Examples:
 *   "FireShot Capture 041 - Page Title - [www.chew.productions].png" -> "https://www.chew.productions/"
 *   "FireShot Capture 042 - Discovery - [brand.base.org].png" -> "http://brand.base.org/"
 *   "stripe.com.png" -> null (fallback to domain matching)
 */
function extractUrlFromFilename(filename: string): string | null {
  // Remove extension
  const name = path.basename(filename, path.extname(filename))
  
  // Try to extract URL from square brackets (FireShot pattern)
  // Pattern: "FireShot Capture [number] - [Page Title] - [URL]"
  const bracketMatch = name.match(/\[([^\]]+)\]/)
  if (bracketMatch) {
    let url = bracketMatch[1].trim()
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    // Ensure URL ends with /
    if (!url.endsWith('/') && !url.includes('?')) {
      url = `${url}/`
    }
    return url
  }
  
  return null
}

/**
 * Extract domain/website name from filename (fallback for non-FireShot patterns)
 */
function extractWebsiteFromFilename(filename: string): string {
  // Remove extension
  let name = path.basename(filename, path.extname(filename))
  
  // Remove www. prefix if present
  name = name.replace(/^www\./i, '')
  
  // Remove common suffixes like " - Page Title"
  name = name.split(' - ')[0].trim()
  
  // If it contains a domain pattern with subdomain (e.g., "25.hgcapital.com"), extract full domain
  const fullDomainMatch = name.match(/([a-z0-9\-\.]+\.[a-z]{2,})/i)
  if (fullDomainMatch) {
    return fullDomainMatch[1].toLowerCase()
  }
  
  // If it contains a simple domain pattern, extract it
  const domainMatch = name.match(/([a-z0-9\-]+\.(com|io|ai|co|net|org|fr|se|uk|ch|studio|xyz|ca|me|pt|app|live|tv|eu|design|ooo))/i)
  if (domainMatch) {
    return domainMatch[1].toLowerCase()
  }
  
  // Otherwise return the cleaned name (for brand names like "Felbeco")
  return name.toLowerCase()
}

/**
 * Normalize URL for matching (remove protocol, www, trailing slash, paths, etc.)
 */
function normalizeUrlForMatching(u: string): string {
  let normalized = u.toLowerCase().trim()
  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '')
  // Remove www prefix
  normalized = normalized.replace(/^www\./, '')
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')
  // Remove path after domain (keep only domain)
  const pathMatch = normalized.match(/^([^\/]+)/)
  if (pathMatch) {
    normalized = pathMatch[1]
  }
  return normalized
}

/**
 * Find site by URL (exact or normalized match)
 */
async function findSiteByUrl(url: string): Promise<any | null> {
  try {
    const normalizedUrl = normalizeUrlForMatching(url)
    
    // Get all sites
    const allSites = await prisma.site.findMany({
      select: { id: true, title: true, url: true }
    })
    
    // Try exact domain match (normalized)
    let site = allSites.find(s => {
      const siteUrlNorm = normalizeUrlForMatching(s.url)
      return siteUrlNorm === normalizedUrl
    })
    
    // If we found a match, fetch the full record
    if (site) {
      return await prisma.site.findUnique({
        where: { id: site.id }
      })
    }
    
    return null
  } catch (error) {
    console.error(`Error finding site by URL: ${error}`)
    return null
  }
}

/**
 * Match a website identifier to a site in the database (fallback for domain matching)
 */
async function findSiteByWebsite(website: string): Promise<any | null> {
  // Normalize the website identifier (remove www, etc.)
  const normalizedWebsite = normalizeUrlForMatching(website.includes('.') ? website : `https://${website}`)
  
  // Get all sites
  const allSites = await prisma.site.findMany({
    select: { id: true, title: true, url: true }
  })
  
  // Try exact domain match (normalized)
  let site = allSites.find(s => {
    const siteUrlNorm = normalizeUrlForMatching(s.url)
    return siteUrlNorm === normalizedWebsite
  })
  
  // If not found, try partial domain match (just the main domain)
  if (!site) {
    const mainDomain = normalizedWebsite.split('.')[0]
    if (mainDomain && mainDomain.length > 2) {
      site = allSites.find(s => {
        const siteUrlNorm = normalizeUrlForMatching(s.url)
        return siteUrlNorm.split('.')[0] === mainDomain
      })
    }
  }
  
  // If still not found, try matching by base domain (e.g., "symphonyofvines.unseen.co" -> "symphonyofvines.com")
  if (!site) {
    const baseDomainParts = normalizedWebsite.split('.')
    if (baseDomainParts.length >= 2) {
      // Try matching first part of domain (e.g., "symphonyofvines" from "symphonyofvines.unseen.co")
      const firstPart = baseDomainParts[0]
      
      // Also try matching base name (everything except last 2 parts for subdomains)
      const baseName = baseDomainParts.length > 2 ? baseDomainParts.slice(0, -2).join('.') : baseDomainParts[0]
      
      site = allSites.find(s => {
        const siteUrlNorm = normalizeUrlForMatching(s.url)
        const siteBaseParts = siteUrlNorm.split('.')
        const siteFirstPart = siteBaseParts[0]
        const siteBaseName = siteBaseParts.length > 2 ? siteBaseParts.slice(0, -2).join('.') : siteBaseParts[0]
        
        // Match if first part is the same or one includes the other
        return siteFirstPart === firstPart || 
               siteBaseName === baseName || 
               (firstPart.length > 5 && siteFirstPart.includes(firstPart)) ||
               (siteFirstPart.length > 5 && firstPart.includes(siteFirstPart))
      })
    }
  }
  
  // If not found, try title match
  if (!site) {
    const websiteLower = website.toLowerCase()
    site = allSites.find(s => {
      const titleLower = s.title.toLowerCase()
      return titleLower.includes(websiteLower) || websiteLower.includes(titleLower.replace(/\./g, ''))
    })
  }
  
  // If we found a match, fetch the full record
  if (site) {
    return await prisma.site.findUnique({
      where: { id: site.id }
    })
  }
  
  return null
}

async function processImage(filePath: string, site: any): Promise<void> {
  const filename = path.basename(filePath)
  console.log(`\n📸 Processing: ${filename}`)
  console.log(`   Site: ${site.title}`)
  console.log(`   URL: ${site.url}`)
  
  // Read image file
  const buf = fs.readFileSync(filePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`   📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Canonicalize to get contentHash before upload
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`   🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Upload to MinIO/CDN
  console.log(`   ☁️  Uploading to MinIO...`)
  const imageUrl = await uploadImageToMinIO(filePath, contentHash)
  console.log(`   ✅ Uploaded: ${imageUrl}`)
  
  // Delete any existing images for this site
  const existingImages = await prisma.image.findMany({
    where: { siteId: site.id }
  })
  
  if (existingImages.length > 0) {
    console.log(`   🗑️  Removing ${existingImages.length} old image(s)...`)
    await prisma.image.deleteMany({
      where: { siteId: site.id }
    })
    // Also clean up orphaned embeddings (optional - they'll be reused if contentHash matches)
  }
  
  // Create Image record
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: {
      width,
      height,
      bytes,
    },
    create: {
      siteId: site.id,
      url: imageUrl,
      width,
      height,
      bytes,
    },
  })
  
  console.log(`   ✅ Image record created (ID: ${image.id})`)
  
  // Check if embedding already exists by contentHash
  const existing = await prisma.imageEmbedding.findFirst({
    where: { contentHash: contentHash } as any
  })
  
  let ivec: number[]
  if (existing) {
    // Reuse existing embedding
    ivec = existing.vector as unknown as number[]
    console.log(`   ♻️  Reusing existing embedding (from image ID: ${existing.imageId})`)
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: { contentHash: contentHash } as any,
      create: {
        imageId: image.id,
        model: existing.model,
        vector: existing.vector as any,
        contentHash: contentHash
      } as any,
    })
  } else {
    // Compute new embedding
    console.log(`   🤖 Computing image embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: {
        vector: ivec as any,
        model: 'clip-ViT-L/14',
        contentHash: contentHash
      } as any,
      create: {
        imageId: image.id,
        vector: ivec as any,
        model: 'clip-ViT-L/14',
        contentHash: contentHash
      } as any,
    })
    console.log(`   ✅ Embedding computed (dim: ${ivec.length})`)
  }
  
    // Score against concepts and create tags using pragmatic tagging
    console.log(`   🏷️  Computing tags...`)
    const concepts = await prisma.concept.findMany()
    if (concepts.length > 0) {
      const scored = concepts
        .map(c => ({
          c,
          score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
        }))
        .sort((a, b) => b.score - a.score)
      
      const aboveThreshold = scored.filter(s => s.score >= TAG_CONFIG.MIN_SCORE)
      const chosen: typeof scored = []
      
      for (let i = 0; i < aboveThreshold.length && chosen.length < TAG_CONFIG.MAX_K; i++) {
        const current = aboveThreshold[i]
        const prev = chosen[chosen.length - 1]
        
        if (chosen.length === 0) {
          chosen.push(current)
          continue
        }
        
        if (prev && prev.score > 0) {
          const dropPct = (prev.score - current.score) / prev.score
          if (dropPct > TAG_CONFIG.MIN_SCORE_DROP_PCT) {
            break
          }
        }
        
        chosen.push(current)
      }
      
      const final = chosen.length > 0 ? chosen : scored.slice(0, TAG_CONFIG.FALLBACK_K)
      
      // Delete old tags for this image
      await prisma.imageTag.deleteMany({
        where: { imageId: image.id }
      })
      
      // Create new tags
      for (const { c, score } of final) {
        await prisma.imageTag.upsert({
          where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
          update: { score },
          create: { imageId: image.id, conceptId: c.id, score },
        })
      }
      
      console.log(`   ✅ Tagged with ${final.length} concepts:`)
      final.forEach(({ c, score }) => {
        console.log(`      - ${c.label}: ${score.toFixed(3)}`)
      })
    }
  
  // Update site.imageUrl
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl }
  })
  
  console.log(`   ✅ Successfully processed and tagged!`)
}

async function main() {
  try {
    // Check if FireShot directory exists
    if (!fs.existsSync(FIRESHOT_DIR)) {
      console.error(`❌ Directory not found: ${FIRESHOT_DIR}`)
      process.exit(1)
    }
    
    // Get all image files from FireShot directory
    const files = fs.readdirSync(FIRESHOT_DIR)
      .filter(f => {
        const ext = path.extname(f).toLowerCase()
        return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)
      })
      .map(f => path.join(FIRESHOT_DIR, f))
    
    if (files.length === 0) {
      console.log(`ℹ️  No image files found in ${FIRESHOT_DIR}`)
      process.exit(0)
    }
    
    console.log(`📁 Found ${files.length} image file(s) in FireShot directory`)
    console.log('')
    
    const stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
    }
    
    // Process each file
    for (const filePath of files) {
      try {
        const filename = path.basename(filePath)
        
        // Try to extract URL from FireShot pattern first
        const url = extractUrlFromFilename(filename)
        let site = null
        
        if (url) {
          console.log(`\n🔍 Looking for site by URL: "${url}"`)
          site = await findSiteByUrl(url)
          
          if (!site) {
            console.log(`   ⚠️  No matching site found for URL - trying domain matching...`)
          }
        }
        
        // Fallback to domain matching if URL match failed
        if (!site) {
          const website = extractWebsiteFromFilename(filename)
          console.log(`\n🔍 Looking for site matching domain: "${website}"`)
          site = await findSiteByWebsite(website)
        }
        
        if (!site) {
          console.log(`   ⚠️  No matching site found - skipping`)
          stats.skipped++
          continue
        }
        
        // Process the image
        await processImage(filePath, site)
        stats.processed++
        
      } catch (error: any) {
        console.error(`   ❌ Error processing ${path.basename(filePath)}:`, error.message)
        stats.errors++
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Processing Summary:')
    console.log(`   ✅ Successfully processed: ${stats.processed}`)
    console.log(`   ⏭️  Skipped (no match): ${stats.skipped}`)
    console.log(`   ❌ Errors: ${stats.errors}`)
    console.log('='.repeat(60))
    
    if (stats.processed > 0) {
      console.log('\n✅ Done! All processed images are now uploaded to MinIO, embedded, and tagged.')
    }
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message || error)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

