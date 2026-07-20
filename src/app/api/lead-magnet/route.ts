export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { subscribeToNewsletter } from "@/lib/convex-newsletter";
import { startTransformationNurture } from "@/lib/transformation-nurture";

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = (body?.email || "").toString().trim().toLowerCase();

    if (!rawEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
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

    const newsletterResult = await subscribeToNewsletter({
      email: rawEmail,
      name: resolvedName,
      source: "lead-magnet",
      page: cleanString(body?.page, 400) || request.headers.get("referer") || undefined,
      tags: tags.length ? Array.from(new Set(["lead-magnet", ...tags])) : ["lead-magnet"],
      status: "subscribed",
    });

    const transformationIntent = [
      resource,
      body?.source,
      body?.page,
      ...(Array.isArray(body?.tags) ? body.tags : []),
    ].some((value) => {
      const text = typeof value === "string" ? value.toLowerCase() : "";
      return text.includes("transformation")
        || text.includes("district")
        || text.includes("school-bcba")
        || text.includes("school_bcba")
        || text.includes("pd-packet")
        || text.includes("approval");
    });

    if (transformationIntent) {
      try {
        await startTransformationNurture({
          email: rawEmail,
          name: resolvedName,
          role: cleanString(body?.role, 200) || undefined,
          source: `lead_magnet:${resource}`,
          tags: Array.from(new Set(["lead-magnet", "transformation-program", resource, ...tags])),
          notes: `Transformation lead magnet requested: ${resource}.`,
          metadata: {
            resource,
            page: cleanString(body?.page, 400) || request.headers.get("referer"),
          },
        });
      } catch (error) {
        console.error("Unable to start Transformation nurture from lead magnet:", error);
      }
    }

    return NextResponse.json({
      ok: true,
      isNew: newsletterResult.isNew ?? true,
      message: newsletterResult.message,
    });
  } catch (error) {
    console.error("Error in POST /api/lead-magnet:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
