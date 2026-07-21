export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processTransformationNurture } from "@/lib/transformation-nurture";

function getEnv(name: string) {
  if (typeof globalThis.process === "undefined") return undefined;
  return globalThis.process.env?.[name];
}

function isAuthorized(request: NextRequest) {
  const secret = getEnv("TRANSFORMATION_NURTURE_SECRET");
  if (!secret) return true;
  return request.headers.get("x-transformation-nurture-secret") === secret;
}

async function processRequest(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processTransformationNurture({ limit: 50 });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Transformation nurture processor failed", error);
    return NextResponse.json(
      { error: "Transformation nurture processor failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return processRequest(request);
}

export async function POST(request: NextRequest) {
  return processRequest(request);
}
