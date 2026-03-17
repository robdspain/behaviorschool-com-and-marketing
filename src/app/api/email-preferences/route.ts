import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, preferences } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Send notification to Rob about the preference change
    const { error } = await resend.emails.send({
      from: 'Behavior School <noreply@updates.behaviorschool.com>',
      to: 'robspain@gmail.com',
      subject: `📧 Email Preferences Updated: ${normalizedEmail}`,
      text: `Email preference update received.

Email: ${normalizedEmail}
Time: ${timestamp}

Preferences:
- Marketing & Promotions: ${preferences.marketing ? 'ON' : 'OFF'}
- Product Updates: ${preferences.product ? 'ON' : 'OFF'}  
- Blog & Resources: ${preferences.blog ? 'ON' : 'OFF'}

Please update your mailing list tags accordingly.`,
    });

    if (error) {
      console.error('Failed to send preferences notification:', error);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    console.log(`Email preferences updated for: ${normalizedEmail}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email preferences error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
