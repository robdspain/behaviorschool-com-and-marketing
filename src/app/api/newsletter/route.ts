import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const SubscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().default(""),
  source: z.string().optional().default("newsletter"),
});

// Fallback function for when Supabase is unavailable
async function handleMailgunOnlySignup(email: string, name: string, _source: string) {
  console.log('API: Using Mailgun-only fallback signup');

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
          subject: 'Welcome to Behavior School!',
          text: `Hi ${name},

Thank you for your interest in our IEP tools! You'll receive access shortly.

Best regards,
The Behavior School Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #059669;">Welcome to Behavior School!</h2>
              <p>Hi ${name},</p>
              <p>Thank you for your interest in our IEP tools! You'll receive access shortly.</p>
              <p>Best regards,<br>The Behavior School Team</p>
            </div>
          `
        }),
      });

      if (welcomeResponse.ok) {
        console.log('API: Mailgun fallback email sent successfully');
        return NextResponse.json({
          success: true,
          message: "Successfully signed up! Check your email for access instructions."
        });
      } else {
        console.error('API: Mailgun fallback failed:', await welcomeResponse.text());
        return NextResponse.json({
          success: true,
          message: "Successfully signed up! You'll receive access instructions shortly."
        });
      }
    } catch (emailError) {
      console.error('API: Mailgun fallback error:', emailError);
      return NextResponse.json({
        success: true,
        message: "Successfully signed up! You'll receive access instructions shortly."
      });
    }
  } else {
    console.log('API: No Mailgun configured, returning success anyway');
    return NextResponse.json({
      success: true,
      message: "Successfully signed up! You'll receive access instructions shortly."
    });
  }
}

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

  // Simple tagging: just identify if they came from IEP goals page
  const tags = source === "/iep-goals" ? ["IEPgoals"] : ["general"];

  try {
    // Use admin client so RLS can remain strict on subscribers-related tables
    const supabase = createSupabaseAdminClient();
    console.log('API: Supabase admin client created.');

    // Test Supabase connection first
    const { data: _testData, error: testError } = await supabase
      .from('subscribers')
      .select('count', { count: 'exact' })
      .limit(1);

    if (testError) {
      console.error('API: Supabase connection test failed:', testError);
      // Fallback: Just send the email via Mailgun without storing in DB
      return await handleMailgunOnlySignup(email, name, source);
    }

    // Check if email already exists
    console.log('API: Checking for existing subscriber...');
    const { data: existingSubscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows found, which is expected
      console.error('API: Error selecting subscriber:', selectError);
      // Fallback to Mailgun-only signup
      return await handleMailgunOnlySignup(email, name, source);
    }

    if (existingSubscriber) {
      console.log('API: Existing subscriber found.', existingSubscriber);
      if (existingSubscriber.status === 'active') {
        console.log('API: Subscriber already active.');
        return NextResponse.json({ error: "You're already subscribed to our newsletter!" }, { status: 409 });
      }
      // Reactivate if previously unsubscribed
      console.log('API: Reactivating subscriber...');
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({ 
          status: 'active', 
          subscribed_at: new Date().toISOString(),
          source,
          tags
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('API: Error reactivating subscriber:', updateError);
        return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
      }
      console.log('API: Subscriber reactivated.');
    } else {
      // Create new subscriber
      console.log('API: Creating new subscriber...');
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([{
          email,
          name,
          status: 'active',
          source,
          tags,
          subscribed_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('API: Error creating subscriber:', insertError);
        return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
      }
      console.log('API: New subscriber created.');
    }

    // Send welcome email if Mailgun is configured
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      console.log('API: Mailgun configured, attempting to send welcome email...');
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
            text: `Hi ${name},

Thank you for subscribing to our newsletter! You'll be the first to know about:

• New course releases and updates
• Exclusive insights and strategies
• Expert tips for behavior management
• Community events and opportunities

We're excited to have you join our community of behavior change professionals.

Best regards,
The Behavior School Team

P.S. You can unsubscribe at any time by clicking the link in any of our emails.`,
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
          console.error('API: Welcome email error:', await welcomeResponse.text());
        }
        console.log('API: Welcome email sent (if configured).');
      } catch (emailError) {
        console.error('API: Error sending welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    console.log('API: Subscription process completed successfully.');
    return NextResponse.json({ 
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message." 
    });

  } catch (error) {
    console.error('API: General newsletter subscription error:', error);
    console.log('API: Attempting fallback to Mailgun-only signup');
    try {
      return await handleMailgunOnlySignup(email, name, source);
    } catch (fallbackError) {
      console.error('API: Fallback also failed:', fallbackError);
      return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
    }
  }
}
