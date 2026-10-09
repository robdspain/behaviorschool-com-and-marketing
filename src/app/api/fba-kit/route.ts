export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { hasResendKey, SCHOOL_FA_KIT_PAGE_PATH, SCHOOL_FA_KIT_SOURCE } from "@/lib/school-fa-kit";
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
    const resendReady = hasResendKey({ RESEND_API_KEY: process.env.RESEND_API_KEY });
    if (!resendReady) {
      console.error(
        "School FA kit: RESEND_API_KEY is not set. The lead is saved and the kit email stays queued for the hourly nurture worker.",
      );
    }

    await startTransformationNurture({
      email,
      name,
      role: role || undefined,
      source: SCHOOL_FA_KIT_SOURCE,
      tags: ["lead-magnet", SCHOOL_FA_KIT_SOURCE, "school-bcba", "transformation-program"],
      notes: `Requested the free School FA starter kit at ${SCHOOL_FA_KIT_PAGE_PATH}.`,
      metadata: {
        page: SCHOOL_FA_KIT_PAGE_PATH,
        resource: SCHOOL_FA_KIT_SOURCE,
      },
      sendDueNow: resendReady,
    });

    return NextResponse.json({ ok: true, download: true, emailQueued: resendReady });
  } catch (error) {
    console.error("School FA kit signup failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Unable to save your email. Please try again." },
      { status: 500 },
    );
  }
}
