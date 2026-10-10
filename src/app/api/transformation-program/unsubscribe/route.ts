// Implements RFC 8058 one-click unsubscribe for the Transformation nurture emails (GET shows confirmation, POST is one-click).
import { NextRequest } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

export const dynamic = "force-dynamic";

const confirmation = "You are unsubscribed. You will not get more of these emails from Rob.";
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

async function unsubscribe(request: NextRequest, html: boolean) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  try {
    if (/^[a-f0-9]{64}$/.test(token)) {
      await getConvexClient().mutation(api.transformationNurture.unsubscribeByToken, { token });
    }
  } catch {
    // Do not log bearer tokens or claim success when persistence failed.
    return new Response("We could not save your request. Please try again.", {
      status: 503,
      headers: { ...responseHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  // The same response for unknown tokens avoids exposing enrollment information.
  return new Response(html
    ? `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Behavior School | Unsubscribed</title></head><body><main><h1>You are unsubscribed.</h1><p>You will not get more of these emails from Rob.</p></main></body></html>`
    : confirmation, {
    status: 200,
    headers: { ...responseHeaders, "Content-Type": html ? "text/html; charset=utf-8" : "text/plain; charset=utf-8" },
  });
}

export async function GET(request: NextRequest) {
  return unsubscribe(request, true);
}

export async function POST(request: NextRequest) {
  return unsubscribe(request, false);
}
