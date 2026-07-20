export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processTransformationNurture } from "@/lib/transformation-nurture";

function isAuthorized(request: NextRequest) {
  const secret = process.env.TRANSFORMATION_NURTURE_SECRET;
  if (!secret) return true;
  return request.headers.get("x-transformation-nurture-secret") === secret;
}

async function process(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processTransformationNurture({ limit: 50 });
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return process(request);
}

export async function POST(request: NextRequest) {
  return process(request);
}
