import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import CEEventsClient from './CEEventsClient';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Continuing Education Events | Behavior School',
  description: 'Browse professional development events for behavior analysts. BCBAs and BCaBAs earn CEUs, and RBTs earn PDUs through Behavior School.',
  canonical: 'https://behaviorschool.com/ce-events',
});

async function getApprovedEvents() {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:provider_id (
        provider_name,
        bacb_provider_number
      )
    `)
    .eq('status', 'approved')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return events || [];
}

export default async function CEEventsPage() {
  const events = await getApprovedEvents();
  
  return <CEEventsClient initialEvents={events} />;
}
