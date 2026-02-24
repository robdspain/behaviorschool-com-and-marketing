export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import {
  getQuestionsBySection,
  createQuestion,
  reorderQuestions,
} from '@/lib/masterclass/admin-queries';
import type { QuizQuestionFormData } from '@/lib/masterclass/admin-types';

/**
 * GET /api/admin/masterclass/questions?sectionNumber=1
 * Get questions for a section
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionNumber = searchParams.get('sectionNumber');

    if (!sectionNumber) {
      return NextResponse.json(
        { success: false, error: 'sectionNumber is required' },
        { status: 400 }
      );
    }

    const questions = await getQuestionsBySection(parseInt(sectionNumber));

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Questions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/masterclass/questions
 * Create new quiz question
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuizQuestionFormData;

    // Validate required fields
    if (
      !body.section_number ||
      !body.question_text ||
      !body.option_a ||
      !body.option_b ||
      !body.option_c ||
      !body.option_d ||
      body.correct_answer === undefined
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate correct_answer is 0-3
    if (body.correct_answer < 0 || body.correct_answer > 3) {
      return NextResponse.json(
        { success: false, error: 'correct_answer must be between 0 and 3' },
        { status: 400 }
      );
    }

    const question = await createQuestion(body);

    return NextResponse.json({
      success: true,
      data: question,
      message: 'Question created successfully',
    });
  } catch (error) {
    console.error('Question POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/masterclass/questions
 * Reorder questions
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionIds } = body;

    if (!Array.isArray(questionIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid question order data' },
        { status: 400 }
      );
    }

    await reorderQuestions(questionIds);

    return NextResponse.json({
      success: true,
      message: 'Questions reordered successfully',
    });
  } catch (error) {
    console.error('Question reorder error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder questions' },
      { status: 500 }
    );
  }
}
