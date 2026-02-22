'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  MapPin,
  Monitor,
  Users,
  DollarSign,
  Award,
  Filter,
  LayoutGrid,
  List,
  Clock,
  Tag,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  AceCredentialType,
  AceEventCategory,
  AceEventModality,
  AceEventType,
} from '@/lib/ace/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EventWithProvider {
  _id: string;
  title: string;
  description?: string;
  totalCeus: number;
  ceCategory: AceEventCategory;
  modality: AceEventModality;
  eventType?: AceEventType;
  startDate: number;
  endDate?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  fee?: number;
  status: string;
  learningObjectives?: string[];
  location?: string;
  provider?: {
    _id: string;
    providerName: string;
  } | null;
  instructors?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
  }>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CREDENTIAL_OPTIONS: { value: AceCredentialType; label: string; description: string }[] = [
  { value: 'bcba', label: 'BCBA', description: 'Board Certified Behavior Analyst' },
  { value: 'bcaba', label: 'BCaBA', description: 'Board Certified Assistant Behavior Analyst' },
  { value: 'rbt', label: 'RBT', description: 'Registered Behavior Technician' },
  { value: 'other', label: 'Other', description: 'Other Credential' },
];

const CATEGORY_LABELS: Record<AceEventCategory, string> = {
  learning: 'Learning',
  ethics: 'Ethics',
  supervision: 'Supervision',
  teaching: 'Teaching',
};

const MODALITY_LABELS: Record<AceEventModality, string> = {
  in_person: 'In Person',
  synchronous: 'Live Online',
  asynchronous: 'Self-Paced',
};

