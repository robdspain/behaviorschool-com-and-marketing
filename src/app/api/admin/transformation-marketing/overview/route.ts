import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import { getRobSpainNewsletterDashboard } from "@/lib/newsletter-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const [crm, robSpain] = await Promise.all([
    getConvexClient().query(api.transformationMarketing.summary, { limit: 1000 }),
    getRobSpainNewsletterDashboard().catch(() => null),
  ]);

  const robSpainConfirmed = Number(robSpain?.audience?.subscribed ?? 0);

  return NextResponse.json({
    ok: true,
    crm,
    newsletter: {
      confirmedRecipients: robSpainConfirmed,
      safeRecipientCount: robSpainConfirmed,
      source: "Canonical RobSpain.com newsletter audience",
      available: Boolean(robSpain),
    },
  });
}
