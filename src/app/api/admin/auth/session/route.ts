import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-config';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, picture, exp, token } = body;

    // Verify the email is authorized
    if (!isAuthorizedAdmin(email)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Create session data
    const sessionData = {
      email,
      name,
      picture,
      exp,
      token,
      createdAt: Date.now(),
    };

    // Set HttpOnly cookie with session data
    const cookie = serialize('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    const response = NextResponse.json(
      { success: true, message: 'Session created' },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear the session cookie
  const cookie = serialize('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  const response = NextResponse.json(
    { success: true, message: 'Session cleared' },
    { status: 200 }
  );

  response.headers.set('Set-Cookie', cookie);

  return response;
}
