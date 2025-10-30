"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { useAnalytics } from "@/hooks/useAnalytics";

type Finding = { label: string; ok: boolean; hint?: string };

export default function IEPGoalQualityChecker() {
  const [text, setText] = useState("");
  const findings: Finding[] = useMemo(() => evaluate(text), [text]);
  const score = useMemo(() => Math.round((findings.filter(f => f.ok).length / findings.length) * 100) || 0, [findings]);
  const [showSignup, setShowSignup] = useState(false);
  const [hasSignup, setHasSignup] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | "copy" | "pdf" | "email">(null);
  const [showImprove, setShowImprove] = useState(false);
  const [improvedGoal, setImprovedGoal] = useState("");

  const { trackButtonClick, trackToolUsage } = useAnalytics();
  const masteryRatio = useMemo(() => parseMasteryRatio(text), [text]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const flag = localStorage.getItem('hasSignedUpForIEPWidget') === 'true' || localStorage.getItem('hasSignedUpForIEPGoalTools') === 'true';
      setHasSignup(flag);
    }
  }, []);

  const ensureSignup = (action: "copy" | "pdf" | "email", fn: () => void) => {
    trackToolUsage('iep_goal_quality_checker', `attempt_${action}`, { score });
    if (hasSignup) {
      fn();
    } else {
      setPendingAction(action);
      setShowSignup(true);
    }
  };

  const onSignupSuccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSignedUpForIEPGoalTools', 'true');
      setHasSignup(true);
    }
    setTimeout(() => {
      if (pendingAction === 'copy') doCopy();
      if (pendingAction === 'pdf') doExportPDF();
      if (pendingAction === 'email') doEmailToSelf();
      setPendingAction(null);
    }, 100);
  };

  const doCopy = () => {
    const content = buildExport(text, findings, score);
    navigator.clipboard.writeText(content).catch(() => {});
    trackButtonClick('copy_results', 'quality_checker_actions', { score });
    trackToolUsage('iep_goal_quality_checker', 'copy_results', { score });
  };

  const doExportPDF = () => {
    const content = buildHTMLForPrint(text, findings, score);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(content);
    w.document.close();
    w.focus();
    w.print();
    trackButtonClick('export_pdf', 'quality_checker_actions', { score });
    trackToolUsage('iep_goal_quality_checker', 'export_pdf', { score });
  };

  const doEmailToSelf = () => {
    const subject = encodeURIComponent('Your IEP Goal Quality Check');
    const body = encodeURIComponent(buildExport(text, findings, score));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackButtonClick('email_results', 'quality_checker_actions', { score });
    trackToolUsage('iep_goal_quality_checker', 'email_results', { score });
  };

  return (
    <main className="min-h-screen bg-bs-background">
      <div className="container mx-auto px-6 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goal Writer", href: "/iep-goals" },
            { label: "IEP Goal Quality Checker" },
          ]}
        />
      </div>

      <section className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2zl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">IEP Behavior Goal Quality Checker</h1>
          <p className="text-slate-600 mb-6">
            Paste a behavior goal to get instant feedback on core components: condition, behavior, measurement, criteria (90–100%), timeframe, and monitoring.
          </p>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Example: Given a visual schedule and first/then board, the student will request a break using a break card or vocal request in 90% of opportunities across three consecutive days as measured by event recording by 11/15/2025."
            className="w-full h-40 border border-slate-300 rounded-lg p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Quality Score</div>
            <div className="text-emerald-700 font-semibold">{score}%</div>
          </div>

          <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
            {findings.map((f, i) => (
              <li key={i} className="p-3 flex items-start justify-between">
                <span className="text-slate-800">
                  {f.ok ? "✅" : "⚠️"} {f.label}
                </span>
                {!f.ok && f.hint ? (
                  <span className="text-sm text-slate-500 ml-4">{f.hint}</span>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => ensureSignup('copy', doCopy)} variant="outline">Copy Results</Button>
            <Button onClick={() => ensureSignup('pdf', doExportPDF)} className="bg-emerald-600 hover:bg-emerald-700">Export PDF</Button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="ghost">
              <Link href="/iep-behavior-goals">Use the Free Goal Generator</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/iep-goals">Explore the Full IEP Goal Writer</Link>
            </Button>
            <Button variant="ghost" onClick={() => ensureSignup('email', doEmailToSelf)}>Email Results to Me</Button>
          </div>

          {/* Improve My Goal */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Improve My Goal</h2>
              <Button
                variant={showImprove ? 'outline' : 'default'}
                onClick={() => {
                  setShowImprove(v => !v);
                  trackButtonClick('toggle_improve_section', 'quality_checker_improve', { open: !showImprove, score });
                  trackToolUsage('iep_goal_quality_checker', 'toggle_improve', { open: !showImprove, score });
                }}
              >
                {showImprove ? 'Hide' : 'Show'} Suggestions
              </Button>
            </div>
            {showImprove && (
              <div className="mt-4 space-y-4">
                <ul className="list-disc pl-6 text-slate-700">
                  {findings.filter(f => !f.ok).map((f, i) => (
                    <li key={i}>{f.label}{f.hint ? ` — ${f.hint}` : ''}</li>
                  ))}
                </ul>
                {(masteryRatio !== null && masteryRatio >= 0.9 && masteryRatio < 0.95) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                    Recommendation: Many districts prefer mastery at 95%+. Consider adjusting to 95% if appropriate for the student and context.
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                  Tip: Click “Generate Draft” to build a cleaner, measurable version using standard clauses. Edit as needed.
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      const draft = generateDraftGoal(text, findings);
                      setImprovedGoal(draft);
                      trackButtonClick('generate_draft', 'quality_checker_improve', { score });
                      trackToolUsage('iep_goal_quality_checker', 'generate_draft', { score });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Generate Draft
                  </Button>
                  {improvedGoal && (
                    <Button
                      variant="outline"
                      onClick={() => ensureSignup('copy', () => {
                        navigator.clipboard.writeText(improvedGoal).catch(() => {});
                        trackButtonClick('copy_improved_goal', 'quality_checker_improve', { score });
                        trackToolUsage('iep_goal_quality_checker', 'copy_improved_goal', { score });
                      })}
                    >
                      Copy Improved Goal
                    </Button>
                  )}
                </div>
                {improvedGoal && (
                  <textarea
                    value={improvedGoal}
                    onChange={(e) => setImprovedGoal(e.target.value)}
                    className="w-full h-36 border border-slate-300 rounded-lg p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SoftwareApplication Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "IEP Behavior Goal Quality Checker",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description: "Instant, rule-based quality checks for IEP behavior goals with export and copy features.",
            offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
            url: "https://behaviorschool.com/iep-goal-qualitychecker",
            publisher: { "@type": "Organization", name: "Behavior School" }
          })
        }}
      />

      {/* Email Signup Modal */}
      <EmailSignupPopup
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        title="Get Free Access to Exports"
        description="Enter your email to unlock Copy and PDF export, plus receive School BCBA tools and tips."
        pageSource="iep_goal_quality_checker"
        buttonText="Unlock Free Access"
        showNameField={false}
        isDownloadFlow={true}
        onSuccess={onSignupSuccess}
        id="quality-checker-signup"
      />
    </main>
  );
}

function evaluate(txt: string): Finding[] {
  const t = (txt || "").toLowerCase();
  const hasCondition = /(given|with|following|during|in the presence of|provided)/.test(t);
  const hasBehavior = /(will|increase|decrease|request|remain|complete|transition|comply)/.test(t);
  const hasMeasurement = /(measured by|event recording|duration|frequency|rate|latency|percentage|probe|data)/.test(t);
  const hasCriteria = hasStrongCriteria(t);
  const hasTimeframe = /(by\s+\d{1,2}\/\d{1,2}\/\d{2,4}|within\s+\d+\s+(weeks|months)|by\s+(fall|spring|end of (quarter|semester|year)))/.test(t);
  const hasBaseline = /(baseline|currently|from|average of|pretest)/.test(t);
  const avoidsVague = !/(better|improve|appropriate|successfully|more|less)\s*(behav|comply|work|transition)/.test(t);
  const hasSupport = /(visual schedule|first\/then|prompt|model|token|break card|choice|timer|check-in|self-monitor)/.test(t);
  const hasObservation = /(as measured by|teacher|therapist|observer|data sheet)/.test(t);

  const res: Finding[] = [
    { label: "Includes clear condition (Given/With/During)", ok: hasCondition, hint: "Add a condition: 'Given a visual schedule…'" },
    { label: "Identifies observable target behavior", ok: hasBehavior, hint: "Use a measurable verb: request, transition, remain, complete." },
    { label: "Specifies measurement method", ok: hasMeasurement, hint: "Add 'as measured by event recording / duration / frequency'." },
    { label: "Includes mastery criteria", ok: hasCriteria, hint: "Add criteria like 'in 90% of opportunities across 3 days'." },
    { label: "Has timeframe/end date", ok: hasTimeframe, hint: "Include 'by 11/15/2025' or 'within 12 weeks'." },
    { label: "References baseline or present levels", ok: hasBaseline, hint: "Optionally add baseline: 'Currently averages 2 requests/day'." },
    { label: "Avoids vague language", ok: avoidsVague, hint: "Replace vague terms with measurable actions and contexts." },
    { label: "Lists supports/accommodations", ok: hasSupport, hint: "Add supports: visual schedule, choice, break card, token, prompts." },
    { label: "States who is measuring/observing", ok: hasObservation, hint: "Add 'as measured by teacher with data sheet'." },
  ];
  return res;
}

function hasStrongCriteria(t: string) {
  const pct = t.match(/(\d{1,3})\s*%/);
  if (pct) {
    const n = parseInt(pct[1], 10);
    if (!Number.isNaN(n) && n >= 90 && n <= 100) return true;
  }
  const frac = t.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) {
    const a = parseInt(frac[1], 10);
    const b = parseInt(frac[2], 10);
    if (b > 0 && a / b >= 0.9) return true;
  }
  return false;
}

function parseMasteryRatio(t: string): number | null {
  const pct = t.match(/(\d{1,3})\s*%/);
  if (pct) {
    const n = parseInt(pct[1], 10);
    if (!Number.isNaN(n)) return Math.max(0, Math.min(1, n / 100));
  }
  const frac = t.match(/(\d+)\s*\/\s*(\d+)/);
  if (frac) {
    const a = parseInt(frac[1], 10);
    const b = parseInt(frac[2], 10);
    if (b > 0) return Math.max(0, Math.min(1, a / b));
  }
  return null;
}

function buildExport(txt: string, findings: Finding[], score: number) {
  const lines = [
    `IEP Behavior Goal Quality Check`,
    `Score: ${score}%`,
    ``,
    `Goal:`,
    txt || '(no text) ',
    ``,
    `Checks:`,
    ...findings.map(f => `${f.ok ? '[OK] ' : '[Needs Work] '} ${f.label}${f.ok || !f.hint ? '' : ` — Hint: ${f.hint}`}`)
  ];
  return lines.join('\n');
}

function buildHTMLForPrint(txt: string, findings: Finding[], score: number) {
  const rows = findings.map(f => `<tr><td>${f.ok ? '✅' : '⚠️'}</td><td>${escapeHtml(f.label)}</td><td>${f.ok ? '' : escapeHtml(f.hint || '')}</td></tr>`).join('');
  const safeTxt = escapeHtml(txt || '(no text)');
  return `<!doctype html>
  <html>
  <head>
    <meta charset=\"utf-8\" />
    <title>IEP Goal Quality Check</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Arial,sans-serif; padding:24px; color:#0f172a}
      h1{font-size:20px;margin:0 0 4px}
      .muted{color:#475569}
      table{border-collapse:collapse; width:100%; margin-top:12px}
      td,th{border:1px solid #e2e8f0; padding:8px; font-size:12px; vertical-align:top}
      .score{font-weight:600; color:#047857}
      pre{white-space:pre-wrap; background:#f8fafc; border:1px solid #e2e8f0; padding:12px; border-radius:8px}
      @media print{ button{display:none} }
    </style>
  </head>
  <body>
    <h2>IEP Behavior Goal Quality Check <span class=\"score\">(${score}%)</span></h2>
    <div class=\"muted\">Generated by Behavior School</div>
    <h2>Goal</h2>
    <pre>${safeTxt}</pre>
    <h2>Checks</h2>
    <table>
      <thead><tr><th></th><th>Criterion</th><th>Hint (if needed)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <script>window.onload = () => setTimeout(() => window.print(), 50)</script>
  </body>
  </html>`;
}

function escapeHtml(s: string) {
  const htmlEntities: Record<string, string> = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'};
  return s.replace(/[&<>"']/g, (c) => htmlEntities[c] || c);
}

function generateDraftGoal(txt: string, findings: Finding[]) {
  const t = (txt || '').trim();
  const map = new Map(findings.map(f => [f.label, f.ok] as const));

  const condition = map.get('Includes clear condition (Given/With/During)') ? '' : 'Given a visual schedule and first/then board, ';
  const supports = map.get('Lists supports/accommodations') ? '' : '';
  const measurement = map.get('Specifies measurement method') ? '' : 'as measured by event recording ';
  const criteria = map.get('Includes mastery criteria') ? '' : 'in 90% of opportunities across three consecutive days ';
  const timeframe = map.get('Has timeframe/end date') ? '' : `by ${futureDate(12)} `;
  const observer = map.get('States who is measuring/observing') ? '' : 'by teacher using a data sheet ';

  const base = t || 'the student will request a break using a break card or vocal request ';
  const sentence = `${condition}${base}`
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*,\s*/g, ', ');

  const tailPieces = [supports, measurement, observer, criteria, timeframe]
    .filter(Boolean)
    .join('')
    .trim();

  const withPunctuation = sentence.endsWith('.') ? sentence : sentence.replace(/\s+$/, '') + ' ';
  const draft = `${withPunctuation}${tailPieces}`.replace(/\s+/g, ' ').trim();
  return draft.endsWith('.') ? draft : draft + '.';
}

function futureDate(weeks: number) {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}
