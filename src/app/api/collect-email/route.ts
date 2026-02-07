import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, source, score, total } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Try Supabase first
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("email_leads").upsert(
        {
          email: email.toLowerCase().trim(),
          source: source || "free-bcba-practice",
          score,
          total,
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Supabase insert error:", error);
        // Fall through to success — don't block the user
      }
    } else {
      // Log for manual follow-up if Supabase isn't configured
      console.log("EMAIL_LEAD:", JSON.stringify({ email, source, score, total, ts: Date.now() }));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("collect-email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
