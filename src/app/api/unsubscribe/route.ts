import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL || 'https://third-loris-453.convex.site';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Call Convex to update the contact record
    let convexSuccess = false;
    try {
      const convexResponse = await fetch(`${CONVEX_SITE_URL}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      
      if (convexResponse.ok) {
        const result = await convexResponse.json();
        convexSuccess = result.success === true;
      }
    } catch (convexError) {
      console.error('Failed to update Convex:', convexError);
      // Continue anyway - we'll still notify Rob
    }

    // Send notification email to Rob about the unsubscribe
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Behavior School <noreply@updates.behaviorschool.com>',
          to: 'rob@behaviorschool.com',
          subject: `🚫 Unsubscribe: ${normalizedEmail}`,
          text: `Unsubscribe processed.\n\nEmail: ${normalizedEmail}\nTime: ${timestamp}\nConvex updated: ${convexSuccess ? 'Yes' : 'No (manual removal may be needed)'}\n`,
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if notification fails
      }
    }

    console.log(`Unsubscribe processed for: ${normalizedEmail} (Convex: ${convexSuccess})`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
