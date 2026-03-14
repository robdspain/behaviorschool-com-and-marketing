import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, district, approval_date } = body;

  // Send Telegram notification to Rob
  const TELEGRAM_BOT_TOKEN = '8477833399:AAE-Fhxh2_uRzpDJMSZz_EtAI7qGxr9glbw';
  const TELEGRAM_CHAT_ID = '8181098703';
  const message = `HOLD MY SPOT REQUEST\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDistrict: ${district}\nExpected approval: ${approval_date || 'Not specified'}\n\nReply within 24h to confirm spot.`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });

  // Also send confirmation email via Resend
  const RESEND_API_KEY = 're_9jS7EXqT_J4sbfJz6aCjBSNRQ2yDijLcu';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'Rob Spain <rob@behaviorschool.com>',
      to: email,
      subject: 'Your spot is held — School BCBA Transformation Program',
      html: `<p>Hi ${name},</p><p>Your spot in the School BCBA Transformation Program is held while you complete your district approval process.</p><p>I'll follow up within 24 hours to confirm. In the meantime, if you need any documentation for your district (W-9, formal program description, invoice template), just reply to this email.</p><p>— Rob Spain, BCBA<br>BehaviorSchool<br>rob@behaviorschool.com</p>`,
    }),
  });

  return NextResponse.json({ ok: true });
}
