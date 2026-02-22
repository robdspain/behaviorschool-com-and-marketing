'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  LogOut,
  Clock,
  Search,
  AlertCircle,
  Timer,
  KeyRound,
  CalendarDays,
  MapPin,
} from 'lucide-react';

type CheckInState = 'lookup' | 'checked_in' | 'checked_out';

interface RegistrationInfo {
  _id: string;
  eventId: string;
  participantId: string;
  confirmationCode: string;
  status: string;
  event?: {
    _id: string;
    title: string;
    startDate: number;
    endDate?: number;
    location?: string;
    verificationMethod?: string;
  };
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AttendanceData {
  signInTimestamp?: number;
  signOutTimestamp?: number;
  verificationCodeEntered?: string;
  verified: boolean;
}

export default function ParticipantCheckInPage() {
  const [lookupValue, setLookupValue] = useState('');
  const [lookupType, setLookupType] = useState<'code' | 'email'>('code');
  const [state, setState] = useState<CheckInState>('lookup');
  const [registration, setRegistration] = useState<RegistrationInfo | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time clock
  const updateElapsedTime = useCallback(() => {
    if (!attendance?.signInTimestamp) return;

    const now = Date.now();
    const elapsed = now - attendance.signInTimestamp;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    setElapsedTime(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }, [attendance?.signInTimestamp]);

  useEffect(() => {
    if (state === 'checked_in' && attendance?.signInTimestamp) {
      updateElapsedTime();
      timerRef.current = setInterval(updateElapsedTime, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, attendance?.signInTimestamp, updateElapsedTime]);

  // Look up registration
  const handleLookup = async () => {
    if (!lookupValue.trim()) {
      setError('Please enter your confirmation code or email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const param =
        lookupType === 'code'
          ? `code=${encodeURIComponent(lookupValue.trim())}`
          : `email=${encodeURIComponent(lookupValue.trim().toLowerCase())}`;

      const res = await fetch(`/api/ace/registrations?${param}`);
      if (!res.ok) throw new Error('Failed to look up registration');

      const data = await res.json();

      if (!data.success || !data.registrations || data.registrations.length === 0) {
        setError(
          lookupType === 'code'
            ? 'No registration found with that confirmation code. Please check and try again.'
            : 'No registration found with that email address.'
        );
        return;
      }

      // Use the most recent / first registration
      const reg = data.registrations[0];
      setRegistration(reg);

      // Check if already checked in
      const attendanceRes = await fetch(
        `/api/ace/attendance?event_id=${reg.eventId}&participant_id=${reg.participantId}`
      );

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        if (attendanceData.success && attendanceData.data && attendanceData.data.length > 0) {
          const record = attendanceData.data[0];
          setAttendance(record);

          if (record.signOutTimestamp) {
            setState('checked_out');
          } else if (record.signInTimestamp) {
            setState('checked_in');
          } else {
            setState('lookup');
          }
          return;
        }
      }

      // Not checked in yet - stay on lookup but show ready state
      setState('lookup');
    } catch (err) {
      console.error('Lookup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check in
  const handleCheckIn = async () => {
    if (!registration) return;

    setCheckingIn(true);
    setError('');

    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: registration.eventId,
          participant_id: registration.participantId,
          action: 'check_in',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check in');
      }

      const data = await res.json();
      setAttendance(data.data);
      setState('checked_in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  // Check out
  const handleCheckOut = async () => {
    if (!registration) return;

    setCheckingOut(true);
    setError('');

    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: registration.eventId,
          participant_id: registration.participantId,
          action: 'check_out',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check out');
      }

      const data = await res.json();
      setAttendance(data.data);
      setState('checked_out');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  // Submit verification code
  const handleSubmitVerificationCode = async () => {
    if (!registration || !verificationCode.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    setSubmittingCode(true);
    setError('');

    try {
      const res = await fetch('/api/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: registration.eventId,
          participant_id: registration.participantId,
          action: 'verify_code',
          verification_code: verificationCode.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit verification code');
      }

      const data = await res.json();
      setAttendance(data.data);
      setVerificationCode('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit verification code'
      );
    } finally {
      setSubmittingCode(false);
    }
  };

  // Reset to lookup
  const handleReset = () => {
    setState('lookup');
    setRegistration(null);
    setAttendance(null);
    setLookupValue('');
    setError('');
    setVerificationCode('');
    setElapsedTime('00:00:00');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(31, 77, 63, 0.1)' }}
          >
            <CheckCircle className="h-8 w-8" style={{ color: '#1F4D3F' }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Event Check-In</h1>
          <p className="text-gray-600 mt-1">
            Check in to your continuing education event
          </p>
        </div>

        {/* Lookup Form */}
        {state === 'lookup' && !registration && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Toggle lookup type */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLookupType('code')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    lookupType === 'code'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 bg-gray-50'
                  }`}
                  style={
                    lookupType === 'code'
                      ? { backgroundColor: '#1F4D3F' }
                      : undefined
                  }
                >
                  Confirmation Code
                </button>
                <button
                  type="button"
                  onClick={() => setLookupType('email')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    lookupType === 'email'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900 bg-gray-50'
                  }`}
                  style={
                    lookupType === 'email'
                      ? { backgroundColor: '#1F4D3F' }
                      : undefined
                  }
                >
                  Email Address
                </button>
              </div>

              {/* Input */}
              <div>
                <label
                  htmlFor="lookup-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {lookupType === 'code'
                    ? 'Enter your confirmation code'
                    : 'Enter your email address'}
                </label>
                <Input
                  id="lookup-input"
                  type={lookupType === 'email' ? 'email' : 'text'}
                  placeholder={
                    lookupType === 'code'
                      ? 'e.g., ACE-XXXX-XXXX'
                      : 'e.g., you@example.com'
                  }
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="text-lg py-6"
                  autoFocus
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Look up button */}
              <Button
                onClick={handleLookup}
                disabled={loading}
                className="w-full py-6 text-lg text-white"
                style={{ backgroundColor: '#1F4D3F' }}
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Looking up...' : 'Find My Registration'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Registration Found - Ready to Check In */}
        {state === 'lookup' && registration && (
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Participant Info */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  Welcome,{' '}
                  {registration.participant
                    ? `${registration.participant.firstName} ${registration.participant.lastName}`
                    : 'Participant'}
                  !
                </p>
                {registration.participant?.email && (
                  <p className="text-sm text-gray-500">
                    {registration.participant.email}
                  </p>
                )}
              </div>

              {/* Event Info */}
              {registration.event && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-gray-900">
                    {registration.event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(registration.event.startDate).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </div>
                  {registration.event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {registration.event.location}
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Check In Button - Large touch target */}
              <Button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full py-8 text-xl font-bold text-white rounded-xl"
                style={{ backgroundColor: '#1F4D3F' }}
              >
                <CheckCircle className="h-7 w-7 mr-3" />
                {checkingIn ? 'Checking In...' : 'CHECK IN'}
              </Button>

              <button
                onClick={handleReset}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Not you? Search again
              </button>
            </CardContent>
          </Card>
        )}

        {/* Checked In State */}
        {state === 'checked_in' && registration && (
          <Card className="border-2" style={{ borderColor: '#1F4D3F' }}>
            <CardContent className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="text-center">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-base px-4 py-1.5">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Checked In
                </Badge>
              </div>

              {/* Participant Name */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {registration.participant
                    ? `${registration.participant.firstName} ${registration.participant.lastName}`
                    : 'Participant'}
                </p>
              </div>

              {/* Event Info */}
              {registration.event && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 text-center">
                    {registration.event.title}
                  </h3>
                </div>
              )}

              {/* Elapsed Time Clock */}
              <div className="text-center py-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Time Elapsed
                  </span>
                </div>
                <div
                  className="text-5xl font-mono font-bold tabular-nums"
                  style={{ color: '#1F4D3F' }}
                >
                  {elapsedTime}
                </div>
                {attendance?.signInTimestamp && (
                  <p className="text-xs text-gray-400 mt-2">
                    Checked in at{' '}
                    {new Date(attendance.signInTimestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Verification Code Entry */}
              {registration.event?.verificationMethod === 'verification_code' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-gray-500" />
                    <label
                      htmlFor="verification-code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enter Verification Code
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest font-mono"
                    />
                    <Button
                      onClick={handleSubmitVerificationCode}
                      disabled={submittingCode || !verificationCode.trim()}
                      style={{ backgroundColor: '#D4AF37' }}
                      className="text-white px-6"
                    >
                      {submittingCode ? '...' : 'Submit'}
                    </Button>
                  </div>
                  {attendance?.verificationCodeEntered && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Code submitted: {attendance.verificationCodeEntered}
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Check Out Button - Large touch target */}
              <Button
                onClick={handleCheckOut}
                disabled={checkingOut}
                variant="outline"
                className="w-full py-8 text-xl font-bold rounded-xl border-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-7 w-7 mr-3" />
                {checkingOut ? 'Checking Out...' : 'CHECK OUT'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Checked Out State */}
        {state === 'checked_out' && registration && (
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Status */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Checked Out
                </h2>
                <p className="text-gray-600">
                  Thank you for attending!
                </p>
              </div>

              {/* Summary */}
              {registration.event && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-gray-900">
                    {registration.event.title}
                  </h3>
                  {attendance?.signInTimestamp && attendance?.signOutTimestamp && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {new Date(
                            attendance.signInTimestamp
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {new Date(
                            attendance.signOutTimestamp
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Total Duration</p>
                        <p className="font-medium text-lg" style={{ color: '#1F4D3F' }}>
                          {Math.round(
                            (attendance.signOutTimestamp -
                              attendance.signInTimestamp) /
                              (1000 * 60)
                          )}{' '}
                          minutes
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full py-4"
              >
                Check In Another Participant
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
