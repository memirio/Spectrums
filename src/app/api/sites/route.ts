import { NextRequest, NextResponse } from 'next/server'
import { clearSearchResultCache } from '@/lib/search-cache'
import { prisma } from '@/lib/prisma'
import leven from 'leven'
import natural from 'natural'
// Lazy load transformers to avoid native library issues in serverless
// import { pipeline } from '@xenova/transformers'
import sharp from 'sharp'
import { enqueueTaggingJob } from '@/jobs/tagging'
// Lazy load embeddings to avoid native library issues in serverless
// import { embedImageFromBuffer, canonicalizeImage } from '@/lib/embeddings'

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
  try {
    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.error('[sites] DATABASE_URL environment variable is not set')
      return NextResponse.json(
        { error: 'Database configuration error', details: 'DATABASE_URL not set' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const concepts = searchParams.get('concepts')
    const category = searchParams.get('category') // Optional category filter
    
    // Return all sites if no concepts specified (null or empty string)
    if (!concepts || !concepts.trim()) {
      // Build where clause for sites based on category
      let whereClause: any = {}
      
      // If category is specified, filter sites that have images with that category
      if (category) {
        // Use raw SQL query as workaround for Prisma schema sync issue
        // PostgreSQL uses $1, $2, etc. instead of ? placeholders
        const sitesWithCategoryImages = await (prisma.$queryRawUnsafe as any)(
          `SELECT DISTINCT "siteId" FROM "images" WHERE "category" = $1 AND "siteId" IS NOT NULL`,
          category
        )
        const siteIds = (sitesWithCategoryImages as any[]).map((row: any) => row.siteId).filter(Boolean)
        if (siteIds.length === 0) {
          // No sites with images in this category
          return NextResponse.json({ sites: [] })
        }
        whereClause.id = { in: siteIds }
      }
      
      // Return all sites if no concepts specified
      // Note: tags relationship is legacy/unused - we use Concepts/ImageTags instead
      const sites = await prisma.site.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Fetch first images for these sites as a fallback when site.imageUrl is null
      const fetchedSiteIds = sites.map((s: any) => s.id)
      let images: any[] = []
      if (fetchedSiteIds.length > 0) {
        if (category) {
          // Use raw SQL query as workaround for Prisma schema sync issue
          // PostgreSQL uses $1, $2, etc. instead of ? placeholders
          const placeholders = fetchedSiteIds.map((_: any, i: number) => `$${i + 1}`).join(',')
          images = await (prisma.$queryRawUnsafe as any)(
            `SELECT * FROM "images" WHERE "siteId" IN (${placeholders}) AND "category" = $${fetchedSiteIds.length + 1} ORDER BY "id" DESC`,
            ...fetchedSiteIds,
            category
          )
        } else {
          // Use raw SQL query to avoid Prisma schema sync issues
          // PostgreSQL uses $1, $2, etc. instead of ? placeholders
          const placeholders = fetchedSiteIds.map((_: any, i: number) => `$${i + 1}`).join(',')
          images = await (prisma.$queryRawUnsafe as any)(
            `SELECT * FROM "images" WHERE "siteId" IN (${placeholders}) ORDER BY "id" DESC`,
            ...fetchedSiteIds
          )
        }
      }
      const firstImageBySite = new Map<string, string>()
      const categoryBySite = new Map<string, string>()
      for (const img of images as any[]) {
        if (!firstImageBySite.has(img.siteId)) {
          firstImageBySite.set(img.siteId, img.url)
          categoryBySite.set(img.siteId, (img.category || 'website'))
        }
      }

      return NextResponse.json({
        sites: sites.map((site: any) => ({
          ...site,
          // Prefer stored screenshot (Image.url) over legacy site.imageUrl (often OG image)
          imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
          category: categoryBySite.get(site.id) || 'website', // Include category from image
        }))
      })
    }

    // Parse concepts from query string (comma-separated)
    const conceptList = concepts
      .split(',')
      .map((c: string) => c.trim().toLowerCase())
      .filter(Boolean)

    // Fetch all tags for intelligent matching
    const allTags = await prisma.tag.findMany()
    const tagNames = allTags.map((t: any) => t.name)

    // Resolve each input concept to canonical tag names using intelligent matching
    const resolvedRequired = new Set<string>()
    
    for (const concept of conceptList) {
      // Try to find the best match using our intelligent matching
      const bestMatch = await findBestMatch(concept, tagNames)
      
      if (bestMatch) {
        resolvedRequired.add(bestMatch.toLowerCase())
      } else {
        // If no match found, use the original concept (fallback)
        resolvedRequired.add(concept)
      }
    }

    // Fetch sites (no tags - we use Concepts/ImageTags instead)
    const sites = await prisma.site.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Fetch image tags (concepts) for all sites
    const siteIds = sites.map((s: any) => s.id)
    const imageTags = siteIds.length > 0 
      ? await prisma.imageTag.findMany({
          where: { 
            image: { 
              siteId: { in: siteIds } 
            } 
          },
          include: {
            concept: true,
            image: {
              select: { siteId: true }
            }
          }
        })
      : []
    
    // Build a map of siteId -> concept names
    const siteConcepts = new Map<string, Set<string>>()
    for (const it of imageTags) {
      const siteId = it.image.siteId
      if (!siteId) continue // Skip if siteId is null
      if (!siteConcepts.has(siteId)) {
        siteConcepts.set(siteId, new Set())
      }
      siteConcepts.get(siteId)!.add(normalize(it.concept.label))
    }

    // Build a helper to check if a site satisfies a concept via image tags (concepts) or textual content
    const siteMatchesConcept = (site: any, concept: string): boolean => {
      // Check image tags (concepts)
      const siteConceptNames = Array.from(siteConcepts.get(site.id) || [])
      if (siteConceptNames.some((t: string) => normalize(t) === concept)) return true

      // Also check title/description heuristically
      const haystack = normalize(`${site.title} ${site.description ?? ''}`)
      if (haystack.includes(concept)) return true
      // Fuzzy token check against words in haystack
      const words = haystack.split(/[^a-z0-9]+/).filter(Boolean)
      const conceptStem = stem(concept)
      for (const w of words) {
        if (stem(w) === conceptStem) return true
        if (leven(concept, w) <= 2) return true
      }
      return false
    }

    const filteredSites = sites.filter((site: any) =>
      Array.from(resolvedRequired).every((req: any) => siteMatchesConcept(site, req))
    )

    // Build image fallback map (prefer stored Image.url over legacy site.imageUrl)
    const fIds = filteredSites.map((s: any) => s.id)
    const fImages = fIds.length
      ? await (prisma.image as any).findMany({ where: { siteId: { in: fIds } }, orderBy: { id: 'desc' } })
      : []
    const firstImageBySite = new Map<string, string>()
    const categoryBySite = new Map<string, string>()
    for (const img of fImages as any[]) {
      if (!firstImageBySite.has(img.siteId)) {
        firstImageBySite.set(img.siteId, img.url)
        categoryBySite.set(img.siteId, (img.category || 'website'))
      }
    }

    return NextResponse.json({
      sites: filteredSites.map((site: any) => ({
        ...site,
        imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
        category: categoryBySite.get(site.id) || 'website', // Include category from image
      }))
    })
  } catch (error: any) {
    console.error('[sites] Error fetching sites:', error)
    console.error('[sites] Error message:', error.message)
    console.error('[sites] Error stack:', error.stack)
    console.error('[sites] DATABASE_URL present:', !!process.env.DATABASE_URL)
    console.error('[sites] DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20))
    
    // Return more detailed error in development, generic in production
    const errorDetails = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
    
    return NextResponse.json(
      { error: 'Failed to fetch sites', details: errorDetails },
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
    const { title, description, url, imageUrl, author, tags, category } = body
    // Default to "website" for backward compatibility
    // This is the "category knob" - one pipeline, different categories
    const imageCategory = category || 'website'

    // If no imageUrl provided, try to generate one via the screenshot-service
    let finalImageUrl: string | null = imageUrl ?? null
    if (!finalImageUrl && typeof url === 'string' && /^https?:\/\//.test(url)) {
      const svcBase = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'
      const idemKey = `looma-${Buffer.from(url).toString('base64').slice(0, 24)}`
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
        tags: {
          include: {
            tag: true
          }
        }
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
          
          let ivec: number[]
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
            // Compute new embedding
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
            }
          }
          
          // Only proceed with tagging if we have an embedding
          if (ivec) {

          // HYBRID APPROACH: Generate new concepts for this site, then tag appropriately
          console.log(`[sites] Generating new concepts and tagging image ${image.id}...`)
          
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
          
          // STEP 3: Trigger incremental hub detection for this image only (debounced, runs in background)
          try {
            const { triggerHubDetectionForImages } = await import('@/jobs/hub-detection-trigger')
            triggerHubDetectionForImages([image.id]).catch((err) => {
              console.warn(`[sites] Failed to trigger hub detection: ${err.message}`)
            })
            console.log(`[sites] ✅ Triggered incremental hub detection for new image (will run after debounce)`)
          } catch (hubError) {
            // Non-fatal: hub detection is a background optimization
            console.warn(`[sites] Failed to trigger hub detection:`, (hubError as Error)?.message)
          }
          
          // STEP 4: Clear search result cache (new image may affect search results)
          // Query embedding cache is kept (embeddings don't change when new images are added)
          try {
            clearSearchResultCache()
            console.log(`[sites] ✅ Cleared search result cache (new image added)`)
          } catch (cacheError) {
            // Non-fatal: cache clearing is an optimization
            console.warn(`[sites] Failed to clear search cache:`, (cacheError as Error)?.message)
          }
        }
      } catch (e) {
        console.warn('Failed to create Image/queue tagging:', (e as Error)?.message)
      }
    }

    return NextResponse.json({
      site
    })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}

