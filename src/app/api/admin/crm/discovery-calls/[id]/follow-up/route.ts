export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.recipient || !body.subject || !body.checkoutLink) {
      return NextResponse.json(
        { message: "Recipient, subject, and checkout link are required" },
        { status: 400 }
      );
    }

    const result = await getConvexClient().mutation(api.crm.logCheckoutFollowUpSent, {
      discoveryCallId: id,
      recipient: body.recipient,
      subject: body.subject,
      checkoutLink: body.checkoutLink,
      sentAt: body.sentAt || undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error logging checkout follow-up:", error);
    return NextResponse.json({ message: "Failed to log checkout follow-up" }, { status: 500 });
  }
}
