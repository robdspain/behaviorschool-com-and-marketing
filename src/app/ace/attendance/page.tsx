'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ace/StatCard';
import { AttendanceRoster } from '@/components/ace/AttendanceRoster';
import {
  Users,
  Clock,
  CheckCircle,
  LogOut,
  Download,
  RefreshCw,
  CalendarDays,
  Timer,
} from 'lucide-react';

interface EventOption {
  _id: string;
  title: string;
  startDate: number;
  endDate?: number;
  status: string;
  verificationMethod?: string;
}

interface AttendanceSummary {
  total_registered: number;
  checked_in: number;
  checked_out: number;
  verified: number;
  average_duration_minutes: number;
  meets_threshold: number;
  event_duration_minutes: number | null;
}

interface EventInfo {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  duration_minutes: number | null;
  verification_method: string | null;
  status: string;
}

export default function AttendanceManagementPage() {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bulkVerifying, setBulkVerifying] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch events list
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/ace/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setEvents(
            data.data.map((e: any) => ({
              _id: e._id,
              title: e.title,
              startDate: e.startDate,
              endDate: e.endDate,
              status: e.status,
              verificationMethod: e.verificationMethod,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Fetch attendance data for selected event
  const fetchAttendanceData = useCallback(async () => {
    if (!selectedEventId) return;

    try {
      setRefreshing(true);
      const res = await fetch(`/api/ace/attendance/event/${selectedEventId}`);
      if (!res.ok) throw new Error('Failed to fetch attendance data');

      const data = await res.json();
      if (data.success) {
        setEventInfo(data.data.event);
        setSummary(data.data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch attendance data:', err);
    } finally {
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  }, [selectedEventId]);

  // Initial load and polling for selected event
  useEffect(() => {
    if (selectedEventId) {
      fetchAttendanceData();

      // Poll every 30 seconds
      const interval = setInterval(fetchAttendanceData, 30000);
      return () => clearInterval(interval);
    } else {
      setEventInfo(null);
      setSummary(null);
    }
  }, [selectedEventId, fetchAttendanceData]);

  // Bulk verify all who meet threshold
  const handleBulkVerify = async () => {
    if (!selectedEventId) return;

    try {
      setBulkVerifying(true);
      const res = await fetch(`/api/ace/attendance/event/${selectedEventId}`);
      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      if (!data.success) throw new Error('Failed');

      const records = data.data.records;

      // Find records that meet the 80% threshold and aren't verified
      const toVerify = records.filter(
        (r: any) =>
          r.id &&
          r.attendance_percentage !== null &&
          r.attendance_percentage >= 80 &&
          !r.verified
      );

      // Verify each
      for (const record of toVerify) {
        await fetch(`/api/ace/attendance/${record.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: true }),
        });
      }

      // Refresh
      await fetchAttendanceData();
    } catch (err) {
      console.error('Bulk verify error:', err);
    } finally {
      setBulkVerifying(false);
    }
  };

  // Export attendance report as CSV
  const handleExportReport = async () => {
    if (!selectedEventId) return;

    try {
      const res = await fetch(`/api/ace/attendance/event/${selectedEventId}`);
      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      if (!data.success) throw new Error('Failed');

      const records = data.data.records;
      const event = data.data.event;

      // Build CSV
      const headers = [
        'Participant Name',
        'Email',
        'Check-In Time',
        'Check-Out Time',
        'Duration (min)',
        'Attendance %',
        'Status',
        'Verified',
      ];

      const rows = records.map((r: any) => [
        r.participant_name,
        r.participant_email,
        r.check_in_time || '',
        r.check_out_time || '',
        r.duration_minutes ?? '',
        r.attendance_percentage ?? '',
        r.status,
        r.verified ? 'Yes' : 'No',
      ]);

      const csv = [
        `Attendance Report - ${event.title}`,
        `Event Date: ${event.start_date}`,
        `Generated: ${new Date().toISOString()}`,
        '',
        headers.join(','),
        ...rows.map((row: string[]) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-${event.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage attendance for ACE continuing education events.
          </p>
        </div>

        {/* Event Selector */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <label
                  htmlFor="event-selector"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Event
                </label>
                <select
                  id="event-selector"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#1F4D3F] focus:outline-none focus:ring-1 focus:ring-[#1F4D3F]"
                >
                  <option value="">-- Select an event --</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} -{' '}
                      {new Date(event.startDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              {selectedEventId && (
                <div className="flex items-center gap-2 mt-4 sm:mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAttendanceData}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`}
                    />
                    Refresh
                  </Button>
                  <span className="text-xs text-gray-400">
                    Last: {lastRefreshed.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* No Event Selected */}
        {!selectedEventId && (
          <Card>
            <CardContent className="py-16 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Event Selected
              </h3>
              <p className="text-sm text-gray-500">
                Select an event above to view and manage attendance.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Event Selected - Show Dashboard */}
        {selectedEventId && summary && eventInfo && (
          <>
            {/* Event Info Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {eventInfo.title}
              </h2>
              <Badge
                variant="outline"
                className="bg-sky-100 text-sky-800 border-sky-200"
              >
                {eventInfo.status}
              </Badge>
              {eventInfo.duration_minutes && (
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200"
                >
                  <Timer className="h-3 w-3 mr-1" />
                  {eventInfo.duration_minutes} min event
                </Badge>
              )}
              {eventInfo.verification_method && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-800 border-amber-200"
                >
                  {eventInfo.verification_method.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>

            {/* Minimum Attendance Threshold */}
            {eventInfo.duration_minutes && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-700" />
                  <span className="text-sm font-medium text-amber-900">
                    Minimum Attendance Threshold:
                  </span>
                  <span className="text-sm text-amber-800">
                    {Math.ceil(eventInfo.duration_minutes * 0.8)} minutes (80%
                    of {eventInfo.duration_minutes} min) required for full CEU
                    credit.
                  </span>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total Registered"
                value={summary.total_registered}
                icon={Users}
              />
              <StatCard
                label="Checked In"
                value={summary.checked_in}
                icon={CheckCircle}
              />
              <StatCard
                label="Checked Out"
                value={summary.checked_out}
                icon={LogOut}
              />
              <StatCard
                label="Avg Duration"
                value={`${summary.average_duration_minutes} min`}
                icon={Clock}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={handleBulkVerify}
                disabled={bulkVerifying}
                className="text-white"
                style={{ backgroundColor: '#1F4D3F' }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {bulkVerifying
                  ? 'Verifying...'
                  : `Bulk Verify (${summary.meets_threshold} eligible)`}
              </Button>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Attendance Roster */}
            <AttendanceRoster eventId={selectedEventId} editable={true} />
          </>
        )}

        {/* Loading state for selected event */}
        {selectedEventId && !summary && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                      <div className="h-8 bg-gray-200 rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
