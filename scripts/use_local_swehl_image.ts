#!/usr/bin/env tsx
/**
 * Use Local Swehl Image (bypass MinIO for this one site)
 *
 * - Copies /Users/victor/Downloads/FireShot/swehl.com.png into public/manual/
 * - Updates swehl.com site.imageUrl to /manual/swehl.com.png
 * - Upserts Image record for that URL and computes embedding if missing
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { canonicalizeImage, embedImageFromBuffer } from '../src/lib/embeddings'
import fs from 'fs'
import path from 'path'

async function main() {
  const sourcePath = '/Users/victor/Downloads/FireShot/swehl.com.png'
  const publicDir = path.join(process.cwd(), 'public', 'manual')
  const publicRelPath = '/manual/swehl.com.png'
  const destPath = path.join(publicDir, 'swehl.com.png')

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`)
    return
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  console.log(`📁 Copying image to public: ${destPath}`)
  fs.copyFileSync(sourcePath, destPath)

  const buf = fs.readFileSync(destPath)
  const { hash: contentHash } = await canonicalizeImage(buf)
  console.log(`🔐 Content hash: ${contentHash.substring(0, 16)}...`)

  // Find swehl site
  const site = await prisma.site.findFirst({
    where: { url: 'https://swehl.com' },
  })

  if (!site) {
    console.error('❌ Site not found: https://swehl.com')
    return
  }

  console.log(`🔍 Updating site: ${site.title} (${site.id})`)

  // Update site imageUrl to local public path
  await prisma.site.update({
    where: { id: site.id },
    data: { imageUrl: publicRelPath },
  })

  // Upsert Image row pointing to the same URL
  const image = await (prisma.image as any).upsert({
    where: { siteId_url: { siteId: site.id, url: publicRelPath } },
    update: {
      url: publicRelPath,
      category: 'website',
    },
    create: {
      siteId: site.id,
      url: publicRelPath,
      category: 'website',
    },
  })

  console.log(`🖼️  Image record: ${image.id}`)

  // Ensure embedding exists
  const existingEmbedding = await prisma.imageEmbedding.findFirst({
    where: { contentHash } as any,
  })

  if (existingEmbedding) {
    console.log('♻️ Reusing existing embedding')
    if (existingEmbedding.imageId !== image.id) {
      await prisma.imageEmbedding.update({
        where: { id: existingEmbedding.id },
        data: { imageId: image.id } as any,
      })
      console.log('🔗 Linked embedding to new image row')
    }
  } else {
    console.log('🤖 Computing new embedding...')
    const result = await embedImageFromBuffer(buf)
    await prisma.imageEmbedding.upsert({
      where: { imageId: image.id } as any,
      update: {
        vector: result.vector as any,
        model: 'clip-ViT-L/14',
        contentHash,
      } as any,
      create: {
        imageId: image.id,
        vector: result.vector as any,
        model: 'clip-ViT-L/14',
        contentHash,
      } as any,
    })
    console.log('✅ Embedding created')
  }

  await prisma.$disconnect()
  console.log('✅ Done. Swehl should now use the local /manual/swehl.com.png image.')
}

main().catch((err) => {
  console.error(err)
  prisma.$disconnect()
})


