# Behavior School colors — quick reference

Copy these from `src/app/globals.css`. Do not use the retired hexes at the bottom.

```css
--bs-primary: #1f4d3f;       /* forest mid */
--bs-primary-dark: #123628;  /* deep */
--bs-chalk-dark: #0b3528;
--bs-accent: #e4b63d;        /* gold */
--bs-gold: #e4b63d;
--bs-background: #fbfaf6;    /* paper */
--bs-parchment: #fbfaf6;
--bs-ink: #171f1d;
--bs-text: #171f1d;
--bs-on-gold: #171f1d;       /* text on gold fills */
--radius: 0.5rem;            /* 8px controls */
--bs-card-radius: 0.75rem;   /* 12px cards */
--bs-control-min-h: 44px;
--bs-focus-ring-width: 3px;
--bs-focus-ring: #171f1d;            /* on paper */
--bs-focus-ring-on-forest: #e4b63d;  /* on forest only */
--bs-font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--bs-weight-display: 800;
--bs-weight-ui: 400;
--bs-weight-ui-strong: 600;
--bs-weight-button: 600;
--bs-weight-band: 700;
```

## Tailwind

`bg-bs-primary`, `text-bs-ink`, `bg-bs-accent`, and `text-bs-on-gold` resolve from these variables (`@theme` in `globals.css`). `tailwind.config.ts` repeats the same hexes and must not drift.

## CTA snippets

```tsx
{/* Nav / app — white on forest, 8px, 44px, ink focus ring on paper */}
<Link className="bs-control bs-focus inline-flex items-center justify-center bg-bs-primary px-5 py-2 text-sm font-semibold text-white">
  Open
</Link>

{/* Band — ink on gold. Never white. Never #123628. Gold focus ring because the surface is forest. */}
<Link className="bs-control bs-on-forest inline-flex items-center justify-center bg-bs-accent px-6 py-3 text-sm font-bold text-bs-on-gold">
  Apply
</Link>
```

## Do not use

| Retired | Why |
| --- | --- |
| `#1E3A34`, `#152825` | Stale forest. Use `#1f4d3f` / `#123628` / `#0b3528`. |
| `#E3B23C`, `#FAF3E0` | Stale gold and cream. Use `#e4b63d` and `#fbfaf6`. |
| `#3b82f6`, `#2563eb` | Material blue. Not brand. Fails normal-text contrast on white. |
| Emerald CTA gradients | Not the chalkboard palette. |
| `--quiz-*` | Quarantined Study SaaS blues and oranges. Not declared. |
| White on `#e4b63d` | About 1.9:1. |
| `#e4b63d` text on paper or white | About 1.8:1. |
| `hero.tsx` `variant="brand"` | Debt. See `BRAND_DEBT.md`. |
