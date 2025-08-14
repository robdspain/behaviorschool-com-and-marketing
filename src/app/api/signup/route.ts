import { NextRequest, NextResponse } from "next/server";

// In a production environment, you would store this in a database
// For now, we'll use a simple in-memory store or you can integrate with services like:
// - Supabase, Firebase, MongoDB
// - Email services like SendGrid, Mailchimp, ConvertKit
// - Or save to a local JSON file

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send to email service (Mailchimp, SendGrid, etc.)
    // 3. Send a welcome email
    
    // Example with console log for now:
    console.log(`New signup: ${email}`);
    
    // If you want to integrate with an email service, uncomment and configure:
    /*
    // Example with SendGrid:
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: 'noreply@behaviorschool.com',
      subject: 'Welcome to Behavior School!',
      text: 'Thank you for joining our waitlist. We\'ll notify you as soon as we launch!',
      html: '<strong>Thank you for joining our waitlist. We\'ll notify you as soon as we launch!</strong>',
    };
    
    await sgMail.send(msg);
    */
    
    // Example with saving to a JSON file (for development):
    /*
    import fs from 'fs/promises';
    import path from 'path';
    
    const dataPath = path.join(process.cwd(), 'data', 'signups.json');
    let signups = [];
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      signups = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }
    
    signups.push({
      email,
      timestamp: new Date().toISOString(),
    });
    
    await fs.writeFile(dataPath, JSON.stringify(signups, null, 2));
    */

    // Return success response
    return NextResponse.json(
      { 
        message: "Successfully signed up!",
        email 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}