export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/convex-newsletter';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const result = await subscribeToNewsletter({
      email: normalizedEmail,
      name,
      source: source || 'website',
      page: request.headers.get('referer') || undefined,
      tags: ['pending-confirmation'],
    });

    return NextResponse.json({ 
      success: true, 
      isNew: result.isNew,
      status: result.status,
      message: result.message,
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
