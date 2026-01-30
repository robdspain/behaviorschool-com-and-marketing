import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Valid email required' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    // Store newsletter subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        source: 'blog',
        subscribed_at: new Date().toISOString(),
        status: 'active'
      });

    if (error) {
      // If duplicate email, that's okay - return success anyway
      if (error.code === '23505') {
        return NextResponse.json({
          message: 'Already subscribed!'
        });
      }
      
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { message: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // TODO: Send welcome email via Mailgun
    // TODO: Add to Kit.com list if configured

    return NextResponse.json({
      message: 'Successfully subscribed!'
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
