export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { password, email } = body;

    // Get IP address and user agent for logging
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    let accessGranted = false;
    let accessType = '';
    let identifier = '';
    let errorMessage = '';

    // Method 1: Check if email is in approved users list
    if (email) {
      identifier = email;
      accessType = 'email';

      const { data: approvedUser, error: emailError } = await supabase
        .from('checkout_access')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (emailError && emailError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking approved users:', emailError);
      }

      // Check if user is approved and not expired
      if (approvedUser) {
        if (!approvedUser.expires_at || new Date(approvedUser.expires_at) > new Date()) {
          accessGranted = true;
        } else {
          errorMessage = 'Access expired';
        }
      }
    }

    // Method 2: Check password against stored master password
    if (!accessGranted && password) {
      identifier = password;
      accessType = 'password';

      const { data: setting, error: passwordError } = await supabase
        .from('checkout_settings')
        .select('setting_value')
        .eq('setting_key', 'checkout_password')
        .single();

      if (passwordError) {
        console.error('Error fetching checkout password:', passwordError);
        errorMessage = 'Configuration error';
      } else if (setting && password === setting.setting_value) {
        accessGranted = true;
      } else {
        errorMessage = 'Incorrect password';
      }
    }

    // Log the access attempt
    await supabase
      .from('checkout_access_logs')
      .insert({
        access_type: accessType || 'unknown',
        identifier: identifier || 'none',
        success: accessGranted,
        ip_address: ipAddress,
        user_agent: userAgent,
        error_message: errorMessage || null,
      });

    // Return response
    if (accessGranted) {
      return NextResponse.json(
        { message: 'Access granted' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: errorMessage || 'Access denied' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
