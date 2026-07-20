import { NextRequest, NextResponse } from 'next/server';
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from '@/lib/resend';
import { startTransformationNurture } from '@/lib/transformation-nurture';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, district, approval_date } = body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!name || !normalizedEmail || !phone || !district) {
    return NextResponse.json({ ok: false, error: 'Name, email, phone, and district are required' }, { status: 400 });
  }

  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ ok: false, error: 'Valid email address is required' }, { status: 400 });
  }

  // Send Telegram notification to Rob
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8181098703';
  const message = `HOLD MY SPOT REQUEST\n\nName: ${name}\nEmail: ${normalizedEmail}\nPhone: ${phone}\nDistrict: ${district}\nExpected approval: ${approval_date || 'Not specified'}\n\nReply within 24h to confirm spot.`;
  let notificationSent = false;

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      });
      notificationSent = telegramResponse.ok || notificationSent;
      if (!telegramResponse.ok) {
        console.error('Telegram hold-my-spot notification failed:', await telegramResponse.text());
      }
    } catch (error) {
      console.error('Telegram hold-my-spot notification error:', error);
    }
  }

  // Also send confirmation email via Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: RESEND_FROM_ROB,
          to: normalizedEmail,
          reply_to: RESEND_REPLY_TO_ROB,
          subject: 'I have your School BCBA program spot request',
          html: `<p>Hi ${name},</p><p>I have your request to hold a spot in the School BCBA Transformation Program while you work through district approval.</p><p>I'll follow up within 24 hours to confirm the details. If you need a W-9, formal program description, or invoice language for your district, reply here and I will send it over.</p><p>Rob Spain, BCBA<br>BehaviorSchool<br>rob@behaviorschool.com</p>`,
        }),
      });
      notificationSent = resendResponse.ok || notificationSent;
      if (!resendResponse.ok) {
        console.error('Resend hold-my-spot email failed:', await resendResponse.text());
      }
    } catch (error) {
      console.error('Resend hold-my-spot email error:', error);
    }
  }

  if (!notificationSent) {
    return NextResponse.json({ ok: false, error: 'Notification failed' }, { status: 500 });
  }

  try {
    await startTransformationNurture({
      email: normalizedEmail,
      name,
      phone,
      organization: district,
      source: 'hold_my_spot',
      tags: ['hold-my-spot', 'district-approval', 'transformation-program'],
      notes: `Hold-my-spot request. District: ${district}. Expected approval: ${approval_date || 'Not specified'}.`,
      metadata: { approvalDate: approval_date || null },
    });
  } catch (error) {
    console.error('Unable to start Transformation nurture from hold-my-spot:', error);
  }

  return NextResponse.json({ ok: true });
}
