"use client";

import { useEffect, useState } from "react";
import { EmailSignupPopup } from "./email-signup-popup";

interface ExitIntentModalProps {
  title?: string;
  description?: string;
  pageSource: string;
  buttonText?: string;
  successMessage?: string;
  delay?: number;
  showOnMobile?: boolean;
}

export function ExitIntentModal({
  title = "Wait! Get the 5 Levels of IEP Goals Guide",
  description = "Learn how to write measurable, high-impact IEP goals with our free 5-level framework used by school-based BCBAs.",
  pageSource,
  buttonText = "Get Free IEP Guide",
  successMessage = "Check your email for the IEP Guide!",
  delay = 15000,
  showOnMobile = true,
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("exit_intent_shown")) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    let timer: NodeJS.Timeout;
    if (showOnMobile) {
      timer = setTimeout(() => {
        if (!hasShown && !sessionStorage.getItem("exit_intent_shown")) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem("exit_intent_shown", "true");
        }
      }, delay);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timer) clearTimeout(timer);
    };
  }, [hasShown, delay, showOnMobile]);

  return (
    <EmailSignupPopup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={title}
      description={description}
      pageSource={`${pageSource}_exit_intent`}
      buttonText={buttonText}
      successMessage={successMessage}
      showNameField={true}
      isDownloadFlow={true}
    />
  );
}
