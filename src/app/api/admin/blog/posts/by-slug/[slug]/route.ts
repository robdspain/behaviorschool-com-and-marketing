import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GHOST_URL = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;

function getGhostToken() {
  if (!GHOST_ADMIN_KEY) {
    throw new Error('Ghost Admin API key not configured');
  }
  const [id, secret] = GHOST_ADMIN_KEY.split(':');
  return jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: '/admin/'
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = getGhostToken();
    const url = `${GHOST_URL}/ghost/api/admin/posts/?include=tags,authors&formats=mobiledoc,html&filter=slug:${encodeURIComponent(slug)}&limit=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, error: `Ghost API error ${response.status}`, details: text }, { status: response.status });
    }

    const data = await response.json();
    const post = Array.isArray(data.posts) && data.posts.length > 0 ? data.posts[0] : null;
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

