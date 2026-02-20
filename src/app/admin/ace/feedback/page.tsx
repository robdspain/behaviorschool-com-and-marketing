'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Eye,
  Loader2,
} from 'lucide-react';
import type { AceFeedbackResponse } from '@/lib/ace/types';

interface FeedbackWithEvent extends AceFeedbackResponse {
  event_title?: string;
  participant_name?: string;
  participant_email?: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'overdue'>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/admin/ace/feedback');
      const data = await response.json();
      if (data.data) {
        setFeedback(data.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilReviewDue = (fb: FeedbackWithEvent) => {
    if (!fb.coordinator_review_due_date) return null;
    const today = new Date();
    const dueDate = new Date(fb.coordinator_review_due_date);
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isOverdue = (fb: FeedbackWithEvent) => {
    const days = getDaysUntilReviewDue(fb);
    return days !== null && days < 0 && !fb.coordinator_reviewed_at;
  };

  const isPending = (fb: FeedbackWithEvent) => !fb.coordinator_reviewed_at;

  const filteredFeedback = feedback.filter(fb => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return isOverdue(fb);
    if (filter === 'pending') return isPending(fb) && !isOverdue(fb);
    if (filter === 'reviewed') return !!fb.coordinator_reviewed_at;
    return true;
  });

  const overdueCount = feedback.filter(isOverdue).length;
  const pendingCount = feedback.filter(fb => isPending(fb) && !isOverdue(fb)).length;
  const reviewedCount = feedback.filter(fb => !!fb.coordinator_reviewed_at).length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedback.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Feedback Management</h1>
              <p className="text-slate-600">Review participant feedback within 45 days</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Feedback</p>
                <p className="text-3xl font-bold text-slate-900">{feedback.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Avg. Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-amber-600">{avgRating}</p>
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${overdueCount > 0 ? 'bg-red-50 border-red-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800 font-semibold">Overdue Review</p>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Reviewed</p>
                <p className="text-3xl font-bold text-green-600">{reviewedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <Card className="p-6 mb-8 bg-red-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 text-lg mb-2">
                  ⚠️ Feedback Reviews Overdue
                </h3>
                <p className="text-red-800 mb-3">
                  <strong>{overdueCount} feedback submission(s)</strong> have exceeded the 45-day review deadline.
                  BACB requires coordinators to review all feedback within 45 days.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'overdue', 'pending', 'reviewed'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f && f === 'overdue' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'overdue' && overdueCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">{overdueCount}</span>
              )}
            </Button>
          ))}
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No feedback found</h3>
            <p className="text-slate-600">
              {filter === 'all' 
                ? 'No feedback has been submitted yet.' 
                : `No ${filter} feedback.`}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map(fb => {
              const daysUntilDue = getDaysUntilReviewDue(fb);
              const feedbackOverdue = isOverdue(fb);
              const isCritical = !feedbackOverdue && daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 7;

              return (
                <Card
                  key={fb.id}
                  className={`p-6 ${feedbackOverdue ? 'bg-red-50 border-red-200' : isCritical ? 'bg-amber-50 border-amber-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {fb.coordinator_reviewed_at ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Reviewed
                          </Badge>
                        ) : feedbackOverdue ? (
                          <Badge className="bg-red-600 text-white">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {Math.abs(daysUntilDue!)} days overdue
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {daysUntilDue} days to review
                          </Badge>
                        )}
                        {fb.rating && (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= fb.rating! ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {fb.event_title || 'Event Feedback'}
                      </h3>

                      {fb.comments && (
                        <p className="text-slate-600 mb-4 line-clamp-2">{fb.comments}</p>
                      )}

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Participant</p>
                          <p className="font-medium text-slate-900">{fb.participant_name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Submitted</p>
                          <p className="font-medium text-slate-900">
                            {new Date(fb.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Review Due</p>
                          <p className={`font-medium ${feedbackOverdue ? 'text-red-700' : isCritical ? 'text-amber-700' : 'text-slate-900'}`}>
                            {fb.coordinator_review_due_date 
                              ? new Date(fb.coordinator_review_due_date).toLocaleDateString()
                              : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Reviewed</p>
                          <p className="font-medium text-slate-900">
                            {fb.coordinator_reviewed_at 
                              ? new Date(fb.coordinator_reviewed_at).toLocaleDateString()
                              : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFeedback(fb)}
                      className="ml-4"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {fb.coordinator_reviewed_at ? 'View' : 'Review'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {selectedFeedback && (
          <FeedbackReviewModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            onSuccess={() => {
              setSelectedFeedback(null);
              fetchFeedback();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Feedback Review Modal
function FeedbackReviewModal({
  feedback,
  onClose,
  onSuccess,
}: {
  feedback: FeedbackWithEvent;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [notes, setNotes] = useState(feedback.coordinator_notes || '');
  const [actionTaken, setActionTaken] = useState(feedback.coordinator_action_taken || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/ace/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback_id: feedback.id,
          coordinator_notes: notes,
          coordinator_action_taken: actionTaken,
          coordinator_reviewed_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Review Feedback</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {/* Feedback Details */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">{feedback.event_title}</h3>
            {feedback.rating && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= feedback.rating! ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                  />
                ))}
                <span className="ml-2 text-slate-600">({feedback.rating}/5)</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Participant</p>
              <p className="font-medium text-slate-900">{feedback.participant_name}</p>
              <p className="text-sm text-slate-600">{feedback.participant_email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Submitted</p>
              <p className="font-medium text-slate-900">
                {new Date(feedback.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {feedback.comments && (
            <div>
              <p className="text-sm text-slate-500 mb-2">Comments</p>
              <p className="text-slate-900 whitespace-pre-wrap bg-white p-3 rounded border">
                {feedback.comments}
              </p>
            </div>
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Coordinator Notes *
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Document your review of this feedback..."
            />
            <p className="text-xs text-slate-500 mt-1">
              Record any observations, patterns, or concerns noted during review.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Action Taken (if any)
            </label>
            <textarea
              rows={3}
              value={actionTaken}
              onChange={e => setActionTaken(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Describe any actions taken based on this feedback..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Reviewed
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
