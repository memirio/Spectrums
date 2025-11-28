#!/usr/bin/env tsx
/**
 * Migrate Images to Supabase Storage
 * 
 * Downloads images from MinIO and uploads them to Supabase Storage,
 * then updates the database URLs.
 * 
 * Prerequisites:
 * 1. SUPABASE_URL and SUPABASE_KEY in .env (from Supabase dashboard)
 * 2. MinIO running locally (or images accessible via URLs)
 * 
 * Usage:
 *   tsx scripts/migrate_images_to_supabase_storage.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Get Supabase credentials
// Prefer service_role key for admin access (can upload files)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
let SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate service_role key format (should be a JWT with 3 parts)
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const parts = process.env.SUPABASE_SERVICE_ROLE_KEY.split('.')
  if (parts.length !== 3 || process.env.SUPABASE_SERVICE_ROLE_KEY.length < 100) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY appears invalid, using anon key instead')
    SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!')
  console.error('   Please add to .env:')
  console.error('   SUPABASE_URL=https://your-project.supabase.co')
  console.error('   SUPABASE_KEY=your-anon-key')
  process.exit(1)
}

const usingServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY && SUPABASE_KEY === process.env.SUPABASE_SERVICE_ROLE_KEY
if (!usingServiceRole) {
  console.log('ℹ️  Using anon key with RLS policies (should work after policy setup)\n')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const BUCKET_NAME = 'Images'

async function ensureBucketExists() {
  console.log(`📦 Using bucket "${BUCKET_NAME}"...`)
  console.log(`   (Skipping existence check - will verify during upload)`)
}

async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error: any) {
    throw new Error(`Failed to download ${url}: ${error.message}`)
  }
}

async function uploadToSupabaseStorage(
  buffer: Buffer,
  path: string,
  contentType: string = 'image/webp'
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType,
      upsert: true, // Overwrite if exists
      cacheControl: '3600',
    })
  
  if (error) {
    throw error
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}

async function migrateImages() {
  console.log('🚀 Migrating images to Supabase Storage...\n')
  console.log(`📋 Supabase URL: ${SUPABASE_URL}`)
  console.log(`📦 Bucket: ${BUCKET_NAME}\n`)

  // Ensure bucket exists
  await ensureBucketExists()

  // Get all images
  const images = await prisma.image.findMany({
    select: {
      id: true,
      url: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  console.log(`📊 Found ${images.length} images to migrate\n`)

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const progress = `[${i + 1}/${images.length}]`
    
    try {
      // Check if already migrated (URL contains supabase.co)
      if (image.url.includes('supabase.co')) {
        console.log(`${progress} ⏭️  Already migrated: ${image.id}`)
        skippedCount++
        continue
      }

      // Extract path from MinIO URL
      // e.g., http://localhost:9000/screenshots/abc123/abc123def456.1738x1302.webp
      // -> screenshots/abc123/abc123def456.1738x1302.webp
      const minioUrl = new URL(image.url)
      const minioPath = minioUrl.pathname.startsWith('/') 
        ? minioUrl.pathname.slice(1) 
        : minioUrl.pathname
      
      // Remove 'screenshots/' prefix if present (bucket name)
      const storagePath = minioPath.replace(/^screenshots\//, '')

      console.log(`${progress} 📥 Downloading: ${image.url}`)
      
      // Download from MinIO
      const buffer = await downloadImage(image.url)
      console.log(`   📦 Size: ${(buffer.length / 1024).toFixed(1)} KB`)

      // Upload to Supabase Storage
      console.log(`   ☁️  Uploading to Supabase Storage...`)
      const publicUrl = await uploadToSupabaseStorage(
        buffer,
        storagePath,
        'image/webp'
      )
      
      console.log(`   ✅ Uploaded: ${publicUrl}`)

      // Update database
      await prisma.image.update({
        where: { id: image.id },
        data: { url: publicUrl }
      })

      console.log(`   ✅ Database updated`)
      successCount++

      // Progress update every 10 images
      if ((i + 1) % 10 === 0) {
        console.log(`\n📊 Progress: ${successCount} migrated, ${errorCount} errors, ${skippedCount} skipped\n`)
      }

    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      errorCount++
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('\n📋 Summary:')
  console.log(`   ✅ Successfully migrated: ${successCount}`)
  console.log(`   ⏭️  Already migrated (skipped): ${skippedCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📊 Total: ${images.length}`)
}

async function main() {
  try {
    await migrateImages()
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

