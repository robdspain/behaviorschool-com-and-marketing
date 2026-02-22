'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Timer,
  KeyRound,
  Copy,
  AlertTriangle,
  UserPlus,
  Eye,
} from 'lucide-react';

interface EventDetails {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  duration_minutes: number | null;
  verification_method: string | null;
  status: string;
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

interface AttendanceRecord {
  id: string | null;
  event_id: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  check_in_time: string | null;
  check_out_time: string | null;
  duration_minutes: number | null;
  attendance_percentage: number | null;
  status: 'present' | 'absent' | 'partial' | 'checked_in';
  verified: boolean;
  verified_at: string | null;
  verification_method: string | null;
  verification_code_entered: string | null;
}

export default function EventAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [manualCheckInEmail, setManualCheckInEmail] = useState('');
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);
  const [manualCheckInLoading, setManualCheckInLoading] = useState(false);
  const [bulkVerifying, setBulkVerifying] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch attendance data
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/ace/attendance/event/${eventId}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.success) {
        setEventDetails(data.data.event);
        setRecords(data.data.records);
        setSummary(data.data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  }, [eventId]);

  // Initial load + polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Generate random 6-digit verification code
  const generateVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setShowVerificationCode(true);
  };

  // Copy verification code to clipboard
  const copyVerificationCode = () => {
    navigator.clipboard.writeText(verificationCode);
  };

  // Manual check-in by coordinator
  const handleManualCheckIn = async (
    participantId: string,
    action: 'check_in' | 'check_out'
  ) => {
    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          action,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Manual action error:', data.error);
      }

      await fetchData();
    } catch (err) {
      console.error('Manual action error:', err);
    }
  };

  // Bulk verify all who meet threshold
  const handleBulkVerify = async () => {
    setBulkVerifying(true);
    try {
      const toVerify = records.filter(
        (r) =>
          r.id &&
          r.attendance_percentage !== null &&
          r.attendance_percentage >= 80 &&
          !r.verified
      );

      for (const record of toVerify) {
        await fetch(`/api/ace/attendance/${record.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: true }),
        });
      }

      await fetchData();
    } catch (err) {
      console.error('Bulk verify error:', err);
    } finally {
      setBulkVerifying(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    if (!eventDetails) return;

    const headers = [
      'Participant Name',
      'Email',
      'Check-In Time',
      'Check-Out Time',
      'Duration (min)',
      'Attendance %',
      'Status',
      'Verified',
      'Verification Code',
    ];

    const rows = records.map((r) => [
      r.participant_name,
      r.participant_email,
      r.check_in_time || '',
      r.check_out_time || '',
      r.duration_minutes ?? '',
      r.attendance_percentage ?? '',
      r.status,
      r.verified ? 'Yes' : 'No',
      r.verification_code_entered || '',
    ]);

    const csv = [
      `Attendance Report - ${eventDetails.title}`,
      `Event Date: ${eventDetails.start_date}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${eventDetails.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get attendance percentage color
  const getPercentageColor = (pct: number | null): string => {
    if (pct === null) return 'text-gray-400';
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRowBg = (record: AttendanceRecord): string => {
    if (record.status === 'absent') return 'bg-red-50';
    if (
      record.attendance_percentage !== null &&
      record.attendance_percentage < 50
    )
      return 'bg-red-50';
    if (
      record.attendance_percentage !== null &&
      record.attendance_percentage < 80
    )
      return 'bg-amber-50';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="h-64 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Attendance
            </h1>
            {eventDetails && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <p className="text-gray-600">{eventDetails.title}</p>
                <Badge
                  variant="outline"
                  className="bg-sky-100 text-sky-800 border-sky-200"
                >
                  {eventDetails.status}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <span className="text-xs text-gray-400">
              {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Event Duration & Threshold */}
        {eventDetails?.duration_minutes && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <Clock className="h-4 w-4 text-amber-700" />
              <span className="text-sm font-medium text-amber-900">
                Event Duration: {eventDetails.duration_minutes} minutes
              </span>
              <span className="text-amber-600">|</span>
              <span className="text-sm text-amber-800">
                Minimum 80% ({Math.ceil(eventDetails.duration_minutes * 0.8)}{' '}
                min) required for full CEU credit
              </span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {summary && (
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
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Bulk Verify */}
          <Button
            onClick={handleBulkVerify}
            disabled={bulkVerifying}
            className="text-white"
            style={{ backgroundColor: '#1F4D3F' }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {bulkVerifying
              ? 'Verifying...'
              : `Bulk Verify (${summary?.meets_threshold || 0} eligible)`}
          </Button>

          {/* Generate Verification Code */}
          <Button
            variant="outline"
            onClick={generateVerificationCode}
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-amber-50"
          >
            <KeyRound className="h-4 w-4 mr-2" />
            Generate Code
          </Button>

          {/* Manual Check-In */}
          <Button
            variant="outline"
            onClick={() => setShowManualCheckIn(!showManualCheckIn)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Manual Check-In
          </Button>

          {/* Export */}
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Verification Code Display */}
        {showVerificationCode && verificationCode && (
          <Card className="mb-6 border-2" style={{ borderColor: '#D4AF37' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Current Verification Code
                  </p>
                  <p className="text-4xl font-mono font-bold tracking-[0.3em]" style={{ color: '#1F4D3F' }}>
                    {verificationCode}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Display this code to attendees for verification
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyVerificationCode}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateVerificationCode}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    New
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVerificationCode(false)}
                  >
                    Hide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Check-In Panel */}
        {showManualCheckIn && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Manual Check-In / Check-Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Use the action buttons in the roster below to manually check
                participants in or out. This is a coordinator override feature.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Live Roster */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Live Attendance Roster
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Participant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Check-In
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Check-Out
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Attendance %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Verified
                    </th>
                    {showManualCheckIn && (
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td
                        colSpan={showManualCheckIn ? 8 : 7}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        No attendance records yet. Participants will appear here
                        as they check in.
                      </td>
                    </tr>
                  ) : (
                    records.map((record, idx) => (
                      <tr
                        key={record.participant_id + idx}
                        className={`border-b last:border-b-0 transition-colors ${getRowBg(record)}`}
                      >
                        {/* Participant */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {record.participant_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {record.participant_email}
                            </p>
                          </div>
                        </td>
                        {/* Check-In */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.check_in_time
                            ? new Date(
                                record.check_in_time
                              ).toLocaleTimeString()
                            : '-'}
                        </td>
                        {/* Check-Out */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.check_out_time
                            ? new Date(
                                record.check_out_time
                              ).toLocaleTimeString()
                            : '-'}
                        </td>
                        {/* Duration */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {record.duration_minutes !== null
                            ? `${record.duration_minutes} min`
                            : '-'}
                        </td>
                        {/* Attendance % */}
                        <td className="px-4 py-3">
                          {record.attendance_percentage !== null ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    record.attendance_percentage >= 80
                                      ? 'bg-emerald-500'
                                      : record.attendance_percentage >= 50
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, record.attendance_percentage)}%`,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-sm font-medium ${getPercentageColor(record.attendance_percentage)}`}
                              >
                                {record.attendance_percentage}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              record.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : record.status === 'checked_in'
                                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                                  : record.status === 'partial'
                                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {record.status === 'present'
                              ? 'Present'
                              : record.status === 'checked_in'
                                ? 'In Session'
                                : record.status === 'partial'
                                  ? 'Partial'
                                  : 'Absent'}
                          </Badge>
                        </td>
                        {/* Verified */}
                        <td className="px-4 py-3">
                          {record.verified ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : record.id ? (
                            <button
                              onClick={async () => {
                                await fetch(
                                  `/api/ace/attendance/${record.id}`,
                                  {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ verified: true }),
                                  }
                                );
                                await fetchData();
                              }}
                              className="text-gray-400 hover:text-emerald-500 transition-colors"
                              title="Click to verify"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        {/* Manual Actions */}
                        {showManualCheckIn && (
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {!record.check_in_time && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleManualCheckIn(
                                      record.participant_id,
                                      'check_in'
                                    )
                                  }
                                  className="text-xs"
                                >
                                  Check In
                                </Button>
                              )}
                              {record.check_in_time &&
                                !record.check_out_time && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleManualCheckIn(
                                        record.participant_id,
                                        'check_out'
                                      )
                                    }
                                    className="text-xs"
                                  >
                                    Check Out
                                  </Button>
                                )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Below-threshold warning */}
            {records.some(
              (r) =>
                r.attendance_percentage !== null &&
                r.attendance_percentage < 80 &&
                r.attendance_percentage > 0
            ) && (
              <div className="mt-4 flex items-start gap-2 text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-200">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    Participants Below 80% Threshold
                  </p>
                  <p className="text-xs mt-0.5">
                    Rows highlighted in yellow/red indicate participants who
                    have not met the minimum 80% attendance requirement for
                    full CEU credit. These participants will not be eligible
                    for certificates until the threshold is met.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Summary Statistics */}
        {summary && records.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.total_registered}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Registered</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">
                    {summary.checked_in}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Checked In</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {summary.checked_out}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Checked Out</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold" style={{ color: '#1F4D3F' }}>
                    {summary.meets_threshold}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Meet Threshold</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                    {summary.verified}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Verified</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">
                    {summary.average_duration_minutes}
                    <span className="text-sm font-normal"> min</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
