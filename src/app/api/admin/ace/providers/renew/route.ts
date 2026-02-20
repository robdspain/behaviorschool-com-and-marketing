import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/admin/ace/providers/renew - Renew a provider
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.provider_id) {
      return NextResponse.json(
        { error: 'Missing provider_id' },
        { status: 400 }
      );
    }

    // Get current provider
    const { data: provider, error: fetchError } = await supabase
      .from('ace_providers')
      .select('*')
      .eq('id', body.provider_id)
      .single();

    if (fetchError || !provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Calculate new expiration date (1 year from now)
    const today = new Date();
    const newExpiration = new Date(today);
    newExpiration.setFullYear(newExpiration.getFullYear() + 1);

    // Determine fee amount
    const renewalFee = provider.provider_type === 'organization' ? 400 : 400;
    const lateFee = body.include_late_fee ? 50 : 0;
    const totalFee = renewalFee + lateFee;

    // Update provider
    const updates = {
      last_renewal_date: today.toISOString().split('T')[0],
      expiration_date: newExpiration.toISOString().split('T')[0],
      next_renewal_date: newExpiration.toISOString().split('T')[0],
      renewal_fee_paid: true,
      late_fee_paid: body.include_late_fee || false,
      late_fee_amount: lateFee,
      late_fee_paid_date: body.include_late_fee ? today.toISOString().split('T')[0] : null,
      grace_period_end_date: null,
      lapse_start_date: null,
      lapse_end_date: provider.lapse_start_date ? today.toISOString().split('T')[0] : null,
      reinstatement_date: provider.lapse_start_date ? today.toISOString().split('T')[0] : null,
      can_publish_events: true,
      can_issue_certificates: true,
      is_active: true,
      // Reset reminder flags
      renewal_reminder_sent_45_days: false,
      renewal_reminder_sent_15_days: false,
      renewal_reminder_sent_5_days: false,
    };

    const { data, error } = await supabase
      .from('ace_providers')
      .update(updates)
      .eq('id', body.provider_id)
      .select()
      .single();

    if (error) throw error;

    // Record in renewal history
    await supabase
      .from('ace_renewal_history')
      .insert([{
        provider_id: body.provider_id,
        renewal_date: today.toISOString().split('T')[0],
        previous_expiration_date: provider.expiration_date,
        new_expiration_date: newExpiration.toISOString().split('T')[0],
        renewed_within_45_day_window: !body.include_late_fee,
        renewed_during_grace_period: body.include_late_fee,
        days_past_expiration: body.include_late_fee ? Math.ceil((today.getTime() - new Date(provider.expiration_date!).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        renewal_fee_amount: renewalFee,
        late_fee_amount: lateFee,
        total_amount_paid: totalFee,
        payment_date: today.toISOString().split('T')[0],
      }]);

    return NextResponse.json({ 
      success: true, 
      data,
      renewal: {
        renewalFee,
        lateFee,
        totalFee,
        newExpiration: newExpiration.toISOString().split('T')[0],
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error renewing provider:', error);
    return NextResponse.json(
      { error: 'Failed to renew provider' },
      { status: 500 }
    );
  }
}
