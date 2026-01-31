"use client";

import { useEffect, useState } from "react";
import { EmailSignupPopup } from "./email-signup-popup";

interface TimeDelayPopupProps {
  title?: string;
  description?: string;
  pageSource: string;
  buttonText?: string;
  successMessage?: string;
  delay?: number; // Delay in milliseconds before showing popup
  showOnMobile?: boolean;
}

export function TimeDelayPopup({
  title = "Join 5,000+ School BCBAs Getting Weekly Tips",
  description = "Get evidence-based strategies, IEP tools, and behavior support ideas delivered every week. Free resources to help you work smarter, not harder.",
  pageSource,
  buttonText = "Subscribe to Weekly Tips",
  successMessage = "Thanks for subscribing! Check your email.",
  delay = 10000, // Default 10 seconds
  showOnMobile = true,
}: TimeDelayPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this popup
    if (sessionStorage.getItem("time_delay_popup_dismissed")) {
      setHasShown(true);
      return;
    }

    // Set timer to show popup after delay
    const timer = setTimeout(() => {
      if (!hasShown && !sessionStorage.getItem("time_delay_popup_dismissed")) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, delay);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [hasShown, delay]);

  const handleClose = () => {
    setIsOpen(false);
    // Set session storage so popup doesn't show again this session
    sessionStorage.setItem("time_delay_popup_dismissed", "true");
  };

  return (
    <EmailSignupPopup
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
      pageSource={`${pageSource}_time_delay`}
      buttonText={buttonText}
      successMessage={successMessage}
      showNameField={false} // Can be customized
      isDownloadFlow={false} // General newsletter signup
    />
  );
}
