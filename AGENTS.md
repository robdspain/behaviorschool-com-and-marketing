# Agent Contribution Guidelines

This repository is used by automated agents and human contributors. To protect content quality and control what is published, follow these rules when proposing or making changes:

- Approval Required for New Pages: Do NOT build, scaffold, or publish any new page, route, or public content unless it has been explicitly requested and approved by a maintainer.
  - If a page is under discussion or in progress, keep it out of the sitemap and mark it as `noindex, nofollow` (use the admin indexing toggle or set appropriate meta/headers).
  - Never expose draft pages to search engines.

- Respect Indexing Controls: Use the Admin → Sitemap indexing toggles to control whether a page is indexable. Do not override these settings in code.

- Keep Scope Narrow: Only modify files directly related to the requested task. Avoid unrelated refactors without approval.

- Public Copy Authenticity: Before making any website/app change, check this rule explicitly. Do not add placeholder, fabricated, assumed, or unverified testimonials, reviews, usage numbers, outcome statistics, success metrics, “self-reported outcomes,” customer quotes, named customers, case studies, or social-proof claims to public pages. Only include these claims when Rob has provided or approved the source data for that exact claim. If a page already contains unverified public social proof or fake outcome data, remove it or flag it instead of preserving it.

- Internal Links: Do not link to non‑approved or draft pages from public pages.

- Sitemaps: Do not add pages to the XML sitemap or `src/app/sitemap.ts` unless they are explicitly approved for indexing.

- PR/Commit Messages: Clearly state the intent and scope of changes, especially when modifying SEO/indexing behavior.

If you are unsure whether a page is approved, assume it is NOT and ask for confirmation first.
