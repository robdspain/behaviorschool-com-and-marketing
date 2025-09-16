"use client";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export default function IEPBehaviorGoalsPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // FAQ data for structured data
  const faqData = [
    {
      question: "What is the IEP Goal Writer Widget?",
      answer: "The IEP Goal Writer Widget is a specialized tool designed for special education professionals, behavior specialists, and IEP teams to quickly and efficiently generate compliant and measurable behavior goals."
    },
    {
      question: "How does the 6-Step Guided Wizard work?",
      answer: "The 6-Step Guided Wizard walks users through a structured process: Student & Behavior → Baseline → Context & Supports → Goal and Measurement → Advanced Options → Review & Generate, ensuring all critical components of an IEP goal are addressed."
    },
    {
      question: "What is the Quality Assessment Meter?",
      answer: "The Quality Assessment Meter provides a 5-level hierarchy system (1-5) with a visual progress indicator and descriptive labels, helping users understand and improve the quality of their generated IEP goals."
    },
    {
      question: "Is the IEP Goal Writer Widget secure and private?",
      answer: "Yes, the widget is 100% client-side, meaning no data is transmitted or stored externally. Everything stays within your browser, ensuring complete privacy and security. It also has no external dependencies and works offline."
    },
    {
      question: "Can I embed the IEP Goal Writer Widget on my website?",
      answer: "Yes, the widget is designed for iframe embedding and offers features like customizable branding via URL parameters, auto-resize functionality, and optional CTA integration for lead generation."
    }
  ];

  // Structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Article structured data for E-E-A-T and SEO
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IEP Goal Writer Widget: Complete Feature List",
    description: "Explore the comprehensive features of the IEP Goal Writer Widget, designed for special education professionals, behavior specialists, and IEP teams.",
    author: {
      "@type": "Organization",
      name: "Behavior School",
    },
    publisher: {
      "@type": "Organization",
      name: "Behavior School",
    },
    url: "https://behaviorschool.com/iep-behavior-goals",
    datePublished: "2025-09-16",
    dateModified: "2025-09-16"
  };

  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "Tools", href: "/products" },
            { label: "IEP Goal Writer Widget" }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              IEP Goal Writer Widget
            </span>
            <br />
            <span className="text-3xl md:text-4xl">Complete Feature List</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            This widget is specifically designed for special education professionals, behavior specialists, and IEP teams who need to create compliant, measurable behavior goals quickly and efficiently.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Core Functionality */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Core Functionality</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Behavior-Focused IEP Goal Generation</strong> - Specialized for creating measurable, observable behavior goals</li>
            <li><strong>6-Step Guided Wizard</strong> - Step-by-step process: Student & Behavior → Baseline → Context & Supports → Goal and Measurement → Advanced Options → Review & Generate</li>
            <li><strong>Live Preview</strong> - Real-time goal preview that updates as you type</li>
            <li><strong>Quality Assessment Meter</strong> - 5-level hierarchy system (1-5) with visual progress indicator and descriptive labels</li>
          </ul>
        </section>

        {/* Goal Types & Direction */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Goal Types & Direction</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Increase/Decrease Behavior Toggle</strong> - Segmented control for behavior direction</li>
            <li><strong>Automatic Measurement Rules</strong> - Smart defaults based on behavior type:
              <ul className="list-circle pl-6 text-slate-600 space-y-1 mt-1">
                <li>Decreasing behaviors: &quot;0 instances per day&quot; for &quot;5 consecutively measured school days&quot;</li>
                <li>Increasing behaviors: &quot;in 90% of opportunities&quot; for &quot;3 consecutively measured school days&quot;</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Student & Goal Information */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Student & Goal Information</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Student Name Input</strong> (optional)</li>
            <li><strong>Annual Goal Date Picker</strong> - mm/dd/yy format with date picker</li>
            <li><strong>Behavior Title & Definition</strong> - Measurable, observable behavior descriptions</li>
            <li><strong>Context & Supports</strong> - Specific settings and accommodations</li>
          </ul>
        </section>

        {/* Baseline Data Collection */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Baseline Data Collection</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Frequency/Rate Tracking</strong> - Multiple units (per day, week, period, hour, session)</li>
            <li><strong>Baseline Average</strong> - Percentage or frequency measurements</li>
            <li><strong>Consecutive Days Tracking</strong> - Baseline measurement period</li>
            <li><strong>Data Collection Methods</strong> - Teacher observation, behavior tracking sheets, etc.</li>
            <li><strong>Embed Baseline Option</strong> - Include baseline directly in goal sentence</li>
          </ul>
        </section>

        {/* Advanced Features (Optional) */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Advanced Features (Optional)</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Latency Settings</strong> - Time to initiate behavior (seconds)</li>
            <li><strong>Fluency Notes</strong> - Additional performance criteria</li>
            <li><strong>Generalization Settings</strong> - Multiple environment requirements (1-5+ settings)</li>
            <li><strong>Maintenance Expectations</strong> - Long-term behavior maintenance criteria</li>
          </ul>
        </section>

        {/* Short-Term Objectives (Optional) */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Short-Term Objectives (Optional)</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>1-5 Objectives</strong> - Configurable number of short-term goals</li>
            <li><strong>Evenly Spaced Due Dates</strong> - Automatically calculated progression dates</li>
            <li><strong>Progressive Criteria</strong> - Escalating difficulty levels:
              <ul className="list-circle pl-6 text-slate-600 space-y-1 mt-1">
                <li>Increase: 60% → 70% → 80% → 85% → 90% opportunities</li>
                <li>Decrease: ≤5/day → ≤3/day → ≤1/day → 0/day (3d) → 0/day (5d)</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Smart Examples & Suggestions */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Smart Examples & Suggestions</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Context Examples</strong> - Pre-populated classroom settings, locations</li>
            <li><strong>Supports Examples</strong> - Visual schedules, token boards, social narratives, etc.</li>
            <li><strong>Data Method Examples</strong> - Frequency recording, interval recording, ABC data, etc.</li>
            <li><strong>Clickable Example Chips</strong> - Quick-fill options for common scenarios</li>
          </ul>
        </section>

        {/* Quality Hierarchy System (1-5 Levels) */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Quality Hierarchy System (1-5 Levels)</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Level 1 - Basic Goal</strong> - Date, context, behavior, measurement (Low )</li>
            <li><strong>Level 2 - Baseline Data</strong> - Includes baseline information (Moderate )</li>
            <li><strong>Level 3 - Latency & Fluency</strong> - Response time and performance criteria (Improving )</li>
            <li><strong>Level 4 - Generalization</strong> - Multiple settings requirement (Strong )</li>
            <li><strong>Level 5 - Maintenance</strong> - Long-term behavior maintenance (Most Effective ✅)</li>
          </ul>
        </section>

        {/* Export & Output Options */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Export & Output Options</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Copy to Clipboard</strong> - One-click copying of generated goals</li>
            <li><strong>Download as .txt</strong> - Save goals as text file</li>
            <li><strong>Formatted Output</strong> - Professional goal formatting with proper structure</li>
          </ul>
        </section>

        {/* User Experience Features */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">User Experience Features</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Auto Preview Toggle</strong> - Enable/disable live preview updates</li>
            <li><strong>Advanced Options Toggle</strong> - Show/hide advanced features</li>
            <li><strong>Reset Function</strong> - Clear all fields and start over</li>
            <li><strong>Mobile Responsive</strong> - Works across all devices and browsers</li>
            <li><strong>Progress Indicators</strong> - Visual step progression in wizard</li>
          </ul>
        </section>

        {/* Privacy & Security */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Privacy & Security</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>100% Client-Side</strong> - No data transmission, everything stays in browser</li>
            <li><strong>No External Dependencies</strong> - Works offline, no network calls</li>
            <li><strong>Session-Only Storage</strong> - Data is temporary and browser-specific</li>
          </ul>
        </section>

        {/* Embedding Capabilities */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Embedding Capabilities</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Widget Mode</strong> - Designed for iframe embedding</li>
            <li><strong>Customizable Branding</strong> - URL parameters for colors, fonts, styling</li>
            <li><strong>Auto-Resize</strong> - Automatically adjusts height when embedded</li>
            <li><strong>CTA Integration</strong> - Optional call-to-action bar for lead generation</li>
          </ul>
        </section>

        {/* Technical Features */}
        <section className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Technical Features</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>No Build Process</strong> - Pure HTML/CSS/JavaScript</li>
            <li><strong>Cross-Browser Compatible</strong> - Works in all modern browsers</li>
            <li><strong>Accessibility Features</strong> - ARIA labels, keyboard navigation</li>
            <li><strong>Form Validation</strong> - Required field checking and error messages</li>
          </ul>
        </section>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions About the IEP Goal Writer Widget
            </h2>
            <p className="text-lg text-slate-600">
              Common questions about using the widget to write and implement behavior goals
            </p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Get Updates on the IEP Goal Writer Widget"
        description="Enter your email to be notified about updates and new features for the IEP Goal Writer Widget."
        pageSource="/iep-behavior-goals"
        showNameField={true}
        buttonText="Notify Me"
        successMessage="Thanks! We'll email you with updates on the widget."
      />
    </div>
  );
}
