export const dynamic = "force-dynamic";

import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { subscribeToNewsletter } from "@/lib/convex-newsletter";

function isAuthorized(request: NextRequest) {
  const expected = process.env.PLAN_LEAD_WEBHOOK_SECRET;
  const provided = request.headers.get("x-plan-lead-secret");
  if (!expected || !provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function nameFromEmail(email: string) {
  return email.split("@")[0].replace(/[._-]+/g, " ").trim() || "Plan lead";
}

/** Receives opted-in leads from plan.behaviorschool.com. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const tags = Array.from(new Set([
      "plan.behaviorschool.com",
      "free-tool",
      "iep-goals",
      "early-access",
      ...(Array.isArray(body?.tags) ? body.tags.filter((tag: unknown) => typeof tag === "string").map((tag: string) => tag.slice(0, 80)) : []),
    ]));
    const name = nameFromEmail(email);
    const client = getConvexClient();
    await client.mutation(api.crm.upsertContact, {
      firstName: name,
      email,
      status: "lead",
      leadSource: "plan-free-iep-goal-builder",
      tags,
      notes: "Opted in through the BehaviorSchool Pro Free IEP Goal Assistant.",
      revenue: 0,
    });
    await subscribeToNewsletter({
      email,
      name,
      source: "plan-free-iep-goal-builder",
      page: "https://plan.behaviorschool.com/free-iep-goal-builder",
      tags,
      status: "subscribed",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to ingest Plan lead:", error);
    return NextResponse.json({ error: "Unable to ingest lead" }, { status: 500 });
  }
}
