export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';
import type { CourseSectionFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/sections/[id]
 * Get section by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const section = await getConvexClient().query(api.masterclassAdmin.getSection, { id: idParam });

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error('Section GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/masterclass/sections/[id]
 * Update section
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    const body = (await request.json()) as Partial<CourseSectionFormData>;

    const section = await getConvexClient().mutation(api.masterclassAdmin.updateSection, {
      id: idParam,
      title: body.title,
      description: body.description,
      videoUrl: body.video_url,
      duration: body.duration,
      orderIndex: body.order_index,
      isActive: body.is_active,
    });

    return NextResponse.json({
      success: true,
      data: section,
      message: 'Section updated successfully',
    });
  } catch (error) {
    console.error('Section PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/masterclass/sections/[id]
 * Delete section (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: idParam } = await params;
    await getConvexClient().mutation(api.masterclassAdmin.deleteSection, { id: idParam });

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    console.error('Section DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