const MODALITY_ICONS: Record<AceEventModality, typeof MapPin> = {
  in_person: MapPin,
  synchronous: Monitor,
  asynchronous: Clock,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventBrowsePage() {
  // State
  const [events, setEvents] = useState<EventWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Credential selector
  const [selectedCredential, setSelectedCredential] = useState<AceCredentialType | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AceEventCategory | ''>('');
  const [modalityFilter, setModalityFilter] = useState<AceEventModality | ''>('');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'this_week' | 'this_month'>('upcoming');
  const [showFilters, setShowFilters] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ace/events?status=approved,in_progress');
        if (!res.ok) {
          // Try alternate approach - fetch public events
          const altRes = await fetch('/api/ace/events');
          if (!altRes.ok) throw new Error('Failed to fetch events');
          const altData = await altRes.json();
          setEvents(altData.events || altData.data || []);
          return;
        }
        const data = await res.json();
        setEvents(data.events || data.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by credential type -> eligible event types
    if (selectedCredential) {
      if (selectedCredential === 'bcba' || selectedCredential === 'bcaba') {
        result = result.filter((e) => !e.eventType || e.eventType === 'ce');
      } else if (selectedCredential === 'rbt') {
        result = result.filter((e) => e.eventType === 'pd');
      }
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.provider?.providerName?.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter) {
      result = result.filter((e) => e.ceCategory === categoryFilter);
    }

    // Modality
    if (modalityFilter) {
      result = result.filter((e) => e.modality === modalityFilter);
    }

    // Pricing
    if (pricingFilter === 'free') {
      result = result.filter((e) => !e.fee || e.fee === 0);
    } else if (pricingFilter === 'paid') {
      result = result.filter((e) => e.fee && e.fee > 0);
    }

    // Date
    const now = Date.now();
    if (dateFilter === 'upcoming') {
      result = result.filter((e) => e.startDate >= now);
    } else if (dateFilter === 'this_week') {
      const oneWeek = now + 7 * 24 * 60 * 60 * 1000;
      result = result.filter((e) => e.startDate >= now && e.startDate <= oneWeek);
    } else if (dateFilter === 'this_month') {
      const oneMonth = now + 30 * 24 * 60 * 60 * 1000;
      result = result.filter((e) => e.startDate >= now && e.startDate <= oneMonth);
    }

    // Sort by date
    result.sort((a, b) => a.startDate - b.startDate);

    return result;
  }, [events, selectedCredential, searchQuery, categoryFilter, modalityFilter, pricingFilter, dateFilter]);

  // Helpers
  function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function getSpotsRemaining(event: EventWithProvider): number | null {
    if (!event.maxParticipants) return null;
    return Math.max(0, event.maxParticipants - (event.currentParticipants || 0));
  }

  function isFull(event: EventWithProvider): boolean {
    const spots = getSpotsRemaining(event);
    return spots !== null && spots === 0;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Browse CE &amp; PD Events
          </h1>
          <p className="text-[#D4AF37] text-lg">
            Find continuing education and professional development events for behavior analysts
          </p>
        </div>
      </div>

      {/* Credential Selector */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            I am a...
          </p>
          <div className="flex flex-wrap gap-3">
            {CREDENTIAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setSelectedCredential(
                    selectedCredential === opt.value ? null : opt.value
                  )
                }
                className={`
                  px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                  ${
                    selectedCredential === opt.value
                      ? 'border-[#1F4D3F] bg-[#1F4D3F] text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#1F4D3F]/50 hover:bg-[#1F4D3F]/5'
                  }
                `}
              >
                <span className="font-bold">{opt.label}</span>
                <span className="hidden sm:inline text-xs ml-1 opacity-80">
                  - {opt.description}
                </span>
              </button>
            ))}
            {selectedCredential && (
              <button
                onClick={() => setSelectedCredential(null)}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear
              </button>
            )}
          </div>
          {selectedCredential && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedCredential === 'rbt'
                ? 'Showing PD (Professional Development) events eligible for RBTs'
                : selectedCredential === 'bcba' || selectedCredential === 'bcaba'
                  ? 'Showing CE (Continuing Education) events eligible for BCBAs and BCaBAs'
                  : 'Showing all available events'}
            </p>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events by title, description, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </Button>

          {/* View toggle */}
          <div className="flex border rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#1F4D3F] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#1F4D3F] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as AceEventCategory | '')
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All Categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modality */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Modality
                </label>
                <select
                  value={modalityFilter}
                  onChange={(e) =>
                    setModalityFilter(e.target.value as AceEventModality | '')
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All Modalities</option>
                  {Object.entries(MODALITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Pricing
                </label>
                <select
                  value={pricingFilter}
                  onChange={(e) =>
                    setPricingFilter(e.target.value as 'all' | 'free' | 'paid')
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value as 'all' | 'upcoming' | 'this_week' | 'this_month'
                    )
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter('');
                  setModalityFilter('');
                  setPricingFilter('all');
                  setDateFilter('upcoming');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading
              ? 'Loading events...'
              : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedCredential
                ? 'No events match your credential type and filters. Try adjusting your filters or check back later.'
                : 'No events match your current filters. Try adjusting your search criteria.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const spotsRemaining = getSpotsRemaining(event);
              const eventIsFull = isFull(event);
              const ModalityIcon = MODALITY_ICONS[event.modality] || Monitor;

              return (
                <Card
                  key={event._id}
                  className="flex flex-col hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge
                            variant="secondary"
                            className={
                              event.eventType === 'pd'
                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                : 'bg-[#1F4D3F]/10 text-[#1F4D3F] border-[#1F4D3F]/20'
                            }
                          >
                            {event.eventType === 'pd' ? 'PD' : 'CE'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[event.ceCategory] || event.ceCategory}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    {event.provider?.providerName && (
                      <p className="text-xs text-gray-500 mt-1">
                        by {event.provider.providerName}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 pb-3">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>{formatDate(event.startDate)}</span>
                        {event.endDate && (
                          <span className="text-gray-400">
                            - {formatDate(event.endDate)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <ModalityIcon className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>{MODALITY_LABELS[event.modality]}</span>
                        {event.location && (
                          <span className="text-gray-400 truncate">
                            - {event.location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#D4AF37] shrink-0" />
                        <span className="font-medium text-[#1F4D3F]">
                          {event.totalCeus} {event.eventType === 'pd' ? 'PDUs' : 'CEUs'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>
                          {!event.fee || event.fee === 0
                            ? 'Free'
                            : `$${event.fee.toFixed(2)}`}
                        </span>
                      </div>

                      {spotsRemaining !== null && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400 shrink-0" />
                          <span
                            className={
                              eventIsFull
                                ? 'text-red-600 font-medium'
                                : spotsRemaining <= 5
                                  ? 'text-orange-600 font-medium'
                                  : ''
                            }
                          >
                            {eventIsFull
                              ? 'Full'
                              : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <Separator />

                  <CardFooter className="pt-4">
                    <Link
                      href={`/ace/events/${event._id}/register`}
                      className="w-full"
                    >
                      <Button
                        className={`w-full ${
                          eventIsFull
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : 'bg-[#1F4D3F] hover:bg-[#1F4D3F]/90'
                        }`}
                      >
                        {eventIsFull ? 'Join Waitlist' : 'Register Now'}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const spotsRemaining = getSpotsRemaining(event);
              const eventIsFull = isFull(event);
              const ModalityIcon = MODALITY_ICONS[event.modality] || Monitor;

              return (
                <Card key={event._id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row p-4 gap-4">
                    {/* Date badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-20 shrink-0 bg-[#1F4D3F]/5 rounded-lg p-2">
                      <span className="text-xs text-[#1F4D3F] font-medium uppercase">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold text-[#1F4D3F]">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={
                            event.eventType === 'pd'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : 'bg-[#1F4D3F]/10 text-[#1F4D3F] border-[#1F4D3F]/20'
                          }
                        >
                          {event.eventType === 'pd' ? 'PD' : 'CE'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[event.ceCategory] || event.ceCategory}
                        </Badge>
                        <Badge variant="outline" className="text-xs gap-1">
                          <ModalityIcon className="h-3 w-3" />
                          {MODALITY_LABELS[event.modality]}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-1">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(event.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {event.totalCeus} {event.eventType === 'pd' ? 'PDUs' : 'CEUs'}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {!event.fee || event.fee === 0 ? 'Free' : `$${event.fee.toFixed(2)}`}
                        </span>
                        {spotsRemaining !== null && (
                          <span
                            className={`flex items-center gap-1 ${
                              eventIsFull
                                ? 'text-red-600'
                                : spotsRemaining <= 5
                                  ? 'text-orange-600'
                                  : ''
                            }`}
                          >
                            <Users className="h-3.5 w-3.5" />
                            {eventIsFull
                              ? 'Full'
                              : `${spotsRemaining} spots left`}
                          </span>
                        )}
                        {event.provider?.providerName && (
                          <span className="text-gray-400">
                            by {event.provider.providerName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center shrink-0">
                      <Link href={`/ace/events/${event._id}/register`}>
                        <Button
                          size="sm"
                          className={
                            eventIsFull
                              ? 'bg-gray-600 hover:bg-gray-700'
                              : 'bg-[#1F4D3F] hover:bg-[#1F4D3F]/90'
                          }
                        >
                          {eventIsFull ? 'Join Waitlist' : 'Register'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
