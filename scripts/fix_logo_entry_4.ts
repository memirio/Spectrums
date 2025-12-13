import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import { tagImageWithoutNewConcepts } from '../src/jobs/tagging'
import sharp from 'sharp'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'Images'
const IMAGE_DIR = '/Users/victor/Downloads/FireShot/Logo'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function uploadImageToSupabaseStorage(imagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(imagePath)
    const fileName = path.basename(imagePath)
    const fileExt = path.extname(fileName)
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const storagePath = `${uniqueId}/${uniqueId}${fileExt}`

    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 
                     fileExt === '.png' ? 'image/png' : 
                     fileExt === '.webp' ? 'image/webp' : 'image/jpeg',
        upsert: false,
      })

    if (error) {
      console.error(`  ❌ Upload error: ${error.message}`)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    return publicUrl
  } catch (error: any) {
    console.error(`  ❌ Upload exception: ${error.message}`)
    return null
  }
}

async function addImageToSite(site: any, imagePath: string, imageUrl: string) {
  console.log(`\n📸 Processing image for site ${site.id}...`)
  
  // Read image file
  const buf = fs.readFileSync(imagePath)
  const meta = await sharp(buf, { limitInputPixels: false }).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  const bytes = buf.length
  
  console.log(`  📐 Dimensions: ${width}x${height} (${(bytes / 1024).toFixed(1)} KB)`)
  
  // Canonicalize to get contentHash
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`  🔐 Content hash: ${contentHash.substring(0, 16)}...`)
  
  // Create Image record
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: imageUrl } },
    update: {
      width,
      height,
      bytes,
      category: 'logo',
    },
    create: {
      siteId: site.id,
      url: imageUrl,
      width,
      height,
      bytes,
      category: 'logo',
    },
  })
  
  console.log(`  ✅ Image record created/updated (ID: ${image.id})`)
  
  // Check if embedding already exists by contentHash
  const existingByHash = await prisma.imageEmbedding.findFirst({ 
    where: { contentHash: contentHash } as any
  })
  
  // Check if this image already has an embedding
  const existingForImage = await prisma.imageEmbedding.findUnique({
    where: { imageId: image.id } as any
  })
  
  let ivec: number[] | null = null
  if (existingByHash) {
    // Reuse existing embedding vector from another image with same contentHash
    ivec = existingByHash.vector as unknown as number[]
    console.log(`  ♻️  Reusing existing embedding vector`)
    
    if (existingForImage) {
      // Update existing embedding (don't set contentHash if it would conflict)
      await prisma.imageEmbedding.update({
        where: { imageId: image.id } as any,
        data: { 
          vector: existingByHash.vector as any,
          model: existingByHash.model
        } as any,
      })
    } else {
      // Create new embedding without contentHash (since it's already used)
      await prisma.imageEmbedding.create({
        data: {
          imageId: image.id,
          model: existingByHash.model,
          vector: existingByHash.vector as any,
          contentHash: null, // Can't reuse unique contentHash, but vector is the same
        } as any,
      })
    }
    console.log(`  ✅ Reused existing embedding`)
  } else {
    // Compute new embedding
    console.log(`  🤖 Computing image embedding...`)
    const result = await embedImageFromBuffer(buf)
    ivec = result.vector
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id },
      update: { 
        vector: ivec as any, 
        model: 'clip-ViT-L/14', 
        contentHash: contentHash 
      } as any,
      create: { 
        imageId: image.id, 
        vector: ivec as any, 
        model: 'clip-ViT-L/14', 
        contentHash: contentHash 
      } as any,
    })
    console.log(`  ✅ Embedding computed and stored`)
  }
  
  // Tag with existing concepts (Pipeline 2.0)
  console.log(`  🏷️  Tagging image with existing concepts...`)
  await tagImageWithoutNewConcepts(image.id)
  console.log(`  ✅ Image tagged`)
}

