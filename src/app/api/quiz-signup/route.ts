import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, score, answers } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Store in Supabase email_leads table
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from("email_leads").upsert(
        {
          email: email.toLowerCase().trim(),
          source: "bcba-readiness-quiz",
          score,
          metadata: { firstName, answers },
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Quiz signup Supabase error:", error);
      }
    } else {
      console.log("Quiz signup (no Supabase):", { email, firstName, score });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quiz signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
