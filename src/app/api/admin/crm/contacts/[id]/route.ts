export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await getConvexClient().mutation(api.crm.deleteContact, { id });
    return NextResponse.json({ message: "Contact deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ message: "Failed to delete contact" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const contact = await getConvexClient().mutation(api.crm.updateContact, {
      id,
      firstName: body.first_name ?? body.firstName,
      lastName: body.last_name ?? body.lastName,
      email: body.email,
      phone: body.phone,
      organization: body.organization,
      role: body.role,
      caseloadSize: body.caseload_size ?? body.caseloadSize,
      status: body.status,
      leadSource: body.lead_source ?? body.leadSource,
      tags: body.tags,
      notes: body.custom_fields?.notes ?? body.notes,
      leadScore: body.lead_score ?? body.leadScore,
      priority: body.priority,
      lastContactedAt: body.last_contacted_at ?? body.lastContactedAt,
      followUpDate: body.follow_up_date ?? body.followUpDate,
      stripeCustomerId: body.stripe_customer_id ?? body.stripeCustomerId,
      revenue: body.revenue === undefined ? undefined : Number(body.revenue),
    });
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ message: "Failed to update contact" }, { status: 500 });
  }
}
