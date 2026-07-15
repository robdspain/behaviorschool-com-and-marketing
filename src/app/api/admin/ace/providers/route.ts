export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type ProviderRow = {
  _id: string;
  providerName: string;
  providerType: "individual" | "organization";
  bacbProviderNumber?: string;
  coordinatorId: string;
  coordinatorYearsCertified: number;
  coordinatorCertificationDate?: number;
  coordinatorCertificationExpires?: number;
  coordinatorCertificationVerified?: boolean;
  primaryEmail: string;
  primaryPhone?: string;
  website?: string;
  applicationDate?: number;
  approvalDate?: number;
  expirationDate?: number;
  isActive: boolean;
  applicationFeePaid: boolean;
  applicationFeeAmount?: number;
  applicationFeePaidDate?: number;
  renewalFeePaid: boolean;
  lastRenewalDate?: number;
  nextRenewalDate?: number;
  gracePeriodEndDate?: number;
  reinstatementDate?: number;
  lateFeePaid?: boolean;
  lateFeeAmount?: number;
  lateFeePaidDate?: number;
  canPublishEvents?: boolean;
  canIssueCertificates?: boolean;
  lapseStartDate?: number;
  lapseEndDate?: number;
  ein?: string;
  incorporationDocUrl?: string;
  legalEntityVerified?: boolean;
  legalEntityVerifiedAt?: number;
  leadershipAttestationUrl?: string;
  leadershipName?: string;
  leadershipTitle?: string;
  createdAt: number;
  updatedAt: number;
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

function toProviderRow(provider: ProviderRow | null) {
  if (!provider) return null;
  return {
    id: provider._id,
    provider_name: provider.providerName,
    provider_type: provider.providerType,
    bacb_provider_number: provider.bacbProviderNumber ?? null,
    coordinator_id: provider.coordinatorId,
    coordinator_years_certified: provider.coordinatorYearsCertified,
    coordinator_certification_date: isoDate(provider.coordinatorCertificationDate),
    coordinator_certification_expires: isoDate(provider.coordinatorCertificationExpires),
    coordinator_certification_verified: provider.coordinatorCertificationVerified ?? false,
    primary_email: provider.primaryEmail,
    primary_phone: provider.primaryPhone ?? null,
    website: provider.website ?? null,
    application_date: isoDate(provider.applicationDate),
    approval_date: isoDate(provider.approvalDate),
    expiration_date: isoDate(provider.expirationDate),
    is_active: provider.isActive,
    application_fee_paid: provider.applicationFeePaid,
    application_fee_amount: provider.applicationFeeAmount ?? null,
    application_fee_paid_date: isoDate(provider.applicationFeePaidDate),
    renewal_fee_paid: provider.renewalFeePaid,
    last_renewal_date: isoDate(provider.lastRenewalDate),
    next_renewal_date: isoDate(provider.nextRenewalDate),
    grace_period_end_date: isoDate(provider.gracePeriodEndDate),
    reinstatement_date: isoDate(provider.reinstatementDate),
    late_fee_paid: provider.lateFeePaid ?? false,
    late_fee_amount: provider.lateFeeAmount ?? null,
    late_fee_paid_date: isoDate(provider.lateFeePaidDate),
    can_publish_events: provider.canPublishEvents ?? true,
    can_issue_certificates: provider.canIssueCertificates ?? true,
    lapse_start_date: isoDate(provider.lapseStartDate),
    lapse_end_date: isoDate(provider.lapseEndDate),
    ein: provider.ein ?? null,
    incorporation_doc_url: provider.incorporationDocUrl ?? null,
    legal_entity_verified: provider.legalEntityVerified ?? false,
    legal_entity_verified_at: isoDate(provider.legalEntityVerifiedAt),
    leadership_attestation_url: provider.leadershipAttestationUrl ?? null,
    leadership_name: provider.leadershipName ?? null,
    leadership_title: provider.leadershipTitle ?? null,
    created_at: isoDate(provider.createdAt),
    updated_at: isoDate(provider.updatedAt),
  };
}

async function resolveCoordinatorId(client: ReturnType<typeof getConvexClient>, body: any) {
  if (body.coordinator_id) return body.coordinator_id as Id<"aceUsers">;

  const email = String(body.coordinator_email || "").trim().toLowerCase();
  const firstName = String(body.coordinator_first_name || "").trim();
  const lastName = String(body.coordinator_last_name || "").trim();

  if (!email || !firstName || !lastName) {
    throw new Error("Coordinator first name, last name, and email are required");
  }

  const existing = await client.query(api.aceUsers.getByEmail, { email });
  if (existing) return existing._id as Id<"aceUsers">;

  return client.mutation(api.aceUsers.create, {
    email,
    firstName,
    lastName,
    role: "ace_coordinator",
    bacbId: body.coordinator_bacb_id || undefined,
    credentialType: "bcba",
    credentialNumber: body.coordinator_bacb_id || undefined,
    credentialVerified: body.coordinator_certification_verified ?? false,
    isActive: true,
  }) as Promise<Id<"aceUsers">>;
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const data = await getConvexClient().query(api.aceProviders.getAll, {});
    return NextResponse.json({ success: true, data: data.map(toProviderRow) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    if (!body.provider_name || !body.provider_type || !body.primary_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = getConvexClient();
    const coordinatorId = await resolveCoordinatorId(client, body);
    const id = await client.mutation(api.aceProviders.create, {
      providerName: body.provider_name,
      providerType: body.provider_type,
      coordinatorId,
      coordinatorYearsCertified: Number(body.coordinator_years_certified),
      primaryEmail: body.primary_email,
      primaryPhone: body.primary_phone || undefined,
      website: body.website || undefined,
      bacbProviderNumber: body.bacb_provider_number || undefined,
      coordinatorCertificationDate: parseDate(body.coordinator_certification_date),
      coordinatorCertificationExpires: parseDate(body.coordinator_certification_expires),
      coordinatorCertificationVerified: body.coordinator_certification_verified ?? false,
      ein: body.ein || undefined,
      leadershipName: body.leadership_name || undefined,
      leadershipTitle: body.leadership_title || undefined,
    });
    const data = await client.query(api.aceProviders.getById, { id });
    return NextResponse.json({ success: true, data: toProviderRow(data) }, { status: 201 });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create provider" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Missing provider ID" }, { status: 400 });

    const data = await getConvexClient().mutation(api.aceProviders.update, {
      id: body.id as Id<"aceProviders">,
      providerName: body.provider_name,
      providerType: body.provider_type,
      bacbProviderNumber: body.bacb_provider_number,
      coordinatorYearsCertified: body.coordinator_years_certified ? Number(body.coordinator_years_certified) : undefined,
      coordinatorCertificationDate: parseDate(body.coordinator_certification_date),
      coordinatorCertificationExpires: parseDate(body.coordinator_certification_expires),
      coordinatorCertificationVerified: body.coordinator_certification_verified,
      primaryEmail: body.primary_email,
      primaryPhone: body.primary_phone,
      website: body.website,
      ein: body.ein,
      leadershipName: body.leadership_name,
      leadershipTitle: body.leadership_title,
      canPublishEvents: body.can_publish_events,
      canIssueCertificates: body.can_issue_certificates,
      isActive: body.is_active,
    });

    return NextResponse.json({ success: true, data: toProviderRow(data) }, { status: 200 });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update provider" },
      { status: 500 }
    );
  }
}
