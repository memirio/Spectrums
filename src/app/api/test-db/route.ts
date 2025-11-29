import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not set',
        databaseUrlPresent: false
      }, { status: 500 })
    }

    // Try a simple query
    const siteCount = await prisma.site.count()
    
    return NextResponse.json({
      success: true,
      databaseUrlPresent: true,
      databaseConnected: true,
      siteCount,
      message: 'Database connection successful'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      databaseUrlPresent: !!process.env.DATABASE_URL,
      databaseConnected: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

