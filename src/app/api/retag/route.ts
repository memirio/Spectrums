import { NextRequest, NextResponse } from 'next/server'
import { enqueueTaggingJob } from '@/jobs/tagging'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const imageId = body?.imageId
    if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 })
    await enqueueTaggingJob(imageId)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}


