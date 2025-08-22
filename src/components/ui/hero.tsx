import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        "relative pt-8 pb-12 lg:pt-12 lg:pb-16 overflow-hidden",
        variant === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : variant === 'light' ? 'bg-white' : undefined,
        className
      )}
      style={variant === 'brand' ? { backgroundColor: '#1F4D3F' } : undefined}
    >
      {variant === 'light' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-20 blur-2xl" />
        </>
      ) : variant === 'dark' ? (
        <>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-blue-500/20 blur-2xl" />
        </>
      ) : null}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {eyebrow ? (
                <Badge className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  isDark ? 'bg-white/10 text-white border-white/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                )}>
                  <Zap className="w-4 h-4 mr-1" />
                  {eyebrow}
                </Badge>
              ) : null}
              <h1 className={cn(
                "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]",
                isDark ? 'text-white' : 'text-slate-900'
              )}>
                {title}{" "}
                {highlight ? (
                  <span className={cn(
                    "text-transparent bg-clip-text bg-gradient-to-r",
                    isDark ? 'from-emerald-300 to-emerald-400' : 'from-emerald-600 to-emerald-500'
                  )}>{highlight}</span>
                ) : null}
              </h1>
              {subtitle ? (
                <p className={cn("text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl",
                  isDark ? 'text-slate-300' : 'text-slate-600'
                )}>{subtitle}</p>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className={cn(
                  "h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl",
                  variant === 'dark'
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white'
                )}
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="/Hero/Hero-group1.webp"
                alt="Behavior School team collaboration"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>

            <div className={cn("absolute -top-6 -right-6 w-24 h-24 rounded-2xl opacity-80 animate-pulse", variant === 'dark' ? 'bg-emerald-400/20' : 'bg-gradient-to-br from-yellow-200 to-yellow-100')} />
            <div className={cn("absolute -bottom-4 -left-4 w-20 h-20 rounded-xl opacity-60", variant === 'dark' ? 'bg-blue-400/20' : 'bg-gradient-to-br from-purple-200 to-purple-100')} />
          </div>
        </div>
      </div>
    </section>
  );
}


