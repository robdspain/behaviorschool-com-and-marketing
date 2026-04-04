import fs from "fs/promises";
import path from "path";
import formData from "form-data";
import Mailgun from "mailgun.js";
import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type HandlerEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
};

type HandlerResponse = {
  statusCode: number;
  body: string;
};

type Handler = (event: HandlerEvent) => Promise<HandlerResponse>;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8181098703";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
const EMAIL_WORKER_URL = process.env.EMAIL_WORKER_URL || "https://email.behaviorschool.com";
const EMAIL_WORKER_KEY = process.env.EMAIL_WORKER_INTERNAL_KEY || "";
const TRANSFORMATION_PROGRAM_URL = `${SITE_URL}/transformation-program`;
const SUPPORT_EMAIL = process.env.MAILGUN_FROM_EMAIL || "rob@behaviorschool.com";
const PURCHASE_AUDIT_TEMPLATE = "transformation_program_purchase";
const PURCHASE_CONFIRMATION_TEMPLATE = "transformation_program_purchase_confirmation";
const CRM_DATA_PATH = path.join(process.cwd(), "data", "crm.json");
const TRANSFORMATION_PAYMENT_LINK_IDS = new Set(
  (process.env.TRANSFORMATION_PROGRAM_PAYMENT_LINK_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

type EmailTemplateRecord = {
  subject: string;
  body_text: string | null;
  body_html: string | null;
};

type CrmContact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  type: "lead" | "customer" | "partner" | "prospect";
  source: "website" | "conference" | "referral" | "email" | "social";
  status: "new" | "contacted" | "qualified" | "converted" | "inactive";
  tags: string[];
  notes: string;
  lastContactDate: string | null;
  followUpDate?: string | null;
  linkedInUrl?: string | null;
  programInterest?: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  revenue: number;
};

type CrmData = {
  contacts: CrmContact[];
};

type PurchaseContext = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  amountCents: number;
  currency: string;
  amountDisplay: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  paymentLinkId: string | null;
  productName: string;
  lineItemDescriptions: string[];
};

function getSupabaseAdminClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SECRECT_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getMailgunClient() {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_FROM_EMAIL) {
    return null;
  }

  const mailgun = new Mailgun(formData);
  return mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });
}

async function sendTelegram(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("[Stripe Webhook] No Telegram token, skipping notification");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("[Stripe Webhook] Telegram send failed:", error);
  }
}

function formatMoney(cents: number, currency = "usd"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function getPaymentLinkId(paymentLink: string | { id?: string } | null): string | null {
  if (!paymentLink) {
    return null;
  }

  return typeof paymentLink === "string" ? paymentLink : paymentLink.id || null;
}

function parseName(fullName: string | null | undefined, email: string) {
  const trimmed = fullName?.trim();
  if (trimmed) {
    const [firstName, ...rest] = trimmed.split(/\s+/);
    return {
      fullName: trimmed,
      firstName,
      lastName: rest.join(" "),
    };
  }

  const fallbackFirst = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "there";
  return {
    fullName: fallbackFirst,
    firstName: fallbackFirst,
    lastName: "",
  };
}

function applyTemplateVariables(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
  }, template);
}

function appendNote(existingNotes: string, note: string): string {
  if (!note) {
    return existingNotes;
  }

  if (existingNotes.includes(note)) {
    return existingNotes;
  }

  return existingNotes ? `${existingNotes}\n\n${note}` : note;
}

