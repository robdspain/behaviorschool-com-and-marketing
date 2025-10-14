import { NextResponse } from 'next/server';

const GHOST_URL = process.env.GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com';
const GHOST_KEY = process.env.GHOST_CONTENT_KEY;

export async function GET() {
  try {
    if (!GHOST_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ghost API key not configured',
        posts: []
      });
    }

    // Fetch posts from Ghost Content API
    const url = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&include=tags,authors&limit=all&formats=html`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Ghost API error:', response.status, response.statusText);
      return NextResponse.json({ 
        success: false, 
        error: `Ghost API returned ${response.status}`,
        posts: []
      });
    }

    const data = await response.json();

    // Map Ghost posts to our format
    const posts = data.posts?.map((post: { id: string; title: string; slug: string; html: string; feature_image: string; published_at: string; updated_at: string; excerpt?: string; custom_excerpt?: string; tags?: unknown[] }) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      html: post.html,
      feature_image: post.feature_image,
      published_at: post.published_at,
      updated_at: post.updated_at,
      excerpt: post.excerpt || post.custom_excerpt,
      tags: post.tags || [],
      status: post.published_at ? 'published' : 'draft'
    })) || [];

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length
    });
  } catch (error) {
    console.error('Error fetching Ghost posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts from Ghost CMS',
        posts: []
      },
      { status: 500 }
    );
  }
}

