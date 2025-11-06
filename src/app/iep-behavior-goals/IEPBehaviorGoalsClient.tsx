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
      question: "What are IEP behavior goals?",
      answer: "IEP behavior goals are measurable objectives written into a student's Individualized Education Program (IEP) to address specific behavioral challenges that interfere with learning. These goals must include baseline data, target behaviors, measurement criteria, and expected progress within a specific timeframe. Effective behavior goals focus on replacement behaviors, not just reducing problem behaviors."
    },
    {
      question: "How do I write a behavior goal for an IEP?",
      answer: "To write an effective IEP behavior goal: (1) Identify the target behavior with clear, observable terms, (2) Establish baseline data showing current performance, (3) Define measurable criteria for success, (4) Set a realistic timeframe, (5) Specify how progress will be measured, and (6) Include conditions and supports needed. Use our free IEP Behavior Goals generator to create compliant goals in minutes."
    },
    {
      question: "What makes a good IEP behavior goal?",
      answer: "A good IEP behavior goal is SMART: Specific (clearly defined behavior), Measurable (quantifiable progress), Achievable (realistic for the student), Relevant (addresses educational needs), and Time-bound (specific deadline). It should focus on positive replacement behaviors, include baseline data, specify measurement methods, and align with functional behavior assessment findings."
    },
    {
      question: "What is the difference between behavior IEP goals and academic IEP goals?",
      answer: "Behavior IEP goals target social-emotional, behavioral, or adaptive skills that interfere with learning (e.g., staying on-task, following directions, managing emotions), while academic IEP goals address specific subject areas like reading or math. Behavior goals often require different measurement strategies, such as frequency counts, duration recording, or interval sampling, rather than standardized assessments."
    },
    {
      question: "What is the IEP Goal Writer Widget?",
      answer: "The IEP Goal Writer Widget is a free specialized tool designed for special education professionals, behavior specialists, and IEP teams to quickly and efficiently generate compliant and measurable behavior goals. The 6-step guided wizard ensures all critical components are addressed while maintaining complete privacy - everything stays in your browser."
    },
    {
      question: "How long should IEP behavior goals last?",
      answer: "IEP behavior goals typically last one year, corresponding to the annual IEP review cycle. However, progress should be monitored and reported quarterly or per district requirements. Goals can be modified during the year through IEP amendments if the student masters the goal early or if data shows the goal needs adjustment."
    },
    {
      question: "Do IEP behavior goals require a Functional Behavior Assessment (FBA)?",
      answer: "An FBA is required when developing a Behavior Intervention Plan (BIP) for serious or persistent behaviors, but not all IEP behavior goals require an FBA. However, FBA data significantly improves behavior goal quality by identifying function, antecedents, and consequences. Best practice is to conduct an FBA for any behavior goal targeting replacement behaviors."
    },
    {
      question: "Can parents request behavior goals in an IEP?",
      answer: "Yes, parents can and should request behavior goals if their child's behavior interferes with learning. During IEP meetings, parents can present documentation of behavioral concerns, request evaluations including FBAs, and advocate for specific behavioral supports and measurable goals. Schools must consider parent input and data when determining IEP goals and services."
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

  // SoftwareApplication structured data
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "IEP Behavior Goals Generator",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online tool for creating compliant, measurable IEP behavior goals. Designed for special education professionals, behavior specialists, and IEP teams.",
    "url": "https://behaviorschool.com/iep-behavior-goals",
    "screenshot": "https://behaviorschool.com/thumbnails/iep-behavior-goal-thumb.webp",
    "author": {
      "@type": "Organization",
      "name": "Behavior School"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "6-step guided wizard",
      "Measurable goal generation",
      "Complete browser privacy",
      "Instant PDF export",
      "Free unlimited use"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-32 pb-4">
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              { label: "IEP Goal Writer", href: "/iep-goals" },
              { label: "Free Behavior Goals Generator" }
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-100 to-transparent opacity-20 blur-2xl" />

          <div className="relative text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              ✨ Free Sample from Our <a href="/iep-goals" className="underline hover:text-blue-900 ml-1">IEP Goal Writer</a>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Free IEP Behavior Goals Generator
              <span className="block bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">Create Goals in Under 5 Minutes</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Generate professional IEP behavior goals in minutes. Our specialized wizard transforms lengthy IEP sessions into quick, compliant goal creation with measurable outcomes.
            </p>

            {/* Main CTA Button */}
            <div className="mb-6">
              <button
                onClick={handleCTAClick}
                style={{backgroundColor: '#E3B23C'}}
                className="hover:opacity-90 text-white font-bold py-4 px-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
              >
                Start Creating Goals Now
              </button>
              <p className="mt-3 text-sm text-slate-600">No signup required • 100% free • Results in minutes</p>
            </div>

            {/* Secondary Link */}
            <div className="mb-8">
              <a href="/iep-goal-qualitychecker" className="text-blue-600 hover:text-blue-700 underline text-sm font-medium">
                Already have a goal? Check quality →
              </a>
            </div>

            {/* Trust Bar */}
            <div className="inline-flex items-center justify-center gap-6 px-8 py-4 bg-blue-50 border-2 border-blue-200 rounded-2xl mb-8">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <span className="text-sm text-slate-700">Client-Side</span>
              </div>
              <div className="h-6 w-px bg-blue-300" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <span className="text-sm text-slate-700">Registration</span>
              </div>
              <div className="h-6 w-px bg-blue-300" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <span className="text-sm text-slate-700">Minutes</span>
              </div>
              <div className="h-6 w-px bg-blue-300" />
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold" style={{color: '#E3B23C'}}>Free</div>
                <span className="text-sm text-slate-700">To Use</span>
              </div>
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
        </section>
      </div>

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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
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
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: '#FEF3D3'}}>
                <svg className="w-6 h-6" style={{color: '#D4A017'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 transition-colors group-hover:text-blue-600">
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

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-center text-slate-600 mb-4">
              Looking for values-aligned goal setting? Check out our{" "}
              <a href="/values-goal-assistant-landing" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                Behavior Goal Assistant
              </a>
              {" "}for creating student-centered, values-driven IEP goals.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{background: 'linear-gradient(135deg, #1E3A34 0%, #152825 100%)'}}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24" style={{backgroundColor: '#E3B23C', filter: 'blur(64px)'}}></div>
            </div>
            <div className="relative px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to Generate Your IEP Behavior Goals?
              </h2>
              <p className="text-xl text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                Start creating compliant, measurable behavior goals in under 5 minutes with our specialized tool.
              </p>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                This free behavior goals generator is just a sample of our comprehensive <a href="/iep-goals" className="text-white hover:opacity-80 underline font-semibold">IEP Goal Writer</a> that creates goals for all areas, not just behavior.
              </p>
              <button
                onClick={handleCTAClick}
                style={{backgroundColor: '#E3B23C'}}
                className="hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 text-lg"
              >
                Get Started Now - It&apos;s Free
              </button>
              <p className="text-slate-300 text-sm mt-4">Start immediately • 100% free</p>
            </div>
          </div>
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
