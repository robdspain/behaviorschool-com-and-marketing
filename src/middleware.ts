import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware() {
  // For now, allow access to admin pages since authentication is handled client-side
  // This can be enhanced later with proper server-side auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};



