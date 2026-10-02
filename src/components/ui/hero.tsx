"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

type HeroProps = {
  className?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  variant?: 'light' | 'dark' | 'brand';
};

export function Hero({
  className,
  eyebrow = "Leadership Excellence",
  title,
  highlight,
  subtitle,
  primaryCta = { href: "https://study.behaviorschool.com/free-practice/", label: "Get Started" },
  secondaryCta = { href: "https://study.behaviorschool.com/free-practice/", label: "Or try 9 questions first, no account" },
  variant = 'light',
}: HeroProps) {
  const isDark = variant === 'dark' || variant === 'brand';

  return (
    <section
      className={cn(
        "relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bs-on-dark",
        variant === 'dark' ? 'bg-[#0A0A0A]' : variant === 'light' ? 'bg-[var(--bs-cream)]' : undefined,
        className
      )}
      style={variant === 'brand' ? { backgroundColor: '#123628' } : undefined}
    >
      {/* Dynamic Background Elements - 2026 Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="space-y-10 z-10">
            <div className="space-y-6">
              {eyebrow && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                  <Badge
                    variant="outline"
                    className={cn(
                      "inline-flex items-center px-4 min-h-[44px] rounded-lg text-[14px] font-[600]",
                      variant === 'brand'
                        ? 'text-[#f4efe5] border border-[rgb(244,239,229,0.3)]'
                        : 'text-[#1f4d3f] border border-[#365548]'
                    )}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {eyebrow}
                  </Badge>
                </div>
              )}

              <h1 className={cn(
                "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both",
                "text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-[800] tracking-tight leading-[1.05]"
              )}>
                <span className={cn(
                  "block mb-2",
                  variant === 'brand' ? 'text-[#f4efe5]' : 'text-[var(--bs-ink)]'
                )}>{title}</span>

                {highlight && (
                  <span className={cn(
                    "inline-block pb-2",
                    variant === 'brand'
                      ? 'text-[#e4b63d]'
                      : 'text-[#1f4d3f]'
                  )}>
                    {highlight}
                  </span>
                )}
              </h1>

              {subtitle && (
                <p className={cn(
                  "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both",
                  "leading-relaxed max-w-2xl",
                  variant === 'brand' ? 'text-[#f4efe5] font-[400] text-[20px] sm:text-[22px]' : 'text-[var(--bs-secondary)] font-[400] text-[20px] sm:text-[22px]'
                )}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both flex flex-col items-start gap-4 mt-8">
              <Link 
                href={primaryCta.href}
                className={variant === 'brand' ? 'bs-btn-primary text-[18px]' : 'bs-btn-primary text-[18px]'}
              >
                {primaryCta.label}
              </Link>
              <Link 
                href={secondaryCta.href}
                className={cn("bs-link bs-padded", variant === 'brand' ? 'text-[var(--bs-paper)]' : '')}
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Visual Element - Glassmorphism Card */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both lg:ml-auto w-full max-w-[600px]">
            {/* Glow behind image */}
            

            <div className={cn(
              "relative z-10 rounded-xl overflow-hidden group",
              variant === 'brand'
                ? 'border border-[rgb(251,250,246,0.16)]'
                : 'border border-[var(--bs-hairline)]'
            )}>
              {/* Inner shine effect */}
              

              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="Three educators in a classroom smiling while they review a laptop"
                  width={1920}
                  height={1080}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 h-full w-full"
                  loading="eager"
                  priority={true}
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 600px"
                />

                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
