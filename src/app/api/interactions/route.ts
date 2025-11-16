/**
 * API endpoint for logging user interactions (clicks, saves, dwell time)
 * 
 * POST /api/interactions
 * Body: { query: string, imageId: string, clicked: boolean, saved?: boolean, dwellTime?: number }
 */

import { NextRequest, NextResponse } from 'next/server'
import { logUserAction } from '@/lib/interaction-logger'

export async function POST(request: NextRequest) {
  try {
    // Handle both regular JSON and sendBeacon Blob
    let body: any
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      body = await request.json()
    } else {
      // sendBeacon sends as Blob, need to read as text
      const text = await request.text()
      body = JSON.parse(text)
    }
    
    const { query, imageId, clicked, saved, dwellTime } = body

    if (!query || !imageId || typeof clicked !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: query, imageId, clicked' },
        { status: 400 }
      )
    }

    await logUserAction(query, {
      imageId,
      clicked,
      saved: saved ?? false,
      dwellTime: dwellTime ? Math.round(dwellTime) : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[interactions] Error logging action:', error.message)
    return NextResponse.json(
      { error: 'Failed to log interaction' },
      { status: 500 }
    )
  }
}

