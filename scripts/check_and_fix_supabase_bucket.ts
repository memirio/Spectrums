#!/usr/bin/env tsx
/**
 * Check and Fix Supabase Storage Bucket
 * 
 * Verifies the Images bucket exists and is public, creates it if needed.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = 'Images'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  console.log('🔍 Checking Supabase Storage buckets...\n')
  
  // List all buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError.message)
    console.error('   This might be a permissions issue. Make sure you\'re using the SERVICE_ROLE_KEY.')
    process.exit(1)
  }
  
  console.log('📦 Existing buckets:')
  buckets.forEach(bucket => {
    console.log(`   - ${bucket.name} (public: ${bucket.public})`)
  })
  
  // Check if Images bucket exists
  const imagesBucket = buckets.find(b => b.name === BUCKET_NAME || b.name === 'images')
  
  if (!imagesBucket) {
    console.log(`\n❌ Bucket "${BUCKET_NAME}" does not exist!`)
    console.log('\n📝 To create it:')
    console.log('   1. Go to your Supabase dashboard')
    console.log('   2. Navigate to Storage')
    console.log('   3. Click "New bucket"')
    console.log(`   4. Name it "${BUCKET_NAME}"`)
    console.log('   5. Make it PUBLIC')
    console.log('   6. Click "Create bucket"')
    console.log('\n   Or run this script with SERVICE_ROLE_KEY to auto-create it.')
    
    // Try to create it if we have service role key
    if (SUPABASE_KEY.includes('eyJ') && SUPABASE_KEY.length > 100) {
      console.log('\n🔧 Attempting to create bucket...')
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
      
      if (createError) {
        console.error('❌ Failed to create bucket:', createError.message)
        console.error('   You may need to create it manually in the Supabase dashboard.')
      } else {
        console.log(`✅ Successfully created bucket "${BUCKET_NAME}"`)
      }
    }
  } else {
    console.log(`\n✅ Bucket "${imagesBucket.name}" exists`)
    console.log(`   Public: ${imagesBucket.public}`)
    
    if (!imagesBucket.public) {
      console.log('\n⚠️  Bucket is not public! Images won\'t be accessible.')
      console.log('   To make it public:')
      console.log('   1. Go to Supabase dashboard > Storage')
      console.log(`   2. Click on "${imagesBucket.name}" bucket`)
      console.log('   3. Go to Settings')
      console.log('   4. Toggle "Public bucket" to ON')
    }
  }
  
  // Test accessing a sample image
  console.log('\n🧪 Testing image access...')
  const testUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/test`
  const testResponse = await fetch(testUrl)
  console.log(`   Test URL: ${testUrl}`)
  console.log(`   Status: ${testResponse.status} ${testResponse.statusText}`)
  
  if (testResponse.status === 404) {
    console.log('   (404 is expected for a test path - bucket exists but file doesn\'t)')
  } else if (testResponse.status === 403) {
    console.log('   ⚠️  403 Forbidden - bucket exists but RLS policies may be blocking access')
  }
}

main().catch(console.error)

