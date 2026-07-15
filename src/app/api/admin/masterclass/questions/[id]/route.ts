export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';
import type { QuizQuestionFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/questions/[id]
 * Get question by ID
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
    const question = await getConvexClient().query(api.masterclassAdmin.getQuestion, { id: idParam });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Question GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/masterclass/questions/[id]
 * Update question
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
    const body = (await request.json()) as Partial<QuizQuestionFormData>;

    // Validate correct_answer if provided
    if (body.correct_answer !== undefined && (body.correct_answer < 0 || body.correct_answer > 3)) {
      return NextResponse.json(
        { success: false, error: 'correct_answer must be between 0 and 3' },
        { status: 400 }
      );
    }

    const question = await getConvexClient().mutation(api.masterclassAdmin.updateQuestion, {
      id: idParam,
      questionText: body.question_text,
      optionA: body.option_a,
      optionB: body.option_b,
      optionC: body.option_c,
      optionD: body.option_d,
      correctAnswer: body.correct_answer,
      explanation: body.explanation,
      isActive: body.is_active,
    });

    return NextResponse.json({
      success: true,
      data: question,
      message: 'Question updated successfully',
    });
  } catch (error) {
    console.error('Question PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/masterclass/questions/[id]
 * Delete question (soft delete)
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
    await getConvexClient().mutation(api.masterclassAdmin.deleteQuestion, { id: idParam });

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Question DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
