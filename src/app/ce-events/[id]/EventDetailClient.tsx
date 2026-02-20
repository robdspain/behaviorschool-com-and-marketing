'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  FileText,
  User,
  Mail,
  CreditCard,
  Loader2,
} from 'lucide-react';
import type { AceEvent, AceEventCategory } from '@/lib/ace/types';

interface EventWithProvider extends AceEvent {
  provider?: {
    provider_name: string;
    bacb_provider_number?: string;
    primary_email?: string;
  };
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  bacbId: string;
  credential: 'bcba' | 'bcaba' | 'rbt' | 'other';
}

export default function EventDetailClient({ event }: { event: EventWithProvider }) {
  const router = useRouter();
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    bacbId: '',
    credential: 'bcba',
  });

  const isUpcoming = new Date(event.start_date) > new Date();
  const isFull = event.max_participants && (event.current_participants || 0) >= event.max_participants;
  const isPdEvent = event.event_type === 'pd';

  const getCategoryColor = (category: AceEventCategory) => {
    switch (category) {
      case 'ethics': return 'bg-purple-100 text-purple-800';
      case 'supervision': return 'bg-blue-100 text-blue-800';
      case 'teaching': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setRegistrationError(null);
  };

  const validateRegistration = (): string | null => {
    // PD events are for RBTs only
    if (isPdEvent && formData.credential !== 'rbt') {
      return 'This PD event is for RBTs only. BCBAs and BCaBAs should register for CE events.';
    }
    // CE events are for BCBAs/BCaBAs only
    if (!isPdEvent && formData.credential === 'rbt') {
      return 'This CE event is for BCBAs and BCaBAs only. RBTs should register for PD events.';
    }
    return null;
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateRegistration();
    if (validationError) {
      setRegistrationError(validationError);
      return;
    }

    setIsSubmitting(true);
    setRegistrationError(null);

    try {
      const response = await fetch('/api/ace/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setRegistrationSuccess(true);
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Registration Confirmed!</h1>
            <p className="text-slate-600 mb-6">
              You're registered for <strong>{event.title}</strong>. A confirmation email has been sent to {formData.email}.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg text-left mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Event Details</h3>
              <p className="text-sm text-slate-600">
                <strong>Date:</strong> {new Date(event.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Time:</strong> {new Date(event.start_date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-slate-600">
                <strong>CEUs:</strong> {event.total_ceus} {isPdEvent ? 'PDUs' : 'CEUs'}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/ce-events">
                <Button variant="outline">Browse More Events</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Back Link */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link href="/ce-events" className="inline-flex items-center text-slate-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Events
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={isPdEvent ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}>
                  {isPdEvent ? 'PD Event' : 'CE Event'} • {event.total_ceus} {isPdEvent ? 'PDUs' : 'CEUs'}
                </Badge>
                <Badge className={getCategoryColor(event.ce_category)}>
                  {event.ce_category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {event.modality.replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">{event.title}</h1>
              {event.provider && (
                <p className="text-slate-600">
                  Presented by <strong>{event.provider.provider_name}</strong>
                  {event.provider.bacb_provider_number && (
                    <span className="text-slate-500"> (Provider #{event.provider.bacb_provider_number})</span>
                  )}
                </p>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">About This Event</h2>
                <p className="text-slate-600 whitespace-pre-wrap">{event.description}</p>
              </Card>
            )}

            {/* Learning Objectives */}
            {event.learning_objectives && event.learning_objectives.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Learning Objectives</h2>
                <ul className="space-y-2">
                  {event.learning_objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Disclosures */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Required Disclosures
              </h2>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>Credential Eligibility:</strong> This {isPdEvent ? 'PD' : 'CE'} event is approved for {' '}
                  {isPdEvent ? 'RBTs' : 'BCBAs and BCaBAs'} only.
                </p>
                <p>
                  <strong>Assessment:</strong> Participants must complete a post-event assessment with a minimum 80% passing score to earn {isPdEvent ? 'PDUs' : 'CEUs'}.
                </p>
                <p>
                  <strong>Certificate:</strong> Certificates will be issued within 45 days of successful completion.
                </p>
                {event.instructor_disclosures && (
                  <p>
                    <strong>Instructor Disclosures:</strong> {event.instructor_disclosures}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Event Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-medium">
                      {new Date(event.start_date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {event.end_date && (
                        <> - {new Date(event.end_date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {event.modality === 'in_person' ? (
                      <MapPin className="w-5 h-5 text-slate-600" />
                    ) : (
                      <Video className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Format</p>
                    <p className="font-medium capitalize">{event.modality.replace('_', ' ')}</p>
                    {event.location && <p className="text-sm text-slate-500">{event.location}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Award className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{isPdEvent ? 'PDUs' : 'CEUs'} Offered</p>
                    <p className="font-medium">{event.total_ceus} {isPdEvent ? 'PDUs' : 'CEUs'}</p>
                    {event.ethics_ceus && event.ethics_ceus > 0 && (
                      <p className="text-sm text-purple-600">{event.ethics_ceus} Ethics</p>
                    )}
                  </div>
                </div>

                {event.max_participants && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Users className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Enrollment</p>
                      <p className="font-medium">
                        {event.current_participants || 0} / {event.max_participants}
                        {isFull && <span className="text-red-600 ml-2">(Full)</span>}
                      </p>
                    </div>
                  </div>
                )}

                {event.fee && event.fee > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Registration Fee</p>
                      <p className="font-medium">${event.fee}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button or Form */}
              {!showRegistration ? (
                <>
                  {isUpcoming && !isFull ? (
                    <Button 
                      onClick={() => setShowRegistration(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      Register Now
                    </Button>
                  ) : isFull ? (
                    <Button disabled className="w-full" size="lg">
                      Event Full
                    </Button>
                  ) : (
                    <Button disabled className="w-full" size="lg">
                      Registration Closed
                    </Button>
                  )}
                </>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Register</h3>
                  
                  {registrationError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{registrationError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">BACB ID</label>
                    <input
                      type="text"
                      name="bacbId"
                      value={formData.bacbId}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 1-23-45678"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credential</label>
                    <select
                      name="credential"
                      value={formData.credential}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                    >
                      <option value="bcba">BCBA</option>
                      <option value="bcaba">BCaBA</option>
                      <option value="rbt">RBT</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      {isPdEvent 
                        ? '⚠️ This PD event is for RBTs only'
                        : '⚠️ This CE event is for BCBAs/BCaBAs only'}
                    </p>
                  </div>

                  <div className="flex gap-2">
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
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
