export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import type { Id } from "@/lib/convex";

// GET /api/admin/ace/compliance - Get compliance dashboard data
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("provider_id");

    const data = await getConvexClient().query(api.aceCompliance.getAdminDashboard, {
      providerId: providerId ? providerId as Id<"aceProviders"> : undefined,
    });

    return NextResponse.json({
      success: true,
      metrics: data.metrics,
      auditItems: data.auditItems,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching compliance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance data" },
      { status: 500 }
    );
  }
}
