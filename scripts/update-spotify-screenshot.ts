import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'

async function updateSpotify() {
  try {
    const site = await prisma.site.findFirst({ 
      where: { url: { contains: 'spotify' } } 
    })
    
    if (!site) {
      console.log('❌ Spotify site not found')
      return
    }
    
    console.log(`Updating screenshot for: ${site.title} (${site.url})`)
    
    const response = await fetch(`${SCREENSHOT_API_URL}/api/screenshot`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Idempotency-Key': `spotify-${Date.now()}` 
      },
      body: JSON.stringify({ 
        url: site.url, 
        viewport: { width: 1200, height: 900 },
        fresh: true
      })
    })
    
    if (!response.ok) {
      console.log('❌ Failed:', await response.text())
      return
    }
    
    const data = await response.json()
    let imageUrl = data.imageUrl
    
    if (data.statusUrl) {
      console.log('⏳ Waiting for screenshot...')
      for (let i = 0; i < 25; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const statusRes = await fetch(`${SCREENSHOT_API_URL}${data.statusUrl}`)
        const statusData = await statusRes.json()
        if (statusData.status === 'done') { 
          imageUrl = statusData.imageUrl
          console.log('✅ Screenshot ready:', imageUrl)
          break 
        }
        if (statusData.status === 'error') {
          console.log('❌ Screenshot failed:', statusData.error)
          return
        }
        if (i % 5 === 0 && i > 0) console.log(`   Still processing... (${i * 2}s)`)
      }
    }
    
    if (imageUrl) {
      await prisma.site.update({ 
        where: { id: site.id }, 
        data: { imageUrl } 
      })
      console.log('✅ Updated Spotify screenshot in database')
    } else {
      console.log('⚠️  Screenshot not ready')
    }
    
  } catch (error: any) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateSpotify()

