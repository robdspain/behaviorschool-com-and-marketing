import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, excerpt, tags, status, featured, featureImage, slug, metaTitle, metaDescription, canonicalUrl, codeInjectionHead, codeInjectionFoot } = body;
    
    // Update post via Ghost Admin API
    const ghostUrl = process.env.GHOST_CONTENT_URL;
    const ghostAdminKey = process.env.GHOST_PRIVITE_KEY; // Note: This should be the admin key, not content key
    
    if (!ghostUrl || !ghostAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Ghost configuration missing' },
        { status: 500 }
      );
    }

    // Convert markdown content to HTML (simplified)
    const htmlContent = convertMarkdownToHtml(content);

    const postData = {
      posts: [{
        id: id,
        title: title,
        html: htmlContent,
        excerpt: excerpt,
        tags: tags.map((tag: string) => ({ name: tag })),
        status: status,
        featured: featured,
        feature_image: featureImage,
        slug: slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        canonical_url: canonicalUrl,
        codeinjection_head: codeInjectionHead,
        codeinjection_foot: codeInjectionFoot
      }]
    };

    const response = await fetch(`${ghostUrl}/ghost/api/admin/posts/${id}/?source=html`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Ghost ${ghostAdminKey}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ghost API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      post: data.posts?.[0] || null
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Delete post via Ghost Admin API
    const ghostUrl = process.env.GHOST_CONTENT_URL;
    const ghostAdminKey = process.env.GHOST_PRIVITE_KEY;
    
    if (!ghostUrl || !ghostAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Ghost configuration missing' },
        { status: 500 }
      );
    }

    const response = await fetch(`${ghostUrl}/ghost/api/admin/posts/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Ghost ${ghostAdminKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ghost API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete post', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Simple markdown to HTML converter
function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img alt="$1" src="$2" />')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
    // Wrap in paragraphs
    .replace(/^(.*)$/gim, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/gim, '')
    .replace(/<p><br><\/p>/gim, '');
}