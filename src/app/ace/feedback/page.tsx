'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Star, Search, Filter, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface FeedbackItem {
  _id: string;
  eventId: string;
  participantId: string;
  rating: number;
  instructorRating: number;
  contentRating: number;
  relevanceRating?: number;
  comments?: string;
  suggestions?: string;
  wouldRecommend?: boolean;
  submittedAt: number;
  participant?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  event?: {
    title: string;
  };
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending_review' | 'reviewed'>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    try {
      // In production, fetch with a provider_id filter
      const res = await fetch('/api/ace/feedback?all=true');
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredFeedback = feedback.filter((fb) => {
    const name = `${fb.participant?.firstName || ''} ${fb.participant?.lastName || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || fb.event?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedback.length).toFixed(1)
    : '0.0';

  const recommendRate = feedback.length > 0
    ? Math.round((feedback.filter((fb) => fb.wouldRecommend).length / feedback.length) * 100)
    : 0;

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating}/5.0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Would Recommend</p>
              <p className="text-2xl font-bold text-gray-900">{recommendRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by participant or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F]"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending_review', 'reviewed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterTab === tab
                    ? 'bg-[#1F4D3F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'pending_review' ? 'Pending Review' : 'Reviewed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredFeedback.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-500">Feedback from participants will appear here after events.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Participant</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Overall</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Instructor</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Recommend</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFeedback.map((fb) => (
                  <tr key={fb._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fb.participant?.firstName} {fb.participant?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{fb.participant?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 max-w-[200px] truncate">
                        {fb.event?.title || 'Unknown Event'}
                      </p>
                    </td>
                    <td className="px-6 py-4">{renderStars(fb.rating || 0)}</td>
                    <td className="px-6 py-4">{renderStars(fb.instructorRating || 0)}</td>
                    <td className="px-6 py-4">{renderStars(fb.contentRating || 0)}</td>
                    <td className="px-6 py-4">
                      {fb.wouldRecommend ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {fb.submittedAt ? new Date(fb.submittedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#1F4D3F] hover:text-[#1F4D3F]/80 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
