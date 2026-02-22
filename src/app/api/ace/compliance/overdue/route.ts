import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/compliance/overdue
 * Get all overdue items for a provider
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: provider_id' },
        { status: 400 }
      );
    }

    const typedProviderId = providerId as Id<'aceProviders'>;

    // Fetch all overdue items in parallel
    const [certificates, feedback, complaints] = await Promise.all([
      client.query(api.aceCompliance.getOverdueCertificates, {
        providerId: typedProviderId,
      }),
      client.query(api.aceCompliance.getOverdueFeedback, {
        providerId: typedProviderId,
      }),
      client.query(api.aceCompliance.getOverdueComplaints, {
        providerId: typedProviderId,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        certificates,
        feedback,
        complaints,
        totalOverdue:
          certificates.length + feedback.length + complaints.length,
      },
    });
  } catch (error) {
    console.error('Error fetching overdue items:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch overdue items';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
