import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
const behaviorSchoolOrigin = "https://behaviorschool.com";

export async function GET(request: NextRequest) {
  const callbackURL = new URL(
    "/api/newsletter-auth/callback",
    behaviorSchoolOrigin,
  ).toString();
  const response = await fetch(`${newsletterAuthUrl}/api/auth/sign-in/social`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: behaviorSchoolOrigin,
    },
    body: JSON.stringify({
      provider: "google",
      callbackURL,
      disableRedirect: true,
    }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.url) {
    const retryUrl = new URL("/admin/newsletter", behaviorSchoolOrigin);
    retryUrl.searchParams.set("newsletterAuthError", "start");
    return NextResponse.redirect(retryUrl);
  }

  return NextResponse.redirect(payload.url);
}
