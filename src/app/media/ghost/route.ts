import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL('/blog', request.url);
  const res = NextResponse.redirect(url, 308);
  res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

export const dynamic = 'force-static';

