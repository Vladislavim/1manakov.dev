# Verification — 2026-09-20

Production build: 50 static paths; lint and TypeScript passed. SEO: 20 approved pages; SSR without JavaScript, canonical/robots/schema, sitemap membership, missing-route 404, contextual CTA, six event types, interactive form and five golden-page mobile layouts passed. Normal factory, dry-run/resume and byte-identical content preservation passed. Ledger snapshot remains 20 events on repeat. Similarity gate tested with 5000 synthetic documents; not a full 5000-page build benchmark.

LAB: 40 scene openings across 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, 390×844, 375×812. Desktop/mobile screenshots and open/close masks inspected. Native touch drags all five studies. Keyboard and reduced-motion studies pass in Chromium, Firefox and WebKit. Final touch close regression was found and patched: prevent a compatibility click from reaching navigation behind a closing scene. Follow-up passed: 10 LAB browser tests, 2 Chromium-only native-touch tests skipped on other engines.

General regression initially exposed mobile Legacy title overflow, stale Lenis scroll position and missing prepared-image fallback. All three were fixed and passed follow-up coverage. One Firefox scroll-transition test required waiting for the smooth anchor scroll to settle before clicking the moving deck control. A concurrent test run invalidated a WebKit trace artifact; its test passed when run again serially. Do not interpret these earlier failures as an all-green single run.

Reports/screenshots/traces are local under ignored qa/ and test-results/. No live deployment, physical-device Safari check, current Lighthouse score, actual indexing, rankings or measured traffic gains are claimed. All 20 guides now include a working exercise. The latest layout sweep checked 112 page/viewport combinations across 390, 430, 768, 1024, 1366, 1440 and 1920 pixels: no horizontal overflow, heading overflow, missing exercise, misaligned comparison row or runtime error. All images decoded on the homepage, About, LAB, six case routes and guide index. Desktop/mobile guide and portrait screenshots, plus case comparisons, were inspected.

## Portfolio and guide update

- Five factual before/after pairs share one desktop row; stack at 900px and below. No old version invented for Aurelia.
- PDP internal case remains accessible; external website action is replaced by an intentional development preview driven by project data.
- About uses the latest owner-supplied `Photo for about I/i itmo avatarka-Photoroom.png`, copied byte-for-byte to `public/images/about/portrait-itmo.png`. The hand-drawn silhouette mask was removed. SVG only frames the transparent asset; grayscale and bottom fade are CSS. No facial pixels regenerated.
- Guide workbenches: checklist, scenario builder, copy preview, contrast calculator, validation timing, password visibility, block ordering, motion, dialog, loading states and contextual decision examples. Inputs stay local; copying/downloading is explicit. Contrast examples verified at 1:1 and 21:1; this is not a whole-site accessibility certification.

## Final regression and ALLNRG evidence

75-test regression: 71 passed, 4 skipped (native Chromium CDP touch tests on other engines). Latest portrait PNG and guide dialog scroll locking: 12 follow-up tests passed across Chromium, Firefox and WebKit. Build, lint and TypeScript passed.

ALLNRG source: owner-provided `альянс — Обзор — Яндекс.Метрика.pdf`, counter 109573051, exact period 01.06.2026–01.09.2026. Page 1 verifies 1107 visits, 169 search visits, 996 visitors and 1716 pageviews. 169/1107 rounds to 15.3%. Page 3 verifies title-group pageviews of 856 and 172 (all sources). Older report counter 103632796 is excluded from growth comparisons. Published evidence images are unedited Poppler renders at 2000px; the original three-page PDF is preserved. Presentation spotlight is CSS only. Source viewer includes all full pages, zoom, Escape, backdrop close and restored focus. Initial six-viewport check (1920,1440,1366,1024,430,390) found no overflow/runtime errors.
