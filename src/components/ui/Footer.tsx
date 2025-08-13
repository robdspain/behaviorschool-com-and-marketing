// @ts-nocheck
import React from 'react';
import Link from 'next/link';
import { Twitter, Youtube, Instagram, Facebook, Linkedin, Code } from 'lucide-react';

const socialLinks = [
  { name: 'X', href: 'https://x.com/behavior_school', icon: Twitter },
  { name: 'Bluesky', href: 'https://bsky.app/profile/behaviorschool.bsky.social', icon: Code }, // Placeholder icon
  { name: 'Youtube', href: 'https://www.youtube.com/@BehaviorSchool', icon: Youtube },
  { name: 'Instagram', href: 'https://www.instagram.com/behaviorschool', icon: Instagram },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61564836345571', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/behavior-school/', icon: Linkedin },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl text-center text-gray-700">
        <div className="flex justify-center gap-6 mb-6">
          {socialLinks.map((item) => (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-gray-700">&copy; {new Date().getFullYear()} Behavior School. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-600">
          BehaviorStudyTools.com is a product of Behavior School LLC
        </p>
        <div className="mt-4 space-x-6">
          <a href="https://study.behaviorschool.com/faq" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">FAQ</a>
          <a href="https://study.behaviorschool.com/contact" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">Contact Us</a>
          <a href="https://study.behaviorschool.com/privacy-policy" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">Privacy Policy</a>
          <a href="https://study.behaviorschool.com/terms-of-service" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">Terms of Service</a>
          <a href="https://behaviorschool.com" target="_blank" rel="noopener noreferrer" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">Behavior School</a>
          <Link href="/blog" className="hover:text-quiz-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 rounded-md">Blog</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;