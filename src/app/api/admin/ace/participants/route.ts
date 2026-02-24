export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/ace/participants
 * Fetch all ACE participants (users with role 'participant')
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ace_users')
      .select('*')
      .eq('role', 'participant')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching participants:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/admin/ace/participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/ace/participants
 * Update participant credential information
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      user_id,
      credential_type,
      credential_number,
      credential_verified,
      credential_verified_at,
      credential_expires_at,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (credential_type !== undefined) {
      updates.credential_type = credential_type;
    }

    if (credential_number !== undefined) {
      updates.credential_number = credential_number;
    }

    if (credential_verified !== undefined) {
      updates.credential_verified = credential_verified;
      
      // Set verification timestamp if verifying
      if (credential_verified && credential_verified_at) {
        updates.credential_verified_at = credential_verified_at;
      } else if (!credential_verified) {
        updates.credential_verified_at = null;
      }
    }

    if (credential_expires_at !== undefined) {
      updates.credential_expires_at = credential_expires_at;
    }

    // Update the user
    const { data, error } = await supabase
      .from('ace_users')
      .update(updates)
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating participant:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/ace/participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ace/participants
 * Create a new ACE participant
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      credential_type,
      credential_number,
      phone,
      organization,
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'first_name, last_name, and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('ace_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Create new participant
    const { data, error } = await supabase
      .from('ace_users')
      .insert({
        first_name,
        last_name,
        email,
        role: 'participant',
        credential_type: credential_type || 'pending',
        credential_number,
        phone,
        organization,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating participant:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/ace/participants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

