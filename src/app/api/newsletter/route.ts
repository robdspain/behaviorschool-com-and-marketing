export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://quixotic-fox-157.convex.cloud";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Subscribe via Convex HTTP API
    const convexResponse = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: "newsletter:subscribeToNewsletter",
        args: {
          email: email.toLowerCase().trim(),
          name: name || undefined,
          source: source || "blog",
          tags: ["blog-signup"],
        },
      }),
    });

    if (!convexResponse.ok) {
      const errorText = await convexResponse.text();
      console.error('Convex error:', errorText);
      throw new Error('Failed to subscribe');
    }

    const result = await convexResponse.json();

    return NextResponse.json(
      { 
        message: 'Successfully subscribed',
        isNew: result?.value?.isNew ?? true,
      },
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

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
