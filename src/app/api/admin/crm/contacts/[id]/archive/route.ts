export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await getConvexClient().mutation(api.crm.archiveContact, { id });
    return NextResponse.json({ message: "Contact archived successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error archiving contact:", error);
    return NextResponse.json({ message: "Failed to archive contact" }, { status: 500 });
  }
}
