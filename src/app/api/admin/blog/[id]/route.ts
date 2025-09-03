import { NextRequest, NextResponse } from 'next/server';

const GHOST_CONTENT_URL = process.env.GHOST_CONTENT_URL;
const GHOST_CONTENT_KEY = process.env.GHOST_CONTENT_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!GHOST_CONTENT_URL || !GHOST_CONTENT_KEY) {
      return NextResponse.json(
        { error: 'Ghost API not configured' },
        { status: 500 }
      );
    }

    // Fetch single post from Ghost Content API
    const url = `${GHOST_CONTENT_URL}/ghost/api/content/posts/${id}/?key=${GHOST_CONTENT_KEY}&include=tags,authors&formats=html,mobiledoc`;
    
    const response = await fetch(url, {
      next: { revalidate: 0 } // Don't cache for admin interface
    });

    if (!response.ok) {
      console.error('Ghost API Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    const post = {
      id: data.posts[0].id,
      title: data.posts[0].title,
      slug: data.posts[0].slug,
      html: data.posts[0].html,
      mobiledoc: data.posts[0].mobiledoc,
      excerpt: data.posts[0].excerpt,
      status: data.posts[0].visibility === 'public' ? 'published' : 'draft',
      created_at: data.posts[0].created_at,
      updated_at: data.posts[0].updated_at,
      feature_image: data.posts[0].feature_image,
      featured: data.posts[0].featured,
      tags: data.posts[0].tags?.map((tag: { name: string }) => tag.name) || []
    };

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}