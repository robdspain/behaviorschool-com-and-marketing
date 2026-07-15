export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type ComplaintRow = {
  _id: string;
  providerId: string;
  eventId?: string;
  submitterName: string;
  submitterEmail: string;
  submitterBacbId?: string;
  submitterPhone?: string;
  complaintText: string;
  status: "submitted" | "under_review" | "resolved" | "escalated_to_bacb";
  resolutionNotes?: string;
  resolvedAt?: number;
  responseDueDate?: number;
  navEscalationNotified?: boolean;
  navEscalationNotifiedAt?: number;
  navNotificationMethod?: string;
  submittedAt: number;
  createdAt: number;
  updatedAt: number;
};

function parseDate(value: unknown) {
  if (value === null) return null;
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

function toComplaintRow(complaint: ComplaintRow | null) {
  if (!complaint) return null;
  return {
    id: complaint._id,
    provider_id: complaint.providerId,
    event_id: complaint.eventId ?? null,
    submitter_name: complaint.submitterName,
    submitter_email: complaint.submitterEmail,
    submitter_bacb_id: complaint.submitterBacbId ?? null,
    submitter_phone: complaint.submitterPhone ?? null,
    complaint_text: complaint.complaintText,
    status: complaint.status,
    resolution_notes: complaint.resolutionNotes ?? null,
    resolved_at: isoDateTime(complaint.resolvedAt),
    response_due_date: isoDate(complaint.responseDueDate),
    is_overdue: Boolean(
      complaint.responseDueDate
      && complaint.responseDueDate < Date.now()
      && !complaint.resolvedAt
    ),
    nav_escalation_notified: complaint.navEscalationNotified ?? false,
    nav_escalation_notified_at: isoDateTime(complaint.navEscalationNotifiedAt),
    nav_notification_method: complaint.navNotificationMethod ?? null,
    submitted_at: isoDateTime(complaint.submittedAt),
    created_at: isoDateTime(complaint.createdAt),
    updated_at: isoDateTime(complaint.updatedAt),
  };
}

// GET /api/admin/ace/complaints - List all complaints
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("provider_id");
    const data = await getConvexClient().query(api.aceComplaints.list, {
      ...(providerId ? { providerId: providerId as Id<"aceProviders"> } : {}),
    });

    return NextResponse.json(
      { success: true, data: data.map(toComplaintRow) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

// POST /api/admin/ace/complaints - Create a new complaint
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.submitter_name || !body.submitter_email || !body.complaint_text || !body.provider_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = await getConvexClient().mutation(api.aceComplaints.create, {
      providerId: body.provider_id as Id<"aceProviders">,
      eventId: body.event_id ? body.event_id as Id<"aceEvents"> : undefined,
      submitterName: String(body.submitter_name),
      submitterEmail: String(body.submitter_email),
      submitterBacbId: body.submitter_bacb_id ? String(body.submitter_bacb_id) : undefined,
      submitterPhone: body.submitter_phone ? String(body.submitter_phone) : undefined,
      complaintText: String(body.complaint_text),
    });

    return NextResponse.json({ success: true, data: toComplaintRow(data) }, { status: 201 });
  } catch (error) {
    console.error("Error creating complaint:", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}

// PATCH /api/admin/ace/complaints - Update a complaint
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.complaint_id) {
      return NextResponse.json({ error: "Missing complaint_id" }, { status: 400 });
    }

    const resolvedAt = parseDate(body.resolved_at);
    const navEscalationNotifiedAt = parseDate(body.nav_escalation_notified_at);
    const data = await getConvexClient().mutation(api.aceComplaints.update, {
      id: body.complaint_id as Id<"aceComplaints">,
      status: body.status || undefined,
      resolutionNotes: body.resolution_notes ?? undefined,
      resolvedAt: resolvedAt ?? undefined,
      clearResolvedAt: body.resolved_at === null,
      navEscalationNotified: body.nav_escalation_notified ?? undefined,
      navEscalationNotifiedAt: navEscalationNotifiedAt ?? undefined,
      navNotificationMethod: body.nav_notification_method ?? undefined,
    });

    return NextResponse.json({ success: true, data: toComplaintRow(data) }, { status: 200 });
  } catch (error) {
    console.error("Error updating complaint:", error);
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}
