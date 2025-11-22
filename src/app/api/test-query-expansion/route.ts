import { NextRequest, NextResponse } from 'next/server'
import { expandAbstractQuery } from '@/lib/query-expansion'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || 'fun'
    const category = searchParams.get('category') || null
    
    // Test 1: Check Prisma connection
    let prismaTest = 'OK'
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (e: any) {
      prismaTest = `FAILED: ${e.message}`
    }
    
    // Test 2: Check raw query
    let rawQueryTest = 'OK'
    try {
      const result = await (prisma.$queryRawUnsafe as any)(
        `SELECT "expansion" FROM "query_expansions" WHERE "term" = ? AND "source" = ? AND "category" = ? LIMIT 1`,
        q.toLowerCase(),
        'groq',
        category === 'packaging' ? 'packaging' : 'global'
      )
      rawQueryTest = `OK: ${JSON.stringify(result)}`
    } catch (e: any) {
      rawQueryTest = `FAILED: ${e.message}`
    }
    
    // Test 3: Try expandAbstractQuery
    let expansionTest = 'OK'
    let expansions: string[] = []
    try {
      expansions = await expandAbstractQuery(q, category || undefined)
      expansionTest = `OK: ${expansions.length} expansions`
    } catch (e: any) {
      expansionTest = `FAILED: ${e.message}`
      if (e.stack) {
        expansionTest += `\nStack: ${e.stack}`
      }
    }
    
    return NextResponse.json({
      query: q,
      category: category || 'null',
      tests: {
        prisma: prismaTest,
        rawQuery: rawQueryTest,
        expandAbstractQuery: expansionTest,
        expansions: expansions.slice(0, 3) // First 3 only
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}


