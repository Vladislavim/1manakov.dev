# SEO foundation — paused before content production

User decision, 2026-09-19: Russian language, Russia. The subsequent portfolio-polish brief explicitly separates the SEO content engine into a later phase. No article generation or mass publication has been started.

## Current work

- `scripts/seo/wordstat.mjs`: environment-only credentials, local persistent 30-day cache, bounded retry for 429/503/504, hourly safety budget, sequential calls. Successful first research batch covers 14 seeds, region 225. Raw data is ignored in Git and retained locally; topic map and sourced research are separate artifacts.
- `lib/editorial.ts`: article metadata, draft/reviewed/indexable states, content hashes, two independent review records and initial quality gates. Draft routes are absent, reviewed routes are noindex, sitemap/feed only include eligible indexable content.
- `app/journal/`: server-rendered article, topic and paginated indexes; canonical, Article/BreadcrumbList, OG, RSS. Empty journal is noindex and absent from portfolio navigation and sitemap.
- `scripts/seo/validate.mjs`: duplicates, intent collisions, local links, stale review signatures and lexical similarity screening. This does not replace semantic review by a fresh reviewer.
- `.mdx` files use an intentionally restricted Markdown subset (headings, paragraphs, lists, links, strong and code spans). No JSX/import execution or additional dependencies. Sidecar `.json` files contain Article metadata.

## Before content publication

Run the user-specified sequence: scout → architecture approval → briefs → source research → writer → independent SEO reviewer → independent Human Scope reviewer → validation/build. Each separate writing/review task must reread https://truespaceai.ru/human/ through its final rule, and publish without compliance footers. The current six-page proposal is a pilot, not an obligation to publish six pages irrespective of evidence.

Review scripts record the exact content hash only after the agent completes its review. Edits invalidate signatures. Status changes alone do not approve content. Add live rendered SEO tests and unit checks for quality-gate failure paths before activating this foundation. No claim is made that the paused SEO phase is finished.

Wordstat API: https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop . REST `regions` entries and `numPhrases` are strings. Use `WORDSTAT_API_KEY` and `YANDEX_FOLDER_ID` environment variables; keys are neither stored nor printed by project scripts. Local credentials reside outside this repository. Do not send them to agents or commit environment files.

1000 pages fit the current paginated architecture and a single sitemap; split sitemap when the protocol limit or measured file size requires it. Quantity is not a KPI. Query counts in Wordstat are broad phrase counts unless explicitly queried as exact; do not reinterpret them as exact demand for proposed titles.
