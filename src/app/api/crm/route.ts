export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CRM_DATA_PATH = path.join(process.cwd(), 'data', 'crm.json');

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  type: 'lead' | 'customer' | 'partner' | 'prospect';
  source: 'website' | 'conference' | 'referral' | 'email' | 'social';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'inactive';
  tags: string[];
  notes: string;
  lastContactDate: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  revenue: number;
}

interface CRMData {
  contacts: Contact[];
}

async function readCRMData(): Promise<CRMData> {
  try {
    const data = await fs.readFile(CRM_DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading CRM data:', error);
    return { contacts: [] };
  }
}

async function writeCRMData(data: CRMData): Promise<void> {
  try {
    await fs.writeFile(CRM_DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing CRM data:', error);
    throw error;
  }
}

// GET - List, search, and filter contacts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const data = await readCRMData();
    let contacts = data.contacts;

    // Search filter (name, email, company)
    if (query) {
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (type) {
      contacts = contacts.filter((c) => c.type === type);
    }

    // Status filter
    if (status) {
      contacts = contacts.filter((c) => c.status === status);
    }

    // Source filter
    if (source) {
      contacts = contacts.filter((c) => c.source === source);
    }

    // Tags filter (match any of the provided tags)
    if (tags.length > 0) {
      contacts = contacts.filter((c) =>
        tags.some((tag) => c.tags.includes(tag))
      );
    }

    // Sort
    contacts.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Contact];
      let bVal: any = b[sortBy as keyof Contact];

      // Handle dates
      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'lastContactDate') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      // Handle numbers
      if (sortBy === 'revenue') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      // Handle strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return NextResponse.json({
      contacts,
      total: contacts.length,
    });
  } catch (error) {
    console.error('Error in GET /api/crm:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST - Add new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const data = await readCRMData();

    // Check for duplicate email
    const existingContact = data.contacts.find(
      (c) => c.email.toLowerCase() === body.email.toLowerCase()
    );

    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }

    // Generate new ID
    const maxId = data.contacts.length > 0
      ? Math.max(...data.contacts.map((c) => parseInt(c.id)))
      : 0;
    const newId = (maxId + 1).toString();

    // Create new contact
    const now = new Date().toISOString();
    const newContact: Contact = {
      id: newId,
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone || null,
      company: body.company || null,
      role: body.role || null,
      type: body.type || 'lead',
      source: body.source || 'website',
      status: body.status || 'new',
      tags: body.tags || [],
      notes: body.notes || '',
      lastContactDate: body.lastContactDate || null,
      createdAt: now,
      updatedAt: now,
      stripeCustomerId: body.stripeCustomerId || null,
      revenue: body.revenue || 0,
    };

    data.contacts.push(newContact);
    await writeCRMData(data);

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/crm:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

// PATCH - Update existing contact
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const data = await readCRMData();
    const contactIndex = data.contacts.findIndex((c) => c.id === body.id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update contact (merge with existing data)
    const now = new Date().toISOString();
    const updatedContact: Contact = {
      ...data.contacts[contactIndex],
      ...body,
      updatedAt: now,
    };

    data.contacts[contactIndex] = updatedContact;
    await writeCRMData(data);

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error('Error in PATCH /api/crm:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}
