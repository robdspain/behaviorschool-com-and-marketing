import type { Handler, HandlerEvent } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8181098703";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const body = event.body || "";

  let stripeEvent: Stripe.Event;

  // Verify webhook signature if secret is configured
  if (WEBHOOK_SECRET && sig) {
    try {
      stripeEvent = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }
  } else {
    // For testing without signature verification
    try {
      stripeEvent = JSON.parse(body) as Stripe.Event;
    } catch {
      return { statusCode: 400, body: "Invalid JSON" };
    }
  }

  console.log(`[Stripe Webhook] Received: ${stripeEvent.type}`);

  // Handle different event types
  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const amount = session.amount_total || 0;
      const email = session.customer_email || session.customer_details?.email || "Unknown";
      const product = session.metadata?.product || "BehaviorSchool";
      
      await sendTelegram(
        `🎉 <b>NEW SALE!</b>\n\n` +
        `💰 Amount: <b>${formatMoney(amount)}</b>\n` +
        `📧 Customer: ${email}\n` +
        `📦 Product: ${product}\n` +
        `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`
      );
      break;
    }

    case "customer.subscription.created": {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Try to get customer email
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
        `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`
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
        `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`
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
        `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`
      );
      break;
    }

    case "invoice.paid": {
      const invoice = stripeEvent.data.object as Stripe.Invoice;
      // Only notify for recurring payments (not first subscription payment which triggers checkout.session.completed)
      if (invoice.billing_reason === "subscription_cycle") {
        const email = invoice.customer_email || "Unknown";
        const amount = invoice.amount_paid || 0;
        
        await sendTelegram(
          `💳 <b>RECURRING PAYMENT</b>\n\n` +
          `💰 Amount: ${formatMoney(amount)}\n` +
          `📧 Customer: ${email}\n` +
          `🔄 Billing cycle payment received\n` +
          `🕐 Time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`
        );
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true, type: stripeEvent.type }),
  };
};

export { handler };
