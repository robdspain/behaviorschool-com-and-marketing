"use client"

import { useState } from "react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { Mail } from "lucide-react";

export default function SubscribePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-400 bg-clip-text text-transparent mb-4">
            Stay Connected
          </h1>
          <p className="text-xl text-slate-700 mb-2 max-w-3xl mx-auto">
            Be the first to know about new courses, products, and expert insights
          </p>
          <p className="text-lg text-slate-600 mb-8">
            Join our community of behavior change professionals
          </p>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-700 to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Subscribe for updates
          </button>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What you&apos;ll receive:</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Course Notifications</div>
                  <div className="text-sm text-slate-600">First to know about new course launches</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Product Updates</div>
                  <div className="text-sm text-slate-600">Latest features and improvements</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Expert Insights</div>
                  <div className="text-sm text-slate-600">Actionable behavior management strategies</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Early Access</div>
                  <div className="text-sm text-slate-600">Special opportunities and previews</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              No spam, ever. Unsubscribe anytime. We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>

      <EmailSignupPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Subscribe for updates"
        description="Be the first to know about new courses, product updates, and expert insights in behavior management."
        pageSource="/subscribe"
        showNameField={true}
        buttonText="Subscribe Now"
        successMessage="Welcome aboard! You'll be the first to know about our latest updates."
      />
    </div>
  )
}