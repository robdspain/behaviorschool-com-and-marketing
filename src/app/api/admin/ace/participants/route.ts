export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

type AceUserRow = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  bacbId?: string;
  role: string;
  credentialType?: string;
  credentialNumber?: string;
  credentialVerified?: boolean;
  credentialVerifiedAt?: number;
  credentialExpiresAt?: number;
  phone?: string;
  organization?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
};

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString()
    : undefined;
}

function toParticipantRow(user: AceUserRow | null) {
  if (!user) return null;

  return {
    id: user._id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    bacb_id: user.bacbId ?? null,
    role: user.role,
    credential_type: user.credentialType ?? null,
    credential_number: user.credentialNumber ?? null,
    credential_verified: user.credentialVerified ?? false,
    credential_verified_at: isoDate(user.credentialVerifiedAt) ?? null,
    credential_expires_at: isoDate(user.credentialExpiresAt) ?? null,
    is_active: user.isActive,
    phone: user.phone ?? null,
    organization: user.organization ?? null,
    created_at: isoDate(user.createdAt),
    updated_at: isoDate(user.updatedAt),
    last_login_at: isoDate(user.lastLoginAt) ?? null,
  };
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const data = await getConvexClient().query(api.aceUsers.listByRole, {
      role: "participant",
      limit: 500,
    });

    return NextResponse.json({ data: data.map(toParticipantRow) });
  } catch (error) {
    console.error("Error in GET /api/admin/ace/participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const userId = body.user_id || body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const credentialVerified = body.credential_verified ?? body.credentialVerified;
    const credentialVerifiedAt = parseDate(body.credential_verified_at ?? body.credentialVerifiedAt);
    const credentialExpiresAt = parseDate(body.credential_expires_at ?? body.credentialExpiresAt);

    const data = await getConvexClient().mutation(api.aceUsers.updateParticipantCredential, {
      id: userId as Id<"aceUsers">,
      credentialType: body.credential_type ?? body.credentialType,
      credentialNumber: body.credential_number ?? body.credentialNumber,
      credentialVerified,
      credentialVerifiedAt,
      clearCredentialVerifiedAt: credentialVerified === false || body.credential_verified_at === null,
      credentialExpiresAt,
      clearCredentialExpiresAt: body.credential_expires_at === null,
    });

    return NextResponse.json({ data: toParticipantRow(data) });
  } catch (error) {
    console.error("Error in PATCH /api/admin/ace/participants:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const firstName = body.first_name ?? body.firstName;
    const lastName = body.last_name ?? body.lastName;
    const email = body.email;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "first_name, last_name, and email are required" },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const existingUser = await client.query(api.aceUsers.getByEmail, {
      email: String(email).toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const id = await client.mutation(api.aceUsers.create, {
      firstName,
      lastName,
      email,
      role: "participant",
      credentialType: body.credential_type ?? body.credentialType ?? "pending",
      credentialNumber: body.credential_number ?? body.credentialNumber,
      phone: body.phone || undefined,
      organization: body.organization || undefined,
      isActive: true,
    });
    const created = await client.query(api.aceUsers.getById, { id });

    return NextResponse.json({ data: toParticipantRow(created) }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/ace/participants:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
