export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { sendEmailViaMailgun } from "@/lib/nm-mail";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCheckoutEmail(firstName: string, checkoutLink: string) {
  const safeFirstName = escapeHtml(firstName || "there");
  const safeCheckoutLink = escapeHtml(checkoutLink);

  const subject = "Transformation Program payment options";
  const text = `Hi ${firstName || "there"},

Thank you again for taking the time to talk today.

The payment options we discussed for the Transformation Program are here:
${checkoutLink}

You can use that page to choose the pay-in-full option or the three-payment option.

If anything does not work at checkout, reply to this email and I will help.

Rob Spain, BCBA
Behavior School`;

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${safeFirstName},</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thank you again for taking the time to talk today.</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">The payment options we discussed for the Transformation Program are here.</p>
                <p style="margin:0 0 24px;text-align:center;">
                  <a href="${safeCheckoutLink}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:8px;">Open payment options</a>
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">You can use that page to choose the pay-in-full option or the three-payment option.</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">If anything does not work at checkout, reply to this email and I will help.</p>
                <p style="margin:0;font-size:16px;line-height:1.6;">Rob Spain, BCBA<br />Behavior School</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;border-radius:0 0 12px 12px;">
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Button not working? Copy and paste this link into your browser:<br /><a href="${safeCheckoutLink}" style="color:#047857;word-break:break-all;">${safeCheckoutLink}</a></p>
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.recipient || !body.checkoutLink) {
      return NextResponse.json(
        { message: "Recipient and checkout link are required" },
        { status: 400 }
      );
    }

    const firstName = String(body.firstName || "").trim();
    const email = buildCheckoutEmail(firstName, body.checkoutLink);
    const subject = body.subject || email.subject;
    const sent = await sendEmailViaMailgun({
      to: body.recipient,
      subject,
      html: email.html,
      text: email.text,
      from: process.env.MAILGUN_FROM_EMAIL
        ? `Behavior School <${process.env.MAILGUN_FROM_EMAIL}>`
        : undefined,
    });

    if (!sent.ok) {
      await getConvexClient().mutation(api.crm.logCheckoutFollowUpFailed, {
        discoveryCallId: id,
        recipient: body.recipient,
        subject,
        checkoutLink: body.checkoutLink,
        errorMessage: typeof sent.body === "string" ? sent.body : JSON.stringify(sent.body || {}),
      });

      return NextResponse.json(
        { message: "Failed to send checkout follow-up email", details: sent.body },
        { status: 502 }
      );
    }

    const result = await getConvexClient().mutation(api.crm.logCheckoutFollowUpSent, {
      discoveryCallId: id,
      recipient: body.recipient,
      subject,
      checkoutLink: body.checkoutLink,
      sentAt: body.sentAt || new Date().toISOString(),
      providerMessageId: typeof sent.body === "string" ? sent.body : undefined,
    });

    return NextResponse.json({ ...result, sent: true }, { status: 200 });
  } catch (error) {
    console.error("Error logging checkout follow-up:", error);
    return NextResponse.json({ message: "Failed to log checkout follow-up" }, { status: 500 });
  }
}
