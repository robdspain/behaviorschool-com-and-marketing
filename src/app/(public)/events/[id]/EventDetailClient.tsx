'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Award, MapPin, Video, BookOpen, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AceEvent, AceProvider } from '@/lib/ace/types';

interface EventDetailClientProps {
  event: AceEvent & { provider: AceProvider };
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bacbId: '',
    credentialType: 'bcba',
  });

  const isFree = !event.fee || event.fee === 0;
  const isFull = event.max_participants && (event.current_participants || 0) >= event.max_participants;
  const isPast = new Date(event.start_date) < new Date();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ethics': return 'bg-purple-100 text-purple-800';
      case 'supervision': return 'bg-blue-100 text-blue-800';
      case 'teaching': return 'bg-amber-100 text-amber-800';
      default: return 'bg-emerald-100 text-emerald-800';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'in_person': return <MapPin className="w-5 h-5" />;
      case 'synchronous': return <Video className="w-5 h-5" />;
      case 'asynchronous': return <BookOpen className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case 'in_person': return 'In Person';
      case 'synchronous': return 'Live Online (Zoom)';
      case 'asynchronous': return 'On-Demand / Self-Paced';
      default: return modality;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      const response = await fetch('/api/ace/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setConfirmationCode(data.confirmation_code);
      setRegistrationComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Link */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(event.ce_category)}>
                    {event.ce_category.charAt(0).toUpperCase() + event.ce_category.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="border-white/50 text-white">
                    {event.event_type === 'ce' ? 'BCBA/BCaBA CE' : 'RBT PD'}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center gap-2 text-emerald-100">
                  {getModalityIcon(event.modality)}
                  <span>{getModalityLabel(event.modality)}</span>
                </div>
              </div>

              <div className="p-8">
                {event.description && (
                  <div className="prose prose-slate max-w-none mb-8">
                    <p className="text-lg text-slate-600">{event.description}</p>
                  </div>
                )}

                {/* Learning Objectives */}
                {event.learning_objectives && event.learning_objectives.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                      Learning Objectives
                    </h2>
                    <ul className="space-y-3">
                      {event.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructor Info */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Instructor</h3>
                  <p className="text-slate-700">Rob Spain, M.S., BCBA, IBA</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Board Certified Behavior Analyst
                  </p>
                  {event.instructor_affiliations && (
                    <p className="text-sm text-slate-500 mt-2">
                      {event.instructor_affiliations}
                    </p>
                  )}
                </div>

                {/* Disclosures */}
                {event.conflicts_of_interest && (
                  <div className="mt-6 text-sm text-slate-500">
                    <strong>Disclosure:</strong> {event.conflicts_of_interest}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-4">
              <div className="p-6">
                {registrationComplete ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Registration Complete!
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Your confirmation code is:
                    </p>
                    <div className="bg-slate-100 rounded-lg px-4 py-3 font-mono text-lg font-semibold text-slate-900">
                      {confirmationCode}
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                      Check your email for event details and instructions.
                    </p>
                  </div>
                ) : showRegistration ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Register for Event
                    </h3>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Credential Type *
                      </label>
                      <select
                        required
                        value={formData.credentialType}
                        onChange={e => setFormData({ ...formData, credentialType: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="bcba">BCBA</option>
                        <option value="bcaba">BCaBA</option>
                        <option value="rbt">RBT</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        BACB Certification # (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.bacbId}
                        onChange={e => setFormData({ ...formData, bacbId: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., 1-12-34567"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Required for certificate generation
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRegistration(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={registering}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {registering ? 'Registering...' : isFree ? 'Register Free' : 'Continue to Payment'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Price */}
                    <div className="text-center mb-6">
                      {isFree ? (
                        <span className="text-4xl font-bold text-emerald-600">FREE</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-slate-900">
                            ${event.fee}
                          </span>
                          <span className="text-slate-500 ml-2">per person</span>
                        </>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {new Date(event.start_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          {event.modality !== 'asynchronous' && (
                            <p className="text-sm text-slate-500">
                              {new Date(event.start_date).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                timeZoneName: 'short',
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {event.total_ceus} CEUs
                          </p>
                          <p className="text-sm text-slate-500">
                            {event.ce_category.charAt(0).toUpperCase() + event.ce_category.slice(1)} Category
                          </p>
                        </div>
                      </div>

                      {event.max_participants && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {event.max_participants - (event.current_participants || 0)} spots left
                            </p>
                            <p className="text-sm text-slate-500">
                              {event.current_participants || 0} registered
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {isPast ? (
                      <Button disabled className="w-full">
                        Event Has Ended
                      </Button>
                    ) : isFull ? (
                      <Button disabled className="w-full">
                        Event is Full
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowRegistration(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        size="lg"
                      >
                        {isFree ? 'Register for Free' : 'Register Now'}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Provider Info */}
              {event.provider && (
                <div className="border-t px-6 py-4 text-center">
                  <p className="text-xs text-slate-500">
                    Approved ACE Provider
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {event.provider.provider_name}
                  </p>
                  {event.provider.bacb_provider_number && (
                    <p className="text-xs text-slate-500">
                      Provider #{event.provider.bacb_provider_number}
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* What's Included */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  BACB-approved CE certificate
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Access to session recording
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Downloadable materials
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Q&A with instructor
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
