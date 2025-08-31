"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Target, CheckCircle, Users, BookOpen } from "lucide-react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function ValuesGoalAssistantLandingPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              <span className="bg-gradient-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent">
                Values-Based Goal Assistant
              </span>
              <br />
              Write Goals That Truly Matter
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Unlock the power of Acceptance and Commitment Training (ACT) to craft meaningful, measurable, and values-aligned IEP and behavior goals for students in public schools.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              Join the Interest List
              <Mail className="ml-2 w-5 h-5" />
            </button>
            <Link 
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Helps You
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our assistant streamlines the goal-setting process, ensuring clarity, measurability, and alignment with student values.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-8 text-center shadow-md">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Values-Aligned Goals</h3>
              <p className="text-slate-600">Craft goals that resonate with the student&apos;s core values, fostering intrinsic motivation and engagement.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-8 text-center shadow-md">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Measurable & Actionable</h3>
              <p className="text-slate-600">Move beyond vague statements to create goals that are clear, trackable, and lead to tangible progress.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-8 text-center shadow-md">
              <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Simplified Process</h3>
              <p className="text-slate-600">Reduce the complexity of goal writing with intuitive prompts and structured guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our intuitive process guides you through crafting effective and values-driven goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Define Your Values</h3>
              <p className="text-slate-600">Start by identifying the core values that will guide your goal-setting.</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Craft Your Goals</h3>
              <p className="text-slate-600">Use our structured prompts to write clear, measurable, and actionable goals.</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Plan for Action</h3>
              <p className="text-slate-600">Break down your goals into practical steps and track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Write More Meaningful Goals?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our interest list to be the first to know when the Values-Based Goal Assistant is available!
          </p>
          <button 
            onClick={() => setIsSignupOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Sign Up for Updates
            <Mail className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join the Values-Based Goal Assistant Interest List"
        description="Be the first to know about updates, early access, and launch details for our new goal-writing tool."
        pageSource="/values-goal-assistant-landing"
        showNameField={true}
        buttonText="Sign Me Up!"
        successMessage="Thanks for your interest! We'll keep you updated on the Values-Based Goal Assistant."
      />
    </div>
  );
}
