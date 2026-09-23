# Brand debt — do not export

Phase 1 locks `src/app/globals.css` as the Behavior School reference. The items below still exist in this repo and are **not** the canon. Child products (Study, Learning, Plan, Supervision) must not copy them.

## Hero glow (`variant="brand"`)

File: `src/components/ui/hero.tsx`  
Used by: `src/app/page.tsx`, `src/app/school-bcba/SchoolBCBAContent.tsx`

What it still paints:

- Field `#0A1512` (not `#123628` / `#0b3528`)
- Teal / emerald gradient wordmark treatment
- Blue glow (`bg-blue-600/20`, `from-emerald-500/30 to-blue-500/30`)
- White pill CTA at 16px radius (`rounded-2xl`, `h-16`)

Marked in code with `data-brand-debt="hero-glow"` and `.bs-hero-debt-motion`. Reduced motion disables that motion. The visual stays until a later pass restyles the hero onto the tokens. **Do not export this look.**

## Quarantined `--quiz-*`

Removed from `:root` in `src/app/globals.css`. Nothing in this repo referenced them. Do not put them back.

Retired values, for the record only:

`#FAFBFC`, `#2E7D5A`, `#1B584E`, `#2563EB`, `#E65100`, `#1F2937`, `#6B7280`, `#2E7D32`, `#C62828`, `#0288D1`, `#F8FAFC`, `#E5E7EB`, `#F3F4F6`

## Historical brand markdown

These files are **not** current. `BRAND_STYLE_GUIDE.md` and `BRAND_COLORS_QUICK_REFERENCE.md` are the guides that match `globals.css`.

- `BRAND_COLOR_AUDIT.md`
- `BRAND_COLOR_COMPLIANCE_REPORT.md`
- `BRAND_COLOR_IMPLEMENTATION_SUMMARY.md`
- `BRAND_COLOR_ROLLOUT_COMPLETE.md`
- `BRAND_AUDIT_REPORT.md`

They still describe `#1E3A34`, `#E3B23C`, `#FAF3E0`, emerald CTAs, or Material blue. Do not implement from them.

## Still open for AAA (not fixed in this pass)

- Many gold fills outside the homepage band still set type to `#123628`, `#1f4d3f`, or nearby forest values instead of `#171f1d`. Examples include `src/components/ui/pro-upgrade-banner.tsx`, `src/components/ui/ProTrialCTA.tsx`, `src/components/marketing/SchoolBcbasTransformationCta.tsx`, and several product pages. Pass 3 owns the full CTA sweep.
- Shadcn `--primary` HSL in `globals.css` is UI-kit plumbing (saturated emerald), not a brand token.
- Mobile nav links still use `text-emerald-800`.
- `--bs-danger` / success / warning are undeclared until each pair measures ≥7:1 on paper.
- Homepage hero remains the debt look above.
