"use client"

import { useState } from "react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function SubscribePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Join the Community</h1>
        <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
          Get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change.
        </p>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Subscribe Now
        </button>
      </div>

      <EmailSignupPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Subscribe to Our Newsletter"
        description="Enter your name and email to get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change."
        pageSource="/subscribe"
        showNameField={true}
      />
    </div>
  )
}