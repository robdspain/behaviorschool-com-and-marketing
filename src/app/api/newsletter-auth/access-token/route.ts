import { NextRequest, NextResponse } from "next/server";
import { readNewsletterAuthGrant } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

const behaviorSchoolOrigin = "https://behaviorschool.com";
const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    grant?: string;
  } | null;
  const authCookie = readNewsletterAuthGrant(body?.grant);
  if (!authCookie) {
    return NextResponse.json(
      { error: "Not connected", code: "invalid_grant" },
      { status: 401 },
    );
  }

  const response = await fetch(`${newsletterAuthUrl}/api/auth/convex/token`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Origin: behaviorSchoolOrigin,
      "Better-Auth-Cookie": authCookie,
    },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.token) {
    const failure = NextResponse.json(
      {
        error: "Newsletter session expired",
        code: `token_exchange_${response.status}`,
      },
      { status: 401 },
    );
    return failure;
  }

  return NextResponse.json(
    { token: payload.token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
