'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ace/StatCard';
import {
  CalendarDays,
  Users,
  Award,
  ShieldCheck,
  Plus,
  ArrowRight,
  ClipboardCheck,
  Clock,
  Loader2,
} from 'lucide-react';

const MODALITY_LABELS: Record<string, string> = {
  in_person: 'In-Person',
  synchronous: 'Live Online',
  asynchronous: 'On-Demand',
};

interface DashboardEvent {
  _id: string;
  title: string;
  modality: string;
  startDate: number;
  totalCeus: number;
  currentParticipants?: number;
  status: string;
  eventType?: string;
}

export default function AceDashboardPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch('/api/ace/events');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setEvents(json.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const now = Date.now();
  const upcomingEvents = events
    .filter((e) => e.startDate > now)
    .sort((a, b) => a.startDate - b.startDate)
    .slice(0, 6);

  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.currentParticipants || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="rounded-xl p-6 sm:p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #1F4D3F 0%, #2d6b56 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome to ACE CEU Platform
            </h1>
            <p className="mt-2 text-white/80 max-w-xl">
              Manage your continuing education events, track registrations,
              issue certificates, and maintain BACB compliance all in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/ace/events/new">
              <Button
                className="font-semibold text-gray-900"
                style={{ backgroundColor: '#D4AF37' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Events"
          value={loading ? '...' : events.length}
          icon={CalendarDays}
        />
        <StatCard
          label="Active Registrations"
          value={loading ? '...' : totalRegistrations}
          icon={Users}
        />
        <StatCard
          label="Upcoming Events"
          value={loading ? '...' : upcomingEvents.length}
          icon={Award}
        />
        <StatCard
          label="Platform Status"
          value="Active"
          icon={ShieldCheck}
        />
      </div>

      {/* Quick Actions + Recent Events */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/ace/events/new" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarDays className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Create New Event</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>
            <Link href="/ace/registrations" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <Users className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Manage Registrations</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>
            <Link href="/ace/attendance" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <ClipboardCheck className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Record Attendance</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>
            <Link href="/ace/certificates" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <Award className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Issue Certificates</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>
            <Link href="/ace/providers" className="block">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <ShieldCheck className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Manage Providers</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Events</CardTitle>
            <Link href="/ace/events">
              <Button variant="ghost" size="sm" className="text-gray-500">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No events yet.</p>
                <Link href="/ace/events/new">
                  <Button size="sm" className="mt-3 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white">
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <Link
                    key={event._id}
                    href={`/ace/events/${event._id}`}
                    className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0 hover:bg-gray-50 rounded -mx-2 px-2 py-1 transition-colors"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'rgba(31, 77, 63, 0.1)' }}
                    >
                      <CalendarDays
                        className="h-4 w-4"
                        style={{ color: '#1F4D3F' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        &middot; {event.totalCeus} CEUs &middot;{' '}
                        {event.currentParticipants || 0} registered
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 capitalize">
                      {event.status.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <Link href="/ace/events">
            <Button variant="ghost" size="sm" className="text-gray-500">
              See All Events
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No upcoming events scheduled.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/ace/events/${event._id}`}
                  className="rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: '#D4AF37' }}
                    />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {MODALITY_LABELS[event.modality] || event.modality}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {event.currentParticipants || 0} registered
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: '#1F4D3F' }}
                    >
                      {event.totalCeus} CEUs
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
