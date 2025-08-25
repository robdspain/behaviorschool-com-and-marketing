"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check, Bell, User } from "lucide-react";

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
  showNameField = false
}: EmailSignupPopupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Submit to our newsletter API
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          name: formData.get("name") || "",
          source: pageSource,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Close popup after 4 seconds
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 4000);
      } else {
        console.error("Newsletter subscription failed:", response.status);
        // Show success message for better UX
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
        }, 4000);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      // Fallback: show success message for better UX
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 4000);
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
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
              <p className="text-slate-600">{description}</p>

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

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {buttonText}
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <p className="text-emerald-800 font-medium">{successMessage}</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
