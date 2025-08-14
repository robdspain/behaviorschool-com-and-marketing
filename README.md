# Behavior School Frontend

This is the Next.js frontend for Behavior School.

## New pages

- `/products/classroom-pilot`: ClassroomPilot landing page optimized for special education keywords (IEP goal tracking, progress monitoring, accommodations tracking, etc.). Includes a "How it works" section and a gated checklist CTA posting to `/api/subscribe`.
- `/resources/iep-data-tracking-tips`: Printable checklist resource with a link to `/Top-10-IEP-Data-Tracking-Tips.pdf` in `public/`.

## Lead magnet notes

- The checklist CTA on the ClassroomPilot page submits to `/api/subscribe` (uses existing Mailgun proxy env `MAILGUN_ENDPOINT`). On success, the page reveals an instant download link to the resource.
- Add your actual PDF to `public/Top-10-IEP-Data-Tracking-Tips.pdf`.

## SEO

- Root metadata updated to include special education keywords.
- ClassroomPilot page includes schema.org `SoftwareApplication` JSON-LD.
