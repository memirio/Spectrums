import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching tags...')
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    console.log('Found tags:', tags.length)
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags', details: (error as Error).message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
