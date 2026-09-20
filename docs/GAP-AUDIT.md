> Historical reconnaissance snapshot. PLAY has since been replaced by LAB; current implementation and verification are in docs/LAB.md and docs/QA.md.

# Gap audit — interaction polish

Read-only scout pass against the running local app at `http://127.0.0.1:3000` on 2026-09-19. The served build is the existing portfolio checkpoint; no SEO files were evaluated as part of this pass.

## BLOCKER

None found in the requested polish scope. Home, `/about`, `/play`, `/journal`, and all six linked work routes returned 200 at desktop and mobile widths. Existing Playwright suite reported the first two tests passing before the run became quiet; direct browser checks found no console/page errors on 200 routes. A deliberate invalid slug returned the expected 404.

## MAJOR

- Cursor is still a 7px circular dot on fine pointers, expanding to a 62px circular badge on `[data-cursor]`; there is no arrow/SVG hotspot. Evidence: `styles/globals.css:2`, `components/SiteShell.tsx:114-125`. This is the clearest requested gap and should be isolated in the shell or a small cursor component.
- The top 4px `.readiness` bar is a one-time image/font readiness loader, not scroll progress; it disappears after load. There is no scroll percentage or persistent cue beyond the hero `SCROLL` anchor. Evidence: `components/SiteShell.tsx:86-101,143`, `styles/globals.css:2`, `components/Hero.tsx:121-123`. A new scroll indicator should not reuse loader state.
- Choreography is split across independent scene ownership: Explore owns a clipped reveal and image-letter trigger, while ProjectDeck owns a separate card-space scrub. There is no shared hero→dark Explore→Work timeline or handoff state. Evidence: `components/Explore.tsx:21-35`, `components/ProjectDeck.tsx:16-22`, home composition `app/page.tsx:9`. Implement a wrapper-level choreography owner so scene transforms do not compete.
- Route portal is global and textually branded “Enter the work / A closer look.” for every image route. It is used by image-bearing links only; plain About/Play navigation bypasses it. Evidence: `components/SiteShell.tsx:50-80,145`, `components/SiteShell.tsx:139-140`. If About/Play need lighter transitions, add a separate veil/fade path rather than widening the case portal.

## POLISH

- Touch and reduced-motion foundations are present: Lens swipe uses `touch-action: pan-y`, ProjectDeck cancels vertical drags, Lenis is restricted to fine pointers/no-preference, and reduced motion disables the cursor/readiness and ScrollTrigger reveal. Evidence: `components/Hero.tsx:98-110`, `components/ProjectDeck.tsx:24-43`, `components/SiteShell.tsx:106-133`, `styles/globals.css:5-7`. Preserve these contracts while changing visuals.
- The deck already has keyboard-visible cards, previous/next controls, focus activation, swipe settling, and native links. Evidence: `components/ProjectDeck.tsx:23-62`. Any tactile refinement should keep inactive-card click-to-select and active-card navigation semantics.
- Play is implemented as five real dialog-based studies with range controls, motion comparison, portal toggle, body-scroll restoration and keyboard dismissal through native `<dialog>`. Evidence: `components/PlayLab.tsx:8-60`. About and Play currently use ordinary page layout plus Footer, so a lightweight route fade can be added without changing their content structure.
- Mobile screenshot at 390×844 keeps the lens, touch hint, project selector and scroll cue within the viewport; desktop screenshot at 1440×900 keeps the lens label and scene footer readable. Existing visual authority in `docs/DESIGN.md` supports preserving the current composition.
- Case pages use restrained image/card hover behavior and a shared next-project interaction; inspect `styles/pages.css` before adding motion so case worlds do not inherit the heavier home choreography.

## Recommended implementation order

1. Replace the fine-pointer dot with a CSS/native SVG arrow hotspot and keep a contextual compact badge as a separate transform follower; hide the entire cursor system on coarse/reduced-motion inputs.
2. Add a persistent, low-contrast scroll progress/cue owned by the shell; keep readiness as a separate one-shot loader.
3. Add a home-only `HomeChoreography` wrapper coordinating Hero → Explore → Work; leave Hero lens positioning and ProjectDeck drag transforms local.
4. Add a lightweight fade/veil for `/about` and `/play` navigation, keeping the image portal reserved for work routes.
5. Re-run desktop/mobile, keyboard, touch and reduced-motion checks, then inspect six case routes for accidental motion inheritance.
