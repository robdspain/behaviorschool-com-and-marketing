import { NextRequest, NextResponse } from 'next/server';
import { createAceUser, getAceUserByEmail } from '@/lib/ace/queries';
import type { AceUserFormData } from '@/lib/ace/types';

/**
 * GET /api/ace/users
 * Get user by email (query param)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const user = await getAceUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/users
 * Create new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceUserFormData;

    const user = await createAceUser(body);

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('User POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
