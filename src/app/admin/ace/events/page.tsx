"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Download, Edit, Trash2 } from 'lucide-react';
import type { AceEvent } from '@/lib/ace/types';

export default function AceEventsPage() {
  const [events, setEvents] = useState<AceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/ace/events');
      const data = await response.json();
      if (data.data) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/ace/events?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ethics': return 'bg-purple-100 text-purple-800';
      case 'supervision': return 'bg-blue-100 text-blue-800';
      case 'teaching': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mastermind & CE Events</h1>
            <p className="text-slate-600 mt-1">Manage your BCBA mastermind sessions and CE courses</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Upcoming</p>
                <p className="text-2xl font-bold text-slate-900">
                  {events.filter(e => new Date(e.start_date) > new Date()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total CEUs</p>
                <p className="text-2xl font-bold text-slate-900">
                  {events.reduce((sum, e) => sum + e.total_ceus, 0).toFixed(1)}
                </p>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Participants</p>
                <p className="text-2xl font-bold text-slate-900">
                  {events.reduce((sum, e) => sum + (e.current_participants || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Yet</h3>
            <p className="text-slate-600 mb-6">Create your first mastermind session or CE course to get started.</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {events.map(event => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.replace('_', ' ')}
                      </Badge>
                      {event.event_type && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {event.event_type.toUpperCase()}
                        </Badge>
                      )}
                      <Badge className={getCategoryColor(event.ce_category)}>
                        {event.ce_category}
                      </Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                    )}
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Date</p>
                        <p className="font-medium text-slate-900">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">CEUs</p>
                        <p className="font-medium text-slate-900">{event.total_ceus} CEUs</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Modality</p>
                        <p className="font-medium text-slate-900 capitalize">
                          {event.modality.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Participants</p>
                        <p className="font-medium text-slate-900">
                          {event.current_participants || 0}
                          {event.max_participants && ` / ${event.max_participants}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/admin/ace/events/${event.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchEvents();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Create Event Modal Component
function CreateEventModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_ceus: 0,
    ce_category: 'learning' as const,
    modality: 'zoom_live' as const,
    event_type: 'ce' as const,
    start_date: '',
    max_participants: 20,
    online_meeting_url: '',
    learning_objectives: [''],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // You'll need to get the provider_id - for now using a placeholder
      const response = await fetch('/api/admin/ace/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          provider_id: 'YOUR_PROVIDER_ID', // TODO: Get from auth/session
          status: 'draft',
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create New Event</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., School BCBA Mastermind - Week 1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Describe what this session will cover..."
            />
          </div>

          {/* CEUs and Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CEUs *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.total_ceus}
                onChange={e => setFormData({ ...formData, total_ceus: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category and Modality */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.ce_category}
                onChange={e => setFormData({ ...formData, ce_category: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="learning">General Learning</option>
                <option value="ethics">Ethics</option>
                <option value="supervision">Supervision</option>
                <option value="teaching">Teaching</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Modality
              </label>
              <select
                value={formData.modality}
                onChange={e => setFormData({ ...formData, modality: e.target.value as any })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="zoom_live">Live (Zoom)</option>
                <option value="in_person">In Person</option>
                <option value="asynchronous">Asynchronous</option>
              </select>
            </div>
          </div>

          {/* Zoom Link and Max Participants */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Zoom Link
              </label>
              <input
                type="url"
                value={formData.online_meeting_url}
                onChange={e => setFormData({ ...formData, online_meeting_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://zoom.us/j/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={e => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
