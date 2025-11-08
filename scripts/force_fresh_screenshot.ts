#!/usr/bin/env tsx
/**
 * Force a fresh screenshot (bypass cache)
 */

import 'dotenv/config'

const svcBase = process.env.SCREENSHOT_API_URL || 'http://localhost:3001'
const url = 'https://cornrevolution.resn.global/'
const idemKey = `looma-force-${Date.now()}`

async function main() {
  try {
    console.log('🔄 Forcing fresh screenshot for:', url)
    console.log('   Using unique idempotency key:', idemKey)
    
    const response = await fetch(`${svcBase}/api/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idemKey,
      },
      body: JSON.stringify({ url, viewport: { width: 1200, height: 900 } }),
    })
    
    console.log('\n📡 Response status:', response.status)
    const data = await response.json()
    console.log('📦 Response data:', JSON.stringify(data, null, 2))
    
    if (data.imageUrl) {
      console.log('\n✅ Fresh screenshot ready immediately:', data.imageUrl)
      return
    }
    
    if (data.statusUrl) {
      console.log('\n⏳ Polling for fresh screenshot (this may take 60-90 seconds)...')
      for (let i = 0; i < 45; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const statusRes = await fetch(`${svcBase}${data.statusUrl}`)
        const status = await statusRes.json()
        
        if (i % 5 === 0) {
          console.log(`   Poll ${i + 1}: status=${status.status}`)
        }
        
        if (status.status === 'done' && status.imageUrl) {
          console.log(`\n✅ Fresh screenshot ready after ${(i + 1) * 2} seconds:`)
          console.log(`   ${status.imageUrl}`)
          return
        }
        
        if (status.status === 'error') {
          console.log(`\n❌ Screenshot generation failed: ${status.error}`)
          return
        }
      }
      
      console.log('\n⚠️  Screenshot generation timed out after 90 seconds')
    }
  } catch (e: any) {
    console.error('❌ Error:', e.message)
    console.error(e.stack)
  }
}

main().catch(console.error)

