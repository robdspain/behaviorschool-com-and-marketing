import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryCta?: { href: string; label: string };
  variant?: 'light' | 'dark';
};

export function Hero({
  className,
  eyebrow = "Leadership Excellence",
  title,
  highlight,
  subtitle,
  primaryCta = { href: "/subscribe", label: "Get Started Free" },
  variant = 'light',
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden",
        variant === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-white',
        className
      )}
    >
      {variant === 'light' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-20 blur-2xl" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-blue-500/20 blur-2xl" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {eyebrow ? (
                <Badge className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                  variant === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                )}>
                  <Zap className="w-4 h-4 mr-1" />
                  {eyebrow}
                </Badge>
              ) : null}
              <h1 className={cn(
                "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]",
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              )}>
                {title}{" "}
                {highlight ? (
                  <span className={cn(
                    "text-transparent bg-clip-text bg-gradient-to-r",
                    variant === 'dark' ? 'from-emerald-300 to-emerald-400' : 'from-emerald-600 to-emerald-500'
                  )}>{highlight}</span>
                ) : null}
              </h1>
              {subtitle ? (
                <p className={cn("text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl",
                  variant === 'dark' ? 'text-slate-300' : 'text-slate-600'
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
              <Card className={cn("shadow-2xl rounded-3xl border-0 overflow-hidden", variant === 'dark' ? 'bg-white/5 backdrop-blur' : 'bg-white')}>
                <CardContent className="p-8 lg:p-10">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold">BS</span>
                        </div>
                        <div>
                          <h3 className={cn("text-base sm:text-lg font-semibold", variant === 'dark' ? 'text-white' : 'text-slate-900')}>Leadership Dashboard</h3>
                          <p className={cn("text-xs sm:text-sm", variant === 'dark' ? 'text-slate-300' : 'text-slate-500')}>Real-time insights</p>
                        </div>
                      </div>
                      <Badge className={cn('rounded-full', variant === 'dark' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-green-100 text-green-800')}>Active</Badge>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Goal Achievement", value: "92%", color: "emerald" },
                        { label: "Stress Reduction", value: "85%", color: "blue" },
                        { label: "Team Performance", value: "96%", color: "purple" },
                      ].map((item) => (
                        <div key={item.label} className={cn("flex items-center justify-between p-4 rounded-xl", variant === 'dark' ? 'bg-white/5' : 'bg-slate-50')}>
                          <span className={cn("font-medium", variant === 'dark' ? 'text-white' : 'text-slate-900')}>{item.label}</span>
                          <span
                            className={cn(
                              "font-semibold",
                              item.color === "emerald" && "text-emerald-600",
                              item.color === "blue" && "text-blue-600",
                              item.color === "purple" && "text-purple-600"
                            )}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={cn("absolute -top-6 -right-6 w-24 h-24 rounded-2xl opacity-80 animate-pulse", variant === 'dark' ? 'bg-emerald-400/20' : 'bg-gradient-to-br from-yellow-200 to-yellow-100')} />
            <div className={cn("absolute -bottom-4 -left-4 w-20 h-20 rounded-xl opacity-60", variant === 'dark' ? 'bg-blue-400/20' : 'bg-gradient-to-br from-purple-200 to-purple-100')} />
          </div>
        </div>
      </div>
    </section>
  );
}


