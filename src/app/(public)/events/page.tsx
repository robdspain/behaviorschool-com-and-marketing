import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { Calendar, Clock, Users, Award, MapPin, Video, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Continuing Education Events | Behavior School',
  description: 'Browse and register for BACB-approved continuing education events for BCBAs, BCaBAs, and RBTs. Earn CEUs with live and on-demand courses.',
  openGraph: {
    title: 'CE Events for Behavior Analysts | Behavior School',
    description: 'BACB-approved continuing education courses. Live and on-demand options available.',
  },
};

async function getPublicEvents() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:ace_providers (
        id,
        provider_name,
        bacb_provider_number
      )
    `)
    .in('status', ['approved', 'in_progress'])
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}

export default async function EventsPage() {
  const events = await getPublicEvents();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ethics': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'supervision': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'teaching': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'in_person': return <MapPin className="w-4 h-4" />;
      case 'synchronous': return <Video className="w-4 h-4" />;
      case 'asynchronous': return <BookOpen className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case 'in_person': return 'In Person';
      case 'synchronous': return 'Live Online';
      case 'asynchronous': return 'On-Demand';
      default: return modality;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Continuing Education Events
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              BACB-approved CE courses for BCBAs, BCaBAs, and RBTs. 
              Earn your CEUs with expert-led live and on-demand training.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="bg-emerald-800/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold">{events.length}</div>
              <div className="text-emerald-200">Upcoming Events</div>
            </div>
            <div className="bg-emerald-800/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold">
                {events.reduce((sum, e) => sum + (e.total_ceus || 0), 0).toFixed(1)}
              </div>
              <div className="text-emerald-200">Total CEUs Available</div>
            </div>
            <div className="bg-emerald-800/50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold">ACE</div>
              <div className="text-emerald-200">BACB Approved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-slate-600 mb-6">
                Check back soon for new continuing education opportunities!
              </p>
              <Link href="/newsletter">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Notified of New Events
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(event.ce_category)}>
                        {event.ce_category.charAt(0).toUpperCase() + event.ce_category.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-emerald-100">
                        {getModalityIcon(event.modality)}
                        <span className="text-sm">{getModalityLabel(event.modality)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {event.title}
                    </h3>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    {event.description && (
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {event.modality !== 'asynchronous' && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {new Date(event.start_date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm">
                        <Award className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {event.total_ceus} CEUs
                        </span>
                      </div>

                      {event.max_participants && (
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            {event.current_participants || 0} / {event.max_participants} spots filled
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        {!event.fee || event.fee === 0 ? (
                          <span className="text-2xl font-bold text-emerald-600">FREE</span>
                        ) : (
                          <span className="text-2xl font-bold text-slate-900">
                            ${event.fee}
                          </span>
                        )}
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Provider Badge */}
                  {event.provider && (
                    <div className="bg-slate-50 px-6 py-3 text-xs text-slate-500 border-t">
                      ACE Provider: {event.provider.provider_name}
                      {event.provider.bacb_provider_number && (
                        <> • #{event.provider.bacb_provider_number}</>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Need Custom Training for Your Team?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            We offer group training and custom CE courses for schools, clinics, and organizations.
            Contact us to discuss your team&apos;s professional development needs.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Contact Us About Group Training
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
