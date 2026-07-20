export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { startTransformationNurture } from "@/lib/transformation-nurture";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = cleanString(body?.email, 320).toLowerCase();

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const source = cleanString(body?.source, 120) || "transformation_nurture";
    const result = await startTransformationNurture({
      email,
      name: cleanString(body?.name, 200) || undefined,
      firstName: cleanString(body?.firstName, 120) || undefined,
      lastName: cleanString(body?.lastName, 120) || undefined,
      phone: cleanString(body?.phone, 80) || undefined,
      organization: cleanString(body?.organization || body?.district, 200) || undefined,
      role: cleanString(body?.role, 200) || undefined,
      source,
      tags: Array.isArray(body?.tags)
        ? body.tags.map((tag: unknown) => cleanString(tag, 80)).filter(Boolean)
        : ["transformation-program"],
      notes: cleanString(body?.notes, 2000) || undefined,
      metadata: {
        page: cleanString(body?.page, 400) || request.headers.get("referer"),
        requestedPacket: body?.requestedPacket === true,
      },
    });

    return NextResponse.json({
      ok: true,
      ...result,
      packetUrl: "/transformation-program-pd-packet.pdf",
      calendlyUrl: "https://calendly.com/robspain/behavior-school-transformation-system-phone-call",
    });
  } catch (error) {
    console.error("Transformation nurture start error:", error);
    return NextResponse.json({ error: "Unable to start follow-up sequence" }, { status: 500 });
  }
}
