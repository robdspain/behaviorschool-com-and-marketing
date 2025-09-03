import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import FormData from 'form-data';

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create form data for Ghost API
    const ghostFormData = new FormData();
    const buffer = Buffer.from(await file.arrayBuffer());
    ghostFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const token = createToken();

    // Upload to Ghost
    const response = await fetch(`${GHOST_URL}/ghost/api/admin/images/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Ghost ${token}`,
        ...ghostFormData.getHeaders(),
      },
      body: ghostFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ghost Image Upload Error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Failed to upload image: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}