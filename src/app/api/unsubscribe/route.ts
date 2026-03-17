import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CRM_PATH = path.join(process.cwd(), 'data', 'crm.json');

interface Contact {
  id: string;
  email: string;
  tags?: string[];
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Read current CRM data
    let contacts: Contact[] = [];
    try {
      const data = fs.readFileSync(CRM_PATH, 'utf-8');
      contacts = JSON.parse(data);
    } catch {
      // If file doesn't exist or is invalid, start with empty array
      contacts = [];
    }

    // Find the contact by email
    const contactIndex = contacts.findIndex(
      (c) => c.email?.toLowerCase() === normalizedEmail
    );

    if (contactIndex !== -1) {
      // Contact exists - add unsubscribed tag
      const contact = contacts[contactIndex];
      const tags = contact.tags || [];
      if (!tags.includes('unsubscribed')) {
        tags.push('unsubscribed');
      }
      if (!tags.includes('do-not-email')) {
        tags.push('do-not-email');
      }
      contact.tags = tags;
      contacts[contactIndex] = contact;
    } else {
      // Contact doesn't exist - create minimal entry with unsubscribed tag
      contacts.push({
        id: `unsub_${Date.now()}`,
        email: normalizedEmail,
        tags: ['unsubscribed', 'do-not-email'],
        source: 'unsubscribe-page',
        createdAt: new Date().toISOString(),
      });
    }

    // Write back to CRM
    fs.writeFileSync(CRM_PATH, JSON.stringify(contacts, null, 2));

    // Also log to a separate unsubscribe log for audit
    const logPath = path.join(process.cwd(), 'data', 'unsubscribes.log');
    const logEntry = `${new Date().toISOString()} | ${normalizedEmail}\n`;
    fs.appendFileSync(logPath, logEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
}
