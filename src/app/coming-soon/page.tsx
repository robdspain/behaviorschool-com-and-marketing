"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles, Rocket, Users, BookOpen, Target, Mail, ArrowRight } from "lucide-react";
import Footer from "@/components/ui/Footer";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
              Transform Your School's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 mt-2">
                Behavior Support System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
              Join the waitlist for the most comprehensive platform designed specifically for school-based BCBAs and behavior teams. 
              Be the first to access tools that actually work in real classrooms.
            </p>

            {/* Signup Form */}
            <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Get Early Access
                      </Label>
                      <p className="text-sm text-slate-500 mt-1">
                        Be among the first to experience Behavior School when we launch.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                        disabled={isSubmitting}
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                      >
                        {isSubmitting ? (
                          "Joining..."
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <p className="text-xs text-slate-500 text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      You're on the list!
                    </h3>
                    <p className="text-slate-600">
                      We'll notify you as soon as Behavior School is ready for you.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Early bird benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Exclusive updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What's Coming
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to build and maintain effective behavior support systems in your school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Smart FBA Tools
                </h3>
                <p className="text-slate-600">
                  Streamlined functional behavior assessments designed for the pace and constraints of school settings.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Intervention Library
                </h3>
                <p className="text-slate-600">
                  Evidence-based interventions with step-by-step implementation guides and fidelity checklists.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Team Collaboration
                </h3>
                <p className="text-slate-600">
                  Built-in tools for supervising RBTs, training paraprofessionals, and coordinating with teachers.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Quick Start Templates
                </h3>
                <p className="text-slate-600">
                  Ready-to-use behavior plans, data sheets, and reports that save hours of prep time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Parent Communication
                </h3>
                <p className="text-slate-600">
                  Simplified progress reports and home-school collaboration tools that keep everyone aligned.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Professional Development
                </h3>
                <p className="text-slate-600">
                  CEU-eligible courses and workshops tailored to school-based practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Launch Timeline
            </h2>
            <p className="text-xl text-slate-600">
              Here's what we're working on and when to expect it.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Q1 2025: Beta Launch
                </h3>
                <p className="text-slate-600">
                  Early access for founding members with core FBA and intervention planning tools.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Q2 2025: Full Platform Release
                </h3>
                <p className="text-slate-600">
                  Complete suite of tools including data collection, team collaboration, and reporting features.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Q3 2025: Community & Training Hub
                </h3>
                <p className="text-slate-600">
                  Launch of professional network, CEU courses, and live workshop series.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Don't Miss the Launch
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join thousands of behavior analysts who are ready to transform how behavior support works in schools.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-6 text-lg"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Sign Up for Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}