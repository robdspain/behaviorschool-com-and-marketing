export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CRM_DATA_PATH = path.join(process.cwd(), "data", "crm.json");

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  type: "lead" | "customer" | "partner" | "prospect";
  source: "website" | "conference" | "referral" | "email" | "social";
  status: "new" | "contacted" | "qualified" | "converted" | "inactive";
  tags: string[];
  notes: string;
  lastContactDate: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  revenue: number;
};

type CRMData = { contacts: Contact[] };

async function readCRMData(): Promise<CRMData> {
  try {
    const data = await fs.readFile(CRM_DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { contacts: [] };
  }
}

async function writeCRMData(data: CRMData): Promise<void> {
  await fs.writeFile(CRM_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = (body?.email || "").toString().trim().toLowerCase();

    if (!rawEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const nameFromEmail = rawEmail.split("@")[0]?.replace(/[._-]+/g, " ");
    const resolvedName = (body?.name || body?.firstName || "").toString().trim() || nameFromEmail || "Lead";

    const data = await readCRMData();
    const existing = data.contacts.find((c) => c.email === rawEmail);

    if (!existing) {
      const now = new Date().toISOString();
      const maxId = data.contacts.length > 0
        ? Math.max(...data.contacts.map((c) => parseInt(c.id)))
        : 0;

      const newContact: Contact = {
        id: (maxId + 1).toString(),
        name: resolvedName,
        email: rawEmail,
        phone: null,
        company: null,
        role: body?.role || null,
        type: "lead",
        source: body?.source || "website",
        status: "new",
        tags: Array.isArray(body?.tags) ? body.tags : body?.tags ? [body.tags] : ["lead-magnet"],
        notes: body?.notes || "",
        lastContactDate: null,
        createdAt: now,
        updatedAt: now,
        stripeCustomerId: null,
        revenue: 0,
      };

      data.contacts.push(newContact);
      await writeCRMData(data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in POST /api/lead-magnet:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
