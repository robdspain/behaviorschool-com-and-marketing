import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";
const behaviorSchoolOrigin = "https://behaviorschool.com";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyNewsletterAuth(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;
  const authPath = path.join("/");
  const allowedPaths = new Set([
    "sign-in/social",
    "get-session",
    "cross-domain/one-time-token/verify",
    "convex/token",
    "sign-out",
  ]);
  if (!allowedPaths.has(authPath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestOrigin = request.headers.get("origin");
  if (
    requestOrigin &&
    requestOrigin !== behaviorSchoolOrigin &&
    requestOrigin !== "https://www.behaviorschool.com"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetUrl = new URL(
    `/api/auth/${path.map(encodeURIComponent).join("/")}`,
    newsletterAuthUrl,
  );
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers({
    Accept: request.headers.get("accept") || "application/json",
    Origin: behaviorSchoolOrigin,
  });
  const contentType = request.headers.get("content-type");
  const authCookie = request.headers.get("better-auth-cookie");
  const authorization = request.headers.get("authorization");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Better-Auth-Cookie", authCookie || "");
  if (authorization) headers.set("Authorization", authorization);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    redirect: "manual",
    cache: "no-store",
  });

  const outgoingHeaders = new Headers();
  for (const name of [
    "content-type",
    "location",
    "set-better-auth-cookie",
  ]) {
    const value = response.headers.get(name);
    if (value) outgoingHeaders.set(name, value);
  }
  if (!outgoingHeaders.has("set-better-auth-cookie")) {
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      outgoingHeaders.set("set-better-auth-cookie", setCookie);
    }
  }
  outgoingHeaders.set("Cache-Control", "no-store");

  return new NextResponse(response.body, {
    status: response.status,
    headers: outgoingHeaders,
  });
}

export const GET = proxyNewsletterAuth;
export const POST = proxyNewsletterAuth;
