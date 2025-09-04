import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to download.' },
        { status: 401 }
      );
    }

    // Verify the token with Supabase
    const supabase = createSupabaseAdminClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication. Please sign in again.' },
        { status: 401 }
      );
    }

    // Log the download for analytics
    console.log(`ACT Matrix PDF downloaded by user: ${user.email}`);
    
    // You can optionally track downloads in your database
    try {
      await supabase
        .from('downloads')
        .insert({
          user_id: user.id,
          user_email: user.email,
          resource: 'act-matrix',
          downloaded_at: new Date().toISOString()
        });
    } catch (dbError) {
      // Log error but don't fail the download
      console.error('Error logging download:', dbError);
    }

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