"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { faqData, type FAQItem } from "./faq-data";

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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white pt-28 pb-16">
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
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
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
