import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// 1x1 GIF
const GIF = Buffer.from(
  'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
)

export async function GET(_: Request, { params }: { params: Promise<{ cid: string; sid: string }> }) {
  const { cid, sid } = await params;
  try {
    const listmonkUrl = process.env.LISTMONK_URL;
    const listmonkUsername = process.env.LISTMONK_USERNAME;
    const listmonkPassword = process.env.LISTMONK_PASSWORD;

    if (listmonkUrl && listmonkUsername && listmonkPassword) {
      const authHeader = `Basic ${Buffer.from(`${listmonkUsername}:${listmonkPassword}`).toString('base64')}`;
      
      // Fire-and-forget pixel tracking request to Listmonk backend (if endpoint exists/supports it)
      // Or just ignore if listmonk handles it natively via image src
      // This route is typically used if we are proxying the tracking pixel
      // Listmonk pixel usually looks like /campaign/OPEN/CID/SID
      
      fetch(`${listmonkUrl}/api/public/campaign/${cid}/${sid}/open`, {
        method: 'GET',
        headers: { 'Authorization': authHeader }
      }).catch(err => console.error('Failed to proxy tracking pixel', err));
    }

    // Return a 1x1 transparent GIF
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    return new NextResponse(pixel as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Tracking pixel error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

