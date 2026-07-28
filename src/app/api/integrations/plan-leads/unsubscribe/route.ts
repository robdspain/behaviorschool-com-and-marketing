export const dynamic = "force-dynamic";

import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/lib/convex-newsletter";

function isAuthorized(request: NextRequest) {
  const expected = process.env.PLAN_LEAD_WEBHOOK_SECRET;
  const provided = request.headers.get("x-plan-lead-secret");
  if (!expected || !provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    await unsubscribeFromNewsletter(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to unsubscribe Plan lead:", error);
    return NextResponse.json({ error: "Unable to update email preferences" }, { status: 500 });
  }
}
