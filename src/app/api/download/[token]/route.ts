export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { downloadTokens } from '@/lib/download-tokens';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const tokenData = downloadTokens.get(token);
  
  if (!tokenData) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
  }

  if (tokenData.expires < Date.now()) {
    downloadTokens.delete(token);
    return NextResponse.json({ error: 'Token expired' }, { status: 410 });
  }

  if (tokenData.used) {
    return NextResponse.json({ error: 'Token already used' }, { status: 410 });
  }

  // Mark token as used (one-time use)
  tokenData.used = true;

  try {
    // Map resource names to file paths
    const resourceFiles: { [key: string]: string } = {
      'bcba-study-guide': 'bcba-study-guide-test.pdf',
      'iep-behavior-goals': 'iep-behavior-goals-guide.pdf',
      'school-behavior-support': 'school-behavior-support-guide.pdf'
    };

    const fileName = resourceFiles[tokenData.resource];
    if (!fileName) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const filePath = join(process.cwd(), 'private', 'downloads', fileName);
    
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = readFileSync(filePath);
    
    // Set appropriate headers for PDF download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Length', fileBuffer.length.toString());
    
    // Security headers
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    return new NextResponse(fileBuffer, { headers });

  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}

