import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

// `convex deploy` refreshes generated API references. Keep these typed as an
// internal route until local codegen has deployment credentials available.
const stripeBillingInternal = (internal as any).stripeBilling;

const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

type StripeEvent = {
  id: string;
  type: string;
  created: number;
  data: { object: Record<string, unknown> };
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.includes("@") ? email : null;
}

function parseName(value: unknown, email: string) {
  const name = typeof value === "string" ? value.trim() : "";
  if (name) {
    const [firstName, ...lastName] = name.split(/\s+/);
    return { firstName, lastName: lastName.join(" ") || undefined, fullName: name };
  }

  const firstName = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Participant";
  return { firstName, lastName: undefined, fullName: firstName };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function signatureParts(header: string) {
  const values = new Map<string, string[]>();
  for (const entry of header.split(",")) {
    const [key, value] = entry.split("=", 2);
    if (!key || !value) continue;
    const existing = values.get(key) ?? [];
    existing.push(value);
    values.set(key, existing);
  }
  return values;
}

function equalConstantTime(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureParts(signatureHeader);
  const timestamp = Number(parts.get("t")?.[0]);
  const signatures = parts.get("v1") ?? [];
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = hex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)));
  return signatures.some((signature) => equalConstantTime(digest, signature));
}

function invoiceSubscriptionId(invoice: Record<string, unknown>) {
  const direct = asString(invoice.subscription);
  if (direct) return direct;
  const parent = asRecord(invoice.parent);
  const subscriptionDetails = asRecord(parent.subscription_details);
  const subscription = subscriptionDetails.subscription;
  return asString(subscription) || asString(asRecord(subscription).id);
}

async function isTransformationSubscription(ctx: any, stripeSubscriptionId: string) {
  const result = await ctx.runAction(stripeBillingInternal.confirmTransformationSubscription, {
    stripeSubscriptionId,
  });
  return result.confirmed;
}

export const stripeWebhook = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!signingSecret || !signature) return json({ error: "Webhook configuration is incomplete" }, 503);

  const payload = await request.text();
  if (!(await verifyStripeSignature(payload, signature, signingSecret))) {
    return json({ error: "Invalid Stripe signature" }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return json({ error: "Invalid event payload" }, 400);
  }

  const object = asRecord(event.data?.object);
  const occurredAt = new Date(event.created * 1000).toISOString();

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const metadata = asRecord(object.metadata);
      const isTransformationPurchase = metadata.program === "transformation_program";
      const isPaid = object.payment_status === "paid";
      if (!isTransformationPurchase || !isPaid) return json({ received: true, ignored: true });

      const customerDetails = asRecord(object.customer_details);
      const email = normalizeEmail(object.customer_email) || normalizeEmail(customerDetails.email);
      const sessionId = asString(object.id);
      if (!email || !sessionId) return json({ error: "Paid checkout event is missing an email or session ID" }, 422);

      const { firstName, lastName, fullName } = parseName(customerDetails.name, email);
      const amountCents = typeof object.amount_total === "number" ? object.amount_total : 0;
      const checkoutOption = asString(metadata.checkout_option);
      const subscriptionId = asString(object.subscription);
      const result = await ctx.runMutation(internal.crm.recordTransformationPurchase, {
        stripeEventId: event.id,
        email,
        firstName,
        lastName,
        fullName,
        amountCents,
        amountDisplay: new Intl.NumberFormat("en-US", { style: "currency", currency: asString(object.currency) || "usd" }).format(amountCents / 100),
        stripeSessionId: sessionId,
        stripePaymentIntentId: asString(object.payment_intent),
        stripeCustomerId: asString(object.customer),
        stripeSubscriptionId: subscriptionId,
        paymentLinkId: asString(object.payment_link),
        checkoutOption,
        productName: asString(metadata.product) || "School BCBA Transformation Program",
        lineItemDescriptions: [],
        // Confirmed October public tuition sticker: $1,997.
        contractValueCents: 199700,
        purchasedAt: occurredAt,
      });

      if (!result.duplicate) {
        await ctx.runMutation(internal.checkoutAccess.grantForStripePurchase, {
          email,
          firstName,
          lastName,
          stripeSessionId: sessionId,
          productName: asString(metadata.product) || "School BCBA Transformation Program",
          purchasedAt: occurredAt,
        });
        await ctx.runMutation(internal.transformationNurture.markConvertedByEmail, {
          email,
          reason: "Transformation Program purchase completed in Stripe.",
        });
      }

      if (checkoutOption === "installments" && subscriptionId) {
        await ctx.scheduler.runAfter(0, stripeBillingInternal.scheduleThreePaymentPlanCancellation, {
          stripeSubscriptionId: subscriptionId,
        });
      }

      return json({ received: true });
    }

    if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const billingReason = asString(object.billing_reason);
      const stripeSubscriptionId = invoiceSubscriptionId(object);
      const stripeCustomerId = asString(object.customer);
      const stripeInvoiceId = asString(object.id);
      if (billingReason !== "subscription_cycle" || !stripeSubscriptionId || !stripeCustomerId || !stripeInvoiceId) {
        return json({ received: true, ignored: true });
      }
      if (!(await isTransformationSubscription(ctx, stripeSubscriptionId))) {
        return json({ received: true, ignored: true });
      }

      const shared = {
        stripeEventId: event.id,
        stripeInvoiceId,
        stripeCustomerId,
        stripeSubscriptionId,
        email: normalizeEmail(object.customer_email) || undefined,
        amountCents: typeof (event.type === "invoice.paid" ? object.amount_paid : object.amount_due) === "number"
          ? (event.type === "invoice.paid" ? object.amount_paid : object.amount_due) as number
          : 0,
        currency: asString(object.currency) || "usd",
      };
      if (event.type === "invoice.paid") {
        await ctx.runMutation(internal.crm.recordTransformationSubscriptionPayment, {
          ...shared,
          paidAt: occurredAt,
        });
      } else {
        await ctx.runMutation(internal.crm.recordTransformationPaymentFailure, {
          ...shared,
          failedAt: occurredAt,
        });
      }
    }

    return json({ received: true, ignored: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error instanceof Error ? error.message : "Unknown error");
    return json({ error: "Webhook processing failed" }, 500);
  }
});
