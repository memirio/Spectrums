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

async function processSite(siteUrl: string) {
  const site = await prisma.site.findFirst({ 
    where: { 
      url: { contains: new URL(siteUrl).hostname.replace('www.', '') }
    },
    include: { images: true }
  })
  
  if (!site) {
    console.log(`❌ Site not found: ${siteUrl}`)
    return false
  }
  
  console.log(`\nProcessing: ${site.title}`)
  console.log(`  URL: ${site.url}`)
  
  if (!site.url || !/^https?:\/\//.test(site.url)) {
    console.log(`  ⚠️  Invalid URL`)
    return false
  }
  
  try {
    // Request screenshot with fresh=true to force new capture
    const response = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: site.url, 
        viewport: { width: 1200, height: 900 },
        fresh: true
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.log(`  ❌ Failed to enqueue: ${errorData.error || response.statusText}`)
      return false
    }
    
    const data = await response.json()
    let imageUrl: string | null = null
    
    if (data.imageUrl) {
      imageUrl = data.imageUrl
      console.log(`  ✅ Got cached screenshot`)
    } else if (data.statusUrl) {
      // Wait 40 seconds for fresh screenshots (they can take longer)
      console.log(`  ⏳ Waiting 40 seconds for screenshot...`)
      await new Promise(r => setTimeout(r, 40000))
      
      // Check status
      const statusResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
      
      if (statusResponse.ok) {
        const status = await statusResponse.json()
        if (status.status === 'done' && status.imageUrl) {
          imageUrl = status.imageUrl
          console.log(`  ✅ Screenshot ready`)
        } else if (status.status === 'waiting' || status.status === 'active') {
          // Still processing, wait 20 more seconds
          console.log(`  ⏳ Still processing, waiting 20 more seconds...`)
          await new Promise(r => setTimeout(r, 20000))
          const retryResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
          
          if (retryResponse.ok) {
            const retryStatus = await retryResponse.json()
            if (retryStatus.status === 'done' && retryStatus.imageUrl) {
              imageUrl = retryStatus.imageUrl
              console.log(`  ✅ Screenshot ready (after retry)`)
            } else if (retryStatus.status === 'waiting' || retryStatus.status === 'active') {
              // One final wait
              console.log(`  ⏳ Still processing, waiting 15 more seconds...`)
              await new Promise(r => setTimeout(r, 15000))
              const finalCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
              if (finalCheck.ok) {
                const finalStatus = await finalCheck.json()
                if (finalStatus.status === 'done' && finalStatus.imageUrl) {
                  imageUrl = finalStatus.imageUrl
                  console.log(`  ✅ Screenshot ready (final check)`)
                } else if (finalCheck.status === 404) {
                  // Check cache
                  await new Promise(r => setTimeout(r, 5000))
                  const cacheCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
                  if (cacheCheck.ok) {
                    const cacheStatus = await cacheCheck.json()
                    if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                      imageUrl = cacheStatus.imageUrl
                      console.log(`  ✅ Screenshot ready (from cache)`)
                    } else {
                      console.log(`  ⚠️  Still not ready after 75 seconds`)
                      return false
                    }
                  } else {
                    console.log(`  ⚠️  Could not retrieve`)
                    return false
                  }
                } else {
                  console.log(`  ⚠️  Still not ready (status: ${finalStatus.status})`)
                  return false
                }
              } else if (finalCheck.status === 404) {
                // Check cache
                await new Promise(r => setTimeout(r, 5000))
                const cacheCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
                if (cacheCheck.ok) {
                  const cacheStatus = await cacheCheck.json()
                  if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                    imageUrl = cacheStatus.imageUrl
                    console.log(`  ✅ Screenshot ready (from cache)`)
                  } else {
                    console.log(`  ⚠️  Not in cache`)
                    return false
                  }
                } else {
                  console.log(`  ⚠️  Could not retrieve from cache`)
                  return false
                }
              } else {
                console.log(`  ⚠️  Final check failed: ${finalCheck.status}`)
                return false
              }
            } else {
              console.log(`  ⚠️  Still not ready (status: ${retryStatus.status})`)
              return false
            }
          } else if (retryResponse.status === 404) {
            // Check cache
            await new Promise(r => setTimeout(r, 5000))
            const cacheCheck = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            if (cacheCheck.ok) {
              const cacheStatus = await cacheCheck.json()
              if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
                imageUrl = cacheStatus.imageUrl
                console.log(`  ✅ Screenshot ready (from cache)`)
              } else {
                console.log(`  ⚠️  Not in cache`)
                return false
              }
            } else {
              console.log(`  ⚠️  Could not retrieve from cache`)
              return false
            }
          } else {
            console.log(`  ⚠️  Retry failed: ${retryResponse.status}`)
            return false
          }
        } else {
          console.log(`  ⚠️  Status: ${status.status}`)
          return false
        }
      } else if (statusResponse.status === 404) {
        // Job might be in cache
        console.log(`  ⏳ Job removed, checking cache...`)
        await new Promise(r => setTimeout(r, 5000))
        const cacheResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
        if (cacheResponse.ok) {
          const cacheStatus = await cacheResponse.json()
          if (cacheStatus.status === 'done' && cacheStatus.imageUrl) {
            imageUrl = cacheStatus.imageUrl
            console.log(`  ✅ Screenshot ready (from cache)`)
          } else {
            console.log(`  ⚠️  Not in cache`)
            return false
          }
        } else {
          console.log(`  ⚠️  Could not retrieve from cache`)
          return false
        }
      } else {
        console.log(`  ⚠️  Status check failed: ${statusResponse.status}`)
        return false
      }
    } else {
      console.log(`  ❌ Unexpected response format`)
      return false
    }
    
    // Process image if we got one
    if (imageUrl) {
      try {
        // Fetch image to get metadata
        const resImg = await fetch(imageUrl)
        if (!resImg.ok) {
          throw new Error(`HTTP ${resImg.status}`)
        }
        
        const ab = await resImg.arrayBuffer()
        const buf = Buffer.from(ab)
        const meta = await sharp(buf, { limitInputPixels: false }).metadata()
        const width = meta.width ?? 0
        const height = meta.height ?? 0
        const bytes = buf.length
        
        // Delete old images for this site
        await prisma.image.deleteMany({
          where: { siteId: site.id }
        })
        
        // Create new Image record
        const image = await prisma.image.create({
          data: {
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
        
        // Delete old embedding if it exists
        if (existingForImage) {
          await prisma.imageEmbedding.delete({
            where: { imageId: image.id } as any
          })
        }
        
        if (existing) {
          ivec = existing.vector as unknown as number[]
          // Check if another image already has this embedding
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
            // Just link to existing
            await prisma.imageEmbedding.create({
              data: {
                imageId: image.id,
                model: hashExists.model,
                vector: hashExists.vector as any,
                contentHash: contentHash
              } as any,
            })
            ivec = hashExists.vector as unknown as number[]
          }
        } else {
          const result = await embedImageFromBuffer(buf)
          ivec = result.vector
          await prisma.imageEmbedding.create({
            data: {
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
          // Delete old tags
          await prisma.imageTag.deleteMany({
            where: { imageId: image.id }
          })
          
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
            await prisma.imageTag.create({
              data: {
                imageId: image.id,
                conceptId: c.id,
                score,
              },
            })
          }
        }
        
        // Update site.imageUrl
        await prisma.site.update({
          where: { id: site.id },
          data: { imageUrl }
        })
        
        console.log(`  ✅ Created Image record, embedding, and tags`)
        return true
      } catch (e: any) {
        console.log(`  ❌ Error creating Image/embedding: ${e.message || e}`)
        return false
      }
    }
    
    return false
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`)
    return false
  }
}

async function main() {
  const urls = [
    'https://disantinowater.com',
    'https://techunt.fr',
    'https://www.scorecard.io'
  ]
  
  console.log('Retrying screenshots for 3 sites...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (const url of urls) {
    const success = await processSite(url)
    if (success) {
      successCount++
    } else {
      errorCount++
    }
  }
  
  console.log(`\n✅ Done!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Total: ${urls.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
