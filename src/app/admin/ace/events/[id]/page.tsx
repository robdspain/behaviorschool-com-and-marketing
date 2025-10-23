"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle,
  XCircle,
  Download,
  Edit,
  Award,
  FileText,
} from 'lucide-react';
import type { AceEvent, AceUser } from '@/lib/ace/types';

interface AttendanceRecord {
  id: string;
  participant_id: string;
  verified: boolean;
  sign_in_timestamp?: string;
  sign_out_timestamp?: string;
  participant: AceUser;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<AceEvent | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState<string | null>(null);
  const [generatingCert, setGeneratingCert] = useState<string | null>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchAttendance();
    fetchCertificates();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/admin/ace/events?id=${eventId}`);
      const data = await response.json();
      if (data.data) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/admin/ace/attendance?event_id=${eventId}`);
      const data = await response.json();
      if (data.data) {
        setAttendance(data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`/api/admin/ace/certificates?event_id=${eventId}`);
      const data = await response.json();
      if (data.data) {
        setCertificates(data.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleToggleAttendance = async (participantId: string, currentStatus: boolean) => {
    setSavingAttendance(participantId);

    try {
      const response = await fetch('/api/admin/ace/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
          verified: !currentStatus,
          sign_in_timestamp: !currentStatus ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        // Update local state
        setAttendance(attendance.map(a =>
          a.participant_id === participantId
            ? { ...a, verified: !currentStatus, sign_in_timestamp: !currentStatus ? new Date().toISOString() : undefined }
            : a
        ));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance');
    } finally {
      setSavingAttendance(null);
    }
  };

  const handleCheckInAll = async () => {
    if (!confirm('Mark all participants as attended?')) return;

    setSavingAttendance('all');

    try {
      const promises = attendance
        .filter(a => !a.verified)
        .map(a =>
          fetch('/api/admin/ace/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_id: eventId,
              participant_id: a.participant_id,
              verified: true,
              sign_in_timestamp: new Date().toISOString(),
            }),
          })
        );

      await Promise.all(promises);
      await fetchAttendance();
    } catch (error) {
      console.error('Error checking in all:', error);
      alert('Failed to check in all participants');
    } finally {
      setSavingAttendance(null);
    }
  };

  const handleGenerateCertificate = async (participantId: string) => {
    setGeneratingCert(participantId);

    try {
      const response = await fetch('/api/admin/ace/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          participant_id: participantId,
        }),
      });

      if (response.ok) {
        await fetchCertificates();
        alert('Certificate generated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate');
    } finally {
      setGeneratingCert(null);
    }
  };

  const handleGenerateAllCertificates = async () => {
    if (!confirm('Generate certificates for all attendees who don\'t have one yet?')) return;

    setGeneratingCert('all');

    try {
      const attendedWithoutCert = attendance.filter(a => {
        const hasCert = certificates.some(c => c.participant_id === a.participant_id);
        return a.verified && !hasCert;
      });

      const promises = attendedWithoutCert.map(a =>
        fetch('/api/admin/ace/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventId,
            participant_id: a.participant_id,
          }),
        })
      );

      await Promise.all(promises);
      await fetchCertificates();
      alert(`Generated ${attendedWithoutCert.length} certificates!`);
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Failed to generate some certificates');
    } finally {
      setGeneratingCert(null);
    }
  };

  const handleViewCertificate = (participantId: string) => {
    // Import certificate generator functions
    import('@/lib/ace/certificate-generator').then(({ generateCertificateHTML, prepareCertificateData, previewCertificate }) => {
      if (!event) return;
      
      const participant = attendance.find(a => a.participant_id === participantId)?.participant;
      if (!participant) return;

      const certData = prepareCertificateData(
        event,
        participant,
        'Behavior School'
      );

      const html = generateCertificateHTML(certData);
      previewCertificate(html);
    });
  };

  const exportAttendance = () => {
    if (!event) return;

    const csv = [
      ['Name', 'Email', 'BACB ID', 'Attended', 'Check-in Time', 'Certificate'].join(','),
      ...attendance.map(a => [
        `${a.participant.first_name} ${a.participant.last_name}`,
        a.participant.email,
        a.participant.bacb_id || 'N/A',
        a.verified ? 'Yes' : 'No',
        a.sign_in_timestamp ? new Date(a.sign_in_timestamp).toLocaleString() : 'N/A',
        certificates.some(c => c.participant_id === a.participant_id) ? 'Issued' : 'Not Issued',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '-')}-attendance.csv`;
    a.click();
  };

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const attendedCount = attendance.filter(a => a.verified).length;
  const attendanceRate = attendance.length > 0
    ? Math.round((attendedCount / attendance.length) * 100)
    : 0;
  const certificatesIssued = certificates.length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/admin/ace/events')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
                <Badge className={
                  event.status === 'completed' ? 'bg-green-100 text-green-800' :
                  event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {event.status.replace('_', ' ')}
                </Badge>
                {event.event_type && (
                  <Badge className="bg-purple-100 text-purple-800">
                    {event.event_type.toUpperCase()}
                  </Badge>
                )}
              </div>
              {event.description && (
                <p className="text-slate-600 text-lg">{event.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/ace/events/${eventId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          </div>

          {/* Event Details Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(event.start_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-slate-600">
                  {new Date(event.start_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-slate-500">CEUs</p>
                <p className="font-medium text-slate-900">{event.total_ceus} CEUs</p>
                <p className="text-sm text-slate-600 capitalize">
                  {event.ce_category}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {event.modality === 'in_person' ? (
                <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
              ) : (
                <Video className="w-5 h-5 text-emerald-600 mt-1" />
              )}
              <div>
                <p className="text-sm text-slate-500">Modality</p>
                <p className="font-medium text-slate-900 capitalize">
                  {event.modality.replace('_', ' ')}
                </p>
                {event.online_meeting_url && (
                  <a
                    href={event.online_meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <p className="text-sm text-slate-500">Participants</p>
                <p className="font-medium text-slate-900">
                  {event.current_participants || 0}
                  {event.max_participants && ` / ${event.max_participants}`}
                </p>
                <p className="text-sm text-slate-600">
                  {attendedCount} attended
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Attendance Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Registered</p>
                <p className="text-3xl font-bold text-slate-900">{attendance.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Attended</p>
                <p className="text-3xl font-bold text-green-600">{attendedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Absent</p>
                <p className="text-3xl font-bold text-red-600">
                  {attendance.length - attendedCount}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{certificatesIssued}</p>
              </div>
              <Award className="w-10 h-10 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-slate-900">{attendanceRate}%</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-full">
                <span className="text-emerald-600 font-bold text-sm">{attendanceRate}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Attendance List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Attendance List</h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportAttendance}
                disabled={attendance.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateAllCertificates}
                disabled={generatingCert === 'all' || attendedCount === 0}
                className="border-purple-600 text-purple-700 hover:bg-purple-50"
              >
                <Award className="w-4 h-4 mr-2" />
                Generate All Certificates
              </Button>
              <Button
                onClick={handleCheckInAll}
                disabled={savingAttendance === 'all' || attendedCount === attendance.length}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Check In All
              </Button>
            </div>
          </div>

          {attendance.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No participants registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendance.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    record.verified
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      record.verified ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {record.participant.first_name[0]}{record.participant.last_name[0]}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-900">
                          {record.participant.first_name} {record.participant.last_name}
                        </p>
                        {record.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Attended
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <span>{record.participant.email}</span>
                        {record.participant.bacb_id && (
                          <>
                            <span>•</span>
                            <span>BACB: {record.participant.bacb_id}</span>
                          </>
                        )}
                        {record.sign_in_timestamp && (
                          <>
                            <span>•</span>
                            <span>
                              Checked in: {new Date(record.sign_in_timestamp).toLocaleTimeString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {record.verified && (
                      <>
                        {certificates.some(c => c.participant_id === record.participant_id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCertificate(record.participant_id)}
                            className="border-purple-600 text-purple-700 hover:bg-purple-50"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Certificate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateCertificate(record.participant_id)}
                            disabled={generatingCert === record.participant_id}
                            className="border-purple-600 text-purple-700 hover:bg-purple-50"
                          >
                            <Award className="w-4 h-4 mr-2" />
                            {generatingCert === record.participant_id ? 'Generating...' : 'Generate Certificate'}
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      variant={record.verified ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleAttendance(record.participant_id, record.verified)}
                      disabled={savingAttendance === record.participant_id}
                      className={record.verified ? '' : 'bg-emerald-600 hover:bg-emerald-700'}
                    >
                      {savingAttendance === record.participant_id ? (
                        'Saving...'
                      ) : record.verified ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Mark Absent
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Attended
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
