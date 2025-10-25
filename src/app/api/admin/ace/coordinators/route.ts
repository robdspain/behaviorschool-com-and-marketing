import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/ace/coordinators
 * Fetch all ACE coordinators with certification status
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch providers with coordinator information
    const { data, error } = await supabase
      .from('ace_providers')
      .select(`
        id,
        provider_name,
        coordinator_id,
        coordinator_years_certified,
        coordinator_certification_date,
        coordinator_certification_expires,
        coordinator_certification_verified,
        can_publish_events,
        can_issue_certificates,
        is_active
      `)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching coordinators:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch coordinator user details
    const coordinatorIds = data.map(p => p.coordinator_id);
    const { data: users, error: usersError } = await supabase
      .from('ace_users')
      .select('id, first_name, last_name, email, bacb_id')
      .in('id', coordinatorIds);

    if (usersError) {
      console.error('Error fetching coordinator users:', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Combine data
    const coordinators = data.map(provider => {
      const user = users?.find(u => u.id === provider.coordinator_id);
      return {
        id: provider.id,
        provider_id: provider.id,
        provider_name: provider.provider_name,
        coordinator_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        coordinator_email: user?.email || '',
        certification_number: user?.bacb_id || '',
        certification_date: provider.coordinator_certification_date || '',
        certification_expires: provider.coordinator_certification_expires || '',
        certification_verified: provider.coordinator_certification_verified || false,
        years_certified: provider.coordinator_years_certified || 0,
        is_active: provider.is_active,
        can_publish_events: provider.can_publish_events !== false,
        can_issue_certificates: provider.can_issue_certificates !== false,
      };
    });

    // Sort by expiration date (soonest first)
    coordinators.sort((a, b) => {
      const dateA = new Date(a.certification_expires).getTime();
      const dateB = new Date(b.certification_expires).getTime();
      return dateA - dateB;
    });

    return NextResponse.json({ data: coordinators });
  } catch (error) {
    console.error('Error in GET /api/admin/ace/coordinators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/ace/coordinators
 * Update coordinator certification status
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      coordinator_id,
      certification_verified,
      verified_at,
      certification_date,
      certification_expires,
      can_publish_events,
      can_issue_certificates,
    } = body;

    if (!coordinator_id) {
      return NextResponse.json(
        { error: 'coordinator_id (provider_id) is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: Record<string, unknown> = {};

    if (certification_verified !== undefined) {
      updates.coordinator_certification_verified = certification_verified;
    }

    if (verified_at !== undefined) {
      updates.coordinator_certification_verified_at = verified_at;
    }

    if (certification_date !== undefined) {
      updates.coordinator_certification_date = certification_date;
    }

    if (certification_expires !== undefined) {
      updates.coordinator_certification_expires = certification_expires;
      
      // Auto-block operations if certification is expired
      const today = new Date();
      const expiresDate = new Date(certification_expires);
      if (expiresDate < today) {
        updates.can_publish_events = false;
        updates.can_issue_certificates = false;
        updates.lapse_start_date = today.toISOString();
      }
    }

    if (can_publish_events !== undefined) {
      // Don't allow enabling if certification is expired
      const { data: provider } = await supabase
        .from('ace_providers')
        .select('coordinator_certification_expires')
        .eq('id', coordinator_id)
        .single();

      if (provider && provider.coordinator_certification_expires) {
        const today = new Date();
        const expires = new Date(provider.coordinator_certification_expires);
        if (expires < today && can_publish_events) {
          return NextResponse.json(
            { error: 'Cannot enable operations: coordinator certification has expired' },
            { status: 400 }
          );
        }
      }

      updates.can_publish_events = can_publish_events;
    }

    if (can_issue_certificates !== undefined) {
      // Same check for certificate issuance
      const { data: provider } = await supabase
        .from('ace_providers')
        .select('coordinator_certification_expires')
        .eq('id', coordinator_id)
        .single();

      if (provider && provider.coordinator_certification_expires) {
        const today = new Date();
        const expires = new Date(provider.coordinator_certification_expires);
        if (expires < today && can_issue_certificates) {
          return NextResponse.json(
            { error: 'Cannot enable operations: coordinator certification has expired' },
            { status: 400 }
          );
        }
      }

      updates.can_issue_certificates = can_issue_certificates;
    }

    // Update the provider
    const { data, error } = await supabase
      .from('ace_providers')
      .update(updates)
      .eq('id', coordinator_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating coordinator:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/ace/coordinators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

