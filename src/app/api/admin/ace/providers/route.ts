export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/providers - List all providers
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ace_providers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/providers - Create a new provider
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.provider_name || !body.provider_type || !body.primary_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate coordinator years
    if (body.coordinator_years_certified < 5) {
      return NextResponse.json(
        { error: 'Coordinator must have at least 5 years certification' },
        { status: 400 }
      );
    }

    // Validate EIN for organizations
    if (body.provider_type === 'organization' && !body.ein) {
      return NextResponse.json(
        { error: 'EIN is required for organization providers' },
        { status: 400 }
      );
    }

    const providerData = {
      ...body,
      is_active: true,
      can_publish_events: true,
      can_issue_certificates: true,
      application_date: new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('ace_providers')
      .insert([providerData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/ace/providers - Update a provider
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing provider ID' },
        { status: 400 }
      );
    }

    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from('ace_providers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    );
  }
}
