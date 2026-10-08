import { NextRequest, NextResponse } from "next/server";
import {
  clientIpFromHeaders,
  createResendW9Mailer,
  getW9RateLimitStore,
  loadPrivateW9Pdf,
  logW9Lead,
  processW9Request,
  recordW9Request,
} from "@/lib/w9-request";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Enter your name, work email, and organization." },
      { status: 400 },
    );
  }

  const result = await processW9Request({
    input,
    ip: clientIpFromHeaders(request.headers),
    origin: request.headers.get("origin"),
    loadPdf: loadPrivateW9Pdf,
    rateLimitStore: await getW9RateLimitStore(),
    mailer: createResendW9Mailer(),
    logLead: logW9Lead,
    recordRequest: recordW9Request,
  });

  return NextResponse.json(result.body, { status: result.status });
}
