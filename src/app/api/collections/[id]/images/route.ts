import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Add an image to a collection
export async function POST(
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
    const { imageId } = body

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Check if image is already in collection
    const existing = await prisma.collectionImage.findUnique({
      where: {
        collectionId_imageId: {
          collectionId: resolvedParams.id,
          imageId: imageId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Image already in collection' },
        { status: 400 }
      )
    }

    // Add image to collection
    await prisma.collectionImage.create({
      data: {
        collectionId: resolvedParams.id,
        imageId: imageId
      }
    })

    return NextResponse.json(
      { message: 'Image added to collection successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[collections] Error adding image to collection:', error)
    return NextResponse.json(
      { error: 'Failed to add image to collection', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove an image from a collection
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

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Remove image from collection
    await prisma.collectionImage.delete({
      where: {
        collectionId_imageId: {
          collectionId: resolvedParams.id,
          imageId: imageId
        }
      }
    })

    return NextResponse.json(
      { message: 'Image removed from collection successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[collections] Error removing image from collection:', error)
    return NextResponse.json(
      { error: 'Failed to remove image from collection', details: error?.message },
      { status: 500 }
    )
  }
}

