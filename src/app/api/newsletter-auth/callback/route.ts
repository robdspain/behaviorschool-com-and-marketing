import { NextRequest, NextResponse } from "next/server";
import { parseSetCookieHeader } from "better-auth/cookies";
import { makeNewsletterAuthGrant } from "@/lib/adminSession";

export const dynamic = "force-dynamic";
const behaviorSchoolOrigin = "https://behaviorschool.com";
const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("ott");
  const destination = new URL("/admin/newsletter", behaviorSchoolOrigin);

  if (!token || !/^[A-Za-z0-9_-]{16,256}$/.test(token)) {
    destination.searchParams.set("newsletterAuthError", "callback");
    return NextResponse.redirect(destination);
  }

  const verification = await fetch(
    `${newsletterAuthUrl}/api/auth/cross-domain/one-time-token/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: behaviorSchoolOrigin,
        "Better-Auth-Cookie": "",
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    },
  );
  const verificationPayload = await verification.json().catch(() => null);
  const setCookie =
    verification.headers.get("set-better-auth-cookie") ||
    verification.headers.get("set-cookie");

  if (!verification.ok || !verificationPayload?.session?.token || !setCookie) {
    destination.searchParams.set("newsletterAuthError", "verify");
    return NextResponse.redirect(destination);
  }

  const authCookie = [...parseSetCookieHeader(setCookie).entries()]
    .map(([name, cookie]) => `${name}=${cookie.value}`)
    .join("; ");
  if (!authCookie) {
    destination.searchParams.set("newsletterAuthError", "verify");
    return NextResponse.redirect(destination);
  }

  destination.searchParams.set(
    "newsletterGrant",
    makeNewsletterAuthGrant(authCookie),
  );
  return NextResponse.redirect(destination);
}
