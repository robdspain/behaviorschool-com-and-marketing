Release: Presenton UX + Images + Editor Enhancements
Date: 2025-10-31

Highlights
- Integrated Outline and Images into Create; simplified tabs
- Moved Layout/Template/Image actions to header toolbar
- Added image generation improvements with explicit Gemini/OpenAI selection and optional fallback toggle
- Robust outline generation: JSON parsing, model normalization, Node runtime, clearer errors
- Fixed API middleware interception (no more Failed to fetch)
- Microcopy pass across Create + Player (clearer progress/errors/tooltips)
- Template settings UI (fonts + colors) and persistence
- Direct image upload to slides (Supabase storage)
- New per‑slide actions: Put, Remove, Regenerate image
- ImageEditor component scaffold (crop/resize pending)
- Resizable thumbnail sidebar; mobile overlay + desktop toggle
- PPTX upload acceptance; clear 501 message until processing enabled
- WYSIWYG slide editor parity with blog (enhanced toolbar, embeds)
- Post‑generation image enrichment implemented (Create + Player)

Notable Changes
- src/components/admin/presenton/PresentonInterface.tsx: removed Outline/Images tabs
- src/components/admin/presenton/PresentationPlayer.tsx: header controls, sidebar resize/mobile overlay, image actions, template settings
- src/components/admin/presenton/CreatePresentation.tsx: enrichment flow, messages, model loading
- src/app/api/admin/presentations/generate-outline/route.ts: resilient Gemini JSON handling
- src/app/api/admin/presentations/images/generate/route.ts: optional fallback flag
- src/app/api/admin/presentations/[id]/route.ts: persist/read templateFonts + theme in storage
- src/app/api/admin/presentations/images/upload/route.ts: direct image upload endpoint
- middleware.ts: exclude /api from middleware
- PRESENTON_COMPARISON.md: updated status for implemented features

Developer Notes
- OpenAI image fallback requires org verification for gpt-image-1
- PPTX processing (import) is staged; enable via JSZip/xml2js pipeline when permitted
- ImageEditor exposes Apply hook; wire to slide update when crop/resize lands

