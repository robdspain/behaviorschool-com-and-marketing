"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check, Bell, User } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface EmailSignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  pageSource: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  showNameField?: boolean; // New prop to control name field visibility
  isDownloadFlow?: boolean; // When true, show download-specific disclaimer/messages
  onSuccess?: () => void; // New prop for success callback
  id?: string; // Accessibility: id for aria-controls
}

export function EmailSignupPopup({
  isOpen,
  onClose,
  title,
  description,
  pageSource,
  buttonText = "Subscribe",
  successMessage = "Thanks for subscribing!",
  className = "",
  showNameField = false,
  isDownloadFlow = false,
  onSuccess, // Destructure onSuccess prop
  id = "email-signup-popup"
}: EmailSignupPopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localSuccessMessage, setLocalSuccessMessage] = useState(successMessage);
  const { trackEmailSignup, trackFormSubmission, trackButtonClick } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    
    try {
      // Track form submission start
      trackFormSubmission('email_signup_popup', true, {
        pageSource,
        showNameField,
        isDownloadFlow
      });

      // Submit to our newsletter API
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || "",
          source: pageSource,
        }),
      });

      if (response.ok || response.status === 409) {
        console.log('EmailSignupPopup: API response OK');
        // Track successful email signup
        trackEmailSignup('newsletter', email, {
          name,
          pageSource,
          isDownloadFlow
        });
        
        // Customize success message for existing subscribers
        if (response.status === 409) {
          setLocalSuccessMessage("You're already subscribed — taking you to the generator...");
        } else {
          setLocalSuccessMessage(successMessage);
        }

        setIsSubmitted(true);
        if (onSuccess) {
          console.log('EmailSignupPopup: Calling onSuccess');
          // Call onSuccess callback immediately (handles redirect)
          onSuccess();
          // Give the redirect a moment to initiate, then close popup
          setTimeout(() => {
            onClose();
            setIsSubmitted(false);
          }, 500); // Reduced from 2000ms to 500ms for faster redirect
        } else {
          // Close popup after 3 seconds if no custom success handler
          setTimeout(() => {
            onClose();
            setIsSubmitted(false);
          }, 3000);
        }
      } else {
        console.error("Newsletter subscription failed:", response.status);
        trackFormSubmission('email_signup_popup', false, {
          pageSource,
          error: 'api_failed',
          status: response.status
        });
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      trackFormSubmission('email_signup_popup', false, {
        pageSource,
        error: 'network_error'
      });
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 3000);
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl ${className}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-desc`}
            id={id}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close sign up dialog"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <h3 id={`${id}-title`} className="text-2xl font-bold text-slate-900">{title}</h3>
              <p id={`${id}-desc`} className="text-slate-600">{description}</p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {showNameField && (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  {isDownloadFlow && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-slate-600 text-left leading-relaxed">
                        By downloading this resource, you agree to receive helpful emails with behavior analysis tips, study resources, and updates from Behavior School. You can unsubscribe at any time.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    onClick={() => trackButtonClick('email_signup_submit', 'popup_form', {
                      pageSource,
                      buttonText,
                      isDownloadFlow
                    })}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-800 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {buttonText}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      <p className="text-emerald-800 font-medium">{localSuccessMessage}</p>
                    </div>
                    {isDownloadFlow && (
                      <p className="text-emerald-700 text-sm text-center">
                        Check your downloads folder or email for your study guide.
                      </p>
                    )}
                  </div>
                  
                </div>
              )}

              <p className="text-xs text-slate-500">
                We respect your privacy and will never share your information.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
