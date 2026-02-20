import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import EventDetailClient from './EventDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string) {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:provider_id (
        provider_name,
        bacb_provider_number,
        primary_email
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  return event;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    return {
      title: 'Event Not Found | Behavior School',
    };
  }

  return {
    title: `${event.title} | CE Events | Behavior School`,
    description: event.description || `Earn ${event.total_ceus} CEUs with this BACB-approved continuing education event.`,
    openGraph: {
      title: event.title,
      description: event.description || `Earn ${event.total_ceus} CEUs`,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    notFound();
  }
  
  return <EventDetailClient event={event} />;
}
