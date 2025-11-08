import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function updateSitesWithCompletedScreenshots() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Get all sites created today without imageUrl
  const sites = await prisma.site.findMany({
    where: {
      createdAt: { gte: today },
      imageUrl: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      title: true,
      url: true,
    }
  })
  
  console.log(`Checking ${sites.length} sites for completed screenshots...\n`)
  
  let updated = 0
  let completed = 0
  
  for (const site of sites) {
    const idemKey = `looma-${Buffer.from(site.url).toString('base64').slice(0, 24)}`
    
    try {
      const statusRes = await fetch(`${SCREENSHOT_API_URL}/api/screenshot/${idemKey}`, {
        signal: AbortSignal.timeout(2000)
      })
      
      if (statusRes.ok) {
        const status = await statusRes.json()
        
        if (status.status === 'done' && status.imageUrl) {
          // Update site with imageUrl
          await prisma.site.update({
            where: { id: site.id },
            data: { imageUrl: status.imageUrl }
          })
          updated++
          completed++
          console.log(`✅ Updated: ${site.title}`)
        } else if (status.status === 'waiting' || status.status === 'active') {
          // Still processing
          console.log(`⏳ Processing: ${site.title}`)
        } else if (status.status === 'error' || status.status === 'failed') {
          console.log(`❌ Failed: ${site.title}`)
        }
      }
    } catch (error) {
      // Skip errors (job might not exist yet)
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n=== Summary ===`)
  console.log(`Updated: ${updated}/${sites.length}`)
  console.log(`Completed: ${completed}/${sites.length}`)
  
  if (completed > 0) {
    console.log(`\n💡 Run: npx tsx scripts/process_completed_screenshots.ts`)
    console.log(`   to create Image records and tags`)
  }
  
  await prisma.$disconnect()
}

updateSitesWithCompletedScreenshots().catch(console.error)

