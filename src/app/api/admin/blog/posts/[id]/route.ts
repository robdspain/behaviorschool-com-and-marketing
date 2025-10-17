import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const GHOST_URL = process.env.GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com';
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

// GET - Fetch single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getGhostToken();

    const response = await fetch(
      `${GHOST_URL}/ghost/api/admin/posts/${id}/?formats=mobiledoc,html&include=tags,authors`,
      {
        headers: {
          Authorization: `Ghost ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to fetch post: ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      post: data.posts?.[0]
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = getGhostToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        posts: [{
          title: body.title,
          html: body.html,
          status: body.status,
          feature_image: body.feature_image,
          tags: body.tags,
          excerpt: body.excerpt,
          meta_title: body.meta_title,
          meta_description: body.meta_description,
          twitter_title: body.twitter_title,
          twitter_description: body.twitter_description,
          twitter_image: body.twitter_image,
          og_title: body.og_title,
          og_description: body.og_description,
          og_image: body.og_image,
          updated_at: body.updated_at, // Required for updates
        }]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Failed to update post: ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      post: data.posts?.[0]
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getGhostToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Ghost ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to delete post: ${response.status}`
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
