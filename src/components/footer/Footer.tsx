import Link from "next/link";
import Image from "next/image";
import { Twitter, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";
import { FooterNewsletterSignup } from "./FooterNewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-[var(--bs-cream)] border-t border-[var(--bs-hairline)]">
      <FooterNewsletterSignup />

      {/* Upper Section - Social Media and Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Social Media Icons */}
        <div className="flex justify-center flex-wrap gap-4 mb-4">
          <Link
            href="https://x.com/behavior_school"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Follow Behavior School on X"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="none"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
          </Link>
          <Link
            href="https://bsky.app/profile/behaviorschool.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Follow Behavior School on Bluesky"
          >
            <svg viewBox="0 0 320 286" width="24" height="24" fill="currentColor">
              <path d="M69.364 19.146c36.687 27.806 76.147 84.186 90.636 114.439 14.489-30.253 53.948-86.633 90.636-114.439 25.105-19.025 69.364-32.909 69.364 25.048 0 16.59-3.238 67.925-5.918 84.814-5.69 35.86-35.102 43.197-62.898 39.813-29.351-3.574-55.836-15.035-77.838-23.77-5.011-1.99-9.988-3.958-14.779-5.61-4.791 1.652-9.768 3.62-14.779 5.61-22.002 8.735-48.487 20.196-77.838 23.77-27.796 3.384-57.208-3.953-62.898-39.813-2.68-16.889-5.918-68.224-5.918-84.814 0-57.957 44.259-44.073 69.364-25.048z" />
            </svg>
          </Link>
          <Link
            href="https://www.youtube.com/@BehaviorSchool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Subscribe to Behavior School on YouTube"
          >
            <Youtube size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/behaviorschool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Follow Behavior School on Instagram"
          >
            <Instagram size={24} />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61564836345571"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Like Behavior School on Facebook"
          >
            <Facebook size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/behavior-school/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Connect with Behavior School on LinkedIn"
          >
            <Linkedin size={24} />
          </Link>
        </div>

        {/* Copyright Information */}
        <div className="text-center mb-4">
          <p className="text-[#365548] text-sm">
            © 2026 Behavior School. All rights reserved.
          </p>
          <p className="text-[#365548] text-sm mt-1">
            Behavior School LLC builds BehaviorSchool.com and BehaviorStudyTools.com.
          </p>
        </div>

        {/* ACE Provider Information */}
        <div className="mt-6 text-center">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/bacb-ace-provider" aria-label="BACB ACE Provider Information">
              <Image
                src="/BACB-ACE/BACB_ACE-Logo-New.png"
                alt="BACB Authorized Continuing Education Provider logo"
                width={100}
                height={100}
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
            <div>
              <p className="text-sm font-bold text-[#365548]">
                <Link href="/bacb-ace-provider" className="inline-flex min-h-[44px] items-center transition-colors hover:text-[var(--bs-ink)] hover:underline">
                  BACB ACE Provider: Behavior School LLC
                </Link>
              </p>
              <p className="text-sm text-[#365548]">ACE Provider #: OP-26-12729</p>
              <p className="text-sm text-[#365548]">Renewal date: June 30, 2027</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Navigation Links */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-center text-sm">
            <Link href="/products" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Tools
            </Link>
            <Link href="/free-tools" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Free School Behavior Tools
            </Link>
            <Link href="/resources" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Resources
            </Link>
            <Link href="/ceus" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              BCBA CEUs
            </Link>
            <Link href="/about" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              About
            </Link>
            <Link href="/faq" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              FAQ
            </Link>
            <Link href="https://behaviorstudytools.com/" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Behavior Study Tools: BCBA exam prep app
            </Link>
            <Link href="https://study.behaviorschool.com/free-practice/" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Free 9-question BCBA practice check
            </Link>
            <Link href="/bcba-readiness-quiz" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              BCBA Readiness Check
            </Link>
            <Link href="/bcba-exam-weak-areas" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              BCBA Weak Areas
            </Link>
            <Link href="/ai-for-behavior-analysts" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              AI for Behavior Analysts
            </Link>
            <Link href="https://study.behaviorschool.com/free-mock-exam/" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Free 185-question BCBA mock exam
            </Link>
            <Link href="/school-bcba/interview-questions" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              School BCBA Interview Questions
            </Link>
            <Link href="/functional-behavior-assessment-guide" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              FBA Guide
            </Link>
            <Link href="/behavior-intervention-plan-examples" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              BIP Examples
            </Link>
            <Link href="/iep-behavior-goal-examples" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              IEP Goal Examples
            </Link>
            <Link
              href="https://study.behaviorschool.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            >
              Contact Us
            </Link>
            <Link href="/ferpa-compliance" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              FERPA Compliance
            </Link>
            <Link href="/privacy" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Terms of Service
            </Link>
            <Link
              href="https://behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
            >
              Behavior School
            </Link>
            <Link href="/blog" className="text-[#365548] hover:text-[var(--bs-ink)] hover:underline transition-colors inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
