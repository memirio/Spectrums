import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import leven from 'leven'
import natural from 'natural'
import { pipeline } from '@xenova/transformers'
import sharp from 'sharp'
import { enqueueTaggingJob } from '@/jobs/tagging'
import { embedImageFromBuffer, canonicalizeImage } from '@/lib/embeddings'

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
      embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    }
    
    const result = await embeddingPipeline(text, { pooling: 'mean', normalize: true })
    const embeddings = Array.from(result.data as Float32Array) as number[]
    embeddingCache.set(text, embeddings)
    return embeddings
  } catch (error) {
    console.error('Error generating embeddings:', error)
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
  const exact = candidates.find(c => normalize(c) === inputLower)
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
    const { searchParams } = new URL(request.url)
    const concepts = searchParams.get('concepts')
    
    // Return all sites if no concepts specified (null or empty string)
    if (!concepts || !concepts.trim()) {
      // Return all sites if no concepts specified
      const sites = await prisma.site.findMany({
        include: {
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Fetch first images for these sites as a fallback when site.imageUrl is null
      const siteIds = sites.map(s => s.id)
      const images = siteIds.length
        ? await (prisma.image as any).findMany({
            where: { siteId: { in: siteIds } },
            orderBy: { id: 'desc' }
          })
        : []
      const firstImageBySite = new Map<string, string>()
      for (const img of images as any[]) {
        if (!firstImageBySite.has(img.siteId)) firstImageBySite.set(img.siteId, img.url)
      }

      return NextResponse.json({
        sites: sites.map(site => ({
          ...site,
          // Prefer stored screenshot (Image.url) over legacy site.imageUrl (often OG image)
          imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
          tags: site.tags.map((st: any) => st.tag)
        }))
      })
    }

    // Parse concepts from query string (comma-separated)
    const conceptList = concepts
      .split(',')
      .map(c => c.trim().toLowerCase())
      .filter(Boolean)

    // Fetch all tags for intelligent matching
    const allTags = await prisma.tag.findMany()
    const tagNames = allTags.map(t => t.name)

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

    // Fetch sites with tags
    const sites = await prisma.site.findMany({
      include: {
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Build a helper to check if a site satisfies a concept either via tags or textual content
    const siteMatchesConcept = (site: any, concept: string): boolean => {
      const siteTagNames = site.tags.map((st: any) => normalize(st.tag.name))
      if (siteTagNames.some((t: string) => normalize(t) === concept)) return true

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

    const filteredSites = sites.filter(site =>
      Array.from(resolvedRequired).every(req => siteMatchesConcept(site, req))
    )

    // Build image fallback map (prefer stored Image.url over legacy site.imageUrl)
    const fIds = filteredSites.map(s => s.id)
    const fImages = fIds.length
      ? await (prisma.image as any).findMany({ where: { siteId: { in: fIds } }, orderBy: { id: 'desc' } })
      : []
    const firstImageBySite = new Map<string, string>()
    for (const img of fImages as any[]) {
      if (!firstImageBySite.has(img.siteId)) firstImageBySite.set(img.siteId, img.url)
    }

    return NextResponse.json({
      sites: filteredSites.map(site => ({
        ...site,
        imageUrl: firstImageBySite.get(site.id) || site.imageUrl || null,
        tags: site.tags.map((st: any) => st.tag)
      }))
    })
  } catch (error: any) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites', detail: String(error?.message || error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, url, imageUrl, author, tags } = body

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
          tags: existingSite.tags.map((st: any) => st.tag),
          // Prefer stored screenshot (Image.url) over legacy site.imageUrl
          imageUrl: existingSite.images?.[0]?.url || existingSite.imageUrl || null,
        },
        alreadyExists: true
      }, { status: 200 })
    }

    // Create or find tags
    const tagRecords = await Promise.all(
      tags.map((tagName: string) =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        })
      )
    )

    // Create site
    const site = await prisma.site.create({
      data: {
        title,
        description,
        url: normalizedUrl,
        imageUrl: finalImageUrl,
        author,
        tags: {
          create: tagRecords.map(tag => ({
            tagId: tag.id
          }))
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
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
            },
            create: {
              siteId: site.id,
              url: finalImageUrl,
              width,
              height,
              bytes,
            },
          })
          
          console.log(`[sites] ✅ Image record created/updated: ${image.id}`)

          // Inline tagging (can move to worker later)
          // Canonicalize to get contentHash
          const { hash: contentHash } = await canonicalizeImage(buf)
          
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
          }

          // Use zero-shot tagging (new approach - doesn't require concept embeddings)
          const { TAG_CONFIG } = await import('@/lib/tagging-config')
          const { tagImageWithZeroShot } = await import('@/lib/tagging-zero-shot')
          const concepts = await prisma.concept.findMany()
          
          const tagResults = await tagImageWithZeroShot(
            ivec,
            concepts.map(c => ({
              id: c.id,
              label: c.label,
              synonyms: c.synonyms,
              related: c.related
            })),
            TAG_CONFIG.MIN_SCORE,
            TAG_CONFIG.MAX_K,
            TAG_CONFIG.MIN_SCORE_DROP_PCT
          )
          
          const chosenConceptIds = new Set(tagResults.map(t => t.conceptId))
          
          for (const { conceptId, score } of tagResults) {
            await prisma.imageTag.upsert({
              where: { imageId_conceptId: { imageId: image.id, conceptId } },
              update: { score },
              create: { imageId: image.id, conceptId, score },
            })
          }

          // Delete tags that are no longer in top-K (cleanup old tags)
          const existingTags = await prisma.imageTag.findMany({
            where: { imageId: image.id },
          })
          
          for (const existingTag of existingTags) {
            if (!chosenConceptIds.has(existingTag.conceptId)) {
              // This tag is no longer in top-K, delete it
              await prisma.imageTag.delete({
                where: { imageId_conceptId: { imageId: image.id, conceptId: existingTag.conceptId } },
              })
            }
          }
          
          // Now call tagImage to generate new concepts via Gemini and apply full tagging
          let newlyCreatedConceptIds: string[] = []
          try {
            const { tagImage } = await import('@/jobs/tagging')
            
            newlyCreatedConceptIds = await tagImage(image.id)
            console.log(`[sites] tagImage completed for image ${image.id}`)
            
            if (newlyCreatedConceptIds.length > 0) {
              console.log(`[sites] Detected ${newlyCreatedConceptIds.length} new concept(s): ${newlyCreatedConceptIds.join(', ')}`)
            }
          } catch (tagError) {
            // Non-fatal: logging warning but not failing the request
            console.warn(`[sites] tagImage failed for image ${image.id}:`, (tagError as Error)?.message)
          }
          
          // If new concepts were created, tag them on all existing images
          if (newlyCreatedConceptIds.length > 0) {
            try {
              const { tagNewConceptsOnAllImages } = await import('@/jobs/tag-new-concepts-on-all')
              await tagNewConceptsOnAllImages(newlyCreatedConceptIds)
              console.log(`[sites] Tagged new concepts on all existing images`)
            } catch (tagAllError) {
              // Non-fatal: logging warning but not failing the request
              console.warn(`[sites] Failed to tag new concepts on all images:`, (tagAllError as Error)?.message)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to create Image/queue tagging:', (e as Error)?.message)
      }
    }

    return NextResponse.json({
      site: {
        ...site,
        tags: site.tags.map(st => st.tag)
      }
    })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
