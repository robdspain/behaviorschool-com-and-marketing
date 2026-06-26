import Link from "next/link";
import Image from "next/image";
import { Twitter, Code, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-gray-100">
      {/* Newsletter Signup Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NewsletterSignup />
        </div>
      </div>

      {/* Upper Section - Social Media and Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="https://x.com/behavior_school"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Follow Behavior School on X"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="https://bsky.app/profile/behaviorschool.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Follow Behavior School on Bluesky"
          >
            <Image src="/icons/bluesky.svg" alt="Bluesky" width={24} height={24} />
          </Link>
          <Link
            href="https://www.youtube.com/@BehaviorSchool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Subscribe to Behavior School on YouTube"
          >
            <Youtube size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/behaviorschool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Follow Behavior School on Instagram"
          >
            <Instagram size={24} />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61564836345571"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Like Behavior School on Facebook"
          >
            <Facebook size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/behavior-school/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Connect with Behavior School on LinkedIn"
          >
            <Linkedin size={24} />
          </Link>
        </div>

        {/* Copyright Information */}
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm">
            © 2026 Behavior School. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Behavior School LLC builds BehaviorSchool.com and BehaviorStudyTools.com.
          </p>
        </div>

        {/* ACE Provider Information */}
        <div className="mt-6 text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/bacb-ace-provider" aria-label="BACB ACE Provider Information">
              <Image
                src="/BACB-ACE/BACB_ACE-Logo-New.png"
                alt="BACB Authorized Continuing Education Provider Logo - Behavior School"
                width={100}
                height={100}
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
            <div>
              <p className="text-sm font-bold text-gray-600">
                <Link href="/bacb-ace-provider" className="transition-colors hover:text-emerald-700">
                  BACB ACE Provider: Behavior School LLC
                </Link>
              </p>
              <p className="text-sm text-gray-600">ACE Provider #: OP-26-12729</p>
              <p className="text-sm text-gray-600">Renewal date: June 30, 2027</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Navigation Links */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-center text-sm">
            <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
              Tools
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/bcba-exam-prep" className="text-gray-600 hover:text-gray-900 transition-colors">
              BCBA Exam Prep
            </Link>
            <Link href="/ai-for-behavior-analysts" className="text-gray-600 hover:text-gray-900 transition-colors">
              AI for Behavior Analysts
            </Link>
            <Link href="/bcba-practice-exam" className="text-gray-600 hover:text-gray-900 transition-colors">
              BCBA Practice Exam
            </Link>
            <Link href="/bcba-test-questions" className="text-gray-600 hover:text-gray-900 transition-colors">
              BCBA Test Questions
            </Link>
            <Link href="/free-bcba-mock-exam" className="text-gray-600 hover:text-gray-900 transition-colors">
              Free BCBA Mock Exam
            </Link>
            <Link href="/school-bcba/interview-questions" className="text-gray-600 hover:text-gray-900 transition-colors">
              School BCBA Interview Questions
            </Link>
            <Link href="/functional-behavior-assessment-guide" className="text-gray-600 hover:text-gray-900 transition-colors">
              FBA Guide
            </Link>
            <Link href="/behavior-intervention-plan-examples" className="text-gray-600 hover:text-gray-900 transition-colors">
              BIP Examples
            </Link>
            <Link href="/iep-behavior-goal-examples" className="text-gray-600 hover:text-gray-900 transition-colors">
              IEP Goal Examples
            </Link>
            <Link
              href="https://study.behaviorschool.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
            <Link href="/ferpa-compliance" className="text-gray-600 hover:text-gray-900 transition-colors">
              FERPA Compliance
            </Link>
            <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="https://behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Behavior School
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
