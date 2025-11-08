import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function checkQueueStatus() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sites = await prisma.site.findMany({
    where: { createdAt: { gte: today } },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      title: true,
      url: true,
      imageUrl: true,
      images: { select: { id: true } }
    }
  })
  
  console.log(`Checking status for ${sites.length} recent sites...\n`)
  
  const statusCounts = {
    done: 0,
    waiting: 0,
    active: 0,
    failed: 0,
    not_found: 0,
    error: 0
  }
  
  const doneSites: string[] = []
  const failedSites: string[] = []
  
  for (const site of sites) {
    const idemKey = `looma-${Buffer.from(site.url).toString('base64').slice(0, 24)}`
    
    try {
      const statusRes = await fetch(`${SCREENSHOT_API_URL}/api/screenshot/${idemKey}`, {
        signal: AbortSignal.timeout(2000)
      })
      
      if (statusRes.ok) {
        const status = await statusRes.json()
        const statusType = status.status || 'unknown'
        statusCounts[statusType as keyof typeof statusCounts] = (statusCounts[statusType as keyof typeof statusCounts] || 0) + 1
        
        if (status.status === 'done' && status.imageUrl) {
          doneSites.push(site.title)
          // Update site if we have the imageUrl but site doesn't have it yet
          if (!site.imageUrl) {
            await prisma.site.update({
              where: { url: site.url },
              data: { imageUrl: status.imageUrl }
            })
          }
        } else if (status.status === 'error' || status.status === 'failed') {
          failedSites.push(site.title)
        }
      } else if (statusRes.status === 404) {
        statusCounts.not_found++
      }
    } catch (error) {
      // Skip errors
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('=== Queue Status ===')
  console.log(`Done: ${statusCounts.done}`)
  console.log(`Waiting: ${statusCounts.waiting}`)
  console.log(`Active: ${statusCounts.active}`)
  console.log(`Failed: ${statusCounts.failed}`)
  console.log(`Not Found: ${statusCounts.not_found}`)
  
  if (doneSites.length > 0) {
    console.log(`\n✅ Completed screenshots (${doneSites.length}):`)
    doneSites.slice(0, 10).forEach(title => console.log(`  - ${title}`))
    if (doneSites.length > 10) {
      console.log(`  ... and ${doneSites.length - 10} more`)
    }
  }
  
  if (failedSites.length > 0) {
    console.log(`\n❌ Failed screenshots (${failedSites.length}):`)
    failedSites.slice(0, 10).forEach(title => console.log(`  - ${title}`))
    if (failedSites.length > 10) {
      console.log(`  ... and ${failedSites.length - 10} more`)
    }
  }
  
  if (statusCounts.done > 0) {
    console.log(`\n💡 Run 'npx tsx scripts/process_completed_screenshots.ts' to process completed screenshots`)
  }
  
  await prisma.$disconnect()
}

checkQueueStatus().catch(console.error)

