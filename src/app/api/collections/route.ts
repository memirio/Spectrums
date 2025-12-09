import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all collections for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    console.log('[collections] Session:', { hasSession: !!session, userId: session?.user?.id })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[collections] Fetching collections for user:', session.user.id)

    // Fetch collections
    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch images for each collection separately
    const collectionsWithImages = await Promise.all(
      collections.map(async (collection) => {
        try {
          const collectionImages = await prisma.collectionImage.findMany({
            where: {
              collectionId: collection.id
            },
            include: {
              image: {
                select: {
                  id: true,
                  url: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            },
            take: 3 // Only get first 3 images for preview
          })

          return {
            ...collection,
            images: collectionImages.map(ci => ({
              id: ci.image.id,
              url: ci.image.url
            }))
          }
        } catch (imageError) {
          console.error(`[collections] Error fetching images for collection ${collection.id}:`, imageError)
          return {
            ...collection,
            images: []
          }
        }
      })
    )

    // Transform the data to match the frontend interface
    const formattedCollections = collectionsWithImages.map(collection => ({
      id: collection.id,
      name: collection.name,
      description: collection.description || '',
      createdAt: collection.createdAt,
      images: collection.images || []
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error: any) {
    console.error('[collections] Error fetching collections:', error)
    console.error('[collections] Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })
    return NextResponse.json(
      { error: 'Failed to fetch collections', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    // Check if collection with same name already exists for this user
    const existing = await prisma.collection.findUnique({
      where: {
        userId_name: {
          userId: session.user.id,
          name: name.trim()
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A collection with this name already exists' },
        { status: 409 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim() || null
      },
      include: {
        images: {
          include: {
            image: {
              select: {
                id: true,
                url: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      collection: {
        id: collection.id,
        name: collection.name,
        description: collection.description || '',
        createdAt: collection.createdAt,
        images: collection.images.map(ci => ({
          id: ci.image.id,
          url: ci.image.url
        }))
      }
    }, { status: 201 })
  } catch (error) {
    console.error('[collections] Error creating collection:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

