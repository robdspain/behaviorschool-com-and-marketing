import { NextRequest, NextResponse } from 'next/server';
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, district, approval_date } = body;

  // Send Telegram notification to Rob
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8181098703';
  const message = `HOLD MY SPOT REQUEST\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDistrict: ${district}\nExpected approval: ${approval_date || 'Not specified'}\n\nReply within 24h to confirm spot.`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });

  // Also send confirmation email via Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: RESEND_FROM_ROB,
      to: email,
      reply_to: RESEND_REPLY_TO_ROB,
      subject: 'I have your School BCBA program spot request',
      html: `<p>Hi ${name},</p><p>I have your request to hold a spot in the School BCBA Transformation Program while you work through district approval.</p><p>I'll follow up within 24 hours to confirm the details. If you need a W-9, formal program description, or invoice language for your district, reply here and I will send it over.</p><p>Rob Spain, BCBA<br>BehaviorSchool<br>rob@behaviorschool.com</p>`,
    }),
  });

  return NextResponse.json({ ok: true });
}
