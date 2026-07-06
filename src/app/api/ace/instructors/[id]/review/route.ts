import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, notes, reviewerId } = body;

    // Validate required fields
    if (!action || !reviewerId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, reviewerId' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !notes) {
      return NextResponse.json(
        { error: 'Notes are required when rejecting a qualification' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Verify qualification exists
    const qualification = await client.query(api.aceInstructors.getById, {
      id: id as Id<"aceInstructorQualifications">,
    });

    if (!qualification) {
      return NextResponse.json(
        { error: 'Instructor qualification not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      await client.mutation(api.aceInstructors.approve, {
        id: id as Id<"aceInstructorQualifications">,
        verifiedBy: reviewerId as Id<"aceUsers">,
        notes,
      });
    } else {
      await client.mutation(api.aceInstructors.reject, {
        id: id as Id<"aceInstructorQualifications">,
        verifiedBy: reviewerId as Id<"aceUsers">,
        notes,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Instructor qualification ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Review instructor qualification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
