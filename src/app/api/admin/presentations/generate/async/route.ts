import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseAdminClient();
  try {
    const payload = await req.json();
    const { topic, exportAs = 'pptx' } = payload || {};
    const { data: job, error } = await supabase
      .from('presentations_ai_jobs')
      .insert({ status: 'queued', progress: 0, format: exportAs, topic })
      .select('*')
      .single();
    if (error) throw error;
    // naive inline processing; in production, hand off to worker
    // Mark running
    await supabase.from('presentations_ai_jobs').update({ status: 'running', progress: 10, updated_at: new Date().toISOString() }).eq('id', job.id);
    // Call sync generation route
    const res = await fetch(new URL('/api/admin/presentations/generate', req.url), { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const errText = await res.text();
      await supabase.from('presentations_ai_jobs').update({ status: 'error', error: errText, progress: 100, updated_at: new Date().toISOString() }).eq('id', job.id);
      return NextResponse.json({ id: job.id, status: 'error' });
    }
    // We can't capture the file from here; rely on persistence done in generate route
    await supabase.from('presentations_ai_jobs').update({ status: 'completed', progress: 100, updated_at: new Date().toISOString() }).eq('id', job.id);
    return NextResponse.json({ id: job.id, status: 'completed' });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

