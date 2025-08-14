"use client"

import Script from "next/script"
import React from "react"

interface GhostSignupEmbedProps {
  site?: string
  title?: string
  description?: string
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  icon?: string
  locale?: string
  heightVmin?: number
  minHeightPx?: number
  className?: string
}

export function GhostSignupEmbed({
  site = "https://behaviorschool.com/",
  title = "Behavior School",
  description = "We help overwhelmed BCBAs create structured behavior systems for student success",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  buttonColor = "#dfbf7c",
  buttonTextColor = "#FFFFFF",
  icon = "https://behaviorschool.com/content/images/size/w192h192/size/w256h256/2025/02/Behavior-School-Logo.png",
  locale = "en",
  heightVmin = 40,
  minHeightPx = 360,
  className,
}: GhostSignupEmbedProps) {
  return (
    <div style={{ height: `${heightVmin}vmin`, minHeight: minHeightPx }} className={className}>
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