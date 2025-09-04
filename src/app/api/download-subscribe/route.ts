import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, resource, source } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Log the subscription for immediate visibility
    console.log('📥 NEW DOWNLOAD SUBSCRIPTION:', {
      email: email,
      resource: resource || 'unknown',
      source: source || 'unknown',
      timestamp: new Date().toLocaleString(),
      message: 'User subscribed for download access'
    });

    // Here you can integrate with your email service
    // For example, add to Mailgun mailing list, Supabase, etc.

    // Example: Save to a simple log or database
    // You could also integrate with Mailchimp, ConvertKit, etc.

    return NextResponse.json({
      success: true,
      message: 'Subscription recorded successfully'
    });

  } catch (error) {
    console.error('Download subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}