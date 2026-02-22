'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Download,
  MoreHorizontal,
  Eye,
  Calendar,
  Award,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Registration {
  _id: string;
  eventId: string;
  participantId: string;
  confirmationCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  feeAmount?: number;
  feePaid: boolean;
  credentialType?: string;
  attendanceVerified: boolean;
  quizCompleted: boolean;
  feedbackCompleted: boolean;
  certificateIssued: boolean;
  createdAt: number;
  updatedAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
  } | null;
  event?: {
    _id: string;
    title: string;
    startDate: number;
    eventType?: string;
    totalCeus: number;
  } | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle2,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch registrations
  useEffect(() => {
    async function fetchRegistrations() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all registrations via the registrations API
        // We'll need to get all events first to build the complete picture
        const res = await fetch('/api/ace/registrations?all=true');
        if (!res.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const data = await res.json();
        setRegistrations(data.registrations || []);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Unable to load registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, []);

  // Unique events for filter
  const eventOptions = useMemo(() => {
    const map = new Map<string, string>();
    registrations.forEach((r) => {
      if (r.event) {
        map.set(r.event._id, r.event.title);
      }
    });
    return Array.from(map.entries());
  }, [registrations]);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const name = r.participant
          ? `${r.participant.firstName} ${r.participant.lastName}`.toLowerCase()
          : '';
        const email = r.participant?.email?.toLowerCase() || '';
        const code = r.confirmationCode.toLowerCase();
        return name.includes(q) || email.includes(q) || code.includes(q);
      });
    }

    // Status
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Event
    if (eventFilter) {
      result = result.filter((r) => r.eventId === eventFilter);
    }

    // Sort by newest first
    result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [registrations, searchQuery, statusFilter, eventFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
    const pending = registrations.filter((r) => r.status === 'pending').length;
    const cancelled = registrations.filter((r) => r.status === 'cancelled').length;
    return { total, confirmed, pending, cancelled };
  }, [registrations]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage event registrations and participant progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" disabled>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1F4D3F]/10 rounded-lg">
                  <Users className="h-5 w-5 text-[#1F4D3F]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.total}
                  </p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.confirmed}
                  </p>
                  <p className="text-xs text-gray-500">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.pending}
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '-' : stats.cancelled}
                  </p>
                  <p className="text-xs text-gray-500">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or confirmation code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        </div>

        {showFilters && (
          <div className="mb-4 p-4 bg-white rounded-lg border shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Event
                </label>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All Events</option>
                  {eventOptions.map(([id, title]) => (
                    <option key={id} value={id}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('');
                  setEventFilter('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {loading
            ? 'Loading...'
            : `${filteredRegistrations.length} registration${filteredRegistrations.length !== 1 ? 's' : ''}`}
        </p>

        {/* Registrations Table */}
        {loading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
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
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No registrations found
            </h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter || eventFilter
                ? 'Try adjusting your search or filters.'
                : 'No registrations have been made yet.'}
            </p>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRegistrations.map((reg) => {
                    const statusCfg = STATUS_CONFIG[reg.status] || STATUS_CONFIG.pending;
                    const StatusIcon = statusCfg.icon;

                    return (
                      <tr
                        key={reg._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Participant */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {reg.participant
                                ? `${reg.participant.firstName} ${reg.participant.lastName}`
                                : 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {reg.participant?.email || '-'}
                            </p>
                          </div>
                        </td>

                        {/* Event */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700 max-w-[200px] truncate">
                            {reg.event?.title || 'Unknown Event'}
                          </p>
                          {reg.event?.startDate && (
                            <p className="text-xs text-gray-400">
                              {new Date(reg.event.startDate).toLocaleDateString()}
                            </p>
                          )}
                        </td>

                        {/* Confirmation Code */}
                        <td className="px-4 py-3">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {reg.confirmationCode}
                          </code>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${statusCfg.color}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusCfg.label}
                          </Badge>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {reg.feePaid ? (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Paid
                              </Badge>
                            ) : reg.feeAmount && reg.feeAmount > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                              >
                                <CreditCard className="h-3 w-3 mr-1" />
                                Unpaid
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">Free</span>
                            )}
                          </div>
                        </td>

                        {/* Completion */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span
                              title="Attendance"
                              className={`w-2 h-2 rounded-full ${
                                reg.attendanceVerified
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <span
                              title="Quiz"
                              className={`w-2 h-2 rounded-full ${
                                reg.quizCompleted
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <span
                              title="Feedback"
                              className={`w-2 h-2 rounded-full ${
                                reg.feedbackCompleted
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <span
                              title="Certificate"
                              className={`w-2 h-2 rounded-full ${
                                reg.certificateIssued
                                  ? 'bg-[#D4AF37]'
                                  : 'bg-gray-300'
                              }`}
                            />
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500">
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <Link href={`/ace/registrations/${reg._id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Bulk Actions Placeholder */}
        {!loading && filteredRegistrations.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Bulk actions (select multiple registrations to perform batch operations)
              </p>
              <Button variant="outline" size="sm" disabled>
                <MoreHorizontal className="h-4 w-4 mr-1" />
                Bulk Actions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
