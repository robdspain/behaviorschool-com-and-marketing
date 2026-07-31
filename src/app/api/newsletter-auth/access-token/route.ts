import { NextRequest, NextResponse } from "next/server";
import { parseSetCookieHeader } from "better-auth/cookies";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { readNewsletterAuthGrant } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

const behaviorSchoolOrigin = "https://behaviorschool.com";
const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => null)) as {
    grant?: string;
  } | null;
  const sessionToken = readNewsletterAuthGrant(body?.grant);
  if (!sessionToken) {
    return NextResponse.json(
      { error: "Not connected", code: "invalid_grant" },
      { status: 401 },
    );
  }

  const sessionResponse = await fetch(
    `${newsletterAuthUrl}/api/auth/get-session`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionToken}`,
        Origin: behaviorSchoolOrigin,
        "Better-Auth-Cookie": "",
      },
      cache: "no-store",
    },
  );
  const setCookie =
    sessionResponse.headers.get("set-better-auth-cookie") ||
    sessionResponse.headers.get("set-cookie");
  console.info("Newsletter access token", {
    stage: "session",
    status: sessionResponse.status,
    hasSetCookie: Boolean(setCookie),
  });
  if (!sessionResponse.ok || !setCookie) {
    const failure = NextResponse.json(
      {
        error: "Newsletter session expired",
        code: `session_exchange_${sessionResponse.status}_${setCookie ? "cookie" : "no_cookie"}`,
      },
      { status: 401 },
    );
    return failure;
  }

  const parsedCookies = parseSetCookieHeader(setCookie);
  const parsedCookieNames = [...parsedCookies.keys()];
  const cookieHeader = [...parsedCookies.entries()]
    .map(([name, cookie]) => `${name}=${cookie.value}`)
    .join("; ");

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
  console.info("Newsletter access token", {
    stage: "convex-token",
    status: response.status,
    hasToken: Boolean(payload?.token),
    parsedCookieNames,
  });

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
