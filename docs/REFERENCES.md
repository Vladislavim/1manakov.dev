# References and provenance

Inspected 2026-09-18. All 10 local ZIP inventories inspected; large runtime bundles were not read wholesale. The five supplied PNGs control the visual design. No competitor code, font, photograph, logo, or project asset is shipped.

| Reference | URL / local archive | Observed / used |
|---|---|---|
| Tim Ogundipe | https://www.timmadeit.com/ · `web2.zip_www_timmadeit_com.zip` | Read targeted `effects_kvk7nk.js` and `pagetransition_makjdv.js` excerpts. Observed quickTo cursor, power3 easing, Lenis lerp .09, staged entrance and transition lifecycle. Independently implemented these general patterns. Barba/Webflow code not copied. |
| Joris Brianti | https://jorisbrianti.fr/ · `web2.zip_jorisbrianti_fr.zip` | Targeted `main.DQzkjJVx.js` keyword windows identify GSAP, ScrollTrigger, Lenis and pointer/wheel lifecycle. Informs sequencing and cleanup; no bundle reuse. GSAP copyright/standard-license header present; libraries installed from npm separately. |
| Casey McVicker | https://caseymcvicker.nyc/ · `web2.zip_caseymcvicker_nyc.zip` | Inspected `script.js` mousemove behavior. Simple pointer-to-image response informs the lens, implemented independently. |
| Nurul Amin | https://www.thenurulamin.com/ · `web2.zip_www_thenurulamin_com.zip` | Archive inventoried; application-like interactions are a brief-level influence. No code copied or claim of detailed runtime research. |
| Ryo Lu | https://ryo.lu/ · `web2.zip_ryo_lu.zip` | Inventory located `static/js/main.90ad54bf.js`; spatial interaction influence from brief; no bundle reuse. |
| Matheus Costa | https://matheuscosta.co/ · `web2.zip_matheuscosta_co.zip` | Inventory located main/use-spring chunks; tactile settling influence from brief, no spring code reuse. |
| Wildy Riftian | https://www.wildyriftian.com/ · `web2.zip_www_wildyriftian_com.zip` | Collection/exploration reference from brief. Archive inventoried; Framer internals not investigated. |
| Daniella Marynova | https://hellodani.co/ · `web2.zip_hellodani_co.zip` | Density and restraint reference from brief; archive inventoried, no proprietary runtime/assets used. |
| Sarthak Prakash | https://sartisticway.in/ · `web2.zip_sartisticway_in.zip` | Secondary play reference; archive inventoried, no Lottie asset reused. |
| Divyansh | `web2.zip_divyanshhp_work.zip` | Additional archive discovered and inventoried; not used. |

No explicit license granting reuse of site-specific code was identified in the targeted source files. All shipped application code is original. Third-party dependency licenses remain in installed packages and lockfile. Font: Geist, SIL Open Font License, downloaded from official Google Fonts repository with license retained.

## Factual source
https://www.imanakov.website/ redirects to https://imanakov.website/ and displays a Jino hosting suspension notice in the browser. Direct HTTP fetch returned 403. No live portfolio claims were inferred from this.

Fallback inspected: user's `01 Projects and Sites/jack template/src/App.tsx` lines 153–190 (four projects, original URLs, roles, images), 125–150 (capabilities), 1423–1435 (design statement), 756/1610–1675 (email, Telegram, GitHub). Project images are copied from its `public/assets/cases/`. This is historical source content, not a verification of current client-site status.

## Engineering documentation
- https://nextjs.org/docs/app/getting-started/installation — current stable version verified as 16.3.5.
- https://gsap.com/resources/React/ — scoped lifecycle cleanup.
- https://github.com/darkroomengineering/lenis — scrolling integration and native touch fallback.


## Two additional cases requested during implementation
- PDP: user identified the desktop PDP project; `пдп новый сайт` contains its media work. The actual site checkout verified at `Documents/Codex/2026-07-26/new-chat/outputs/pdp-master-final/ooopdp.ru`. Read-only local serving captured `index.html`, `pages/02-services.html`, `pages/06-completed-works.html` at 1440x1000. No PDP files were edited. Site title and description identify construction project management; no business statistics were copied into portfolio claims.
- Khasaut Tour: user identified `Рабочий стол/эльдар сайт/khasaut-tour`. README, GPT_SITE_CONTEXT and rendered `dist/` identify North Caucasus tours, excursions and a price configurator. Read-only captures of `/`, `/excursions/`, `/prices/` at 1440x1000. Original destination https://khasaut-kmv.ru from README. No source files edited. The user confirmed both sites as additional portfolio cases; no more specific individual role is asserted than Website project.
- Six total cases: five website projects plus Aurelia (explicit independent concept). New captures stored as optimized WebP; analytics/external requests blocked during local captures.
