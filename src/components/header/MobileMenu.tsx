"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { menuSections } from "./config";
import { SHOW_COHORT_BAND } from "@/lib/feature-flags";
import { Button } from "@/components/ui/button";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  openKey: string | null;
  onToggleKey: (key: string) => void;
};

export function MobileMenu({ isOpen, onClose, openKey, onToggleKey }: Props) {
  if (!isOpen) return null;
  return (
    <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="px-2 py-3 space-y-1 sm:px-3">
        {menuSections.map((section) => {
          const key = section.label.toLowerCase();
          const hasChildren = !!section.children?.length;
          if (hasChildren) {
            const expanded = openKey === key;
            return (
              <div key={key}>
                <button
                  className="w-full flex items-center justify-between px-3 min-h-[44px] text-base font-medium text-[#171f1d] hover:text-[#1f4d3f] hover:underline"
                  onClick={() => onToggleKey(key)}
                  aria-expanded={expanded}
                >
                  <span>{section.label}</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded && (
                  <div className="pl-6 pr-3 pb-2 space-y-1">
                    {section.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 min-h-[44px] py-2 flex w-full items-center text-[#171f1d] font-medium hover:text-[#1f4d3f] hover:underline  rounded-md"
                        onClick={onClose}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noreferrer noopener" : undefined}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={key}
              href={section.href ?? "#"}
              className="block px-3 min-h-[44px] py-2 flex w-full items-center text-lg font-medium text-[#171f1d] font-medium hover:text-[#1f4d3f] hover:underline  rounded-md"
              onClick={onClose}
              target={section.href?.startsWith("http") ? "_blank" : undefined}
              rel={section.href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              {section.label}
            </Link>
          );
        })}
        <div className="px-3 pt-4 pb-2 space-y-3 flex flex-col">
          {SHOW_COHORT_BAND && (
          <Link 
            href="/transformation-program"
            className="bs-btn-secondary w-full"
            onClick={onClose}
          >
            See the January cohort
          </Link>
          )}
          <Link
            href="https://study.behaviorschool.com/free-mock-exam/"
            className="bs-btn-primary w-full"
            onClick={onClose}
          >
            Take the free BCBA mock exam
          </Link>
        </div>
      </div>
    </div>
  );
}
