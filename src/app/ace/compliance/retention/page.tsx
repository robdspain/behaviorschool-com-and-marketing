'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Archive,
  Calendar,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
} from 'lucide-react';

// Hardcoded provider ID for demo
const DEMO_PROVIDER_ID = 'demo_provider';

interface RetentionDocument {
  syllabus: boolean;
  materials: boolean;
  recording: boolean;
  attendance: boolean;
  quizResults: boolean;
  feedback: boolean;
  certificates: boolean;
  instructorQualifications: boolean;
}

interface RetentionEvent {
  eventId: string;
  eventTitle: string;
  eventDate: number;
  eventEndDate: number;
  eventStatus: string;
  retentionDeadline: number;
  daysUntilArchive: number;
  retentionStatus: 'active' | 'due_soon' | 'past_due' | 'archived';
  documents: RetentionDocument;
  completionPercentage: number;
  completedDocs: number;
  totalDocs: number;
}

type FilterStatus = 'all' | 'active' | 'due_soon' | 'past_due' | 'archived';

const DOCUMENT_LABELS: Record<keyof RetentionDocument, string> = {
  syllabus: 'Event Syllabus',
  materials: 'Presentation Materials',
  recording: 'Recording',
  attendance: 'Attendance Records',
  quizResults: 'Quiz Results',
  feedback: 'Feedback Responses',
  certificates: 'Certificates Issued',
  instructorQualifications: 'Instructor Qualifications',
};

