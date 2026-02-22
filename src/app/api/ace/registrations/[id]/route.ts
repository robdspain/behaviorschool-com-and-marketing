import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/registrations/[id]
 * Get registration details with event and participant info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();

    const registration = await client.query(api.aceRegistrations.getById, {
      id: id as Id<'aceRegistrations'>,
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Get registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/registrations/[id]
 * Update registration (status, completion flags)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = getConvexClient();

    // Check registration exists
    const existing = await client.query(api.aceRegistrations.getById, {
      id: id as Id<'aceRegistrations'>,
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Handle status update
    if (body.status) {
      if (body.status === 'cancelled') {
        await client.mutation(api.aceRegistrations.cancel, {
          id: id as Id<'aceRegistrations'>,
        });
      } else {
        await client.mutation(api.aceRegistrations.updateStatus, {
          id: id as Id<'aceRegistrations'>,
          status: body.status,
        });
      }
    }

    // Handle completion flag updates
    const completionUpdates: Record<string, boolean> = {};
    if (body.attendanceVerified !== undefined) {
      completionUpdates.attendanceVerified = body.attendanceVerified;
    }
    if (body.quizCompleted !== undefined) {
      completionUpdates.quizCompleted = body.quizCompleted;
    }
    if (body.feedbackCompleted !== undefined) {
      completionUpdates.feedbackCompleted = body.feedbackCompleted;
    }
    if (body.certificateIssued !== undefined) {
      completionUpdates.certificateIssued = body.certificateIssued;
    }

    if (Object.keys(completionUpdates).length > 0) {
      await client.mutation(api.aceRegistrations.updateCompletion, {
        id: id as Id<'aceRegistrations'>,
        ...completionUpdates,
      });
    }

    // Fetch updated registration
    const updated = await client.query(api.aceRegistrations.getById, {
      id: id as Id<'aceRegistrations'>,
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
