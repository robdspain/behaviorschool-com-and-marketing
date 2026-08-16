export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';
import { requireAdminApiSession } from '@/lib/admin-api-session';
import { blogPublishingIdentity, checkPublishingRelease, publishingApprovalUrl } from '@/lib/publishing-standard';

// GET - Fetch all posts from markdown files
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'all';

    let posts = getAllPosts();

    // Filter by status if specified
    if (statusParam !== 'all') {
      posts = posts.filter(post => post.status === statusParam);
    }

    // Transform to match Ghost API format for backward compatibility
    const transformedPosts = posts.map(post => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      feature_image: post.featured_image || null,
      published_at: post.date,
      updated_at: post.date,
      status: post.status,
      tags: post.tags?.map(tag => ({ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') })) || []
    }));

    return NextResponse.json({
      success: true,
      posts: transformedPosts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    return NextResponse.json(
      { success: false, error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    const { savePost } = await import('@/lib/blog');

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if ((body.status || 'draft') === 'published') {
      const identity = blogPublishingIdentity(body, slug);
      const gate = await checkPublishingRelease(identity);
      if (!gate.approved) {
        return NextResponse.json({
          success: false,
          error: 'Publishing blocked: this exact version needs editorial approval.',
          publishingGate: { ...gate, identity, approvalUrl: publishingApprovalUrl(identity) },
        }, { status: 409 });
      }
    }
    
    const frontmatter = {
      title: body.title,
      excerpt: body.excerpt || '',
      date: body.date || new Date().toISOString(),
      author: body.author || 'Rob Spain',
      featured_image: body.featured_image,
      tags: body.tags || [],
      status: body.status || 'draft',
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    };

    savePost(slug, frontmatter, body.content || '');

    return NextResponse.json({
      success: true,
      post: { slug, ...frontmatter }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
    return NextResponse.json(
      { success: false, error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
