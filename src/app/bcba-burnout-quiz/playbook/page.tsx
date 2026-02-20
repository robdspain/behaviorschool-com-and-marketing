// src/app/bcba-burnout-quiz/playbook/page.tsx
'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

const PlaybookDownloadPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      setError('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, tags: ['lead-magnet', 'self-care-playbook'] }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setIsSubmitted(true);
      // Trigger download
      window.location.href = '/lead-magnets/bcba-self-care-playbook.pdf';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/lead-magnets/bcba-self-care-playbook-mockup.png"
                alt="BCBA Self-Care Playbook Mockup"
                width={1200}
                height={900}
                className="rounded-md"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Get Your Free Self-Care Playbook</h1>
              <p className="text-gray-600 mb-6">
                Enter your email below to get instant access to "The BCBA Self-Care Playbook," a practical guide to preventing burnout and building a sustainable career.
              </p>
              
              {isSubmitted ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                  <h3 className="font-bold">Success!</h3>
                  <p>Your download should begin shortly. Thank you!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                   <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Your Role</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select your role...</option>
                      <option value="BCBA">BCBA / BCBA-D</option>
                      <option value="BCaBA">BCaBA</option>
                      <option value="RBT">RBT / Behavior Technician</option>
                      <option value="Student">Student</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Download Now'}
                  </button>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookDownloadPage;
