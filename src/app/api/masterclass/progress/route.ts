export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import {
  getEnrollmentProgress,
  markVideoComplete,
  saveQuizResults,
  saveQuizResponses,
  getNextAttemptNumber,
  calculateProgress,
  canGenerateCertificate,
  markEnrollmentComplete,
} from '@/lib/masterclass/queries';
import { getQuizForSection } from '@/lib/masterclass/config';

/**
 * GET /api/masterclass/progress?enrollmentId=xxx
 *
 * Get progress for an enrollment
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const enrollmentId = searchParams.get('enrollmentId');

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'enrollmentId is required' },
        { status: 400 }
      );
    }

    // Get all progress
    const progress = await getEnrollmentProgress(enrollmentId);
    const overallProgress = await calculateProgress(enrollmentId);
    const canGenerate = await canGenerateCertificate(enrollmentId);

    return NextResponse.json({
      success: true,
      data: {
        sections: progress,
        overallProgress,
        canGenerateCertificate: canGenerate,
      },
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/masterclass/progress
 *
 * Update progress (video or quiz)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, sectionNumber, type, data } = body;

    if (!enrollmentId || !sectionNumber || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'video') {
      // Mark video as complete
      await markVideoComplete(enrollmentId, sectionNumber);

      return NextResponse.json({
        success: true,
        message: 'Video marked as complete',
      });
    } else if (type === 'quiz') {
      // Validate quiz submission
      const { answers } = data;

      if (!Array.isArray(answers)) {
        return NextResponse.json(
          { success: false, error: 'Answers must be an array' },
          { status: 400 }
        );
      }

      // Get correct answers for this section
      const quizQuestions = getQuizForSection(sectionNumber);

      if (answers.length !== quizQuestions.length) {
        return NextResponse.json(
          { success: false, error: 'Answer count mismatch' },
          { status: 400 }
        );
      }

      // Calculate score
      const results = answers.map((answer, index) => {
        const question = quizQuestions[index];
        const isCorrect = answer === question.correctAnswer;

        return {
          questionId: question.id,
          questionNumber: index + 1,
          selected: answer,
          correct: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        };
      });

      const score = results.filter(r => r.isCorrect).length;
      const total = quizQuestions.length;
      const passed = score === total; // Must get 100%

      // Get attempt number
      const attemptNumber = await getNextAttemptNumber(enrollmentId, sectionNumber);

      // Save quiz results
      await saveQuizResults(
        enrollmentId,
        sectionNumber,
        score,
        total,
        passed,
        attemptNumber
      );

      // Save individual responses for analytics
      await saveQuizResponses(
        enrollmentId,
        sectionNumber,
        attemptNumber,
        results.map(r => ({
          questionId: r.questionId,
          questionNumber: r.questionNumber,
          selectedAnswer: r.selected,
          correctAnswer: r.correct,
          isCorrect: r.isCorrect,
        }))
      );

      // Check if this completes the entire course
      if (passed) {
        const canGenerate = await canGenerateCertificate(enrollmentId);
        if (canGenerate) {
          await markEnrollmentComplete(enrollmentId);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          results,
          score,
          total,
          passed,
          attemptNumber,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
