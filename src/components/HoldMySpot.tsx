'use client';
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function HoldMySpot() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', district: '', approval_date: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/api/hold-my-spot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="bg-white rounded-xl border-2 p-8 text-center" style={{borderColor:'#1f4d3f'}}>
        <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{color:'#1f4d3f'}} />
        <h3 className="text-xl font-bold mb-2">Your spot is held.</h3>
        <p className="text-gray-600">Rob will reach out within 24 hours to confirm and answer any questions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 p-8" style={{borderColor:'#e4b63d'}}>
      <div className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wide mb-4" style={{backgroundColor:'#e4b63d', color:'#1a1a1a'}}>
        Getting district approval?
      </div>
      <h3 className="text-xl font-bold mb-2">Hold My Spot</h3>
      <p className="text-gray-600 text-sm mb-6">Lock in early bird pricing while you get district approval. No payment now — Rob will hold your seat for up to 2 weeks.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Name</label>
            <input required type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{'--tw-ring-color':'#1f4d3f'} as React.CSSProperties} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Phone Number</label>
            <input required type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="(555) 000-0000" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email Address</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">School District</label>
          <input required type="text" value={form.district} onChange={e => setForm(f => ({...f, district: e.target.value}))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Fresno Unified School District" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Expected Approval Date</label>
          <input type="date" value={form.approval_date} onChange={e => setForm(f => ({...f, approval_date: e.target.value}))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        </div>
        <button type="submit" disabled={status === 'sending'}
          className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{backgroundColor:'#1f4d3f'}}>
          {status === 'sending' ? 'Submitting...' : 'Hold My Spot — No Payment Now'}
        </button>
      </form>
    </div>
  );
}
