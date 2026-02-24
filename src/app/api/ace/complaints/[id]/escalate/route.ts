import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ace/complaints/[id]/escalate
 * Escalate a complaint to BACB
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const { id } = params;
    const body = await request.json();

    const { resolved_by, resolution_notes } = body;

    // First verify the complaint exists
    const complaint = await client.query(api.aceComplaints.getById, {
      id: id as Id<"aceComplaints">,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Check if already escalated
    if (complaint.status === 'escalated_to_bacb') {
      return NextResponse.json(
        { error: 'Complaint has already been escalated to BACB' },
        { status: 400 }
      );
    }

    // Update status to escalated
    const result = await client.mutation(api.aceComplaints.updateStatus, {
      id: id as Id<"aceComplaints">,
      status: 'escalated_to_bacb',
      resolutionNotes:
        resolution_notes ||
        'Escalated to BACB - Notice of Alleged Violation (NAV) process initiated.',
      resolvedBy: resolved_by
        ? (resolved_by as Id<"aceUsers">)
        : undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        message:
          'Complaint has been escalated to BACB. A Notice of Alleged Violation (NAV) has been noted.',
        nav_info: {
          description:
            'The BACB Notice of Alleged Violation (NAV) process has been initiated. The complainant and provider will be notified.',
          bacb_complaint_url:
            'https://www.bacb.com/ethics-information/reporting-to-the-bacb/',
        },
      },
    });
  } catch (error) {
    console.error('Error escalating complaint:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to escalate complaint';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
