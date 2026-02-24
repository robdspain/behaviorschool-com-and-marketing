export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Path to the subscribers file
    const dataDir = path.join(process.cwd(), 'data');
    const subscribersFile = path.join(dataDir, 'newsletter-subscribers.json');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing subscribers or initialize empty array
    let subscribers: { email: string; subscribedAt: string }[] = [];
    if (fs.existsSync(subscribersFile)) {
      const fileContent = fs.readFileSync(subscribersFile, 'utf-8');
      subscribers = JSON.parse(fileContent);
    }

    // Check if email already exists
    const exists = subscribers.some((sub) => sub.email === email);
    if (!exists) {
      // Add new subscriber
      subscribers.push({
        email,
        subscribedAt: new Date().toISOString(),
      });

      // Write back to file
      fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    }

    return NextResponse.json(
      { message: 'Successfully subscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
