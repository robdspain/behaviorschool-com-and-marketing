import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Send notification email to Rob about the unsubscribe request
    // This works with send-only API keys
    const { error } = await resend.emails.send({
      from: 'Behavior School <noreply@updates.behaviorschool.com>',
      to: 'rob@behaviorschool.com',
      subject: `🚫 Unsubscribe Request: ${normalizedEmail}`,
      text: `Unsubscribe request received.\n\nEmail: ${normalizedEmail}\nTime: ${timestamp}\n\nPlease remove this email from your mailing list.`,
    });

    if (error) {
      console.error('Failed to send unsubscribe notification:', error);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    console.log(`Unsubscribe notification sent for: ${normalizedEmail}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
