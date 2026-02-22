import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/providers/[id]
 * Get a single provider by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();

    const provider = await client.query(api.aceProviders.getById, {
      id: id as Id<'aceProviders'>,
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      provider,
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/providers/[id]
 * Update a provider
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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

    // Extract only the fields that the update mutation accepts
    const updateData: Record<string, unknown> = {
      id: id as Id<'aceProviders'>,
    };

    const allowedFields = [
      'providerName',
      'primaryEmail',
      'primaryPhone',
      'website',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'zipCode',
      'isActive',
      'canPublishEvents',
      'canIssueCertificates',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    await client.mutation(api.aceProviders.update, updateData as {
      id: Id<'aceProviders'>;
      providerName?: string;
      primaryEmail?: string;
      primaryPhone?: string;
      website?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      isActive?: boolean;
      canPublishEvents?: boolean;
      canIssueCertificates?: boolean;
    });

    // Fetch the updated provider
    const updated = await client.query(api.aceProviders.getById, {
      id: id as Id<'aceProviders'>,
    });

    return NextResponse.json({
      success: true,
      provider: updated,
      message: 'Provider updated successfully',
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ace/providers/[id]
 * Soft-delete a provider by setting isActive=false
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Soft delete by deactivating
    await client.mutation(api.aceProviders.update, {
      id: id as Id<'aceProviders'>,
      isActive: false,
      canPublishEvents: false,
      canIssueCertificates: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Provider deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating provider:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate provider' },
      { status: 500 }
    );
  }
}
