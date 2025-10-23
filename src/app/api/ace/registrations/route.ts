import { NextRequest, NextResponse } from 'next/server';
import { createAceRegistration } from '@/lib/ace/queries';
import type { AceRegistrationFormData } from '@/lib/ace/types';

/**
 * POST /api/ace/registrations
 * Register user for event
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceRegistrationFormData;

    const registration = await createAceRegistration(body);

    return NextResponse.json({
      success: true,
      data: registration,
      message: 'Registration created successfully',
    });
  } catch (error) {
    console.error('Registration POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}
