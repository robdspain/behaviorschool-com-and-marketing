import { NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseAdminClient();
  const id = params.id;

  const { data: rec, error } = await supabase
    .from('presentations_ai')
    .select('storage_path')
    .eq('id', id)
    .single();
  if (error || !rec) {
    return new Response('Not found', { status: 404 });
  }

  // Create a signed URL valid for 1 minute
  const { data: signed, error: sErr } = await supabase
    .storage
    .from('presentations')
    .createSignedUrl(rec.storage_path, 60);
  if (sErr || !signed?.signedUrl) {
    return new Response('Download unavailable', { status: 500 });
  }

  return Response.redirect(signed.signedUrl, 302);
}