async function main() {
  console.log('🔧 Fixing Logo Entry #4\n')
  
  // Find entry #4
  const site = await prisma.site.findFirst({
    where: {
      title: 'LOGOS & MARKS C02 - 4',
      url: {
        contains: 'behance.net/gallery/239564835/LOGOS-MARKS-C02'
      }
    },
    include: {
      images: true
    }
  })
  
  if (!site) {
    console.error('❌ Entry #4 not found in database')
    process.exit(1)
  }
  
  console.log(`Found entry #4:`)
  console.log(`  ID: ${site.id}`)
  console.log(`  Title: ${site.title}`)
  console.log(`  URL: ${site.url}`)
  console.log(`  Images: ${site.images.length}\n`)
  
  // Check if image has embedding
  const image = site.images[0]
  if (image) {
    const hasEmbedding = await prisma.imageEmbedding.findUnique({
      where: { imageId: image.id } as any
    })
    
    if (hasEmbedding) {
      console.log('✅ Entry #4 already has image with embedding, no fix needed')
      process.exit(0)
    } else {
      console.log('⚠️  Entry #4 has image but no embedding, will add embedding and tags...\n')
    }
  } else if (site.images.length > 0) {
    console.log('✅ Entry #4 already has images, no fix needed')
    process.exit(0)
  }
  
  // Find the image file for #4
  const imageFiles = fs.readdirSync(IMAGE_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
  
  // Find file that starts with "4."
  const imageFile = imageFiles.find(f => f.startsWith('4.'))
  
  if (!imageFile) {
    console.error('❌ Image file for entry #4 not found')
    process.exit(1)
  }
  
  console.log(`Found image file: ${imageFile}`)
  const imagePath = path.join(IMAGE_DIR, imageFile)
  
  // Upload image
  console.log(`\n📤 Uploading image to storage...`)
  const imageUrl = await uploadImageToSupabaseStorage(imagePath)
  
  if (!imageUrl) {
    console.error('❌ Failed to upload image')
    process.exit(1)
  }
  
  console.log(`✅ Image uploaded: ${imageUrl}`)
  
  // Check if image already exists for this site
  const existingImage = site.images.find(img => img.category === 'logo')
  
  if (existingImage) {
    console.log(`\n📸 Image already exists, adding embedding and tags...`)
    // Image already exists, just add embedding and tags
    const buf = fs.readFileSync(imagePath)
    const { hash: contentHash } = await canonicalizeImage(buf)
    
    // Check if embedding already exists by contentHash
    const existingByHash = await prisma.imageEmbedding.findFirst({ 
      where: { contentHash: contentHash } as any
    })
    
    let ivec: number[] | null = null
    if (existingByHash) {
      ivec = existingByHash.vector as unknown as number[]
      const existingForImage = await prisma.imageEmbedding.findUnique({
        where: { imageId: existingImage.id } as any
      })
      
      if (!existingForImage) {
        await prisma.imageEmbedding.create({
          data: {
            imageId: existingImage.id,
            model: existingByHash.model,
            vector: existingByHash.vector as any,
            contentHash: null,
          } as any,
        })
        console.log(`  ✅ Reused existing embedding`)
      }
    } else {
      console.log(`  🤖 Computing image embedding...`)
      const result = await embedImageFromBuffer(buf)
      ivec = result.vector
      await prisma.imageEmbedding.create({
        data: {
          imageId: existingImage.id,
          vector: ivec as any,
          model: 'clip-ViT-L/14',
          contentHash: contentHash,
        } as any,
      })
      console.log(`  ✅ Embedding computed and stored`)
    }
    
    // Tag with existing concepts (Pipeline 2.0)
    console.log(`  🏷️  Tagging image with existing concepts...`)
    await tagImageWithoutNewConcepts(existingImage.id)
    console.log(`  ✅ Image tagged`)
  } else {
    // Add image to site directly
    await addImageToSite(site, imagePath, imageUrl)
  }
  
  // Verify
  const updatedSite = await prisma.site.findUnique({
    where: { id: site.id },
    include: { images: true }
  })
  
  console.log(`\n✅ Verification:`)
  console.log(`   Images: ${updatedSite?.images.length || 0}`)
  if (updatedSite?.images.length > 0) {
    console.log(`   ✅ Entry #4 is now fixed and should appear in the gallery!`)
  }
}

main().catch(console.error)

