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
            © 2025 Behavior School. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            BehaviorStudyTools.com is a product of Behavior School LLC
          </p>
        </div>

        {/* ACE Provider Information */}
        <div className="text-center mt-4">
          <div className="flex justify-center items-center space-x-4">
            <Link
              href="/bacb-ace-provider"
              aria-label="BACB ACE Provider Information"
            >
              <Image
                src="/BACB-ACE/BACB_ACE-Logo-1.webp"
                alt="BACB ACE Provider Logo - Behavior School"
                width={100}
                height={100}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
            <div>
              <p className="text-gray-600 text-sm font-bold">
                <Link href="/bacb-ace-provider" className="hover:text-emerald-700 transition-colors">
                  Behavior School LLC
                </Link>
              </p>
              <p className="text-gray-600 text-sm">
                ACE Provider Number: OP-25-11420
              </p>
              <p className="text-gray-600 text-sm">
                Provider: Robert Spain
              </p>
              <p className="text-gray-600 text-sm">
                Valid: 01/30/25 - 01/31/26
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Navigation Links */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center space-x-6 text-sm">
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
            <Link
              href="https://study.behaviorschool.com/free-bcba-practice-exam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              BCBA Practice Exams (Free)
            </Link>
            <Link
              href="https://study.behaviorschool.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
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
