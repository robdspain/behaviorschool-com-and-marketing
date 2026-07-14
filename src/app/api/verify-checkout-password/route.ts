export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, email } = body;

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await getConvexClient().mutation(api.checkoutAccess.verifyAccess, {
      password: password || undefined,
      email: email || undefined,
      ipAddress,
      userAgent,
    });

    if (result.accessGranted) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: result.message },
      { status: 401 }
    );
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
