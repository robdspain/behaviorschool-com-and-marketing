import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase-server";

const SubscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  source: z.string().optional().default("newsletter"),
});

// Rate limiting
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipToHits: Map<string, { count: number; windowStart: number }> = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipToHits.get(ip);
  if (!entry) {
    ipToHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipToHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SubscribeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, name, source } = parsed.data;

  try {
    const supabase = createSupabaseAdminClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json({ error: "You're already subscribed to our newsletter!" }, { status: 409 });
      }
      // Reactivate if previously unsubscribed
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'active', 
          subscribed_at: new Date().toISOString(),
          source 
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Error reactivating subscriber:', updateError);
        return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
      }
    } else {
      // Create new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email,
          name,
          status: 'active',
          source,
          subscribed_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
      }
    }

    // Send welcome email if Mailgun is configured
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      try {
        const welcomeResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            from: `Behavior School <hello@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: 'Welcome to Behavior School Newsletter!',
            text: `Hi ${name},\n\nThank you for subscribing to our newsletter! You'll be the first to know about:\n\n• New course releases and updates\n• Exclusive insights and strategies\n• Expert tips for behavior management\n• Community events and opportunities\n\nWe're excited to have you join our community of behavior change professionals.\n\nBest regards,\nThe Behavior School Team\n\nP.S. You can unsubscribe at any time by clicking the link in any of our emails.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669;">Welcome to Behavior School Newsletter!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for subscribing to our newsletter! You'll be the first to know about:</p>
                <ul style="line-height: 1.6;">
                  <li>New course releases and updates</li>
                  <li>Exclusive insights and strategies</li>
                  <li>Expert tips for behavior management</li>
                  <li>Community events and opportunities</li>
                </ul>
                <p>We're excited to have you join our community of behavior change professionals.</p>
                <p>Best regards,<br>The Behavior School Team</p>
                <p style="font-size: 12px; color: #666; margin-top: 30px;">
                  P.S. You can unsubscribe at any time by clicking the link in any of our emails.
                </p>
              </div>
            `
          }),
        });

        if (!welcomeResponse.ok) {
          console.error('Welcome email error:', await welcomeResponse.text());
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message." 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}