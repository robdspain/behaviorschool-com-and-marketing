import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, markdownToHtml } from '@/lib/blog';

// GET - Fetch post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Convert markdown to HTML for editor compatibility
    const html = await markdownToHtml(post.content);

    // Transform to match Ghost API format
    const transformedPost = {
      id: post.slug,
      title: post.title,
      slug: post.slug,
      html,
      markdown: post.content,
      excerpt: post.excerpt,
      feature_image: post.featured_image || null,
      published_at: post.date,
      updated_at: post.date,
      status: post.status,
      tags: post.tags?.map(tag => ({ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') })) || [],
      meta_title: post.meta_title,
      meta_description: post.meta_description,
    };

    return NextResponse.json({
      success: true,
      post: transformedPost
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
    return NextResponse.json(
      { success: false, error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
