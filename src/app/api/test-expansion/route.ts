import { NextRequest, NextResponse } from 'next/server'
import { isAbstractQuery, expandAbstractQuery } from '@/lib/query-expansion'

// Capture console logs and errors
const logs: string[] = []

// Override console.log and console.error temporarily
const originalLog = console.log
const originalError = console.error
console.log = (...args: any[]) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')
  logs.push(`[LOG] ${message}`)
  originalLog(...args)
}
console.error = (...args: any[]) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')
  logs.push(`[ERROR] ${message}`)
  originalError(...args)
}

export async function GET(request: NextRequest) {
  logs.length = 0 // Clear previous logs
  
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || 'euphoric'
  
  try {
    const isAbstract = isAbstractQuery(q)
    const expansions = await expandAbstractQuery(q)
    
    // Restore console.log and console.error
    console.log = originalLog
    console.error = originalError
    
    return NextResponse.json({
      query: q,
      isAbstract,
      expansions,
      logs: logs.filter(log => 
        log.includes('[search]') || 
        log.includes('[query-expansion]') ||
        log.includes('ERROR')
      )
    })
  } catch (error: any) {
    console.log = originalLog
    console.error = originalError
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      logs: logs.filter(log => 
        log.includes('[search]') || 
        log.includes('[query-expansion]') ||
        log.includes('Error') ||
        log.includes('ERROR')
      )
    }, { status: 500 })
  }
}

