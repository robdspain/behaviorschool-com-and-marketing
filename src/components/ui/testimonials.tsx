"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  image: string;
};

type TestimonialsProps = {
  title?: string;
  items: Testimonial[];
  className?: string;
};

export function Testimonials({ title = "", items, className }: TestimonialsProps) {
  const first = items[0]?.id ?? "item-0";
  return (
    <section className={cn("py-20 lg:py-28 bg-gradient-to-b from-emerald-50/40 to-white", className)}>
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-10">
          {title.split(", ").length === 2 ? (
            <>
              {title.split(", ")[0]}, <br className="hidden sm:block" />
              {title.split(", ")[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </div>

      <div className="mx-auto max-w-4xl px-6 md:px-0">
        <Tabs defaultValue={first} className="hidden lg:flex flex-col justify-end min-h-[460px]">
          <div className="relative">
            {items.map((t) => (
              <TabsContent
                key={t.id}
                value={t.id}
                className="grid grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-2 gap-8 data-[state=inactive]:hidden"
              >
                <div className="mb-20 flex flex-col justify-end">
                    <div className="mb-6 relative w-[200px] h-[200px] 2xl:w-[260px] 2xl:h-[260px] rounded-t-[200px] rounded-b-lg overflow-hidden">
                      <Image src={t.image} alt={t.name} fill sizes="200px" className="object-cover" />
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-2xl xl:text-[28px] leading-[1.3] text-slate-900 italic mb-6">
                    “{t.quote}”
                  </p>
                  <p className="text-base font-semibold text-slate-900">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-sm font-medium text-slate-600">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </TabsContent>
            ))}

            <div className="absolute bottom-0 left-0 z-10 grid h-20 w-full grid-cols-2">
              <TabsList className="bg-transparent p-0 flex justify-start gap-3">
                {items.map((t) => (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className="data-[state=active]:opacity-100 opacity-40 p-0 bg-transparent shadow-none outline-none ring-0"
                    title={`${t.company ?? ""} ${t.name}`.trim()}
                  >
                    <div className="relative w-14 h-14 2xl:w-[72px] 2xl:h-[72px] rounded-t-[56px] rounded-b-[3px] overflow-hidden">
                      <Image src={t.image} alt={t.name} fill sizes="56px" className="object-cover" />
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </Tabs>

        {/* Mobile fallback */}
        <div className="lg:hidden">
          {items.slice(0, 1).map((t) => (
            <section key={t.id} className="mx-auto h-full max-w-[496px] px-6 md:px-0">
              <p className="text-2xl leading-[1.35] text-slate-900 italic mb-6">“{t.quote}”</p>
              <div className="flex flex-row items-center">
                <div className="mr-3 relative h-[94px] w-[74px] rounded-t-[74px] rounded-b-[2px] overflow-hidden">
                  <Image src={t.image} alt={t.name} fill sizes="74px" className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-base font-semibold text-slate-900">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-sm font-medium text-slate-600">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}


