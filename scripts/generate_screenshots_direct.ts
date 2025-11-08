import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import sharp from 'sharp'

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

async function generateScreenshotsDirect() {
  try {
    console.log('Fetching sites without screenshots...\n')
    
    const sites = await prisma.site.findMany({
      include: { images: true }
    })
    
    const sitesWithoutImages = sites.filter(site => site.images.length === 0)
    const sitesToProcess = sitesWithoutImages.filter(s => !s.url?.includes('disantinowater'))
    
    console.log(`Found ${sitesToProcess.length} sites to process (${sitesWithoutImages.length - sitesToProcess.length} skipped)\n`)

    if (sitesToProcess.length === 0) {
      console.log('All sites already have images!')
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const site of sitesToProcess) {
      console.log(`[${successCount + errorCount + 1}/${sitesToProcess.length}] Processing: ${site.title}`)
      console.log(`  URL: ${site.url}`)
      
      if (!site.url || !/^https?:\/\//.test(site.url)) {
        console.log(`  ⚠️  Skipping - invalid URL\n`)
        errorCount++
        continue
      }

      try {
        // Request screenshot directly
        const response = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: site.url, 
            viewport: { width: 1200, height: 900 }
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.log(`  ❌ Failed to enqueue: ${errorData.error || response.statusText}\n`)
          errorCount++
          continue
        }

        const data = await response.json()
        let imageUrl: string | null = null

        if (data.imageUrl) {
          // Immediate cached result
          imageUrl = data.imageUrl
          console.log(`  ✅ Got cached screenshot`)
        } else if (data.statusUrl) {
          // Wait 30 seconds, then check (jobs take ~15-20 seconds)
          console.log(`  ⏳ Waiting 30 seconds for screenshot...`)
          await new Promise(r => setTimeout(r, 30000))
          
          // Check status
          const statusResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
          
          if (statusResponse.ok) {
            const status = await statusResponse.json()
            if (status.status === 'done' && status.imageUrl) {
              imageUrl = status.imageUrl
              console.log(`  ✅ Screenshot ready`)
            } else if (status.status === 'waiting' || status.status === 'active') {
              // Still processing, wait 15 more seconds
              console.log(`  ⏳ Still processing, waiting 15 more seconds...`)
              await new Promise(r => setTimeout(r, 15000))
              const retryResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
              if (retryResponse.ok) {
                const retryStatus = await retryResponse.json()
                if (retryStatus.status === 'done' && retryStatus.imageUrl) {
                  imageUrl = retryStatus.imageUrl
                  console.log(`  ✅ Screenshot ready (after retry)`)
                } else {
                  console.log(`  ⚠️  Still not ready (status: ${retryStatus.status})\n`)
                  errorCount++
                  continue
                }
              } else {
                // Check cache if 404
                await new Promise(r => setTimeout(r, 5000))
                const cacheCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
                if (cacheCheck.ok) {
                  const cacheStatus = await cacheCheck.json()
                  if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                    imageUrl = cacheStatus.imageUrl
                    console.log(`  ✅ Screenshot ready (from cache)`)
                  } else {
                    console.log(`  ⚠️  Not found in cache\n`)
                    errorCount++
                    continue
                  }
                } else {
                  console.log(`  ⚠️  Could not retrieve screenshot\n`)
                  errorCount++
                  continue
                }
              }
            } else {
              console.log(`  ⚠️  Status: ${status.status}\n`)
              errorCount++
              continue
            }
          } else if (statusResponse.status === 404) {
            // Job might be completed and in cache
            console.log(`  ⏳ Job removed, checking cache...`)
            await new Promise(r => setTimeout(r, 5000))
            const cacheResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            if (cacheResponse.ok) {
              const cacheStatus = await cacheResponse.json()
              if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                imageUrl = cacheStatus.imageUrl
                console.log(`  ✅ Screenshot ready (from cache)`)
              } else {
                console.log(`  ⚠️  Not in cache\n`)
                errorCount++
                continue
              }
            } else {
              console.log(`  ⚠️  Could not retrieve from cache\n`)
              errorCount++
              continue
            }
          } else {
            console.log(`  ⚠️  Status check failed: ${statusResponse.status}\n`)
            errorCount++
            continue
          }
        } else {
          console.log(`  ❌ Unexpected response format\n`)
          errorCount++
          continue
        }

        // Process image if we got one
        if (imageUrl) {
          try {
            // Fetch image to get metadata
            const resImg = await fetch(imageUrl)
            if (!resImg.ok) {
              throw new Error(`HTTP ${resImg.status} for ${imageUrl}`)
            }
            
            const ab = await resImg.arrayBuffer()
            const buf = Buffer.from(ab)
            const meta = await sharp(buf, { limitInputPixels: false }).metadata()
            const width = meta.width ?? 0
            const height = meta.height ?? 0
            const bytes = buf.length
            
            // Create Image record
            const image = await (prisma.image as any).upsert({
              where: { siteId_url: { siteId: site.id, url: imageUrl } },
              update: { width, height, bytes },
              create: {
                siteId: site.id,
                url: imageUrl,
                width,
                height,
                bytes,
              },
            })
            
            // Canonicalize and embed
            const { hash: contentHash } = await canonicalizeImage(buf)
            const existing = await prisma.imageEmbedding.findFirst({
              where: { contentHash: contentHash } as any
            })
            
            let ivec: number[]
            const existingForImage = await prisma.imageEmbedding.findUnique({
              where: { imageId: image.id } as any
            })
            
            if (existing && existingForImage) {
              if (existingForImage.contentHash !== contentHash) {
                await prisma.imageEmbedding.update({
                  where: { imageId: image.id } as any,
                  data: { contentHash: contentHash } as any
                })
              }
              ivec = existing.vector as unknown as number[]
            } else if (existing) {
              ivec = existing.vector as unknown as number[]
              // Check if embedding with this contentHash already exists for a different image
              const hashExists = await prisma.imageEmbedding.findFirst({
                where: { contentHash: contentHash } as any
              })
              if (!hashExists) {
                await prisma.imageEmbedding.create({
                  data: {
                    imageId: image.id,
                    model: existing.model,
                    vector: existing.vector as any,
                    contentHash: contentHash
                  } as any,
                })
              } else {
                // Reuse the existing embedding record
                ivec = hashExists.vector as unknown as number[]
                await prisma.imageEmbedding.upsert({
                  where: { imageId: image.id } as any,
                  update: { contentHash: contentHash } as any,
                  create: {
                    imageId: image.id,
                    model: hashExists.model,
                    vector: hashExists.vector as any,
                    contentHash: contentHash
                  } as any,
                })
              }
            } else {
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
            
            // Score and create tags
            const concepts = await prisma.concept.findMany()
            if (concepts.length > 0) {
              const scores = concepts
                .map(c => ({
                  c,
                  score: cosineSimilarity(ivec, (c.embedding as unknown as number[]) || [])
                }))
                .sort((a, b) => b.score - a.score)
              
              const MIN_SCORE = 0.12
              const TOP_K = 5
              const chosen = scores.filter(s => s.score >= MIN_SCORE).slice(0, TOP_K) || scores.slice(0, 3)
              
              for (const { c, score } of chosen) {
                await prisma.imageTag.upsert({
                  where: { imageId_conceptId: { imageId: image.id, conceptId: c.id } },
                  update: { score },
                  create: { imageId: image.id, conceptId: c.id, score },
                })
              }
            }
            
            // Update site.imageUrl
            await prisma.site.update({
              where: { id: site.id },
              data: { imageUrl }
            })
            
            console.log(`  ✅ Created Image record, embedding, and tags\n`)
            successCount++
          } catch (e: any) {
            console.log(`  ❌ Error creating Image/embedding: ${e.message || e}\n`)
            errorCount++
          }
        }

      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}\n`)
        errorCount++
      }
    }

    console.log(`\n✅ Completed!`)
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    console.log(`   Total: ${sitesToProcess.length}`)

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateScreenshotsDirect()

