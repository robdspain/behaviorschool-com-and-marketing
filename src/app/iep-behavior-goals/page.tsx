"use client";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { useRouter } from "next/navigation";


export default function IEPBehaviorGoalsPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('IEPBehaviorGoalsPage: useEffect triggered');
    if (typeof window !== 'undefined' && localStorage.getItem('hasSignedUpForIEPWidget')) {
      console.log('IEPBehaviorGoalsPage: localStorage flag found, redirecting...');
      router.replace('/iep-behavior-goals/widget');
    }
  }, [router]);

  const handleSignupSuccess = () => {
    console.log('IEPBehaviorGoalsPage: handleSignupSuccess called');
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUpForIEPWidget', 'true');
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
        "name": "Free Behavior Goals Sample",
        "item": "https://behaviorschool.com/iep-behavior-goals"
      }
    ]
  };

  

  

  return (
    <div className="min-h-screen bg-white">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "Free Behavior Goals Sample" }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-12 pb-20">
        <div className="max-w-md mx-auto px-4 sm:max-w-lg md:max-w-2xl lg:max-w-5xl">
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
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full md:w-auto text-base group relative overflow-hidden"
              >
                <span className="relative z-10">Start Creating Goals Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
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

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Problem Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Why Do IEP Behavior Goals Take 3-4 Hours to Write?
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 mb-12">
            The struggle is real for every <strong>IEP behavior goal</strong> writer—and it&apos;s stealing your time from what matters most: helping students.
          </p>

          {/* Symptoms List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-slate-900">Wrestling with measurement criteria – </span>
                <span className="text-slate-700">Should it be 90% accuracy for 3 days or 0 instances for 5 days? Generic IEP tools don&apos;t know behavior-specific standards, leaving you guessing.</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-slate-900">Fear of compliance failures – </span>
                <span className="text-slate-700">One missing component or unclear measurement can trigger a revision cycle, delaying IEP meetings and frustrating families.</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-slate-900">Starting from scratch every time – </span>
                <span className="text-slate-700">No templates, no smart defaults, no guidance. Each goal feels like reinventing the wheel, even for experienced professionals.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              {/* Main Headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
                Finally, A Free IEP Behavior Goals Generator That Actually Works
              </h2>

              {/* Lead-in Statement */}
              <p className="text-lg md:text-xl text-slate-600 mb-6">
                We understand exactly <strong>how overwhelming writing IEP behavior goals can be</strong>.
              </p>

              {/* Understanding Pain Paragraph */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                <strong>You&apos;re not alone in feeling frustrated by the time-consuming process of writing compliant behavior goals.</strong> Every special education professional faces the same challenge: balancing the need for legally sound, measurable goals with the reality of limited time and resources.
              </p>

              {/* Additional Context */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                That&apos;s why we created our comprehensive <a href="/iep-goals" className="text-emerald-600 hover:text-emerald-700 underline font-semibold">IEP Goal Writer</a> that eliminates the guesswork and dramatically reduces the time needed to create high-quality IEP behavior goals. This free behavior goals generator is a sample of what our full tool can do.
              </p>

              {/* Qualification Statement */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                <strong>As behavior specialists and special education advocates, we understand the challenges of IEP goal writing.</strong> Our IEP Goal Writer Widget incorporates years of experience in special education, behavior analysis, and educational technology to deliver a solution that actually works in real classrooms.
              </p>

              {/* Closing Statement */}
              <p className="text-slate-700 leading-relaxed">
                <strong>Now you can create professional, compliant behavior goals in minutes instead of hours—so you can focus on what really matters: helping your students succeed.</strong>
              </p>
            </div>

            {/* Right Column - Illustration */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <img
                  src="/IEP-Behavior-Goal/person-with-arms-outstreached.webp"
                  alt="Happy person with arms outstretched"
                  className="rounded-2xl shadow-lg border border-slate-200 w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduce the Benefits Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-16">
            Transform Your IEP Behavior Goal Writing Process
          </h2>

          {/* Three Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {/* Benefit One */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Save 3-4 Hours Per IEP
              </h3>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">
                Our <strong>5-step behavior wizard</strong> reduces goal writing from 3-4 hours to under 5 minutes. That&apos;s 80%+ time savings you can spend on actual teaching.
              </p>
            </div>

            {/* Benefit Two */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Zero Compliance Failures
              </h3>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">
                Built-in <strong>behavior-specific validation rules</strong> prevent common mistakes. Every goal includes proper measurement criteria and meets IDEA standards.
              </p>
            </div>

            {/* Benefit Three */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Protect Student Privacy
              </h3>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">
                <strong>100% client-side processing</strong> means student data never leaves your browser—complete privacy and FERPA compliance guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Free IEP Behavior Goals Generator — Designed Specifically for Behavior Goals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Unlike generic IEP software, our <a href="/iep-goals" className="text-emerald-600 hover:text-emerald-700 underline font-semibold">full IEP Goal Writer</a> understands the unique requirements of behavior-focused goals and automates the complex decisions. This free sample focuses specifically on behavior goals.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Feature Description */}
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Smart Measurement Defaults
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically applies evidence-based measurement criteria: 90% accuracy for 3 days when increasing behaviors, 0 instances for 5 days when decreasing behaviors.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Feature Description */}
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                5-Step Guided Process
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Walk through Student & Behavior → Baseline → Context & Supports → Measurements → Review. Each step builds toward a complete, compliant goal.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-300">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              {/* Feature Description */}
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Complete Privacy Protection
              </h3>
              <p className="text-slate-600 leading-relaxed">
                100% client-side processing means student data never leaves your browser. No servers, no cloud storage, no registration required. FERPA compliant by design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-16">
            Generate Free IEP Behavior Goals in 3 Simple Steps
          </h2>

          {/* Three Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              {/* Illustration */}
              <div className="mb-8">
                <img
                  src="/IEP-Behavior-Goal/person-using-a-device.webp"
                  alt="Person using device"
                  className="rounded-2xl shadow-md border border-slate-200 w-full h-48 object-cover"
                />
              </div>

              {/* Step Title */}
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                Step 1: Enter Student Information
              </h3>

              {/* Step Description */}
              <p className="text-slate-600 leading-relaxed">
                Start with basic student details and the target behavior you want to address. Our system guides you through the essential information needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              {/* Illustration */}
              <div className="mb-8">
                <img
                  src="/IEP-Behavior-Goal/team-colloboration.webp"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-md border border-slate-200 w-full h-48 object-cover"
                />
              </div>

              {/* Step Title */}
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                Step 2: Follow the Guided Process
              </h3>

              {/* Step Description */}
              <p className="text-slate-600 leading-relaxed">
                Work through our 6-step wizard that covers baseline data, context, measurement criteria, and quality assessment to ensure compliance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              {/* Illustration */}
              <div className="mb-8">
                <img
                  src="/IEP-Behavior-Goal/celabration-and-success.webp"
                  alt="Celebration & success"
                  className="rounded-2xl shadow-md border border-slate-200 w-full h-48 object-cover"
                />
              </div>

              {/* Step Title */}
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                Step 3: Generate & Export Your Goal
              </h3>

              {/* Step Description */}
              <p className="text-slate-600 leading-relaxed">
                Get a professionally formatted, legally compliant behavior goal that&apos;s ready to copy into your IEP. No more revisions needed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Compare Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-16">
            How Our Free IEP Behavior Goals Generator Compares
          </h2>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Headers */}
            <div className="bg-slate-900 text-white grid grid-cols-3 p-6">
              <div></div>
              <div className="text-center font-semibold text-lg">
                When You Work With Us
              </div>
              <div className="text-center font-semibold text-lg">
                Traditional Providers
              </div>
            </div>

            {/* Decision Criteria Rows */}
            {/* Row 1 */}
            <div className="grid grid-cols-3 p-6 border-b border-slate-200">
              <div>
                <div className="font-bold text-slate-900 mb-2">Time to Create Goals</div>
                <div className="text-slate-600">Under 5 minutes with behavior wizard</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-slate-600">3-4 hours of manual writing</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 p-6 bg-slate-50 border-b border-slate-200">
              <div>
                <div className="font-bold text-slate-900 mb-2">Compliance Assurance</div>
                <div className="text-slate-600">Behavior-specific validation rules</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-slate-600">Hope and guesswork</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 p-6 border-b border-slate-200">
              <div>
                <div className="font-bold text-slate-900 mb-2">Student Data Privacy</div>
                <div className="text-slate-600">100% client-side processing</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-slate-600">Cloud storage risks</span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-3 p-6 bg-slate-50">
              <div>
                <div className="font-bold text-slate-900 mb-2">Consistency Across Team</div>
                <div className="text-slate-600">Standardized format & quality</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-slate-600">Varied quality & formats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduce the Features Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16">
            Everything You Need to Create Free IEP Behavior Goals
          </h2>

          {/* Features Grid - 3 columns, 2 rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Row 1 - Features 1-3 */}
            {/* Feature One */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Behavior-Specific Smart Defaults</h3>
                <p className="text-slate-300 leading-relaxed">
                  Automatic measurement rules: 90% accuracy/3 days for increasing behaviors, 0 instances/5 days for decreasing behaviors.
                </p>
              </div>
            </div>

            {/* Feature Two */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">4-Level Quality Meter</h3>
                <p className="text-slate-300 leading-relaxed">
                  Visual progress indicator from Basic Goal to Ready to Generate ensures professional output every time.
                </p>
              </div>
            </div>

            {/* Feature Three */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Live Preview & Auto-Generation</h3>
                <p className="text-slate-300 leading-relaxed">
                  Watch your goal build in real-time as you type. Professional baseline + goal + objectives generated instantly.
                </p>
              </div>
            </div>

            {/* Row 2 - Features 4-6 */}
            {/* Feature Four */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Zero Learning Curve</h3>
                <p className="text-slate-300 leading-relaxed">
                  Start creating professional goals immediately. No training period—professional output from first use.
                </p>
              </div>
            </div>

            {/* Feature Five */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Mobile-Responsive Design</h3>
                <p className="text-slate-300 leading-relaxed">
                  Works perfectly on tablets, phones, and desktops. Create goals anywhere, anytime.
                </p>
              </div>
            </div>

            {/* Feature Six */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">100% Privacy & Offline Ready</h3>
                <p className="text-slate-300 leading-relaxed">
                  Client-side processing means no data transmission. Works offline. No registration required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-16">
            Frequently Asked Questions About IEP Behavior Goals
          </h2>

          {/* FAQ Grid - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-12">
              {/* FAQ 1 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  How long does it take to create a behavior goal?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  The guided wizard helps you complete a comprehensive, compliant behavior goal in under 15 minutes. Compare that to the 2-3 hours it typically takes with traditional methods.
                </p>
              </div>

              {/* FAQ 2 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Are the goals generated legally compliant with IDEA?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes! Our goals are designed to meet all IDEA requirements. The built-in quality assessment meter ensures goals are measurable, observable, and include all necessary components for legal compliance.
                </p>
              </div>

              {/* FAQ 3 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Can I use this for any type of behavior goal?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Absolutely! The tool works for both increasing positive behaviors and decreasing challenging behaviors. It includes smart defaults and examples for common behavior goals in school settings.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* FAQ 4 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Is student data kept private and secure?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes! All processing happens entirely in your browser. No student information is transmitted to our servers or stored anywhere outside your device. This ensures complete FERPA compliance.
                </p>
              </div>

              {/* FAQ 5 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Do I need special training to use this tool?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Not at all! The guided wizard walks you through each step with clear explanations and examples. If you can write IEP goals manually, you can use our tool effectively right away.
                </p>
              </div>

              {/* FAQ 6 */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Can I customize the goals for different grade levels?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes! The tool adapts to different developmental levels and provides age-appropriate measurement criteria and contexts for elementary through high school students.
                </p>
              </div>
            </div>
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
            onClick={() => setIsSignupOpen(true)}
            className="bg-white hover:bg-slate-50 text-emerald-600 font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 text-lg group relative overflow-hidden"
          >
            <span className="relative z-10">Get Started Now - It&apos;s Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <p className="text-emerald-100/80 text-sm mt-4">No registration required • Start immediately • 100% free</p>
        </div>
      </section>

      {/* Upgrade to Full Product Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Want More Than Just Behavior Goals?
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            This free tool focuses specifically on behavior goals. Our comprehensive <strong>IEP Goal Writer</strong> creates goals for all areas of student development.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">This Free Sample Includes:</h3>
              <ul className="text-left space-y-2 text-slate-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Behavior goals only
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic measurement criteria
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simple 5-step process
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-3">Full IEP Goal Writer Includes:</h3>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All goal types (academic, social, behavioral)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced customization options
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team collaboration features
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Progress tracking & analytics
                </li>
              </ul>
            </div>
          </div>
          <a
            href="/iep-goals"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-lg group"
          >
            Explore the Full IEP Goal Writer
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
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
