import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Only handle app.spectrums.design subdomain - leave www.spectrums.design and main domain as-is
  // Handle both production (app.spectrums.design) and development (app.localhost:3000)
  const isAppSubdomain = 
    hostname === 'app.spectrums.design' ||
    hostname.startsWith('app.spectrums.design:') ||
    (process.env.NODE_ENV === 'development' && (hostname === 'app.localhost' || hostname.startsWith('app.localhost:')))
  
  if (isAppSubdomain) {
    const pathname = url.pathname
    
    // Skip rewriting for API routes, static files, and Next.js internals
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/android-chrome') ||
      pathname.startsWith('/apple-touch-icon') ||
      pathname.startsWith('/site.webmanifest')
    ) {
      return NextResponse.next()
    }
    
    // Note: Authentication is now handled in src/app/app/layout.tsx
    // to avoid Edge runtime issues with NextAuth
    
    // If accessing root on app subdomain, redirect to /app/all
    if (pathname === '/' || pathname === '') {
      url.pathname = '/app/all'
      return NextResponse.redirect(url)
    }
    
    // Rewrite all paths to /app/* prefix if not already there
    if (!pathname.startsWith('/app/')) {
      url.pathname = `/app${pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  // For www.spectrums.design and main domain, let it work normally (no rewriting)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

