import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function regenerateAllScreenshots() {
  try {
    console.log('Fetching all sites...')
    
    // Get all sites
    const allSites = await prisma.site.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${allSites.length} sites`)
    console.log(`This will regenerate screenshots for ALL sites.\n`)

    if (allSites.length === 0) {
      console.log('No sites found!')
      return
    }

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (const site of allSites) {
      console.log(`\nProcessing: ${site.title} (${site.url})`)
      
      if (!site.url || !/^https?:\/\//.test(site.url)) {
        console.log(`  ⚠️  Skipping - invalid URL: ${site.url}`)
        skippedCount++
        continue
      }

      try {
        const idemKey = `looma-${Buffer.from(site.url).toString('base64').slice(0, 24)}`
        
        // Request screenshot with fresh=true to force regeneration
        const enqueueResponse = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idemKey,
          },
          body: JSON.stringify({ 
            url: site.url, 
            fresh: true, // Force new capture even if cached
            viewport: { width: 1200, height: 900 } 
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
          // Immediate result (shouldn't happen with fresh=true, but handle it)
          imageUrl = data.imageUrl
          console.log(`  ✅ Got screenshot: ${imageUrl}`)
        } else if (data.statusUrl) {
          // Poll for result
          console.log(`  ⏳ Waiting for screenshot (job: ${data.jobId})...`)
          const deadline = Date.now() + 45_000 // 45 second timeout per site
          let completed = false

          while (Date.now() < deadline && !completed) {
            await new Promise(r => setTimeout(r, 2000)) // Poll every 2 seconds
            
            const statusResponse = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            if (!statusResponse.ok) {
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
            errorCount++
            continue
          }
        } else {
          console.log(`  ❌ Unexpected response format`)
          errorCount++
          continue
        }

        // Update site with new imageUrl
        if (imageUrl) {
          await prisma.site.update({
            where: { id: site.id },
            data: { imageUrl }
          })
          console.log(`  ✅ Updated site with new screenshot`)
          successCount++
        }

      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
        errorCount++
      }
    }

    console.log(`\n✅ Completed!`)
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    console.log(`   Skipped: ${skippedCount}`)
    console.log(`   Total: ${allSites.length}`)

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

regenerateAllScreenshots()

