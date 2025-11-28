#!/usr/bin/env tsx
/**
 * Make Supabase Storage Bucket Public
 * 
 * This script attempts to make the Images bucket public.
 * If it fails, you'll need to do it manually in the Supabase dashboard.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials')
  console.error('   Need SUPABASE_SERVICE_ROLE_KEY to modify bucket settings')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  console.log('🔓 Attempting to make Images bucket public...\n')
  
  // Try to update bucket to be public
  // Note: Supabase JS client doesn't have a direct method to update bucket settings
  // We need to use the REST API or SQL
  
  // Check current status
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError.message)
    console.error('\n📝 Manual steps:')
    console.error('   1. Go to Supabase dashboard → Storage')
    console.error('   2. Click on "Images" bucket')
    console.error('   3. Go to Settings tab')
    console.error('   4. Toggle "Public bucket" to ON')
    console.error('   5. Save changes')
    process.exit(1)
  }
  
  const imagesBucket = buckets.find(b => b.name === 'Images' || b.name === 'images')
  
  if (!imagesBucket) {
    console.error('❌ Images bucket not found')
    console.error('Available buckets:', buckets.map(b => b.name).join(', '))
    process.exit(1)
  }
  
  console.log('📦 Current bucket status:')
  console.log('   Name:', imagesBucket.name)
  console.log('   Public:', imagesBucket.public)
  console.log('   Created:', imagesBucket.created_at)
  
  if (imagesBucket.public) {
    console.log('\n✅ Bucket is already public!')
    return
  }
  
  console.log('\n⚠️  Bucket is NOT public. You need to make it public manually:')
  console.log('   1. Go to: https://supabase.com/dashboard')
  console.log('   2. Select your project')
  console.log('   3. Navigate to: Storage → Images bucket')
  console.log('   4. Click "Settings" tab')
  console.log('   5. Toggle "Public bucket" to ON')
  console.log('   6. Click "Save"')
  console.log('\n   After making it public, images should load correctly!')
}

main().catch(console.error)

