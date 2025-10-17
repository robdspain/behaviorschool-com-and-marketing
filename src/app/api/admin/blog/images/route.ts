import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

    return NextResponse.json({
      success: true,
      images: data.images
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
