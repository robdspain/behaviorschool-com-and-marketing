export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';
import type { CourseSectionFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/sections
 * Get all course sections (for admin)
 */
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const sections = await getConvexClient().query(api.masterclassAdmin.listSections, {});

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error('Sections GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/masterclass/sections
 * Create new course section
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CourseSectionFormData;

    // Validate required fields
    if (!body.title || !body.description || !body.video_url || !body.duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const section = await getConvexClient().mutation(api.masterclassAdmin.createSection, {
      sectionNumber: body.section_number,
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
      message: 'Section created successfully',
    });
  } catch (error) {
    console.error('Section POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/masterclass/sections
 * Reorder sections
 */
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sectionIds } = body;

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid section order data' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.masterclassAdmin.reorderSections, { sectionIds });

    return NextResponse.json({
      success: true,
      message: 'Sections reordered successfully',
    });
  } catch (error) {
    console.error('Section reorder error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder sections' },
      { status: 500 }
    );
  }
}
