import { NextResponse, type NextRequest } from 'next/server'

const COMMUNITY_HOST = 'community.behaviorschool.com'
const COMMUNITY_TARGET = 'https://behaviorschool.com/transformation-program'

function isRetiredMasterclassPath(pathname: string): boolean {
  return pathname === '/masterclass' || pathname.startsWith('/masterclass/')
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase()
  const { pathname } = request.nextUrl

  if (isRetiredMasterclassPath(pathname)) {
    return NextResponse.redirect(new URL('/ceus', request.url), 301)
  }

  if (pathname.startsWith('/api/masterclass')) {
    return NextResponse.json(
      {
        ok: false,
        error: 'masterclass_retired',
        message: 'The public masterclass has been retired. Use /ceus or https://learning.behaviorschool.com.',
      },
      {
        status: 410,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    )
  }

  if (pathname.startsWith('/api/nm')) {
    return NextResponse.json(
      {
        ok: false,
        error: 'newsletter_manager_retired',
        message: 'The legacy newsletter manager has been retired. Use /admin/newsletter.',
      },
      {
        status: 410,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      },
    )
  }

  if (host === COMMUNITY_HOST) {
    return NextResponse.redirect(COMMUNITY_TARGET, 308)
  }

  const response = NextResponse.next();

  // Add noindex header for admin and test pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/test')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/nm/:path*',
    '/api/masterclass/:path*',
    // Exclude API routes and static assets from middleware
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
