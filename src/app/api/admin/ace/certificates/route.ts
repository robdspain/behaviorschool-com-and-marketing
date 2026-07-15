export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type CertificateRow = {
  _id: string;
  eventId: string;
  participantId: string;
  providerId?: string;
  certificateNumber: string;
  participantName: string;
  participantEmail: string;
  participantBacbId?: string;
  eventTitle: string;
  eventDate: string;
  instructorName: string;
  providerName?: string;
  providerNumber?: string;
  totalCeus: number;
  ceCategory: string;
  status: "pending" | "issued" | "revoked";
  certificateUrl?: string;
  issuedAt?: number;
  revokedAt?: number;
  revokedBy?: string;
  revocationReason?: string;
  createdAt: number;
};

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : null;
}

function toCertificateRow(certificate: CertificateRow) {
  return {
    id: certificate._id,
    event_id: certificate.eventId,
    participant_id: certificate.participantId,
    provider_id: certificate.providerId ?? null,
    certificate_number: certificate.certificateNumber,
    participant_name: certificate.participantName,
    participant_email: certificate.participantEmail,
    participant_bacb_id: certificate.participantBacbId ?? null,
    event_title: certificate.eventTitle,
    event_date: certificate.eventDate,
    instructor_name: certificate.instructorName,
    provider_name: certificate.providerName ?? null,
    provider_number: certificate.providerNumber ?? null,
    total_ceus: certificate.totalCeus,
    ce_category: certificate.ceCategory,
    status: certificate.status,
    certificate_url: certificate.certificateUrl ?? null,
    issued_at: isoDate(certificate.issuedAt),
    revoked_at: isoDate(certificate.revokedAt),
    revoked_by: certificate.revokedBy ?? null,
    revocation_reason: certificate.revocationReason ?? null,
    created_at: isoDate(certificate.createdAt),
  };
}

// GET /api/admin/ace/certificates?event_id=xxx - Get certificates for an event
// GET /api/admin/ace/certificates?participant_id=xxx - Get certificates for a participant
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");
    const participantId = searchParams.get("participant_id");
    const client = getConvexClient();

    let data: CertificateRow[];
    if (eventId) {
      data = await client.query(api.aceCertificates.getByEvent, {
        eventId: eventId as Id<"aceEvents">,
      });
    } else if (participantId) {
      data = await client.query(api.aceCertificates.getByParticipant, {
        participantId: participantId as Id<"aceUsers">,
      });
    } else {
      data = await client.query(api.aceCertificates.getAll, {});
    }

    return NextResponse.json({ data: data.map(toCertificateRow) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/certificates - Generate a certificate
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

    const client = getConvexClient();
    const id = await client.mutation(api.aceCertificates.issue, {
      eventId: body.event_id as Id<"aceEvents">,
      participantId: body.participant_id as Id<"aceUsers">,
      instructorName: typeof body.instructor_name === "string" ? body.instructor_name : undefined,
    });

    const certificate = await client.query(api.aceCertificates.getById, { id });
    if (!certificate) {
      return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
    }

    return NextResponse.json({ data: toCertificateRow(certificate) }, { status: 201 });
  } catch (error) {
    console.error("Error generating certificate:", error);
    const message = error instanceof Error ? error.message : "Failed to generate certificate";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/admin/ace/certificates?id=xxx - Revoke a certificate
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const data = await getConvexClient().mutation(api.aceCertificates.update, {
      id: id as Id<"aceCertificates">,
      status: "revoked",
    });

    if (!data) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Certificate revoked successfully", data: toCertificateRow(data) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return NextResponse.json(
      { error: "Failed to revoke certificate" },
      { status: 500 }
    );
  }
}
