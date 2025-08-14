"use client"

import Script from "next/script"
import React from "react"

export type GhostSignupProps = {
  site?: string
  title?: string
  description?: string
  icon?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  locale?: string
  className?: string
  style?: React.CSSProperties
}

export function GhostSignup({
  site = "https://behaviorschool.com/",
  title = "Behavior School",
  description = "We help overwhelmed BCBAs create structured behavior systems for student success",
  icon = "https://behaviorschool.com/content/images/size/w192h192/size/w256h256/2025/02/Behavior-School-Logo.png",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  buttonColor = "#dfbf7c",
  buttonTextColor = "#FFFFFF",
  locale = "en",
  className,
  style,
}: GhostSignupProps) {
  return (
    <div
      className={className}
      style={{ height: "40vmin", minHeight: 360, ...style }}
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
        data-icon={icon}
        data-site={site}
        data-locale={locale}
      />
    </div>
  )
}