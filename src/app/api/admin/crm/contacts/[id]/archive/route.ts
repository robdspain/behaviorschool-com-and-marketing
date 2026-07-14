export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await getConvexClient().mutation(api.crm.archiveContact, { id });
    return NextResponse.json({ message: "Contact archived successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error archiving contact:", error);
    return NextResponse.json({ message: "Failed to archive contact" }, { status: 500 });
  }
}
