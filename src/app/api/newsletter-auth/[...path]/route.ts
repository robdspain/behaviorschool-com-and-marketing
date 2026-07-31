import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";

export const dynamic = "force-dynamic";

const newsletterAuthUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_CONVEX_SITE_URL ||
  "https://modest-malamute-868.convex.site";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyNewsletterAuth(
  request: NextRequest,
  context: RouteContext,
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const { path } = await context.params;
  const targetUrl = new URL(
    `/api/auth/${path.map(encodeURIComponent).join("/")}`,
    newsletterAuthUrl,
  );
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers({
    Accept: request.headers.get("accept") || "application/json",
    Origin: request.nextUrl.origin,
  });
  const contentType = request.headers.get("content-type");
  const authCookie = request.headers.get("better-auth-cookie");
  const authorization = request.headers.get("authorization");
  if (contentType) headers.set("Content-Type", contentType);
  if (authCookie !== null) headers.set("Better-Auth-Cookie", authCookie);
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
  outgoingHeaders.set("Cache-Control", "no-store");

  return new NextResponse(response.body, {
    status: response.status,
    headers: outgoingHeaders,
  });
}

export const GET = proxyNewsletterAuth;
export const POST = proxyNewsletterAuth;
