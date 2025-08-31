"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export function ClientCTA() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsSignupOpen(true)}
        className="inline-flex items-center px-12 py-5 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
      >
        🔵 Join the Waitlist — Be the First to Know When We Launch
        <ArrowRight className="ml-3 h-6 w-6" />
      </button>
      
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join the Waitlist"
        description="Be the first to know when the IEP Goal Writer launches."
        pageSource="/iep-goals"
      />
    </>
  );
}
