export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Mailgun from "mailgun.js";
import { createClient } from "@/lib/supabase-server";


const BodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
  company: z.string().max(0).optional(),
});

// Simple in-memory token bucket keyed by ip. Resets periodically.
// Note: In serverless, this may not persist across invocations; good enough as a minimal guard.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
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

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, name, message, company } = parsed.data;
  if (company && company.length > 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: contactTemplate, error: contactTemplateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('name', 'contact_form_submission')
    .single();

  if (contactTemplateError) {
    console.error('Error fetching contact form email template:', contactTemplateError);
    return NextResponse.json({ error: "Failed to load email template" }, { status: 500 });
  }

  const templateData = {
    name: name || 'Not provided',
    email,
    message,
    company: company || 'Not provided',
  };

  const renderTemplate = (template: string, data: Record<string, string>) => {
    let rendered = template;
    for (const key in data) {
      rendered = rendered.replace(new RegExp(`\$\{${key}\}`, 'g'), data[key]);
    }
    return rendered;
  };

  const emailSubject = renderTemplate(contactTemplate.subject, templateData);
  const emailText = contactTemplate.body_text ? renderTemplate(contactTemplate.body_text, templateData) : '';
  const emailHtml = contactTemplate.body_html ? renderTemplate(contactTemplate.body_html, templateData) : '';

  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL;
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL;

  if (!apiKey || !domain || !fromEmail || !toEmail) {
    return NextResponse.json({ error: "Service misconfigured" }, { status: 500 });
  }

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: "api", key: apiKey });

  const mailgunData = {
    from: fromEmail,
    to: toEmail,
    subject: emailSubject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await mg.messages.create(domain, mailgunData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }
}


