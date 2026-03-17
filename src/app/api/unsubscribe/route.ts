import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_DOMAIN_ID = process.env.RESEND_DOMAIN_ID_UPDATES; // You'll need to set this env var with the ID for updates.behaviorschool.com

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

    // Add email to the suppression list for the domain
    // This prevents any future emails from being sent to this address from the domain.
    await resend.emails.suppressions.create({
      email: normalizedEmail,
    });

    console.log(`Successfully added ${normalizedEmail} to suppression list.`);

    return NextResponse.json({ success: true, message: 'You have been successfully unsubscribed.' });

  } catch (error: any) {
    console.error('Resend Unsubscribe Error:', error);

    // Check if the error is because the email is already on the suppression list
    if (error.name === 'validation_error' && error.message.includes('is already suppressed')) {
      return NextResponse.json({ success: true, message: 'You are already unsubscribed.' });
    }
    
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request.' },
      { status: 500 }
    );
  }
}
