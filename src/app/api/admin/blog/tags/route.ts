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

// GET - Fetch all tags
export async function GET() {
  try {
    const token = getGhostToken();
    const url = `${GHOST_URL}/ghost/api/admin/tags/?limit=all`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Ghost API returned ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      tags: data.tags || []
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = getGhostToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/tags/`, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: [{
          name: body.name,
          slug: body.slug,
          description: body.description,
        }]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Failed to create tag: ${response.status}`,
        details: error,
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      tag: data.tags?.[0]
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

// DELETE - Remove tag by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tag id is required' },
        { status: 400 }
      );
    }

    const token = getGhostToken();
    const response = await fetch(`${GHOST_URL}/ghost/api/admin/tags/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json(
        { success: false, error: `Failed to delete tag: ${response.status}`, details: error },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
