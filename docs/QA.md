# Verification — 2026-09-20

Production build: 50 static paths; lint and TypeScript passed. SEO: 20 approved pages; SSR without JavaScript, canonical/robots/schema, sitemap membership, missing-route 404, contextual CTA, six event types, interactive form and five golden-page mobile layouts passed. Normal factory, dry-run/resume and byte-identical content preservation passed. Ledger snapshot remains 20 events on repeat. Similarity gate tested with 5000 synthetic documents; not a full 5000-page build benchmark.

LAB: 40 scene openings across 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, 375×812. Desktop/mobile screenshots and open/close masks inspected. Native touch drags all five studies. Keyboard and reduced-motion studies pass in Chromium, Firefox and WebKit. Final touch close regression was found and patched: prevent a compatibility click from reaching navigation behind a closing scene. Follow-up validation remains in the current task.

General regression initially exposed mobile Legacy title overflow, stale Lenis scroll position and missing prepared-image fallback. All three were fixed and passed follow-up coverage. One Firefox scroll-transition test required waiting for the smooth anchor scroll to settle before clicking the moving deck control. A concurrent test run invalidated a WebKit trace artifact; its test passed when run again serially. Do not interpret these earlier failures as an all-green single run.

Reports/screenshots/traces are local under ignored qa/ and test-results/. No live deployment, physical-device Safari check, current Lighthouse score, actual indexing, rankings or measured traffic gains are claimed. Further user-requested guide interactions and a site-wide polish pass are in progress.
