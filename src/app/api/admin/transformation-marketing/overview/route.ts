import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";
import { callNewsletterConvex, getRobSpainNewsletterDashboard } from "@/lib/newsletter-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const [crm, robSpain, behaviorSchool] = await Promise.all([
    getConvexClient().query(api.transformationMarketing.summary, { limit: 1000 }),
    getRobSpainNewsletterDashboard().catch(() => null),
    callNewsletterConvex<Record<string, unknown>>("query", "weeklyNewsletter:subscriberReadinessForAdmin").catch(() => null),
  ]);

  const robSpainConfirmed = Number(robSpain?.audience?.subscribed ?? 0);
  const readiness = behaviorSchool && typeof behaviorSchool === "object" ? behaviorSchool : null;
  const safeRecipientCount = readiness && "safeRecipientCount" in readiness
    ? Number(readiness.safeRecipientCount ?? 0)
    : robSpainConfirmed;

  return NextResponse.json({
    ok: true,
    crm,
    newsletter: {
      confirmedRecipients: robSpainConfirmed,
      safeRecipientCount,
      source: behaviorSchool ? "Behavior School newsletter readiness" : "RobSpain.com newsletter audience",
      available: Boolean(robSpain || behaviorSchool),
    },
  });
}
