import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Get all saved images for the current user
export async function GET(request: NextRequest) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const savedImages = await prisma.savedImage.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        image: {
          include: {
            site: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ savedImages }, { status: 200 })
  } catch (error: any) {
    console.error('[saved-images] Error fetching saved images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved images' },
      { status: 500 }
    )
  }
}

// POST: Save an image
export async function POST(request: NextRequest) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Check if already saved
    const existing = await prisma.savedImage.findUnique({
      where: {
        userId_imageId: {
          userId: session.user.id,
          imageId: imageId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Image already saved' },
        { status: 400 }
      )
    }

    // Save the image
    const savedImage = await prisma.savedImage.create({
      data: {
        userId: session.user.id,
        imageId: imageId,
      },
      include: {
        image: {
          include: {
            site: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { message: 'Image saved successfully', savedImage },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[saved-images] Error saving image:', error)
    return NextResponse.json(
      { error: 'Failed to save image', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Unsave an image
export async function DELETE(request: NextRequest) {
  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Delete the saved image
    await prisma.savedImage.delete({
      where: {
        userId_imageId: {
          userId: session.user.id,
          imageId: imageId,
        },
      },
    })

    return NextResponse.json(
      { message: 'Image unsaved successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[saved-images] Error unsaving image:', error)
    return NextResponse.json(
      { error: 'Failed to unsave image', details: error.message },
      { status: 500 }
    )
  }
}

