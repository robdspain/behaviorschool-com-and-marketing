'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Star, Award, Heart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailSignupPopup } from '@/components/ui/email-signup-popup';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ScrollNav } from '@/components/ui/scroll-nav';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import { ValueStack } from '@/components/ui/value-stack';
import { CurriculumProgress } from '@/components/ui/curriculum-progress';
import { ExitIntentModal } from '@/components/ui/exit-intent-modal';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function TransformationProgramPage() {
  const [showEmailPopup, setShowEmailPopup] = React.useState(false);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t-2 border-red-200 shadow-2xl md:hidden">
        <Link 
          href="/signup" 
          className="flex items-center justify-center w-full px-6 py-3 text-lg font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200"
        >
          👉 SECURE YOUR SPOT NOW
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: "Transformation Program" }]} />
      </div>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1200px] px-4 md:px-6 mx-auto">
          <div className="md:grid md:grid-cols-12 md:gap-12 items-center">
            <div className="md:col-span-7">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight">
                  From Chaos to Confidence
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-[58ch] leading-relaxed">
                  The Behavior School Operating System equips School BCBAs to stop firefighting and lead with clarity, systems, and results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="rounded-2xl px-8 h-14 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl">
                    <Link href="/signup">Claim Your Spot <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-5 mt-16 md:mt-0">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/Hero/Hero-group1.webp" alt="Education team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollNav 
        items={[
          { id: "problem", label: "The Problem" },
          { id: "curriculum", label: "Curriculum" },
          { id: "outcomes", label: "Outcomes" },
          { id: "enroll", label: "Enroll" },
        ]}
      />

      <section id="problem" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Stop Survival Mode</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Most school BCBAs are caught in the &quot;Reactive Firefighter Trap&quot;. We provide the systems to break free.
          </p>
        </div>
      </section>

      <section id="curriculum" className="py-16 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6">The Operating System</h2>
            <p className="text-lg text-emerald-700 font-medium">8 Weeks to Mastery</p>
          </motion.div>

          <div className="relative">
            <CurriculumProgress />
            <div className="absolute left-6 md:left-[3.5rem] top-0 bottom-0 w-0.5 bg-slate-200 sm:block hidden" />
            <div className="space-y-12">
              {[1,2,3,4,5,6,7,8].map((week) => (
                <motion.div key={week} data-week={week} className="relative flex flex-col md:flex-row gap-8 md:gap-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                  <div className="flex-shrink-0 flex items-center justify-start md:justify-center">
                    <div className="w-12 h-12 md:w-20 md:h-20 bg-white border-4 border-slate-100 rounded-full shadow-sm z-10 flex items-center justify-center font-bold text-slate-900">
                      0{week}
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Week {week} Focus</h3>
                    <p className="text-slate-600">Deep dive into systems and frameworks designed for real classrooms.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="outcomes" className="py-16 lg:py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">What Happens When You Lead</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {["District-Ready Systems", "Ethical Confidence", "Sustainable Impact"].map(item => (
              <div key={item} className="bg-white p-8 rounded-2xl shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                <h4 className="font-bold">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <FAQAccordion items={[
            { question: "When does it start?", answer: "The next cohort begins March 15th." },
            { question: "What if I miss a call?", answer: "All sessions are recorded." },
            { question: "Can I pay with a PO?", answer: "Yes, email support@behaviorschool.com." }
          ]} />
        </div>
      </section>

      <section id="enroll" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ValueStack 
            items={[
              { label: "Behavior School Operating System", value: 15000 },
              { label: "Tools & Templates Library", value: 0 },
            ]}
            totalValue={15000}
            price={2997}
            paymentPlan="3 payments of $1,097"
            ctaLink="/signup"
            ctaLabel="SECURE YOUR SPOT NOW"
          />
        </div>
      </section>

      <div className="h-20 md:hidden"></div>
      <ExitIntentModal pageSource="transformation" />
      <EmailSignupPopup isOpen={showEmailPopup} onClose={() => setShowEmailPopup(false)} title="Waitlist" description="Cohort full." pageSource="transformation" />
    </div>
  );
}