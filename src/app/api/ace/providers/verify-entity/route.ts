// src/app/api/ace/providers/verify-entity/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ace/providers/verify-entity
 * Upload legal entity verification documents for an organization provider
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();

    const providerId = formData.get('provider_id') as string;
    const einFile = formData.get('ein_document') as File | null;
    const incorporationFile = formData.get('incorporation_document') as File | null;
    const ein = formData.get('ein') as string;

    if (!providerId) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    // Verify the provider exists and is an organization
    const { data: provider, error: providerError } = await supabase
      .from('ace_providers')
      .select('id, provider_type')
      .eq('id', providerId)
      .single();

    if (providerError || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    if (provider.provider_type !== 'organization') {
      return NextResponse.json(
        { error: 'Legal entity verification is only required for organization providers' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    // Store EIN if provided
    if (ein) {
      updates.ein = ein;
    }

    // Upload EIN document if provided
    if (einFile) {
      const einBuffer = await einFile.arrayBuffer();
      const einPath = `providers/${providerId}/ein_${Date.now()}_${einFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('ace-documents')
        .upload(einPath, einBuffer, {
          contentType: einFile.type,
        });

      if (uploadError) {
        console.error('EIN upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload EIN document' },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ace-documents')
        .getPublicUrl(einPath);

      updates.ein_doc_url = publicUrl;
    }

    // Upload incorporation document if provided
    if (incorporationFile) {
      const incBuffer = await incorporationFile.arrayBuffer();
      const incPath = `providers/${providerId}/incorporation_${Date.now()}_${incorporationFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('ace-documents')
        .upload(incPath, incBuffer, {
          contentType: incorporationFile.type,
        });

      if (uploadError) {
        console.error('Incorporation doc upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload incorporation document' },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('ace-documents')
        .getPublicUrl(incPath);

      updates.incorporation_doc_url = publicUrl;
    }

    // Update the provider record
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('ace_providers')
        .update({
          ...updates,
          legal_entity_verified: false, // Awaiting admin verification
        })
        .eq('id', providerId);

      if (updateError) {
        console.error('Provider update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update provider record' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Documents uploaded successfully. Awaiting admin verification.',
    });
  } catch (error) {
    console.error('Error in verify-entity endpoint:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/providers/verify-entity
 * Admin: Mark a provider's legal entity as verified
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider_id, verified, verified_by } = body;

    if (!provider_id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('ace_providers')
      .update({
        legal_entity_verified: verified,
        legal_entity_verified_at: verified ? new Date().toISOString() : null,
        legal_entity_verified_by: verified_by || null,
      })
      .eq('id', provider_id);

    if (updateError) {
      console.error('Verification update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: verified ? 'Provider verified successfully' : 'Verification removed',
    });
  } catch (error) {
    console.error('Error in verify-entity PUT:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
