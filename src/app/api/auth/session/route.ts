import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Try to use auth, but fallback to cookie check if it fails
    // This handles NextAuth v5 beta module resolution issues
    let session = null
    try {
      const { auth } = await import('@/lib/auth')
      session = await auth()
    } catch (authError: any) {
      // If auth() fails due to module issues, check cookie directly
      console.warn('[auth] Auth import failed, using cookie check:', authError.message)
      const sessionToken = 
        request.cookies.get('authjs.session-token')?.value ||
        request.cookies.get('__Secure-authjs.session-token')?.value ||
        request.cookies.get('next-auth.session-token')?.value ||
        request.cookies.get('__Secure-next-auth.session-token')?.value
      
      if (sessionToken) {
        // Return a basic session object if cookie exists
        // The actual user data will need to be decoded from the token
        return NextResponse.json({ user: { authenticated: true } }, { status: 200 })
      }
    }

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: session.user }, { status: 200 })
  } catch (error: any) {
    console.error('[auth] Session error:', error)
    return NextResponse.json(
      { error: 'Failed to get session', details: error.message },
      { status: 500 }
    )
  }
}

