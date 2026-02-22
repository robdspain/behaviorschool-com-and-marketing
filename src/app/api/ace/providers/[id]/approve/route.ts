import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ace/providers/[id]/approve
 * Approve a provider application (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const { bacbProviderNumber } = body;

    const client = getConvexClient();

    // Verify the provider exists
    const existing = await client.query(api.aceProviders.getById, {
      id: id as Id<'aceProviders'>,
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Check if already active
    if (existing.isActive) {
      return NextResponse.json(
        { error: 'Provider is already active/approved' },
        { status: 400 }
      );
    }

    // Check if application fee has been paid
    if (!existing.applicationFeePaid) {
      return NextResponse.json(
        { error: 'Application fee must be paid before approval' },
        { status: 400 }
      );
    }

    // Approve the provider
    await client.mutation(api.aceProviders.approve, {
      id: id as Id<'aceProviders'>,
      bacbProviderNumber: bacbProviderNumber || undefined,
    });

    // Fetch the updated provider
    const approved = await client.query(api.aceProviders.getById, {
      id: id as Id<'aceProviders'>,
    });

    return NextResponse.json({
      success: true,
      provider: approved,
      message: 'Provider approved successfully',
    });
  } catch (error) {
    console.error('Error approving provider:', error);
    return NextResponse.json(
      { error: 'Failed to approve provider' },
      { status: 500 }
    );
  }
}
