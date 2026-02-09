import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, category } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    // Log to console for now (Netlify function logs)
    console.log("=== SUPPORT REQUEST ===");
    console.log(`Name: ${name || "Not provided"}`);
    console.log(`Email: ${email}`);
    console.log(`Category: ${category || "general"}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("=======================");

    // Try Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== "placeholder") {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Behavior School Support <support@behaviorschool.com>",
            to: ["robspain@gmail.com"],
            subject: `[Support] ${category || "General"}: ${(message || "").slice(0, 60)}`,
            html: `
              <h2>New Support Request</h2>
              <p><strong>From:</strong> ${name || "Not provided"} (${email})</p>
              <p><strong>Category:</strong> ${category || "General"}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left:3px solid #10b981;padding-left:12px;color:#334155;">
                ${(message || "").replace(/\n/g, "<br>")}
              </blockquote>
              <p style="color:#94a3b8;font-size:12px;">
                Sent from behaviorschool.com/support at ${new Date().toISOString()}
              </p>
            `,
            reply_to: email,
          }),
        });
      } catch (emailErr) {
        console.error("Resend email failed:", emailErr);
        // Don't fail the request — message is logged
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Support form error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
