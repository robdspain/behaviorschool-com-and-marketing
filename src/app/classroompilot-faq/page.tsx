"use client";

import { motion } from "framer-motion";
import { HelpCircle, Target, BarChart3, Shield, Users } from "lucide-react";

export default function ClassroomPilotFAQ() {
  const faqs = [
    {
      icon: HelpCircle,
      question: "What is the best IEP goal tracking software for teachers?",
      answer: "ClassroomPilot helps special education teachers track IEP goals, monitor student progress, and generate reports — all in a single, user-friendly platform."
    },
    {
      icon: BarChart3,
      question: "Can ClassroomPilot help with IEP progress monitoring?",
      answer: "Yes. The platform lets you log progress in real time, view trends, and create parent- and admin-friendly reports instantly."
    },
    {
      icon: Shield,
      question: "Does ClassroomPilot work for tracking accommodations?",
      answer: "Absolutely. ClassroomPilot includes tools for documenting accommodations and modifications, ensuring IDEA compliance and easy reporting."
    },
    {
      icon: Users,
      question: "Can ClassroomPilot improve collaboration with paras and service providers?",
      answer: "Yes. You can share lesson plans, track shared student progress, and communicate updates with paraprofessionals and service providers securely."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-purple-300/15 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-24 pb-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Target className="h-4 w-4" />
            ClassroomPilot
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about ClassroomPilot's IEP tracking and special education management tools
          </p>
        </motion.div>
      </section>

      {/* FAQ Cards */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-24">
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-200/70 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 text-emerald-700 group-hover:scale-110 transition-transform">
                <faq.icon className="h-6 w-6" />
              </div>
              
              {/* Question */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {faq.question}
              </h3>
              
              {/* Answer */}
              <p className="text-slate-600 leading-relaxed">
                {faq.answer}
              </p>

              {/* Hover gradient effect */}
              <div 
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                style={{ 
                  background: "radial-gradient(120% 60% at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)" 
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Questions CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex flex-col items-center rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 p-8 ring-1 ring-emerald-200/50">
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-slate-600 mb-6 max-w-md">
              Our team is here to help you get the most out of ClassroomPilot for your special education needs.
            </p>
            <div className="flex gap-4">
              <a 
                href="/contact" 
                className="inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Contact Support
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
                </svg>
              </a>
              <a 
                href="https://classroompilot.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-emerald-700 font-medium ring-1 ring-emerald-200 hover:bg-emerald-50 transition-colors"
              >
                Visit ClassroomPilot
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}