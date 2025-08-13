import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80).optional().or(z.literal("")),
  company: z.string().max(0).optional(),
})

// Simple in-memory token bucket keyed by ip. Resets periodically.
// Note: In serverless, this may not persist across invocations; good enough as a minimal guard.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const ipToHits: Map<string, { count: number; windowStart: number }> = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipToHits.get(ip)
  if (!entry) {
    ipToHits.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipToHits.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  const { email, name, company } = parsed.data
  if (company && company.length > 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const endpoint = process.env.MAILGUN_ENDPOINT
  if (!endpoint) {
    return NextResponse.json({ error: "Service misconfigured" }, { status: 500 })
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined, ip }),
      // Prevent hanging too long
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json({ error: text || "Upstream error" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to reach email service" }, { status: 502 })
  }
}


