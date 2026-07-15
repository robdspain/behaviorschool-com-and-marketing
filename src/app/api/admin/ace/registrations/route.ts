export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { recordRequestAuditEvent } from "@/lib/audit-log";

type RegistrationRow = {
  _id: string;
  eventId: string;
  participantId: string;
  confirmationCode: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancellationDate?: number;
  cancellationReason?: string;
  feeAmount?: number;
  feePaid: boolean;
  paymentDate?: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  credentialType?: string;
  attendanceVerified: boolean;
  quizCompleted: boolean;
  feedbackCompleted: boolean;
  certificateIssued: boolean;
  createdAt: number;
  updatedAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    credentialType?: string;
    credentialNumber?: string;
    bacbId?: string;
  } | null;
  event?: {
    _id: string;
    title: string;
    eventType?: string;
    startDate: number;
    totalCeus: number;
  } | null;
};

function isoDateTime(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : null;
}

function toRegistrationRow(row: RegistrationRow | null) {
  if (!row) return null;
  return {
    id: row._id,
    event_id: row.eventId,
    user_id: row.participantId,
    participant_id: row.participantId,
    confirmation_code: row.confirmationCode,
    status: row.status,
    is_confirmed: row.status === "confirmed" || row.status === "completed",
    is_cancelled: row.status === "cancelled",
    cancellation_date: isoDateTime(row.cancellationDate),
    cancellation_reason: row.cancellationReason ?? null,
    fee_amount: row.feeAmount ?? 0,
    payment_amount: row.feeAmount ?? 0,
    fee_paid: row.feePaid,
    payment_date: isoDateTime(row.paymentDate),
    stripe_session_id: row.stripeSessionId ?? null,
    stripe_payment_intent_id: row.stripePaymentIntentId ?? null,
    credential_type: row.credentialType ?? null,
    attendance_verified: row.attendanceVerified,
    quiz_completed: row.quizCompleted,
    feedback_completed: row.feedbackCompleted,
    certificate_issued: row.certificateIssued,
    created_at: isoDateTime(row.createdAt),
    updated_at: isoDateTime(row.updatedAt),
    user: row.participant
      ? {
          id: row.participant._id,
          first_name: row.participant.firstName,
          last_name: row.participant.lastName,
          email: row.participant.email,
          credential_type: row.participant.credentialType ?? null,
          credential_number: row.participant.credentialNumber ?? row.participant.bacbId ?? null,
        }
      : null,
    event: row.event
      ? {
          id: row.event._id,
          title: row.event.title,
          event_type: row.event.eventType ?? "ce",
          start_date: isoDateTime(row.event.startDate),
          total_ceus: row.event.totalCeus,
        }
      : null,
  };
}

/**
 * GET /api/admin/ace/registrations
 * Fetch all registrations or registrations for a specific event.
 */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");
    const rows = eventId
      ? await getConvexClient().query(api.aceRegistrations.getByEvent, {
          eventId: eventId as Id<"aceEvents">,
          includeAllStatuses: true,
        })
      : await getConvexClient().query(api.aceRegistrations.getAll, {});

    await recordRequestAuditEvent(request, {
      category: "student_data",
      actionType: "read",
      resource: "ace_registrations",
      status: "success",
      metadata: { eventId, rowCount: rows.length },
    });

    return NextResponse.json({ data: rows.map(toRegistrationRow) });
  } catch (error) {
    console.error("Error in GET /api/admin/ace/registrations:", error);
    await recordRequestAuditEvent(request, {
      category: "student_data",
      actionType: "read",
      resource: "ace_registrations",
      status: "failure",
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/ace/registrations
 * Create a new admin-confirmed registration with CE/PD eligibility validation.
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const eventId = body.event_id;
    const userId = body.user_id ?? body.participant_id;

    if (!eventId || !userId) {
      return NextResponse.json({ error: "event_id and user_id are required" }, { status: 400 });
    }

    const result = await getConvexClient().mutation(api.aceRegistrations.register, {
      eventId: eventId as Id<"aceEvents">,
      participantId: userId as Id<"aceUsers">,
      credentialType: body.credential_type || undefined,
      adminConfirmed: true,
    });

    if (!result.success) {
      await recordRequestAuditEvent(request, {
        category: "admin_action",
        actionType: "create",
        resource: "ace_registrations",
        status: "failure",
        metadata: { event_id: eventId, user_id: userId, error: result.error },
      });
      return NextResponse.json(
        {
          error: result.error,
          requiresCredentialVerification: result.requiresCredentialVerification,
        },
        { status: result.requiresCredentialVerification ? 403 : 400 }
      );
    }

    const registration = await getConvexClient().query(api.aceRegistrations.getById, {
      id: result.registrationId as Id<"aceRegistrations">,
    });

    await recordRequestAuditEvent(request, {
      category: "admin_action",
      actionType: "create",
      resource: "ace_registrations",
      resourceId: String(result.registrationId),
      status: "success",
      metadata: { event_id: eventId, user_id: userId },
    });

    return NextResponse.json({ data: toRegistrationRow(registration) }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/ace/registrations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/ace/registrations
 * Cancel a registration.
 */
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("id");

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    await getConvexClient().mutation(api.aceRegistrations.cancel, {
      id: registrationId as Id<"aceRegistrations">,
      reason: "Admin cancelled",
    });

    await recordRequestAuditEvent(request, {
      category: "admin_action",
      actionType: "update",
      resource: "ace_registrations",
      resourceId: String(registrationId),
      status: "success",
      metadata: { cancelled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/ace/registrations:", error);
    await recordRequestAuditEvent(request, {
      category: "admin_action",
      actionType: "update",
      resource: "ace_registrations",
      status: "failure",
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
