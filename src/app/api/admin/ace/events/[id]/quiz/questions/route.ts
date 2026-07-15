export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type QuizQuestion = {
  _id: string;
  quizId: string;
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "multiple_select";
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[];
  explanation?: string;
  points: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

function isoDate(value: number) {
  return new Date(value).toISOString();
}

function toQuestionRow(question: QuizQuestion) {
  return {
    id: question._id,
    quiz_id: question.quizId,
    question_text: question.questionText,
    question_type: question.questionType,
    options: question.options,
    correct_answers: question.correctAnswers,
    explanation: question.explanation ?? null,
    points: question.points,
    order_index: question.orderIndex,
    is_active: question.isActive,
    created_at: isoDate(question.createdAt),
    updated_at: isoDate(question.updatedAt),
  };
}

// GET /api/admin/ace/events/[id]/quiz/questions - Get questions for an event's quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { id: eventId } = await params;
    const client = getConvexClient();

    const quiz = await client.query(api.aceQuizzes.getByEvent, {
      eventId: eventId as Id<"aceEvents">,
    });

    if (!quiz) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const questions = await client.query(api.aceQuizzes.getQuestions, {
      quizId: quiz._id,
    });

    return NextResponse.json(
      { success: true, data: questions.map(toQuestionRow) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz questions" },
      { status: 500 }
    );
  }
}
