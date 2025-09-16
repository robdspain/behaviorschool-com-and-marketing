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

export async function GET(_req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await context.params;
    const segments = params.path || [];
    const relPath = segments.join('/');

    console.log('Ghost proxy request:', { segments, relPath });

    if (!isAllowedPath(relPath)) {
      console.log('Forbidden path:', relPath);
      return new NextResponse('Forbidden', { status: 403 });
    }

    const ghostBase = getGhostBase();
    const upstream = `${ghostBase}/${relPath}`;

    console.log('Fetching from upstream:', upstream);

    const upstreamRes = await fetch(upstream, {
      headers: {
        'User-Agent': 'BehaviorSchool-Proxy/1.0'
      }
    });

    console.log('Upstream response status:', upstreamRes.status);

    if (!upstreamRes.ok) {
      console.log('Upstream error:', upstreamRes.status, upstreamRes.statusText);
      return new NextResponse('Not found', { status: 404 });
    }

    const headers = new Headers();

    // Copy important headers
    if (upstreamRes.headers.get('content-type')) {
      headers.set('Content-Type', upstreamRes.headers.get('content-type')!);
    }
    if (upstreamRes.headers.get('content-length')) {
      headers.set('Content-Length', upstreamRes.headers.get('content-length')!);
    }

    // Set cache headers
    headers.set('Cache-Control', 'public, max-age=2592000, immutable');
    headers.set('X-Robots-Tag', 'noindex');

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers,
    });
  } catch (error) {
    console.error('Ghost proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = false;

