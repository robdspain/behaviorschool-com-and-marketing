export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? "",
    lastName: parts.join(" "),
  };
}

function cleanString(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = (body?.email || "").toString().trim().toLowerCase();

    if (!rawEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const nameFromEmail = rawEmail.split("@")[0]?.replace(/[._-]+/g, " ");
    const resolvedName = (body?.name || body?.firstName || "").toString().trim() || nameFromEmail || "Lead";
    const { firstName, lastName } = splitName(resolvedName);
    const tags = Array.isArray(body?.tags)
      ? body.tags.map((tag: unknown) => cleanString(tag, 80)).filter(Boolean)
      : body?.tags
        ? [cleanString(body.tags, 80)]
        : ["lead-magnet"];

    await getConvexClient().mutation(api.crm.upsertContact, {
      firstName,
      lastName,
      email: rawEmail,
      role: cleanString(body?.role, 200) || undefined,
      status: "lead",
      leadSource: cleanString(body?.source, 120) || "website",
      tags: tags.length ? tags : ["lead-magnet"],
      notes: cleanString(body?.notes, 2000) || undefined,
      revenue: 0,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in POST /api/lead-magnet:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