const STATUS_CONFIGS: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  active: {
    label: 'Active',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
  due_soon: {
    label: 'Due Soon',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
  },
  past_due: {
    label: 'Past Due',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
  archived: {
    label: 'Archived',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
  },
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getYear(timestamp: number): number {
  return new Date(timestamp).getFullYear();
}

export default function DocumentRetentionPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<RetentionEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(
    new Set()
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      // Fetch via the dashboard API which includes retention data
      // or directly from the Convex query
      const res = await fetch(
        `/api/ace/dashboard?provider_id=${DEMO_PROVIDER_ID}`
      );

      if (res.ok) {
        const data = await res.json();
        // Retention data may not be directly available from dashboard,
        // so we build it from events data if needed
        if (data.success) {
          // Use sample data structure for now - in production,
          // this would come from the Convex getRetentionStatus query
          setEvents([]);
        }
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  // Get unique years from events
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    events.forEach((e) => years.add(getYear(e.eventDate)));
    return Array.from(years).sort((a, b) => b - a);
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = events;

    if (filterStatus !== 'all') {
      result = result.filter((e) => e.retentionStatus === filterStatus);
    }

    if (filterYear !== 'all') {
      result = result.filter(
        (e) => getYear(e.eventDate) === filterYear
      );
    }

    return result;
  }, [events, filterStatus, filterYear]);

  // Group events by year
  const groupedEvents = useMemo(() => {
    const groups: Record<number, RetentionEvent[]> = {};
    filteredEvents.forEach((event) => {
      const year = getYear(event.eventDate);
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    });
    return groups;
  }, [filteredEvents]);

  // Summary stats
  const stats = useMemo(() => {
    const active = events.filter((e) => e.retentionStatus === 'active').length;
    const dueSoon = events.filter(
      (e) => e.retentionStatus === 'due_soon'
    ).length;
    const pastDue = events.filter(
      (e) => e.retentionStatus === 'past_due'
    ).length;
    const archived = events.filter(
      (e) => e.retentionStatus === 'archived'
    ).length;
    return { active, dueSoon, pastDue, archived, total: events.length };
  }, [events]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Document Retention
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track 3-year record retention requirements for all completed
              events
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all ${filterStatus === 'active' ? 'ring-2 ring-[#1F4D3F]' : ''}`}
          onClick={() =>
            setFilterStatus(filterStatus === 'active' ? 'all' : 'active')
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-xl font-bold text-emerald-700">
                  {loading ? '-' : stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterStatus === 'due_soon' ? 'ring-2 ring-[#1F4D3F]' : ''}`}
          onClick={() =>
            setFilterStatus(
              filterStatus === 'due_soon' ? 'all' : 'due_soon'
            )
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Due Soon</p>
                <p className="text-xl font-bold text-amber-700">
                  {loading ? '-' : stats.dueSoon}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterStatus === 'past_due' ? 'ring-2 ring-[#1F4D3F]' : ''}`}
          onClick={() =>
            setFilterStatus(
              filterStatus === 'past_due' ? 'all' : 'past_due'
            )
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Past Due</p>
                <p className="text-xl font-bold text-red-700">
                  {loading ? '-' : stats.pastDue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${filterStatus === 'archived' ? 'ring-2 ring-[#1F4D3F]' : ''}`}
          onClick={() =>
            setFilterStatus(
              filterStatus === 'archived' ? 'all' : 'archived'
            )
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <Archive className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Archived</p>
                <p className="text-xl font-bold text-gray-700">
                  {loading ? '-' : stats.archived}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Filter:</span>

            {/* Year filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterYear === 'all' ? 'all' : filterYear.toString()}
                onChange={(e) =>
                  setFilterYear(
                    e.target.value === 'all'
                      ? 'all'
                      : parseInt(e.target.value)
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-[#1F4D3F] focus:outline-none focus:ring-1 focus:ring-[#1F4D3F]"
              >
                <option value="all">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1.5">
              <Badge
                className={`cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-[#1F4D3F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Badge>
              {Object.entries(STATUS_CONFIGS).map(([key, config]) => (
                <Badge
                  key={key}
                  className={`cursor-pointer ${
                    filterStatus === key
                      ? `${config.bgColor} ${config.color} ${config.borderColor}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() =>
                    setFilterStatus(
                      filterStatus === key ? 'all' : (key as FilterStatus)
                    )
                  }
                >
                  {config.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Archive className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No Events Found
            </h3>
            <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
              {events.length === 0
                ? 'Completed events will appear here with their 3-year retention status and document checklists.'
                : 'No events match the current filters. Try adjusting your filter criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedEvents)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([year, yearEvents]) => (
            <div key={year}>
              {/* Year Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F4D3F] text-white text-sm font-bold">
                  <Calendar className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {year}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {yearEvents.length} event(s)
                </Badge>
              </div>

              {/* Events */}
              <div className="space-y-3 ml-4 border-l-2 border-gray-200 pl-6">
                {yearEvents.map((event) => {
                  const isExpanded = expandedEvents.has(event.eventId);
                  const statusConfig =
                    STATUS_CONFIGS[event.retentionStatus];

                  return (
                    <Card
                      key={event.eventId}
                      className="transition-shadow hover:shadow-md"
                    >
                      {/* Event Header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleEvent(event.eventId)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`h-3 w-3 rounded-full flex-shrink-0 ${
                              event.retentionStatus === 'active'
                                ? 'bg-emerald-500'
                                : event.retentionStatus === 'due_soon'
                                  ? 'bg-amber-500'
                                  : event.retentionStatus === 'past_due'
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">
                              {event.eventTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              Event: {formatDate(event.eventDate)} |
                              Retention until:{' '}
                              {formatDate(event.retentionDeadline)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          {/* Days indicator */}
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500">
                              {event.daysUntilArchive > 0
                                ? 'Days until archive'
                                : 'Days overdue'}
                            </p>
                            <p
                              className={`text-sm font-bold ${
                                event.daysUntilArchive < 0
                                  ? 'text-red-600'
                                  : event.daysUntilArchive <= 90
                                    ? 'text-amber-600'
                                    : 'text-gray-700'
                              }`}
                            >
                              {Math.abs(event.daysUntilArchive)}
                            </p>
                          </div>

                          {/* Completion ring */}
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor:
                                event.completionPercentage === 100
                                  ? '#dcfce7'
                                  : event.completionPercentage >= 75
                                    ? '#fef9c3'
                                    : '#fef2f2',
                              color:
                                event.completionPercentage === 100
                                  ? '#166534'
                                  : event.completionPercentage >= 75
                                    ? '#854d0e'
                                    : '#991b1b',
                            }}
                          >
                            {event.completionPercentage}%
                          </div>

                          <Badge
                            className={`${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </Badge>

                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Document Checklist */}
                      {isExpanded && (
                        <CardContent className="pt-0 pb-4 border-t">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                            {(
                              Object.entries(event.documents) as [
                                keyof RetentionDocument,
                                boolean,
                              ][]
                            ).map(([key, present]) => (
                              <div
                                key={key}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                                  present
                                    ? 'border-emerald-200 bg-emerald-50'
                                    : 'border-red-200 bg-red-50'
                                }`}
                              >
                                {present ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                                <span
                                  className={`text-sm ${present ? 'text-emerald-700' : 'text-red-700'}`}
                                >
                                  {DOCUMENT_LABELS[key]}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                            {event.retentionStatus === 'past_due' && (
                              <Button
                                size="sm"
                                className="gap-1.5 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                Archive Event
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download Archive
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-[#1F4D3F]"
                            >
                              <FileCheck className="h-3.5 w-3.5" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
