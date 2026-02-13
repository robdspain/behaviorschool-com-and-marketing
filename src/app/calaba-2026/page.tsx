"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, Shield, Zap, Star } from "lucide-react";

export default function CalABA2026FoundingMember() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-03-07T23:59:59-08:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would integrate with your email service (Listmonk, etc.)
    console.log("Email submitted:", { name, email });
    setSubmitted(true);
  };

  // JSON-LD Schema for FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this FERPA compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All student data is processed locally in your browser. We never store, transmit, or train models on student information. Each tool follows FERPA best practices for school-based behavior analysis."
        }
      },
      {
        "@type": "Question",
        "name": "What if I am not at CalABA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This exclusive Founding Member rate is available to all school-based BCBAs through March 7, 2026. You don't need to attend CalABA to join — this is for the entire school BCBA community."
        }
      },
      {
        "@type": "Question",
        "name": "Can my district purchase this?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer district and SELPA-wide licenses. Contact us at rob@behaviorschool.com for volume pricing and purchase orders. Founding Members get priority access to district license conversions."
        }
      },
      {
        "@type": "Question",
        "name": "What is the cancellation policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cancel anytime, no questions asked. Your Founding Member rate stays locked as long as you remain subscribed. If you cancel and rejoin later, you'll pay the current standard rate."
        }
      },
      {
        "@type": "Question",
        "name": "When do new tools get added?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We ship new features monthly. Coming in 2026: CEU Library (Q2), Supervision Dashboard (Q3), Data Collection Mobile App (Q4). All future tools are included at no extra cost for Founding Members."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-bs-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-bs-primary via-bs-primary-dark to-slate-900 text-white pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-bs-accent/20 text-bs-accent px-4 py-2 rounded-full text-sm font-bold mb-6 border border-bs-accent/30">
              🎓 CalABA 2026 Exclusive Offer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Become a <span className="text-bs-accent">Founding Member</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the first 100 school BCBAs getting AI-powered tools built specifically for them
            </p>

            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-slate-300 mb-4 font-medium">Founding Member Rate Ends:</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Days", value: timeRemaining.days },
                  { label: "Hours", value: timeRemaining.hours },
                  { label: "Minutes", value: timeRemaining.minutes },
                  { label: "Seconds", value: timeRemaining.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="bg-bs-primary-dark rounded-lg p-4">
                    <div className="text-3xl sm:text-4xl font-bold text-bs-accent mb-1">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="https://plan.behaviorschool.com/signup?plan=founding"
              className="inline-flex items-center gap-2 bg-bs-accent hover:bg-bs-accent/90 text-bs-primary-dark text-lg font-bold px-10 py-5 rounded-xl shadow-lg shadow-bs-accent/25 transition-all hover:scale-105"
            >
              Lock In Your Founding Member Rate
            </Link>

            <p className="text-sm text-slate-400 mt-4">
              Limited to first 100 members · $149/year (40% off forever)
            </p>
          </div>
        </div>

        {/* What You Get Section */}
        <div className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-bs-primary">
              What You Get as a Founding Member
            </h2>
            <p className="text-center text-bs-text-light text-lg mb-12 max-w-2xl mx-auto">
              Everything you need to save hours every week while delivering better outcomes for students
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "AI-Powered FBA Generator",
                  description: "Upload observation data and get a comprehensive Functional Behavior Assessment in minutes. Save 8+ hours per FBA with legally defensible documentation.",
                  icon: "📋",
                  badge: "Available Now",
                },
                {
                  title: "IEP Behavior Goal Writer",
                  description: "Generate measurable, SMART behavior goals aligned to your FBA findings. Legally defensible goals in minutes, not hours.",
                  icon: "🎯",
                  badge: "Available Now",
                },
                {
                  title: "Behavior Plan Writer",
                  description: "From assessment to intervention in one seamless workflow. Generate comprehensive BIPs connected directly to your FBA data.",
                  icon: "📝",
                  badge: "Available Now",
                },
                {
                  title: "Goal Bank (500+ Goals)",
                  description: "Searchable library of evidence-based behavior and academic goals. Filter by domain, grade level, and intervention type.",
                  icon: "📚",
                  badge: "Available Now",
                },
                {
                  title: "CEU Library",
                  description: "School-focused continuing education units. Track your BACB requirements and earn credits on topics that matter for school practice.",
                  icon: "🎓",
                  badge: "Coming Q2 2026",
                },
                {
                  title: "Supervision Dashboard",
                  description: "Manage RBT supervision hours, track professional development, and document supervision sessions. Built for school-based supervisors.",
                  icon: "👥",
                  badge: "Coming Q3 2026",
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className="bg-bs-section-odd border-2 border-bs-primary/10 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      tool.badge.includes("Now") 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-bs-primary">{tool.title}</h3>
                  <p className="text-bs-text-light leading-relaxed">{tool.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-bs-accent/10 text-bs-primary px-6 py-3 rounded-full border-2 border-bs-accent/30">
                <Zap className="w-5 h-5 text-bs-accent" />
                <span className="font-bold">All future tools included at no extra cost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-20 px-4 bg-bs-section-odd">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-bs-primary">
              Founding Member Pricing
            </h2>
            <p className="text-center text-bs-text-light text-lg mb-12">
              Lock in this rate forever — as long as you stay subscribed
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Annual Plan - Recommended */}
              <div className="bg-white border-4 border-bs-accent rounded-2xl p-8 relative shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bs-accent text-bs-primary-dark text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ FOUNDING MEMBER RATE
                </div>
                
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-bs-primary mb-2">Annual Plan</h3>
                  <div className="mb-2">
                    <span className="text-slate-500 line-through text-xl">$249/year</span>
                  </div>
                  <div className="text-5xl font-bold text-bs-primary mb-1">
                    $149
                  </div>
                  <div className="text-bs-text-light text-sm">per year · billed annually</div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "40% off forever",
                    "All current tools",
                    "All future tools included",
                    "Priority feature requests",
                    "Founding Member Discord channel",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-bs-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="https://plan.behaviorschool.com/signup?plan=founding-annual"
                  className="block w-full bg-bs-accent hover:bg-bs-accent/90 text-bs-primary-dark font-bold py-4 rounded-xl text-center transition-colors shadow-lg"
                >
                  Get Started — $149/year
                </Link>

                <p className="text-xs text-center text-slate-500 mt-4">
                  Save $100/year compared to standard rate
                </p>
              </div>

              {/* Monthly Plan */}
              <div className="bg-white border-2 border-bs-primary/20 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-bs-primary mb-2">Monthly Plan</h3>
                  <div className="mb-2">
                    <span className="text-slate-500 line-through text-xl">$25/month</span>
                  </div>
                  <div className="text-5xl font-bold text-bs-primary mb-1">
                    $19
                  </div>
                  <div className="text-bs-text-light text-sm">per month · cancel anytime</div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "24% off standard rate",
                    "All current tools",
                    "All future tools included",
                    "Cancel anytime",
                    "Rate locked forever",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-bs-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="https://plan.behaviorschool.com/signup?plan=founding-monthly"
                  className="block w-full bg-bs-primary hover:bg-bs-primary-dark text-white font-bold py-4 rounded-xl text-center transition-colors"
                >
                  Get Started — $19/month
                </Link>

                <p className="text-xs text-center text-slate-500 mt-4">
                  Annual plan saves you $79 per year
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-2xl mx-auto bg-white border-2 border-bs-accent/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-bs-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-bs-primary mb-2">Lock in this price forever</h4>
                  <p className="text-sm text-bs-text-light">
                    After the first 100 members, our standard rate is $249/year or $25/month. 
                    As a Founding Member, your rate never increases — ever — as long as you stay subscribed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-bs-section-odd border border-bs-primary/10 rounded-2xl p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-bs-primary rounded-full flex items-center justify-center text-white text-5xl font-bold">
                    RS
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-bs-primary mb-3">
                    Built by Rob Spain, BCBA, IBA
                  </h3>
                  <p className="text-bs-text-light mb-4 leading-relaxed">
                    A school-based behavior analyst who uses these tools every day. Rob leads the behavior team at 
                    Kings Canyon Unified School District and coordinates the Fresno County BCBA Collaborative, 
                    supporting 30+ school districts across Central California.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white border border-bs-primary/20 px-3 py-1 rounded-full text-sm text-bs-primary font-medium">
                      KCUSD Behavior Team Lead
                    </span>
                    <span className="bg-white border border-bs-primary/20 px-3 py-1 rounded-full text-sm text-bs-primary font-medium">
                      Fresno County BCBA Collaborative
                    </span>
                    <span className="bg-white border border-bs-primary/20 px-3 py-1 rounded-full text-sm text-bs-primary font-medium">
                      CalABA 2026 Presenter
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-bs-text-light italic mb-4">
                "I built Behavior School because I was drowning in paperwork like everyone else. 
                These aren't adapted clinic tools — they're built from the ground up for school BCBAs who need to move fast 
                and produce legally defensible documentation."
              </p>
              <p className="text-bs-primary font-bold">— Rob Spain, BCBA</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-20 px-4 bg-bs-section-odd">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-bs-primary">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: "Is this FERPA compliant?",
                  answer: "Yes. All student data is processed locally in your browser. We never store, transmit, or train models on student information. Each tool follows FERPA best practices for school-based behavior analysis.",
                },
                {
                  question: "What if I am not at CalABA?",
                  answer: "This exclusive Founding Member rate is available to all school-based BCBAs through March 7, 2026. You don't need to attend CalABA to join — this is for the entire school BCBA community.",
                },
                {
                  question: "Can my district purchase this?",
                  answer: "Yes! We offer district and SELPA-wide licenses. Contact us at rob@behaviorschool.com for volume pricing and purchase orders. Founding Members get priority access to district license conversions.",
                },
                {
                  question: "What is the cancellation policy?",
                  answer: "Cancel anytime, no questions asked. Your Founding Member rate stays locked as long as you remain subscribed. If you cancel and rejoin later, you'll pay the current standard rate.",
                },
                {
                  question: "When do new tools get added?",
                  answer: "We ship new features monthly. Coming in 2026: CEU Library (Q2), Supervision Dashboard (Q3), Data Collection Mobile App (Q4). All future tools are included at no extra cost for Founding Members.",
                },
              ].map((faq) => (
                <div key={faq.question} className="bg-white rounded-xl p-6 border border-bs-primary/10">
                  <h3 className="font-bold text-lg text-bs-primary mb-3">{faq.question}</h3>
                  <p className="text-bs-text-light leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-bs-primary mb-6">
              Share This Page
            </h2>
            <p className="text-bs-text-light mb-8">
              Scan this QR code from any presentation slide or share with colleagues
            </p>

            <div className="inline-block bg-white border-4 border-bs-primary rounded-2xl p-8">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="mx-auto"
              >
                {/* Simple QR code placeholder - in production, use a proper QR library */}
                <rect width="200" height="200" fill="white" />
                <rect x="10" y="10" width="60" height="60" fill="black" />
                <rect x="20" y="20" width="40" height="40" fill="white" />
                <rect x="30" y="30" width="20" height="20" fill="black" />
                
                <rect x="130" y="10" width="60" height="60" fill="black" />
                <rect x="140" y="20" width="40" height="40" fill="white" />
                <rect x="150" y="30" width="20" height="20" fill="black" />
                
                <rect x="10" y="130" width="60" height="60" fill="black" />
                <rect x="20" y="140" width="40" height="40" fill="white" />
                <rect x="30" y="150" width="20" height="20" fill="black" />
                
                {/* Data pattern */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <g key={i}>
                    <rect x={80 + (i % 5) * 10} y={80 + Math.floor(i / 5) * 10} width="8" height="8" fill={Math.random() > 0.5 ? "black" : "white"} />
                  </g>
                ))}
              </svg>
              <p className="text-sm text-bs-text-light mt-4 font-mono">
                behaviorschool.com/calaba-2026
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA: Email Capture */}
        <div className="py-20 px-4 bg-gradient-to-br from-bs-primary via-bs-primary-dark to-slate-900 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Not Ready Yet? Stay Updated.
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Get notified when we launch new tools and features
            </p>

            {!submitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-bs-text border-2 border-white/20 focus:border-bs-accent focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-bs-text border-2 border-white/20 focus:border-bs-accent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-bs-accent hover:bg-bs-accent/90 text-bs-primary-dark font-bold px-8 py-4 rounded-lg transition-colors"
                >
                  Notify Me When New Tools Launch
                </button>
              </form>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-lg font-medium">Thanks! We'll keep you posted.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-bs-primary/10 py-8 px-4 text-center bg-white">
          <p className="text-sm text-bs-text-light">
            © {new Date().getFullYear()} Behavior School · Founding Member rate valid through March 7, 2026
          </p>
          <div className="mt-4 space-x-6">
            <Link href="/privacy" className="text-sm text-bs-primary hover:text-bs-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-bs-primary hover:text-bs-accent">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-bs-primary hover:text-bs-accent">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
