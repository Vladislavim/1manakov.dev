# Project map

- `app/`: server-rendered routes, metadata, sitemap, robots and error states.
- `data/projects.ts`: sole project/content source; roles, artifact captions, media and original URLs.
- `components/SiteShell.tsx`: navigation, reduced motion, loading readiness, cursor, scrolling and portal lifecycle.
- `components/Hero.tsx`: pointer/touch project lens and entrance.
- `components/Explore.tsx`: dark typographic stage and scroll-index.
- `components/ProjectDeck.tsx`: accessible physical project collection and gestures.
- `components/Lab.tsx` / `LabExperiments.tsx`: folder-to-scene transitions and five interaction studies; `/play` redirects to `/lab`.
- `components/ProjectImage.tsx`: responsive local images and graceful failure.
- `styles/`: global tokens/layout plus interaction and page styles.
- `public/images/`: user-owned project assets; no competitor media.
- `tests/`: critical browser smoke and responsive checks.
- `docs/`: design authority, factual sources, reference research, QA report.

Run `npm ci`, `npm run dev`; production `npm run build` and `npm start`. Checks: `npm run lint`, `npm run typecheck`, `npm test`.

- `content/guides/`, `lib/guides.ts`, `app/guides/`: 20 signed Russian guides and safe SSR templates.
- `scripts/seo/`, `seo/data/`, `seo/reports/`: demand pipeline, evidence, quality gates and experiment ledger; see `docs/SEO-FACTORY.md`.
- `data/case-evidence.ts`, `DevicePresentation.tsx`: factual owner-supplied before/after device compositions.

- `components/GuideWorkbench.tsx`, `data/guide-tools.ts`, `styles/guide-workbench.css`: 11 interactive exercise types mapped to all 20 guides; local-only inputs and text export.
- `components/AboutPortrait.tsx`: unchanged supplied transparent portrait, framed by an SVG viewport with CSS monochrome treatment.
- `components/ExternalProject.tsx`: model-driven live / in-development external website action; internal case stays accessible.
