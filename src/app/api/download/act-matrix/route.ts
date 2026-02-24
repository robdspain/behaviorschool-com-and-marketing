export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(request: NextRequest) {
  try {
    // Log the download for analytics
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
    
    console.log(`ACT Matrix PDF downloaded - IP: ${ip}, User-Agent: ${userAgent}`);
    
    // Note: Email tracking is handled by the /api/download-subscribe endpoint

    // Serve the PDF file from private downloads folder
    const filePath = path.join(process.cwd(), 'private', 'downloads', 'ACT for Schools - Behavior School - Rob Spain.pdf');
    
    try {
      const fileBuffer = await readFile(filePath);
      
      return new NextResponse(fileBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="ACT-Matrix-for-Schools-Guide.pdf"',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError);
      return NextResponse.json(
        { error: 'PDF file not found. Please contact support.' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}