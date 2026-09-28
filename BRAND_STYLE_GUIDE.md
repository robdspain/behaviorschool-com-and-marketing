# Behavior School Brand Style Guide

Canonical source: `src/app/globals.css` (2026 `--bs-*` chalkboard block) and `tailwind.config.ts` `bs-*`, which must use the same hexes. This guide matches those tokens. It replaces the older emerald / slate / Material-blue guide.

Do not copy `src/components/ui/hero.tsx` `variant="brand"`. That look is debt. See `BRAND_DEBT.md`.

## Color — the only palette

| Role | Token | Hex |
| --- | --- | --- |
| Forest mid (nav / app CTA fill) | `--bs-primary`, `--bs-chalk-mid` | `#1f4d3f` |
| Deep / chalkboard | `--bs-primary-dark` | `#123628` |
| Chalk dark | `--bs-chalk-dark` | `#0b3528` |
| Gold (fill or decorative mark on forest) | `--bs-accent`, `--bs-gold` | `#e4b63d` |
| Paper / parchment | `--bs-background`, `--bs-parchment` | `#fbfaf6` |
| Ink, including text on gold | `--bs-ink`, `--bs-text`, `--bs-on-gold` | `#171f1d` |

Theme color: `#1f4d3f`.

Retired and not brand: `#1E3A34`, `#E3B23C`, `#FAF3E0`, Material blue `#3b82f6` / `#2563eb`, emerald CTA gradients, `--quiz-*` SaaS blues and oranges.

Gold is a fill on forest, or a decorative mark on forest. It is not body text, a link, or an icon on paper or white. White type on gold is forbidden. Band and gold CTA text is `#171f1d` on `#e4b63d`.

## Type — one family

Token: `--bs-font-sans`  
Stack: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

The app shell is `font-sans antialiased` in `src/app/layout.tsx`. There is no second brand face. Do not add Iowan, Avenir, Noto Serif, Inter, Manrope, or a Google font unless it lands in this file first.

| Role | Marketing | App chrome |
| --- | --- | --- |
| Display | System sans, weight **800** (`--bs-weight-display`), tight tracking | Same face, 700–800 |
| Section title | 700 | 600–700 |
| Body | 400, 16–18px, ink on paper | 400, 16px |
| Eyebrow | 600, small, tracked. Gold `#e4b63d` on forest only | 600, forest or muted ink on paper |
| Button | 600–700, 14–16px | 600, 14px |
| Nav | 500, forest or ink | 600 |

Do not use weight 900 as the marketing voice. Do not alias “display” to a different family.

## Controls

| Contract | Token | Value |
| --- | --- | --- |
| Control radius | `--radius` | `0.5rem` (8px) |
| Card radius | `--bs-card-radius` | `0.75rem` (12px) |
| Minimum target | `--bs-control-min-h` | `44px` (width and height) |
| Focus on paper | `--bs-focus-ring` | `#171f1d`, width `--bs-focus-ring-width` `3px` |
| Focus on forest | `--bs-focus-ring-on-forest` | `#e4b63d`, width `3px` |

Use the classes `bs-control` and `bs-focus`. Add `bs-on-forest` when the control sits on a forest surface so the ring is gold. A gold ring on paper fails contrast.

Shared button primitive: `src/components/ui/button.tsx` uses `--radius`, `--bs-control-min-h`, and the 3px ink focus ring.

### Three CTA shapes

1. **Nav / app primary.** Fill `#1f4d3f`, white type, radius 8px, weight 600, min-height 44px.
2. **Forest-band conversion.** Fill `#e4b63d`, text `#171f1d`, radius 8px, weight 700, min-height 44px.
3. **Homepage hero white pill (16px).** Stays on `hero.tsx` `variant="brand"` until that hero is restyled. Do not export it.

## Accessibility (WCAG 2.2 AAA target)

Measured pairs to keep:

| Pair | Approx. ratio |
| --- | --- |
| White on `#1f4d3f` | 9.6 |
| `#171f1d` on `#fbfaf6` | 16.1 |
| `#171f1d` on `#e4b63d` | 8.8 |
| `#e4b63d` on `#123628` | 7.0 (large or bold only) |

Hard stops: gold on paper (~1.8), white on gold (~1.9), `#123628` on gold for normal button text (AA only, not the AAA band pair).

Links need color plus underline or weight. Errors need text plus an icon. `prefers-reduced-motion: reduce` stops `.bs-hero-debt-motion`.

Status colors (`--bs-danger`, success, warning) are not declared yet. Add them only after each pair measures at least 7:1 on paper.
