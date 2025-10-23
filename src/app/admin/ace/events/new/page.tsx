'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AceEventFormData,
  AceEventCategory,
  AceEventModality,
  AceVerificationMethod,
} from '@/lib/ace/types';

export default function NewAceEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<AceEventFormData>>({
    category: 'learning',
    modality: 'asynchronous',
    verification_method: 'quiz_completion',
    passing_score_percentage: 80,
    fee: 0,
    learning_objectives: [''],
    instructor_ids: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ace/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/admin/ace/events/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addLearningObjective = () => {
    setFormData({
      ...formData,
      learning_objectives: [...(formData.learning_objectives || []), ''],
    });
  };

  const updateLearningObjective = (index: number, value: string) => {
    const objectives = [...(formData.learning_objectives || [])];
    objectives[index] = value;
    setFormData({ ...formData, learning_objectives: objectives });
  };

  const removeLearningObjective = (index: number) => {
    const objectives = [...(formData.learning_objectives || [])];
    objectives.splice(index, 1);
    setFormData({ ...formData, learning_objectives: objectives });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">Set up a new CE event for participants</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as AceEventCategory })
                    }
                  >
                    <option value="learning">Learning</option>
                    <option value="ethics">Ethics</option>
                    <option value="supervision">Supervision</option>
                    <option value="teaching">Teaching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modality *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.modality}
                    onChange={(e) =>
                      setFormData({ ...formData, modality: e.target.value as AceEventModality })
                    }
                  >
                    <option value="in_person">In Person</option>
                    <option value="synchronous">Synchronous (Live Online)</option>
                    <option value="asynchronous">Asynchronous (Self-Paced)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.duration_minutes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
                  }
                />
                <p className="mt-1 text-sm text-gray-500">
                  CEUs: {formData.duration_minutes ? (formData.duration_minutes / 50).toFixed(2) : '0.00'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone *</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.timezone || ''}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <option value="">Select timezone</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
            <div className="space-y-3">
              {formData.learning_objectives?.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`Learning objective ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={objective}
                    onChange={(e) => updateLearningObjective(index, e.target.value)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeLearningObjective(index)}
                      className="px-4 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLearningObjective}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Learning Objective
              </button>
            </div>
          </div>

          {/* Verification & Fee */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification & Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Method *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.verification_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verification_method: e.target.value as AceVerificationMethod,
                    })
                  }
                >
                  <option value="quiz_completion">Quiz Completion</option>
                  <option value="attendance_log">Attendance Log</option>
                  <option value="verification_code">Verification Code</option>
                  <option value="time_on_task">Time on Task</option>
                  <option value="check_in_prompts">Check-in Prompts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.passing_score_percentage || 80}
                  onChange={(e) =>
                    setFormData({ ...formData, passing_score_percentage: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fee ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fee || 0}
                  onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.max_participants || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, max_participants: parseInt(e.target.value) || undefined })
                  }
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
