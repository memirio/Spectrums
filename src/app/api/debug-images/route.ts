import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get a sample of images to check their URLs
    const images = await prisma.image.findMany({
      take: 10,
      select: {
        id: true,
        url: true,
        siteId: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const sites = await prisma.site.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        images: {
          select: {
            url: true
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      imageCount: images.length,
      siteCount: sites.length,
      sampleImages: images.map((img: any) => ({
        id: img.id,
        url: img.url,
        isLocalhost: img.url.includes('localhost'),
        isSupabase: img.url.includes('supabase.co'),
        category: img.category
      })),
      sampleSites: sites.map((site: any) => ({
        id: site.id,
        title: site.title,
        legacyImageUrl: site.imageUrl,
        storedImageUrl: site.images[0]?.url,
        isLocalhost: site.imageUrl?.includes('localhost') || site.images[0]?.url?.includes('localhost'),
        isSupabase: site.imageUrl?.includes('supabase.co') || site.images[0]?.url?.includes('supabase.co')
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

