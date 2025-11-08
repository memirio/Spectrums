import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function updateSites() {
  try {
    const sites = await prisma.site.findMany({
      where: {
        OR: [
          { url: { contains: 'figma' } },
          { url: { contains: 'dribbble' } },
          { url: { contains: 'stripe' } }
        ]
      }
    })
    
    if (sites.length === 0) {
      console.log('❌ Sites not found')
      return
    }
    
    console.log(`Found ${sites.length} sites to update\n`)
    
    for (const site of sites) {
      console.log(`Updating: ${site.title} (${site.url})`)
      
      try {
        const response = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Idempotency-Key': `cookie-fix-${site.id}-${Date.now()}` 
          },
          body: JSON.stringify({ 
            url: site.url, 
            viewport: { width: 1200, height: 900 },
            fresh: true
          })
        })
        
        if (!response.ok) {
          console.log(`  ❌ Failed: ${response.statusText}`)
          continue
        }
        
        const data = await response.json()
        let imageUrl = data.imageUrl
        
        if (data.statusUrl) {
          console.log(`  ⏳ Waiting for screenshot...`)
          for (let i = 0; i < 25; i++) {
            await new Promise(r => setTimeout(r, 2000))
            const statusRes = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
            const statusData = await statusRes.json()
            if (statusData.status === 'done') { 
              imageUrl = statusData.imageUrl
              break 
            }
            if (statusData.status === 'error') {
              console.log(`  ❌ Failed: ${statusData.error}`)
              break
            }
          }
        }
        
        if (imageUrl) {
          await prisma.site.update({ 
            where: { id: site.id }, 
            data: { imageUrl } 
          })
          console.log(`  ✅ Updated successfully`)
        } else {
          console.log(`  ⚠️  Screenshot not ready`)
        }
        
      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}`)
      }
      
      console.log('') // Blank line between sites
    }
    
    console.log('✅ All sites processed!')
    
  } catch (error: any) {
    console.error('Fatal error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateSites()

