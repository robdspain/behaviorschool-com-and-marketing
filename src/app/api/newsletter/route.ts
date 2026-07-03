export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await subscribeToNewsletter({
      email: body.email,
      name: body.name,
      source: body.source || 'behaviorschool.com',
      page: body.page,
      tags: ['blog-signup'],
    });

    return NextResponse.json(
      { 
        message: result.message,
        isNew: result.isNew ?? true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    if (error instanceof Error && error.message === 'invalid_email') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

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
