import { internalAction } from "./_generated/server";
import { v } from "convex/values";

type StripeSubscription = {
  id: string;
  cancel_at: number | null;
  metadata?: Record<string, string>;
  items?: {
    data?: Array<{
      current_period_start?: number;
    }>;
  };
};

function getBillingKey() {
  const key = process.env.STRIPE_BILLING_SECRET_KEY;
  if (!key || !/^(sk|rk)_(test|live)_/.test(key)) {
    throw new Error("STRIPE_BILLING_SECRET_KEY is not configured for Convex.");
  }
  return key;
}

async function stripeRequest(path: string, init?: RequestInit) {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getBillingKey()}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Stripe billing request failed with status ${response.status}.`);
  }

  return response.json() as Promise<StripeSubscription>;
}

function addUtcMonths(timestampSeconds: number, months: number) {
  const start = new Date(timestampSeconds * 1000);
  const target = new Date(start);
  target.setUTCMonth(target.getUTCMonth() + months);
  return Math.floor(target.getTime() / 1000);
}

export const scheduleThreePaymentPlanCancellation = internalAction({
  args: {
    stripeSubscriptionId: v.string(),
  },
  returns: v.object({
    scheduled: v.boolean(),
    cancelAt: v.union(v.number(), v.null()),
  }),
  handler: async (_ctx, args) => {
    const subscription = await stripeRequest(`/subscriptions/${args.stripeSubscriptionId}`);
    if (subscription.metadata?.program !== "transformation_program") {
      return { scheduled: false, cancelAt: null };
    }

    if (subscription.cancel_at) {
      return { scheduled: false, cancelAt: subscription.cancel_at };
    }

    const periodStart = subscription.items?.data?.[0]?.current_period_start;
    if (!periodStart) {
      throw new Error("Stripe subscription does not include a current billing period start.");
    }

    const cancelAt = addUtcMonths(periodStart, 3);
    const body = new URLSearchParams({
      cancel_at: String(cancelAt),
      "metadata[program]": "transformation_program",
      "metadata[checkout_option]": "installments",
      "metadata[installment_total_payments]": "3",
      "metadata[installment_cancel_at]": String(cancelAt),
    });

    await stripeRequest(`/subscriptions/${args.stripeSubscriptionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    return { scheduled: true, cancelAt };
  },
});

export const confirmTransformationSubscription = internalAction({
  args: { stripeSubscriptionId: v.string() },
  returns: v.object({ confirmed: v.boolean() }),
  handler: async (_ctx, args) => {
    const subscription = await stripeRequest(`/subscriptions/${args.stripeSubscriptionId}`);
    return { confirmed: subscription.metadata?.program === "transformation_program" };
  },
});
