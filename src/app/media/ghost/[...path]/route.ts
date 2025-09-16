import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function getGhostBase(): string {
  const raw = process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || process.env.GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com';
  return raw.replace(/\/$/, '');
}

function isAllowedPath(p: string): boolean {
  // Only allow serving Ghost content images
  return p.startsWith('content/images/');
}

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const segments = params.path || [];
  const relPath = segments.join('/');
  if (!isAllowedPath(relPath)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const upstream = `${getGhostBase()}/${relPath}`;
  const upstreamRes = await fetch(upstream, {
    // Allow edge caching
    next: { revalidate: 86400 },
  });

  if (!upstreamRes.ok || !upstreamRes.body) {
    return new NextResponse('Not found', { status: 404 });
  }

  const headers = new Headers(upstreamRes.headers);
  // Strong cache for images
  headers.set('Cache-Control', 'public, max-age=2592000, immutable');
  // Prevent search engines from indexing the proxy endpoints
  headers.set('X-Robots-Tag', 'noindex');

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers,
  });
}

export const dynamic = 'force-static';
export const revalidate = 86400; // 24h (60 * 60 * 24)

