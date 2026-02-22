'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Users,
  Award,
  Clock,
  MapPin,
  Monitor,
  BookOpen,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AceEventStatus, AceEventCategory, AceEventModality, AceEventType } from '@/lib/ace/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EventRow {
  _id: string;
  title: string;
  eventType?: AceEventType;
  ceCategory: AceEventCategory;
  modality: AceEventModality;
  startDate: number;
  endDate?: number;
  totalCeus: number;
  status: AceEventStatus;
  currentParticipants?: number;
  maxParticipants?: number;
  provider?: { providerName: string } | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending_approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

const STATUS_COLORS: Record<AceEventStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  pending_approval: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  approved: 'bg-blue-50 text-blue-700 border-blue-300',
  in_progress: 'bg-green-50 text-green-700 border-green-300',
  completed: 'bg-purple-50 text-purple-700 border-purple-300',
  archived: 'bg-red-50 text-red-700 border-red-300',
};

const STATUS_LABELS: Record<AceEventStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending',
  approved: 'Approved',
  in_progress: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

const CATEGORY_LABELS: Record<AceEventCategory, string> = {
  learning: 'Learning',
  ethics: 'Ethics',
  supervision: 'Supervision',
  teaching: 'Teaching',
};

const MODALITY_LABELS: Record<AceEventModality, string> = {
  in_person: 'In-Person',
  synchronous: 'Live Online',
  asynchronous: 'On-Demand',
};

const MODALITY_ICONS: Record<AceEventModality, React.ReactNode> = {
  in_person: <MapPin className="size-3.5" />,
  synchronous: <Monitor className="size-3.5" />,
  asynchronous: <BookOpen className="size-3.5" />,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      if (categoryFilter) params.set('category', categoryFilter);
      if (typeFilter) params.set('event_type', typeFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/ace/events?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch events');
      }

      setEvents(json.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Client-side modality filter
  const filteredEvents = modalityFilter
    ? events.filter((e) => e.modality === modalityFilter)
    : events;

  // Status counts for tab badges
  const statusCounts = events.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1F4D3F]">
                Event Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your continuing education events and professional
                development activities.
              </p>
            </div>
            <Button
              onClick={() => router.push('/ace/events/new')}
              className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
            >
              <Plus className="size-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-white rounded-lg border p-1">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.value === 'all'
                ? events.length
                : statusCounts[tab.value] || 0;
            const isActive = statusFilter === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#1F4D3F] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search events by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Categories</option>
              <option value="learning">Learning</option>
              <option value="ethics">Ethics</option>
              <option value="supervision">Supervision</option>
              <option value="teaching">Teaching</option>
            </select>
          </div>

          {/* Modality filter */}
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Modalities</option>
            <option value="in_person">In-Person</option>
            <option value="synchronous">Live Online</option>
            <option value="asynchronous">On-Demand</option>
          </select>

          {/* Event Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Types</option>
            <option value="ce">CE Events</option>
            <option value="pd">PD Events</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="size-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchEvents}
                className="ml-auto"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-[#1F4D3F]" />
            <span className="ml-3 text-sm text-gray-500">
              Loading events...
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredEvents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="size-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No events found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchQuery || categoryFilter || modalityFilter || typeFilter
                  ? 'Try adjusting your filters or search query.'
                  : 'Get started by creating your first event.'}
              </p>
              <Button
                onClick={() => router.push('/ace/events/new')}
                className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
              >
                <Plus className="size-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Events Table */}
        {!loading && filteredEvents.length > 0 && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Event
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Modality
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">
                      Credits
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">
                      Registrations
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEvents.map((event) => (
                    <tr
                      key={event._id}
                      onClick={() => router.push(`/ace/events/${event._id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {/* Title */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 line-clamp-1 max-w-[280px]">
                          {event.title}
                        </div>
                        {event.provider?.providerName && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {event.provider.providerName}
                          </div>
                        )}
                      </td>

                      {/* Type badge */}
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            event.eventType === 'pd'
                              ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100'
                              : 'bg-[#1F4D3F]/10 text-[#1F4D3F] border-[#1F4D3F]/20 hover:bg-[#1F4D3F]/10'
                          }
                        >
                          {event.eventType === 'pd' ? 'PD' : 'CE'}
                        </Badge>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-gray-600">
                        {CATEGORY_LABELS[event.ceCategory] || event.ceCategory}
                      </td>

                      {/* Modality */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          {MODALITY_ICONS[event.modality]}
                          <span>
                            {MODALITY_LABELS[event.modality] || event.modality}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-gray-400" />
                          {formatDate(event.startDate)}
                        </div>
                      </td>

                      {/* Credits */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="size-3.5 text-[#D4AF37]" />
                          <span className="font-medium text-gray-900">
                            {event.totalCeus.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={`${STATUS_COLORS[event.status]} hover:${STATUS_COLORS[event.status]}`}
                        >
                          {STATUS_LABELS[event.status] || event.status}
                        </Badge>
                      </td>

                      {/* Registrations */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <Users className="size-3.5" />
                          <span>
                            {event.currentParticipants || 0}
                            {event.maxParticipants
                              ? `/${event.maxParticipants}`
                              : ''}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <ChevronRight className="size-4 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Summary Stats */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total Events</div>
                <div className="text-2xl font-bold text-[#1F4D3F]">
                  {events.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Active Events</div>
                <div className="text-2xl font-bold text-green-600">
                  {events.filter((e) => e.status === 'in_progress').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total CEUs Offered</div>
                <div className="text-2xl font-bold text-[#D4AF37]">
                  {events
                    .reduce((sum, e) => sum + e.totalCeus, 0)
                    .toFixed(1)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500">Total Registrations</div>
                <div className="text-2xl font-bold text-blue-600">
                  {events.reduce(
                    (sum, e) => sum + (e.currentParticipants || 0),
                    0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
