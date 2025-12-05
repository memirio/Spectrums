import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const BUCKET_NAME = 'Images'

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({
        error: 'Missing Supabase credentials',
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_KEY
      }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Try to list buckets
    let bucketStatus = 'unknown'
    let bucketError = null
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        bucketError = listError.message
        bucketStatus = 'error'
      } else {
        const imagesBucket = buckets?.find(b => b.name === BUCKET_NAME || b.name === 'images')
        if (imagesBucket) {
          bucketStatus = imagesBucket.public ? 'exists_public' : 'exists_private'
        } else {
          bucketStatus = 'not_found'
        }
      }
    } catch (error: any) {
      bucketError = error.message
      bucketStatus = 'exception'
    }

    // Test a sample image URL
    const testUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/test`
    let imageTestStatus = 'unknown'
    let imageTestError = null
    try {
      const response = await fetch(testUrl)
      imageTestStatus = response.status === 404 ? 'bucket_exists_404' : response.status === 403 ? 'forbidden' : response.status === 500 ? 'server_error' : `status_${response.status}`
      if (!response.ok) {
        const text = await response.text()
        imageTestError = text.substring(0, 200)
      }
    } catch (error: any) {
      imageTestError = error.message
      imageTestStatus = 'fetch_error'
    }

    return NextResponse.json({
      supabaseUrl: SUPABASE_URL?.substring(0, 50) + '...',
      bucketName: BUCKET_NAME,
      bucketStatus,
      bucketError,
      imageTestStatus,
      imageTestError,
      testUrl
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

