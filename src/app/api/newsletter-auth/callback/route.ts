import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const behaviorSchoolOrigin = "https://behaviorschool.com";
const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
const newsletterSessionCookie = "bs_newsletter_session";

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
  const sessionToken = verificationPayload?.session?.token;

  if (!verification.ok || !sessionToken) {
    destination.searchParams.set("newsletterAuthError", "verify");
    return NextResponse.redirect(destination);
  }

  const response = NextResponse.redirect(destination);
  response.cookies.set(
    newsletterSessionCookie,
    Buffer.from(sessionToken).toString("base64url"),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
  return response;
}
