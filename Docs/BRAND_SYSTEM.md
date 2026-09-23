# BehaviorSchool Brand System

This is the shared public-facing visual contract for the BehaviorSchool suite.

## Product hierarchy

- Parent brand: `BehaviorSchool`
- Exam preparation product: `Behavior Study Tools`
- Supervision product: `Behavior Study Tools / Supervision`
- Continuing education product: `BehaviorSchool / Learning`

Canonical source: `src/app/globals.css` 2026 `--bs-*` chalkboard block. This file must match those hexes. See `BRAND_STYLE_GUIDE.md`.

## Shared tokens

| Token | Value | Use |
| --- | --- | --- |
| Deep green | `#0b3528` | dark surfaces and footer (`--bs-chalk-dark`) |
| Primary green | `#1f4d3f` | primary actions and links (`--bs-primary`) |
| Interactive green | `#123628` | hover and focused dark surfaces (`--bs-primary-dark`) |
| Gold | `#e4b63d` | fill on forest, or a decorative mark on forest. Band CTA text is `#171f1d` on this fill. Never gold text on paper. Never white on gold. |
| Parchment | `#fbfaf6` | page background (`--bs-background`) |
| Ink | `#171f1d` | primary text and text on gold (`--bs-ink`, `--bs-on-gold`) |
| Secondary text | `#5c5449` | supporting text |
| Border | `#ddd2c3` | dividers |

## Component rules

- Use one primary action per public header.
- Keep public headers 64px on desktop and 56-64px on mobile.
- Use 44px minimum touch targets (`--bs-control-min-h`) and 8px control radii (`--radius: 0.5rem`). Cards are 12px.
- Use rounded corners for controls and media frames, not pills for ordinary actions.
- One system sans for display, UI, and body (`--bs-font-sans`). Marketing display is weight 800. UI is 400–600. Buttons are 600–700. Do not add a serif or a second brand face.
- Do not add testimonials, reviews, outcome statistics, usage numbers, named customers, case studies, or other social-proof claims without a verified source and explicit approval.

## Product imagery rules

Only ship screenshots or product shots that are approved for public use. Remove or replace names, scores, percentages, improvement claims, and other data that could be mistaken for real customer outcomes unless their provenance is documented.

## Approved marks

- BehaviorSchool uses the graph-grid mark with an ascending gold data line.
- Behavior Study Tools uses the open-book mark with the same ascending gold data line.
- Supervision inherits the Behavior Study Tools mark; Learning inherits the BehaviorSchool mark.
- Keep marks on transparent backgrounds when they are placed inside a site header or on a colored surface. Do not substitute decorative rules, abstract line fragments, exploratory icons, or unapproved slogans for a product mark.
