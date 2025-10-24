'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AceProviderDashboard } from '@/lib/ace/types';

export default function AdminAceDashboard() {
  const [stats, setStats] = useState<AceProviderDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats for the current user's provider
    fetch('/api/ace/providers/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ACE Provider Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your BACB-approved continuing education events
          </p>
        </div>

        {/* Stats Overview */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Total Events</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total_events}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Active Events</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{stats.active_events}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Total Registrations</div>
              <div className="mt-2 text-3xl font-bold text-green-600">
                {stats.total_registrations}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500">Certificates Issued</div>
              <div className="mt-2 text-3xl font-bold text-purple-600">
                {stats.total_certificates_issued}
              </div>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/ace/events/new"
                className="flex items-center justify-center px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                + Create New Event
              </Link>
              <Link
                href="/admin/ace/events"
                className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Manage Events
              </Link>
              <Link
                href="/admin/ace/users"
                className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/ace/events"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
            <p className="text-gray-600 text-sm">
              Create and manage CE events, approve submissions, track attendance
            </p>
          </Link>

          <Link
            href="/admin/ace/providers"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Providers</h3>
            <p className="text-gray-600 text-sm">
              Manage ACE providers, track renewals, monitor compliance
            </p>
          </Link>

          <Link
            href="/admin/ace/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
            <p className="text-gray-600 text-sm">
              Manage participants, instructors, and coordinators
            </p>
          </Link>

          <Link
            href="/admin/ace/certificates"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificates</h3>
            <p className="text-gray-600 text-sm">
              Issue certificates, verify completion, track 45-day compliance
            </p>
          </Link>

          <Link
            href="/admin/ace/complaints"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complaints</h3>
            <p className="text-gray-600 text-sm">
              Review complaints, track resolutions, manage BACB escalations
            </p>
          </Link>

          <Link
            href="/admin/ace/reports"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">
              Generate audit packets, export data, view analytics
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
