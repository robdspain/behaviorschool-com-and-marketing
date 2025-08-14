"use client"

import Script from "next/script"
import { cn } from "@/lib/utils"

interface GhostNewsletterSignupProps {
  className?: string
  title?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  compact?: boolean
  showIcon?: boolean
}

export default function GhostNewsletterSignup({
  className,
  title = "Join Our Newsletter",
  description = "Get exclusive insights, actionable strategies, and the support you need to lead with confidence and create lasting change.",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  buttonColor = "#dfbf7c",
  buttonTextColor = "#FFFFFF",
  compact = false,
  showIcon = true
}: GhostNewsletterSignupProps) {
  const height = compact ? "300px" : "400px"
  const minHeight = compact ? 300 : 360

  return (
    <div className={cn("w-full", className)}>
      <div 
        style={{ height, minHeight }} 
        className="w-full max-w-md mx-auto"
      >
        <Script
          src="https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js"
          async
          data-background-color={backgroundColor}
          data-text-color={textColor}
          data-button-color={buttonColor}
          data-button-text-color={buttonTextColor}
          data-title={title}
          data-description={description}
          data-icon={showIcon ? "https://behaviorschool.com/content/images/size/w192h192/size/w256h256/2025/02/Behavior-School-Logo.png" : ""}
          data-site="https://behaviorschool.com/"
          data-locale="en"
        />
      </div>
    </div>
  )
}