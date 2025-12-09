import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a collection by name for the authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> | { name: string } }
) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both sync and async params (Next.js 15+ uses async params)
    const resolvedParams = await Promise.resolve(params)
    const decodedName = decodeURIComponent(resolvedParams.name)
    
    console.log('[collections/by-name] Fetching collection:', {
      encodedName: resolvedParams.name,
      decodedName,
      userId: session.user.id
    })

    const collection = await prisma.collection.findFirst({
      where: {
        name: decodedName,
        userId: session.user.id // Ensure user owns the collection
      },
      include: {
        images: {
          include: {
            image: {
              select: {
                id: true,
                url: true,
                site: {
                  select: {
                    id: true,
                    url: true,
                    title: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!collection) {
      // Debug: Check if collection exists with different name or different user
      const allUserCollections = await prisma.collection.findMany({
        where: { userId: session.user.id },
        select: { name: true }
      })
      console.log('[collections/by-name] Collection not found. User collections:', allUserCollections.map(c => c.name))
      
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }
    
    console.log('[collections/by-name] Found collection:', collection.name, 'with', collection.images.length, 'images')

    return NextResponse.json({
      collection: {
        id: collection.id,
        name: collection.name,
        description: collection.description || '',
        createdAt: collection.createdAt,
        images: collection.images.map(ci => ({
          id: ci.image.id,
          url: ci.image.url,
          siteUrl: ci.image.site?.url || null,
          siteTitle: ci.image.site?.title || null
        }))
      }
    })
  } catch (error) {
    console.error('[collections] Error fetching collection by name:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

