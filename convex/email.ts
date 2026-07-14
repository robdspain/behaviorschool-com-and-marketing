import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const PAYMENT_TEMPLATE_NAME = "transformation_payment_link";

const DEFAULT_PAYMENT_TEMPLATE = {
  name: PAYMENT_TEMPLATE_NAME,
  description: "Sent manually after a discovery call to provide checkout access",
  subject: "Your payment link for the School BCBA Transformation Program",
  category: "payment",
  sendDelayMinutes: 0,
  isActive: true,
  archived: false,
  bodyText: `Hi \${firstName},

Thank you for taking the time to speak with us about the School BCBA Transformation Program.

You can access the payment page here:
https://behaviorschool.com/transformation-program/checkout

Your access credentials:
- Email: \${email}
- Password: \${password}

Next steps:
- Open the payment page
- Enter your email and password when prompted
- Complete your secure payment through Stripe

If anything does not work at checkout, reply to this email and I will help.

Rob Spain
Behavior School`,
  bodyHtml: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f8fafc;color:#334155;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;color:#0f172a;font-size:24px;">School BCBA Transformation Program</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi \${firstName},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thank you for taking the time to speak with us about the School BCBA Transformation Program.</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">You can access the payment page here:</p>
              <p style="margin:0 0 24px;">
                <a href="https://behaviorschool.com/transformation-program/checkout" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700;">Open payment page</a>
              </p>
              <div style="margin:0 0 24px;padding:16px;border-radius:8px;background:#fef3c7;border:1px solid #fbbf24;">
                <p style="margin:0 0 8px;color:#78350f;font-weight:700;">Your access credentials</p>
                <p style="margin:0;color:#78350f;">Email: <strong>\${email}</strong></p>
                <p style="margin:8px 0 0;color:#78350f;">Password: <strong>\${password}</strong></p>
              </div>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">If anything does not work at checkout, reply to this email and I will help.</p>
              <p style="margin:24px 0 0;font-size:16px;line-height:1.6;">Rob Spain<br>Behavior School</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getTemplateByNameInternal(ctx: any, name: string) {
  return ctx.db
    .query("emailTemplates")
    .withIndex("by_name", (q: any) => q.eq("name", name))
    .first();
}

async function ensurePaymentTemplate(ctx: any) {
  const existing = await getTemplateByNameInternal(ctx, PAYMENT_TEMPLATE_NAME);
  if (existing) return existing;

  const timestamp = nowIso();
  const id = await ctx.db.insert("emailTemplates", {
    ...DEFAULT_PAYMENT_TEMPLATE,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  return ctx.db.get(id);
}

export const ensureDefaultTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const paymentTemplate = await ensurePaymentTemplate(ctx);
    return { paymentTemplateId: paymentTemplate?._id };
  },
});

export const listTemplates = query({
  args: {
    showArchived: v.optional(v.boolean()),
    category: v.optional(v.string()),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let templates = await ctx.db.query("emailTemplates").collect();

    if (!args.showArchived) {
      templates = templates.filter((template) => !template.archived);
    }
    if (args.category) {
      templates = templates.filter((template) => template.category === args.category);
    }
    if (args.activeOnly) {
      templates = templates.filter((template) => template.isActive);
    }

    return templates.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.sendDelayMinutes - b.sendDelayMinutes;
    });
  },
});

export const getTemplate = query({
  args: { id: v.id("emailTemplates") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const getTemplateByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return getTemplateByNameInternal(ctx, args.name);
  },
});

export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    category: v.optional(v.string()),
    sendDelayMinutes: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await getTemplateByNameInternal(ctx, args.name);
    if (existing) throw new Error("A template with this name already exists");

    const timestamp = nowIso();
    return ctx.db.insert("emailTemplates", {
      name: args.name,
      description: args.description,
      subject: args.subject,
      bodyText: args.bodyText,
      bodyHtml: args.bodyHtml,
      category: args.category || "signup",
      sendDelayMinutes: args.sendDelayMinutes ?? 0,
      isActive: args.isActive ?? true,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateTemplate = mutation({
  args: {
    id: v.id("emailTemplates"),
    name: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    bodyText: v.optional(v.string()),
    bodyHtml: v.optional(v.string()),
    category: v.string(),
    sendDelayMinutes: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: nowIso(),
    });
    return ctx.db.get(id);
  },
});

export const setTemplateArchived = mutation({
  args: {
    id: v.id("emailTemplates"),
    archived: v.boolean(),
    archivedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      archived: args.archived,
      archivedAt: args.archived ? nowIso() : undefined,
      archivedBy: args.archived ? args.archivedBy || "Admin" : undefined,
      updatedAt: nowIso(),
    });
    return ctx.db.get(args.id);
  },
});

export const deleteTemplate = mutation({
  args: { id: v.id("emailTemplates") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const logEmail = mutation({
  args: {
    templateId: v.optional(v.id("emailTemplates")),
    templateName: v.optional(v.string()),
    recipientEmail: v.string(),
    recipientName: v.optional(v.string()),
    subject: v.string(),
    status: v.string(),
    sentAt: v.optional(v.string()),
    sentBy: v.optional(v.string()),
    mailgunId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    return ctx.db.insert("emailLogs", {
      ...args,
      recipientEmail: normalizeEmail(args.recipientEmail),
      sentAt: args.sentAt || (args.status === "sent" ? timestamp : undefined),
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const listEmailLogs = query({
  args: {
    email: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 500);
    let logs = args.email
      ? await ctx.db
          .query("emailLogs")
          .withIndex("by_recipient_email", (q: any) => q.eq("recipientEmail", normalizeEmail(args.email!)))
          .collect()
      : await ctx.db.query("emailLogs").collect();

    return logs
      .sort((a, b) => (b.sentAt || b.createdAt).localeCompare(a.sentAt || a.createdAt))
      .slice(0, limit);
  },
});

export const templateStats = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query("emailTemplates").collect();
    const visible = templates.filter((template) => !template.archived);
    const active = visible.filter((template) => template.isActive);
    return {
      totalTemplates: visible.length,
      activeTemplates: active.length,
      draftTemplates: Math.max(visible.length - active.length, 0),
    };
  },
});

export const recentTemplateActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return (await ctx.db.query("emailTemplates").collect())
      .filter((template) => !template.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, Math.min(args.limit ?? 5, 25));
  },
});
