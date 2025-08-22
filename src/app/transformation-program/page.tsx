'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Star, Award, Heart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailSignupPopup } from '@/components/ui/email-signup-popup';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function TransformationProgramPage() {
  // Cohort management state
  const [cohortStatus, setCohortStatus] = React.useState<'available' | 'full' | 'unknown'>('available');
  const [cohortDate, setCohortDate] = React.useState<string | null>('March 15');
  const [showEmailPopup, setShowEmailPopup] = React.useState(false);

  // Dynamic cohort logic
  React.useEffect(() => {
    // This would typically fetch from your backend/CMS
    // For now, using static logic but ready for dynamic implementation
    const checkCohortStatus = () => {
      // Example logic - replace with actual API call
      const isAvailable = true; // Replace with actual availability check
      const nextDate = '2024-03-15'; // Replace with actual date from backend
      
      if (isAvailable && nextDate) {
        setCohortStatus('available');
        setCohortDate('March 15');
      } else if (!isAvailable) {
        setCohortStatus('full');
      } else {
        setCohortStatus('unknown');
        setCohortDate(null);
      }
    };

    checkCohortStatus();
  }, []);

  // Analytics event tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // Check if dataLayer exists (Google Tag Manager)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer.push({
        event: eventName,
        ...properties,
        variantId: 'hero-opt1',
        viewportWidth: window.innerWidth
      });
    }
    
    // Alternative: direct analytics call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', eventName, properties);
    }
  };

  // Track hero impression on mount
  React.useEffect(() => {
    trackEvent('hero_impression', {
      cohortStartDate: '2024-03-15',
      variantId: 'hero-opt1'
    });
  }, []);

  // CTA click handlers with analytics
  const handlePrimaryCTA = () => {
    if (cohortStatus === 'full') {
      setShowEmailPopup(true);
      trackEvent('waitlist_modal_open', {
        cohortStartDate: cohortDate,
        variantId: 'hero-opt1'
      });
    } else {
      trackEvent('hero_primary_cta_click', {
        cohortStartDate: cohortDate,
        cohortStatus,
        variantId: 'hero-opt1'
      });
    }
  };

  const handleSecondaryCTA = () => {
    trackEvent('hero_secondary_cta_click', {
      target: '#curriculum',
      variantId: 'hero-opt1'
    });
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t-2 border-red-200 shadow-2xl md:hidden">
        <Link 
          href="/signup" 
          className="flex items-center justify-center w-full px-6 py-3 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200"
        >
          👉 Secure Your Spot - $500 Off Today!
        </Link>
      </div>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Professional Background with Subtle Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-100/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-[1200px] px-4 md:px-6 mx-auto">
          <div className="md:grid md:grid-cols-12 md:gap-12 items-center">
            {/* Text Content */}
            <div className="md:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Professional Eyebrow with Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-full shadow-sm"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Cohort-Based Program</span>
                  <span className="text-xs text-slate-500">• 8 Weeks</span>
                </motion.div>

                {/* Enhanced Headline with Professional Typography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h1 className="text-4xl/tight sm:text-5xl/tight md:text-6xl/tight lg:text-7xl/tight font-extrabold text-slate-900 tracking-tight">
                    From Chaos to Confidence
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                      in Just 8 Weeks
                    </span>
                  </h1>
                  
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                    Build systems that reduce burnout<br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>and create school-wide impact
                  </h2>
                </motion.div>

                {/* Enhanced Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl text-slate-600 max-w-[58ch] leading-relaxed"
                >
                  The Behavior School Operating System equips School BCBAs, Psychologists, and Special Education Leaders to stop firefighting and lead with clarity, systems, and results.
                </motion.p>

                {/* Professional CTA Group */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  {cohortStatus === 'full' ? (
                    <Button
                      size="lg"
                      onClick={handlePrimaryCTA}
                      className="rounded-2xl px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Join the Waitlist
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-2xl px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <Link href="/signup" onClick={handlePrimaryCTA}>
                        <Zap className="w-5 h-5 mr-2" />
                        Claim Your Spot
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-2xl px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                  >
                    <Link 
                      href="#curriculum"
                      onClick={(e) => {
                        handleSmoothScroll(e, 'curriculum');
                        handleSecondaryCTA();
                      }}
                    >
                      <Target className="w-5 h-5 mr-2" />
                      See the Curriculum
                    </Link>
                  </Button>
                </motion.div>

                {/* Professional Subtext with Icons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>Limited seats • 20 spots available</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Professional Visual Element */}
            <div className="md:col-span-5 mt-16 md:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Professional Education Image */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/Hero/Hero-group1.webp"
                    alt="Professional education team collaborating - confident leaders working together with systems and clarity"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  
                  {/* Professional Overlay with Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                  

                </div>

                {/* Floating Elements for Premium Feel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Here&apos;s Why Most School BCBAs Feel Powerless and Compromised
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8">
              You think if you just work harder, follow more protocols, or stay quiet about ethics violations, things will improve.
            </p>
            <div className="text-xl sm:text-2xl font-bold text-red-600 mb-6 sm:mb-8">Wrong.</div>
            <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8">
              You need <strong>STRUCTURED LEADERSHIP TOOLS</strong> that let you advocate ethically while building trust.
            </p>
            <p className="text-base sm:text-lg text-slate-600">
              Most school BCBAs, psychologists, and special education leaders are caught in what I call the &quot;Reactive Firefighter Trap&quot; – working hard to maintain ethical standards while feeling unsupported, managing complex team dynamics around implementation, navigating frequent staff transitions, and operating in high-need environments where crisis response takes priority.
            </p>
            <p className="text-base sm:text-lg text-slate-600 mt-4 sm:mt-6">
              Meanwhile, the top 1% have learned to build district-ready systems that work even in the most challenging environments. They&apos;re not working harder or compromising ethics. They have a complete <strong>Behavior School Operating System</strong> that transforms their entire practice and proves their value.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            {/* Hero image */}
            <div className="w-full max-w-4xl mx-auto">
              <img
                src="/OperatingSystem/DD83BB21-6F33-4A94-BF67-311EDDE6D309.webp"
                alt="BCBA working at desk with stressed expression, symbolizing the overwhelm that the Behavior School Operating System solves"
                width={1536}
                height={1024}
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              The 6 Universal Pain Points Every School Professional Faces
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              (And exactly which week we solve each one)
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Pain Point 1 */}
            <motion.div
              className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3 sm:mb-4">1. Systemic Chaos &amp; Lack of Structure</h3>
                  <p className="text-sm sm:text-base text-slate-700 mb-3 sm:mb-4">You&apos;re stuck in reactive mode, with no referral process, no SOPs, and constant &quot;putting out fires.&quot;</p>
                  <div className="text-sm sm:text-base text-red-600 font-semibold">👉 Solved in Weeks 2 &amp; 8</div>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-xs sm:text-sm text-slate-700 space-y-1 sm:space-y-2">
                    <li>• Create referral systems and tiered supports</li>
                    <li>• Build clear SOPs that bring order to chaos</li>
                    <li>• Complete Behavior Operating System Playbook</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-xs sm:text-sm text-slate-700">From daily chaos → to predictable systems and a clear plan that runs the work (not you)</p>
                </div>
              </div>
            </motion.div>

            {/* Pain Point 2 */}
            <motion.div
              className="bg-orange-50 border border-orange-200 rounded-2xl p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-700 mb-4">2. Ethical Conflicts with District Demands</h3>
                  <p className="text-slate-700 mb-4">You&apos;re pressured to compromise ethics (e.g., working without consent, misusing RBTs).</p>
                  <div className="text-orange-600 font-semibold">👉 Solved in Week 1</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Clarify where ethics and district expectations collide</li>
                    <li>• Learn advocacy scripts and boundary-setting strategies</li>
                    <li>• Protect integrity while preserving relationships</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-slate-700">From feeling powerless → to confidently protecting your ethics while gaining admin respect</p>
                </div>
              </div>
            </motion.div>

            {/* Pain Point 3 */}
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-2xl p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-4">3. Staff Engagement &amp; Collaboration Challenges</h3>
                  <p className="text-slate-700 mb-4">Building consistent implementation and engagement across all team members.</p>
                  <div className="text-blue-600 font-semibold">👉 Solved in Weeks 4 &amp; 5</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Master the Buy-In Blueprint (trust-building, micro-coaching)</li>
                    <li>• Reframe ABA as collaborative and student-centered</li>
                    <li>• Build positive feedback loops with staff</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-slate-700">From inconsistent implementation → to engaged staff implementing plans with ownership and confidence</p>
                </div>
              </div>
            </motion.div>

            {/* Pain Point 4 */}
            <motion.div
              className="bg-purple-50 border border-purple-200 rounded-2xl p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">4. Staff Turnover &amp; Training Fatigue</h3>
                  <p className="text-slate-700 mb-4">High turnover makes it feel like you&apos;re retraining endlessly.</p>
                  <div className="text-purple-600 font-semibold">👉 Solved in Week 7</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Build plug-and-play onboarding tools</li>
                    <li>• Create fidelity checklists and supervision models</li>
                    <li>• Systems that work no matter who&apos;s on staff</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-slate-700">From retraining every month → to sustainable systems that survive staff changes</p>
                </div>
              </div>
            </motion.div>

            {/* Pain Point 5 */}
            <motion.div
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-4">5. Chaotic Classrooms &amp; Crisis Management</h3>
                  <p className="text-slate-700 mb-4">Classrooms with high-need students feel unmanageable, with no time for pre-briefs or debriefs.</p>
                  <div className="text-emerald-600 font-semibold">👉 Solved in Week 6</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Create trauma-informed crisis protocols</li>
                    <li>• Build quick, repeatable staff response systems</li>
                    <li>• Real-time intervention and coaching strategies</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-slate-700">From unpredictable chaos → to calm, confident crisis response that protects students and staff</p>
                </div>
              </div>
            </motion.div>

            {/* Pain Point 6 */}
            <motion.div
              className="bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-12"
              variants={fadeInUp}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-700 mb-4">6. Demonstrating Impact &amp; Value</h3>
                  <p className="text-slate-700 mb-4">Clearly showing progress and effectively communicating your professional contributions.</p>
                  <div className="text-slate-600 font-semibold">👉 Solved Throughout (especially Weeks 3 &amp; 8)</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Data systems that prove student progress</li>
                    <li>• Make your impact visible and measurable</li>
                    <li>• Polished playbook that demonstrates district value</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-700 mb-2">Transformation:</h4>
                  <p className="text-slate-700">From unclear impact → to respected leader with compelling evidence of positive outcomes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Solution */}
      <section id="curriculum" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              The Behavior School Operating System
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Your 8-Week Blueprint to BCBA Mastery
            </p>
            <p className="text-base sm:text-lg text-slate-600 max-w-4xl mx-auto">
              This isn&apos;t another course filled with theory you&apos;ll never use. This is the exact step-by-step system my clients use to transform chaotic school practices into streamlined, results-driven operations.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Week 1 */}
            <motion.div
              className="bg-slate-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                    Week 1: Clarifying Your Role &amp; Ethics in Schools
                  </h3>
                  <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-xs sm:text-sm text-slate-600">District demands clash with BACB ethics code - misusing RBTs, ignoring consent, pushing you to &quot;just put out fires&quot;</p>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-xs sm:text-sm text-slate-600">Identify specific ethics conflicts and build advocacy scripts to protect your integrity while preserving relationships</p>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-xs sm:text-sm text-slate-600">From feeling powerless → to being an ethical leader with clarity and confidence</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-red-600 font-semibold text-sm sm:text-base">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mb-1 sm:mb-0" />
                    <span>What You Get: Ethics conflict matrix + boundary-setting scripts + administrator conversation templates</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 2 */}
            <motion.div
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 2: Creating a Strong Operating Framework
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Everything feels random - no referral systems, tiered supports, or consistent procedures</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Design referral systems, tiered supports, and SOPs that bring structure where none exists</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From &quot;everything feels random&quot; → to having a framework that brings order to chaos</p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    What You Get: Referral system templates + tiered support frameworks + essential SOPs for consistency
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 3 */}
            <motion.div
              className="bg-slate-50 rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 3: Data That Drives Buy-In
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Subjective disagreements about student progress with no shared evidence to align staff</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Create simple, transparent data systems to track progress and use data as collaboration tool, not compliance</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From subjective disagreements → to staff alignment around clear, shared evidence</p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-600 font-semibold">
                    <Target className="w-5 h-5 mr-2" />
                    What You Get: Simple data collection systems + progress tracking templates + collaboration-focused reporting tools
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 4 */}
            <motion.div
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 4: Teacher &amp; Staff Buy-In Blueprint
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Struggling to build collaborative relationships and consistent plan implementation across diverse team members</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Learn strategies to build engagement, strengthen collaborative relationships, and master micro-coaching with quick-win interventions</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From challenging team dynamics → to strong collaborative partnerships with educators</p>
                    </div>
                  </div>
                  <div className="flex items-center text-pink-600 font-semibold">
                    <Users className="w-5 h-5 mr-2" />
                    What You Get: Engagement building strategies + micro-coaching frameworks + quick-win intervention protocols
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 5 */}
            <motion.div
              className="bg-slate-50 rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 5: Leading with Collaboration, Not Control
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Staff view ABA as rigid and compliance-driven rather than supportive and collaborative</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Reframe ABA as supportive, incorporate approaches that build intrinsic motivation and student agency</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From staff viewing ABA as rigid → to collaborative systems everyone believes in</p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-600 font-semibold">
                    <Heart className="w-5 h-5 mr-2" />
                    What You Get: Collaborative ABA frameworks + intrinsic motivation tools + student agency protocols
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 6 */}
            <motion.div
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    6
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 6: Crisis Response Systems in Any Setting
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Operating in chaotic classrooms where crisis response takes over and real teaching never begins</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Build clear de-escalation protocols, trauma-informed practices, and train staff to respond consistently</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From constant unpredictability → to calm, confident crisis management</p>
                    </div>
                  </div>
                  <div className="flex items-center text-emerald-600 font-semibold">
                    <Shield className="w-5 h-5 mr-2" />
                    What You Get: De-escalation protocols + trauma-informed practices + staff training systems for consistent response
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 7 */}
            <motion.div
              className="bg-slate-50 rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    7
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 7: Scaling Through Supervision &amp; Staff Turnover
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Struggling with constant staff turnover, making training and fidelity feel impossible - retraining endlessly</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Create onboarding systems and fidelity tools that outlast turnover, protect RBT roles, ensure effective supervision</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From retraining endlessly → to sustainable systems that stick</p>
                    </div>
                  </div>
                  <div className="flex items-center text-teal-600 font-semibold">
                    <Award className="w-5 h-5 mr-2" />
                    What You Get: Turnover-proof onboarding systems + RBT protection protocols + sustainable supervision frameworks
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Week 8 */}
            <motion.div
              className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-slate-200"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    8
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    Week 8: Your District or School Playbook
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Problem:</h4>
                      <p className="text-slate-600">Need to clearly demonstrate professional effectiveness when working within complex systems and limited resources</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Solution:</h4>
                      <p className="text-slate-600">Put everything together into a district-ready operating system - your complete playbook to transform practice and prove value</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">The Transformation:</h4>
                      <p className="text-slate-600">From unclear professional impact → to empowered leader with a clear model for success</p>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-600 font-semibold">
                    <Star className="w-5 h-5 mr-2" />
                    What You Get: Complete district-ready operating system + implementation roadmap + value-proof documentation
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              What Makes This Different From Every Other BCBA Training?
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-red-200" variants={fadeInUp}>
              <div className="flex items-start gap-4">
                <div className="text-red-500 text-2xl">❌</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Other Programs Give You Theory. I Give You Systems.</h3>
                  <p className="text-slate-600">While others teach you &quot;what&quot; to do, I show you exactly &quot;how&quot; to do it with templates, scripts, and step-by-step processes.</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-red-200" variants={fadeInUp}>
              <div className="flex items-start gap-4">
                <div className="text-red-500 text-2xl">❌</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Other Programs Are Generic. This Is Customized.</h3>
                  <p className="text-slate-600">Every tool, template, and strategy is built specifically for the unique challenges of school-based BCBAs.</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-red-200" variants={fadeInUp}>
              <div className="flex items-start gap-4">
                <div className="text-red-500 text-2xl">❌</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Other Programs Leave You Hanging. I Give You Everything.</h3>
                  <p className="text-slate-600">You get the complete Operating System – not just concepts, but ready-to-implement tools you can use Monday morning.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add social proof banner */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-800 text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              <span>Join 500+ School BCBAs who transformed their practice</span>
            </div>
          </div>

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Here&apos;s What Happens When You Lead with Ethical Confidence:
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              "A District-Ready Behavior Operating System (you can use immediately)",
              "Confidence to Protect Your Ethics and Lead with Integrity (no more impossible positions)",
              "Tools That Build Teacher and Admin Partnerships (strong collaborative relationships)",
              "Sustainable Systems That Work Even Through Turnover (stop retraining endlessly)",
              "Crisis Response Protocols That Bring Order to Chaos (calm, confident leadership)",
              "Data and Playbook That Prove Your Value (clear evidence of your impact)",
              "Predictable Systems That Run the Work (not you - reclaim your sanity)"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 bg-white p-6 rounded-xl shadow-md"
                variants={fadeInUp}
              >
                <div className="text-emerald-500 mt-1">✅</div>
                <p className="text-slate-700 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Bottom Line */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
              The Bottom Line
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-4xl mx-auto">
              You have two choices:
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-red-700 mb-4">Choice 1:</h3>
                <p className="text-slate-700">Keep compromising your ethics to avoid conflict. Stay trapped between district demands and professional standards, feeling powerless and blamed when things go wrong.</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">Choice 2:</h3>
                <p className="text-slate-700">Get the framework that transforms school BCBAs from powerless rule-followers into ethical leaders. Join practitioners who advocate confidently while building trust and creating systemic change.</p>
              </div>
            </div>
            <p className="text-xl text-slate-700 mt-8 max-w-3xl mx-auto">
              The choice is yours. But spots are limited.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA with Pricing */}
      <section id="enroll" className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-red-600 text-white rounded-full px-6 py-2 inline-block font-bold mb-6">
              🔥 LIMITED TIME OFFER
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Ready to Lead with Ethical Confidence?
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              The Ethical Leadership Framework isn&apos;t just another training program. It&apos;s your blueprint for navigating district chaos while maintaining professional integrity.
            </p>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg mx-auto mb-8 border-2 border-red-200 shadow-xl">
              <div className="text-slate-900">
                <div className="text-lg font-semibold mb-2">Investment:</div>
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">$2,497</div>
                <div className="text-slate-600 mb-4 text-sm md:text-base">(or 3 payments of $897)</div>
                <div className="text-lg font-semibold mb-2">Value:</div>
                <div className="text-xl md:text-2xl font-bold text-emerald-600 mb-4">Over $15,000 in tools, templates, and systems</div>
                <div className="text-lg font-semibold mb-2">Guarantee:</div>
                <div className="text-slate-600 mb-4 text-sm md:text-base">30-day money-back guarantee if you don&apos;t see immediate improvement</div>
                <div className="bg-yellow-400 text-yellow-900 p-3 md:p-4 rounded-lg font-semibold text-sm md:text-base">
                  💾 Save $500 when you enroll today!
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Link 
                href="/signup" 
                className="inline-flex items-center px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105"
              >
                👉 SECURE YOUR SPOT NOW
                <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </div>

            <div className="text-slate-900 font-semibold mb-6 text-base sm:text-lg">
              ⏰ Only 20 spots available. When they&apos;re gone, they&apos;re gone.
            </div>

            {/* Add urgency counter */}
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 sm:p-4 mb-6 max-w-md mx-auto">
              <div className="text-red-800 font-bold text-sm sm:text-base text-center">
                🔥 EARLY BIRD PRICING ENDS SOON
              </div>
              <div className="text-red-600 text-xs sm:text-sm text-center mt-1">
                Next cohort starts March 15th - Secure your spot today!
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 md:p-6 max-w-4xl mx-auto">
              <p className="text-slate-800 text-base md:text-lg">
                <strong>P.S.</strong> - Every day you wait is another day of ethical compromise and professional frustration. The confident BCBAs in your district already have systems. Don&apos;t let another district demand put you in an impossible position.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={showEmailPopup}
        onClose={() => setShowEmailPopup(false)}
        title="Join the Transformation Program Waitlist"
        description="This cohort is full, but we'll notify you when the next one opens. Get early access and special pricing."
        pageSource="transformation-program"
        buttonText="Join Waitlist"
        successMessage="Thanks! We'll notify you when the next cohort opens."
      />

      {/* Structured Data (Course Schema) */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const courseJsonLd = {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Behavior School Operating System - Transformation Program",
          "description": "8-week cohort-based program for School BCBAs, Psychologists, and Special Education Leaders to replace firefighting with systems that reduce burnout and drive school-wide impact. Learn ethical leadership, crisis management, staff training, and data-driven systems.",
          "provider": {
            "@type": "Organization",
            "name": "Behavior School",
            "url": SITE_URL,
            "logo": `${SITE_URL}/Logos/logo-gold-transparent.webp`
          },
          "courseMode": "online",
          "educationalLevel": "Professional",
          "audience": {
            "@type": "Audience",
            "audienceType": "School BCBAs, Psychologists, Special Education Leaders"
          },
          "timeRequired": "P8W",
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "cohort",
            "startDate": "2024-03-15",
            "duration": "P8W",
            "instructor": {
              "@type": "Organization",
              "name": "Behavior School"
            }
          },
          "offers": {
            "@type": "Offer",
            "category": "Professional Development",
            "availability": "https://schema.org/LimitedAvailability",
            "price": "2497",
            "priceCurrency": "USD",
            "validFrom": "2024-01-01",
            "validThrough": "2024-12-31",
            "url": `${SITE_URL}/signup`
          },
          "teaches": [
            "Ethical leadership in school settings",
            "Systems-based behavior support",
            "Crisis management and de-escalation",
            "Staff training and supervision",
            "Data-driven decision making",
            "BCBA burnout prevention",
            "School district collaboration strategies",
            "Trauma-informed practices"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "247",
            "bestRating": "5",
            "worstRating": "1"
          },
          "numberOfStudents": "500+",
          "occupationalCredentialAwarded": "Certificate of Completion"
        } as const;

        return (
          <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} 
          />
        );
      })()}
      {/* Add bottom padding for mobile to account for sticky CTA */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}
