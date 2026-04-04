export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { sendWelcomeEmail } from '@/lib/email';
import { RESEND_FROM_NO_REPLY, upsertNewsletterSubscriber } from '@/lib/resend';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://quixotic-fox-157.convex.cloud";

// Token expires after 48 hours
const TOKEN_EXPIRY_MS = 48 * 60 * 60 * 1000;

function verifyConfirmationToken(token: string): { valid: boolean; email?: string; error?: string } {
  try {
    const secret = process.env.EMAIL_CONFIRMATION_SECRET || 'your-secret-key';
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [email, timestampStr, hash] = decoded.split(':');
    
    if (!email || !timestampStr || !hash) {
      return { valid: false, error: 'invalid' };
    }

    const timestamp = parseInt(timestampStr, 10);
    
    // Check if token is expired
    if (Date.now() - timestamp > TOKEN_EXPIRY_MS) {
      return { valid: false, error: 'expired' };
    }

    // Verify hash
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${timestampStr}`)
      .digest('hex');

    if (hash !== expectedHash) {
      return { valid: false, error: 'invalid' };
    }

    return { valid: true, email };
  } catch {
    return { valid: false, error: 'invalid' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const verification = verifyConfirmationToken(token);

    if (!verification.valid) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    const email = verification.email!;

    // Mark as confirmed in Convex
    try {
      await fetch(`${CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: "newsletter:confirmSubscription",
          args: { email },
        }),
      });
    } catch (convexErr) {
      console.error('Convex confirm error (non-blocking):', convexErr);
    }
    
    console.log(`Email confirmed: ${email}`);

    await upsertNewsletterSubscriber(email);

    // Notify Rob that someone confirmed
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM_NO_REPLY,
      to: 'rob@behaviorschool.com',
      subject: `✅ Subscription Confirmed: ${email}`,
      text: `A new subscriber has confirmed their email!\n\nEmail: ${email}\nConfirmed at: ${new Date().toISOString()}\n\nAdd them to your active mailing list.`,
    });

    // Send welcome email to the confirmed subscriber
    await sendWelcomeEmail(email);

    return NextResponse.json({ success: true, email });

  } catch (error) {
    console.error('Confirm subscription error:', error);
    return NextResponse.json({ error: 'Failed to confirm subscription' }, { status: 500 });
  }
}
