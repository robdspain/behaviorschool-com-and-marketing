import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Ghost URL should be just the base domain (https://ghost.behaviorschool.com)
const GHOST_URL = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;

console.log('Ghost URL:', GHOST_URL); // Debug log
console.log('Ghost Admin Key exists:', !!GHOST_ADMIN_KEY); // Debug log

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

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const token = getGhostToken();
    const url = `${GHOST_URL}/ghost/api/admin/posts/?include=tags,authors&formats=mobiledoc,html&limit=all${status !== 'all' ? `&filter=status:${status}` : ''}`;

    console.log('Fetching from URL:', url); // Debug log

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
        error: `Ghost API returned ${response.status}: ${error}`
      }, { status: response.status });
    }

    const data = await response.json();
    console.log(`Fetched ${data.posts?.length || 0} posts from Ghost`); // Debug log

    return NextResponse.json({
      success: true,
      posts: data.posts || []
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = getGhostToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/`, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        posts: [{
          title: body.title,
          html: body.html,
          status: body.status || 'draft',
          published_at: body.published_at,
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
          codeinjection_head: body.codeinjection_head,
          codeinjection_foot: body.codeinjection_foot,
        }]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Failed to create post: ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      post: data.posts?.[0]
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
