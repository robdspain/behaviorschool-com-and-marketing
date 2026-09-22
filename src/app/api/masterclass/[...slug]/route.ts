import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function retiredMasterclassResponse(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: "masterclass_retired",
      message:
        "The public masterclass has been retired. Use /ceus or https://learning.behaviorschool.com.",
    },
    {
      status: 410,
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}

export function GET(): NextResponse {
  return retiredMasterclassResponse();
}

export function POST(): NextResponse {
  return retiredMasterclassResponse();
}

export function PUT(): NextResponse {
  return retiredMasterclassResponse();
}

export function PATCH(): NextResponse {
  return retiredMasterclassResponse();
}

export function DELETE(): NextResponse {
  return retiredMasterclassResponse();
}
