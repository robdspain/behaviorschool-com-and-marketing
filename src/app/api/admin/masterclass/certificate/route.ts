export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveCertificateConfig,
  updateCertificateConfig,
} from '@/lib/masterclass/admin-queries';
import type { CertificateConfigFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/certificate
 * Get active certificate configuration
 */
export async function GET() {
  try {
    const config = await getActiveCertificateConfig();

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'No certificate configuration found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Certificate config GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate configuration' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/masterclass/certificate
 * Update certificate configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CertificateConfigFormData> & { id: number };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Certificate configuration ID is required' },
        { status: 400 }
      );
    }

    const { id, ...configData } = body;
    const config = await updateCertificateConfig(id, configData);

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Certificate configuration updated successfully',
    });
  } catch (error) {
    console.error('Certificate config PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate configuration' },
      { status: 500 }
    );
  }
}
