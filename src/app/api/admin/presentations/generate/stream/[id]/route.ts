import { NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabase = createSupabaseAdminClient();
    const { data: job, error } = await supabase
      .from('presentations_ai_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !job) {
      return new Response('Job not found', { status: 404 });
    }

    // Return the job data as a stream or JSON depending on needs. 
    // Assuming simple JSON for now based on context, or text.
    return new Response(JSON.stringify(job), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
}