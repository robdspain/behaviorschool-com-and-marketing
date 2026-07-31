import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const behaviorSchoolOrigin = "https://behaviorschool.com";

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("ott");
  const destination = new URL("/admin/newsletter", behaviorSchoolOrigin);

  if (token && /^[A-Za-z0-9_-]{16,256}$/.test(token)) {
    destination.searchParams.set("newsletterOtt", token);
  } else {
    destination.searchParams.set("newsletterAuthError", "callback");
  }

  return NextResponse.redirect(destination);
}
