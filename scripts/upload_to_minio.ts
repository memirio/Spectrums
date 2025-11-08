#!/usr/bin/env tsx
/**
 * Upload Images to MinIO
 * 
 * Uploads local image files to MinIO storage and returns CDN URLs.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import crypto from 'crypto'

// MinIO configuration (same as screenshot-service)
const BUCKET = process.env.STORAGE_BUCKET || 'screenshots'
const REGION = process.env.STORAGE_REGION || 'us-east-1'
const ENDPOINT = process.env.STORAGE_ENDPOINT || 'http://localhost:9000'
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || 'minio'
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'minio123'
const CDN_BASE = process.env.CDN_BASE_URL || 'http://localhost:9000/screenshots'

const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
})

/**
 * Generate a consistent key for an image based on its content hash
 */
function generateKey(filePath: string, contentHash: string, width: number, height: number): string {
  const filename = path.basename(filePath, path.extname(filePath))
  // Use content hash + dimensions for consistent naming
  return `${contentHash.substring(0, 16)}/${contentHash.substring(0, 24)}.${width}x${height}.webp`
}

/**
 * Upload a local image file to MinIO and return the CDN URL
 */
export async function uploadImageToMinIO(
  filePath: string,
  contentHash?: string
): Promise<string> {
  // Read file
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
  
  // Generate S3 key using hash (from canonical image) + dimensions
  const key = `${hash.substring(0, 16)}/${hash.substring(0, 24)}.${width}x${height}.webp`
  
  // Check if already exists (optional optimization)
  // For now, we'll always upload to ensure latest version
  
  // Upload to MinIO
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: webpBuf,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  
  // Return CDN URL
  return `${CDN_BASE}/${key}`
}

/**
 * Upload multiple images and return mapping of file paths to CDN URLs
 */
export async function uploadImagesToMinIO(
  filePaths: string[],
  progressCallback?: (current: number, total: number, filePath: string) => void
): Promise<Map<string, string>> {
  const results = new Map<string, string>()
  
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i]
    try {
      if (progressCallback) {
        progressCallback(i + 1, filePaths.length, filePath)
      }
      
      const cdnUrl = await uploadImageToMinIO(filePath)
      results.set(filePath, cdnUrl)
    } catch (error: any) {
      console.error(`Failed to upload ${filePath}:`, error.message)
      throw error
    }
  }
  
  return results
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Usage: tsx scripts/upload_to_minio.ts <file1> [file2] ...')
    process.exit(1)
  }
  
  uploadImagesToMinIO(args, (current, total, filePath) => {
    console.log(`[${current}/${total}] Uploading ${path.basename(filePath)}...`)
  })
    .then(results => {
      console.log(`\n✅ Uploaded ${results.size} image(s):`)
      results.forEach((url, filePath) => {
        console.log(`   ${path.basename(filePath)} -> ${url}`)
      })
    })
    .catch(error => {
      console.error('Error:', error)
      process.exit(1)
    })
}

