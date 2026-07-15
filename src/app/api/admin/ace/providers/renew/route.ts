export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

function isoDate(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value).toISOString().split("T")[0]
    : null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    if (!body.provider_id) {
      return NextResponse.json({ error: "Missing provider_id" }, { status: 400 });
    }

    const result = await getConvexClient().mutation(api.aceProviders.renew, {
      providerId: body.provider_id as Id<"aceProviders">,
      includeLateFee: body.include_late_fee ?? false,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      renewal: {
        ...result.renewal,
        newExpiration: isoDate(result.renewal.newExpiration),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error renewing provider:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to renew provider" },
      { status: 500 }
    );
  }
}
