import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";

export const dynamic = "force-dynamic";

const behaviorSchoolOrigin = "https://behaviorschool.com";
const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
const newsletterSessionCookie = "bs_newsletter_session";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const encodedCookie = request.cookies.get(newsletterSessionCookie)?.value;
  if (!encodedCookie) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  let cookieHeader: string;
  try {
    cookieHeader = Buffer.from(encodedCookie, "base64url").toString("utf8");
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const response = await fetch(`${newsletterAuthUrl}/api/auth/convex/token`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Origin: behaviorSchoolOrigin,
      "Better-Auth-Cookie": cookieHeader,
    },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.token) {
    const failure = NextResponse.json(
      { error: "Newsletter session expired" },
      { status: 401 },
    );
    failure.cookies.delete(newsletterSessionCookie);
    return failure;
  }

  return NextResponse.json(
    { token: payload.token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
