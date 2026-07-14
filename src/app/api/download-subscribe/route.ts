export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';
import { upsertListmonkSubscriber, getListmonkConfig } from '@/lib/listmonk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, resource, source, name } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!resource || !source) {
      return NextResponse.json(
        { error: 'Resource and source are required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const id = await getConvexClient().mutation(api.downloads.createDownloadSubmission, {
      email,
      name: name || undefined,
      resource,
      source,
      userAgent,
      ipAddress: ip,
    });

    // Log the subscription for immediate visibility
    console.log('📥 NEW DOWNLOAD SUBSCRIPTION:', {
      id,
      email: email,
      resource: resource,
      source: source,
      timestamp: new Date().toLocaleString(),
      message: 'User subscribed for download access'
    });

    // Try to add to Listmonk as well (non-blocking)
    try {
      if (getListmonkConfig()) {
        const listId = Number(process.env.LISTMONK_DOWNLOAD_LIST_ID || process.env.LISTMONK_DEFAULT_LIST_ID || 1);
        const lmRes = await upsertListmonkSubscriber({
          email,
          name: name || '',
          lists: [listId],
          attribs: { source, resource },
          preconfirm: true,
        });
        if (!lmRes.ok) {
          console.warn('Download-Subscribe: Listmonk upsert failed or skipped:', lmRes.status, lmRes.body);
        }
      }
    } catch (lmErr) {
      console.warn('Download-Subscribe: Listmonk integration error:', lmErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription recorded successfully',
      id
    });

  } catch (error) {
    console.error('Download subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
