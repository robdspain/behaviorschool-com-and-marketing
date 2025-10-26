import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GHOST_URL =
  process.env.GHOST_ADMIN_URL ||
  process.env.GHOST_CONTENT_URL?.replace('/ghost/api/content', '') ||
  'https://ghost.behaviorschool.com';
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

const SUPPORTED_PLATFORMS = ['twitter', 'facebook', 'linkedin', 'instagram'] as const;
type Platform = typeof SUPPORTED_PLATFORMS[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, platforms } = body as {
      postId?: string;
      platforms: Record<Platform, boolean>;
    };

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId is required for social sharing' },
        { status: 400 }
      );
    }

    const token = getGhostToken();
    const results: Record<Platform, { success: boolean; message: string }> = {
      twitter: { success: false, message: '' },
      facebook: { success: false, message: '' },
      linkedin: { success: false, message: '' },
      instagram: { success: false, message: '' },
    };

    const headers = {
      Authorization: `Ghost ${token}`,
      'Content-Type': 'application/json',
    };

    await Promise.all(
      SUPPORTED_PLATFORMS.map(async (platform) => {
        if (!platforms?.[platform]) {
          results[platform] = { success: false, message: 'Not selected' };
          return;
        }

        try {
          const url = new URL(`${GHOST_URL}/ghost/api/admin/posts/${postId}/share/`);
          url.searchParams.set('platform', platform);

          const response = await fetch(url.toString(), {
            method: 'POST',
            headers,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ghost returned ${response.status}: ${errorText}`);
          }

          results[platform] = { success: true, message: 'Shared via Ghost' };
        } catch (error) {
          console.error(`Ghost share error (${platform}):`, error);
          results[platform] = {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to share',
          };
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error posting to social media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post to social media' },
      { status: 500 }
    );
  }
}
