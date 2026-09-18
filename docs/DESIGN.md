# IMANAKOV — exploration reveals the work

## Locked visual system
The five user-supplied images are the primary visual authority. This is one continuous portfolio, not five alternative landing pages. Warm white #f4f2ed, ink #0c0d0d, cold blue #dce5ef. A heavy grotesk becomes a graphic object; supporting type is quiet, uppercase, and small. Preserve the nearly viewport-wide IMANAKOV wordmark, circular reveal, WORK / ABOUT / PLAY navigation, light/dark pacing, tactile project collection, and portal into cases.

## Scenes and routes
`/`: warm hero with project-layer lens → dark typographic image windows → warm physical collection → blue experiment folders → quiet contact.
`/work/[slug]`: individual project world, factual context, actual archived work, visual detail, next project. No invented results or process.
`/play`: five working, keyboard-operable experiments; folder metaphor only here and the home teaser.
`/about`: grounded identity, capabilities, verified contact links.

## Implementation
Next.js App Router, strict TypeScript, server-rendered content and metadata. Small client islands own interaction. GSAP/ScrollTrigger own scene and gesture settling. Lenis only for desktop fine pointers without reduced motion. No WebGL, UI framework, copied competitor bundles, or external media at runtime.

Lens: a clipped underlying project surface with independently positioned typography and optical rim. Pointer zones crossfade real projects. Touch horizontal gesture changes projects while preserving vertical scroll. Project deck: overlapping perspective cards, horizontal swipe, accessible previous/next controls, focus reveals each card. Native links always provide a no-JS route.

Portal: chosen project image forms a vertical opening; opening expands around the route change; lock repeated activation until complete; timeout releases failed transitions. Returning to work restores the stored scroll context. Reduced motion navigates immediately.

## Motion and responsive rules
Micro 180–260ms, entrances 450–700ms, portal ~900ms. Controlled inertia, not elastic bounce. A single short scroll-driven dark reveal. No permanent offscreen animation loops. Every listener, observer, tween, and scrolling instance has cleanup. No fake loading delay; readiness indicator tracks critical image and font with bounded fallback.

Desktop references guide composition, mobile has separate sizing and a visible touch control. Check 320–1920px, portrait/landscape, keyboard, reduced motion, no-JS, direct case URLs, history and rapid navigation.

## Content boundary
Live imanakov.website showed Jino's suspended-hosting page on 2026-09-18. Factual fallback is the user's local `jack template/src/App.tsx` plus its `public/assets/cases/` imagery (May 2026 snapshot). Three featured built projects: Alliance Energy, Legacy Rheumatology, VPN Equipment Rental. Aurelia Atelier is explicitly an interface concept. No claim about present deployment, metrics, research, tenure, client endorsement, or awards. Case descriptions explain only visible artifacts. Preserve original URLs but do not imply current availability. Contact comes from that same source.
