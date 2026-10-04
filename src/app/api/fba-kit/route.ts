export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { SCHOOL_FA_KIT_SOURCE } from "@/lib/school-fa-kit";
import { startTransformationNurture } from "@/lib/transformation-nurture";

function cleanString(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    if (cleanString(payload.faxNumber, 200)) {
      return NextResponse.json({ error: "Unable to save your email. Please try again." }, { status: 400 });
    }

    const email = cleanString(payload.email, 200).toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const name = cleanString(payload.name, 120);
    if (name.length < 2) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }

    const role = cleanString(payload.role, 80);

    await startTransformationNurture({
      email,
      name,
      role: role || undefined,
      source: SCHOOL_FA_KIT_SOURCE,
      tags: ["lead-magnet", SCHOOL_FA_KIT_SOURCE, "school-bcba", "transformation-program"],
      notes: "Requested the free School FA starter kit at /fba.",
      metadata: {
        page: "/fba",
        resource: SCHOOL_FA_KIT_SOURCE,
      },
    });

    return NextResponse.json({ ok: true, download: true });
  } catch (error) {
    console.error("School FA kit signup failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Unable to save your email. Please try again." },
      { status: 500 },
    );
  }
}
