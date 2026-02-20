"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Check, Calendar, Users, Target, BookOpen } from "lucide-react";

export default function First90DaysPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !role) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add to email list
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, tags: ['lead-magnet', 'first-90-days', 'school-bcba'] }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setIsSubmitted(true);
      
      // Trigger download
      window.location.href = '/lead-magnets/school-bcba-first-90-days.pdf';
    } catch (err) {
      console.error('Submit error:', err);
      // Still allow download even if subscription fails
      setIsSubmitted(true);
      window.location.href = '/lead-magnets/school-bcba-first-90-days.pdf';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
      {/* Header */}
      <div className="bg-emerald-700 text-white py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/school-bcba" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to School BCBA Hub
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2" /> Free Guide
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              The School BCBA's First 90 Days
            </h1>
            
            <p className="text-xl text-slate-600 mb-6">
              A survival guide for new school-based behavior analysts. Move from surviving to thriving in your first three months.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Phase-by-Phase Roadmap</div>
                  <div className="text-slate-600 text-sm">30-60-90 day structure with clear missions and checklists</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Relationship-Building Scripts</div>
                  <div className="text-slate-600 text-sm">Email templates and conversation starters that work</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Pro Tips & Templates</div>
                  <div className="text-slate-600 text-sm">Real-world strategies from experienced school BCBAs</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-800 text-sm">
                <strong>The Prime Directive:</strong> "Seek first to understand, then to be understood." 
                Your relationships in the first 90 days matter more than any intervention.
              </p>
            </div>
          </div>

          {/* Right: Form or Success */}
          <div>
            {!isSubmitted ? (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Get Your Free Guide
                </h2>
                <p className="text-slate-600 mb-6">
                  Enter your email to download the complete PDF guide.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@school.edu"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                      required
                    >
                      <option value="">Select your role...</option>
                      <option value="bcba">BCBA</option>
                      <option value="bcba-d">BCBA-D</option>
                      <option value="bcaba">BCaBA</option>
                      <option value="rbt">RBT</option>
                      <option value="student">Graduate Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">School Administrator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        <Download className="w-5 h-5" /> Download Free Guide
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Download Started!
                </h2>
                <p className="text-slate-600 mb-6">
                  Your guide should be downloading now. If it doesn't start automatically:
                </p>
                <a
                  href="/lead-magnets/school-bcba-first-90-days.pdf"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  <Download className="w-5 h-5" /> Download Again
                </a>
                
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 mb-4">Want more school BCBA resources?</p>
                  <Link
                    href="/school-bcba"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Explore the School BCBA Hub →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
