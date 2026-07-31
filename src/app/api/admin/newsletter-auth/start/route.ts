import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";

export const dynamic = "force-dynamic";

const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const callbackURL = new URL("/admin/newsletter", request.url).toString();
  const response = await fetch(`${newsletterAuthUrl}/api/auth/sign-in/social`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "google",
      callbackURL,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.url) {
    const retryUrl = new URL("/admin/newsletter", request.url);
    retryUrl.searchParams.set("newsletterAuthError", "start");
    return NextResponse.redirect(retryUrl);
  }

  return NextResponse.redirect(payload.url);
}
