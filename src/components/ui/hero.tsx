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
  variant?: 'light' | 'dark' | 'brand';
};

export function Hero({
  className,
  eyebrow = "Leadership Excellence",
  title,
  highlight,
  subtitle,
  primaryCta = { href: "https://study.behaviorschool.com", label: "Get Started" },
  variant = 'light',
}: HeroProps) {
  const isDark = variant === 'dark' || variant === 'brand';

  return (
    <section
      className={cn(
        "relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden selection:bg-emerald-500/30",
        variant === 'dark' ? 'bg-[#0A0A0A]' : variant === 'light' ? 'bg-[#FAFAFA]' : undefined,
        className
      )}
      style={variant === 'brand' ? { backgroundColor: '#0A1512' } : undefined}
    >
      {/* Dynamic Background Elements - 2026 Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            {/* Dark mode abstract gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-emerald-600/20 blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen animate-pulse duration-[10000ms] delay-1000" />

            {/* Neo-brutalist grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          </>
        ) : (
          <>
            {/* Light mode vibrant gradients with glassmorphism feel */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] rounded-full bg-emerald-300/40 blur-[100px] animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[70%] rounded-full bg-teal-300/30 blur-[120px] animate-pulse duration-[12000ms] delay-500" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full bg-blue-200/40 blur-[80px] animate-pulse duration-[10000ms] delay-1000" />

            {/* Subtle dot matrix */}
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </>
        )}
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
                      "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium tracking-wide border transition-all hover:scale-105 backdrop-blur-md",
                      isDark
                        ? 'bg-white/5 text-emerald-300 border-white/10 hover:bg-white/10'
                        : 'bg-white/60 text-emerald-700 border-emerald-200/50 shadow-sm hover:bg-white/80'
                    )}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {eyebrow}
                  </Badge>
                </div>
              )}

              <h1 className={cn(
                "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both",
                "text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold tracking-tight leading-[1.05]"
              )}>
                <span className={cn(
                  "block mb-2",
                  isDark ? 'text-white' : 'text-slate-900'
                )}>{title}</span>

                {highlight && (
                  <span className={cn(
                    "inline-block pb-2 text-transparent bg-clip-text bg-gradient-to-r",
                    isDark
                      ? 'from-emerald-400 via-teal-300 to-emerald-500 bg-[length:200%_auto] animate-gradient'
                      : 'from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] animate-gradient'
                  )}>
                    {highlight}
                  </span>
                )}
              </h1>

              {subtitle && (
                <p className={cn(
                  "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both",
                  "text-xl sm:text-2xl leading-relaxed max-w-2xl font-light",
                  isDark ? 'text-slate-300' : 'text-slate-600'
                )}>
                  {subtitle}
                </p>
              )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both flex flex-col sm:flex-row gap-5">
              <Button
                asChild
                size="lg"
                className={cn(
                  "h-16 w-full sm:w-auto px-10 text-lg font-semibold rounded-2xl transition-all duration-300 group overflow-hidden relative",
                  isDark
                    ? 'bg-white text-slate-900 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                    : 'bg-slate-900 text-white hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]'
                )}
              >
                <Link href={primaryCta.href}>
                  <span className="relative z-10 flex items-center">
                    {primaryCta.label}
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {/* Hover gradient effect inside button */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-500/20 to-teal-500/20" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Element - Glassmorphism Card */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both lg:ml-auto w-full max-w-[600px]">
            {/* Glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/30 to-blue-500/30 rounded-[2.5rem] blur-[40px] opacity-60" />

            <div className={cn(
              "relative z-10 rounded-[2rem] p-2 sm:p-4 backdrop-blur-xl border shadow-2xl overflow-hidden group",
              isDark
                ? 'bg-white/5 border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]'
                : 'bg-white/40 border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'
            )}>
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="School-based BCBAs collaborating"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
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