async function readCrmData(): Promise<CrmData> {
  try {
    const raw = await fs.readFile(CRM_DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CrmData>;
    return {
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
    };
  } catch (error) {
    console.error("[Stripe Webhook] Failed to read CRM data:", error);
    return { contacts: [] };
  }
}

async function writeCrmData(data: CrmData): Promise<void> {
  await fs.writeFile(CRM_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function getLineItemDescriptions(sessionId: string): Promise<string[]> {
  try {
    const { data } = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });
    return data
      .map((item) => item.description?.trim())
      .filter((value): value is string => Boolean(value));
  } catch (error) {
    console.error("[Stripe Webhook] Failed to list line items:", error);
    return [];
  }
}

async function resolvePurchaseContext(session: Stripe.Checkout.Session): Promise<PurchaseContext | null> {
  const email = normalizeEmail(session.customer_email || session.customer_details?.email);
  if (!email) {
    return null;
  }

  const lineItemDescriptions = await getLineItemDescriptions(session.id);
  const metadataProduct = session.metadata?.product?.trim();
  const metadataProgram = session.metadata?.program?.trim();
  const paymentLinkId = getPaymentLinkId(session.payment_link);
  const candidates = [metadataProduct, metadataProgram, ...lineItemDescriptions].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  const joined = candidates.join(" | ").toLowerCase();
  const productName = candidates[0] || "BehaviorSchool purchase";
  const isTransformationProgramPurchase =
    TRANSFORMATION_PAYMENT_LINK_IDS.has(paymentLinkId || "") ||
    joined.includes("transformation program") ||
    joined.includes("school bcba transformation");

  if (!isTransformationProgramPurchase) {
    return null;
  }

  const parsedName = parseName(session.customer_details?.name, email);
  const amountCents = session.amount_total || 0;
  const currency = session.currency || "usd";

  return {
    email,
    firstName: parsedName.firstName,
    lastName: parsedName.lastName,
    fullName: parsedName.fullName,
    amountCents,
    currency,
    amountDisplay: formatMoney(amountCents, currency),
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : session.customer?.id || null,
    paymentLinkId,
    productName,
    lineItemDescriptions,
  };
}

async function hasPurchaseAudit(client: SupabaseClient | null, sessionId: string): Promise<boolean> {
  if (!client) {
    return false;
  }

  const { data, error } = await client
    .from("email_logs")
    .select("id")
    .eq("template_name", PURCHASE_AUDIT_TEMPLATE)
    .contains("metadata", { logType: "purchase", stripeSessionId: sessionId })
    .limit(1);

  if (error) {
    console.error("[Stripe Webhook] Failed to check purchase audit log:", error);
    return false;
  }

  return Boolean(data && data.length > 0);
}

async function hasConfirmationLog(client: SupabaseClient | null, sessionId: string): Promise<boolean> {
  if (!client) {
    return false;
  }

  const { data, error } = await client
    .from("email_logs")
    .select("id")
    .eq("template_name", PURCHASE_CONFIRMATION_TEMPLATE)
    .contains("metadata", { stripeSessionId: sessionId })
    .limit(1);

  if (error) {
    console.error("[Stripe Webhook] Failed to check confirmation log:", error);
    return false;
  }

  return Boolean(data && data.length > 0);
}

async function writeEmailLog(
  client: SupabaseClient | null,
  payload: {
    templateName: string;
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    status: string;
    errorMessage?: string;
    mailgunId?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  if (!client) {
    return;
  }

  const { error } = await client.from("email_logs").insert({
    template_name: payload.templateName,
    recipient_email: payload.recipientEmail,
    recipient_name: payload.recipientName || null,
    subject: payload.subject,
    status: payload.status,
    error_message: payload.errorMessage || null,
    mailgun_id: payload.mailgunId || null,
    metadata: payload.metadata || null,
  });

  if (error) {
    throw error;
  }
}

async function logCheckoutProvisioning(
  client: SupabaseClient | null,
  email: string,
  success: boolean,
  errorMessage: string | null,
): Promise<void> {
  if (!client) {
    return;
  }

  const { error } = await client.from("checkout_access_logs").insert({
    access_type: "stripe_webhook",
    identifier: email,
    success,
    error_message: errorMessage,
  });

  if (error) {
    console.error("[Stripe Webhook] Failed to write checkout provisioning log:", error);
  }
}

async function provisionCheckoutAccess(client: SupabaseClient | null, purchase: PurchaseContext): Promise<void> {
  if (!client) {
    throw new Error("Supabase admin client is not configured");
  }

  const { data: existing, error: existingError } = await client
    .from("checkout_access")
    .select("id, first_name, last_name, notes")
    .eq("email", purchase.email)
    .maybeSingle();

  if (existingError) {
    await logCheckoutProvisioning(client, purchase.email, false, existingError.message);
    throw existingError;
  }

  const note = `Auto-provisioned from Stripe purchase ${purchase.stripeSessionId} (${purchase.productName}) on ${new Date().toISOString()}`;

  if (existing) {
    const { error } = await client
      .from("checkout_access")
      .update({
        first_name: existing.first_name || purchase.firstName || null,
        last_name: existing.last_name || purchase.lastName || null,
        approved_by: "Stripe webhook",
        notes: appendNote(existing.notes || "", note),
        is_active: true,
        expires_at: null,
      })
      .eq("id", existing.id);

    if (error) {
      await logCheckoutProvisioning(client, purchase.email, false, error.message);
      throw error;
    }
  } else {
    const { error } = await client.from("checkout_access").insert({
      email: purchase.email,
      first_name: purchase.firstName || null,
      last_name: purchase.lastName || null,
      approved_by: "Stripe webhook",
      notes: note,
      is_active: true,
      expires_at: null,
    });

    if (error) {
      await logCheckoutProvisioning(client, purchase.email, false, error.message);
      throw error;
    }
  }

  await logCheckoutProvisioning(client, purchase.email, true, null);
}

async function loadPurchaseConfirmationTemplate(
  client: SupabaseClient | null,
): Promise<EmailTemplateRecord | null> {
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("email_templates")
    .select("subject, body_text, body_html")
    .eq("name", PURCHASE_CONFIRMATION_TEMPLATE)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[Stripe Webhook] Failed to load purchase confirmation template:", error);
    return null;
  }

  return data;
}

async function buildPurchaseConfirmationEmail(
  client: SupabaseClient | null,
  purchase: PurchaseContext,
): Promise<{ subject: string; text: string; html: string }> {
  const template = await loadPurchaseConfirmationTemplate(client);
  const variables = {
    firstName: purchase.firstName || "there",
    lastName: purchase.lastName,
    fullName: purchase.fullName,
    email: purchase.email,
    amount: purchase.amountDisplay,
    productName: purchase.productName,
    programUrl: TRANSFORMATION_PROGRAM_URL,
    supportEmail: SUPPORT_EMAIL,
  };

  if (template) {
    return {
      subject: applyTemplateVariables(template.subject, variables),
      text: applyTemplateVariables(template.body_text || "", variables),
      html: applyTemplateVariables(template.body_html || "", variables),
    };
  }

  const subject = `🎉 Purchase confirmed — ${purchase.productName}`;
  const text = `Hi ${variables.firstName},

Your purchase is confirmed.

Product: ${purchase.productName}
Amount: ${purchase.amountDisplay}
Email on file: ${purchase.email}

We have provisioned your email for the Transformation Program and will use this address for onboarding and access updates.

What happens next:
- Your purchase has been recorded successfully
- Your email has been provisioned for program access
- If any access details require a manual follow-up, our team will contact you at this address

Program page:
${TRANSFORMATION_PROGRAM_URL}

Questions? Reply to this email or contact ${SUPPORT_EMAIL}.

Best,
BehaviorSchool
`;

  const html = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:32px 24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Purchase confirmed</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;color:#334155;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 16px;">Hi ${variables.firstName},</p>
                <p style="margin:0 0 16px;">Thanks for joining us. Your purchase has been confirmed and your email has been provisioned for the Transformation Program.</p>
                <div style="margin:24px 0;padding:20px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                  <p style="margin:0 0 8px;"><strong>Product:</strong> ${purchase.productName}</p>
                  <p style="margin:0 0 8px;"><strong>Amount:</strong> ${purchase.amountDisplay}</p>
                  <p style="margin:0;"><strong>Email on file:</strong> ${purchase.email}</p>
                </div>
                <p style="margin:0 0 16px;">What happens next:</p>
                <ul style="margin:0 0 24px 20px;padding:0;">
                  <li>Your purchase has been recorded successfully</li>
                  <li>Your email has been provisioned for program access</li>
                  <li>If any onboarding details require a manual follow-up, our team will contact you at this address</li>
                </ul>
                <p style="margin:0 0 24px;">
                  <a href="${TRANSFORMATION_PROGRAM_URL}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;">View program details</a>
                </p>
                <p style="margin:0;">Questions? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#059669;text-decoration:none;">${SUPPORT_EMAIL}</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

async function sendPurchaseConfirmationEmail(
  client: SupabaseClient | null,
  purchase: PurchaseContext,
): Promise<{ status: "sent" | "failed" | "skipped"; errorMessage?: string }> {
  if (await hasConfirmationLog(client, purchase.stripeSessionId)) {
    return { status: "skipped" };
  }

  const mailgunClient = getMailgunClient();
  if (!mailgunClient || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_FROM_EMAIL) {
    const errorMessage = "Mailgun environment is not configured";
    await writeEmailLog(client, {
      templateName: PURCHASE_CONFIRMATION_TEMPLATE,
      recipientEmail: purchase.email,
      recipientName: purchase.fullName,
      subject: `Purchase confirmation unavailable — ${purchase.productName}`,
      status: "failed",
      errorMessage,
      metadata: {
        stripeSessionId: purchase.stripeSessionId,
        logType: "purchase_confirmation_email",
      },
    });
    return { status: "failed", errorMessage };
  }

  try {
    const emailContent = await buildPurchaseConfirmationEmail(client, purchase);
    const result = await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `Behavior School <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: purchase.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    await writeEmailLog(client, {
      templateName: PURCHASE_CONFIRMATION_TEMPLATE,
      recipientEmail: purchase.email,
      recipientName: purchase.fullName,
      subject: emailContent.subject,
      status: "sent",
      mailgunId: result.id,
      metadata: {
        stripeSessionId: purchase.stripeSessionId,
        stripePaymentIntentId: purchase.stripePaymentIntentId,
        logType: "purchase_confirmation_email",
        amountCents: purchase.amountCents,
        currency: purchase.currency,
      },
    });

    return { status: "sent" };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error";
    await writeEmailLog(client, {
      templateName: PURCHASE_CONFIRMATION_TEMPLATE,
      recipientEmail: purchase.email,
      recipientName: purchase.fullName,
      subject: `Purchase confirmation failed — ${purchase.productName}`,
      status: "failed",
      errorMessage,
      metadata: {
        stripeSessionId: purchase.stripeSessionId,
        logType: "purchase_confirmation_email",
        amountCents: purchase.amountCents,
        currency: purchase.currency,
      },
    });
    return { status: "failed", errorMessage };
  }
}

async function writePurchaseAudit(
  client: SupabaseClient | null,
  purchase: PurchaseContext,
  emailStatus: { status: "sent" | "failed" | "skipped"; errorMessage?: string },
): Promise<void> {
  await writeEmailLog(client, {
    templateName: PURCHASE_AUDIT_TEMPLATE,
    recipientEmail: purchase.email,
    recipientName: purchase.fullName,
    subject: `Transformation Program purchase recorded — ${purchase.amountDisplay}`,
    status: "processed",
    errorMessage: emailStatus.errorMessage,
    metadata: {
      logType: "purchase",
      stripeSessionId: purchase.stripeSessionId,
      stripePaymentIntentId: purchase.stripePaymentIntentId,
      stripeCustomerId: purchase.stripeCustomerId,
      paymentLinkId: purchase.paymentLinkId,
      amountCents: purchase.amountCents,
      amountDisplay: purchase.amountDisplay,
      currency: purchase.currency,
      productName: purchase.productName,
      lineItemDescriptions: purchase.lineItemDescriptions,
      confirmationEmailStatus: emailStatus.status,
      processedAt: new Date().toISOString(),
    },
  });
}

async function updateCrm(purchase: PurchaseContext): Promise<void> {
  const crmData = await readCrmData();
  const contactIndex = crmData.contacts.findIndex((contact) => contact.email.toLowerCase() === purchase.email);
  const now = new Date().toISOString();
  const note = `Purchased ${purchase.productName} (${purchase.amountDisplay}) via Stripe session ${purchase.stripeSessionId} on ${now}.`;

  if (contactIndex >= 0) {
    const existing = crmData.contacts[contactIndex];
    crmData.contacts[contactIndex] = {
      ...existing,
      name: existing.name || purchase.fullName,
      type: "customer",
      status: "converted",
      source: existing.source || "website",
      tags: Array.from(new Set([...(existing.tags || []), "customer", "transformation-program"])),
      notes: appendNote(existing.notes || "", note),
      lastContactDate: now,
      updatedAt: now,
      stripeCustomerId: purchase.stripeCustomerId || existing.stripeCustomerId,
      revenue: Number(existing.revenue || 0) + purchase.amountCents / 100,
      programInterest: existing.programInterest || "Transformation Program",
    };
  } else {
    const maxId = crmData.contacts.length > 0
      ? Math.max(...crmData.contacts.map((contact) => Number.parseInt(contact.id, 10)).filter(Number.isFinite))
      : 0;

    crmData.contacts.push({
      id: String(maxId + 1),
      name: purchase.fullName,
      email: purchase.email,
      phone: null,
      company: null,
      role: null,
      type: "customer",
      source: "website",
      status: "converted",
      tags: ["customer", "transformation-program"],
      notes: note,
      lastContactDate: now,
      followUpDate: null,
      linkedInUrl: null,
      programInterest: "Transformation Program",
      createdAt: now,
      updatedAt: now,
      stripeCustomerId: purchase.stripeCustomerId,
      revenue: purchase.amountCents / 100,
    });
  }

  await writeCrmData(crmData);
}

async function sendTransformationWelcomeEmail(purchase: PurchaseContext): Promise<void> {
  if (!EMAIL_WORKER_KEY) {
    console.warn("[Stripe Webhook] EMAIL_WORKER_INTERNAL_KEY not set — skipping welcome email");
    return;
  }

  try {
    const res = await fetch(`${EMAIL_WORKER_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMAIL_WORKER_KEY}`,
      },
      body: JSON.stringify({
        to: purchase.email,
        template: "transformation_welcome",
        templateData: {
          name: purchase.firstName || "there",
          portalUrl: `${SITE_URL}/dashboard`,
          purchasedAt: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[Stripe Webhook] Welcome email failed:", res.status, text);
    } else {
      console.log("[Stripe Webhook] Welcome email sent to", purchase.email);
    }
  } catch (error) {
    console.error("[Stripe Webhook] Welcome email request failed:", error);
  }
}

async function processCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const amount = session.amount_total || 0;
  const email = normalizeEmail(session.customer_email || session.customer_details?.email) || "Unknown";
  const baseProduct = session.metadata?.product || "BehaviorSchool";

  await sendTelegram(
    `🎉 <b>NEW SALE!</b>\n\n` +
      `💰 Amount: <b>${formatMoney(amount, session.currency || "usd")}</b>\n` +
      `📧 Customer: ${email}\n` +
      `📦 Product: ${baseProduct}\n` +
      `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
  );

  if (session.metadata?.registration_id) {
    return;
  }

  const purchase = await resolvePurchaseContext(session);
  if (!purchase) {
    console.log("[Stripe Webhook] Checkout session did not match Transformation Program provisioning rules");
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (await hasPurchaseAudit(supabase, purchase.stripeSessionId)) {
    console.log(`[Stripe Webhook] Purchase ${purchase.stripeSessionId} already processed`);
    return;
  }

  await provisionCheckoutAccess(supabase, purchase);
  const [emailStatus] = await Promise.all([
    sendPurchaseConfirmationEmail(supabase, purchase),
    sendTransformationWelcomeEmail(purchase),
  ]);
  await writePurchaseAudit(supabase, purchase, emailStatus);

  try {
    await updateCrm(purchase);
  } catch (error) {
    console.error("[Stripe Webhook] CRM update failed:", error);
  }

  await sendTelegram(
    `✅ <b>TRANSFORMATION PROGRAM PROVISIONED</b>\n\n` +
      `📧 Customer: ${purchase.email}\n` +
      `💰 Amount: <b>${purchase.amountDisplay}</b>\n` +
      `📦 Product: ${purchase.productName}\n` +
      `🔓 Checkout access: provisioned\n` +
      `✉️ Confirmation email: ${emailStatus.status}${emailStatus.errorMessage ? ` (${emailStatus.errorMessage})` : ""}`,
  );
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const body = event.body || "";

  let stripeEvent: Stripe.Event;

  if (!WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return { statusCode: 500, body: "Webhook not configured" };
  }

  if (!sig) {
    return { statusCode: 400, body: "Missing stripe-signature header" };
  }

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown signature error";
    console.error("[Stripe Webhook] Signature verification failed:", message);
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  console.log(`[Stripe Webhook] Received: ${stripeEvent.type}`);

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        await processCheckoutSessionCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let email = "Unknown";

        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted) {
            email = (customer as Stripe.Customer).email || "Unknown";
          }
        } catch {}

        const amount = subscription.items.data[0]?.price?.unit_amount || 0;
        const interval = subscription.items.data[0]?.price?.recurring?.interval || "month";

        await sendTelegram(
          `🔔 <b>NEW SUBSCRIPTION!</b>\n\n` +
            `💰 Amount: <b>${formatMoney(amount)}/${interval}</b>\n` +
            `📧 Customer: ${email}\n` +
            `📊 Status: ${subscription.status}\n` +
            `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let email = "Unknown";

        try {
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !customer.deleted) {
            email = (customer as Stripe.Customer).email || "Unknown";
          }
        } catch {}

        await sendTelegram(
          `😢 <b>SUBSCRIPTION CANCELLED</b>\n\n` +
            `📧 Customer: ${email}\n` +
            `📉 Reason: ${subscription.cancellation_details?.reason || "Not specified"}\n` +
            `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        const email = invoice.customer_email || "Unknown";
        const amount = invoice.amount_due || 0;

        await sendTelegram(
          `⚠️ <b>PAYMENT FAILED</b>\n\n` +
            `💰 Amount: ${formatMoney(amount)}\n` +
            `📧 Customer: ${email}\n` +
            `❌ Reason: ${invoice.last_finalization_error?.message || "Unknown"}\n` +
            `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
        );
        break;
      }

      case "invoice.paid": {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        if (invoice.billing_reason === "subscription_cycle") {
          const email = invoice.customer_email || "Unknown";
          const amount = invoice.amount_paid || 0;

          await sendTelegram(
            `💳 <b>RECURRING PAYMENT</b>\n\n` +
              `💰 Amount: ${formatMoney(amount)}\n` +
              `📧 Customer: ${email}\n` +
              `🔄 Billing cycle payment received\n` +
              `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
          );
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${stripeEvent.type}`);
    }
  } catch (error) {
    console.error("[Stripe Webhook] Processing failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        received: false,
        type: stripeEvent.type,
        error: error instanceof Error ? error.message : "Unknown processing error",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true, type: stripeEvent.type }),
  };
};

export { handler };
