import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/certificates/[id]
 * Get a single certificate by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const { id } = params;

    const certificate = await client.query(api.aceCertificates.getById, {
      id: id as Id<"aceCertificates">,
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/certificates/[id]
 * Update a certificate (revoke, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const { id } = params;
    const body = await request.json();

    const { action, reason, revokedBy, status } = body;

    if (action === 'revoke') {
      if (!reason) {
        return NextResponse.json(
          { error: 'Revocation reason is required' },
          { status: 400 }
        );
      }

      const updated = await client.mutation(api.aceCertificates.update, {
        id: id as Id<"aceCertificates">,
        status: 'revoked',
        revocationReason: reason,
        revokedBy: revokedBy || 'admin',
      });

      return NextResponse.json({ success: true, data: updated });
    }

    if (status) {
      const updated = await client.mutation(api.aceCertificates.update, {
        id: id as Id<"aceCertificates">,
        status,
      });

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { error: 'Invalid update. Provide action or status.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating certificate:', error);
    const message = error instanceof Error ? error.message : 'Failed to update certificate';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
