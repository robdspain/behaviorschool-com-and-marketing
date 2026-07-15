export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type AttendanceRow = {
  _id: string;
  eventId: string;
  participantId: string;
  verificationMethod: string;
  verified: boolean;
  verifiedAt?: number;
  verifiedBy?: string;
  signInTimestamp?: number;
  signOutTimestamp?: number;
  verificationCodeEntered?: string;
  verificationCodeTimestamp?: number;
  createdAt: number;
  updatedAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
    credentialNumber?: string;
  } | null;
};

function parseDate(value: unknown) {
  if (value === null) return undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function isoDateTime(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : null;
}

function toAttendanceRow(row: AttendanceRow | null) {
  if (!row) return null;
  return {
    id: row._id,
    event_id: row.eventId,
    participant_id: row.participantId,
    verification_method: row.verificationMethod,
    verified: row.verified,
    verified_at: isoDateTime(row.verifiedAt),
    verified_by: row.verifiedBy ?? null,
    sign_in_timestamp: isoDateTime(row.signInTimestamp),
    sign_out_timestamp: isoDateTime(row.signOutTimestamp),
    verification_code_entered: row.verificationCodeEntered ?? null,
    verification_code_timestamp: isoDateTime(row.verificationCodeTimestamp),
    created_at: isoDateTime(row.createdAt),
    updated_at: isoDateTime(row.updatedAt),
    participant: row.participant
      ? {
          id: row.participant._id,
          first_name: row.participant.firstName,
          last_name: row.participant.lastName,
          email: row.participant.email,
          bacb_id: row.participant.bacbId ?? row.participant.credentialNumber ?? null,
        }
      : null,
  };
}

// GET /api/admin/ace/attendance?event_id=xxx - Get attendance for an event
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");

    if (!eventId) {
      return NextResponse.json({ error: "Missing required parameter: event_id" }, { status: 400 });
    }

    const data = await getConvexClient().query(api.aceAttendance.getByEvent, {
      eventId: eventId as Id<"aceEvents">,
    });

    return NextResponse.json({ data: data.map(toAttendanceRow) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

// POST /api/admin/ace/attendance - Mark attendance
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.event_id || !body.participant_id) {
      return NextResponse.json(
        { error: "Missing required fields: event_id, participant_id" },
        { status: 400 }
      );
    }

    const data = await getConvexClient().mutation(api.aceAttendance.markAttendance, {
      eventId: body.event_id as Id<"aceEvents">,
      participantId: body.participant_id as Id<"aceUsers">,
      verified: body.verified ?? false,
      verificationMethod: "attendance_log",
      signInTimestamp: parseDate(body.sign_in_timestamp),
      signOutTimestamp: parseDate(body.sign_out_timestamp),
      clearSignInTimestamp: body.sign_in_timestamp === null,
      clearSignOutTimestamp: body.sign_out_timestamp === null,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ data: toAttendanceRow(data) }, { status: 200 });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}

// DELETE /api/admin/ace/attendance?id=xxx - Remove attendance record
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
    }

    await getConvexClient().mutation(api.aceAttendance.remove, {
      id: id as Id<"aceAttendanceRecords">,
    });

    return NextResponse.json({ message: "Attendance record deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json({ error: "Failed to delete attendance record" }, { status: 500 });
  }
}
