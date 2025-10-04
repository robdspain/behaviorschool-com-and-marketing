"use client";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { useRouter } from "next/navigation";

export function IEPBehaviorGoalsClient() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('IEPBehaviorGoalsPage: useEffect triggered');
    // Check if user has already signed up (but DON'T auto-redirect)
    if (typeof window !== 'undefined') {
      const signedUp = localStorage.getItem('hasSignedUpForIEPWidget') === 'true';
      setHasSignedUp(signedUp);
      console.log('IEPBehaviorGoalsPage: hasSignedUp status:', signedUp);
    }
  }, [router]);

  const handleCTAClick = () => {
    console.log('IEPBehaviorGoalsPage: CTA clicked, hasSignedUp:', hasSignedUp);
    if (hasSignedUp) {
      // User has already signed up, go directly to widget
      console.log('IEPBehaviorGoalsPage: Redirecting to widget (already signed up)');
      router.push("/iep-behavior-goals/widget");
    } else {
      // Show signup popup
      console.log('IEPBehaviorGoalsPage: Opening signup popup');
      setIsSignupOpen(true);
    }
  };

  const handleSignupSuccess = () => {
    console.log('IEPBehaviorGoalsPage: handleSignupSuccess called');
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUpForIEPWidget', 'true');
      setHasSignedUp(true);
      console.log('IEPBehaviorGoalsPage: localStorage flag set');
    }
    setIsSignupOpen(false);
    console.log('IEPBehaviorGoalsPage: Redirecting to widget page...');
    // Use setTimeout to ensure the popup closes before redirecting
    setTimeout(() => {
      router.push("/iep-behavior-goals/widget");
    }, 100);
  };

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
    headline: "Free IEP Behavior Goals Generator: Complete Feature Guide",
    description: "Comprehensive guide to creating professional IEP behavior goals using our free specialized tool designed for special education professionals, behavior specialists, and IEP teams.",
    author: {
      "@type": "Organization",
      name: "Behavior School",
    },
    publisher: {
      "@type": "Organization",
      name: "Behavior School",
    },
    url: "https://behaviorschool.com/iep-behavior-goals",
    datePublished: "2024-09-16",
    dateModified: "2024-09-18"
  };

  // Breadcrumb structured data for SEO
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Products",
        "item": "https://behaviorschool.com/products"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "IEP Goal Writer",
        "item": "https://behaviorschool.com/iep-goals"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Free Behavior Goals Generator",
        "item": "https://behaviorschool.com/iep-behavior-goals"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-bs-background w-full max-w-full overflow-x-hidden">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {/* Breadcrumbs */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "Free Behavior Goals Generator" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-20 w-full">
        <div className="w-full max-w-md mx-auto px-4 sm:max-w-lg md:max-w-2xl lg:max-w-5xl">
          {/* Premium Card Layout */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Top CTA Bar */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-center py-4 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent"></div>
              <span className="relative font-semibold text-sm tracking-wide">✨ Free IEP Behavior Goals Generator — Create Behavior Goals in Under 5 Minutes</span>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full mb-6 uppercase tracking-wider border border-emerald-200">
                FREE SAMPLE FROM OUR <a href="/iep-goals" className="underline hover:text-emerald-800">IEP GOAL WRITER</a>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                Free IEP Behavior Goals Generator — Create Behavior Goals for IEP
              </h1>

              {/* Subheadline */}
              <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
                Generate <span className="text-emerald-600 font-semibold">free IEP behavior goals</span> in under 5 minutes. Our specialized <span className="text-emerald-600 font-semibold">behavior goal IEP</span> wizard transforms <span className="text-emerald-600 font-semibold">3-4 hour IEP sessions</span> into quick, compliant goal creation.
              </p>

              {/* Main CTA Button */}
              <button
                onClick={handleCTAClick}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full md:w-auto text-base group relative overflow-hidden mb-8"
              >
                <span className="relative z-10">Start Creating Goals Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <div className="mt-2">
                <a href="/iep-goal-qualitychecker" className="text-emerald-700 underline text-sm">
                  Already have a goal? Check quality →
                </a>
              </div>

              {/* Widget Preview Image */}
              <div className="mt-8">
                <div className="relative max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
                    <img
                      src="/images/iep-behavior-goals-widget-preview.png"
                      alt="IEP Behavior Goals Generator Widget Preview - Shows the step-by-step interface for creating behavior goals"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="px-8 pb-8 border-t border-slate-100">
              <div className="flex items-center justify-center space-x-8 pt-6">
                {/* Trust Indicator 1 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Client-Side</div>
                </div>

                {/* Trust Indicator 2 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">0</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Registration</div>
                </div>

                {/* Trust Indicator 3 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">5</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Minutes</div>
                </div>

                {/* Trust Indicator 4 */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">Free</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">To Use</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Key Benefits Bar */}
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-transparent to-blue-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">Legally Compliant Goals</span>
            </div>
            <div className="flex items-center justify-center space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">5-Step Guided Process</span>
            </div>
            <div className="flex items-center justify-center space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg">100% Private & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Related Professional Resources
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our comprehensive toolkit for behavior analysts and special education professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/bcba-study-tools"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                BCBA Study Tools
              </h3>
              <p className="text-slate-600 text-sm">
                Comprehensive BCBA exam preparation resources, practice tests, and study guides
              </p>
            </a>

            <a
              href="/iep-goals"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                IEP Goal Writer
              </h3>
              <p className="text-slate-600 text-sm">
                Complete IEP goal generator for all domains - academic, behavioral, social, and more
              </p>
            </a>

            <a
              href="/behavior-plans"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                Behavior Plans
              </h3>
              <p className="text-slate-600 text-sm">
                Professional behavior intervention planning tools and templates
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-blue-600/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Generate Your IEP Behavior Goals?
          </h2>
          <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto leading-relaxed">
            Start creating compliant, measurable behavior goals in under 5 minutes with our specialized tool.
          </p>
          <p className="text-lg text-emerald-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            This free behavior goals generator is just a sample of our comprehensive <a href="/iep-goals" className="text-white hover:text-emerald-100 underline font-semibold">IEP Goal Writer</a> that creates goals for all areas, not just behavior.
          </p>
          <button
            onClick={handleCTAClick}
            className="bg-white hover:bg-slate-50 text-emerald-600 font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 text-lg group relative overflow-hidden"
          >
            <span className="relative z-10">Get Started Now - It&apos;s Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <p className="text-emerald-100/80 text-sm mt-4">Start immediately • 100% free</p>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Generate Your Behavior Goals"
        description="Enter your email to access the IEP Behavior Goal Generator and start creating compliant, measurable goals instantly."
        pageSource="/iep-behavior-goals"
        showNameField={true}
        buttonText="Access Generator"
        successMessage="Thanks! Redirecting you to the IEP Behavior Goal Generator..."
        onSuccess={handleSignupSuccess}
      />
    </div>
  );
}
