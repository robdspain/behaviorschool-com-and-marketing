export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

const GHOST_URL = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;

function getGhostToken() {
  if (!GHOST_ADMIN_KEY) {
    throw new Error('Ghost Admin API key not configured');
  }

  const [id, secret] = GHOST_ADMIN_KEY.split(':');

  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: '/admin/'
  });

  return token;
}

// POST - Upload image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = getGhostToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/images/upload/`, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Failed to upload image: ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();

    // Auto-optimize to WebP when possible and prefer WebP URL in response
    try {
      const first = data?.images?.[0];
      const url: string | undefined = first?.url;
      if (url && !url.toLowerCase().endsWith('.webp')) {
        const origRes = await fetch(url);
        if (origRes.ok) {
          const buf = Buffer.from(await origRes.arrayBuffer());
          // Convert to WebP with sane defaults
          const webpBuf = await sharp(buf).webp({ quality: 82 }).toBuffer();
          const fileName = url.split('/')?.pop() || `upload-${Date.now()}.png`;
          const base = fileName.replace(/\.[^.]+$/, '');
          const webpName = `${base}.webp`;

          const webpForm = new FormData();
          // @ts-ignore - TS doesn't know Web API File in Node runtime here
          webpForm.append('file', new Blob([webpBuf], { type: 'image/webp' }), webpName);

          const webpResp = await fetch(`${GHOST_URL}/ghost/api/admin/images/upload/`, {
            method: 'POST',
            headers: { Authorization: `Ghost ${token}` },
            body: webpForm,
          });
          if (webpResp.ok) {
            const webpData = await webpResp.json();
            const webpUrl: string | undefined = webpData?.images?.[0]?.url;
            if (webpUrl) {
              return NextResponse.json({ success: true, images: [{ url: webpUrl }, ...(data.images || [])] });
            }
          }
        }
      }
    } catch (e) {
      console.warn('WebP optimization skipped:', e);
    }

    return NextResponse.json({ success: true, images: data.images });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
