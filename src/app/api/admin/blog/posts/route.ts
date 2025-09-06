import { NextRequest, NextResponse } from 'next/server';

const GHOST_CONTENT_URL = process.env.GHOST_CONTENT_URL;
const GHOST_CONTENT_KEY = process.env.GHOST_CONTENT_KEY;

export async function GET() {
  try {
    if (!GHOST_CONTENT_URL || !GHOST_CONTENT_KEY) {
      return NextResponse.json(
        { error: 'Ghost API not configured' },
        { status: 500 }
      );
    }

    // Fetch posts from Ghost Content API
    const url = `${GHOST_CONTENT_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_KEY}&limit=50&include=tags,authors&order=updated_at%20desc`;
    
    const response = await fetch(url, {
      next: { revalidate: 0 } // Don't cache for admin interface
    });

    if (!response.ok) {
      console.error('Ghost API Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch posts from Ghost' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    const posts = data.posts.map((post: {
      id: string;
      title: string;
      slug: string;
      excerpt: string;
      visibility: string;
      created_at: string;
      updated_at: string;
      feature_image: string;
      tags?: { name: string }[];
    }) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.visibility === 'public' ? 'published' : 'draft',
      created_at: post.created_at,
      updated_at: post.updated_at,
      feature_image: post.feature_image,
      tags: post.tags?.map((tag: { name: string }) => ({ name: tag.name })) || []
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}