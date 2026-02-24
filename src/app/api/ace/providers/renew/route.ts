export const dynamic = "force-dynamic";

// src/app/api/ace/providers/renew/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Module-level Supabase client moved to lazy getter to prevent build-time errors
function getSupabase() { return createClient(); }

// Define the schema for the request body
const renewalSchema = z.object({
  provider_id: z.string().uuid(),
  payment_token: z.string(), // This would be a token from a payment provider like Stripe
  late_fee_paid: z.boolean().optional(),
});

// Helper function to calculate the next renewal date
const getNextRenewalDate = (currentExpiration: Date | string | null): Date => {
    const expiration = currentExpiration ? new Date(currentExpiration) : new Date();
    expiration.setFullYear(expiration.getFullYear() + 1);
    return expiration;
};


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = renewalSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({ error: validatedBody.error.flatten().fieldErrors }, { status: 400 });
    }

    const { provider_id, payment_token, late_fee_paid } = validatedBody.data;

    // In a real application, you would process the payment here using the payment_token
    // For now, we'll simulate a successful payment
    const paymentSuccessful = true; 
    const renewalFee = 400;
    const lateFee = 50;
    const amountPaid = late_fee_paid ? renewalFee + lateFee : renewalFee;


    if (!paymentSuccessful) {
      return NextResponse.json({ error: 'Payment processing failed.' }, { status: 402 });
    }
    
    const { data: provider, error: providerError } = await getSupabase()
        .from('ace_providers')
        .select('expiration_date')
        .eq('id', provider_id)
        .single();

    if (providerError || !provider) {
        throw new Error('Provider not found or could not be retrieved.');
    }


    const nextRenewalDate = getNextRenewalDate(provider.expiration_date);

    // Update the provider record in the database
    const { data: updateData, error: updateError } = await getSupabase()
      .from('ace_providers')
      .update({
        last_renewal_date: new Date().toISOString(),
        next_renewal_date: nextRenewalDate.toISOString(),
        expiration_date: nextRenewalDate.toISOString(),
        renewal_fee_paid: true,
        late_fee_paid: late_fee_paid,
        // Reset reminder flags
        renewal_reminder_sent_45_days: false,
        renewal_reminder_sent_15_days: false,
        renewal_reminder_sent_5_days: false,
        is_active: true, // Ensure the provider is active after renewal
      })
      .eq('id', provider_id)
      .select();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Provider renewal successful.', data: updateData });

  } catch (error: any) {
    console.error('Error in provider renewal endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
