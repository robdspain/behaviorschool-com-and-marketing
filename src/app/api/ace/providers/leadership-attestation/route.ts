export const dynamic = "force-dynamic";

// src/app/api/ace/providers/leadership-attestation/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Module-level Supabase client moved to lazy getter to prevent build-time errors
function getSupabase() { return createClient(); }

// Define the schema for the request body
const attestationSchema = z.object({
  provider_id: z.string().uuid(),
  signature: z.string(), // base64 encoded signature
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = attestationSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json({ error: validatedBody.error.flatten().fieldErrors }, { status: 400 });
    }

    const { provider_id, signature } = validatedBody.data;

    // Decode the base64 signature
    const signatureBuffer = Buffer.from(signature, 'base64');
    const signaturePath = `${provider_id}/leadership_attestation.png`;

    // Upload the signature to Supabase Storage
    const { data: uploadData, error: uploadError } = await getSupabase().storage
      .from('ace-provider-documents')
      .upload(signaturePath, signatureBuffer, {
        contentType: 'image/png',
        upsert: true, // Overwrite if it already exists
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded signature
    const { data: { publicUrl } } = getSupabase().storage
        .from('ace-provider-documents')
        .getPublicUrl(signaturePath);

    // Update the provider record in the database
    const { data: updateData, error: updateError } = await getSupabase()
      .from('ace_providers')
      .update({
        leadership_attestation_url: publicUrl,
        leadership_attestation_date: new Date().toISOString(),
      })
      .eq('id', provider_id)
      .select();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Leadership attestation submitted successfully.', data: updateData });

  } catch (error: any) {
    console.error('Error in leadership-attestation endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
