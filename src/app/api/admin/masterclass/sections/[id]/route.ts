import { NextRequest, NextResponse } from 'next/server';
import {
  getSectionById,
  updateSection,
  deleteSection,
} from '@/lib/masterclass/admin-queries';
import type { CourseSectionFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/sections/[id]
 * Get section by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const section = await getSectionById(id);

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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = (await request.json()) as Partial<CourseSectionFormData>;

    const section = await updateSection(id, body);

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
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await deleteSection(id);

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
