export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/convex-newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await subscribeToNewsletter({
      email: body.email,
      name: body.name,
      source: body.source || 'blog',
      page: body.page,
      tags: ['blog-signup'],
    });

    return NextResponse.json({
      message: result.message,
      isNew: result.isNew ?? true,
      status: result.status,
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    if (error instanceof Error && error.message === 'invalid_email') {
      return NextResponse.json(
        { message: 'Valid email required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
