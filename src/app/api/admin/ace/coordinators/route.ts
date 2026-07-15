export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type CoordinatorRow = {
  _id: string;
  providerName: string;
  coordinatorYearsCertified: number;
  coordinatorCertificationDate?: number;
  coordinatorCertificationExpires?: number;
  coordinatorCertificationVerified?: boolean;
  canPublishEvents?: boolean;
  canIssueCertificates?: boolean;
  isActive: boolean;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorBacbId: string;
};

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString().split("T")[0]
    : "";
}

function toCoordinator(row: CoordinatorRow) {
  return {
    id: row._id,
    provider_id: row._id,
    provider_name: row.providerName,
    coordinator_name: row.coordinatorName,
    coordinator_email: row.coordinatorEmail,
    certification_number: row.coordinatorBacbId,
    certification_date: isoDate(row.coordinatorCertificationDate),
    certification_expires: isoDate(row.coordinatorCertificationExpires),
    certification_verified: row.coordinatorCertificationVerified ?? false,
    years_certified: row.coordinatorYearsCertified,
    is_active: row.isActive,
    can_publish_events: row.canPublishEvents ?? true,
    can_issue_certificates: row.canIssueCertificates ?? true,
  };
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const rows = await getConvexClient().query(api.aceProviders.listCoordinatorStatuses, {
      activeOnly: true,
    });
    return NextResponse.json({ data: rows.map(toCoordinator) });
  } catch (error) {
    console.error("Error in GET /api/admin/ace/coordinators:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const providerId = body.coordinator_id || body.provider_id;
    if (!providerId) {
      return NextResponse.json(
        { error: "coordinator_id (provider_id) is required" },
        { status: 400 }
      );
    }

    const data = await getConvexClient().mutation(api.aceProviders.updateCoordinatorStatus, {
      providerId: providerId as Id<"aceProviders">,
      coordinatorCertificationVerified: body.certification_verified,
      coordinatorCertificationDate: parseDate(body.certification_date),
      coordinatorCertificationExpires: parseDate(body.certification_expires),
      canPublishEvents: body.can_publish_events,
      canIssueCertificates: body.can_issue_certificates,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in PATCH /api/admin/ace/coordinators:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
