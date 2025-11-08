import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

// Sites that failed during the initial run
const failedSites = [
  { title: 'Linear App', url: 'https://linear.app' },
  { title: 'Apple AirPods Pro', url: 'https://www.apple.com/airpods-pro' },
]

async function retryFailedScreenshots() {
  try {
    console.log(`Retrying ${failedSites.length} failed sites...\n`)

    for (const siteInfo of failedSites) {
      const site = await prisma.site.findFirst({
        where: { url: siteInfo.url }
      })

      if (!site) {
        console.log(`❌ Site not found: ${siteInfo.title}`)
        continue
      }

      console.log(`\nProcessing: ${site.title} (${site.url})`)

      try {
        const idemKey = `looma-retry-${Buffer.from(site.url).toString('base64').slice(0, 20)}`
        
        const enqueueResponse = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idemKey,
          },
          body: JSON.stringify({ 
            url: site.url, 
            fresh: true,
            viewport: { width: 1200, height: 900 } 
          }),
        })

        if (!enqueueResponse.ok) {
          const errorData = await enqueueResponse.json().catch(() => ({ error: 'Unknown error' }))
          console.log(`  ❌ Failed to enqueue: ${errorData.error || enqueueResponse.statusText}`)
          continue
        }

        const data = await enqueueResponse.json()
        let imageUrl: string | null = null

        if (data.imageUrl) {
          imageUrl = data.imageUrl
          console.log(`  ✅ Got screenshot: ${imageUrl}`)
        } else if (data.statusUrl) {
          console.log(`  ⏳ Waiting for screenshot (job: ${data.jobId})...`)
          const deadline = Date.now() + 60_000 // 60 second timeout
          let completed = false

          while (Date.now() < deadline && !completed) {
            await new Promise(r => setTimeout(r, 3000)) // Poll every 3 seconds
            
            const statusResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            if (!statusResponse.ok) {
              if (statusResponse.status === 404) {
                // Job might have been removed, check cache
                await new Promise(r => setTimeout(r, 5000)) // Wait a bit more
                continue
              }
              console.log(`  ❌ Status check failed: ${statusResponse.statusText}`)
              break
            }

            const status = await statusResponse.json()
            if (status.status === 'done' && status.imageUrl) {
              imageUrl = status.imageUrl
              completed = true
              console.log(`  ✅ Screenshot ready: ${imageUrl}`)
            } else if (status.status === 'error') {
              console.log(`  ❌ Screenshot failed: ${status.error}`)
              break
            }
          }

          if (!completed) {
            console.log(`  ⚠️  Screenshot not ready within timeout`)
            continue
          }
        }

        if (imageUrl) {
          await prisma.site.update({
            where: { id: site.id },
            data: { imageUrl }
          })
          console.log(`  ✅ Updated site with screenshot`)
        }

      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
      }
    }

    console.log(`\n✅ Retry completed!`)

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

retryFailedScreenshots()

