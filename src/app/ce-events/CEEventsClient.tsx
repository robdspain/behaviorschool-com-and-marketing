'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Award,
  Search,
  Filter,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';
import type { AceEvent, AceEventType, AceEventCategory } from '@/lib/ace/types';

interface EventWithProvider extends AceEvent {
  provider?: {
    provider_name: string;
    bacb_provider_number?: string;
  };
}

export default function CEEventsClient({ initialEvents }: { initialEvents: EventWithProvider[] }) {
  const [events] = useState<EventWithProvider[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AceEventType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AceEventCategory | 'all'>('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || event.event_type === selectedType;
    const matchesCategory = selectedCategory === 'all' || event.ce_category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const ceEvents = filteredEvents.filter(e => e.event_type === 'ce' || !e.event_type);
  const pdEvents = filteredEvents.filter(e => e.event_type === 'pd');

  const getCategoryColor = (category: AceEventCategory) => {
    switch (category) {
      case 'ethics': return 'bg-purple-100 text-purple-800';
      case 'supervision': return 'bg-blue-100 text-blue-800';
      case 'teaching': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-emerald-800 rounded-full">
                <GraduationCap className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Continuing Education Events
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-6">
              BACB-approved continuing education for BCBAs, BCaBAs, and RBTs. 
              Maintain your certification with quality professional development.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>BACB Approved Provider</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full">
                <Award className="w-4 h-4" />
                <span>Instant Certificates</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full">
                <Video className="w-4 h-4" />
                <span>Live & On-Demand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as AceEventType | 'all')}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Credentials</option>
                <option value="ce">CE - BCBA/BCaBA</option>
                <option value="pd">PD - RBT</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as AceEventCategory | 'all')}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="learning">General Learning</option>
                <option value="ethics">Ethics</option>
                <option value="supervision">Supervision</option>
                <option value="teaching">Teaching</option>
              </select>
            </div>
          </div>
        </Card>

        {/* CE Events Section */}
        {ceEvents.length > 0 && (selectedType === 'all' || selectedType === 'ce') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-emerald-600 text-lg px-4 py-1">CE Events</Badge>
              <span className="text-slate-600">For BCBAs & BCaBAs</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ceEvents.map(event => (
                <EventCard key={event.id} event={event} getCategoryColor={getCategoryColor} />
              ))}
            </div>
          </section>
        )}

        {/* PD Events Section */}
        {pdEvents.length > 0 && (selectedType === 'all' || selectedType === 'pd') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-blue-600 text-lg px-4 py-1">PD Events</Badge>
              <span className="text-slate-600">For RBTs Only</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdEvents.map(event => (
                <EventCard key={event.id} event={event} getCategoryColor={getCategoryColor} />
              ))}
            </div>
          </section>
        )}

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search or filters.'
                : 'New events are added regularly. Check back soon!'}
            </p>
          </Card>
        )}

        {/* Provider Info */}
        <Card className="p-6 mt-8 bg-slate-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">About Our CE Program</h3>
              <p className="text-slate-600 mb-4">
                Behavior School is a BACB Approved Continuing Education (ACE) Provider. 
                All events meet BACB requirements for continuing education and professional development.
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>✓ Certificates issued within 45 days of event completion</li>
                <li>✓ All instructors meet 2026 BACB qualification requirements</li>
                <li>✓ Feedback and assessments per BACB standards</li>
                <li>✓ Full documentation maintained for 3+ years</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ 
  event, 
  getCategoryColor 
}: { 
  event: EventWithProvider; 
  getCategoryColor: (category: AceEventCategory) => string;
}) {
  const isUpcoming = new Date(event.start_date) > new Date();
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={event.event_type === 'pd' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}>
            {event.event_type === 'pd' ? 'PD' : 'CE'} • {event.total_ceus} {event.event_type === 'pd' ? 'PDUs' : 'CEUs'}
          </Badge>
          <Badge className={getCategoryColor(event.ce_category)}>
            {event.ce_category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}
        
        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>
              {new Date(event.start_date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {event.modality === 'in_person' ? (
              <MapPin className="w-4 h-4 text-slate-400" />
            ) : (
              <Video className="w-4 h-4 text-slate-400" />
            )}
            <span className="capitalize">{event.modality.replace('_', ' ')}</span>
          </div>
          
          {event.max_participants && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                {event.current_participants || 0} / {event.max_participants} enrolled
              </span>
            </div>
          )}
        </div>
        
        {event.provider && (
          <p className="text-xs text-slate-500 mb-4">
            Provider: {event.provider.provider_name}
            {event.provider.bacb_provider_number && ` (#${event.provider.bacb_provider_number})`}
          </p>
        )}
        
        <Link href={`/ce-events/${event.id}`}>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            {isUpcoming ? 'View Details & Register' : 'View Details'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
