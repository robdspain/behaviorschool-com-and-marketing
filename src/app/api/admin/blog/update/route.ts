import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { submitBlogPostUniversal } from '@/lib/universal-indexing';

// Ghost Admin API configuration
const GHOST_URL = process.env.GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com';
const ADMIN_API_KEY = process.env.GHOST_ADMIN_KEY || '67b19c0c5db7be0001c0e715:083ac197565fea2fd87f44a37204db0baa769791f4ba5102b9912a4b9beb82a3';

// Parse the API key
const [keyId, keySecret] = ADMIN_API_KEY.split(':');

// Create JWT token for authentication
function createToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: keyId
  };
  
  const payload = {
    iat: now,
    exp: now + 300, // 5 minutes
    aud: '/admin/'
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = createHmac('sha256', Buffer.from(keySecret, 'hex'))
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Convert Markdown to HTML
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>')
    
    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    
    // Paragraphs (convert double line breaks to paragraphs)
    .replace(/\n\s*\n/g, '</p><p>')
    .replace(/^(?!<[h123]|<ul|<blockquote|<hr)(.+?)$/gm, '<p>$1</p>')
    
    // Clean up
    .replace(/<p><\/p>/g, '')
    .replace(/^<p>/, '')
    .replace(/<\/p>$/, '');
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, excerpt, tags, status, featured } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const token = createToken();
    const html = markdownToHtml(content || '');

    // Update post data
    const postData = {
      posts: [{
        title: title.trim(),
        html,
        status: status || 'draft',
        featured: featured || false,
        excerpt: excerpt?.trim() || '',
        tags: Array.isArray(tags) ? tags.map((tag: string) => ({ name: tag.trim() })) : []
      }]
    };

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Ghost ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ghost API Error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Failed to update post: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    const updatedPost = result.posts[0];
    
    // Auto-submit to all indexing services if post status changed to published
    if (updatedPost && updatedPost.status === 'published') {
      try {
        console.log(`🚀 Auto-submitting updated post to all indexing services: ${updatedPost.slug}`);
        const universalResult = await submitBlogPostUniversal(updatedPost.slug);
        
        // Add universal indexing status to response
        updatedPost.universalIndexing = {
          submitted: universalResult.success,
          timestamp: universalResult.timestamp,
          indexnow: universalResult.indexnow,
          google: universalResult.google,
          aiOptimization: universalResult.aiOptimization,
          summary: universalResult.summary
        };
        
        console.log(`✅ Universal indexing ${universalResult.success ? 'successful' : 'failed'} for updated post: ${updatedPost.slug}`);
        console.log(`📊 Coverage: ${universalResult.summary.successfulSubmissions}/${universalResult.summary.totalEndpoints} endpoints succeeded`);
      } catch (indexingError) {
        console.error(`❌ Universal indexing failed for updated post ${updatedPost.slug}:`, indexingError);
        // Don't fail the post update if indexing fails
        updatedPost.universalIndexing = {
          submitted: false,
          error: indexingError instanceof Error ? indexingError.message : 'Unknown error'
        };
      }
    }
    
    return NextResponse.json(updatedPost);

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const token = createToken();

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Ghost ${token}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ghost API Error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Failed to delete post: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}