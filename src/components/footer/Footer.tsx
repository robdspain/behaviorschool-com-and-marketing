import Link from "next/link";
import Image from "next/image";
import { Twitter, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";
import { FooterNewsletterSignup } from "./FooterNewsletterSignup";

export function Footer() {
  return (
    <footer className="bg-gray-100">
      <FooterNewsletterSignup />

      {/* Upper Section - Social Media and Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="https://x.com/behavior_school"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
            aria-label="Follow Behavior School on X"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="https://bsky.app/profile/behaviorschool.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
            aria-label="Follow Behavior School on Bluesky"
          >
            <Image src="/icons/bluesky.svg" alt="Bluesky" width={24} height={24} />
          </Link>
          <Link
            href="https://www.youtube.com/@BehaviorSchool"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
            aria-label="Subscribe to Behavior School on YouTube"
          >
            <Youtube size={24} />
          </Link>
          <Link
            href="https://www.instagram.com/behaviorschool"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
            aria-label="Follow Behavior School on Instagram"
          >
            <Instagram size={24} />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61564836345571"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
            aria-label="Like Behavior School on Facebook"
          >
            <Facebook size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/company/behavior-school/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#365548] transition-colors hover:text-[#171f1d]"
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
            <Link href="/products" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Tools
            </Link>
            <Link href="/free-tools" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Free School Behavior Tools
            </Link>
            <Link href="/resources" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Resources
            </Link>
            <Link href="/ceus" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA CEUs
            </Link>
            <Link href="/about" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              About
            </Link>
            <Link href="/faq" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              FAQ
            </Link>
            <Link href="https://study.behaviorschool.com/free-practice/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA Exam Prep
            </Link>
            <Link href="https://study.behaviorschool.com/free-practice/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Free BCBA Practice Exam
            </Link>
            <Link href="/bcba-readiness-quiz" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA Readiness Check
            </Link>
            <Link href="https://study.behaviorschool.com/free-practice/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA 6th Edition Questions
            </Link>
            <Link href="/bcba-exam-weak-areas" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA Weak Areas
            </Link>
            <Link href="/ai-for-behavior-analysts" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              AI for Behavior Analysts
            </Link>
            <Link href="https://study.behaviorschool.com/free-mock-exam/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA Practice Exam
            </Link>
            <Link href="https://study.behaviorschool.com/free-practice/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BCBA Test Questions
            </Link>
            <Link href="https://study.behaviorschool.com/free-mock-exam/" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Free BCBA Mock Exam
            </Link>
            <Link href="/school-bcba/interview-questions" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              School BCBA Interview Questions
            </Link>
            <Link href="/functional-behavior-assessment-guide" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              FBA Guide
            </Link>
            <Link href="/behavior-intervention-plan-examples" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              BIP Examples
            </Link>
            <Link href="/iep-behavior-goal-examples" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              IEP Goal Examples
            </Link>
            <Link
              href="https://study.behaviorschool.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]"
            >
              Contact Us
            </Link>
            <Link href="/ferpa-compliance" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              FERPA Compliance
            </Link>
            <Link href="/privacy" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Terms of Service
            </Link>
            <Link
              href="https://behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]"
            >
              Behavior School
            </Link>
            <Link href="/blog" className="inline-flex min-h-11 items-center text-[#365548] transition-colors hover:text-[#171f1d]">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
