# Project map

- `app/`: server-rendered routes, metadata, sitemap, robots and error states.
- `data/projects.ts`: sole project/content source; roles, artifact captions, media and original URLs.
- `components/SiteShell.tsx`: navigation, reduced motion, loading readiness, cursor, scrolling and portal lifecycle.
- `components/Hero.tsx`: pointer/touch project lens and entrance.
- `components/Explore.tsx`: dark typographic stage and scroll-index.
- `components/ProjectDeck.tsx`: accessible physical project collection and gestures.
- `components/PlayLab.tsx`: folder scene and five real interaction studies.
- `components/ProjectImage.tsx`: responsive local images and graceful failure.
- `styles/`: global tokens/layout plus interaction and page styles.
- `public/images/`: user-owned project assets; no competitor media.
- `tests/`: critical browser smoke and responsive checks.
- `docs/`: design authority, factual sources, reference research, QA report.

Run `npm ci`, `npm run dev`; production `npm run build` and `npm start`. Checks: `npm run lint`, `npm run typecheck`, `npm test`.
