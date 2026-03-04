"use client";

import { useState } from "react";
import { Clipboard, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedACTBIP } from "./actBipGenerator";
import { actBipToText } from "./actBipGenerator";

interface ACTBIPOutputProps {
  report: GeneratedACTBIP;
  onReset: () => void;
}

export function ACTBIPOutput({ report, onReset }: ACTBIPOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(actBipToText(report));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="rounded-3xl border border-[#1E3A34]/20 bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#1E3A34] px-6 py-5 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/80">CalABA 2026 Flow</p>
        <h2 className="text-2xl font-semibold">ACT-Informed FBA/BIP Report</h2>
        <p className="text-sm text-white/80">{report.profileSummary}</p>
      </div>

      <div className="space-y-6 p-6">
        {report.phases.map((phase) => (
          <section key={phase.phase} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-base font-semibold text-slate-900">
              Phase {phase.phase}: {phase.title}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {phase.content.length > 0 ? (
                phase.content.map((item, index) => <li key={index}>- {item}</li>)
              ) : (
                <li>- No entries for this phase.</li>
              )}
            </ul>
          </section>
        ))}

        {report.bipSections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-[#1E3A34]/20 bg-[#1E3A34]/5 p-4">
            <h3 className="text-base font-semibold text-[#1E3A34]">{section.title}</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              {section.items.map((item, index) => (
                <li key={index}>- {item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-[#e4b63d]/50 bg-[#e4b63d]/10 p-4">
          <h3 className="text-base font-semibold text-slate-900">CPFQ Pre/Post Snapshot</h3>
          <p className="mt-1 text-sm text-slate-700">Student total: {report.cpfqSummary.studentTotal.toFixed(2)} / 4.00</p>
          <p className="text-sm text-slate-700">Caregiver total: {report.cpfqSummary.caregiverTotal.toFixed(2)} / 4.00</p>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4 print:hidden">
          <Button className="bg-[#1E3A34] hover:bg-[#173029]" onClick={handleCopy}>
            <Clipboard className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy Report"}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save PDF
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
