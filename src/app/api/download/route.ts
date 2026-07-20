export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { downloadTokens } from '@/lib/download-tokens';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const email = typeof requestData.email === 'string'
      ? requestData.email.trim().toLowerCase()
      : '';
    const { resource } = requestData;
    
    if (!email || !resource) {
      return NextResponse.json({ error: 'Email and resource required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // Generate secure download token
    const token = randomBytes(32).toString('hex');
    const expires = Date.now() + (30 * 60 * 1000); // 30 minutes
    
    // Store token with metadata
    downloadTokens.set(token, {
      email,
      resource,
      expires,
      used: false
    });

    return NextResponse.json({ 
      downloadUrl: `/api/download/${token}`,
      expires: new Date(expires).toISOString()
    });

  } catch (error) {
    console.error('Download token generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
