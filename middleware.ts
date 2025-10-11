import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // No admin auth for now - we'll add it back step by step
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
