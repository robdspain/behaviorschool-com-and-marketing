export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";

function toDiscoveryRow(row: any) {
  const contact = row.contact;
  return {
    id: row._id,
    contact_id: row.contactId,
    contact_name: contact ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") : "Unknown Contact",
    email: contact?.email ?? "",
    role: row.role,
    school_setting_notes: row.schoolSettingNotes,
    call_date_time: row.callDateTime,
    fit_assessment: row.fitAssessment,
    program_discussed: row.programDiscussed,
    payment_option_discussed: row.paymentOptionDiscussed,
    next_step: row.nextStep,
    checkout_link: row.checkoutLink ?? null,
    follow_up_status: row.followUpStatus,
    follow_up_task_id: row.followUpTaskId ?? null,
    follow_up_email_log_id: row.followUpEmailLogId ?? null,
    deal_id: row.dealId ?? null,
    task_status: row.task?.status ?? null,
    deal_value: row.deal?.value ?? null,
    deal_stage: row.deal?.stage ?? null,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const rows = await getConvexClient().query(api.crm.listDiscoveryCalls, { limit: 100 });
    return NextResponse.json(rows.map(toDiscoveryRow), { status: 200 });
  } catch (error) {
    console.error("Error fetching discovery calls:", error);
    return NextResponse.json({ message: "Failed to fetch discovery calls" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const required = [
      "firstName",
      "lastName",
      "email",
      "role",
      "schoolSettingNotes",
      "callDateTime",
      "fitAssessment",
      "programDiscussed",
      "paymentOptionDiscussed",
      "nextStep",
    ];
    const missing = required.filter((field) => !body[field]);
    if (missing.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await getConvexClient().mutation(api.crm.logDiscoveryCall, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      role: body.role,
      schoolSettingNotes: body.schoolSettingNotes,
      callDateTime: body.callDateTime,
      fitAssessment: body.fitAssessment,
      programDiscussed: body.programDiscussed,
      paymentOptionDiscussed: body.paymentOptionDiscussed,
      nextStep: body.nextStep,
      checkoutLink: body.checkoutLink || undefined,
      expectedCloseDate: body.expectedCloseDate || undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error logging discovery call:", error);
    return NextResponse.json({ message: "Failed to log discovery call" }, { status: 500 });
  }
}
