import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { api, getConvexClient } from '@/lib/convex';
import { RESEND_FROM_SUPPORT_TRANSACTIONAL } from '@/lib/resend';
import {
  FBA_KIT_DOWNLOAD_URL,
  buildFbaKitContactArgs,
  validateFbaKitInput,
} from '@/lib/fba-starter-kit';

export const dynamic = 'force-dynamic';

const requestsByIp = new Map<string, number[]>();
const requestsByEmail = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 3;

function allowed(key: string, store: Map<string, number[]>) {
  const now = Date.now();
  const recent = (store.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return false;
  recent.push(now);
  store.set(key, recent);
  return true;
}

function splitName(name: string) {
  const parts = name.split(/\s+/);
  return { firstName: parts.shift() || name, lastName: parts.join(' ') };
}

export async function POST(request: NextRequest) {
  try {
    const input = validateFbaKitInput(await request.json());
    if (!input.ok) return NextResponse.json({ error: input.error }, { status: 400 });
    if (!process.env.RESEND_API_KEY) {
      console.error('FBA starter kit delivery unavailable: RESEND_API_KEY is missing.');
      return NextResponse.json({ error: 'The starter kit delivery is temporarily unavailable. Please try again later.' }, { status: 503 });
    }

    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
    if (!allowed(ip, requestsByIp) || !allowed(input.email, requestsByEmail)) {
      return NextResponse.json({ error: 'Please wait before requesting the starter kit again.' }, { status: 429 });
    }

    const { firstName, lastName } = splitName(input.name);
    const client = getConvexClient();
    const existing = await client.query(api.crm.getContactByEmail, { email: input.email });
    await client.mutation(api.crm.upsertContact, buildFbaKitContactArgs(existing, {
      firstName,
      lastName,
      email: input.email,
      role: input.role,
    }));

    const firstNameForEmail = firstName === input.name ? '' : ` ${firstName}`;
    const subject = 'Your School FA starter kit';
    const text = `Hi${firstNameForEmail},

Thanks for joining the Oct 9 CEU, Functional Behavior Assessment in a School Setting, Friday, October 9, 2026, 12 to 1 PM Pacific Time.

Download your School FA starter kit:
${FBA_KIT_DOWNLOAD_URL}

Event page:
https://behaviorschool.com/events/fba-in-a-school-setting

Rob Spain, Behavior School`;
    const html = `<p>Hi${firstNameForEmail},</p>
<p>Thanks for joining the Oct 9 CEU, Functional Behavior Assessment in a School Setting, Friday, October 9, 2026, 12 to 1 PM Pacific Time.</p>
<p><a href="${FBA_KIT_DOWNLOAD_URL}">Download your School FA starter kit</a></p>
<p><a href="https://behaviorschool.com/events/fba-in-a-school-setting">Visit the event page</a></p>
<p>Rob Spain, Behavior School</p>
<hr><p style="font-size:12px;color:#666">Behavior School LLC<br>8 The Green #20473<br>Dover, DE 19901<br>United States</p>
<p style="font-size:12px;color:#666">This is a transactional delivery email. <a href="mailto:support@behaviorschool.com?subject=Unsubscribe">Unsubscribe</a></p>`;

    const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: RESEND_FROM_SUPPORT_TRANSACTIONAL,
      to: [input.email],
      replyTo: 'support@behaviorschool.com',
      subject,
      html,
      text,
    });
    if (error) {
      console.error('FBA starter kit Resend error:', error);
      return NextResponse.json({ error: 'We saved your request, but could not deliver the starter kit. Please try again later.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: 'We emailed the starter kit to you.', emailId: data?.id });
  } catch (error) {
    console.error('FBA starter kit error:', error);
    return NextResponse.json({ error: 'The starter kit could not be delivered right now. Please try again later.' }, { status: 500 });
  }
}
