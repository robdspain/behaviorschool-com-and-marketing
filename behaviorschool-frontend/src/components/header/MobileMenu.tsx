"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { menuSections } from "./config";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  openKey: string | null;
  onToggleKey: (key: string) => void;
};

export function MobileMenu({ isOpen, onClose, openKey, onToggleKey }: Props) {
  if (!isOpen) return null;
  return (
    <div className="md:hidden border-top border-slate-200 bg-white">
      <div className="px-2 py-3 space-y-1 sm:px-3">
        {menuSections.map((section) => {
          const key = section.label.toLowerCase();
          const hasChildren = !!section.children?.length;
          if (hasChildren) {
            const expanded = openKey === key;
            return (
              <div key={key}>
                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900"
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
                        className="block px-3 py-2 text-slate-700 hover:text-slate-900"
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
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900"
              onClick={onClose}
              target={section.href?.startsWith("http") ? "_blank" : undefined}
              rel={section.href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              {section.label}
            </Link>
          );
        })}
        <div className="px-3 pt-1">
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Link href="/subscribe" onClick={onClose}>Subscribe</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


