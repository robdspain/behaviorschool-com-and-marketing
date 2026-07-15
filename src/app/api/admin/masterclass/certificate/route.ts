export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';
import type { CertificateConfigFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/certificate
 * Get active certificate configuration
 */
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const config = await getConvexClient().query(api.masterclassAdmin.getActiveCertificateConfig, {});

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
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<CertificateConfigFormData> & { id?: string | number };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Certificate configuration ID is required' },
        { status: 400 }
      );
    }

    const { id, ...configData } = body;
    const config = await getConvexClient().mutation(api.masterclassAdmin.updateCertificateConfig, {
      id: String(id),
      courseTitle: configData.course_title,
      ceuCredits: configData.ceu_credits,
      bacbProviderNumber: configData.bacb_provider_number,
      certificateSubtitle: configData.certificate_subtitle,
      completionStatement: configData.completion_statement,
      signatureName: configData.signature_name,
      signatureTitle: configData.signature_title,
      organizationName: configData.organization_name,
      organizationWebsite: configData.organization_website,
      introductionVideoUrl: configData.introduction_video_url,
    });

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
