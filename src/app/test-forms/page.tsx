"use client";

import { useState } from "react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function TestFormsPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Netlify Forms Test</h1>
        
        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Test Email Signup Popup</h2>
            <button 
              onClick={() => setShowPopup(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Open Email Signup Popup
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Test Direct Form</h2>
            <form 
              method="POST" 
              data-netlify="true" 
              name="test-form"
              className="space-y-4 max-w-md"
              action="/__forms.html"
            >
              <input type="hidden" name="form-name" value="test-form" />
              <input type="hidden" name="page-source" value="test-forms" />
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Submit Test Form
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </div>

      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Test Email Signup"
        description="This is a test of the email signup popup component."
        pageSource="test-forms"
        buttonText="Test Submit"
        successMessage="Test successful! Form submitted."
      />
    </div>
  );
}
