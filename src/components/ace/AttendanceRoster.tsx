'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Inbox,
  Loader2,
} from 'lucide-react';

interface AttendanceRosterProps {
  eventId: string;
  editable?: boolean;
}

interface RosterRecord {
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

type SortField =
  | 'participant_name'
  | 'check_in_time'
  | 'check_out_time'
  | 'duration_minutes'
  | 'attendance_percentage'
  | 'status'
  | 'verified';

type SortDirection = 'asc' | 'desc';

export function AttendanceRoster({ eventId, editable = false }: AttendanceRosterProps) {
  const [records, setRecords] = useState<RosterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('participant_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());
  const [bulkVerifying, setBulkVerifying] = useState(false);

  // Fetch records
  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/ace/attendance/event/${eventId}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.success) {
        setRecords(data.data.records);
      }
    } catch (err) {
      console.error('Failed to fetch roster:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchRecords();
    // Polling every 30s
    const interval = setInterval(fetchRecords, 30000);
    return () => clearInterval(interval);
  }, [fetchRecords]);

  // Filter by search
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();
    return records.filter(
      (r) =>
        r.participant_name.toLowerCase().includes(term) ||
        r.participant_email.toLowerCase().includes(term)
    );
  }, [records, searchTerm]);

  // Sort records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal: string | number | boolean | null = null;
      let bVal: string | number | boolean | null = null;

      switch (sortField) {
        case 'participant_name':
          aVal = a.participant_name.toLowerCase();
          bVal = b.participant_name.toLowerCase();
          break;
        case 'check_in_time':
          aVal = a.check_in_time || '';
          bVal = b.check_in_time || '';
          break;
        case 'check_out_time':
          aVal = a.check_out_time || '';
          bVal = b.check_out_time || '';
          break;
        case 'duration_minutes':
          aVal = a.duration_minutes ?? -1;
          bVal = b.duration_minutes ?? -1;
          break;
        case 'attendance_percentage':
          aVal = a.attendance_percentage ?? -1;
          bVal = b.attendance_percentage ?? -1;
          break;
        case 'status':
          const statusOrder = { present: 4, checked_in: 3, partial: 2, absent: 1 };
          aVal = statusOrder[a.status] || 0;
          bVal = statusOrder[b.status] || 0;
          break;
        case 'verified':
          aVal = a.verified ? 1 : 0;
          bVal = b.verified ? 1 : 0;
          break;
      }

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? -1 : 1;
      if (bVal === null) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-gray-700" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-gray-700" />
    );
  };

  // Toggle verify for a single record
  const handleToggleVerify = async (record: RosterRecord) => {
    if (!record.id || !editable) return;

    setVerifyingIds((prev) => new Set([...prev, record.id!]));

    try {
      const res = await fetch(`/api/ace/attendance/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !record.verified }),
      });

      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === record.id ? { ...r, verified: !r.verified } : r
          )
        );
      }
    } catch (err) {
      console.error('Verify error:', err);
    } finally {
      setVerifyingIds((prev) => {
        const next = new Set(prev);
        next.delete(record.id!);
        return next;
      });
    }
  };

  // Bulk verify all eligible (80%+ attendance)
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

      await fetchRecords();
    } catch (err) {
      console.error('Bulk verify error:', err);
    } finally {
      setBulkVerifying(false);
    }
  };

  // Bulk unverify all
  const handleBulkUnverify = async () => {
    setBulkVerifying(true);
    try {
      const toUnverify = records.filter((r) => r.id && r.verified);

      for (const record of toUnverify) {
        await fetch(`/api/ace/attendance/${record.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: false }),
        });
      }

      await fetchRecords();
    } catch (err) {
      console.error('Bulk unverify error:', err);
    } finally {
      setBulkVerifying(false);
    }
  };

  // Get row background color based on attendance percentage
  const getRowBg = (record: RosterRecord): string => {
    if (record.status === 'absent') return 'bg-red-50/60';
    if (
      record.attendance_percentage !== null &&
      record.attendance_percentage < 50
    )
      return 'bg-red-50/60';
    if (
      record.attendance_percentage !== null &&
      record.attendance_percentage < 80
    )
      return 'bg-amber-50/60';
    if (record.verified) return 'bg-emerald-50/30';
    return '';
  };

  // Get status badge
  const getStatusBadge = (status: RosterRecord['status']) => {
    switch (status) {
      case 'present':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
          >
            Present
          </Badge>
        );
      case 'checked_in':
        return (
          <Badge
            variant="outline"
            className="bg-sky-100 text-sky-800 border-sky-200 text-xs"
          >
            In Session
          </Badge>
        );
      case 'partial':
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200 text-xs"
          >
            Partial
          </Badge>
        );
      case 'absent':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-200 text-xs"
          >
            Absent
          </Badge>
        );
    }
  };

  // Loading
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Roster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full max-w-sm mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Roster
            <Badge variant="outline" className="text-xs font-normal">
              {records.length} participants
            </Badge>
          </CardTitle>

          {/* Bulk Actions */}
          {editable && records.some((r) => r.id) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkVerify}
                disabled={bulkVerifying}
                className="text-xs"
              >
                {bulkVerifying ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                Verify Eligible
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkUnverify}
                disabled={bulkVerifying}
                className="text-xs text-gray-500"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Unverify All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    { field: 'participant_name' as SortField, label: 'Participant' },
                    { field: 'check_in_time' as SortField, label: 'Check-In' },
                    { field: 'check_out_time' as SortField, label: 'Check-Out' },
                    { field: 'duration_minutes' as SortField, label: 'Duration' },
                    { field: 'attendance_percentage' as SortField, label: 'Attendance' },
                    { field: 'status' as SortField, label: 'Status' },
                    { field: 'verified' as SortField, label: 'Verified' },
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-700"
                      onClick={() => handleSort(field)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{label}</span>
                        {getSortIcon(field)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Inbox className="h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-sm font-medium text-gray-900">
                          {searchTerm
                            ? 'No matching participants'
                            : 'No attendance records'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {searchTerm
                            ? 'Try a different search term.'
                            : 'Participants will appear here as they check in.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedRecords.map((record, idx) => (
                    <tr
                      key={record.participant_id + idx}
                      className={`border-b last:border-b-0 transition-colors hover:bg-gray-50/50 ${getRowBg(record)}`}
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

                      {/* Check-In Time */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.check_in_time
                          ? new Date(record.check_in_time).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' }
                            )
                          : '-'}
                      </td>

                      {/* Check-Out Time */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.check_out_time
                          ? new Date(record.check_out_time).toLocaleTimeString(
                              [],
                              { hour: '2-digit', minute: '2-digit' }
                            )
                          : '-'}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.duration_minutes !== null
                          ? `${record.duration_minutes} min`
                          : '-'}
                      </td>

                      {/* Attendance Percentage */}
                      <td className="px-4 py-3">
                        {record.attendance_percentage !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
                              className={`text-xs font-medium ${
                                record.attendance_percentage >= 80
                                  ? 'text-emerald-600'
                                  : record.attendance_percentage >= 50
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {record.attendance_percentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {getStatusBadge(record.status)}
                      </td>

                      {/* Verified */}
                      <td className="px-4 py-3">
                        {editable && record.id ? (
                          <button
                            onClick={() => handleToggleVerify(record)}
                            disabled={verifyingIds.has(record.id)}
                            className="transition-colors"
                            title={
                              record.verified
                                ? 'Click to unverify'
                                : 'Click to verify'
                            }
                          >
                            {verifyingIds.has(record.id) ? (
                              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            ) : record.verified ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 hover:text-emerald-700" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-gray-300 hover:text-emerald-500" />
                            )}
                          </button>
                        ) : record.verified ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-50 border border-amber-200" />
            <span>Below 80% threshold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-50 border border-red-200" />
            <span>Absent / Below 50%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
