"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Brain, Target, TrendingUp, BookOpen, Users, ChevronUp, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function BehaviorStudyToolsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "What are Behavior Study Tools?",
      answer: "Behavior Study Tools provide an AI-powered platform for BCBA exam preparation, offering unlimited practice questions, adaptive learning, and performance tracking to help you master concepts and pass your exam. The platform is designed specifically for behavior analysts who need efficient, science-based study methods that adapt to their learning pace and schedule."
    },
    {
      question: "How do these tools help me pass the BCBA exam?",
      answer: "Our platform uses an adaptive learning system that adjusts question difficulty based on your performance, provides clear explanations for every answer, and tracks your progress across all content domains, ensuring efficient and effective study. The AI continuously analyzes your strengths and weaknesses, focusing practice time on areas where you need the most improvement."
    },
    {
      question: "Are the practice questions aligned with the BACB Task List?",
      answer: "Yes, all AI-generated practice questions are aligned with the BACB® 6th Edition Task List, ensuring you're studying the most relevant and up-to-date content. Each question is tagged with specific Task List items, allowing you to target your study efforts to particular domains or skill areas."
    },
    {
      question: "Can I track my study progress?",
      answer: "Absolutely. The platform includes comprehensive performance tracking with daily, 7-day, and 30-day score graphs, allowing you to monitor your progress and identify areas for improvement at a glance. You can view detailed analytics by domain, subdomain, and individual Task List items to understand exactly where you stand in your preparation."
    },
    {
      question: "Do you offer a free BCBA practice exam?",
      answer: "Yes. Create a free account to try sample BCBA practice questions and a short mock test with full rationales. You'll see your accuracy by domain and can continue with adaptive drills anytime. The free version gives you a taste of the platform's capabilities without any commitment."
    },
    {
      question: "Are these BCBA mock exams similar to the real exam?",
      answer: "Our mock tests mirror the structure and difficulty of the BACB® exam, include scenario-based items with clear rationales, and emphasize Task List alignment so you build real test-taking fluency. The questions are designed to match the cognitive load and complexity you'll encounter on the actual examination."
    },
    {
      question: "How is this different from other BCBA study materials?",
      answer: "Unlike static flashcards or outdated test banks, Behavior Study Tools uses AI to generate fresh questions tailored to your learning needs. The platform combines adaptive learning technology with evidence-based study methods, providing personalized explanations and real-time progress tracking that traditional study materials can't offer."
    },
    {
      question: "What topics and domains are covered in the practice questions?",
      answer: "The platform covers all six domains of the BACB® 6th Edition Task List: Concepts and Principles, Measurement, Assessment, Experimental Design, Ethics, and Supervision. Within each domain, questions span all subdomains and individual Task List items, ensuring comprehensive coverage of the exam content."
    },
    {
      question: "How often are new practice questions added?",
      answer: "With AI-powered question generation, the platform creates fresh practice questions continuously. You'll never run out of new material or worry about memorizing answers from a limited question bank. Each study session can include completely new questions while maintaining alignment with the Task List."
    },
    {
      question: "Can I use Behavior Study Tools on mobile devices?",
      answer: "Yes, the platform is fully responsive and works seamlessly on desktop computers, tablets, and smartphones. You can study anywhere, anytime, and your progress syncs across all devices so you never lose your place."
    },
    {
      question: "What happens after I pass the BCBA exam?",
      answer: "After passing your BCBA exam, you can continue your professional development through our supervision tools and advanced training programs. The platform grows with your career, offering resources for ongoing competency development and specialization in school-based behavior analysis."
    },
    {
      question: "How much time should I spend studying with these tools daily?",
      answer: "Most users find success with 30-60 minutes of focused practice per day. The adaptive system is designed to maximize learning efficiency, so quality study time is more important than quantity. The platform will help you identify optimal study patterns based on your performance data."
    },
    {
      question: "Do the explanations help with understanding, not just memorization?",
      answer: "Absolutely. Each answer explanation is designed to build conceptual understanding rather than rote memorization. The rationales connect theoretical principles to practical applications, helping you develop the analytical thinking skills needed for both the exam and professional practice."
    },
    {
      question: "Is there customer support if I have technical issues?",
      answer: "Yes, we provide comprehensive technical support to ensure your study experience is smooth and uninterrupted. Our support team understands the unique needs of behavior analysts and can help resolve any platform-related questions quickly."
    },
    {
      question: "Can I see which specific Task List items I need to study more?",
      answer: "Yes, the platform provides detailed breakdowns of your performance by specific Task List items, domains, and subdomains. This granular analysis helps you identify exactly which concepts need more attention, making your study time more targeted and efficient."
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "Products", href: "/products" },
            { label: "Behavior Study Tools" }
          ]}
        />
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-20 blur-2xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                    Behavior Study Tools
                  </h1>
                </motion.div>
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-emerald-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  BCBA Practice Exams, Mock Tests, and Adaptive Study Tools
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl leading-relaxed text-slate-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Welcome to Behavior School&apos;s Study Tools, designed to make preparing for the BCBA® exam feel less overwhelming. Our system is built for busy behavior analysts who want a study system that&apos;s as focused and practical as the science we practice.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link 
                  href="https://study.behaviorschool.com" 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Try Free Practice Questions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10">
                <Image
                  src="/BehaviorStudyTools/Hero-BST-Home.webp"
                  alt="BCBA practice exams and mock tests with AI-powered rationales"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-100 opacity-80 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven learning science to create an effective BCBA exam preparation experience.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Brain,
                title: "Unlimited AI-Generated Practice Questions",
                description: "No more repeating the same test bank. Each question is fresh, aligned with the BACB® 6th Edition Task List, and instantly explained.",
                color: "emerald"
              },
              {
                icon: TrendingUp,
                title: "Adaptive Learning System",
                description: "The platform tracks your accuracy across subdomains, adjusts question difficulty, and helps you master concepts without over-practice.",
                color: "blue"
              },
              {
                icon: BookOpen,
                title: "Clear Explanations",
                description: "Every answer includes plain-language rationales, so you don't just memorize—you understand.",
                color: "purple"
              },
              {
                icon: Target,
                title: "Performance Tracking",
                description: "Daily, 7-day, and 30-day score graphs show your progress at a glance.",
                color: "orange"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-400 rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contextual CTA after features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience Smarter BCBA Prep?</h3>
              <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                Join others who are using this tool to prepare for the BCBA exam. Start with unlimited practice questions today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="https://study.behaviorschool.com" 
                  className="inline-flex items-center px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="/transformation-program" 
                  className="inline-flex items-center px-8 py-3 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors"
                >
                  Get Complete School BCBA Training
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Designed for Behavior Analysts Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                  Designed for Behavior Analysts
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Behavior Study Tools was created by school-based BCBAs who understand the realities of balancing work, family, and exam prep. The system emphasizes:
                </p>
                <ul className="space-y-4">
                  {[
                    "Efficiency over endless flashcards",
                    "Conceptual to applied skill progression", 
                    "Data-driven mastery, not guesswork"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-4 text-lg text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Study Dashboard</h3>
                    <p className="text-slate-600">Real-time progress tracking</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Questions Answered", value: "2,847", color: "emerald" },
                    { label: "Accuracy Rate", value: "78%", color: "blue" },
                    { label: "Study Streak", value: "12 days", color: "purple" },
                    { label: "Domains Mastered", value: "4/6", color: "orange" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-900">{item.label}</span>
                      <span className={`font-semibold text-${item.color}-600`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* More Than a Test Prep Platform Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              More Than a Test Prep Platform
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
              This is not just about passing an exam—it&apos;s about building fluency in the science of behavior. You&apos;ll learn to think like a behavior analyst, not just answer like one.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 mx-auto rounded-full"></div>
            
            {/* Contextual CTA after platform description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <p className="text-lg text-slate-600 mb-6">
                Ready to develop true behavioral fluency? After you pass your BCBA exam, continue building expertise with our comprehensive school-based training.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="https://study.behaviorschool.com" 
                  className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Start BCBA Prep Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link 
                  href="/supervisors" 
                  className="inline-flex items-center px-8 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Explore Supervision Tools
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It's Different From the Competition Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center">
              How It’s Different From the Competition
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed text-center">
              Most prep options fall into three camps:
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4">Flashcards</h3>
                <p className="text-slate-700">Quick but shallow; they don’t explain why an answer is correct, so learners memorize terms without mastering concepts.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4">Recycled Test Banks</h3>
                <p className="text-slate-700">Often outdated, poorly written, or overly simplistic, leaving huge gaps in readiness.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4">Expensive Review Modules</h3>
                <p className="text-slate-700">Long lectures and static question sets that don’t adapt to your strengths and weaknesses, so you waste time on material you already know.</p>
              </div>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed text-center">
              Behavior Study Tools is different. It combines the best of all worlds—efficient practice, clear explanations, adaptive learning, and real-time data tracking. Instead of passive studying, it actively teaches you how to think like a BCBA. That’s the innovation future behavior analysts deserve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Here are some common questions about Behavior Study Tools.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  aria-expanded={activeFaq === index}
                >
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {activeFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your BCBA Journey?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join behavior analysts using Behavior Study Tools to prepare for the BCBA exam and advance their careers.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="https://study.behaviorschool.com" 
                className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 hover:bg-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Explore Behavior Study Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <p className="text-emerald-200 text-sm">
              behaviorstudytools.com
            </p>
          </motion.div>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
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
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Behavior Study Tools - Smarter Studying for Future BCBAs",
          url: `${SITE_URL}/behavior-study-tools`,
          description: "AI-powered BCBA exam preparation platform with unlimited practice questions, adaptive learning, and performance tracking designed for behavior analysts.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
        } as const;
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: `${SITE_URL}/products`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Behavior Study Tools",
              item: `${SITE_URL}/behavior-study-tools`,
            },
          ],
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}
