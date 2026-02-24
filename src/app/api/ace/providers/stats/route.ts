import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/providers/stats?provider_id=xxx
 * Get dashboard statistics for a provider
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider_id' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    const dashboard = await client.query(api.aceProviders.getDashboard, {
      providerId: providerId as Id<'aceProviders'>,
    });

    if (!dashboard) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    const stats = {
      total_events: dashboard.stats.totalEvents,
      active_events: dashboard.stats.activeEvents,
      total_registrations: dashboard.stats.totalRegistrations,
      total_certificates_issued: dashboard.stats.totalCertificates,
      total_ceus_issued: dashboard.stats.totalCEUsIssued,
    };

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider statistics' },
      { status: 500 }
    );
  }
}
