import Link from "next/link";
import Image from "next/image";
import { Twitter, Code, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100">
      {/* Upper Section - Social Media and Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link 
            href="https://twitter.com/behaviorschool" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Follow Behavior School on Twitter"
          >
            <Twitter size={24} />
          </Link>
          <Link 
            href="https://github.com/behaviorschool" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="View Behavior School on GitHub"
          >
            <Code size={24} />
          </Link>
          <Link 
            href="https://youtube.com/@behaviorschool" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Subscribe to Behavior School on YouTube"
          >
            <Youtube size={24} />
          </Link>
          <Link 
            href="https://instagram.com/behaviorschool" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Follow Behavior School on Instagram"
          >
            <Instagram size={24} />
          </Link>
          <Link 
            href="https://facebook.com/behaviorschool" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Like Behavior School on Facebook"
          >
            <Facebook size={24} />
          </Link>
          <Link 
            href="https://linkedin.com/company/behaviorschool" 
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
            <Image
              src="/BACB-ACE/BACB_ACE-Logo-1.jpg"
              alt="BACB ACE Provider Logo"
              width={100}
              height={100}
            />
            <div>
              <p className="text-gray-600 text-sm font-bold">
                Behavior School LLC
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
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
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
