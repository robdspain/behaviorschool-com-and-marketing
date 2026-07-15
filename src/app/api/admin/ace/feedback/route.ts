export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type FeedbackRow = {
  _id: string;
  eventId: string;
  participantId: string;
  rating?: number;
  instructorRating?: number;
  contentRating?: number;
  relevanceRating?: number;
  comments?: string;
  suggestions?: string;
  wouldRecommend?: boolean;
  applicationPlan?: string;
  submittedAt: number;
  coordinatorReviewDueDate?: number;
  coordinatorReviewedAt?: number;
  coordinatorNotes?: string;
  coordinatorActionTaken?: string;
  createdAt: number;
  updatedAt?: number;
  eventTitle?: string | null;
  participantName?: string | null;
  participantEmail?: string | null;
};

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString().split("T")[0]
    : null;
}

function isoDateTime(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : null;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function toFeedbackRow(feedback: FeedbackRow | null) {
  if (!feedback) return null;
  return {
    id: feedback._id,
    event_id: feedback.eventId,
    participant_id: feedback.participantId,
    rating: feedback.rating ?? null,
    instructor_rating: feedback.instructorRating ?? null,
    content_rating: feedback.contentRating ?? null,
    relevance_rating: feedback.relevanceRating ?? null,
    comments: feedback.comments ?? null,
    suggestions: feedback.suggestions ?? null,
    would_recommend: feedback.wouldRecommend ?? null,
    application_plan: feedback.applicationPlan ?? null,
    submitted_at: isoDateTime(feedback.submittedAt),
    coordinator_review_due_date: isoDate(feedback.coordinatorReviewDueDate),
    coordinator_reviewed_at: isoDateTime(feedback.coordinatorReviewedAt),
    coordinator_notes: feedback.coordinatorNotes ?? null,
    coordinator_action_taken: feedback.coordinatorActionTaken ?? null,
    event_title: feedback.eventTitle ?? null,
    participant_name: feedback.participantName ?? null,
    participant_email: feedback.participantEmail ?? null,
    created_at: isoDateTime(feedback.createdAt),
    updated_at: isoDateTime(feedback.updatedAt),
  };
}

// GET /api/admin/ace/feedback - List all feedback responses
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");
    const data = await getConvexClient().query(api.aceFeedback.list, {
      ...(eventId ? { eventId: eventId as Id<"aceEvents"> } : {}),
    });

    return NextResponse.json(
      { success: true, data: data.map(toFeedbackRow) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

// POST /api/admin/ace/feedback - Submit feedback
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.event_id || !body.participant_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await getConvexClient().mutation(api.aceFeedback.create, {
      eventId: body.event_id as Id<"aceEvents">,
      participantId: body.participant_id as Id<"aceUsers">,
      rating: optionalNumber(body.rating),
      instructorRating: optionalNumber(body.instructor_rating),
      contentRating: optionalNumber(body.content_rating),
      relevanceRating: optionalNumber(body.relevance_rating),
      comments: body.comments ? String(body.comments) : undefined,
      suggestions: body.suggestions ? String(body.suggestions) : undefined,
      wouldRecommend: optionalBoolean(body.would_recommend),
      applicationPlan: body.application_plan ? String(body.application_plan) : undefined,
    });

    return NextResponse.json({ success: true, data: toFeedbackRow(data) }, { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

// PATCH /api/admin/ace/feedback - Review feedback
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.feedback_id) {
      return NextResponse.json({ error: "Missing feedback_id" }, { status: 400 });
    }

    const data = await getConvexClient().mutation(api.aceFeedback.review, {
      id: body.feedback_id as Id<"aceFeedbackResponses">,
      coordinatorNotes: body.coordinator_notes ?? undefined,
      coordinatorActionTaken: body.coordinator_action_taken ?? undefined,
      coordinatorReviewedAt: parseDate(body.coordinator_reviewed_at),
    });

    return NextResponse.json({ success: true, data: toFeedbackRow(data) }, { status: 200 });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}
