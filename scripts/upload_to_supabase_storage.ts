#!/usr/bin/env tsx
/**
 * Upload Images to Supabase Storage
 * 
 * Uploads local image files to Supabase Storage and returns public URLs.
 * This replaces the old MinIO upload functionality.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'Images'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY in .env')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Generate a consistent key for an image based on its content hash
 */
function generateKey(filePath: string, contentHash: string, width: number, height: number): string {
  // Use content hash + dimensions for consistent naming
  // Format: {hash16}/{hash24}.{width}x{height}.webp
  return `${contentHash.substring(0, 16)}/${contentHash.substring(0, 24)}.${width}x${height}.webp`
}

/**
 * Upload a local image file to Supabase Storage and return the public URL
 */
export async function uploadImageToSupabaseStorage(
  filePath: string,
  contentHash?: string
): Promise<string> {
  
  const buf = fs.readFileSync(filePath)
  
  // Convert to WebP for consistency
  const webpBuf = await sharp(buf, { limitInputPixels: false })
    .webp({ quality: 85 })
    .toBuffer()
  
  const meta = await sharp(webpBuf).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  
  // Use provided contentHash (from canonical PNG) for consistent key naming
  // Even though we're uploading WebP, we use the canonical PNG hash for the key
  const hash = contentHash || crypto.createHash('sha256').update(webpBuf).digest('hex')
  
  // Generate storage path using hash (from canonical image) + dimensions
  const storagePath = generateKey(filePath, hash, width, height)
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, webpBuf, {
      contentType: 'image/webp',
      upsert: true, // Overwrite if exists
      cacheControl: '3600',
    })
  
  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`)
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)
  
  return urlData.publicUrl
}

/**
 * Upload multiple images and return mapping of file paths to URLs
 */
export async function uploadImagesToSupabaseStorage(
  filePaths: string[],
  progressCallback?: (current: number, total: number, filePath: string) => void
): Promise<Map<string, string>> {
  
  const results = new Map<string, string>()
  
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i]
    
    if (progressCallback) {
      progressCallback(i + 1, filePaths.length, filePath)
    }
    
    try {
      const url = await uploadImageToSupabaseStorage(filePath)
      results.set(filePath, url)
    } catch (error: any) {
      console.error(`Failed to upload ${filePath}: ${error.message}`)
      throw error
    }
  }
  
  return results
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Usage: tsx scripts/upload_to_supabase_storage.ts <file1> [file2] ...')
    process.exit(1)
  }
  
  uploadImagesToSupabaseStorage(args, (current, total, filePath) => {
    console.log(`[${current}/${total}] Uploading ${path.basename(filePath)}...`)
  })
    .then(results => {
      console.log('\n✅ Upload complete!')
      results.forEach((url, filePath) => {
        console.log(`   ${path.basename(filePath)} → ${url}`)
      })
    })
    .catch(error => {
      console.error('❌ Upload failed:', error.message)
      process.exit(1)
    })
}

