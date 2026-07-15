export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin-api-session";
import { api, getConvexClient } from "@/lib/convex";

function toContactRow(contact: any) {
  return {
    id: contact._id,
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone ?? null,
    organization: contact.organization ?? null,
    role: contact.role ?? null,
    caseload_size: contact.caseloadSize ?? null,
    status: contact.status,
    lead_source: contact.leadSource ?? null,
    tags: contact.tags ?? [],
    custom_fields: contact.notes ? { notes: contact.notes } : null,
    lead_score: contact.leadScore ?? 0,
    priority: contact.priority ?? "medium",
    created_at: contact.createdAt,
    updated_at: contact.updatedAt,
    last_contacted_at: contact.lastContactedAt ?? null,
    is_archived: contact.isArchived,
  };
}

export async function GET() {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const contacts = await getConvexClient().query(api.crm.listContacts, {});
    return NextResponse.json(contacts.map(toContactRow), { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ message: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      organization,
      role,
      caseloadSize,
      status = "lead",
      leadSource,
      tags,
      notes,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    const id = await client.mutation(api.crm.createContact, {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      organization: organization || undefined,
      role: role || undefined,
      caseloadSize: caseloadSize ? Number(caseloadSize) : undefined,
      status,
      leadSource: leadSource || undefined,
      tags: tags || [],
      notes: notes || undefined,
    });
    const contact = await client.query(api.crm.getContact, { id });
    return NextResponse.json(toContactRow(contact), { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create contact" },
      { status: 500 }
    );
  }
}
