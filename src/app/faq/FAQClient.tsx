"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "About the Transformation Program",
    items: [
      {
        question: "What is the School BCBA Transformation System?",
        answer: (
          <>
            The <Link href="/transformation-program" className="text-emerald-600 hover:text-emerald-700 underline">School BCBA Transformation System</Link> is our comprehensive training program designed specifically for school-based BCBAs. It combines evidence-based training, live coaching, practical implementation tools, and a supportive community to help you become confident and effective in your school-based practice.
          </>
        )
      },
      {
        question: "Who is the transformation program for?",
        answer: "The program is designed for school-based BCBAs who want to improve their practice, newly certified BCBAs transitioning into school settings, experienced BCBAs looking to refine their skills, and anyone feeling overwhelmed or stuck in their school BCBA role. Whether you're struggling with specific challenges or simply want to take your practice to the next level, this program can help."
      },
      {
        question: "What makes this program different from other BCBA training?",
        answer: "Unlike generic ABA training, our program focuses exclusively on the unique challenges of school-based practice. You'll get practical, ready-to-implement strategies for working within school systems, collaborating with educators, managing caseloads, writing effective IEPs, and balancing the demands of the school environment. Plus, you'll have direct access to coaching and a community of peers facing similar challenges."
      },
      {
        question: "What results can I expect from the program?",
        answer: "Participants typically report increased confidence in their role, more effective behavior interventions, improved relationships with school staff and families, better time management and organization, reduced stress and overwhelm, and a clearer sense of professional identity as a school BCBA. Many also report feeling less isolated and more supported in their practice."
      }
    ]
  },
  {
    title: "Program Details & Structure",
    items: [
      {
        question: "How long does the transformation program take?",
        answer: "The core program runs for several weeks with structured modules, live coaching sessions, and implementation activities. However, you'll continue to have access to resources, community support, and updated content beyond the initial program period to ensure long-term growth and success."
      },
      {
        question: "What's included in the program?",
        answer: (
          <>
            The program includes:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Structured curriculum with evidence-based strategies</li>
              <li>Live coaching and Q&A sessions</li>
              <li>Implementation tools and templates</li>
              <li>Private community access for networking and support</li>
              <li>Case study reviews and real-world applications</li>
              <li>Recorded trainings you can revisit anytime</li>
              <li>Continuing education credits (CEUs) where applicable</li>
            </ul>
          </>
        )
      },
      {
        question: "Is the program self-paced or scheduled?",
        answer: "It's a combination. You'll have scheduled live coaching sessions and a structured curriculum timeline to keep you on track. However, the recorded content and resources are available for you to review at your own pace, making it flexible for busy school schedules."
      },
      {
        question: "How much time do I need to commit each week?",
        answer: "Most participants dedicate 2-4 hours per week to the program, including live sessions, implementation activities, and engaging with the community. The program is designed to fit into a busy school schedule, and you can adjust your pace based on your availability."
      },
      {
        question: "Can I get CEU credits for the program?",
        answer: (
          <>
            Yes! Behavior School LLC is a <Link href="/bacb-ace-provider" className="text-emerald-600 hover:text-emerald-700 underline">BACB Authorized Continuing Education (ACE) Provider</Link> (Provider #OP-25-11420). Eligible program components offer BACB-approved CEU credits to help you maintain your BCBA certification.
          </>
        )
      }
    ]
  },
  {
    title: "Enrollment & Pricing",
    items: [
      {
        question: "How much does the transformation program cost?",
        answer: (
          <>
            Program pricing and payment options are available on our <Link href="/transformation-program" className="text-emerald-600 hover:text-emerald-700 underline">program page</Link>. We offer flexible payment plans to make the program accessible. This is an investment in your professional development that will pay dividends throughout your career.
          </>
        )
      },
      {
        question: "How do I enroll in the program?",
        answer: (
          <>
            You can apply through our <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 underline">application page</Link>. After submitting your application, we'll review it and schedule a brief call to ensure the program is the right fit for your needs and goals.
          </>
        )
      },
      {
        question: "Do you offer payment plans?",
        answer: "Yes! We offer flexible payment plans to make the program more accessible. You can choose the payment option that works best for your budget during the enrollment process."
      },
      {
        question: "Is there a money-back guarantee?",
        answer: "We stand behind the quality and value of our program. Details about our satisfaction guarantee and refund policy are provided during enrollment and outlined in our terms of service."
      },
      {
        question: "When does the next cohort start?",
        answer: (
          <>
            Enrollment availability and cohort start dates are listed on our <Link href="/transformation-program" className="text-emerald-600 hover:text-emerald-700 underline">program page</Link>. We typically run multiple cohorts throughout the year. If enrollment is currently closed, you can join our waitlist to be notified when the next cohort opens.
          </>
        )
      }
    ]
  },
  {
    title: "Support & Community",
    items: [
      {
        question: "Will I get personalized support?",
        answer: "Yes! The program includes live coaching sessions where you can ask questions, get feedback on specific cases, and receive personalized guidance. You'll also have access to our private community where you can connect with other school BCBAs and get support between sessions."
      },
      {
        question: "What if I can't attend a live session?",
        answer: "All live sessions are recorded and made available to participants. If you miss a session, you can watch the recording at your convenience. You can also submit questions in advance or through the community if you can't attend live."
      },
      {
        question: "Can I access the community after the program ends?",
        answer: "Yes! Program participants maintain access to the community and updated resources after the core program period. This ensures you have ongoing support as you continue to grow in your practice."
      }
    ]
  },
  {
    title: "Other Questions",
    items: [
      {
        question: "What free resources does Behavior School offer?",
        answer: (
          <>
            We offer many free tools and resources including:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><Link href="/free-bcba-mock-practice-test" className="text-emerald-600 hover:text-emerald-700 underline">Free BCBA Mock Exam (185 Questions)</Link></li>
              <li><Link href="/study" className="text-emerald-600 hover:text-emerald-700 underline">AI-Powered Study Platform</Link></li>
              <li><Link href="/iep-behavior-goals" className="text-emerald-600 hover:text-emerald-700 underline">IEP Behavior Goal Generator</Link></li>
              <li><Link href="/blog" className="text-emerald-600 hover:text-emerald-700 underline">Educational Blog Articles</Link></li>
              <li><Link href="/act-matrix" className="text-emerald-600 hover:text-emerald-700 underline">ACT Matrix Resources</Link></li>
            </ul>
          </>
        )
      },
      {
        question: "How can I learn more or get in touch?",
        answer: (
          <>
            You can reach us through our <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">contact page</Link>. We're happy to answer questions about the transformation program, discuss whether it's right for you, or provide more information about what's included.
          </>
        )
      },
      {
        question: "Do you offer other training or services?",
        answer: (
          <>
            Yes! In addition to the transformation program, we offer <Link href="/supervisors" className="text-emerald-600 hover:text-emerald-700 underline">supervision tools</Link>, <Link href="/bcba-exam-prep" className="text-emerald-600 hover:text-emerald-700 underline">BCBA exam prep resources</Link>, and various <Link href="/products" className="text-emerald-600 hover:text-emerald-700 underline">tools and training materials</Link> for school-based behavior analysts.
          </>
        )
      }
    ]
  }
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-700 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export function FAQClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-emerald-100">
            Find answers to common questions about Behavior School, BCBA certification, and our training programs
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-emerald-600 pl-4">
              {category.title}
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {category.items.map((item, itemIndex) => (
                <FAQAccordionItem key={itemIndex} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-16 bg-emerald-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
