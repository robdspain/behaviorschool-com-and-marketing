import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import CEEventsClient from './CEEventsClient';

export const metadata: Metadata = {
  title: 'Continuing Education Events | Behavior School',
  description: 'Browse and register for BACB-approved continuing education events. BCBAs & BCaBAs earn CEUs (Continuing Education Units) · RBTs earn PDUs (Professional Development Units).',
  openGraph: {
    title: 'CE Events | Behavior School',
    description: 'BACB-approved continuing education for behavior analysts',
  },
};

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
