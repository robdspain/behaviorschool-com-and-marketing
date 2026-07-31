import { NextRequest, NextResponse } from "next/server";
import { parseSetCookieHeader } from "better-auth/cookies";
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
    console.info("Newsletter access token", { stage: "cookie", found: false });
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  let sessionToken: string;
  try {
    sessionToken = Buffer.from(encodedCookie, "base64url").toString("utf8");
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
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
      { error: "Newsletter session expired" },
      { status: 401 },
    );
    failure.cookies.delete(newsletterSessionCookie);
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
