import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost, markdownToHtml } from '@/lib/blog';

// GET - Fetch post by ID (slug)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // In our file-based system, ID is the same as slug
    const post = getPostBySlug(id);

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    // Convert markdown to HTML for editor compatibility
    const html = await markdownToHtml(post.content);

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

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const frontmatter = {
      title: body.title,
      excerpt: body.excerpt || '',
      date: body.date || new Date().toISOString(),
      author: body.author || 'Rob Spain',
      featured_image: body.feature_image,
      tags: body.tags?.map((t: any) => t.name || t) || [],
      status: body.status || 'draft',
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    };

    // Support both HTML and markdown content
    const content = body.markdown || body.content || '';

    savePost(id, frontmatter, content);

    return NextResponse.json({
      success: true,
      post: { id, slug: id, ...frontmatter }
    });
  } catch (error) {
    console.error('Error updating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
    return NextResponse.json(
      { success: false, error: errorMessage, details: String(error) },
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
    const success = deletePost(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
    return NextResponse.json(
      { success: false, error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
