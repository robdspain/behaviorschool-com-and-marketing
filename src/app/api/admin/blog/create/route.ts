import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, tags, status, featured } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const token = createToken();
    const html = markdownToHtml(content || '');

    // Create post data
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

    const response = await fetch(`${GHOST_URL}/ghost/api/admin/posts/`, {
      method: 'POST',
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
        { error: `Failed to create post: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result.posts[0]);

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}