import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'Images'

// Supabase client will be created in the function to handle missing env vars gracefully

/**
 * Generate a consistent key for an image based on its content hash
 */
function generateKey(contentHash: string, width: number, height: number): string {
  // Use content hash + dimensions for consistent naming
  // Format: {hash16}/{hash24}.{width}x{height}.webp
  return `${contentHash.substring(0, 16)}/${contentHash.substring(0, 24)}.${width}x${height}.webp`
}

/**
 * Upload a File/Buffer to Supabase Storage and return the public URL
 */
export async function uploadImageBufferToSupabaseStorage(
  buffer: Buffer,
  contentHash?: string
): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Convert to WebP for consistency
  const webpBuf = await sharp(buffer, { limitInputPixels: false })
    .webp({ quality: 85 })
    .toBuffer()
  
  const meta = await sharp(webpBuf).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  
  // Use provided contentHash or generate one from WebP buffer
  const hash = contentHash || crypto.createHash('sha256').update(webpBuf).digest('hex')
  
  // Generate storage path using hash + dimensions
  const storagePath = generateKey(hash, width, height)
  
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

