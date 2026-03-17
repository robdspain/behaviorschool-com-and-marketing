import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // In production: Update database to mark user as confirmed
    // await db.subscribers.update({ email, status: 'confirmed' });

    console.log(`Email confirmed: ${email}`);

    // Notify Rob that someone confirmed
    await resend.emails.send({
      from: 'Behavior School <noreply@updates.behaviorschool.com>',
      to: 'rob@behaviorschool.com',
      subject: `✅ Subscription Confirmed: ${email}`,
      text: `A new subscriber has confirmed their email!\n\nEmail: ${email}\nConfirmed at: ${new Date().toISOString()}\n\nAdd them to your active mailing list.`,
    });

    // Send welcome email to the confirmed subscriber
    await resend.emails.send({
      from: 'Behavior School <rob@updates.behaviorschool.com>',
      to: email,
      replyTo: 'rob@behaviorschool.com',
      subject: 'Welcome to Behavior School!',
      headers: {
        'List-Unsubscribe': `<https://behaviorschool.com/unsubscribe?email=${encodeURIComponent(email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f4d3f;">Welcome to Behavior School!</h2>
          <p>Thanks for confirming your subscription. You're now on the list!</p>
          <p>Here's what you can expect:</p>
          <ul>
            <li>Weekly evidence-based ABA strategies</li>
            <li>Free BCBA exam prep tips</li>
            <li>IEP goal templates and behavior tools</li>
            <li>Exclusive community updates</li>
          </ul>
          <div style="background: #f0fdf4; border-left: 4px solid #1f4d3f; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Get Started:</strong></p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://behaviorschool.com/blog" style="color: #1f4d3f;">Read Our Latest Blog Posts</a>
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            Questions? Just reply to this email!<br><br>
            - Rob Spain, M.S., BCBA, IBA<br>
            Behavior School
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Behavior School LLC<br>
            8 The Green #20473<br>
            Dover, DE 19901
          </p>
          <p style="color: #999; font-size: 11px;">
            <a href="https://behaviorschool.com/email-preferences?email=${encodeURIComponent(email)}" style="color: #666;">Email Preferences</a>
            &nbsp;|&nbsp;
            <a href="https://behaviorschool.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #666;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, email });

  } catch (error) {
    console.error('Confirm subscription error:', error);
    return NextResponse.json({ error: 'Failed to confirm subscription' }, { status: 500 });
  }
}
