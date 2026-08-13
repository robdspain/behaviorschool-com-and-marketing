# Public Copy Policy

Public marketing copy must not contain fabricated or placeholder testimonials, customer quotes, self-reported outcomes, unsupported statistics, named customer stories, scarcity numbers, or promises presented as established results.

Before a public copy change:

1. Check the source data for every customer claim, number, quote, and outcome.
2. If the source is not verified and approved for that exact claim, remove it and describe the program, process, or deliverable instead.
3. Run `pnpm copy:guard` and `pnpm authenticity:check` before review.
4. `pnpm build` runs both guards and must remain the publication gate.

The Transformation Program page uses the verified Learning platform as the source of truth for cohort dates, availability, pricing, enrollment, and payment options. Public pages must describe products, processes, or verified evidence, not fabricated customer experience.
