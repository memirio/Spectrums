import { NextRequest, NextResponse } from 'next/server'
import { clearSearchResultCache } from '@/lib/search-cache'
import { prisma } from '@/lib/prisma'
import leven from 'leven'
import natural from 'natural'
// Lazy load transformers to avoid native library issues in serverless
// import { pipeline } from '@xenova/transformers'
import sharp from 'sharp'
import { enqueueTaggingJob, tagImageWithoutNewConcepts } from '@/jobs/tagging'
// Lazy load embeddings to avoid native library issues in serverless
// import { embedImageFromBuffer, canonicalizeImage } from '@/lib/embeddings'
import { getPerformanceLogger } from '@/lib/performance-logger'

// prisma imported from singleton

const stemmer = natural.PorterStemmer

// Cache for embeddings to avoid recomputing
const embeddingCache = new Map<string, number[]>()
let embeddingPipeline: any = null

async function getEmbeddings(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!
  }

  try {
    if (!embeddingPipeline) {
      // Lazy load transformers to avoid native library issues in serverless
      const { pipeline } = await import('@xenova/transformers').catch((err) => {
        console.error('[sites] Failed to load @xenova/transformers:', err.message)
        throw new Error('Transformers library not available in this environment')
      })
      embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    }
    
    const result = await embeddingPipeline(text, { pooling: 'mean', normalize: true })
    const embeddings = Array.from(result.data as Float32Array) as number[]
    embeddingCache.set(text, embeddings)
    return embeddings
  } catch (error: any) {
    console.error('[sites] Error generating embeddings:', error.message)
    // Return empty array instead of failing - embeddings are optional for text matching
    return []
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function stem(text: string): string {
  try {
    return stemmer.stem(text)
  } catch {
    return text
  }
}

async function findBestMatch(input: string, candidates: string[], maxDistance = 2): Promise<string | null> {
  const inputLower = normalize(input)
  const inputStem = stem(inputLower)

  // Exact match
  const exact = candidates.find((c: any) => normalize(c) === inputLower)
  if (exact) return exact

  // Stem match
  for (const c of candidates) {
    if (stem(normalize(c)) === inputStem) return c
  }

  // Substring match (input contains in candidate or vice versa)
  for (const c of candidates) {
    const candidateLower = normalize(c)
    if (candidateLower.includes(inputLower) || inputLower.includes(candidateLower)) {
      return c
    }
  }

  // Semantic similarity using embeddings
  try {
    const inputEmbeddings = await getEmbeddings(inputLower)
    if (inputEmbeddings.length > 0) {
      let bestMatch: string | null = null
      let bestSimilarity = 0.3 // Threshold for semantic similarity
      
      for (const candidate of candidates) {
        const candidateEmbeddings = await getEmbeddings(normalize(candidate))
        if (candidateEmbeddings.length > 0) {
          const similarity = cosineSimilarity(inputEmbeddings, candidateEmbeddings)
          if (similarity > bestSimilarity) {
            bestMatch = candidate
            bestSimilarity = similarity
          }
        }
      }
      
      if (bestMatch) return bestMatch
    }
  } catch (error) {
    console.error('Error in semantic matching:', error)
  }

  // Fuzzy distance fallback
  let best: string | null = null
  let bestDist = maxDistance + 1
  for (const c of candidates) {
    const dist = leven(inputLower, normalize(c))
    if (dist <= maxDistance && dist < bestDist) {
      best = c
      bestDist = dist
    }
  }
  return best
}

export async function GET(request: NextRequest) {
  let perf: ReturnType<typeof getPerformanceLogger> | null = null
  try {
    // Safely initialize performance logger
    try {
      perf = getPerformanceLogger()
      if (perf) {
        perf.clear()
        perf?.start('api.sites.GET', {
          url: request.url,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (perfInitError) {
      console.warn('[sites] Performance logger failed, continuing without it')
      perf = null
    }

    const { searchParams } = new URL(request.url)
    const concepts = searchParams.get('concepts')
    const category = searchParams.get('category') // Optional category filter
    
    // Return all sites if no concepts specified (null or empty string)
    if (!concepts || !concepts.trim()) {
      perf?.start('api.sites.GET.noConcepts')
      
      // OPTIMIZATION: Limit initial load to improve performance
      // Return all sites if no concepts specified
      // Note: tags relationship is legacy/unused - we use Concepts/ImageTags instead
      const limit = parseInt(searchParams.get('limit') || '60') // Default 60 for pagination
      const offset = parseInt(searchParams.get('offset') || '0') // Pagination offset
      
      let sites: any[] = []
      let hasMore = false
      let totalCount = 0
      
      // If category is specified, use a LATERAL JOIN for efficient first-image-per-site lookup
      if (category) {
        perf?.start('api.sites.GET.queryWithCategory', { category, limit, offset })
        
        // Use LATERAL JOIN to get the first image for each site efficiently
        // This is much faster than DISTINCT ON because it uses indexes properly
        const result = await perf?.measure('api.sites.GET.queryWithCategory.lateralJoin', async () => {
          return await (prisma.$queryRawUnsafe as any)(
            `SELECT 
              s."id", s."title", s."description", s."url", s."imageUrl", s."author", s."createdAt", s."updatedAt",
              i."id" as "firstImageId", i."url" as "firstImageUrl", i."category" as "imageCategory"
            FROM "sites" s
            INNER JOIN LATERAL (
              SELECT "id", "url", "category"
              FROM "images"
              WHERE "siteId" = s."id" AND "category" = $1
              ORDER BY "id" DESC
              LIMIT 1
            ) i ON true
            ORDER BY s."createdAt" DESC, s."id" ASC
            LIMIT $2 OFFSET $3`,
            category,
            limit + 1, // Fetch one extra to check if there are more
            offset
          )
        }, { category, limit, offset })
        
        perf?.end('api.sites.GET.queryWithCategory', { resultCount: result.length })
        
        perf?.start('api.sites.GET.processResults')
        // Check if there are more results
        hasMore = result.length > limit
        sites = hasMore ? result.slice(0, limit) : result
        
        // Map results to include imageUrl and imageId from the JOIN
        sites = sites.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          url: row.url,
          imageUrl: row.firstImageUrl || row.imageUrl || null,
          imageId: row.firstImageId || null,
          author: row.author,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          category: row.imageCategory || 'website'
        }))
        perf?.end('api.sites.GET.processResults', { sitesCount: sites.length })
        
        totalCount = sites.length // Approximate count, avoid expensive COUNT query
      } else {
        perf?.start('api.sites.GET.queryWithoutCategory', { limit, offset })
        
        // No category filter - use standard Prisma query
        perf?.start('api.sites.GET.queryWithoutCategory.connection')
        // Helper to get high-resolution time (works in both browser and Node.js)
        const getTime = () => {
          if (typeof performance !== 'undefined' && performance.now) {
            return performance.now()
          }
          const [seconds, nanoseconds] = process.hrtime()
          return seconds * 1000 + nanoseconds / 1000000
        }
        const connectionStart = getTime()
        sites = await perf?.measure('api.sites.GET.queryWithoutCategory.findMany', async () => {
          const queryStart = getTime()
          const result = await prisma.site.findMany({
            orderBy: [
              { createdAt: 'desc' },
              { id: 'asc' }
            ],
            take: limit + 1, // Fetch one extra to check if there are more
            skip: offset,
          })
          const queryEnd = getTime()
          perf?.end('api.sites.GET.queryWithoutCategory.findMany', { 
            limit, 
            offset,
            queryExecutionTime: queryEnd - queryStart,
            connectionTime: queryStart - connectionStart,
          })
          return result
        }, { limit, offset })
        perf?.end('api.sites.GET.queryWithoutCategory.connection')
        
        perf?.end('api.sites.GET.queryWithoutCategory', { sitesCount: sites.length })
        
        perf?.start('api.sites.GET.processResults')
        // Check if there are more results
        hasMore = sites.length > limit
        sites = hasMore ? sites.slice(0, limit) : sites
        perf?.end('api.sites.GET.processResults', { sitesCount: sites.length })
        
        totalCount = sites.length // Approximate count, avoid expensive COUNT query
      }

      // Fetch first images for these sites as a fallback when site.imageUrl is null
      // OPTIMIZATION: Only fetch images if we didn't already get them from the JOIN query
      let firstImageBySite = new Map<string, string>()
      let imageIdBySite = new Map<string, string>()
      let categoryBySite = new Map<string, string>()
      
      if (!category) {
        perf?.start('api.sites.GET.fetchImages', { siteCount: sites.length })
        
        // Simple query matching working branch approach
        const fetchedSiteIds = sites.map((s: any) => s.id)
        if (fetchedSiteIds.length > 0) {
          // Use simple IN query - let database handle it efficiently with indexes
          const placeholders = fetchedSiteIds.map((_: any, i: number) => `$${i + 1}`).join(',')
          const images = await perf?.measure('api.sites.GET.fetchImages.query', async () => {
            return await (prisma.$queryRawUnsafe as any)(
              `SELECT "id", "siteId", "url", "category"
               FROM "images"
               WHERE "siteId" IN (${placeholders}) AND "siteId" IS NOT NULL
               ORDER BY "id" DESC`,
              ...fetchedSiteIds
            )
          }, { siteIdsCount: fetchedSiteIds.length })
          
          perf?.start('api.sites.GET.fetchImages.process')
          // Filter to first image per site in JavaScript (simpler than DISTINCT ON)
          for (const img of images as any[]) {
            if (!firstImageBySite.has(img.siteId)) {
              firstImageBySite.set(img.siteId, img.url)
              imageIdBySite.set(img.siteId, img.id)
              categoryBySite.set(img.siteId, (img.category || 'website'))
            }
          }
          perf?.end('api.sites.GET.fetchImages.process', { imagesCount: images.length })
        }
        perf?.end('api.sites.GET.fetchImages')
      }

      perf?.start('api.sites.GET.serializeResponse')
      const responseData = {
        sites: sites.map((site: any) => ({
          ...site,
          // Prefer stored screenshot (Image.url) over legacy site.imageUrl (often OG image)
          imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
          imageId: imageIdBySite.get(site.id) || site.imageId || null,
          category: categoryBySite.get(site.id) || site.category || 'website', // Include category from image
        })),
        hasMore,
        total: totalCount,
        offset,
        limit,
        _performance: perf?.getSummary() || {}, // Include performance data in response
      }
      perf?.end('api.sites.GET.serializeResponse', { responseSize: JSON.stringify(responseData).length })
      
      perf?.end('api.sites.GET.noConcepts')
      perf?.end('api.sites.GET', { totalDuration: perf?.getMetrics()?.reduce((sum, m) => sum + m.duration, 0) || 0 })

      // Log performance report
      console.log('\n' + (perf?.getReport() || ''))
      
      return NextResponse.json(responseData)
    }

          perf?.start('api.sites.GET.withConcepts', { concepts })
    
    // Parse concepts from query string (comma-separated)
          perf?.start('api.sites.GET.withConcepts.parse')
    const conceptList = concepts
      .split(',')
      .map((c: string) => c.trim().toLowerCase())
      .filter(Boolean)
          perf?.end('api.sites.GET.withConcepts.parse', { conceptCount: conceptList.length })

    // OPTIMIZATION: Use database queries instead of loading everything into memory
    // Find concept IDs that match the search terms (fuzzy match on label)
          perf?.start('api.sites.GET.withConcepts.findConcepts')
    const conceptMatches = await perf?.measure('api.sites.GET.withConcepts.findConcepts.findMany', async () => {
      return await prisma.concept.findMany({
        where: {
          OR: conceptList.map(term => ({
            OR: [
              { label: { contains: term, mode: 'insensitive' } },
              { id: { contains: term, mode: 'insensitive' } }
            ]
          }))
        },
        select: { id: true, label: true }
      })
    }, { conceptListCount: conceptList.length })
    
    const matchedConceptIds = new Set(conceptMatches.map(c => c.id))
    const matchedConceptLabels = new Set(conceptMatches.map(c => c.label.toLowerCase()))
          perf?.end('api.sites.GET.withConcepts.findConcepts', { matchedCount: matchedConceptIds.size })
    
    // Also check for exact matches in concept list
          perf?.start('api.sites.GET.withConcepts.findExactMatches')
    for (const term of conceptList) {
      await perf?.measure(`api.sites.GET.withConcepts.findExactMatches.${term}`, async () => {
        const exactMatch = await prisma.concept.findFirst({
          where: {
            OR: [
              { label: { equals: term, mode: 'insensitive' } },
              { id: { equals: term, mode: 'insensitive' } }
            ]
          },
          select: { id: true }
        })
        if (exactMatch) {
          matchedConceptIds.add(exactMatch.id)
        }
      })
    }
          perf?.end('api.sites.GET.withConcepts.findExactMatches', { finalMatchedCount: matchedConceptIds.size })

    // OPTIMIZATION: Use database query to find sites that have images with matching concepts
    // This filters at the database level instead of loading everything
    const limit = parseInt(searchParams.get('limit') || '60')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (matchedConceptIds.size === 0) {
      // No matching concepts found, return empty result
      perf?.end('api.sites.GET.withConcepts')
      perf?.end('api.sites.GET')
      console.log('\n' + (perf?.getReport() || ''))
      return NextResponse.json({
        sites: [],
        hasMore: false,
        total: 0,
        offset,
        limit,
        _performance: perf?.getSummary() || {},
      })
    }

    // Find distinct sites that have images tagged with ALL the matched concepts
    // Use a subquery to ensure sites have images with ALL concepts (AND logic)
    const conceptIdsArray = Array.from(matchedConceptIds)
    const placeholders = conceptIdsArray.map((_, i) => `$${i + 1}`).join(',')
    const requiredCount = conceptIdsArray.length
    const limitParam = limit + 1 // Fetch one extra to check hasMore
    
          perf?.start('api.sites.GET.withConcepts.querySites', { conceptIdsCount: conceptIdsArray.length, limit, offset })
    // Query: Find sites where ALL concepts are present in image tags
    // This uses a GROUP BY with HAVING COUNT(DISTINCT conceptId) = number of concepts
    const sitesWithAllConcepts = await perf?.measure('api.sites.GET.withConcepts.querySites.rawQuery', async () => {
      return await (prisma.$queryRawUnsafe as any)(
        `SELECT DISTINCT s."id", s."title", s."description", s."url", s."imageUrl", s."author", s."createdAt", s."updatedAt"
         FROM "sites" s
         INNER JOIN "images" i ON s."id" = i."siteId"
         INNER JOIN "image_tags" it ON i."id" = it."imageId"
         WHERE it."conceptId" IN (${placeholders})
         GROUP BY s."id", s."title", s."description", s."url", s."imageUrl", s."author", s."createdAt", s."updatedAt"
         HAVING COUNT(DISTINCT it."conceptId") = $${conceptIdsArray.length + 1}
         ORDER BY s."createdAt" DESC, s."id" ASC
         LIMIT $${conceptIdsArray.length + 2} OFFSET $${conceptIdsArray.length + 3}`,
        ...conceptIdsArray,
        requiredCount,
        limitParam,
        offset
      )
    }, { conceptIdsCount: conceptIdsArray.length, limit, offset })
          perf?.end('api.sites.GET.withConcepts.querySites', { sitesCount: sitesWithAllConcepts.length })

          perf?.start('api.sites.GET.withConcepts.paginate')
    const hasMore = sitesWithAllConcepts.length > limit
    const paginatedSites = hasMore ? sitesWithAllConcepts.slice(0, limit) : sitesWithAllConcepts
    const totalCount = paginatedSites.length // Approximate, avoid expensive COUNT
          perf?.end('api.sites.GET.withConcepts.paginate', { paginatedCount: paginatedSites.length })

    // Build image fallback map (prefer stored Image.url over legacy site.imageUrl)
          perf?.start('api.sites.GET.withConcepts.fetchImages')
    const fIds = paginatedSites.map((s: any) => s.id)
    const fImages = fIds.length
      ? await perf?.measure('api.sites.GET.withConcepts.fetchImages.findMany', async () => {
          return await (prisma.image as any).findMany({ 
            where: { siteId: { in: fIds } }, 
            orderBy: { id: 'desc' },
            select: { id: true, siteId: true, url: true, category: true }
          })
        }, { siteIdsCount: fIds.length })
      : []
          perf?.start('api.sites.GET.withConcepts.fetchImages.process')
    const firstImageBySite = new Map<string, string>()
    const imageIdBySite = new Map<string, string>()
    const categoryBySite = new Map<string, string>()
    for (const img of fImages as any[]) {
      if (!firstImageBySite.has(img.siteId)) {
        firstImageBySite.set(img.siteId, img.url)
        imageIdBySite.set(img.siteId, img.id)
        categoryBySite.set(img.siteId, (img.category || 'website'))
      }
    }
          perf?.end('api.sites.GET.withConcepts.fetchImages.process', { imagesCount: fImages.length })
          perf?.end('api.sites.GET.withConcepts.fetchImages')

          perf?.start('api.sites.GET.withConcepts.serializeResponse')
    const responseData = {
      sites: paginatedSites.map((site: any) => ({
        ...site,
        imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
        imageId: imageIdBySite.get(site.id) || null,
        category: categoryBySite.get(site.id) || 'website', // Include category from image
      })),
      hasMore,
      total: totalCount,
      offset,
      limit,
      _performance: perf?.getSummary() || {},
    }
          perf?.end('api.sites.GET.withConcepts.serializeResponse', { responseSize: JSON.stringify(responseData).length })
    
          perf?.end('api.sites.GET.withConcepts')
          perf?.end('api.sites.GET', { totalDuration: perf?.getMetrics()?.reduce((sum, m) => sum + m.duration, 0) || 0 })

    // Log performance report
    console.log('\n' + (perf?.getReport() || ''))

    return NextResponse.json(responseData)
  } catch (error: any) {
    // Safely handle performance logger in case it failed to initialize
    try {
      if (perf) {
        perf?.end('api.sites.GET', { error: error.message })
        console.log('\n' + (perf?.getReport() || ''))
      }
    } catch (perfError) {
      console.error('[sites] Error in performance logger:', perfError)
    }
    
    console.error('[sites] Error fetching sites:', error)
    console.error('[sites] Error message:', error.message)
    console.error('[sites] Error stack:', error.stack)
    console.error('[sites] Error name:', error.name)
    console.error('[sites] DATABASE_URL present:', !!process.env.DATABASE_URL)
    console.error('[sites] DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20))
    
    // Return more detailed error in development, generic in production
    const errorDetails = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sites', 
        details: errorDetails,
        _performance: perf?.getSummary() || {},
      },
      { status: 500 }
    )
  }
}

/**
 * Unified Asset Ingestion Pipeline
 * 
 * This is the SINGLE pipeline for all asset categories (websites, packaging, apps, etc.).
 * All assets go through the same process:
 * 1. Image fetch / normalization / content hash
 * 2. CLIP image embedding generation (same model/dimensionality for all)
 * 3. Tagging with concepts
 * 4. Storing in ImageEmbedding + ImageTag
 * 
 * To add a new category, simply pass category = 'new-category' in the request body.
 * No separate pipeline needed - this one handles everything.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, url, imageUrl, author, tags, category, skipConceptGeneration } = body
    // Default to "website" for backward compatibility
    // This is the "category knob" - one pipeline, different categories
    const imageCategory = category || 'website'
    // Pipeline 2.0: Skip concept generation (only tag with existing concepts)
    const usePipeline2 = skipConceptGeneration === true

    // If no imageUrl provided, try to generate one via the screenshot-service
    let finalImageUrl: string | null = imageUrl ?? null
    if (!finalImageUrl && typeof url === 'string' && /^https?:\/\//.test(url)) {
      const svcBase = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'
      const idemKey = `spectrums-${Buffer.from(url).toString('base64').slice(0, 24)}`
      try {
        const enqueue = await fetch(`${svcBase}/api/screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idemKey,
          },
          body: JSON.stringify({ url, viewport: { width: 1200, height: 900 } }),
        })

        if (enqueue.ok || enqueue.status === 202) {
          // 202 Accepted -> poll; 200 cached path (service returns cached result) is also possible
          const data = await enqueue.json()
          console.log(`[sites] Screenshot service response:`, JSON.stringify(data, null, 2))
          
          if (data.imageUrl) {
            // Immediate cached result
            finalImageUrl = data.imageUrl
            console.log(`[sites] ✅ Screenshot URL obtained immediately (cached): ${finalImageUrl}`)
          } else if (data.statusUrl) {
            // Need to poll for result
            console.log(`[sites] Polling for screenshot status at: ${svcBase}${data.statusUrl}`)
            const deadline = Date.now() + 60_000
            let pollCount = 0
            while (Date.now() < deadline) {
              await new Promise(r => setTimeout(r, 2000))
              pollCount++
              try {
                const statusRes = await fetch(`${svcBase}${data.statusUrl}`)
                if (!statusRes.ok) {
                  console.warn(`[sites] Status check failed: ${statusRes.status} ${statusRes.statusText}`)
                  const errorText = await statusRes.text().catch(() => '')
                  console.warn(`[sites] Error response: ${errorText.substring(0, 200)}`)
                  break
                }
                const status = await statusRes.json()
                console.log(`[sites] Poll ${pollCount}: status=${status.status}`)
                
                if (status.status === 'done' && status.imageUrl) {
                  console.log(`[sites] ✅ Screenshot ready after ${pollCount * 2} seconds`)
                  finalImageUrl = status.imageUrl
                  break
                }
                if (status.status === 'error') {
                  console.error(`[sites] ❌ Screenshot generation failed: ${status.error || 'Unknown error'}`)
                  break
                }
                if (pollCount % 5 === 0) {
                  console.log(`[sites] Still waiting for screenshot... (${pollCount * 2}s elapsed)`)
                }
              } catch (fetchError) {
                console.error(`[sites] ❌ Error polling status:`, (fetchError as Error)?.message)
                console.error(`[sites] Poll error stack:`, (fetchError as Error)?.stack)
                break
              }
            }
            if (!finalImageUrl) {
              console.warn(`[sites] ⚠️  Screenshot generation timed out after ${pollCount * 2} seconds`)
            }
          } else {
            console.warn(`[sites] ⚠️  Unexpected response format from screenshot service:`, data)
          }
        } else {
          // Request failed
          const errorText = await enqueue.text().catch(() => 'Unknown error')
          console.error(`[sites] ❌ Screenshot service returned ${enqueue.status}: ${errorText.substring(0, 200)}`)
        }
      } catch (e) {
        // Non-fatal: we can still create site without image
        console.error('[sites] Screenshot generation failed:', (e as Error)?.message)
        console.error('[sites] Screenshot service error stack:', (e as Error)?.stack)
        console.error('[sites] Screenshot service URL:', svcBase)
        console.error('[sites] Target URL:', url)
      }
      
      if (!finalImageUrl) {
        console.warn('[sites] ⚠️  No screenshot URL obtained - site will be created without image')
      } else {
        console.log(`[sites] ✅ Screenshot URL obtained: ${finalImageUrl}`)
      }
    }

    // Check for existing site with the same URL (normalize URL for comparison)
    const normalizedUrl = url.trim().replace(/\/$/, ''); // Remove trailing slash
    const existingSite = await prisma.site.findFirst({
      where: {
        url: {
          in: [
            normalizedUrl,
            normalizedUrl + '/',
            url.trim(),
            url.trim().replace(/\/$/, '')
          ]
        }
      },
      include: {
        images: true,
        // tags relationship is legacy/unused - we use Concepts/ImageTags instead
      }
    })

    // If site exists, return existing site instead of creating duplicate
    if (existingSite) {
      console.log(`[sites] Site with URL ${normalizedUrl} already exists (ID: ${existingSite.id})`)
      return NextResponse.json({
        site: {
          ...existingSite,
          // Prefer stored screenshot (Image.url) over legacy site.imageUrl
          imageUrl: existingSite.images?.[0]?.url || existingSite.imageUrl || null,
        },
        alreadyExists: true
      }, { status: 200 })
    }

    // Create site (tags are legacy/unused - we use Concepts/ImageTags instead)
    const site = await prisma.site.create({
      data: {
        title,
        description,
        url: normalizedUrl,
        imageUrl: finalImageUrl,
        author,
      }
    })

    // If we have an image URL, create an Image row and tag inline
    if (finalImageUrl) {
      try {
        console.log(`[sites] Creating Image record and processing for site ${site.id}`)
        console.log(`[sites] Fetching image from: ${finalImageUrl}`)
        const resImg = await fetch(finalImageUrl)
        console.log(`[sites] Image fetch response: ${resImg.status} ${resImg.statusText}`)
        
        if (resImg.ok) {
          const ab = await resImg.arrayBuffer()
          const buf = Buffer.from(ab)
          console.log(`[sites] Image buffer size: ${buf.length} bytes`)
          
          const meta = await sharp(buf, { limitInputPixels: false }).metadata()
          const width = meta.width ?? 0
          const height = meta.height ?? 0
          const bytes = buf.length
          
          console.log(`[sites] Image metadata: ${width}x${height}, ${bytes} bytes`)

          const image = await (prisma.image as any).upsert({
            where: { siteId_url: { siteId: site.id, url: finalImageUrl } },
            update: {
              width,
              height,
              bytes,
              category: imageCategory, // Update category if changed
            },
            create: {
              siteId: site.id,
              url: finalImageUrl,
              width,
              height,
              bytes,
              category: imageCategory, // Set category when creating
            },
          })
          
          console.log(`[sites] ✅ Image record created/updated: ${image.id}`)

          // Inline tagging (can move to worker later)
          // Canonicalize to get contentHash (lazy load to avoid native library issues)
          let contentHash: string | null = null
          try {
            const { canonicalizeImage } = await import('@/lib/embeddings')
            const result = await canonicalizeImage(buf)
            contentHash = result.hash
          } catch (error: any) {
            console.warn(`[sites] Failed to canonicalize image (embeddings not available):`, error.message)
            // Generate a simple hash as fallback
            const crypto = await import('crypto')
            contentHash = crypto.createHash('sha256').update(buf).digest('hex')
          }
          
          // Check if embedding already exists by contentHash
          const existing = await prisma.imageEmbedding.findFirst({ 
            where: { contentHash: contentHash } as any
          })
          
          let ivec: number[] | null = null
          if (existing) {
            // Reuse existing embedding vector
            ivec = existing.vector as unknown as number[]
            await prisma.imageEmbedding.upsert({
              where: { imageId: image.id },
              update: { contentHash: contentHash } as any,
              create: { 
                imageId: image.id, 
                model: existing.model, 
                vector: existing.vector as any, 
                contentHash: contentHash 
              } as any,
            })
          } else {
            // Compute new embedding (lazy load to avoid native library issues)
            try {
              const { embedImageFromBuffer } = await import('@/lib/embeddings')
              const result = await embedImageFromBuffer(buf)
              ivec = result.vector
              await prisma.imageEmbedding.upsert({
                where: { imageId: image.id },
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
            } catch (embedError: any) {
              console.warn(`[sites] Failed to generate embedding (transformers not available):`, embedError.message)
              // Skip embedding generation - image will be created without embedding
              // This is okay - the image will still be stored and can be tagged later
              ivec = null
            }
          }
          
          // Only proceed with tagging if we have an embedding
          console.log(`[sites] DEBUG: Checking conditions for hub detection:`)
          console.log(`[sites] DEBUG: - usePipeline2: ${String(usePipeline2)}`)
          console.log(`[sites] DEBUG: - ivec exists: ${String(!!ivec)}`)
          console.log(`[sites] DEBUG: - ivec length: ${ivec && Array.isArray(ivec) ? String(ivec.length) : 'N/A'}`)
          console.log(`[sites] DEBUG: - skipConceptGeneration from body: ${String(skipConceptGeneration)}`)
          
          if (ivec) {
            if (usePipeline2) {
              // PIPELINE 2.0: Tag with existing concepts only (no concept generation)
              console.log(`[sites] Pipeline 2.0: Tagging image ${image.id} with existing concepts only (no concept generation)...`)
              
              try {
                await tagImageWithoutNewConcepts(image.id)
                console.log(`[sites] ✅ Pipeline 2.0: Tagged image ${image.id} with existing concepts only`)
              } catch (tagError) {
                // Non-fatal: logging warning but not failing the request
                console.warn(`[sites] Pipeline 2.0: tagImageWithoutNewConcepts failed for image ${image.id}:`, (tagError as Error)?.message)
              }
              
              // Run hub detection immediately for user submissions (force mode)
              // Note: We don't await this to avoid timeout issues in serverless (hub detection takes 1-2 minutes)
              // The hub detection will run in the background and complete even if the function exits
              console.log(`[sites] DEBUG: About to trigger hub detection for image ${image.id}...`)
              try {
                const { triggerHubDetectionForImages } = await import('@/jobs/hub-detection-trigger')
                // Force immediate run (bypass debounce) since this is a user submission
                // Fire and forget - don't await to avoid serverless timeout
                console.log(`[sites] Starting hub detection (force mode) for new image ${image.id}...`)
                triggerHubDetectionForImages([image.id], { force: true }).catch((err) => {
                  console.error(`[sites] ❌ Hub detection failed:`, err.message)
                  console.error(`[sites] Hub detection error stack:`, err.stack)
                })
                console.log(`[sites] ✅ Hub detection triggered (running in background) for image ${image.id}`)
              } catch (hubError) {
                // Non-fatal: hub detection is an optimization, but log the error
                console.error(`[sites] ❌ Failed to trigger hub detection:`, (hubError as Error)?.message)
                console.error(`[sites] Hub detection error stack:`, (hubError as Error)?.stack)
              }
            } else {
              // PIPELINE 1.0: HYBRID APPROACH - Generate new concepts for this site, then tag appropriately
              console.log(`[sites] Pipeline 1.0: Generating new concepts and tagging image ${image.id}...`)
              console.log(`[sites] DEBUG: Skipping hub detection - usePipeline2 is false (Pipeline 1.0)`)
              
              // Check existing concepts BEFORE generating new ones
              const existingConceptIdsBefore = new Set(
                (await prisma.concept.findMany({ select: { id: true } })).map((c: any) => c.id)
              )
              
              let newlyCreatedConceptIds: string[] = []
              try {
                const { tagImage } = await import('@/jobs/tagging')
                
                // STEP 1: Generate new concepts for this site only
                // tagImage will:
                // - Generate new concepts from the image (Gemini/OpenAI fallback)
                // - Check if concepts already exist (skips duplicates, merges synonyms)
                // - Tag the new site with all existing concepts (using pre-computed embeddings - fast!)
                // - Return IDs of ONLY truly newly created concepts (not duplicates/merges)
                newlyCreatedConceptIds = await tagImage(image.id)
                console.log(`[sites] tagImage completed for image ${image.id}`)
                
                if (newlyCreatedConceptIds.length > 0) {
                  console.log(`[sites] Generated ${newlyCreatedConceptIds.length} new concept(s): ${newlyCreatedConceptIds.join(', ')}`)
                }
              } catch (tagError) {
                // Non-fatal: logging warning but not failing the request
                console.warn(`[sites] tagImage failed for image ${image.id}:`, (tagError as Error)?.message)
              }
              
              // STEP 2: If new concepts were created, tag all existing images with only these new concepts
              // (tagImage already tagged the new site with all concepts, including the new ones)
              if (newlyCreatedConceptIds.length > 0) {
                try {
                  // Filter to only concepts that didn't exist before (safety check)
                  const trulyNewConceptIds = newlyCreatedConceptIds.filter((id: any) => !existingConceptIdsBefore.has(id))
                  
                  if (trulyNewConceptIds.length > 0) {
                    // New concepts that didn't exist before - tag all sites with only these new concepts
                    console.log(`[sites] Tagging all existing images with ${trulyNewConceptIds.length} new concept(s)...`)
                    const { tagNewConceptsOnAllImages } = await import('@/jobs/tag-new-concepts-on-all')
                    await tagNewConceptsOnAllImages(trulyNewConceptIds)
                    console.log(`[sites] ✅ Tagged ${trulyNewConceptIds.length} new concept(s) on all existing images (kept existing tags)`)
                  } else {
                    // All returned concepts already existed (shouldn't happen, but safety check)
                    console.log(`[sites] All concepts already existed - new site already tagged with them`)
                  }
                } catch (tagAllError) {
                  // Non-fatal: logging warning but not failing the request
                  console.warn(`[sites] Failed to tag new concepts on all images:`, (tagAllError as Error)?.message)
                }
              } else {
                console.log(`[sites] No new concepts generated - new site tagged with existing concepts only`)
              }
            }
            
            // STEP 3: Hub detection is now triggered immediately in Pipeline 2.0 branch above
            // For Pipeline 1.0, we still use the debounced version (but it won't work in serverless)
            // TODO: Consider running immediately for Pipeline 1.0 as well
            
            // STEP 4: Clear search result cache (new image may affect search results)
            // Query embedding cache is kept (embeddings don't change when new images are added)
            try {
              clearSearchResultCache()
              console.log(`[sites] ✅ Cleared search result cache (new image added)`)
            } catch (cacheError) {
              // Non-fatal: cache clearing is an optimization
              console.warn(`[sites] Failed to clear search cache:`, (cacheError as Error)?.message)
            }
          } else {
            console.log(`[sites] ⚠️ Skipping tagging and hub detection - no embedding available (ivec is null/undefined)`)
            console.log(`[sites] DEBUG: This means the image embedding was not created or could not be loaded`)
          }
        }
      } catch (e) {
        console.warn('Failed to create Image/queue tagging:', (e as Error)?.message)
      }
    }

    return NextResponse.json({
      site
    })
  } catch (error: any) {
    console.error('[sites] Error creating site:', error)
    const errorMessage = error?.message || 'Unknown error'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json(
      { 
        error: 'Failed to create site',
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}

