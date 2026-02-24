import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/complaints
 * List complaints with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');
    const status = searchParams.get('status');
    const overdue = searchParams.get('overdue');

    // Get overdue complaints
    if (overdue === 'true' && providerId) {
      const complaints = await client.query(api.aceComplaints.getOverdue, {
        providerId: providerId as Id<"aceProviders">,
      });
      return NextResponse.json({ success: true, data: complaints });
    }

    // Get by status
    if (status) {
      const validStatuses = ['submitted', 'under_review', 'resolved', 'escalated_to_bacb'] as const;
      if (!validStatuses.includes(status as typeof validStatuses[number])) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      const complaints = await client.query(api.aceComplaints.getByStatus, {
        status: status as typeof validStatuses[number],
      });
      return NextResponse.json({ success: true, data: complaints });
    }

    // Get by provider
    if (providerId) {
      const complaints = await client.query(api.aceComplaints.getByProvider, {
        providerId: providerId as Id<"aceProviders">,
      });
      return NextResponse.json({ success: true, data: complaints });
    }

    // Get all complaints
    const complaints = await client.query(api.aceComplaints.getAll, {});
    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/complaints
 * Submit a new complaint (public, no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const client = getConvexClient();
    const body = await request.json();

    const {
      provider_id,
      event_id,
      submitter_name,
      submitter_email,
      submitter_bacb_id,
      submitter_phone,
      complaint_text,
    } = body;

    // Validate required fields
    if (!provider_id || !submitter_name || !submitter_email || !complaint_text) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: provider_id, submitter_name, submitter_email, complaint_text',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submitter_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await client.mutation(api.aceComplaints.submit, {
      providerId: provider_id as Id<"aceProviders">,
      eventId: event_id ? (event_id as Id<"aceEvents">) : undefined,
      submitterName: submitter_name,
      submitterEmail: submitter_email,
      submitterBacbId: submitter_bacb_id || undefined,
      submitterPhone: submitter_phone || undefined,
      complaintText: complaint_text,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          complaint_id: result.complaintId,
          response_due_date: new Date(result.responseDueDate).toISOString(),
          message:
            'Your complaint has been submitted successfully. You will receive a response within 45 days.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting complaint:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to submit complaint';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
