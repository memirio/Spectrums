import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const urlsToDelete = [
  'https://it.pinterest.com/pin/844493675706887/',
  'https://www.behance.net/gallery/239564835/LOGOS-MARKS-C02?tracking_source=curated_galleries_graphic-design',
]

async function deleteSite(url: string) {
  try {
    // Normalize URL (remove trailing slash, lowercase for comparison)
    const normalizedUrl = url.trim().toLowerCase().replace(/\/$/, '')
    
    // Find site by URL (try multiple variations)
    const site = await prisma.site.findFirst({
      where: {
        OR: [
          { url: url },
          { url: normalizedUrl },
          { url: url.replace(/\/$/, '') },
          { url: { contains: normalizedUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '') } }
        ]
      },
      include: {
        images: {
          include: {
            embedding: true,
            tags: true
          }
        }
      }
    })

    if (!site) {
      console.log(`  ⚠️  Site not found: ${url}`)
      return { success: false, reason: 'not_found' }
    }

    console.log(`  📋 Found site: ${site.title}`)
    console.log(`     ID: ${site.id}`)
    console.log(`     Images: ${site.images.length}`)

    // Delete related data
    for (const image of site.images) {
      // Delete image tags
      if (image.tags && image.tags.length > 0) {
        await prisma.imageTag.deleteMany({
          where: { imageId: image.id }
        })
        console.log(`     Deleted ${image.tags.length} tags for image ${image.id}`)
      }

      // Delete image embedding
      if (image.embedding) {
        await prisma.imageEmbedding.delete({
          where: { imageId: image.id } as any
        }).catch(() => {
          // Ignore if already deleted
        })
        console.log(`     Deleted embedding for image ${image.id}`)
      }

      // Delete image
      await prisma.image.delete({
        where: { id: image.id }
      })
      console.log(`     Deleted image ${image.id}`)
    }

    // Delete site
    await prisma.site.delete({
      where: { id: site.id }
    })
    console.log(`  ✅ Deleted site: ${site.title}`)
    return { success: true, siteId: site.id }
  } catch (error: any) {
    console.error(`  ❌ Error deleting ${url}:`, error.message)
    return { success: false, reason: 'error', error: error.message }
  }
}

async function main() {
  console.log('🗑️  Deleting Logo Entries\n')
  console.log(`URLs to delete: ${urlsToDelete.length}\n`)

  const results = {
    success: 0,
    failed: 0,
    notFound: 0,
  }

  for (const url of urlsToDelete) {
    console.log(`\n[${url}]`)
    const result = await deleteSite(url)
    
    if (result.success) {
      results.success++
    } else if (result.reason === 'not_found') {
      results.notFound++
    } else {
      results.failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successfully deleted: ${results.success}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  Not found: ${results.notFound}`)
  console.log(`📦 Total: ${urlsToDelete.length}`)
}

main().catch(console.error)

