import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a specific collection by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both sync and async params (Next.js 15+ uses async params)
    const resolvedParams = await Promise.resolve(params)

    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id // Ensure user owns the collection
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

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
    })
  } catch (error) {
    console.error('[collections] Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

// PATCH - Update a collection
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both sync and async params (Next.js 15+ uses async params)
    const resolvedParams = await Promise.resolve(params)

    const body = await request.json()
    const { name, description } = body

    // Check if collection exists and user owns it
    const existing = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // If name is being changed, check for duplicates
    if (name && name.trim() !== existing.name) {
      const duplicate = await prisma.collection.findUnique({
        where: {
          userId_name: {
            userId: session.user.id,
            name: name.trim()
          }
        }
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'A collection with this name already exists' },
          { status: 409 }
        )
      }
    }

    const collection = await prisma.collection.update({
      where: {
        id: resolvedParams.id
      },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null })
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
    })
  } catch (error) {
    console.error('[collections] Error updating collection:', error)
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle both sync and async params (Next.js 15+ uses async params)
    const resolvedParams = await Promise.resolve(params)

    // Check if collection exists and user owns it
    const existing = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    await prisma.collection.delete({
      where: {
        id: resolvedParams.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[collections] Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}

