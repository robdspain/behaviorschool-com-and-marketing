export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";

type ConvexContact = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  status: string;
  leadSource?: string;
  tags?: string[];
  notes?: string;
  lastContactedAt?: string;
  followUpDate?: string;
  stripeCustomerId?: string;
  revenue?: number;
  createdAt: string;
  updatedAt: string;
};

const sourceValues = new Set(["website", "conference", "referral", "email", "social"]);

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? "",
    lastName: parts.join(" "),
  };
}

function toLegacyStatus(status: string) {
  if (status === "contacted") return "contacted";
  if (status === "qualified" || status === "onboarding") return "qualified";
  if (status === "customer") return "converted";
  if (status === "inactive" || status === "churned") return "inactive";
  return "new";
}

function fromLegacyStatus(status?: string) {
  if (status === "contacted") return "contacted";
  if (status === "qualified") return "qualified";
  if (status === "converted") return "customer";
  if (status === "inactive") return "inactive";
  return "lead";
}

function toLegacyContact(contact: ConvexContact) {
  const source = contact.leadSource && sourceValues.has(contact.leadSource)
    ? contact.leadSource
    : "website";

  return {
    id: contact._id,
    name: [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim(),
    email: contact.email,
    phone: contact.phone ?? null,
    company: contact.organization ?? null,
    role: contact.role ?? null,
    type: contact.status === "customer" ? "customer" : "lead",
    source,
    status: toLegacyStatus(contact.status),
    tags: contact.tags ?? [],
    notes: contact.notes ?? "",
    lastContactDate: contact.lastContactedAt ?? null,
    followUpDate: contact.followUpDate ?? null,
    linkedInUrl: null,
    programInterest: contact.tags?.find((tag) => tag.includes("program")) ?? null,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
    stripeCustomerId: contact.stripeCustomerId ?? null,
    revenue: contact.revenue ?? 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const client = getConvexClient();
    let contacts = (await client.query(api.crm.listContacts, {
      query: searchParams.get("q") || undefined,
    })) as ConvexContact[];

    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const followUp = searchParams.get("followUp") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let legacyContacts = contacts.map(toLegacyContact);

    if (type) legacyContacts = legacyContacts.filter((contact) => contact.type === type);
    if (status) legacyContacts = legacyContacts.filter((contact) => contact.status === status);
    if (source) legacyContacts = legacyContacts.filter((contact) => contact.source === source);
    if (tags.length > 0) {
      legacyContacts = legacyContacts.filter((contact) =>
        tags.some((tag) => contact.tags.includes(tag))
      );
    }

    if (followUp) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      if (followUp === "overdue") {
        legacyContacts = legacyContacts.filter((contact) => contact.followUpDate && new Date(contact.followUpDate) < today);
      } else if (followUp === "this-week") {
        legacyContacts = legacyContacts.filter((contact) => contact.followUpDate && new Date(contact.followUpDate) >= today && new Date(contact.followUpDate) <= weekFromNow);
      } else if (followUp === "any") {
        legacyContacts = legacyContacts.filter((contact) => !!contact.followUpDate);
      }
    }

    legacyContacts.sort((a, b) => {
      let aVal: string | number = String(a[sortBy as keyof typeof a] ?? "");
      let bVal: string | number = String(b[sortBy as keyof typeof b] ?? "");
      if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "lastContactDate" || sortBy === "followUpDate") {
        aVal = aVal ? new Date(String(aVal)).getTime() : 0;
        bVal = bVal ? new Date(String(bVal)).getTime() : 0;
      }
      if (sortBy === "revenue") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = String(bVal ?? "").toLowerCase();
      }
      if (sortOrder === "asc") return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    return NextResponse.json({ contacts: legacyContacts, total: legacyContacts.length });
  } catch (error) {
    console.error("Error in GET /api/crm:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const { firstName, lastName } = splitName(body.name);
    const client = getConvexClient();
    const id = await client.mutation(api.crm.upsertContact, {
      firstName,
      lastName,
      email: body.email,
      phone: body.phone || undefined,
      organization: body.company || undefined,
      role: body.role || undefined,
      status: fromLegacyStatus(body.status),
      leadSource: body.source || "website",
      tags: body.tags || [],
      notes: body.notes || undefined,
      followUpDate: body.followUpDate || undefined,
      stripeCustomerId: body.stripeCustomerId || undefined,
      revenue: body.revenue || 0,
    });
    const contact = await client.query(api.crm.getContact, { id });
    return NextResponse.json(toLegacyContact(contact), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/crm:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    const name = body.name ? splitName(body.name) : {};
    const client = getConvexClient();
    const contact = await client.mutation(api.crm.updateContact, {
      id: body.id,
      ...name,
      email: body.email || undefined,
      phone: body.phone || undefined,
      organization: body.company || undefined,
      role: body.role || undefined,
      status: body.status ? fromLegacyStatus(body.status) : undefined,
      leadSource: body.source || undefined,
      tags: body.tags || undefined,
      notes: body.notes || undefined,
      followUpDate: body.followUpDate || undefined,
      stripeCustomerId: body.stripeCustomerId || undefined,
      revenue: body.revenue,
    });

    return NextResponse.json(toLegacyContact(contact));
  } catch (error) {
    console.error("Error in PATCH /api/crm:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
