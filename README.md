# IMANAKOV

Interactive portfolio: typography, project lens, tactile work collection, portal transitions and an interaction lab.

## Run
Node.js 22+ recommended. `npm ci`, then `npm run dev`.
Production: `npm run build` and `npm start`.
Verification: `npm run lint`, `npm run typecheck`, `npm test`.

See [project map](docs/PROJECT_MAP.md), [design authority](docs/DESIGN.md), [sources](docs/REFERENCES.md), and [QA](docs/QA.md).

Update project content in `data/projects.ts`. Real case images are stored locally. Set `NEXT_PUBLIC_SITE_URL` to the deployment origin before building; default is https://1manakov.dev. First-party analytics events have no external destination configured. No analytics cookies, external fonts, or runtime third-party media. Original source-site links remain historical references.

Reference archives, QA screenshots, caches, and installed packages are excluded from Git and production assets. This repository does not deploy automatically without a hosting integration.

## Guides and Lab

- `/guides`: 20 Russian design guides with real demand provenance, editorial quality gates and contextual contact links. [Factory operations](docs/SEO-FACTORY.md).
- `/lab`: five tactile interaction studies. `/play` redirects permanently. [Lab implementation and QA](docs/LAB.md).
- Case order: Allnrg → PDP → Khasaut → VPN → Legacy → Aurelia. Five supplied before/after comparisons; no extra case-screen gallery.
