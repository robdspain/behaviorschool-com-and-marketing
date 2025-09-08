import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

// Validate payload subset for member add/update
const MemberSchema = z.object({
  current: z.object({
    email: z.string().email(),
    name: z.string().nullable().optional(),
    id: z.string().optional(),
  }),
});

function normalizeProvidedSignature(value: string): string {
  const lower = value.toLowerCase().trim()
  if (lower.startsWith("sha256=")) {
    return lower.slice("sha256=".length)
  }
  return lower
}

function verifyGhostSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.GHOST_WEBHOOK_SECRET;
  // If no secret is configured, allow the request (verification disabled)
  if (!secret) return true;
  const provided = req.headers.get("x-ghost-signature");
  if (!provided) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody, "utf8").digest("hex");
  const normalized = normalizeProvidedSignature(provided);
  return crypto.timingSafeEqual(Buffer.from(normalized), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  // Optional URL token
  const requiredToken = process.env.GHOST_WEBHOOK_TOKEN
  if (requiredToken) {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")
    if (token !== requiredToken) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }
  // We need the raw body to verify signature
  const raw = await req.text();
  if (!verifyGhostSignature(req, raw)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = MemberSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, name, id } = parsed.data.current;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        { email, name: name ?? null, ghost_member_id: id ?? null },
        { onConflict: "email" }
      );
    if (error) {
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


