'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AceEvent } from '@/lib/ace/types';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<AceEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ace/events/${id}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.data);
      } else {
        setError(data.error || 'Failed to load event');
      }
    } catch (err) {
      setError('An error occurred while loading the event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!confirm('Submit this event for coordinator approval?')) return;

    try {
      const res = await fetch(`/api/ace/events/${id}/submit`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchEvent();
        alert('Event submitted for approval');
      } else {
        alert(data.error || 'Failed to submit event');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const handleApprove = async () => {
    if (!confirm('Approve this event?')) return;

    try {
      const res = await fetch(`/api/ace/events/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy: 'current-user-id' }), // Replace with actual user ID
      });
      const data = await res.json();
      if (data.success) {
        fetchEvent();
        alert('Event approved!');
      } else {
        alert(data.error || 'Failed to approve event');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      const res = await fetch(`/api/ace/events/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEvent();
        alert('Event rejected');
      } else {
        alert(data.error || 'Failed to reject event');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This will archive the event.')) {
      return;
    }

    try {
      const res = await fetch(`/api/ace/events/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/ace/events');
      } else {
        alert(data.error || 'Failed to delete event');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-600">{error || 'Event not found'}</p>
            <Link
              href="/admin/ace/events"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/ace/events" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Events
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <div className="mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {event.status === 'draft' && (
                <button
                  onClick={handleSubmitForApproval}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Submit for Approval
                </button>
              )}
              {event.status === 'pending_approval' && (
                <>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-gray-900">{event.description}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-gray-900 capitalize">{event.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Modality</dt>
                    <dd className="mt-1 text-gray-900 capitalize">{event.modality.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-gray-900">{event.duration_minutes} minutes</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">CEUs Offered</dt>
                    <dd className="mt-1 text-gray-900 font-semibold">{event.ceus_offered}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(event.start_date).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(event.end_date).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                    <dd className="mt-1 text-gray-900">{event.timezone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fee</dt>
                    <dd className="mt-1 text-gray-900">
                      {event.is_free ? 'Free' : `$${event.fee.toFixed(2)}`}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Learning Objectives</dt>
                  <dd className="mt-1">
                    <ul className="list-disc list-inside space-y-1 text-gray-900">
                      {event.learning_objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Verification & Assessment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification & Assessment</h2>
              <dl className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Verification Method</dt>
                    <dd className="mt-1 text-gray-900 capitalize">
                      {event.verification_method.replace('_', ' ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Passing Score</dt>
                    <dd className="mt-1 text-gray-900">{event.passing_score_percentage}%</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Participants</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {event.current_participants}
                    {event.max_participants && ` / ${event.max_participants}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href={`/admin/ace/events/${id}/quiz`}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Manage Quiz
                </Link>
                <Link
                  href={`/admin/ace/events/${id}/materials`}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Manage Materials
                </Link>
                <Link
                  href={`/admin/ace/events/${id}/registrations`}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  View Registrations
                </Link>
                <Link
                  href={`/admin/ace/events/${id}/certificates`}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Issue Certificates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
