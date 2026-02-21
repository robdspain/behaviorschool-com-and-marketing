import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import EventDetailClient from './EventDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: event } = await supabase
    .from('ace_events')
    .select('title, description, total_ceus, ce_category')
    .eq('id', id)
    .single();

  if (!event) {
    return { title: 'Event Not Found' };
  }

  return {
    title: `${event.title} | Behavior School CE Events`,
    description: event.description || `Earn ${event.total_ceus} CEUs in ${event.ce_category} with this BACB-approved continuing education event.`,
    openGraph: {
      title: event.title,
      description: `${event.total_ceus} CEUs | ${event.ce_category} | BACB Approved`,
    },
  };
}

async function getEvent(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:ace_providers (
        id,
        provider_name,
        bacb_provider_number,
        primary_email
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}
