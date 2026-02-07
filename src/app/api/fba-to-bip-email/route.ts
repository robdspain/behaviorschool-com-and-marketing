import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export async function POST(request: Request) {
  try {
    const { email, timestamp } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Simple file-based storage — replace with a proper DB or email service later
    const dataDir = join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    const logPath = join(dataDir, "fba-to-bip-emails.jsonl");
    await appendFile(logPath, JSON.stringify({ email, timestamp, source: "fba-to-bip" }) + "\n");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
