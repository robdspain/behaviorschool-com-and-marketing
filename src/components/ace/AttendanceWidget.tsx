'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  LogOut,
  Timer,
  KeyRound,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AttendanceWidgetProps {
  eventId: string;
  participantId: string;
  participantName: string;
}

interface AttendanceState {
  signInTimestamp?: number;
  signOutTimestamp?: number;
  verificationCodeEntered?: string;
  verified: boolean;
}

type WidgetStatus = 'loading' | 'not_checked_in' | 'checked_in' | 'checked_out' | 'error';

export function AttendanceWidget({
  eventId,
  participantId,
  participantName,
}: AttendanceWidgetProps) {
  const [status, setStatus] = useState<WidgetStatus>('loading');
  const [attendance, setAttendance] = useState<AttendanceState | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current attendance status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/ace/attendance?event_id=${eventId}&participant_id=${participantId}`
      );
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const record = data.data[0];
        setAttendance(record);

        if (record.signOutTimestamp) {
          setStatus('checked_out');
        } else if (record.signInTimestamp) {
          setStatus('checked_in');
        } else {
          setStatus('not_checked_in');
        }
      } else {
        setStatus('not_checked_in');
      }
    } catch {
      setStatus('error');
    }
  }, [eventId, participantId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Update elapsed time
  const updateElapsedTime = useCallback(() => {
    if (!attendance?.signInTimestamp) return;
    const endTime = attendance.signOutTimestamp || Date.now();
    const elapsed = endTime - attendance.signInTimestamp;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    setElapsedTime(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }, [attendance?.signInTimestamp, attendance?.signOutTimestamp]);

  useEffect(() => {
    if (status === 'checked_in' && attendance?.signInTimestamp) {
      updateElapsedTime();
      timerRef.current = setInterval(updateElapsedTime, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    if (status === 'checked_out') {
      updateElapsedTime();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, attendance?.signInTimestamp, updateElapsedTime]);

  // Check in
  const handleCheckIn = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          action: 'check_in',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check in');
      }
      const data = await res.json();
      setAttendance(data.data);
      setStatus('checked_in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Check out
  const handleCheckOut = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          action: 'check_out',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check out');
      }
      const data = await res.json();
      setAttendance(data.data);
      setStatus('checked_out');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit verification code
  const handleSubmitCode = async () => {
    if (!verificationCode.trim()) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          action: 'verify_code',
          verification_code: verificationCode.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit code');
      }
      const data = await res.json();
      setAttendance(data.data);
      setVerificationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code submission failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Loading attendance...</span>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Failed to load attendance status</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={fetchStatus}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={
        status === 'checked_in'
          ? 'border-2'
          : ''
      }
      style={status === 'checked_in' ? { borderColor: '#1F4D3F' } : undefined}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {participantName}
            </p>
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
          <Badge
            variant="outline"
            className={
              status === 'checked_in'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : status === 'checked_out'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
            }
          >
            {status === 'checked_in'
              ? 'In Session'
              : status === 'checked_out'
                ? 'Completed'
                : 'Not Checked In'}
          </Badge>
        </div>

        {/* Duration Timer */}
        {(status === 'checked_in' || status === 'checked_out') && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Timer className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {status === 'checked_in' ? 'Elapsed' : 'Total Time'}
              </span>
            </div>
            <p
              className="text-3xl font-mono font-bold tabular-nums"
              style={{ color: '#1F4D3F' }}
            >
              {elapsedTime}
            </p>
          </div>
        )}

        {/* Check-In Button */}
        {status === 'not_checked_in' && (
          <Button
            onClick={handleCheckIn}
            disabled={actionLoading}
            className="w-full py-5 text-base text-white"
            style={{ backgroundColor: '#1F4D3F' }}
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            Check In
          </Button>
        )}

        {/* Check-Out Button */}
        {status === 'checked_in' && (
          <Button
            onClick={handleCheckOut}
            disabled={actionLoading}
            variant="outline"
            className="w-full py-5 text-base border-red-300 text-red-700 hover:bg-red-50"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <LogOut className="h-5 w-5 mr-2" />
            )}
            Check Out
          </Button>
        )}

        {/* Verification Code Entry (shown when checked in) */}
        {status === 'checked_in' && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">
                Verification Code
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center font-mono tracking-widest text-sm"
              />
              <Button
                onClick={handleSubmitCode}
                disabled={actionLoading || !verificationCode.trim()}
                size="sm"
                style={{ backgroundColor: '#D4AF37' }}
                className="text-white px-4"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'OK'
                )}
              </Button>
            </div>
            {attendance?.verificationCodeEntered && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Code submitted
              </p>
            )}
          </div>
        )}

        {/* Checked Out Summary */}
        {status === 'checked_out' && attendance && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {attendance.signInTimestamp && (
                <>
                  {new Date(attendance.signInTimestamp).toLocaleTimeString()} -{' '}
                  {attendance.signOutTimestamp &&
                    new Date(attendance.signOutTimestamp).toLocaleTimeString()}
                </>
              )}
            </p>
            {attendance.verified && (
              <Badge className="mt-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded p-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
