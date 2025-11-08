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

async function generateScreenshotsForExistingSites() {
  try {
    console.log('Fetching sites without screenshots...')
    
    // Get all sites that don't have an Image record
    const sites = await prisma.site.findMany({
      include: {
        images: true
      }
    })
    
    const sitesWithoutImages = sites.filter(site => site.images.length === 0)

    console.log(`Found ${sitesWithoutImages.length} sites without images`)

    if (sitesWithoutImages.length === 0) {
      console.log('All sites already have images!')
      return
    }

    let successCount = 0
    let errorCount = 0

    for (const site of sitesWithoutImages) {
      console.log(`\nProcessing: ${site.title} (${site.url})`)
      
      // Skip disantinowater.com as it's consistently stuck
      if (site.url?.includes('disantinowater')) {
        console.log(`  ⏭️  Skipping - known problematic site`)
        errorCount++
        continue
      }
      
      if (!site.url || !/^https?:\/\//.test(site.url)) {
        console.log(`  ⚠️  Skipping - invalid URL: ${site.url}`)
        errorCount++
        continue
      }

      try {
        const idemKey = `looma-${Buffer.from(site.url).toString('base64').slice(0, 24)}`
        
        // Request screenshot
        const enqueueResponse = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idemKey,
          },
          body: JSON.stringify({ 
            url: site.url, 
            viewport: { width: 1200, height: 900 }
            // Don't use fresh=true - it causes job ID conflicts
          }),
        })

        if (!enqueueResponse.ok) {
          const errorData = await enqueueResponse.json().catch(() => ({ error: 'Unknown error' }))
          console.log(`  ❌ Failed to enqueue: ${errorData.error || enqueueResponse.statusText}`)
          errorCount++
          continue
        }

        const data = await enqueueResponse.json()
        let imageUrl: string | null = null

        if (data.imageUrl) {
          // Immediate cached result
          imageUrl = data.imageUrl
          console.log(`  ✅ Got cached screenshot: ${imageUrl}`)
        } else if (data.statusUrl) {
          // Poll for result - wait longer for completion
          console.log(`  ⏳ Waiting for screenshot (job: ${data.jobId})...`)
          const deadline = Date.now() + 180_000 // 3 minute timeout (jobs take ~15-20s)
          let completed = false
          let pollCount = 0

          while (Date.now() < deadline && !completed) {
            await new Promise(r => setTimeout(r, 5000)) // Poll every 5 seconds
            pollCount++
            
            const statusResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            
            if (statusResponse.status === 404) {
              // Job might be completed and removed - wait a bit longer then check cache
              if (pollCount > 2) {
                // After 10+ seconds, check cache more aggressively
                for (let i = 0; i < 3; i++) {
                  await new Promise(r => setTimeout(r, 1000))
                  const cacheCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
                  if (cacheCheck.ok) {
                    const cacheStatus = await cacheCheck.json()
                    if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                      imageUrl = cacheStatus.imageUrl
                      completed = true
                      console.log(`  ✅ Screenshot ready (from cache after wait): ${imageUrl}`)
                      break
                    }
                  }
                }
                if (!completed && pollCount > 10) {
                  console.log(`  ⚠️  Job not found after multiple attempts - may have failed`)
                  break
                }
              }
              continue
            }
            
            if (!statusResponse.ok) {
              console.log(`  ❌ Status check failed: ${statusResponse.status}`)
              continue
            }

            const status = await statusResponse.json()
            if (status.status === 'done' && status.imageUrl) {
              imageUrl = status.imageUrl
              completed = true
              console.log(`  ✅ Screenshot ready: ${imageUrl}`)
            } else if (status.status === 'error') {
              console.log(`  ❌ Screenshot failed: ${status.error}`)
              break
            } else {
              // Still processing (waiting/active/completed but no result yet)
              if (pollCount % 3 === 0) {
                process.stdout.write(`[${status.status}]`)
              } else {
                process.stdout.write('.')
              }
            }
          }
          
          if (!completed) {
            console.log(`\n  ⚠️  Screenshot not ready within timeout (checked ${pollCount} times)`)
            errorCount++
            continue
          }
        } else {
          console.log(`  ❌ Unexpected response format`)
          errorCount++
          continue
        }

        // Create Image record and trigger embedding/tagging (same logic as POST /api/sites)
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
            
            // Canonicalize to get contentHash
            const { hash: contentHash } = await canonicalizeImage(buf)
            
            // Check if embedding already exists by contentHash
            const existing = await prisma.imageEmbedding.findFirst({
              where: { contentHash: contentHash } as any
            })
            
            let ivec: number[]
            // Check if this image already has an embedding
            const existingForImage = await prisma.imageEmbedding.findUnique({
              where: { imageId: image.id } as any
            })
            
            if (existing && existingForImage) {
              // Both exist - just update contentHash if needed
              if (existingForImage.contentHash !== contentHash) {
                await prisma.imageEmbedding.update({
                  where: { imageId: image.id } as any,
                  data: { contentHash: contentHash } as any
                })
              }
              ivec = existing.vector as unknown as number[]
            } else if (existing) {
              // Reuse existing embedding for this new image
              ivec = existing.vector as unknown as number[]
              await prisma.imageEmbedding.create({
                data: {
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
            
            // Score and create tags (no active field in Concept model, fetch all)
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
            
            console.log(`  ✅ Created Image record, embedding, and tags`)
            successCount++
          } catch (e: any) {
            console.log(`  ❌ Error creating Image/embedding: ${e.message || e}`)
            errorCount++
          }
        }

      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
        errorCount++
      }
    }

    console.log(`\n✅ Completed!`)
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    console.log(`   Total: ${sitesWithoutImages.length}`)

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateScreenshotsForExistingSites()

