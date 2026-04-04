export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { RESEND_FROM_NO_REPLY } from '@/lib/resend';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://quixotic-fox-157.convex.cloud";

function generateConfirmationToken(email: string): string {
  const secret = process.env.EMAIL_CONFIRMATION_SECRET || 'your-secret-key';
  const timestamp = Date.now();
  const data = `${email}:${timestamp}`;
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  // Token = base64(email:timestamp:hash)
  return Buffer.from(`${email}:${timestamp}:${hash}`).toString('base64url');
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const token = generateConfirmationToken(normalizedEmail);
    const confirmUrl = `https://behaviorschool.com/confirm-subscription?token=${token}`;

    // Send confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM_NO_REPLY,
      to: normalizedEmail,
      subject: 'Confirm your subscription to Behavior School',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f4d3f;">Almost there!</h2>
          <p>Hey${name ? ` ${name}` : ''},</p>
          <p>Thanks for signing up for Behavior School updates. Please confirm your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" 
               style="background-color: #1f4d3f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Confirm My Subscription
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${confirmUrl}" style="color: #1f4d3f; word-break: break-all;">${confirmUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you didn't sign up for this, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            Behavior School LLC<br>
            8 The Green #20473<br>
            Dover, DE 19901
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send confirmation email:', error);
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }

    // Save to Convex (status will be 'new' until confirmed)
    try {
      await fetch(`${CONVEX_URL}/api/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: "newsletter:subscribeToNewsletter",
          args: {
            email: normalizedEmail,
            name: name || undefined,
            source: source || "website",
            tags: ["pending-confirmation"],
          },
        }),
      });
    } catch (convexErr) {
      console.error('Convex save error (non-blocking):', convexErr);
    }
    
    console.log(`Confirmation email sent to: ${normalizedEmail}, source: ${source || 'unknown'}`);

    // Notify Rob of new signup attempt
    await resend.emails.send({
      from: RESEND_FROM_NO_REPLY,
      to: 'rob@behaviorschool.com',
      subject: `📬 New Signup (pending): ${normalizedEmail}`,
      text: `New email signup (awaiting confirmation)\n\nEmail: ${normalizedEmail}\nName: ${name || 'Not provided'}\nSource: ${source || 'Unknown'}\nTime: ${new Date().toISOString()}\n\nThey will be added to your list once they click the confirmation link.`,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Please check your email to confirm your subscription.' 
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
